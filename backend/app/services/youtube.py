"""
YouTube Data API v3 Service
Provides async interface to YouTube API for video search, details, comments, and channel info.
"""

from typing import Optional, List, Dict, Any
import httpx
from datetime import datetime, timezone
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


class YouTubeAPIError(Exception):
    """Base exception for YouTube API errors"""
    pass


class YouTubeAPIKeyError(YouTubeAPIError):
    """Raised when API key is missing or invalid"""
    pass


class YouTubeQuotaExceededError(YouTubeAPIError):
    """Raised when API quota is exceeded"""
    pass


class YouTubeAPIClient:
    """
    Async client for YouTube Data API v3

    Uses httpx for async HTTP requests and implements retry logic.
    """

    BASE_URL = "https://www.googleapis.com/youtube/v3"
    MAX_RETRIES = 3
    TIMEOUT = 30.0

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize YouTube API client

        Args:
            api_key: YouTube Data API v3 key. If not provided, uses settings.YOUTUBE_API_KEY

        Raises:
            YouTubeAPIKeyError: If API key is not configured
        """
        self.api_key = api_key or settings.YOUTUBE_API_KEY

        if not self.api_key:
            raise YouTubeAPIKeyError(
                "YouTube API key not configured. "
                "Set YOUTUBE_API_KEY in .env or pass api_key parameter."
            )

        self.client: Optional[httpx.AsyncClient] = None

    async def __aenter__(self):
        """Context manager entry - create HTTP client"""
        self.client = httpx.AsyncClient(
            timeout=httpx.Timeout(self.TIMEOUT),
            follow_redirects=True
        )
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit - close HTTP client"""
        if self.client:
            await self.client.aclose()

    async def _make_request(
        self,
        endpoint: str,
        params: Dict[str, Any],
        retry_count: int = 0
    ) -> Dict[str, Any]:
        """
        Make HTTP request to YouTube API with retry logic

        Args:
            endpoint: API endpoint (e.g., 'search', 'videos')
            params: Query parameters
            retry_count: Current retry attempt number

        Returns:
            JSON response as dict

        Raises:
            YouTubeAPIError: On API errors
            YouTubeQuotaExceededError: On quota exceeded
        """
        if not self.client:
            raise YouTubeAPIError("Client not initialized. Use async context manager.")

        url = f"{self.BASE_URL}/{endpoint}"
        params["key"] = self.api_key

        try:
            response = await self.client.get(url, params=params)

            # Handle quota exceeded
            if response.status_code == 403:
                error_data = response.json()
                if "quotaExceeded" in str(error_data):
                    raise YouTubeQuotaExceededError(
                        "YouTube API quota exceeded. Please try again later."
                    )

            # Handle other errors
            if response.status_code >= 400:
                error_msg = f"YouTube API error: {response.status_code}"
                try:
                    error_data = response.json()
                    if "error" in error_data:
                        error_msg = error_data["error"].get("message", error_msg)
                except Exception:
                    pass
                raise YouTubeAPIError(error_msg)

            response.raise_for_status()
            return response.json()

        except (httpx.TimeoutException, httpx.NetworkError) as e:
            # Retry on network errors
            if retry_count < self.MAX_RETRIES:
                logger.warning(
                    f"Network error on attempt {retry_count + 1}/{self.MAX_RETRIES}: {e}"
                )
                return await self._make_request(endpoint, params, retry_count + 1)
            raise YouTubeAPIError(f"Network error after {self.MAX_RETRIES} retries: {e}")

        except YouTubeAPIError:
            raise

        except Exception as e:
            raise YouTubeAPIError(f"Unexpected error: {e}")

    async def search_videos(
        self,
        query: str,
        max_results: int = 10,
        order: str = "relevance"
    ) -> List[Dict[str, Any]]:
        """
        Search for YouTube videos by keyword

        Args:
            query: Search query string
            max_results: Maximum number of results (1-50, default 10)
            order: Sort order (relevance, date, rating, viewCount, title)

        Returns:
            List of video info dicts with keys:
            - video_id: str
            - title: str
            - description: str
            - channel_id: str
            - channel_title: str
            - published_at: datetime
            - thumbnail_url: str

        Raises:
            YouTubeAPIError: On API errors
        """
        if not query or not query.strip():
            raise ValueError("Query cannot be empty")

        if not 1 <= max_results <= 50:
            raise ValueError("max_results must be between 1 and 50")

        params = {
            "part": "snippet",
            "q": query.strip(),
            "type": "video",
            "maxResults": max_results,
            "order": order,
        }

        data = await self._make_request("search", params)

        results = []
        for item in data.get("items", []):
            video_id = item["id"].get("videoId")
            snippet = item.get("snippet", {})

            if not video_id:
                continue

            # Parse published_at
            published_str = snippet.get("publishedAt", "")
            try:
                published_at = datetime.fromisoformat(
                    published_str.replace("Z", "+00:00")
                )
            except Exception:
                published_at = datetime.now(timezone.utc)

            results.append({
                "video_id": video_id,
                "title": snippet.get("title", ""),
                "description": snippet.get("description", ""),
                "channel_id": snippet.get("channelId", ""),
                "channel_title": snippet.get("channelTitle", ""),
                "published_at": published_at,
                "thumbnail_url": snippet.get("thumbnails", {})
                    .get("high", {})
                    .get("url", ""),
            })

        return results

    async def get_video_details(self, video_id: str) -> Dict[str, Any]:
        """
        Get detailed information about a specific video

        Args:
            video_id: YouTube video ID

        Returns:
            Dict with video details:
            - video_id: str
            - title: str
            - description: str
            - channel_id: str
            - channel_title: str
            - published_at: datetime
            - duration: str (ISO 8601 format, e.g., PT15M30S)
            - view_count: int
            - like_count: int
            - comment_count: int
            - thumbnail_url: str
            - tags: List[str]

        Raises:
            YouTubeAPIError: On API errors
            ValueError: If video not found
        """
        if not video_id or not video_id.strip():
            raise ValueError("video_id cannot be empty")

        params = {
            "part": "snippet,contentDetails,statistics",
            "id": video_id.strip(),
        }

        data = await self._make_request("videos", params)

        items = data.get("items", [])
        if not items:
            raise ValueError(f"Video not found: {video_id}")

        item = items[0]
        snippet = item.get("snippet", {})
        content_details = item.get("contentDetails", {})
        statistics = item.get("statistics", {})

        # Parse published_at
        published_str = snippet.get("publishedAt", "")
        try:
            published_at = datetime.fromisoformat(
                published_str.replace("Z", "+00:00")
            )
        except Exception:
            published_at = datetime.now(timezone.utc)

        return {
            "video_id": item.get("id", video_id),
            "title": snippet.get("title", ""),
            "description": snippet.get("description", ""),
            "channel_id": snippet.get("channelId", ""),
            "channel_title": snippet.get("channelTitle", ""),
            "published_at": published_at,
            "duration": content_details.get("duration", ""),
            "view_count": int(statistics.get("viewCount", 0)),
            "like_count": int(statistics.get("likeCount", 0)),
            "comment_count": int(statistics.get("commentCount", 0)),
            "thumbnail_url": snippet.get("thumbnails", {})
                .get("high", {})
                .get("url", ""),
            "tags": snippet.get("tags", []),
        }

    async def get_video_comments(
        self,
        video_id: str,
        max_results: int = 100,
        order: str = "relevance"
    ) -> List[Dict[str, Any]]:
        """
        Get comments for a specific video

        Args:
            video_id: YouTube video ID
            max_results: Maximum number of comments (1-100, default 100)
            order: Sort order (time, relevance)

        Returns:
            List of comment dicts with keys:
            - comment_id: str
            - text: str
            - author_name: str
            - author_channel_id: str
            - like_count: int
            - published_at: datetime
            - updated_at: datetime
            - reply_count: int

        Raises:
            YouTubeAPIError: On API errors
        """
        if not video_id or not video_id.strip():
            raise ValueError("video_id cannot be empty")

        if not 1 <= max_results <= 100:
            raise ValueError("max_results must be between 1 and 100")

        params = {
            "part": "snippet",
            "videoId": video_id.strip(),
            "maxResults": max_results,
            "order": order,
            "textFormat": "plainText",
        }

        try:
            data = await self._make_request("commentThreads", params)
        except YouTubeAPIError as e:
            # Comments might be disabled
            if "disabled" in str(e).lower():
                logger.info(f"Comments disabled for video: {video_id}")
                return []
            raise

        results = []
        for item in data.get("items", []):
            snippet = item.get("snippet", {})
            top_comment = snippet.get("topLevelComment", {})
            comment_snippet = top_comment.get("snippet", {})

            comment_id = top_comment.get("id", "")

            # Parse timestamps
            published_str = comment_snippet.get("publishedAt", "")
            updated_str = comment_snippet.get("updatedAt", "")

            try:
                published_at = datetime.fromisoformat(
                    published_str.replace("Z", "+00:00")
                )
            except Exception:
                published_at = datetime.now(timezone.utc)

            try:
                updated_at = datetime.fromisoformat(
                    updated_str.replace("Z", "+00:00")
                )
            except Exception:
                updated_at = published_at

            results.append({
                "comment_id": comment_id,
                "text": comment_snippet.get("textDisplay", ""),
                "author_name": comment_snippet.get("authorDisplayName", ""),
                "author_channel_id": comment_snippet.get("authorChannelId", {})
                    .get("value", ""),
                "like_count": int(comment_snippet.get("likeCount", 0)),
                "published_at": published_at,
                "updated_at": updated_at,
                "reply_count": int(snippet.get("totalReplyCount", 0)),
            })

        return results

    async def get_channel_info(self, channel_id: str) -> Dict[str, Any]:
        """
        Get information about a YouTube channel

        Args:
            channel_id: YouTube channel ID

        Returns:
            Dict with channel info:
            - channel_id: str
            - title: str
            - description: str
            - custom_url: str
            - published_at: datetime
            - thumbnail_url: str
            - subscriber_count: int
            - video_count: int
            - view_count: int

        Raises:
            YouTubeAPIError: On API errors
            ValueError: If channel not found
        """
        if not channel_id or not channel_id.strip():
            raise ValueError("channel_id cannot be empty")

        params = {
            "part": "snippet,statistics",
            "id": channel_id.strip(),
        }

        data = await self._make_request("channels", params)

        items = data.get("items", [])
        if not items:
            raise ValueError(f"Channel not found: {channel_id}")

        item = items[0]
        snippet = item.get("snippet", {})
        statistics = item.get("statistics", {})

        # Parse published_at
        published_str = snippet.get("publishedAt", "")
        try:
            published_at = datetime.fromisoformat(
                published_str.replace("Z", "+00:00")
            )
        except Exception:
            published_at = datetime.now(timezone.utc)

        return {
            "channel_id": item.get("id", channel_id),
            "title": snippet.get("title", ""),
            "description": snippet.get("description", ""),
            "custom_url": snippet.get("customUrl", ""),
            "published_at": published_at,
            "thumbnail_url": snippet.get("thumbnails", {})
                .get("high", {})
                .get("url", ""),
            "subscriber_count": int(statistics.get("subscriberCount", 0)),
            "video_count": int(statistics.get("videoCount", 0)),
            "view_count": int(statistics.get("viewCount", 0)),
        }

    async def check_quota(self) -> Dict[str, Any]:
        """
        Check API quota status by making a minimal API call

        Returns:
            Dict with quota info:
            - available: bool (True if API is accessible)
            - message: str

        Raises:
            YouTubeQuotaExceededError: If quota is exceeded
        """
        try:
            # Make minimal request (costs 1 unit)
            params = {
                "part": "id",
                "maxResults": 1,
            }
            await self._make_request("videos", params)

            return {
                "available": True,
                "message": "YouTube API is accessible"
            }

        except YouTubeQuotaExceededError:
            return {
                "available": False,
                "message": "YouTube API quota exceeded"
            }

        except YouTubeAPIError as e:
            return {
                "available": False,
                "message": f"YouTube API error: {str(e)}"
            }


# Singleton instance for dependency injection
_youtube_client: Optional[YouTubeAPIClient] = None


def get_youtube_client() -> YouTubeAPIClient:
    """
    Dependency injection function for FastAPI

    Returns:
        YouTubeAPIClient instance
    """
    global _youtube_client
    if _youtube_client is None:
        _youtube_client = YouTubeAPIClient()
    return _youtube_client
