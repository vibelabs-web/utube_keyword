# YouTube API 빠른 시작 가이드

## 1. API 키 설정

`backend/.env` 파일에 YouTube API 키 추가:

```env
YOUTUBE_API_KEY=YOUR_ACTUAL_API_KEY_HERE
```

API 키 발급: https://console.cloud.google.com/

## 2. 서버 실행

```bash
cd /Users/futurewave/Documents/dev/viewpulse/backend
uvicorn app.main:app --reload --port 8000
```

## 3. 테스트

### 방법 1: 브라우저
http://localhost:8000/docs

### 방법 2: curl
```bash
# 할당량 확인
curl http://localhost:8000/api/v1/youtube/quota

# 동영상 검색
curl "http://localhost:8000/api/v1/youtube/search?query=python"
```

### 방법 3: 자동 테스트
```bash
# Python 테스트
python backend/test_youtube_service.py

# API 테스트 (서버 실행 중이어야 함)
./backend/test_youtube_api.sh
```

## 4. 사용 예시

### 동영상 검색 후 상세 정보 조회

```bash
# 1. 검색
RESULT=$(curl -s "http://localhost:8000/api/v1/youtube/search?query=FastAPI&max_results=1")

# 2. video_id 추출
VIDEO_ID=$(echo $RESULT | jq -r '.[0].video_id')

# 3. 상세 정보
curl "http://localhost:8000/api/v1/youtube/videos/$VIDEO_ID"

# 4. 댓글 조회
curl "http://localhost:8000/api/v1/youtube/videos/$VIDEO_ID/comments?max_results=10"
```

## API 엔드포인트

| 엔드포인트 | 설명 |
|-----------|------|
| `GET /api/v1/youtube/search` | 동영상 검색 |
| `GET /api/v1/youtube/videos/{video_id}` | 동영상 상세 |
| `GET /api/v1/youtube/videos/{video_id}/comments` | 댓글 조회 |
| `GET /api/v1/youtube/channels/{channel_id}` | 채널 정보 |
| `GET /api/v1/youtube/quota` | 할당량 확인 |

자세한 문서: `backend/YOUTUBE_API_SETUP.md`
