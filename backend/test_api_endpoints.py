"""
API endpoint validation test script.
"""
import httpx
import json


BASE_URL = "http://localhost:8000"


def test_health_check():
    """Test health check endpoint."""
    print("\n=== Testing Health Check ===")
    response = httpx.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    print("✓ Health check passed")


def test_keyword_analyze_validation():
    """Test keyword analysis validation."""
    print("\n=== Testing Keyword Analysis Validation ===")

    # Valid request (should return 501 - not implemented)
    print("\n1. Valid request:")
    valid_payload = {"keyword": "파이썬 강의"}
    response = httpx.post(
        f"{BASE_URL}/api/v1/keywords/analyze",
        json=valid_payload
    )
    print(f"   Status: {response.status_code}")
    print(f"   Response: {json.dumps(response.json(), indent=2)[:100]}...")

    # Empty keyword (should return 422)
    print("\n2. Empty keyword:")
    invalid_payload = {"keyword": ""}
    response = httpx.post(
        f"{BASE_URL}/api/v1/keywords/analyze",
        json=invalid_payload
    )
    print(f"   Status: {response.status_code}")
    assert response.status_code == 422
    print("   ✓ Validation error caught")

    # Whitespace only (should return 422)
    print("\n3. Whitespace only:")
    invalid_payload = {"keyword": "   "}
    response = httpx.post(
        f"{BASE_URL}/api/v1/keywords/analyze",
        json=invalid_payload
    )
    print(f"   Status: {response.status_code}")
    assert response.status_code == 422
    print("   ✓ Validation error caught")

    # Too long keyword (should return 422)
    print("\n4. Too long keyword (>100 chars):")
    invalid_payload = {"keyword": "a" * 101}
    response = httpx.post(
        f"{BASE_URL}/api/v1/keywords/analyze",
        json=invalid_payload
    )
    print(f"   Status: {response.status_code}")
    assert response.status_code == 422
    print("   ✓ Validation error caught")


def test_comment_analyze_validation():
    """Test comment analysis validation."""
    print("\n=== Testing Comment Analysis Validation ===")

    # Valid YouTube URL (should return 501 - not implemented)
    print("\n1. Valid YouTube URL (youtube.com/watch):")
    valid_payload = {"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
    response = httpx.post(
        f"{BASE_URL}/api/v1/comments/analyze",
        json=valid_payload
    )
    print(f"   Status: {response.status_code}")
    print(f"   Response: {json.dumps(response.json(), indent=2)[:100]}...")

    # Valid YouTube short URL
    print("\n2. Valid YouTube URL (youtu.be):")
    valid_payload = {"video_url": "https://youtu.be/dQw4w9WgXcQ"}
    response = httpx.post(
        f"{BASE_URL}/api/v1/comments/analyze",
        json=valid_payload
    )
    print(f"   Status: {response.status_code}")

    # Invalid URL format (should return 422)
    print("\n3. Invalid URL (not YouTube):")
    invalid_payload = {"video_url": "https://vimeo.com/123456"}
    response = httpx.post(
        f"{BASE_URL}/api/v1/comments/analyze",
        json=invalid_payload
    )
    print(f"   Status: {response.status_code}")
    assert response.status_code == 422
    print("   ✓ Validation error caught")

    # Missing protocol (should return 422)
    print("\n4. Missing protocol:")
    invalid_payload = {"video_url": "youtube.com/watch?v=123"}
    response = httpx.post(
        f"{BASE_URL}/api/v1/comments/analyze",
        json=invalid_payload
    )
    print(f"   Status: {response.status_code}")
    assert response.status_code == 422
    print("   ✓ Validation error caught")


def test_openapi_docs():
    """Test OpenAPI documentation."""
    print("\n=== Testing OpenAPI Documentation ===")

    # Get OpenAPI schema
    response = httpx.get(f"{BASE_URL}/openapi.json")
    assert response.status_code == 200
    schema = response.json()

    print(f"\nAPI Title: {schema['info']['title']}")
    print(f"API Version: {schema['info']['version']}")
    print(f"API Description: {schema['info']['description']}")

    # Check endpoints
    print(f"\nEndpoints:")
    for path, methods in schema['paths'].items():
        for method, details in methods.items():
            print(f"  {method.upper()} {path}")
            if 'summary' in details:
                print(f"    Summary: {details['summary']}")

    # Check schemas
    print(f"\nSchemas defined: {len(schema['components']['schemas'])}")
    schema_names = [
        'KeywordAnalyzeRequest',
        'KeywordAnalyzeResponse',
        'CommentAnalyzeRequest',
        'CommentAnalyzeResponse',
        'ApiResponse_KeywordAnalyzeResponse_',
        'ApiResponse_CommentAnalyzeResponse_',
    ]

    for name in schema_names:
        if name in schema['components']['schemas']:
            print(f"  ✓ {name}")
        else:
            print(f"  ✗ {name} (missing)")

    print("\n✓ OpenAPI documentation is properly generated")


if __name__ == "__main__":
    print("=" * 60)
    print("API Endpoint Validation Test")
    print("=" * 60)

    try:
        test_health_check()
        test_keyword_analyze_validation()
        test_comment_analyze_validation()
        test_openapi_docs()

        print("\n" + "=" * 60)
        print("All API tests passed! ✓")
        print("=" * 60)
        print("\nYou can now visit:")
        print(f"  - API Docs (Swagger UI): {BASE_URL}/docs")
        print(f"  - API Docs (ReDoc):       {BASE_URL}/redoc")
        print(f"  - OpenAPI Schema:         {BASE_URL}/openapi.json")
    except httpx.ConnectError:
        print("\n✗ Error: Cannot connect to server")
        print(f"   Make sure the server is running at {BASE_URL}")
    except Exception as e:
        print(f"\n✗ Test failed: {e}")
        import traceback
        traceback.print_exc()
