# YouTube API Setup Guide

## API Key 발급

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 생성 또는 선택
3. API & Services > Library로 이동
4. "YouTube Data API v3" 검색 및 활성화
5. Credentials > Create Credentials > API Key 생성
6. API 키 복사

## 환경 변수 설정

`backend/.env` 파일에 API 키 추가:

```env
YOUTUBE_API_KEY=YOUR_API_KEY_HERE
```

## 테스트

### 1. 서비스 단독 테스트

```bash
cd /Users/futurewave/Documents/dev/viewpulse
python backend/test_youtube_service.py
```

### 2. FastAPI 서버 시작

```bash
cd /Users/futurewave/Documents/dev/viewpulse/backend
uvicorn app.main:app --reload --port 8000
```

### 3. API 문서 확인

브라우저에서 http://localhost:8000/docs 접속

## API 엔드포인트

### 1. 동영상 검색
```
GET /api/v1/youtube/search?query=python&max_results=10
```

### 2. 동영상 상세 정보
```
GET /api/v1/youtube/videos/{video_id}
```

### 3. 댓글 조회
```
GET /api/v1/youtube/videos/{video_id}/comments?max_results=100
```

### 4. 채널 정보
```
GET /api/v1/youtube/channels/{channel_id}
```

### 5. 할당량 확인
```
GET /api/v1/youtube/quota
```

## Quota 관리

YouTube Data API v3는 일일 할당량이 10,000 units입니다.

- Search: 100 units
- Videos list: 1 unit
- CommentThreads list: 1 unit
- Channels list: 1 unit

주의: 할당량 초과 시 403 에러 발생

## 에러 처리

- 400: 잘못된 파라미터
- 403: API 할당량 초과
- 404: 리소스 없음 (video/channel not found)
- 500: API 키 미설정 또는 서버 에러

## 구현 완료 사항

- [x] YouTube API 클라이언트 (async)
- [x] 동영상 검색
- [x] 동영상 상세 정보
- [x] 댓글 조회
- [x] 채널 정보
- [x] 할당량 확인
- [x] 에러 처리 및 재시도 로직
- [x] FastAPI 라우터
- [x] Pydantic 스키마
- [x] 테스트 스크립트
