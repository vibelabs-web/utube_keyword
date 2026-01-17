"""
Test cases for comment analysis API endpoints.
"""
import pytest
from httpx import AsyncClient
from unittest.mock import patch, AsyncMock


@pytest.mark.asyncio
class TestCommentAnalyze:
    """Test suite for /api/v1/comments/analyze endpoint"""

    async def test_analyze_comments_success(self, async_client: AsyncClient):
        """댓글 분석 성공 케이스"""
        # Mock YouTube API responses
        mock_video_details = {
            "video_id": "dQw4w9WgXcQ",
            "title": "Test Video Title",
            "description": "Test description",
            "channel_id": "UCTest123",
            "channel_title": "Test Channel",
            "published_at": "2024-01-01T00:00:00+00:00",
            "duration": "PT15M30S",
            "view_count": 15000,
            "like_count": 500,
            "comment_count": 342,
            "thumbnail_url": "https://example.com/thumb.jpg",
            "tags": ["test", "video"]
        }

        mock_comments = [
            {
                "comment_id": "comment_1",
                "text": "Great video!",
                "author_name": "User1",
                "author_channel_id": "UC123",
                "like_count": 10,
                "published_at": "2024-01-01T00:00:00+00:00",
                "updated_at": "2024-01-01T00:00:00+00:00",
                "reply_count": 2
            },
            {
                "comment_id": "comment_2",
                "text": "Very helpful!",
                "author_name": "User2",
                "author_channel_id": "UC456",
                "like_count": 5,
                "published_at": "2024-01-02T00:00:00+00:00",
                "updated_at": "2024-01-02T00:00:00+00:00",
                "reply_count": 0
            }
        ]

        with patch('app.services.comment_collector.YouTubeAPIClient') as mock_client_class:
            mock_client = AsyncMock()
            mock_client.__aenter__.return_value = mock_client
            mock_client.__aexit__.return_value = None
            mock_client.get_video_details.return_value = mock_video_details
            mock_client.get_video_comments.return_value = mock_comments
            mock_client_class.return_value = mock_client

            response = await async_client.post(
                "/api/v1/comments/analyze",
                json={"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
            )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "video_info" in data["data"]
        assert "frequent_words" in data["data"]
        assert "analyzed_at" in data["data"]

    async def test_analyze_comments_video_info(self, async_client: AsyncClient):
        """비디오 정보 검증"""
        mock_video_details = {
            "video_id": "dQw4w9WgXcQ",
            "title": "Python Tutorial",
            "description": "Learn Python",
            "channel_id": "UCTest123",
            "channel_title": "Code Channel",
            "published_at": "2024-01-01T00:00:00+00:00",
            "duration": "PT10M",
            "view_count": 10000,
            "like_count": 200,
            "comment_count": 150,
            "thumbnail_url": "https://example.com/thumb.jpg",
            "tags": []
        }

        mock_comments = [
            {
                "comment_id": "c1",
                "text": "Nice",
                "author_name": "User",
                "author_channel_id": "UC123",
                "like_count": 1,
                "published_at": "2024-01-01T00:00:00+00:00",
                "updated_at": "2024-01-01T00:00:00+00:00",
                "reply_count": 0
            }
        ]

        with patch('app.services.comment_collector.YouTubeAPIClient') as mock_client_class:
            mock_client = AsyncMock()
            mock_client.__aenter__.return_value = mock_client
            mock_client.__aexit__.return_value = None
            mock_client.get_video_details.return_value = mock_video_details
            mock_client.get_video_comments.return_value = mock_comments
            mock_client_class.return_value = mock_client

            response = await async_client.post(
                "/api/v1/comments/analyze",
                json={"video_url": "https://youtu.be/dQw4w9WgXcQ"}
            )

        assert response.status_code == 200
        video_info = response.json()["data"]["video_info"]
        assert video_info["video_id"] == "dQw4w9WgXcQ"
        assert video_info["title"] == "Python Tutorial"
        assert video_info["channel_title"] == "Code Channel"
        assert video_info["view_count"] == 10000
        assert video_info["comment_count"] == 150

    async def test_analyze_invalid_url(self, async_client: AsyncClient):
        """잘못된 URL 에러"""
        response = await async_client.post(
            "/api/v1/comments/analyze",
            json={"video_url": "https://example.com/not-youtube"}
        )
        assert response.status_code == 422

    async def test_analyze_missing_protocol(self, async_client: AsyncClient):
        """프로토콜 없는 URL"""
        response = await async_client.post(
            "/api/v1/comments/analyze",
            json={"video_url": "youtube.com/watch?v=dQw4w9WgXcQ"}
        )
        assert response.status_code == 422

    async def test_analyze_youtube_shortlink(self, async_client: AsyncClient):
        """youtu.be 짧은 링크 지원"""
        mock_video_details = {
            "video_id": "dQw4w9WgXcQ",
            "title": "Test",
            "description": "",
            "channel_id": "UC123",
            "channel_title": "Channel",
            "published_at": "2024-01-01T00:00:00+00:00",
            "duration": "PT5M",
            "view_count": 1000,
            "like_count": 50,
            "comment_count": 10,
            "thumbnail_url": "",
            "tags": []
        }

        mock_comments = []

        with patch('app.services.comment_collector.YouTubeAPIClient') as mock_client_class:
            mock_client = AsyncMock()
            mock_client.__aenter__.return_value = mock_client
            mock_client.__aexit__.return_value = None
            mock_client.get_video_details.return_value = mock_video_details
            mock_client.get_video_comments.return_value = mock_comments
            mock_client_class.return_value = mock_client

            response = await async_client.post(
                "/api/v1/comments/analyze",
                json={"video_url": "https://youtu.be/dQw4w9WgXcQ"}
            )

        assert response.status_code == 200

    async def test_analyze_embed_url(self, async_client: AsyncClient):
        """embed URL 지원"""
        mock_video_details = {
            "video_id": "dQw4w9WgXcQ",
            "title": "Test",
            "description": "",
            "channel_id": "UC123",
            "channel_title": "Channel",
            "published_at": "2024-01-01T00:00:00+00:00",
            "duration": "PT5M",
            "view_count": 1000,
            "like_count": 50,
            "comment_count": 10,
            "thumbnail_url": "",
            "tags": []
        }

        mock_comments = []

        with patch('app.services.comment_collector.YouTubeAPIClient') as mock_client_class:
            mock_client = AsyncMock()
            mock_client.__aenter__.return_value = mock_client
            mock_client.__aexit__.return_value = None
            mock_client.get_video_details.return_value = mock_video_details
            mock_client.get_video_comments.return_value = mock_comments
            mock_client_class.return_value = mock_client

            response = await async_client.post(
                "/api/v1/comments/analyze",
                json={"video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ"}
            )

        assert response.status_code == 200
