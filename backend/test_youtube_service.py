"""
Test script for YouTube API service

Run this to verify YouTube API integration:
    python backend/test_youtube_service.py

Requirements:
    - Set YOUTUBE_API_KEY in backend/.env
    - Run from project root directory
"""

import asyncio
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

from app.services.youtube import YouTubeAPIClient, YouTubeAPIKeyError


async def test_search():
    """Test video search functionality"""
    print("\n=== Testing Video Search ===")
    async with YouTubeAPIClient() as client:
        results = await client.search_videos("Python tutorial", max_results=3)
        print(f"Found {len(results)} videos")

        for idx, video in enumerate(results, 1):
            print(f"\n{idx}. {video['title']}")
            print(f"   Video ID: {video['video_id']}")
            print(f"   Channel: {video['channel_title']}")
            print(f"   Published: {video['published_at']}")


async def test_video_details():
    """Test video details retrieval"""
    print("\n=== Testing Video Details ===")
    # Use a known video ID (YouTube official video)
    video_id = "dQw4w9WgXcQ"

    async with YouTubeAPIClient() as client:
        details = await client.get_video_details(video_id)

        print(f"\nTitle: {details['title']}")
        print(f"Channel: {details['channel_title']}")
        print(f"Views: {details['view_count']:,}")
        print(f"Likes: {details['like_count']:,}")
        print(f"Comments: {details['comment_count']:,}")
        print(f"Duration: {details['duration']}")
        print(f"Published: {details['published_at']}")


async def test_comments():
    """Test comment retrieval"""
    print("\n=== Testing Comments ===")
    # Use a known video ID
    video_id = "dQw4w9WgXcQ"

    async with YouTubeAPIClient() as client:
        comments = await client.get_video_comments(video_id, max_results=5)
        print(f"Found {len(comments)} comments")

        for idx, comment in enumerate(comments, 1):
            print(f"\n{idx}. {comment['author_name']} ({comment['like_count']} likes)")
            text = comment['text'][:100]
            if len(comment['text']) > 100:
                text += "..."
            print(f"   {text}")


async def test_channel():
    """Test channel info retrieval"""
    print("\n=== Testing Channel Info ===")
    # Use YouTube's official channel
    channel_id = "UCBR8-60-B28hp2BmDPdntcQ"

    async with YouTubeAPIClient() as client:
        info = await client.get_channel_info(channel_id)

        print(f"\nChannel: {info['title']}")
        print(f"Subscribers: {info['subscriber_count']:,}")
        print(f"Videos: {info['video_count']:,}")
        print(f"Total views: {info['view_count']:,}")
        print(f"Custom URL: {info['custom_url']}")


async def test_quota():
    """Test quota check"""
    print("\n=== Testing Quota Check ===")
    async with YouTubeAPIClient() as client:
        quota_info = await client.check_quota()
        print(f"API Available: {quota_info['available']}")
        print(f"Message: {quota_info['message']}")


async def main():
    """Run all tests"""
    print("=" * 60)
    print("YouTube API Service Test Suite")
    print("=" * 60)

    try:
        # Test 1: Quota check (minimal API call)
        await test_quota()

        # Test 2: Search
        await test_search()

        # Test 3: Video details
        await test_video_details()

        # Test 4: Comments
        await test_comments()

        # Test 5: Channel info
        await test_channel()

        print("\n" + "=" * 60)
        print("All tests completed successfully!")
        print("=" * 60)

    except YouTubeAPIKeyError as e:
        print(f"\nERROR: {e}")
        print("\nPlease set YOUTUBE_API_KEY in backend/.env")
        print("Get your API key from: https://console.cloud.google.com/")
        sys.exit(1)

    except Exception as e:
        print(f"\nERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
