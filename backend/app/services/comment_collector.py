"""
Comment Collection Service

Collects and processes YouTube video comments for analysis.
"""
from datetime import datetime
import re
import logging
from typing import List, Dict, Any

from app.services.youtube import YouTubeAPIClient, YouTubeAPIError
from app.services.comment_analyzer import CommentAnalyzerService
from app.schemas.comment import VideoInfo, CommentAnalyzeResponse

logger = logging.getLogger(__name__)


class CommentCollectorService:
    """
    Service for collecting YouTube comments and preparing analysis data.

    This service handles:
    - Extracting video ID from various YouTube URL formats
    - Fetching video details via YouTube Data API
    - Collecting comments (max 100 for T2.1)
    - Preparing data structure for analysis (T2.2)
    """

    # YouTube video ID is always 11 characters
    VIDEO_ID_LENGTH = 11

    def __init__(self):
        """Initialize the comment collector service."""
        self.analyzer = CommentAnalyzerService()

    async def collect_comments(self, video_url: str) -> CommentAnalyzeResponse:
        """
        Collect comments from a YouTube video and prepare analysis response.

        Args:
            video_url: YouTube video URL (validated by Pydantic schema)

        Returns:
            CommentAnalyzeResponse with video info and empty analysis fields

        Raises:
            ValueError: If video ID cannot be extracted or video not found
            YouTubeAPIError: If API request fails
        """
        # Extract video ID from URL
        video_id = self._extract_video_id(video_url)
        logger.info(f"Extracting video ID: {video_id} from URL: {video_url}")

        async with YouTubeAPIClient() as client:
            # 1. Fetch video details
            video_details = await client.get_video_details(video_id)
            logger.info(f"Fetched video details: {video_details['title']}")

            # 2. Collect comments (max 100 for API quota efficiency)
            comments = await client.get_video_comments(
                video_id,
                max_results=100,
                order="relevance"
            )
            logger.info(f"Collected {len(comments)} comments for video {video_id}")

            # 3. Build VideoInfo schema
            video_info = VideoInfo(
                video_id=video_id,
                title=video_details["title"],
                channel_title=video_details["channel_title"],
                view_count=video_details["view_count"],
                comment_count=video_details["comment_count"]
            )

            # 4. Analyze comments (T2.2)
            analysis = await self.analyzer.analyze_all(comments)
            logger.info(f"Text analysis completed for {len(comments)} comments")

            # 5. Return complete analysis response
            return CommentAnalyzeResponse(
                video_info=video_info,
                frequent_words=analysis["frequent_words"],
                viewer_requests=analysis["viewer_requests"],
                viewer_questions=analysis["viewer_questions"],
                top_comments=analysis["top_comments"],
                sentiment=analysis["sentiment"],
                analyzed_at=datetime.utcnow()
            )

    def _extract_video_id(self, url: str) -> str:
        """
        Extract YouTube video ID from various URL formats.

        Supported formats:
        - https://www.youtube.com/watch?v=VIDEO_ID
        - https://youtube.com/watch?v=VIDEO_ID
        - https://youtu.be/VIDEO_ID
        - https://www.youtube.com/embed/VIDEO_ID
        - https://m.youtube.com/watch?v=VIDEO_ID

        Args:
            url: YouTube video URL

        Returns:
            11-character video ID

        Raises:
            ValueError: If video ID cannot be extracted
        """
        url = url.strip()

        # YouTube URL patterns
        patterns = [
            # Standard watch URL: youtube.com/watch?v=VIDEO_ID
            r'(?:https?://)?(?:www\.)?youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})',
            # Short URL: youtu.be/VIDEO_ID
            r'(?:https?://)?youtu\.be/([a-zA-Z0-9_-]{11})',
            # Embed URL: youtube.com/embed/VIDEO_ID
            r'(?:https?://)?(?:www\.)?youtube\.com/embed/([a-zA-Z0-9_-]{11})',
            # Mobile URL: m.youtube.com/watch?v=VIDEO_ID
            r'(?:https?://)?m\.youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})',
        ]

        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                video_id = match.group(1)
                # Validate video ID length
                if len(video_id) == self.VIDEO_ID_LENGTH:
                    return video_id

        # If no pattern matched, raise error
        raise ValueError(
            f"Invalid YouTube URL: {url}. "
            "Supported formats: youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/..."
        )
