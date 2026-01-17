"""
Keyword Analyzer Service
Analyzes YouTube keywords using search metrics, competition, and related keywords.
"""
import logging
import re
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.services.youtube import YouTubeAPIClient
from app.models.analysis import KeywordAnalysis

logger = logging.getLogger(__name__)


class KeywordAnalyzerService:
    """
    Service for analyzing YouTube keywords.

    Features:
    - Search volume estimation (based on YouTube search results)
    - Competition analysis (based on top videos' performance)
    - Recommendation score calculation
    - Related keyword extraction (5-10 keywords)
    - Database caching with 7-day TTL

    Constants:
    - CACHE_TTL_DAYS: How long to cache analysis results
    - MAX_SEARCH_RESULTS: Maximum videos to fetch for analysis
    - TOP_VIDEOS_FOR_COMPETITION: Top N videos to analyze for competition
    - MAX_RELATED_KEYWORDS: Maximum related keywords to return (10)
    - MIN_RELATED_KEYWORDS: Minimum related keywords to guarantee (5)
    - PHRASE_LENGTHS: Word lengths for phrase extraction (2-4 words)
    """

    CACHE_TTL_DAYS = 7
    MAX_SEARCH_RESULTS = 50
    TOP_VIDEOS_FOR_COMPETITION = 10
    MAX_RELATED_KEYWORDS = 10
    MIN_RELATED_KEYWORDS = 5
    PHRASE_LENGTHS = [2, 3, 4]

    # Related keyword estimation parameters
    VOLUME_MULTIPLIER = 100
    MAX_ESTIMATED_VOLUME = 5000
    BASE_COMPETITION = 0.3
    COMPETITION_INCREMENT = 0.05
    MAX_COMPETITION = 0.9

    def __init__(self, db: AsyncSession, youtube_client: YouTubeAPIClient):
        """
        Initialize analyzer with database session and YouTube client.

        Args:
            db: SQLAlchemy async session
            youtube_client: YouTube API client
        """
        self.db = db
        self.youtube_client = youtube_client

    async def analyze(self, keyword: str) -> Dict[str, Any]:
        """
        Analyze a keyword and return metrics with related keywords.

        Uses cache if available and not expired, otherwise performs fresh analysis.

        Args:
            keyword: Keyword to analyze

        Returns:
            Dict with structure:
            {
                "keyword": str,
                "metrics": {
                    "search_volume": int,
                    "competition": float,
                    "recommendation_score": float
                },
                "related_keywords": List[Dict],
                "analyzed_at": datetime
            }

        Raises:
            ValueError: If keyword is invalid
            YouTubeAPIError: If YouTube API fails
        """
        keyword = keyword.strip()
        if not keyword:
            raise ValueError("Keyword cannot be empty")

        # Check cache first
        cached = await self._get_cached_analysis(keyword)
        if cached and not cached.is_expired():
            logger.info(f"Returning cached analysis for keyword: {keyword}")
            return cached.to_dict()

        # Perform fresh analysis
        logger.info(f"Performing fresh analysis for keyword: {keyword}")
        async with self.youtube_client:
            # Get search results for the keyword
            search_results = await self.youtube_client.search_videos(
                query=keyword,
                max_results=self.MAX_SEARCH_RESULTS,
                order="relevance"
            )

            # Calculate metrics
            search_volume = await self._estimate_search_volume(keyword, search_results)
            competition = await self._calculate_competition(search_results)
            recommendation_score = self._calculate_recommendation_score(
                search_volume, competition
            )

            # Extract related keywords
            related_keywords = await self._extract_related_keywords(
                keyword, search_results
            )

        # Save to cache
        analysis_data = {
            "keyword": keyword,
            "search_volume": search_volume,
            "competition": competition,
            "recommendation_score": recommendation_score,
            "related_keywords": related_keywords,
            "analyzed_at": datetime.utcnow(),
        }

        await self._save_to_cache(analysis_data)

        return {
            "keyword": keyword,
            "metrics": {
                "search_volume": search_volume,
                "competition": competition,
                "recommendation_score": recommendation_score,
            },
            "related_keywords": related_keywords,
            "analyzed_at": analysis_data["analyzed_at"],
        }

    async def _get_cached_analysis(self, keyword: str) -> Optional[KeywordAnalysis]:
        """
        Retrieve cached analysis from database.

        Args:
            keyword: Keyword to lookup

        Returns:
            KeywordAnalysis model or None if not found
        """
        stmt = select(KeywordAnalysis).where(KeywordAnalysis.keyword == keyword)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def _save_to_cache(self, analysis_data: Dict[str, Any]) -> None:
        """
        Save or update analysis in database cache.

        Args:
            analysis_data: Analysis data to cache
        """
        # Check if already exists
        existing = await self._get_cached_analysis(analysis_data["keyword"])

        if existing:
            # Update existing record
            existing.search_volume = analysis_data["search_volume"]
            existing.competition = analysis_data["competition"]
            existing.recommendation_score = analysis_data["recommendation_score"]
            existing.related_keywords = analysis_data["related_keywords"]
            existing.analyzed_at = analysis_data["analyzed_at"]
            existing.expires_at = KeywordAnalysis.create_expires_at(self.CACHE_TTL_DAYS)
        else:
            # Create new record
            new_analysis = KeywordAnalysis(
                keyword=analysis_data["keyword"],
                search_volume=analysis_data["search_volume"],
                competition=analysis_data["competition"],
                recommendation_score=analysis_data["recommendation_score"],
                related_keywords=analysis_data["related_keywords"],
                analyzed_at=analysis_data["analyzed_at"],
                expires_at=KeywordAnalysis.create_expires_at(self.CACHE_TTL_DAYS),
            )
            self.db.add(new_analysis)

        await self.db.commit()

    async def _estimate_search_volume(
        self, keyword: str, search_results: List[Dict[str, Any]]
    ) -> int:
        """
        Estimate monthly search volume based on search results.

        Uses number of results and video ages to estimate popularity.

        Args:
            keyword: The search keyword
            search_results: List of video search results

        Returns:
            Estimated monthly search volume (integer)
        """
        if not search_results:
            return 0

        # Base volume on number of results found
        result_count = len(search_results)

        # Analyze video ages to estimate trend
        recent_videos = 0
        for video in search_results:
            published_at = video.get("published_at")
            if published_at:
                age_days = (datetime.utcnow().replace(tzinfo=None) -
                           published_at.replace(tzinfo=None)).days
                if age_days <= 30:  # Recent videos (last month)
                    recent_videos += 1

        # Estimate: Base volume from result count + bonus for recent content
        base_volume = result_count * 20  # Scale up result count
        trend_bonus = recent_videos * 50  # Bonus for recent uploads

        estimated_volume = base_volume + trend_bonus

        # Cap at reasonable maximum
        return min(estimated_volume, 100000)

    async def _calculate_competition(
        self, search_results: List[Dict[str, Any]]
    ) -> float:
        """
        Calculate competition level (0.0 to 1.0) based on top videos' performance.

        High competition = many videos with high views and established channels.

        Args:
            search_results: List of video search results

        Returns:
            Competition score (0.0 = low competition, 1.0 = high competition)
        """
        if not search_results:
            return 0.0

        # Analyze top videos (up to TOP_VIDEOS_FOR_COMPETITION)
        top_videos = search_results[:self.TOP_VIDEOS_FOR_COMPETITION]

        competition_scores = []
        for video in top_videos:
            video_id = video.get("video_id")
            if not video_id:
                continue

            try:
                # Get detailed video statistics
                details = await self.youtube_client.get_video_details(video_id)

                view_count = details.get("view_count", 0)
                like_count = details.get("like_count", 0)

                # Get channel info for subscriber count
                channel_id = details.get("channel_id")
                if channel_id:
                    try:
                        channel_info = await self.youtube_client.get_channel_info(channel_id)
                        subscriber_count = channel_info.get("subscriber_count", 0)
                    except Exception as e:
                        logger.warning(f"Failed to get channel info: {e}")
                        subscriber_count = 0
                else:
                    subscriber_count = 0

                # Calculate video age in days
                published_at = details.get("published_at")
                if published_at:
                    age_days = max(1, (datetime.utcnow().replace(tzinfo=None) -
                                      published_at.replace(tzinfo=None)).days)
                else:
                    age_days = 1

                # Normalize metrics
                views_per_day = view_count / age_days
                normalized_views = min(views_per_day / 10000, 1.0)  # Cap at 10k/day
                normalized_subs = min(subscriber_count / 1000000, 1.0)  # Cap at 1M subs
                normalized_engagement = min(like_count / view_count if view_count > 0 else 0, 0.1) * 10

                # Competition score for this video
                video_score = (
                    normalized_views * 0.5 +
                    normalized_subs * 0.3 +
                    normalized_engagement * 0.2
                )
                competition_scores.append(video_score)

            except Exception as e:
                logger.warning(f"Failed to analyze video {video_id}: {e}")
                continue

        if not competition_scores:
            return 0.5  # Medium competition if we couldn't analyze

        # Average competition across top videos
        avg_competition = sum(competition_scores) / len(competition_scores)

        return round(min(max(avg_competition, 0.0), 1.0), 2)

    def _calculate_recommendation_score(
        self, search_volume: int, competition: float
    ) -> float:
        """
        Calculate recommendation score (0.0 to 1.0).

        Formula: Higher search volume + Lower competition = Better opportunity

        Args:
            search_volume: Estimated monthly search volume
            competition: Competition level (0.0 to 1.0)

        Returns:
            Recommendation score (0.0 = poor, 1.0 = excellent)
        """
        # Normalize search volume (cap at 50k for scoring)
        normalized_volume = min(search_volume / 50000, 1.0)

        # Recommendation: 40% volume, 60% inverse competition
        # High volume + Low competition = High score
        score = (normalized_volume * 0.4) + ((1 - competition) * 0.6)

        return round(min(max(score, 0.0), 1.0), 2)

    async def _extract_related_keywords(
        self, keyword: str, search_results: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Extract related keywords from video titles.

        Analyzes video titles to find common phrases that could be alternative keywords.
        Ensures 5-10 high-quality related keywords are returned.

        Args:
            keyword: Original keyword
            search_results: List of video search results

        Returns:
            List of related keyword dicts with structure:
            {
                "keyword": str,
                "search_volume": int,
                "competition": float
            }
        """
        if not search_results:
            return self._generate_fallback_keywords(keyword)

        # Extract common phrases from video titles
        keyword_candidates = []
        keyword_frequency = {}
        keyword_lower = keyword.lower()

        for video in search_results:
            title = video.get("title", "")
            if not title:
                continue

            # Clean and normalize title
            title_lower = title.lower()

            # Extract phrases (2-4 words)
            words = self._tokenize_title(title_lower)
            for i in range(len(words)):
                for length in self.PHRASE_LENGTHS:
                    if i + length <= len(words):
                        phrase = " ".join(words[i:i + length])

                        # Filter: must be different from original, reasonable length
                        if self._is_valid_related_keyword(phrase, keyword_lower):
                            # Count frequency for ranking
                            keyword_frequency[phrase] = keyword_frequency.get(phrase, 0) + 1

        # Sort by frequency and get top candidates
        sorted_candidates = sorted(
            keyword_frequency.items(),
            key=lambda x: x[1],
            reverse=True
        )

        # Build related keywords list
        related = []
        for candidate, frequency in sorted_candidates[:self.MAX_RELATED_KEYWORDS]:
            # Estimate metrics based on frequency
            estimated_volume = min(
                frequency * self.VOLUME_MULTIPLIER,
                self.MAX_ESTIMATED_VOLUME
            )
            estimated_competition = min(
                self.BASE_COMPETITION + (frequency * self.COMPETITION_INCREMENT),
                self.MAX_COMPETITION
            )

            related.append({
                "keyword": candidate.strip(),
                "search_volume": estimated_volume,
                "competition": round(estimated_competition, 2),
            })

        # Ensure minimum required keywords
        if len(related) < self.MIN_RELATED_KEYWORDS:
            fallback = self._generate_fallback_keywords(
                keyword,
                exclude=set(r["keyword"] for r in related)
            )
            related.extend(fallback[:self.MIN_RELATED_KEYWORDS - len(related)])

        # Cap at maximum
        return related[:self.MAX_RELATED_KEYWORDS]

    def _tokenize_title(self, title: str) -> List[str]:
        """
        Tokenize video title into words.

        Handles mixed Korean/English text and filters out special characters.

        Args:
            title: Video title to tokenize

        Returns:
            List of words
        """
        # Remove special characters but keep Korean, English, numbers, spaces
        cleaned = re.sub(r'[^\w\s가-힣]', ' ', title)

        # Split and filter empty strings
        words = [w for w in cleaned.split() if len(w) > 0]

        return words

    def _is_valid_related_keyword(self, phrase: str, original_keyword: str) -> bool:
        """
        Check if a phrase is valid as a related keyword.

        Args:
            phrase: Candidate phrase
            original_keyword: Original keyword (lowercase)

        Returns:
            True if valid, False otherwise
        """
        phrase = phrase.strip()

        # Length checks
        if len(phrase) < 2 or len(phrase) > 50:
            return False

        # Must not be exactly the original keyword
        if phrase == original_keyword:
            return False

        # Must not contain the original keyword as substring
        if original_keyword in phrase:
            return False

        # Must have at least some meaningful content
        if phrase.replace(" ", "").isdigit():
            return False

        return True

    def _generate_fallback_keywords(
        self, keyword: str, exclude: set = None
    ) -> List[Dict[str, Any]]:
        """
        Generate fallback related keywords when not enough can be extracted.

        Uses common keyword patterns for YouTube content.

        Args:
            keyword: Original keyword
            exclude: Set of keywords to exclude

        Returns:
            List of fallback related keywords
        """
        if exclude is None:
            exclude = set()

        # Common suffixes/prefixes for YouTube keywords
        patterns = [
            f"{keyword} 강의",
            f"{keyword} 튜토리얼",
            f"{keyword} 기초",
            f"{keyword} 입문",
            f"{keyword} 배우기",
            f"{keyword} 초보",
            f"{keyword} 강좌",
            f"{keyword} 설명",
            f"{keyword} 예제",
            f"{keyword} 실습",
        ]

        fallback = []
        for pattern in patterns:
            pattern_lower = pattern.lower()
            if pattern_lower not in exclude and pattern_lower != keyword.lower():
                fallback.append({
                    "keyword": pattern,
                    "search_volume": 100,
                    "competition": 0.5,
                })

        return fallback
