# YouTube API 테스트 시나리오

## 사전 준비

1. YOUTUBE_API_KEY 환경 변수 설정
2. FastAPI 서버 실행 (`uvicorn app.main:app --reload`)
3. API 문서 확인 (http://localhost:8000/docs)

## 테스트 케이스

### TC1: API 할당량 확인

**목적**: API 키가 정상 작동하는지 확인

```bash
curl http://localhost:8000/api/v1/youtube/quota
```

**예상 결과**:
```json
{
  "available": true,
  "message": "YouTube API is accessible"
}
```

**실패 케이스**:
- API 키 미설정: 500 에러
- 할당량 초과: `available: false`

---

### TC2: 동영상 검색 (기본)

**목적**: 키워드로 동영상 검색

```bash
curl "http://localhost:8000/api/v1/youtube/search?query=python+tutorial&max_results=5"
```

**예상 결과**:
- 200 OK
- 5개의 검색 결과 배열
- 각 항목에 video_id, title, channel_title 포함

**검증 항목**:
- [ ] video_id가 11자 문자열
- [ ] title이 비어있지 않음
- [ ] published_at가 ISO 8601 형식
- [ ] thumbnail_url이 유효한 URL

---

### TC3: 동영상 검색 (정렬 옵션)

**목적**: 정렬 옵션 테스트

```bash
# 최신순
curl "http://localhost:8000/api/v1/youtube/search?query=fastapi&order=date&max_results=3"

# 조회수순
curl "http://localhost:8000/api/v1/youtube/search?query=fastapi&order=viewCount&max_results=3"
```

**검증 항목**:
- [ ] date 정렬 시 최신 동영상 우선
- [ ] viewCount 정렬 시 인기 동영상 우선

---

### TC4: 동영상 상세 정보

**목적**: 특정 동영상의 상세 정보 조회

```bash
# 유명한 동영상 ID 사용
curl http://localhost:8000/api/v1/youtube/videos/dQw4w9WgXcQ
```

**예상 결과**:
- 200 OK
- video_id, title, description, channel_title
- view_count, like_count, comment_count (정수)
- duration (ISO 8601 duration 형식, 예: PT3M30S)
- tags 배열

**검증 항목**:
- [ ] view_count > 0
- [ ] duration 형식이 PT로 시작
- [ ] published_at가 과거 날짜

---

### TC5: 존재하지 않는 동영상

**목적**: 에러 처리 확인

```bash
curl http://localhost:8000/api/v1/youtube/videos/invalid_id_123
```

**예상 결과**:
- 404 Not Found
- `"detail": "Video not found: invalid_id_123"`

---

### TC6: 댓글 조회 (기본)

**목적**: 동영상 댓글 가져오기

```bash
curl "http://localhost:8000/api/v1/youtube/videos/dQw4w9WgXcQ/comments?max_results=10"
```

**예상 결과**:
- 200 OK
- 최대 10개의 댓글 배열
- 각 댓글에 comment_id, text, author_name, like_count

**검증 항목**:
- [ ] text가 비어있지 않음
- [ ] author_name이 존재
- [ ] like_count >= 0
- [ ] reply_count >= 0

---

### TC7: 댓글 조회 (최신순)

**목적**: 정렬 옵션 테스트

```bash
curl "http://localhost:8000/api/v1/youtube/videos/dQw4w9WgXcQ/comments?max_results=5&order=time"
```

**검증 항목**:
- [ ] published_at 최신순 정렬
- [ ] 첫 번째 댓글이 가장 최근

---

### TC8: 댓글 비활성화 동영상

**목적**: 댓글이 없는 경우 처리

```bash
# 댓글 비활성화된 동영상 ID 사용
curl "http://localhost:8000/api/v1/youtube/videos/{댓글_비활성화_ID}/comments"
```

**예상 결과**:
- 200 OK
- 빈 배열 `[]`

---

### TC9: 채널 정보 조회

**목적**: 채널 통계 정보 가져오기

```bash
# YouTube 공식 채널
curl http://localhost:8000/api/v1/youtube/channels/UCBR8-60-B28hp2BmDPdntcQ
```

**예상 결과**:
- 200 OK
- channel_id, title, description
- subscriber_count, video_count, view_count (정수)
- custom_url, thumbnail_url

**검증 항목**:
- [ ] subscriber_count > 0
- [ ] video_count > 0
- [ ] custom_url이 존재

---

### TC10: 존재하지 않는 채널

**목적**: 에러 처리 확인

```bash
curl http://localhost:8000/api/v1/youtube/channels/invalid_channel_123
```

**예상 결과**:
- 404 Not Found
- `"detail": "Channel not found: invalid_channel_123"`

---

### TC11: 파라미터 검증 (검색)

**목적**: 입력 검증 테스트

```bash
# 빈 쿼리
curl "http://localhost:8000/api/v1/youtube/search?query="

# 범위 초과
curl "http://localhost:8000/api/v1/youtube/search?query=test&max_results=100"
```

**예상 결과**:
- 422 Unprocessable Entity (Pydantic 검증)
- 또는 400 Bad Request (비즈니스 로직 검증)

---

### TC12: 할당량 초과 시뮬레이션

**목적**: 할당량 초과 시 에러 처리

**시나리오**:
1. 할당량이 거의 다 찬 상태에서 검색 API 호출
2. 403 에러 발생 확인

**예상 결과**:
```json
{
  "detail": "YouTube API quota exceeded. Please try again later."
}
```

---

### TC13: 네트워크 재시도

**목적**: 일시적 네트워크 에러 재시도

**시나리오**:
1. 네트워크가 불안정한 상태에서 API 호출
2. 자동 재시도 (최대 3회) 확인

**검증 방법**:
- 로그에서 재시도 메시지 확인
- 최종적으로 성공 또는 에러 반환

---

### TC14: 동시 요청 처리

**목적**: 비동기 처리 성능 확인

```bash
# 5개의 동시 요청
for i in {1..5}; do
  curl "http://localhost:8000/api/v1/youtube/search?query=test$i" &
done
wait
```

**검증 항목**:
- [ ] 모든 요청이 정상 처리
- [ ] 응답 시간이 순차 처리보다 빠름

---

### TC15: 통합 시나리오 (프론트엔드 워크플로우)

**목적**: 실제 사용 패턴 테스트

**시나리오**:
1. 할당량 확인
2. "machine learning" 검색 (10개)
3. 첫 번째 결과의 video_id 추출
4. 해당 동영상 상세 정보 조회
5. 해당 동영상 댓글 조회 (20개)
6. 채널 정보 조회

**검증 항목**:
- [ ] 모든 단계 성공
- [ ] 데이터 일관성 (video_id, channel_id)
- [ ] 총 소요 시간 < 5초

---

## 자동화 테스트 실행

### Python 테스트 스크립트

```bash
cd /Users/futurewave/Documents/dev/viewpulse
python backend/test_youtube_service.py
```

### 예상 출력

```
============================================================
YouTube API Service Test Suite
============================================================

=== Testing Quota Check ===
API Available: True
Message: YouTube API is accessible

=== Testing Video Search ===
Found 3 videos

1. Python Tutorial for Beginners
   Video ID: xxxxxxxxxxxxx
   Channel: Programming Channel
   Published: 2024-01-15 10:30:00+00:00

...

============================================================
All tests completed successfully!
============================================================
```

---

## 성능 벤치마크

| 엔드포인트 | 평균 응답 시간 | API Quota 비용 |
|-----------|--------------|--------------|
| /search | 500-800ms | 100 units |
| /videos/{id} | 300-500ms | 1 unit |
| /videos/{id}/comments | 400-700ms | 1 unit |
| /channels/{id} | 300-500ms | 1 unit |
| /quota | 200-400ms | 1 unit |

---

## 체크리스트

### 기능 완성도
- [ ] 모든 엔드포인트 정상 작동
- [ ] 에러 처리 적절
- [ ] 파라미터 검증 동작
- [ ] 할당량 확인 기능

### 코드 품질
- [ ] 타입 힌트 완료
- [ ] Docstring 작성
- [ ] 에러 메시지 명확
- [ ] 로깅 적절

### 문서화
- [ ] API 문서 자동 생성 (FastAPI)
- [ ] Setup 가이드 제공
- [ ] 테스트 시나리오 문서화

---

## 이슈 트래킹

### 알려진 제한사항
1. 댓글 최대 100개만 조회 가능 (API 제한)
2. 일일 할당량 10,000 units (무료 티어)
3. 재시도는 네트워크 에러만 해당 (비즈니스 로직 에러는 즉시 반환)

### 개선 사항
1. 캐싱 추가 (Redis)
2. Rate limiting
3. 페이지네이션 지원
4. Webhook 지원 (실시간 알림)
