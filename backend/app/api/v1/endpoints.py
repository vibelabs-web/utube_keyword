"""
API v1 endpoints for keyword and comment analysis.
"""
import logging
from fastapi import APIRouter, HTTPException, status
from app.schemas import (
    ApiResponse,
    KeywordAnalyzeRequest,
    KeywordAnalyzeResponse,
    CommentAnalyzeRequest,
    CommentAnalyzeResponse,
)
from app.services.comment_collector import CommentCollectorService
from app.services.youtube import YouTubeAPIError, YouTubeQuotaExceededError

logger = logging.getLogger(__name__)


router = APIRouter()

# Note: Keyword analyze endpoint moved to app/api/v1/keywords.py

@router.post(
    "/comments/analyze",
    response_model=ApiResponse[CommentAnalyzeResponse],
    summary="Analyze YouTube video comments",
    description="Analyze comments from a YouTube video and extract insights.",
    tags=["comments"]
)
async def analyze_comments(request: CommentAnalyzeRequest):
    """
    Analyze YouTube video comments.

    - **video_url**: YouTube video URL (supports youtube.com/watch, youtu.be, youtube.com/embed formats)

    Returns:
    - Video information (title, channel, views, comment count)
    - Frequent words and phrases
    - Viewer requests and feedback
    - Sentiment analysis (positive, neutral, negative)
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
