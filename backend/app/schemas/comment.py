"""
Comment analysis schemas.
"""
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator
import re


class CommentAnalyzeRequest(BaseModel):
    """
    Request schema for comment analysis.
    """
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                }
            ]
        }
    )

    video_url: str = Field(
        min_length=1,
        max_length=500,
        description="YouTube video URL",
        examples=[
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "https://youtu.be/dQw4w9WgXcQ"
        ]
    )

    @field_validator('video_url')
    @classmethod
    def validate_youtube_url(cls, v: str) -> str:
        """Validate YouTube URL format."""
        v = v.strip()

        # YouTube URL patterns
        patterns = [
            r'^https?://(?:www\.)?youtube\.com/watch\?v=[\w-]+',
            r'^https?://youtu\.be/[\w-]+',
            r'^https?://(?:www\.)?youtube\.com/embed/[\w-]+',
        ]

        if not any(re.match(pattern, v) for pattern in patterns):
            raise ValueError(
                'Invalid YouTube URL format. '
                'Supported formats: '
                'youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/...'
            )

        return v


class VideoInfo(BaseModel):
    """
    YouTube video information.
    """
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "video_id": "dQw4w9WgXcQ",
                    "title": "파이썬 기초 강의 - 1강",
                    "channel_title": "코딩 채널",
                    "view_count": 15000,
                    "comment_count": 342
                }
            ]
        }
    )

    video_id: str = Field(
        min_length=1,
        max_length=50,
        description="YouTube video ID",
        examples=["dQw4w9WgXcQ"]
    )
    title: str = Field(
        min_length=1,
        max_length=200,
        description="Video title",
        examples=["파이썬 기초 강의 - 1강"]
    )
    channel_title: str = Field(
        min_length=1,
        max_length=100,
        description="Channel name",
        examples=["코딩 채널"]
    )
    view_count: int = Field(
        ge=0,
        description="Total view count",
        examples=[15000, 52000]
    )
    comment_count: int = Field(
        ge=0,
        description="Total comment count",
        examples=[342, 1250]
    )


class FrequentWord(BaseModel):
    """
    Frequently appearing word in comments.
    """
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "word": "강의",
                    "count": 45,
                    "percentage": 13.2
                }
            ]
        }
    )

    word: str = Field(
        min_length=1,
        max_length=50,
        description="Word or phrase",
        examples=["강의", "설명", "이해"]
    )
    count: int = Field(
        ge=1,
        description="Frequency count",
        examples=[45, 32, 28]
    )
    percentage: float = Field(
        ge=0.0,
        le=100.0,
        description="Percentage of total analyzed comments",
        examples=[13.2, 9.4, 8.2]
    )


class ViewerRequest(BaseModel):
    """
    Viewer request or feedback extracted from comments.
    """
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "text": "다음에는 클래스에 대해 다뤄주세요!",
                    "like_count": 23,
                    "author": "user123"
                }
            ]
        }
    )

    text: str = Field(
        min_length=1,
        max_length=500,
        description="Comment text containing request or feedback",
        examples=["다음에는 클래스에 대해 다뤄주세요!"]
    )
    like_count: int = Field(
        ge=0,
        description="Number of likes on the comment",
        examples=[23, 15, 8]
    )
    author: str = Field(
        min_length=1,
        max_length=100,
        description="Comment author username",
        examples=["user123", "python_learner"]
    )


class ViewerQuestion(BaseModel):
    """
    Viewer question extracted from comments.
    """
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "text": "What software are you using for this?",
                    "like_count": 15,
                    "author": "curious_viewer"
                }
            ]
        }
    )

    text: str = Field(
        min_length=1,
        max_length=500,
        description="Question text"
    )
    like_count: int = Field(
        ge=0,
        description="Number of likes"
    )
    author: str = Field(
        min_length=1,
        max_length=100,
        description="Comment author"
    )


class TopComment(BaseModel):
    """
    Top engaging comment by likes.
    """
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "text": "This is the best tutorial I've ever seen!",
                    "like_count": 500,
                    "author": "happy_viewer"
                }
            ]
        }
    )

    text: str = Field(
        min_length=1,
        max_length=500,
        description="Comment text"
    )
    like_count: int = Field(
        ge=0,
        description="Number of likes"
    )
    author: str = Field(
        min_length=1,
        max_length=100,
        description="Comment author"
    )


class SentimentAnalysis(BaseModel):
    """
    Sentiment analysis results.
    """
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "positive": 0.68,
                    "neutral": 0.25,
                    "negative": 0.07,
                    "total_analyzed": 342
                }
            ]
        }
    )

    positive: float = Field(
        ge=0.0,
        le=1.0,
        description="Proportion of positive sentiment (0.0-1.0)",
        examples=[0.68, 0.75]
    )
    neutral: float = Field(
        ge=0.0,
        le=1.0,
        description="Proportion of neutral sentiment (0.0-1.0)",
        examples=[0.25, 0.18]
    )
    negative: float = Field(
        ge=0.0,
        le=1.0,
        description="Proportion of negative sentiment (0.0-1.0)",
        examples=[0.07, 0.05]
    )
    total_analyzed: int = Field(
        ge=0,
        description="Total number of comments analyzed",
        examples=[342, 1250]
    )

    @field_validator('positive', 'neutral', 'negative')
    @classmethod
    def validate_sentiment_sum(cls, v: float, info) -> float:
        """Validate sentiment values are between 0 and 1."""
        if not 0.0 <= v <= 1.0:
            raise ValueError(f'Sentiment value must be between 0.0 and 1.0, got {v}')
        return v


class CommentAnalyzeResponse(BaseModel):
    """
    Response schema for comment analysis.
    """
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "video_info": {
                        "video_id": "dQw4w9WgXcQ",
                        "title": "파이썬 기초 강의 - 1강",
                        "channel_title": "코딩 채널",
                        "view_count": 15000,
                        "comment_count": 342
                    },
                    "frequent_words": [
                        {"word": "강의", "count": 45, "percentage": 13.2},
                        {"word": "설명", "count": 32, "percentage": 9.4}
                    ],
                    "viewer_requests": [
                        {
                            "text": "다음에는 클래스에 대해 다뤄주세요!",
                            "like_count": 23,
                            "author": "user123"
                        }
                    ],
                    "sentiment": {
                        "positive": 0.68,
                        "neutral": 0.25,
                        "negative": 0.07,
                        "total_analyzed": 342
                    },
                    "analyzed_at": "2026-01-17T12:00:00"
                }
            ]
        }
    )

    video_info: VideoInfo = Field(
        description="YouTube video information"
    )
    frequent_words: List[FrequentWord] = Field(
        default_factory=list,
        description="Top frequent words from comments (max 20)",
        max_length=20
    )
    viewer_requests: List[ViewerRequest] = Field(
        default_factory=list,
        description="Extracted viewer requests and feedback (max 10)",
        max_length=10
    )
    viewer_questions: List[ViewerQuestion] = Field(
        default_factory=list,
        description="Extracted viewer questions (max 10)",
        max_length=10
    )
    top_comments: List[TopComment] = Field(
        default_factory=list,
        description="Top engaging comments by likes (max 5)",
        max_length=5
    )
    sentiment: Optional[SentimentAnalysis] = Field(
        default=None,
        description="Overall sentiment analysis (optional, implemented in T2.2)"
    )
    analyzed_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Analysis timestamp in UTC"
    )
