# ViewPulse - 빠른 시작 가이드

프로젝트를 5분 안에 실행하는 방법

## 전제 조건

- Python 3.11 이상
- Node.js 20 이상
- YouTube Data API 키 ([발급 방법](#youtube-api-키-발급))

## 방법 1: 로컬 개발 환경 (권장)

### 1단계: 환경 변수 설정

```bash
# 프로젝트 루트
cd /Users/futurewave/Documents/dev/viewpulse
cp .env.example .env

# .env 파일 편집
echo "YOUTUBE_API_KEY=your_actual_api_key" > .env
echo "SECRET_KEY=$(openssl rand -hex 32)" >> .env
```

### 2단계: 백엔드 실행

```bash
# 터미널 1
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# .env 설정
cp .env.example .env
# YOUTUBE_API_KEY와 SECRET_KEY 복사

# 서버 실행
uvicorn app.main:app --reload --port 8000
```

### 3단계: 프론트엔드 실행

```bash
# 터미널 2
cd frontend
npm install
npm run dev
```

### 4단계: 접속

브라우저에서 http://localhost:5173 열기

## 방법 2: Docker Compose

### 1단계: 환경 변수 설정

```bash
cd /Users/futurewave/Documents/dev/viewpulse
cp .env.example .env

# .env 파일 편집
echo "YOUTUBE_API_KEY=your_actual_api_key" > .env
echo "SECRET_KEY=$(openssl rand -hex 32)" >> .env
```

### 2단계: Docker 실행

```bash
# 개발 환경 (코드 변경 자동 반영)
docker compose -f docker-compose.dev.yml up --build

# 또는 프로덕션 환경
docker compose up --build
```

### 3단계: 접속

브라우저에서 http://localhost:5173 열기

## 테스트 확인

### 백엔드 헬스체크
```bash
curl http://localhost:8000/health
# {"status":"healthy","service":"viewpulse-api","version":"0.1.0"}
```

### API 문서
http://localhost:8000/docs

### 통합 테스트
```bash
chmod +x test-integration.sh
./test-integration.sh
```

## YouTube API 키 발급

1. https://console.cloud.google.com/ 접속
2. 새 프로젝트 생성
3. "API 및 서비스" > "라이브러리" 클릭
4. "YouTube Data API v3" 검색 및 활성화
5. "사용자 인증 정보" 클릭 > "API 키 만들기"
6. 생성된 키를 `.env` 파일에 추가

## 주요 기능 테스트

### 1. 키워드 분석
```bash
curl -X POST http://localhost:8000/api/v1/youtube/analyze-keyword \
  -H "Content-Type: application/json" \
  -d '{"keyword":"python tutorial"}'
```

### 2. 댓글 분석
```bash
curl -X POST http://localhost:8000/api/v1/comments/analyze \
  -H "Content-Type: application/json" \
  -d '{"video_id":"dQw4w9WgXcQ"}'
```

## 트러블슈팅

### 포트가 이미 사용 중입니다
```bash
# Mac/Linux
lsof -i :8000
kill -9 <PID>

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### 모듈을 찾을 수 없습니다 (백엔드)
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### 의존성 설치 실패 (프론트엔드)
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Docker 빌드 실패
```bash
docker compose down --rmi all
docker compose up --build
```

## 다음 단계

- [전체 README 읽기](./README.md)
- [API 문서 확인](http://localhost:8000/docs)
- [테스트 실행](./TESTING.md)
- [코딩 컨벤션](./docs/planning/07-coding-convention.md)

## 도움이 필요하신가요?

- GitHub Issues: https://github.com/username/viewpulse/issues
- 백엔드 문서: [backend/QUICKSTART.md](./backend/QUICKSTART.md)
- 프론트엔드 문서: [frontend/README.md](./frontend/README.md)
