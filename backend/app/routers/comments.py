"""
Comment Analysis API Router

Provides endpoints for YouTube comment collection and analysis.
"""
import logging
from fastapi import APIRouter, HTTPException, status

from app.schemas.comment import CommentAnalyzeRequest, CommentAnalyzeResponse
from app.schemas.common import ApiResponse
from app.services.comment_collector import CommentCollectorService
from app.services.youtube import YouTubeAPIError, YouTubeQuotaExceededError

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/analyze",
    response_model=ApiResponse[CommentAnalyzeResponse],
    status_code=status.HTTP_200_OK,
    summary="Analyze YouTube Video Comments",
    description="""
    Collect and analyze comments from a YouTube video.

    **Features**:
    - Extracts video information (title, channel, views, comment count)
    - Collects up to 100 most relevant comments
    - Prepares data for word frequency analysis (T2.2)
    - Prepares data for sentiment analysis (T2.2)

    **Supported URL formats**:
    - `https://www.youtube.com/watch?v=VIDEO_ID`
    - `https://youtu.be/VIDEO_ID`
    - `https://www.youtube.com/embed/VIDEO_ID`
    - `https://m.youtube.com/watch?v=VIDEO_ID`
    """,
    responses={
        200: {
            "description": "Analysis completed successfully",
            "content": {
                "application/json": {
                    "example": {
                        "success": True,
                        "data": {
                            "video_info": {
                                "video_id": "dQw4w9WgXcQ",
                                "title": "Python Tutorial - Part 1",
                                "channel_title": "Code Academy",
                                "view_count": 15000,
                                "comment_count": 342
                            },
                            "frequent_words": [],
                            "viewer_requests": [],
                            "sentiment": None,
                            "analyzed_at": "2026-01-17T12:00:00"
                        },
                        "error": None,
                        "timestamp": "2026-01-17T12:00:00"
                    }
                }
            }
        },
        422: {
            "description": "Invalid YouTube URL format",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Invalid YouTube URL format. Supported formats: youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/..."
                    }
                }
            }
        },
        500: {
            "description": "YouTube API error or server error",
            "content": {
                "application/json": {
                    "example": {
                        "success": False,
                        "data": None,
                        "error": "YouTube API quota exceeded. Please try again later.",
                        "timestamp": "2026-01-17T12:00:00"
                    }
                }
            }
        }
    }
)
async def analyze_comments(request: CommentAnalyzeRequest) -> ApiResponse[CommentAnalyzeResponse]:
    """
    Analyze comments from a YouTube video.

    Args:
        request: CommentAnalyzeRequest with video_url

    Returns:
        ApiResponse containing CommentAnalyzeResponse with video info and analysis

    Raises:
        HTTPException 422: Invalid YouTube URL
        HTTPException 500: YouTube API error or server error
    """
    service = CommentCollectorService()

    try:
        logger.info(f"Starting comment analysis for URL: {request.video_url}")
        result = await service.collect_comments(request.video_url)
        logger.info(f"Comment analysis completed for video: {result.video_info.video_id}")

        return ApiResponse(
            success=True,
            data=result,
            error=None
        )

    except ValueError as e:
        # Invalid URL format or video not found
        logger.warning(f"Invalid request: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )

    except YouTubeQuotaExceededError as e:
        # YouTube API quota exceeded
        logger.error(f"YouTube API quota exceeded: {str(e)}")
        return ApiResponse(
            success=False,
            data=None,
            error="YouTube API quota exceeded. Please try again later."
        )

    except YouTubeAPIError as e:
        # Other YouTube API errors
        logger.error(f"YouTube API error: {str(e)}")
        return ApiResponse(
            success=False,
            data=None,
            error=f"YouTube API error: {str(e)}"
        )

    except Exception as e:
        # Unexpected errors
        logger.exception(f"Unexpected error during comment analysis: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred. Please try again later."
        )
