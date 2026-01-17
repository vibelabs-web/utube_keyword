"""
Pydantic schemas for API request and response validation.
"""
from app.schemas.common import (
    ApiResponse,
    PaginatedResponse,
)
from app.schemas.keyword import (
    KeywordAnalyzeRequest,
    KeywordAnalyzeResponse,
    KeywordMetrics,
    RelatedKeyword,
)
from app.schemas.comment import (
    CommentAnalyzeRequest,
    CommentAnalyzeResponse,
    VideoInfo,
    FrequentWord,
    ViewerRequest,
    SentimentAnalysis,
)


__all__ = [
    # Common
    "ApiResponse",
    "PaginatedResponse",
    # Keyword
    "KeywordAnalyzeRequest",
    "KeywordAnalyzeResponse",
    "KeywordMetrics",
    "RelatedKeyword",
    # Comment
    "CommentAnalyzeRequest",
    "CommentAnalyzeResponse",
    "VideoInfo",
    "FrequentWord",
    "ViewerRequest",
    "SentimentAnalysis",
]
