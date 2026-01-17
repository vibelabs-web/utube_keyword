"""
Integration tests for comment analysis API with text analysis

Tests the complete workflow:
1. Comment collection
2. Text analysis (frequent words, requests, sentiment)
3. API response validation
"""
import pytest
from httpx import AsyncClient
from unittest.mock import Mock, AsyncMock, patch


@pytest.mark.asyncio
class TestCommentAnalysisIntegration:
    """Test complete comment analysis workflow."""

    @pytest.fixture
    def mock_youtube_video_details(self):
        """Mock YouTube video details response."""
        return {
            "title": "파이썬 기초 강의",
            "channel_title": "코딩 채널",
            "view_count": 10000,
            "comment_count": 50
        }

    @pytest.fixture
    def mock_youtube_comments(self):
        """Mock YouTube comments with diverse content."""
        return [
            {"text": "정말 좋은 영상이에요! 감사합니다", "like_count": 50, "author": "user1"},
            {"text": "다음에는 클래스 강의 해주세요!", "like_count": 100, "author": "user2"},
            {"text": "너무 유익해요 추천합니다", "like_count": 30, "author": "user3"},
            {"text": "설명이 아주 좋네요", "like_count": 25, "author": "user4"},
            {"text": "별로에요 실망입니다", "like_count": 5, "author": "user5"},
            {"text": "리스트 강의도 올려주세요!", "like_count": 80, "author": "user6"},
            {"text": "좋은 강의 감사합니다", "like_count": 40, "author": "user7"},
            {"text": "최고예요 훌륭합니다", "like_count": 35, "author": "user8"},
        ]

    async def test_analyze_comments_with_text_analysis(
        self,
        async_client: AsyncClient,
        mock_youtube_video_details,
        mock_youtube_comments
    ):
        """Test comment analysis with complete text analysis."""

        with patch("app.services.comment_collector.YouTubeAPIClient") as MockClient:
            # Setup mock
            mock_instance = AsyncMock()
            mock_instance.__aenter__.return_value = mock_instance
            mock_instance.__aexit__.return_value = None
            mock_instance.get_video_details.return_value = mock_youtube_video_details
            mock_instance.get_video_comments.return_value = mock_youtube_comments
            MockClient.return_value = mock_instance

            # Make request
            response = await async_client.post(
                "/api/v1/comments/analyze",
                json={"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
            )

            # Validate response
            assert response.status_code == 200
            data = response.json()

            assert data["success"] is True
            assert data["data"] is not None

            # Check video info
            video_info = data["data"]["video_info"]
            assert video_info["video_id"] == "dQw4w9WgXcQ"
            assert video_info["title"] == "파이썬 기초 강의"
            assert video_info["channel_title"] == "코딩 채널"

            # Check frequent words
            frequent_words = data["data"]["frequent_words"]
            assert len(frequent_words) > 0
            # Should contain words like "강의", "좋은", etc.
            words = [w["word"] for w in frequent_words]
            assert any("강의" in word for word in words)

            # Validate frequent word structure
            for word_data in frequent_words:
                assert "word" in word_data
                assert "count" in word_data
                assert "percentage" in word_data
                assert word_data["count"] > 0
                assert 0 <= word_data["percentage"] <= 100

            # Check viewer requests
            viewer_requests = data["data"]["viewer_requests"]
            assert len(viewer_requests) > 0
            # Should detect "해주세요" patterns
            assert any("해주세요" in req["text"] for req in viewer_requests)

            # Validate request structure
            for request in viewer_requests:
                assert "text" in request
                assert "like_count" in request
                assert "author" in request

            # Requests should be sorted by like_count
            likes = [r["like_count"] for r in viewer_requests]
            assert likes == sorted(likes, reverse=True)

            # Check sentiment
            sentiment = data["data"]["sentiment"]
            assert sentiment is not None
            assert "positive" in sentiment
            assert "neutral" in sentiment
            assert "negative" in sentiment
            assert "total_analyzed" in sentiment

            # Validate sentiment ratios
            assert 0 <= sentiment["positive"] <= 1
            assert 0 <= sentiment["neutral"] <= 1
            assert 0 <= sentiment["negative"] <= 1

            # Sum should be close to 1.0
            total_ratio = sentiment["positive"] + sentiment["neutral"] + sentiment["negative"]
            assert abs(total_ratio - 1.0) <= 0.02

            # Should analyze all comments
            assert sentiment["total_analyzed"] == len(mock_youtube_comments)

            # Given the mock comments (mostly positive), positive should be highest
            assert sentiment["positive"] > sentiment["negative"]

    async def test_empty_comments_analysis(self, async_client: AsyncClient):
        """Test analysis with no comments."""

        with patch("app.services.comment_collector.YouTubeAPIClient") as MockClient:
            # Setup mock with no comments
            mock_instance = AsyncMock()
            mock_instance.__aenter__.return_value = mock_instance
            mock_instance.__aexit__.return_value = None
            mock_instance.get_video_details.return_value = {
                "video_id": "dQw4w9WgXcQ",
                "title": "Test Video",
                "channel_title": "Test Channel",
                "view_count": 1000,
                "comment_count": 0
            }
            mock_instance.get_video_comments.return_value = []
            MockClient.return_value = mock_instance

            response = await async_client.post(
                "/api/v1/comments/analyze",
                json={"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
            )

            assert response.status_code == 200
            data = response.json()

            # Should return empty analysis
            assert data["data"]["frequent_words"] == []
            assert data["data"]["viewer_requests"] == []

            # Sentiment should be all zeros
            sentiment = data["data"]["sentiment"]
            assert sentiment["total_analyzed"] == 0
            assert sentiment["positive"] == 0
            assert sentiment["neutral"] == 0
            assert sentiment["negative"] == 0

    async def test_sentiment_accuracy(self, async_client: AsyncClient):
        """Test sentiment analysis accuracy with clear positive/negative comments."""

        positive_comments = [
            {"text": "최고예요 정말 좋아요", "like_count": 10, "author": "user1"},
            {"text": "감사합니다 훌륭해요", "like_count": 20, "author": "user2"},
            {"text": "완벽합니다 추천해요", "like_count": 15, "author": "user3"},
        ]

        negative_comments = [
            {"text": "별로에요 실망입니다", "like_count": 5, "author": "user4"},
            {"text": "최악이네요 후회됩니다", "like_count": 3, "author": "user5"},
        ]

        with patch("app.services.comment_collector.YouTubeAPIClient") as MockClient:
            mock_instance = AsyncMock()
            mock_instance.__aenter__.return_value = mock_instance
            mock_instance.__aexit__.return_value = None
            mock_instance.get_video_details.return_value = {
                "video_id": "dQw4w9WgXcQ",
                "title": "Test Video",
                "channel_title": "Test Channel",
                "view_count": 1000,
                "comment_count": 5
            }
            mock_instance.get_video_comments.return_value = positive_comments + negative_comments
            MockClient.return_value = mock_instance

            response = await async_client.post(
                "/api/v1/comments/analyze",
                json={"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
            )

            assert response.status_code == 200
            data = response.json()

            sentiment = data["data"]["sentiment"]

            # Should detect 3 positive, 2 negative
            # positive ratio = 3/5 = 0.6
            # negative ratio = 2/5 = 0.4
            assert sentiment["positive"] == 0.6
            assert sentiment["negative"] == 0.4
            assert sentiment["neutral"] == 0.0
            assert sentiment["total_analyzed"] == 5
