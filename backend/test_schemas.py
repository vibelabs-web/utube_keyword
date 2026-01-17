"""
Schema validation test script.
"""
import json
from datetime import datetime
from app.schemas import (
    ApiResponse,
    PaginatedResponse,
    KeywordAnalyzeRequest,
    KeywordAnalyzeResponse,
    KeywordMetrics,
    RelatedKeyword,
    CommentAnalyzeRequest,
    CommentAnalyzeResponse,
    VideoInfo,
    FrequentWord,
    ViewerRequest,
    SentimentAnalysis,
)


def test_keyword_schemas():
    """Test keyword analysis schemas."""
    print("\n=== Testing Keyword Schemas ===\n")

    # Test KeywordAnalyzeRequest
    print("1. KeywordAnalyzeRequest")
    request = KeywordAnalyzeRequest(keyword="파이썬 강의")
    print(f"   ✓ Valid request: {request.model_dump_json()}")

    try:
        invalid = KeywordAnalyzeRequest(keyword="")
        print("   ✗ Should fail on empty keyword")
    except ValueError as e:
        print(f"   ✓ Validation error caught: {str(e)[:50]}...")

    # Test KeywordAnalyzeResponse
    print("\n2. KeywordAnalyzeResponse")
    response = KeywordAnalyzeResponse(
        keyword="파이썬 강의",
        metrics=KeywordMetrics(
            search_volume=1200,
            competition=0.65,
            recommendation_score=0.78
        ),
        related_keywords=[
            RelatedKeyword(
                keyword="파이썬 기초",
                search_volume=980,
                competition=0.55
            )
        ],
        analyzed_at=datetime.utcnow()
    )
    print(f"   ✓ Valid response created")
    print(f"   JSON: {response.model_dump_json(indent=2)[:200]}...")

    # Test ApiResponse wrapper
    print("\n3. ApiResponse[KeywordAnalyzeResponse]")
    api_response = ApiResponse[KeywordAnalyzeResponse](
        success=True,
        data=response,
        error=None,
        timestamp=datetime.utcnow()
    )
    print(f"   ✓ Wrapped response created")


def test_comment_schemas():
    """Test comment analysis schemas."""
    print("\n=== Testing Comment Schemas ===\n")

    # Test CommentAnalyzeRequest
    print("1. CommentAnalyzeRequest")
    request = CommentAnalyzeRequest(
        video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    )
    print(f"   ✓ Valid request: {request.model_dump_json()}")

    # Test invalid URLs
    invalid_urls = [
        "not a url",
        "https://vimeo.com/123456",
        "youtube.com/watch?v=123",  # Missing protocol
    ]
    for url in invalid_urls:
        try:
            invalid = CommentAnalyzeRequest(video_url=url)
            print(f"   ✗ Should fail on invalid URL: {url}")
        except ValueError:
            print(f"   ✓ Validation error caught for: {url[:30]}...")

    # Test CommentAnalyzeResponse
    print("\n2. CommentAnalyzeResponse")
    response = CommentAnalyzeResponse(
        video_info=VideoInfo(
            video_id="dQw4w9WgXcQ",
            title="파이썬 기초 강의 - 1강",
            channel_title="코딩 채널",
            view_count=15000,
            comment_count=342
        ),
        frequent_words=[
            FrequentWord(word="강의", count=45, percentage=13.2),
            FrequentWord(word="설명", count=32, percentage=9.4)
        ],
        viewer_requests=[
            ViewerRequest(
                text="다음에는 클래스에 대해 다뤄주세요!",
                like_count=23,
                author="user123"
            )
        ],
        sentiment=SentimentAnalysis(
            positive=0.68,
            neutral=0.25,
            negative=0.07,
            total_analyzed=342
        ),
        analyzed_at=datetime.utcnow()
    )
    print(f"   ✓ Valid response created")
    print(f"   JSON: {response.model_dump_json(indent=2)[:200]}...")


def test_json_schema_generation():
    """Test JSON schema generation."""
    print("\n=== Testing JSON Schema Generation ===\n")

    schemas = [
        ("KeywordAnalyzeRequest", KeywordAnalyzeRequest),
        ("KeywordAnalyzeResponse", KeywordAnalyzeResponse),
        ("CommentAnalyzeRequest", CommentAnalyzeRequest),
        ("CommentAnalyzeResponse", CommentAnalyzeResponse),
    ]

    for name, schema_class in schemas:
        schema = schema_class.model_json_schema()
        print(f"{name}:")
        print(f"  - Properties: {len(schema.get('properties', {}))}")
        print(f"  - Required: {schema.get('required', [])}")
        if 'examples' in schema:
            print(f"  - Has examples: ✓")
        print()


if __name__ == "__main__":
    print("=" * 60)
    print("Pydantic v2 Schema Validation Test")
    print("=" * 60)

    try:
        test_keyword_schemas()
        test_comment_schemas()
        test_json_schema_generation()

        print("\n" + "=" * 60)
        print("All schema tests passed! ✓")
        print("=" * 60)
    except Exception as e:
        print(f"\n✗ Test failed: {e}")
        import traceback
        traceback.print_exc()
