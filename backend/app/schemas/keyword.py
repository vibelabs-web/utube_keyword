"""
Keyword analysis schemas.
"""
from datetime import datetime
from typing import List
from pydantic import BaseModel, ConfigDict, Field, field_validator


class KeywordAnalyzeRequest(BaseModel):
    """
    Request schema for keyword analysis.
    """
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "keyword": "파이썬 강의"
                }
            ]
        }
    )

    keyword: str = Field(
        min_length=1,
        max_length=100,
        description="Keyword to analyze (1-100 characters)",
        examples=["파이썬 강의", "리액트 튜토리얼"]
    )

    @field_validator('keyword')
    @classmethod
    def validate_keyword(cls, v: str) -> str:
        """Validate and normalize keyword."""
        # Strip whitespace
        v = v.strip()

        if not v:
            raise ValueError('Keyword cannot be empty or whitespace only')

        return v


class KeywordMetrics(BaseModel):
    """
    Keyword performance metrics.
    """
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "search_volume": 1200,
                    "competition": 0.65,
                    "recommendation_score": 0.78
                }
            ]
        }
    )

    search_volume: int = Field(
        ge=0,
        description="Estimated monthly search volume",
        examples=[1200, 5000, 850]
    )
    competition: float = Field(
        ge=0.0,
        le=1.0,
        description="Competition level (0.0=low, 1.0=high)",
        examples=[0.3, 0.65, 0.9]
    )
    recommendation_score: float = Field(
        ge=0.0,
        le=1.0,
        description="Overall recommendation score (0.0=poor, 1.0=excellent)",
        examples=[0.45, 0.78, 0.92]
    )


class RelatedKeyword(BaseModel):
    """
    Related keyword suggestion.
    """
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "keyword": "파이썬 기초",
                    "search_volume": 980,
                    "competition": 0.55
                }
            ]
        }
    )

    keyword: str = Field(
        min_length=1,
        max_length=100,
        description="Related keyword",
        examples=["파이썬 기초", "파이썬 입문"]
    )
    search_volume: int = Field(
        ge=0,
        description="Estimated monthly search volume",
        examples=[980, 1500]
    )
    competition: float = Field(
        ge=0.0,
        le=1.0,
        description="Competition level (0.0=low, 1.0=high)",
        examples=[0.55, 0.7]
    )


class KeywordAnalyzeResponse(BaseModel):
    """
    Response schema for keyword analysis.
    """
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
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
                        },
                        {
                            "keyword": "파이썬 입문",
                            "search_volume": 850,
                            "competition": 0.48
                        }
                    ],
                    "analyzed_at": "2026-01-17T12:00:00"
                }
            ]
        }
    )

    keyword: str = Field(
        description="Analyzed keyword",
        examples=["파이썬 강의"]
    )
    metrics: KeywordMetrics = Field(
        description="Keyword performance metrics"
    )
    related_keywords: List[RelatedKeyword] = Field(
        default_factory=list,
        description="List of related keyword suggestions (max 10)",
        max_length=10
    )
    analyzed_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Analysis timestamp in UTC"
    )
