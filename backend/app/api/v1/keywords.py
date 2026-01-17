"""
Keywords API Router
Handles keyword analysis endpoints.
"""
import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.keyword import KeywordAnalyzeRequest, KeywordAnalyzeResponse
from app.schemas.common import ApiResponse
from app.services.keyword_analyzer import KeywordAnalyzerService
from app.services.youtube import YouTubeAPIClient, YouTubeAPIError, get_youtube_client
from app.core.database import get_db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/keywords", tags=["keywords"])


@router.post("/analyze", response_model=ApiResponse[KeywordAnalyzeResponse])
async def analyze_keyword(
    request: KeywordAnalyzeRequest,
    db: AsyncSession = Depends(get_db),
    youtube_client: YouTubeAPIClient = Depends(get_youtube_client)
):
    """
    Analyze a keyword for YouTube content opportunities.

    Returns:
    - Search volume estimation
    - Competition level (0.0-1.0)
    - Recommendation score (0.0-1.0)
    - Related keyword suggestions

    The analysis uses YouTube search results to estimate keyword performance.
    Results are cached for 7 days.

    **Example Request:**
    ```json
    {
        "keyword": "파이썬 강의"
    }
    ```

    **Example Response:**
    ```json
    {
        "success": true,
        "data": {
            "keyword": "파이썬 강의",
            "metrics": {
                "search_volume": 1200,
                "competition": 0.65,
                "recommendation_score": 0.78
            },
            "related_keywords": [
                {
                    "keyword": "파이썬 기초",
                    "search_volume": 980,
                    "competition": 0.55
                }
            ],
            "analyzed_at": "2026-01-17T12:00:00"
        },
        "error": null,
        "timestamp": "2026-01-17T12:00:00"
    }
    ```
    """
    try:
        # Initialize analyzer service
        analyzer = KeywordAnalyzerService(db=db, youtube_client=youtube_client)

        # Perform analysis
        result = await analyzer.analyze(request.keyword)

        # Convert to response schema
        response_data = KeywordAnalyzeResponse(
            keyword=result["keyword"],
            metrics=result["metrics"],
            related_keywords=result["related_keywords"],
            analyzed_at=result["analyzed_at"]
        )

        return ApiResponse(
            success=True,
            data=response_data
        )

    except ValueError as e:
        logger.warning(f"Invalid keyword: {e}")
        raise HTTPException(status_code=422, detail=str(e))

    except YouTubeAPIError as e:
        logger.error(f"YouTube API error: {e}")
        raise HTTPException(
            status_code=503,
            detail=f"YouTube API error: {str(e)}"
        )

    except Exception as e:
        logger.error(f"Unexpected error analyzing keyword: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Internal server error during keyword analysis"
        )
