"""
API endpoint tests for keywords and comments analysis.
"""
import pytest
from httpx import AsyncClient


class TestKeywordEndpoint:
    """Tests for keyword analysis endpoint."""

    @pytest.mark.asyncio
    async def test_keyword_analyze_endpoint_exists(self, async_client: AsyncClient):
        """Test that the keyword analyze endpoint exists."""
        response = await async_client.post(
            "/api/v1/keywords/analyze",
            json={"keyword": "test keyword"}
        )
        # Should return 501 (Not Implemented) or 200, not 404
        assert response.status_code in [200, 501]

    @pytest.mark.asyncio
    async def test_keyword_analyze_invalid_payload(self, async_client: AsyncClient):
        """Test keyword endpoint with invalid payload."""
        response = await async_client.post(
            "/api/v1/keywords/analyze",
            json={}
        )
        # Should return 422 (Validation Error)
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_keyword_analyze_empty_keyword(self, async_client: AsyncClient):
        """Test keyword endpoint with empty keyword."""
        response = await async_client.post(
            "/api/v1/keywords/analyze",
            json={"keyword": ""}
        )
        # Should return 422 (Validation Error)
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_keyword_analyze_too_long_keyword(self, async_client: AsyncClient):
        """Test keyword endpoint with keyword exceeding max length."""
        long_keyword = "a" * 101  # Max is 100 characters
        response = await async_client.post(
            "/api/v1/keywords/analyze",
            json={"keyword": long_keyword}
        )
        # Should return 422 (Validation Error)
        assert response.status_code == 422


class TestCommentEndpoint:
    """Tests for comment analysis endpoint."""

    @pytest.mark.asyncio
    async def test_comment_analyze_endpoint_exists(self, async_client: AsyncClient):
        """Test that the comment analyze endpoint exists."""
        response = await async_client.post(
            "/api/v1/comments/analyze",
            json={"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
        )
        # Should return 501 (Not Implemented) or 200, not 404
        assert response.status_code in [200, 501]

    @pytest.mark.asyncio
    async def test_comment_analyze_invalid_payload(self, async_client: AsyncClient):
        """Test comment endpoint with invalid payload."""
        response = await async_client.post(
            "/api/v1/comments/analyze",
            json={}
        )
        # Should return 422 (Validation Error)
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_comment_analyze_invalid_url(self, async_client: AsyncClient):
        """Test comment endpoint with invalid URL."""
        response = await async_client.post(
            "/api/v1/comments/analyze",
            json={"video_url": "not-a-valid-url"}
        )
        # Should return 422 (Validation Error)
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_comment_analyze_valid_youtube_urls(self, async_client: AsyncClient):
        """Test comment endpoint with various valid YouTube URL formats."""
        valid_urls = [
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "https://youtu.be/dQw4w9WgXcQ",
            "https://www.youtube.com/embed/dQw4w9WgXcQ",
        ]

        for url in valid_urls:
            response = await async_client.post(
                "/api/v1/comments/analyze",
                json={"video_url": url}
            )
            # Should not return 422 (Validation Error) for valid URLs
            assert response.status_code != 422, f"Failed for URL: {url}"


class TestOpenAPISpec:
    """Tests for OpenAPI documentation."""

    @pytest.mark.asyncio
    async def test_openapi_json_available(self, async_client: AsyncClient):
        """Test that OpenAPI JSON spec is available."""
        response = await async_client.get("/openapi.json")
        assert response.status_code == 200
        assert response.headers["content-type"] == "application/json"

        data = response.json()
        assert "openapi" in data
        assert "info" in data
        assert "paths" in data

    @pytest.mark.asyncio
    async def test_docs_page_available(self, async_client: AsyncClient):
        """Test that Swagger UI docs page is available."""
        response = await async_client.get("/docs")
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]

    @pytest.mark.asyncio
    async def test_redoc_page_available(self, async_client: AsyncClient):
        """Test that ReDoc page is available."""
        response = await async_client.get("/redoc")
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]
