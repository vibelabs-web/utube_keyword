"""
Database models for keyword analysis.
Stores analysis results with TTL for caching.
"""
from datetime import datetime, timedelta
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Index
from app.db.base import Base


class KeywordAnalysis(Base):
    """
    Keyword analysis results with caching support.

    Stores analyzed keyword metrics and related keywords.
    Uses expires_at for TTL-based cache invalidation (7 days).
    """
    __tablename__ = "keyword_analyses"

    id = Column(Integer, primary_key=True, index=True)
    keyword = Column(String(100), nullable=False, index=True, unique=True)
    search_volume = Column(Integer, nullable=False, default=0)
    competition = Column(Float, nullable=False, default=0.0)
    recommendation_score = Column(Float, nullable=False, default=0.0)
    related_keywords = Column(JSON, nullable=False, default=list)
    analyzed_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False, index=True)

    # Composite index for efficient cache lookups
    __table_args__ = (
        Index('ix_keyword_expires', 'keyword', 'expires_at'),
    )

    @staticmethod
    def create_expires_at(days: int = 7) -> datetime:
        """Calculate expiration timestamp (default: 7 days from now)."""
        return datetime.utcnow() + timedelta(days=days)

    def is_expired(self) -> bool:
        """Check if this cached result has expired."""
        return datetime.utcnow() >= self.expires_at

    def to_dict(self):
        """Convert model to dictionary for response serialization."""
        return {
            "keyword": self.keyword,
            "metrics": {
                "search_volume": self.search_volume,
                "competition": self.competition,
                "recommendation_score": self.recommendation_score,
            },
            "related_keywords": self.related_keywords or [],
            "analyzed_at": self.analyzed_at,
        }
