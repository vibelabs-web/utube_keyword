# ViewPulse - YouTube 분석 도구

> **바이브랩스 오픈톡방**: https://open.kakao.com/o/gfYQfFPh

바이브코딩 채널 성장을 위한 데이터 분석 도구

## 주요 기능

### 1. 키워드 분석
- YouTube 검색량 추정
- 경쟁도 분석 (낮음/중간/높음)
- 추천 점수 계산 (1-100점)
- 관련 키워드 추출

### 2. 댓글 분석
- 빈도 높은 단어 추출
- 시청자 요청사항 감지
- 감정 분석 (긍정/부정/중립)
- 워드클라우드 시각화

## 기술 스택

### 백엔드
- **FastAPI** - 현대적인 Python 웹 프레임워크
- **SQLAlchemy 2.0** - Async ORM
- **SQLite + aiosqlite** - 경량 데이터베이스
- **Pydantic** - 데이터 검증 및 직렬화
- **Alembic** - 데이터베이스 마이그레이션
- **YouTube Data API v3** - YouTube 데이터 수집

### 프론트엔드
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **TailwindCSS 4.x** - 유틸리티 우선 CSS
- **TanStack Query** - 서버 상태 관리
- **React Router** - 클라이언트 사이드 라우팅
- **Vite** - 빌드 도구

## 시작하기

### 사전 요구사항
- Python 3.11 이상
- Node.js 20 이상
- YouTube Data API 키 ([발급 방법](#youtube-api-키-발급))

### 설치

#### 1. 저장소 클론
```bash
git clone https://github.com/username/viewpulse.git
cd viewpulse
```

#### 2. 환경 변수 설정
```bash
# 프로젝트 루트에서
cp .env.example .env

# .env 파일 편집
# YOUTUBE_API_KEY=your_actual_api_key
# SECRET_KEY=your_secret_key
```

#### 3. 백엔드 설정
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# .env 파일 설정
cp .env.example .env
# 필요한 환경 변수 수정
```

#### 4. 프론트엔드 설정
```bash
cd frontend
npm install

# .env 파일 설정 (필요시)
cp .env.example .env
```

### 실행

#### 개발 모드

**터미널 1: 백엔드**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

**터미널 2: 프론트엔드**
```bash
cd frontend
npm run dev
```

브라우저에서 http://localhost:5173 접속

#### Docker Compose 실행

```bash
# 프로젝트 루트에서
docker compose up --build

# 백그라운드 실행
docker compose up -d

# 종료
docker compose down
```

Docker 실행 시:
- 백엔드: http://localhost:8000
- 프론트엔드: http://localhost:5173
- API 문서: http://localhost:8000/docs

### 테스트

#### 백엔드 테스트
```bash
cd backend
pytest

# 커버리지 포함
pytest --cov=app --cov-report=html
```

#### 프론트엔드 테스트
```bash
cd frontend
npm test

# E2E 테스트 (Playwright)
npm run test:e2e
```

## API 문서

백엔드 서버 실행 후 자동 생성되는 문서:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 주요 엔드포인트

#### 키워드 분석
```
POST /api/v1/youtube/analyze-keyword
Content-Type: application/json

{
  "keyword": "파이썬 튜토리얼"
}
```

#### 댓글 분석
```
POST /api/v1/comments/analyze
Content-Type: application/json

{
  "video_id": "dQw4w9WgXcQ"
}
```

## 프로젝트 구조

```
viewpulse/
├── backend/
│   ├── app/
│   │   ├── api/              # API 엔드포인트 (레거시)
│   │   ├── core/             # 설정 및 유틸리티
│   │   ├── db/               # 데이터베이스 설정
│   │   ├── models/           # SQLAlchemy 모델
│   │   ├── routers/          # FastAPI 라우터
│   │   ├── schemas/          # Pydantic 스키마
│   │   ├── services/         # 비즈니스 로직
│   │   └── main.py           # FastAPI 앱 진입점
│   ├── tests/                # 테스트 코드
│   ├── alembic/              # 마이그레이션
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/       # 재사용 가능한 UI 컴포넌트
│   │   ├── hooks/            # 커스텀 React 훅
│   │   ├── pages/            # 페이지 컴포넌트
│   │   ├── services/         # API 클라이언트
│   │   ├── types/            # TypeScript 타입 정의
│   │   ├── App.tsx           # 앱 루트 컴포넌트
│   │   └── main.tsx          # 엔트리 포인트
│   ├── e2e/                  # Playwright E2E 테스트
│   ├── public/               # 정적 파일
│   ├── Dockerfile
│   ├── nginx.conf            # Nginx 설정 (프로덕션)
│   ├── package.json
│   └── .env.example
├── docs/
│   └── planning/             # 기획 문서
│       ├── 01-prd.md         # 제품 요구사항 문서
│       ├── 02-trd.md         # 기술 요구사항 문서
│       ├── 03-user-flow.md   # 사용자 플로우
│       ├── 04-database-design.md
│       ├── 05-design-system.md
│       └── 07-coding-convention.md
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## YouTube API 키 발급

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "API 및 서비스" > "라이브러리"로 이동
4. "YouTube Data API v3" 검색 및 활성화
5. "API 및 서비스" > "사용자 인증 정보"로 이동
6. "사용자 인증 정보 만들기" > "API 키" 선택
7. 생성된 API 키를 `.env` 파일에 추가

자세한 내용은 [YouTube API Setup Guide](./backend/YOUTUBE_API_SETUP.md) 참조

## 개발 가이드

### 코딩 컨벤션
- [코딩 컨벤션 문서](./docs/planning/07-coding-convention.md) 참조

### 주요 개발 원칙
1. **타입 안정성**: TypeScript와 Pydantic을 통한 엄격한 타입 검증
2. **에러 우선 설계**: 모든 엣지 케이스 처리
3. **의존성 주입**: FastAPI의 DI 시스템 활용
4. **테스트 커버리지**: 핵심 로직 80% 이상

### Git 워크플로우
```bash
# 기능 브랜치 생성
git checkout -b feature/new-feature

# 커밋 (Conventional Commits)
git commit -m "feat: add keyword analysis feature"

# 푸시
git push origin feature/new-feature
```

## 배포

### 프로덕션 빌드

**백엔드**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**프론트엔드**
```bash
cd frontend
npm run build
# dist/ 디렉토리를 웹 서버에 배포
```

### Docker 프로덕션 배포
```bash
docker compose -f docker-compose.prod.yml up -d
```

## 트러블슈팅

### 백엔드 서버가 시작되지 않을 때
- `.env` 파일에 `YOUTUBE_API_KEY`가 설정되어 있는지 확인
- SQLite 데이터베이스 경로가 올바른지 확인
- Python 버전이 3.11 이상인지 확인

### 프론트엔드에서 API 호출 실패
- 백엔드 서버가 실행 중인지 확인 (http://localhost:8000/health)
- Vite 프록시 설정이 올바른지 확인 (`vite.config.ts`)
- CORS 설정 확인 (`backend/app/main.py`)

### Docker 컨테이너 빌드 실패
- Docker와 Docker Compose가 설치되어 있는지 확인
- `.env` 파일이 프로젝트 루트에 존재하는지 확인
- 포트 충돌 확인 (8000, 5173)

## 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 라이선스

MIT License

## 문의

프로젝트 관련 문의: [GitHub Issues](https://github.com/username/viewpulse/issues)

## 감사의 말

이 프로젝트는 바이브코딩 채널의 성장을 위해 개발되었습니다.
