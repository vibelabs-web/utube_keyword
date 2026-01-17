"""
Common Pydantic schemas for API responses.
"""
from datetime import datetime
from typing import Generic, TypeVar, Optional, List
from pydantic import BaseModel, ConfigDict, Field


T = TypeVar('T')


class ApiResponse(BaseModel, Generic[T]):
    """
    Generic API response wrapper.

    Provides consistent response structure across all endpoints.
    """
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "success": True,
                    "data": {"example": "data"},
                    "error": None,
                    "timestamp": "2026-01-17T12:00:00"
                }
            ]
        }
    )

    success: bool = Field(
        description="Whether the request was successful"
    )
    data: Optional[T] = Field(
        default=None,
        description="Response data (null if error occurred)"
    )
    error: Optional[str] = Field(
        default=None,
        description="Error message (null if successful)"
    )
    timestamp: datetime = Field(
        default_factory=datetime.utcnow,
        description="Response timestamp in UTC"
    )


class PaginatedResponse(BaseModel, Generic[T]):
    """
    Paginated API response wrapper.

    Used for endpoints that return lists with pagination support.
    """
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "success": True,
                    "data": [{"id": 1}, {"id": 2}],
                    "error": None,
                    "timestamp": "2026-01-17T12:00:00",
                    "total": 100,
                    "page": 1,
                    "page_size": 20
                }
            ]
        }
    )

    success: bool = Field(
        description="Whether the request was successful"
    )
    data: List[T] = Field(
        default_factory=list,
        description="List of items for current page"
    )
    error: Optional[str] = Field(
        default=None,
        description="Error message (null if successful)"
    )
    timestamp: datetime = Field(
        default_factory=datetime.utcnow,
        description="Response timestamp in UTC"
    )
    total: int = Field(
        ge=0,
        description="Total number of items across all pages"
    )
    page: int = Field(
        ge=1,
        description="Current page number (1-indexed)"
    )
    page_size: int = Field(
        ge=1,
        le=100,
        description="Number of items per page"
    )
