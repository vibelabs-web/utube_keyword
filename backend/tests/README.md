# Backend Test Suite

## Overview

This test suite provides comprehensive testing for the Zettel backend API using pytest and pytest-asyncio.

## Test Structure

```
tests/
├── __init__.py
├── conftest.py          # Test fixtures and configuration
├── api/                 # API endpoint tests
│   ├── __init__.py
│   ├── test_health.py   # Health check endpoint tests
│   └── test_endpoints.py # Keywords & comments API tests
└── services/            # Service layer tests
    └── __init__.py
```

## Setup

### Install Dependencies

```bash
cd /Users/futurewave/Documents/dev/zettel/backend
source venv/bin/activate
pip install -r requirements.txt
```

### Test Dependencies

- pytest >= 7.4.0
- pytest-asyncio >= 0.21.0
- pytest-cov >= 4.1.0

## Running Tests

### Run All Tests

```bash
pytest
```

### Run with Verbose Output

```bash
pytest -v
```

### Run Specific Test File

```bash
pytest tests/api/test_health.py
```

### Run Specific Test Class

```bash
pytest tests/api/test_endpoints.py::TestKeywordEndpoint
```

### Run Specific Test Function

```bash
pytest tests/api/test_health.py::test_health_check
```

### Run with Coverage Report

```bash
pytest --cov=app --cov-report=html
```

Coverage report will be generated in `htmlcov/` directory.

### Run Tests in Watch Mode

```bash
pytest-watch
```

## Test Configuration

Test configuration is defined in `pyproject.toml`:

- **asyncio_mode**: "auto" - Automatically detect async tests
- **testpaths**: ["tests"] - Search for tests in tests directory
- **python_files**: "test_*.py" - Test files must start with "test_"
- **python_classes**: "Test*" - Test classes must start with "Test"
- **python_functions**: "test_*" - Test functions must start with "test_"
- **addopts**: "-v --tb=short --cov=app --cov-report=term-missing --cov-report=html"

## Test Fixtures

### Database Fixtures

- `test_db_engine`: Creates a test SQLite in-memory database
- `db_session`: Provides a database session for tests
- `async_client`: Provides an async HTTP client for API testing

### Mock Data Fixtures

- `test_settings`: Override settings for testing
- `mock_youtube_api_response`: Mock YouTube API video response
- `mock_comments_data`: Mock YouTube comments data

## Test Database

Tests use an in-memory SQLite database (`sqlite+aiosqlite:///:memory:`):

- Isolated from production database
- Fresh database for each test
- Automatic cleanup after each test
- Fast and efficient

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Async Testing**: Use `@pytest.mark.asyncio` for async tests
3. **Fixtures**: Use fixtures for common setup/teardown
4. **Mocking**: Mock external services (YouTube API, etc.)
5. **Coverage**: Aim for >80% code coverage
6. **Naming**: Use descriptive test names (test_what_condition_expected)

## Current Test Coverage

Run `pytest --cov=app` to see current coverage:

```
Name                       Stmts   Miss  Cover
------------------------------------------------
app/api/v1/endpoints.py        9      0   100%
app/core/config.py            11      0   100%
app/schemas/comment.py        51      3    94%
app/schemas/keyword.py        29      1    97%
...
```

## Adding New Tests

### 1. Create Test File

```python
# tests/api/test_new_feature.py
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_new_feature(async_client: AsyncClient):
    response = await async_client.get("/api/v1/new-feature")
    assert response.status_code == 200
```

### 2. Use Fixtures

```python
@pytest.mark.asyncio
async def test_with_db(async_client: AsyncClient, db_session):
    # Test with database access
    pass
```

### 3. Mock External Services

```python
from unittest.mock import patch

@pytest.mark.asyncio
async def test_with_mock(async_client: AsyncClient):
    with patch("app.services.youtube.get_video_info") as mock_get:
        mock_get.return_value = {"title": "Test Video"}
        response = await async_client.post("/api/v1/analyze")
        assert response.status_code == 200
```

## Troubleshooting

### Test Discovery Issues

If tests are not discovered:
```bash
pytest --collect-only
```

### Async Test Issues

Ensure pytest-asyncio is installed and asyncio_mode is set in pyproject.toml.

### Database Issues

If database tests fail, check that:
- SQLite is available
- aiosqlite is installed
- Test database URL is correct in conftest.py

## CI/CD Integration

For CI/CD pipelines:

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: |
    pip install -r requirements.txt
    pytest --cov=app --cov-report=xml

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Resources

- [pytest documentation](https://docs.pytest.org/)
- [pytest-asyncio documentation](https://pytest-asyncio.readthedocs.io/)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)
