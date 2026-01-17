"""
Test fixtures and configuration for pytest.
"""
import os
import pytest
import pytest_asyncio
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from httpx import AsyncClient, ASGITransport

from app.db.base import Base
from app.core.config import Settings
from main import app


# Test database URL - use in-memory SQLite
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture(scope="session")
def test_settings():
    """Override settings for testing."""
    import os
    os.environ["YOUTUBE_API_KEY"] = "test-youtube-api-key"
    return Settings(
        DATABASE_URL=TEST_DATABASE_URL,
        SECRET_KEY="test-secret-key-for-testing-only",
        YOUTUBE_API_KEY="test-youtube-api-key",
        CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"],
    )


@pytest_asyncio.fixture(scope="function")
async def test_db_engine():
    """Create a test database engine."""
    engine = create_async_engine(
        TEST_DATABASE_URL,
        echo=False,
        connect_args={"check_same_thread": False}
    )

    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield engine

    # Drop all tables after test
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

    await engine.dispose()


@pytest_asyncio.fixture(scope="function")
async def db_session(test_db_engine) -> AsyncGenerator[AsyncSession, None]:
    """Create a test database session."""
    async_session_maker = async_sessionmaker(
        test_db_engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autocommit=False,
        autoflush=False,
    )

    async with async_session_maker() as session:
        yield session
        await session.rollback()


@pytest_asyncio.fixture(scope="function")
async def async_client(test_settings, test_db_engine) -> AsyncGenerator[AsyncClient, None]:
    """
    Create an async test client for FastAPI app.
    This fixture overrides the database dependency to use the test database.
    """
    from app.core.database import get_db
    from app.services.youtube import get_youtube_client
    from unittest.mock import AsyncMock
    from datetime import datetime, timezone

    # Override settings
    app.dependency_overrides = {}

    # Override database dependency
    async def override_get_db():
        async_session_maker = async_sessionmaker(
            test_db_engine,
            class_=AsyncSession,
            expire_on_commit=False,
            autocommit=False,
            autoflush=False,
        )
        async with async_session_maker() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise
            finally:
                await session.close()

    # Override YouTube API client dependency
    mock_youtube_client = AsyncMock()
    mock_youtube_client.__aenter__.return_value = mock_youtube_client
    mock_youtube_client.__aexit__.return_value = None

    # Mock search results
    mock_youtube_client.search_videos.return_value = [
        {
            "video_id": f"test_video_{i}",
            "title": f"Test Video Title {i}",
            "description": "Test description",
            "channel_id": f"channel_{i}",
            "channel_title": f"Channel {i}",
            "published_at": datetime(2024, 1, 15, tzinfo=timezone.utc),
            "thumbnail_url": "https://example.com/thumb.jpg"
        }
        for i in range(10)
    ]

    # Mock video details
    mock_youtube_client.get_video_details.return_value = {
        "video_id": "test_video_0",
        "title": "Test Video Title",
        "description": "Test description",
        "channel_id": "channel_0",
        "channel_title": "Channel 0",
        "published_at": datetime(2024, 1, 15, tzinfo=timezone.utc),
        "duration": "PT15M30S",
        "view_count": 10000,
        "like_count": 500,
        "comment_count": 100,
        "thumbnail_url": "https://example.com/thumb.jpg",
        "tags": ["test", "video"]
    }

    # Mock channel info
    mock_youtube_client.get_channel_info.return_value = {
        "channel_id": "channel_0",
        "title": "Channel 0",
        "description": "Test channel",
        "custom_url": "@testchannel",
        "published_at": datetime(2023, 1, 1, tzinfo=timezone.utc),
        "thumbnail_url": "https://example.com/channel.jpg",
        "subscriber_count": 50000,
        "video_count": 100,
        "view_count": 1000000
    }

    def override_get_youtube_client():
        return mock_youtube_client

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_youtube_client] = override_get_youtube_client

    # Create test client
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://testserver"
    ) as client:
        yield client

    # Clean up overrides
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def mock_youtube_api_response():
    """Mock YouTube API response for testing."""
    return {
        "items": [
            {
                "id": {"videoId": "test_video_id"},
                "snippet": {
                    "title": "Test Video Title",
                    "description": "Test video description",
                    "channelTitle": "Test Channel",
                    "publishedAt": "2024-01-01T00:00:00Z"
                },
                "statistics": {
                    "viewCount": "1000",
                    "likeCount": "100",
                    "commentCount": "50"
                }
            }
        ]
    }


@pytest.fixture(scope="function")
def mock_comments_data():
    """Mock YouTube comments data for testing."""
    return [
        {
            "snippet": {
                "topLevelComment": {
                    "snippet": {
                        "textDisplay": "This is a great video!",
                        "authorDisplayName": "Test User 1",
                        "likeCount": 10,
                        "publishedAt": "2024-01-01T00:00:00Z"
                    }
                }
            }
        },
        {
            "snippet": {
                "topLevelComment": {
                    "snippet": {
                        "textDisplay": "Very helpful, thanks!",
                        "authorDisplayName": "Test User 2",
                        "likeCount": 5,
                        "publishedAt": "2024-01-02T00:00:00Z"
                    }
                }
            }
        }
    ]


