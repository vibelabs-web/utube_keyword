"""
Health check endpoint tests.
"""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_check(async_client: AsyncClient):
    """Test the health check endpoint."""
    response = await async_client.get("/")

    assert response.status_code == 200

    data = response.json()
    assert data["status"] == "ok"
    assert "message" in data
    assert "version" in data
    assert data["version"] == "0.1.0"


@pytest.mark.asyncio
async def test_health_check_response_structure(async_client: AsyncClient):
    """Test that health check returns the correct structure."""
    response = await async_client.get("/")

    assert response.status_code == 200

    data = response.json()
    required_keys = ["status", "message", "version"]

    for key in required_keys:
        assert key in data, f"Missing required key: {key}"


@pytest.mark.asyncio
async def test_health_check_content_type(async_client: AsyncClient):
    """Test that health check returns JSON content."""
    response = await async_client.get("/")

    assert response.status_code == 200
    assert "application/json" in response.headers["content-type"]
