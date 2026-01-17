"""
YouTube API Router
Provides REST endpoints for YouTube video search and data retrieval
"""

from typing import List
from fastapi import APIRouter, HTTPException, Query, Path, Depends
from pydantic import BaseModel, Field
from datetime import datetime

from app.services.youtube import (
    YouTubeAPIClient,
    YouTubeAPIError,
    YouTubeAPIKeyError,
    YouTubeQuotaExceededError,
    get_youtube_client
)

router = APIRouter()


# Response schemas
class VideoSearchResult(BaseModel):
    """Video search result schema"""
    video_id: str = Field(..., description="YouTube video ID")
    title: str = Field(..., description="Video title")
    description: str = Field(..., description="Video description")
    channel_id: str = Field(..., description="Channel ID")
    channel_title: str = Field(..., description="Channel name")
    published_at: datetime = Field(..., description="Publication date")
    thumbnail_url: str = Field(..., description="Video thumbnail URL")


class VideoDetails(BaseModel):
    """Video details schema"""
    video_id: str = Field(..., description="YouTube video ID")
    title: str = Field(..., description="Video title")
    description: str = Field(..., description="Video description")
    channel_id: str = Field(..., description="Channel ID")
    channel_title: str = Field(..., description="Channel name")
    published_at: datetime = Field(..., description="Publication date")
    duration: str = Field(..., description="Video duration (ISO 8601)")
    view_count: int = Field(..., description="Number of views")
    like_count: int = Field(..., description="Number of likes")
    comment_count: int = Field(..., description="Number of comments")
    thumbnail_url: str = Field(..., description="Video thumbnail URL")
    tags: List[str] = Field(default_factory=list, description="Video tags")


class VideoComment(BaseModel):
    """Video comment schema"""
    comment_id: str = Field(..., description="Comment ID")
    text: str = Field(..., description="Comment text")
    author_name: str = Field(..., description="Author display name")
    author_channel_id: str = Field(..., description="Author channel ID")
    like_count: int = Field(..., description="Number of likes")
    published_at: datetime = Field(..., description="Publication date")
    updated_at: datetime = Field(..., description="Last update date")
    reply_count: int = Field(..., description="Number of replies")


class ChannelInfo(BaseModel):
    """YouTube channel info schema"""
    channel_id: str = Field(..., description="Channel ID")
    title: str = Field(..., description="Channel title")
    description: str = Field(..., description="Channel description")
    custom_url: str = Field(..., description="Custom channel URL")
    published_at: datetime = Field(..., description="Channel creation date")
    thumbnail_url: str = Field(..., description="Channel thumbnail URL")
    subscriber_count: int = Field(..., description="Number of subscribers")
    video_count: int = Field(..., description="Number of videos")
    view_count: int = Field(..., description="Total channel views")


class QuotaStatus(BaseModel):
    """API quota status schema"""
    available: bool = Field(..., description="Whether API is available")
    message: str = Field(..., description="Status message")


class YouTuberRanking(BaseModel):
    """YouTuber ranking for a keyword"""
    rank: int = Field(..., description="Ranking position")
    channel_id: str = Field(..., description="Channel ID")
    channel_title: str = Field(..., description="Channel name")
    thumbnail_url: str = Field(..., description="Channel thumbnail URL")
    subscriber_count: int = Field(..., description="Number of subscribers")
    total_views: int = Field(..., description="Total channel views")
    video_count_for_keyword: int = Field(..., description="Number of videos for this keyword")
    avg_views_per_video: int = Field(..., description="Average views per video for keyword")
    top_video_title: str = Field(..., description="Top video title for keyword")
    top_video_views: int = Field(..., description="Top video view count")


# Endpoints
@router.get("/search", response_model=List[VideoSearchResult])
async def search_videos(
    query: str = Query(..., min_length=1, description="Search query"),
    max_results: int = Query(10, ge=1, le=50, description="Maximum results"),
    order: str = Query("relevance", description="Sort order")
):
    """
    Search YouTube videos by keyword

    Args:
        query: Search query string
        max_results: Maximum number of results (1-50)
        order: Sort order (relevance, date, rating, viewCount, title)

    Returns:
        List of video search results

    Raises:
        400: Invalid parameters
        403: API quota exceeded
        500: API error
    """
    try:
        async with YouTubeAPIClient() as client:
            results = await client.search_videos(
                query=query,
                max_results=max_results,
                order=order
            )
            return results

    except YouTubeAPIKeyError as e:
        raise HTTPException(status_code=500, detail=str(e))

    except YouTubeQuotaExceededError as e:
        raise HTTPException(status_code=403, detail=str(e))

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except YouTubeAPIError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/videos/{video_id}", response_model=VideoDetails)
async def get_video_details(
    video_id: str = Path(..., description="YouTube video ID")
):
    """
    Get detailed information about a video

    Args:
        video_id: YouTube video ID (11 characters)

    Returns:
        Video details including statistics

    Raises:
        400: Invalid video ID
        404: Video not found
        403: API quota exceeded
        500: API error
    """
    try:
        async with YouTubeAPIClient() as client:
            details = await client.get_video_details(video_id)
            return details

    except ValueError as e:
        # Video not found or invalid ID
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))

    except YouTubeAPIKeyError as e:
        raise HTTPException(status_code=500, detail=str(e))

    except YouTubeQuotaExceededError as e:
        raise HTTPException(status_code=403, detail=str(e))

    except YouTubeAPIError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/videos/{video_id}/comments", response_model=List[VideoComment])
