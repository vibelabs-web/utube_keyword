# T2.1 - 댓글 수집 API: RED→GREEN 완료

## 개요
TDD 워크플로우를 따라 YouTube 댓글 수집 API를 구현했습니다.

## 구현된 파일

### 1. 테스트 파일
- **파일**: `/Users/futurewave/Documents/dev/viewpulse/backend/tests/api/test_comments.py`
- **테스트 케이스**:
  - `test_analyze_comments_success`: 댓글 분석 성공 케이스
  - `test_analyze_comments_video_info`: 비디오 정보 검증
  - `test_analyze_invalid_url`: 잘못된 URL 에러 처리
  - `test_analyze_missing_protocol`: 프로토콜 없는 URL 처리
  - `test_analyze_youtube_shortlink`: youtu.be 짧은 링크 지원
  - `test_analyze_embed_url`: embed URL 지원

### 2. 서비스 레이어
- **파일**: `/Users/futurewave/Documents/dev/viewpulse/backend/app/services/comment_collector.py`
- **주요 기능**:
  - `collect_comments()`: YouTube 영상 댓글 수집
  - `_extract_video_id()`: 다양한 YouTube URL 형식에서 video_id 추출
- **지원 URL 형식**:
  - `https://www.youtube.com/watch?v=VIDEO_ID`
  - `https://youtu.be/VIDEO_ID`
  - `https://www.youtube.com/embed/VIDEO_ID`
  - `https://m.youtube.com/watch?v=VIDEO_ID`

### 3. API 엔드포인트
- **파일**: `/Users/futurewave/Documents/dev/viewpulse/backend/app/api/v1/endpoints.py`
- **엔드포인트**: `POST /api/v1/comments/analyze`
- **Request Body**:
  ```json
  {
    "video_url": "https://www.youtube.com/watch?v=VIDEO_ID"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "video_info": {
        "video_id": "VIDEO_ID",
        "title": "영상 제목",
        "channel_title": "채널 이름",
        "view_count": 15000,
        "comment_count": 342
      },
      "frequent_words": [],
      "viewer_requests": [],
      "sentiment": null,
      "analyzed_at": "2026-01-17T12:00:00"
    },
    "error": null,
    "timestamp": "2026-01-17T12:00:00"
  }
  ```

### 4. 스키마 수정
- **파일**: `/Users/futurewave/Documents/dev/viewpulse/backend/app/schemas/comment.py`
- **변경사항**: `sentiment` 필드를 Optional로 변경 (T2.2에서 구현 예정)

### 5. 기타 수정
- **파일**: `/Users/futurewave/Documents/dev/viewpulse/backend/app/routers/youtube.py`
- **수정**: Path 파라미터 타입 힌트 수정 (Query → Path)
- **파일**: `/Users/futurewave/Documents/dev/viewpulse/backend/app/services/keyword_analyzer.py`
- **수정**: Python 3.9 호환성을 위한 타입 힌트 수정 (| None → Optional)

## 테스트 결과

```bash
cd /Users/futurewave/Documents/dev/viewpulse/backend
python3 -m pytest tests/api/test_comments.py -v
```

**결과**: 6/6 테스트 통과 (100%)

```
tests/api/test_comments.py::TestCommentAnalyze::test_analyze_comments_success PASSED
tests/api/test_comments.py::TestCommentAnalyze::test_analyze_comments_video_info PASSED
tests/api/test_comments.py::TestCommentAnalyze::test_analyze_invalid_url PASSED
tests/api/test_comments.py::TestCommentAnalyze::test_analyze_missing_protocol PASSED
tests/api/test_comments.py::TestCommentAnalyze::test_analyze_youtube_shortlink PASSED
tests/api/test_comments.py::TestCommentAnalyze::test_analyze_embed_url PASSED
```

## TDD 워크플로우

### RED 단계
1. 테스트 먼저 작성: `test_comments.py`
2. 테스트 실행 → 실패 확인 (ModuleNotFoundError)

### GREEN 단계
1. 최소 구현:
   - `CommentCollectorService` 생성
   - API 엔드포인트 구현
   - 스키마 수정
2. 테스트 재실행 → 통과 확인 (6/6 passed)

## 주요 로직

### URL 파싱
정규표현식을 사용하여 다양한 YouTube URL 형식 지원:
```python
patterns = [
    r'(?:https?://)?(?:www\.)?youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})',
    r'(?:https?://)?youtu\.be/([a-zA-Z0-9_-]{11})',
    r'(?:https?://)?(?:www\.)?youtube\.com/embed/([a-zA-Z0-9_-]{11})',
    r'(?:https?://)?m\.youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})',
]
```

### 댓글 수집
- YouTube Data API `get_video_comments()` 사용
- 최대 100개 수집 (API 할당량 최적화)
- relevance 기준 정렬

### 에러 처리
- `ValueError`: 잘못된 URL 형식 → 422 Unprocessable Entity
- `YouTubeQuotaExceededError`: API 할당량 초과 → 200 with success=false
- `YouTubeAPIError`: 기타 API 에러 → 200 with success=false
- `Exception`: 예상치 못한 에러 → 500 Internal Server Error

## 완료 조건 체크리스트

- [x] 테스트 먼저 작성됨 (RED 확인)
- [x] 영상 URL에서 댓글 수집 성공
- [x] 다양한 YouTube URL 형식 지원
- [x] 댓글 비활성화 시 빈 배열 반환 (YouTube API 서비스에서 처리)
- [x] 모든 테스트 통과 (6/6)
- [x] 기존 테스트 영향 없음 (comment endpoint 관련 10/10 통과)

## API 사용 예시

### cURL
```bash
curl -X POST http://localhost:8000/api/v1/comments/analyze \
  -H "Content-Type: application/json" \
  -d '{"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

### Python
```python
import httpx

async with httpx.AsyncClient() as client:
    response = await client.post(
        "http://localhost:8000/api/v1/comments/analyze",
        json={"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
    )
    data = response.json()
    print(data["data"]["video_info"])
```

## 다음 단계: T2.2

T2.2에서는 다음 기능을 구현할 예정입니다:
- 빈도수 높은 단어 추출 (`frequent_words`)
- 시청자 요청사항 추출 (`viewer_requests`)
- 감정 분석 (`sentiment`)

현재 이 필드들은 빈 배열 또는 null로 반환되고 있습니다.

## 참고 사항

- YouTube Data API 할당량 절약을 위해 댓글은 최대 100개만 수집
- Python 3.9 호환성 유지 (타입 힌트 `Optional` 사용)
- Pydantic v2 ConfigDict 사용
- pytest-asyncio로 비동기 테스트 구현
- Mock을 사용하여 YouTube API 호출 없이 테스트
