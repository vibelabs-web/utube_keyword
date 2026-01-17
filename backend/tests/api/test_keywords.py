"""
Test cases for keyword analysis API endpoints.
Following TDD approach: Write tests first, then implement.
"""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
class TestKeywordAnalyze:
    """Test suite for /api/v1/keywords/analyze endpoint."""

    async def test_analyze_keyword_success(self, async_client: AsyncClient):
        """키워드 분석 성공 케이스"""
        response = await async_client.post(
            "/api/v1/keywords/analyze",
            json={"keyword": "파이썬 강의"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "data" in data
        assert "metrics" in data["data"]
        assert "related_keywords" in data["data"]

    async def test_analyze_keyword_metrics_structure(self, async_client: AsyncClient):
        """메트릭 구조 검증"""
        response = await async_client.post(
            "/api/v1/keywords/analyze",
            json={"keyword": "테스트 키워드"}
        )
        assert response.status_code == 200
        data = response.json()["data"]

        # Metrics validation
        metrics = data["metrics"]
        assert "search_volume" in metrics
        assert "competition" in metrics
        assert "recommendation_score" in metrics

        # Related keywords validation
        assert isinstance(data["related_keywords"], list)

    async def test_analyze_keyword_metrics_values(self, async_client: AsyncClient):
        """메트릭 값 범위 검증"""
        response = await async_client.post(
            "/api/v1/keywords/analyze",
            json={"keyword": "파이썬 강의"}
        )
        assert response.status_code == 200
        metrics = response.json()["data"]["metrics"]

        # Competition should be between 0 and 1
        assert 0 <= metrics["competition"] <= 1
        # Recommendation score should be between 0 and 1
        assert 0 <= metrics["recommendation_score"] <= 1
        # Search volume should be non-negative
        assert metrics["search_volume"] >= 0

    async def test_analyze_keyword_related_keywords_structure(self, async_client: AsyncClient):
        """관련 키워드 구조 검증"""
        response = await async_client.post(
            "/api/v1/keywords/analyze",
            json={"keyword": "파이썬"}
        )
        assert response.status_code == 200
        data = response.json()["data"]

        related = data["related_keywords"]
        if len(related) > 0:
            # Check first related keyword structure
            first = related[0]
            assert "keyword" in first
            assert "search_volume" in first
            assert "competition" in first
            assert isinstance(first["keyword"], str)
            assert first["search_volume"] >= 0
            assert 0 <= first["competition"] <= 1

    async def test_analyze_keyword_empty_string(self, async_client: AsyncClient):
        """빈 키워드 에러 (422 Validation Error)"""
        response = await async_client.post(
            "/api/v1/keywords/analyze",
            json={"keyword": ""}
        )
        assert response.status_code == 422

    async def test_analyze_keyword_whitespace_only(self, async_client: AsyncClient):
        """공백만 있는 키워드 에러"""
        response = await async_client.post(
            "/api/v1/keywords/analyze",
            json={"keyword": "   "}
        )
        assert response.status_code == 422

    async def test_analyze_keyword_too_long(self, async_client: AsyncClient):
        """너무 긴 키워드 에러 (100자 초과)"""
        long_keyword = "a" * 101
        response = await async_client.post(
            "/api/v1/keywords/analyze",
            json={"keyword": long_keyword}
        )
        assert response.status_code == 422

    async def test_analyze_keyword_missing_field(self, async_client: AsyncClient):
        """필수 필드 누락 에러"""
        response = await async_client.post(
            "/api/v1/keywords/analyze",
            json={}
        )
        assert response.status_code == 422

    async def test_analyze_keyword_response_timestamp(self, async_client: AsyncClient):
        """응답에 타임스탬프 포함 확인"""
        response = await async_client.post(
            "/api/v1/keywords/analyze",
            json={"keyword": "파이썬"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "timestamp" in data
        assert "analyzed_at" in data["data"]

    async def test_analyze_keyword_caching(self, async_client: AsyncClient):
        """동일 키워드 재분석 시 캐싱 동작 확인"""
        keyword = "캐싱테스트키워드"

        # First request
        response1 = await async_client.post(
            "/api/v1/keywords/analyze",
            json={"keyword": keyword}
        )
        assert response1.status_code == 200

        # Second request (should use cache)
        response2 = await async_client.post(
            "/api/v1/keywords/analyze",
            json={"keyword": keyword}
        )
        assert response2.status_code == 200

        # Both should return same data
        data1 = response1.json()["data"]
        data2 = response2.json()["data"]

        # Metrics should be identical (from cache)
        assert data1["metrics"]["search_volume"] == data2["metrics"]["search_volume"]
        assert data1["metrics"]["competition"] == data2["metrics"]["competition"]
        assert data1["metrics"]["recommendation_score"] == data2["metrics"]["recommendation_score"]


@pytest.mark.asyncio
class TestRelatedKeywords:
    """Test suite for related keywords extraction (T1.2)."""

    async def test_related_keywords_count(self, async_client: AsyncClient):
        """관련 키워드 5~10개 추출 확인"""
        response = await async_client.post(
            "/api/v1/keywords/analyze",
            json={"keyword": "파이썬 강의"}
        )
        assert response.status_code == 200
        data = response.json()["data"]
        related = data["related_keywords"]
        assert 5 <= len(related) <= 10, f"Expected 5-10 related keywords, got {len(related)}"

    async def test_related_keywords_structure(self, async_client: AsyncClient):
        """관련 키워드 구조 검증"""
        response = await async_client.post(
            "/api/v1/keywords/analyze",
            json={"keyword": "리액트 튜토리얼"}
        )
        assert response.status_code == 200
        data = response.json()["data"]
        related = data["related_keywords"]

        # Must have at least 5 keywords
        assert len(related) >= 5, f"Expected at least 5 related keywords, got {len(related)}"

        for keyword in related:
            assert "keyword" in keyword, "Missing 'keyword' field"
            assert "search_volume" in keyword, "Missing 'search_volume' field"
            assert "competition" in keyword, "Missing 'competition' field"
            assert isinstance(keyword["keyword"], str), "keyword must be string"
            assert len(keyword["keyword"]) > 0, "keyword cannot be empty"
            assert keyword["search_volume"] >= 0, "search_volume must be non-negative"
            assert 0 <= keyword["competition"] <= 1, "competition must be between 0 and 1"

    async def test_related_keywords_unique(self, async_client: AsyncClient):
        """관련 키워드 중복 없음 확인"""
        response = await async_client.post(
            "/api/v1/keywords/analyze",
            json={"keyword": "자바스크립트"}
        )
        assert response.status_code == 200
        data = response.json()["data"]
        keywords = [k["keyword"] for k in data["related_keywords"]]
        unique_keywords = set(keywords)
        assert len(keywords) == len(unique_keywords), "Related keywords contain duplicates"

    async def test_related_keywords_not_contain_original(self, async_client: AsyncClient):
        """관련 키워드에 원본 키워드 미포함"""
        keyword = "웹개발"
        response = await async_client.post(
            "/api/v1/keywords/analyze",
            json={"keyword": keyword}
        )
        assert response.status_code == 200
        data = response.json()["data"]
        related_keywords = [k["keyword"].lower() for k in data["related_keywords"]]
        assert keyword.lower() not in related_keywords, "Original keyword found in related keywords"

        # Also check that the original keyword is not a substring
        original_lower = keyword.lower()
        for related in related_keywords:
            assert original_lower != related, f"Found exact match: {related}"

    async def test_related_keywords_quality(self, async_client: AsyncClient):
        """관련 키워드 품질 검증 - 의미있는 키워드만 포함"""
        response = await async_client.post(
            "/api/v1/keywords/analyze",
            json={"keyword": "파이썬"}
        )
        assert response.status_code == 200
        data = response.json()["data"]

        for keyword_obj in data["related_keywords"]:
            keyword = keyword_obj["keyword"]
            # Minimum length check
            assert len(keyword) >= 2, f"Keyword too short: {keyword}"
            # Maximum length check (reasonable)
            assert len(keyword) <= 50, f"Keyword too long: {keyword}"
            # Not just whitespace
            assert keyword.strip() == keyword, f"Keyword has leading/trailing whitespace: '{keyword}'"