async def get_video_comments(
    video_id: str = Path(..., description="YouTube video ID"),
    max_results: int = Query(100, ge=1, le=100, description="Maximum comments"),
    order: str = Query("relevance", description="Sort order (time, relevance)")
):
    """
    Get comments for a video

    Args:
        video_id: YouTube video ID
        max_results: Maximum number of comments (1-100)
        order: Sort order (time, relevance)

    Returns:
        List of video comments

    Raises:
        400: Invalid parameters
        403: API quota exceeded
        500: API error
    """
    try:
        async with YouTubeAPIClient() as client:
            comments = await client.get_video_comments(
                video_id=video_id,
                max_results=max_results,
                order=order
            )
            return comments

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except YouTubeAPIKeyError as e:
        raise HTTPException(status_code=500, detail=str(e))

    except YouTubeQuotaExceededError as e:
        raise HTTPException(status_code=403, detail=str(e))

    except YouTubeAPIError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/channels/{channel_id}", response_model=ChannelInfo)
async def get_channel_info(
    channel_id: str = Path(..., description="YouTube channel ID")
):
    """
    Get information about a YouTube channel

    Args:
        channel_id: YouTube channel ID

    Returns:
        Channel information including statistics

    Raises:
        400: Invalid channel ID
        404: Channel not found
        403: API quota exceeded
        500: API error
    """
    try:
        async with YouTubeAPIClient() as client:
            info = await client.get_channel_info(channel_id)
            return info

    except ValueError as e:
        # Channel not found or invalid ID
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))

    except YouTubeAPIKeyError as e:
        raise HTTPException(status_code=500, detail=str(e))

    except YouTubeQuotaExceededError as e:
        raise HTTPException(status_code=403, detail=str(e))

    except YouTubeAPIError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/quota", response_model=QuotaStatus)
async def check_quota():
    """
    Check YouTube API quota status

    Returns:
        Quota availability status

    Raises:
        500: API error
    """
    try:
        async with YouTubeAPIClient() as client:
            status = await client.check_quota()
            return status

    except YouTubeAPIKeyError as e:
        raise HTTPException(status_code=500, detail=str(e))

    except Exception as e:
        return QuotaStatus(
            available=False,
            message=f"Error checking quota: {str(e)}"
        )


@router.get("/youtubers/ranking", response_model=List[YouTuberRanking])
async def get_youtuber_ranking(
    query: str = Query(..., min_length=1, description="Search keyword"),
    max_results: int = Query(50, ge=10, le=50, description="Videos to analyze"),
    top_n: int = Query(10, ge=1, le=20, description="Number of top YouTubers to return")
):
    """
    Get popular YouTubers ranking for a keyword

    Searches videos by keyword, groups by channel, and ranks by performance.

    Args:
        query: Search keyword
        max_results: Number of videos to analyze (10-50)
        top_n: Number of top YouTubers to return (1-20)

    Returns:
        List of YouTubers ranked by performance for this keyword
    """
    try:
        async with YouTubeAPIClient() as client:
            # 1. Search videos by keyword
            videos = await client.search_videos(
                query=query,
                max_results=max_results,
                order="viewCount"
            )

            if not videos:
                return []

            # 2. Get video details for view counts
            video_ids = [v["video_id"] for v in videos]
            video_details = {}

            for video_id in video_ids:
                try:
                    details = await client.get_video_details(video_id)
                    video_details[video_id] = details
                except Exception:
                    continue

            # 3. Group by channel
            channel_data = {}
            for video in videos:
                channel_id = video["channel_id"]
                video_id = video["video_id"]

                if channel_id not in channel_data:
                    channel_data[channel_id] = {
                        "channel_title": video["channel_title"],
                        "videos": [],
                        "total_views": 0
                    }

                if video_id in video_details:
                    details = video_details[video_id]
                    view_count = details.get("view_count", 0)
                    channel_data[channel_id]["videos"].append({
                        "title": video["title"],
                        "views": view_count
                    })
                    channel_data[channel_id]["total_views"] += view_count

            # 4. Get channel info for each unique channel
            channel_infos = {}
            for channel_id in list(channel_data.keys())[:top_n * 2]:
                try:
                    info = await client.get_channel_info(channel_id)
                    channel_infos[channel_id] = info
                except Exception:
                    continue

            # 5. Build ranking
            rankings = []
            for channel_id, data in channel_data.items():
                if not data["videos"]:
                    continue

                info = channel_infos.get(channel_id, {})
                top_video = max(data["videos"], key=lambda x: x["views"])

                rankings.append({
                    "channel_id": channel_id,
                    "channel_title": data["channel_title"],
                    "thumbnail_url": info.get("thumbnail_url", ""),
                    "subscriber_count": info.get("subscriber_count", 0),
                    "total_views": info.get("view_count", 0),
                    "video_count_for_keyword": len(data["videos"]),
                    "avg_views_per_video": data["total_views"] // len(data["videos"]),
                    "top_video_title": top_video["title"],
                    "top_video_views": top_video["views"]
                })

            # 6. Sort by avg views per video (keyword performance)
            rankings.sort(key=lambda x: x["avg_views_per_video"], reverse=True)

            # 7. Add rank and return top N
            result = []
            for i, r in enumerate(rankings[:top_n], 1):
                r["rank"] = i
                result.append(YouTuberRanking(**r))

            return result

    except YouTubeAPIKeyError as e:
        raise HTTPException(status_code=500, detail=str(e))

    except YouTubeQuotaExceededError as e:
        raise HTTPException(status_code=403, detail=str(e))

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except YouTubeAPIError as e:
        raise HTTPException(status_code=500, detail=str(e))
