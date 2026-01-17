# Coding Convention & AI Collaboration Guide

> 유튜브 키워드 분석기 & 댓글 분석기 - 개발 가이드

---

## MVP 캡슐

| # | 항목 | 내용 |
|---|------|------|
| 1 | 목표 | 바이브코딩 채널의 성장 속도를 높이기 위해 잘 될 콘텐츠 주제를 데이터 기반으로 찾는다 |
| 2 | 페르소나 | 바이브코딩 유튜버 (구독자 5,000명, 영상 50개, 성장 가속화 희망) |
| 3 | 핵심 기능 | FEAT-1: 키워드 분석, FEAT-2: 댓글 분석 |
| 4 | 성공 지표 (노스스타) | 분석 도구를 통해 선정한 주제의 영상 조회수 10,000회 달성 |
| 5 | 입력 지표 | 주 1회 이상 키워드 분석 실행, 월 4회 이상 댓글 분석 실행 |
| 6 | 비기능 요구 | API 응답 시간 5초 이내, 웹 인터페이스 |
| 7 | Out-of-scope | 다른 사용자 서비스, 모바일 앱, 유료화, 인증 시스템 |
| 8 | Top 리스크 | 시간 부족으로 개발 중단 |
| 9 | 완화/실험 | MVP 기능 최소화, 1~2주 내 완료 목표, AI 코딩 활용 |
| 10 | 다음 단계 | YouTube Data API 키 발급 및 테스트 |

---

## 1. 핵심 원칙

### 1.1 빠른 개발 우선

- MVP는 1~2주 내 완성 목표
- 완벽보다 작동하는 코드 우선
- 리팩토링은 기능 완성 후

### 1.2 AI 협업 원칙

- AI가 생성한 코드는 반드시 이해하고 검증
- 한 번에 하나의 작업 요청
- 컨텍스트를 명확하게 전달

### 1.3 단순함 유지

- 본인만 사용하는 도구임을 기억
- 불필요한 추상화 금지
- 오버엔지니어링 금지

---

## 2. 프로젝트 구조

```
viewpulse/
├── frontend/                    # React 프론트엔드
│   ├── src/
│   │   ├── components/         # 재사용 컴포넌트
│   │   │   ├── ui/            # 기본 UI (Button, Input, Card)
│   │   │   ├── keyword/       # 키워드 분석 관련
│   │   │   └── comment/       # 댓글 분석 관련
│   │   ├── pages/             # 페이지 컴포넌트
│   │   │   ├── KeywordPage.tsx
│   │   │   └── CommentPage.tsx
│   │   ├── hooks/             # 커스텀 훅
│   │   │   ├── useKeywordAnalysis.ts
│   │   │   └── useCommentAnalysis.ts
│   │   ├── services/          # API 호출
│   │   │   └── api.ts
│   │   ├── stores/            # Zustand 스토어
│   │   │   └── analysisStore.ts
│   │   ├── types/             # TypeScript 타입
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/                    # FastAPI 백엔드
│   ├── app/
│   │   ├── api/               # API 라우트
│   │   │   ├── __init__.py
│   │   │   ├── keywords.py
│   │   │   └── comments.py
│   │   ├── core/              # 설정
│   │   │   ├── __init__.py
│   │   │   ├── config.py
│   │   │   └── database.py
│   │   ├── models/            # SQLAlchemy 모델
│   │   │   ├── __init__.py
│   │   │   └── analysis.py
│   │   ├── schemas/           # Pydantic 스키마
│   │   │   ├── __init__.py
│   │   │   ├── keyword.py
│   │   │   └── comment.py
│   │   ├── services/          # 비즈니스 로직
│   │   │   ├── __init__.py
│   │   │   ├── youtube.py
│   │   │   ├── keyword_analyzer.py
│   │   │   └── comment_analyzer.py
│   │   └── main.py
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_keywords.py
│   │   └── test_comments.py
│   ├── requirements.txt
│   └── pyproject.toml
│
├── docs/
│   └── planning/              # 기획 문서
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 3. 네이밍 규칙

### 3.1 파일 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| React 컴포넌트 | PascalCase | `KeywordCard.tsx` |
| React 훅 | camelCase + use 접두사 | `useKeywordAnalysis.ts` |
| TypeScript 유틸 | camelCase | `formatNumber.ts` |
| Python 모듈 | snake_case | `keyword_analyzer.py` |
| Python 클래스 | PascalCase | `KeywordAnalyzer` |

### 3.2 코드 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| React 컴포넌트 | PascalCase | `KeywordCard` |
| React 훅 | camelCase | `useKeywordAnalysis` |
| 함수 (JS/TS) | camelCase | `formatSearchVolume` |
| 함수 (Python) | snake_case | `analyze_keyword` |
| 상수 | UPPER_SNAKE | `MAX_COMMENTS` |
| 타입/인터페이스 | PascalCase | `KeywordResult` |
| CSS 클래스 | kebab-case (Tailwind 사용) | - |

---

## 4. 프론트엔드 가이드

### 4.1 컴포넌트 구조

```tsx
// components/keyword/KeywordCard.tsx
import { FC } from 'react';
import { KeywordResult } from '@/types';
import { formatNumber } from '@/utils/format';

interface KeywordCardProps {
  keyword: KeywordResult;
  onAnalyze?: (keyword: string) => void;
}

export const KeywordCard: FC<KeywordCardProps> = ({ keyword, onAnalyze }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold">{keyword.keyword}</h3>
      <p className="text-2xl font-bold">{formatNumber(keyword.searchVolume)}</p>
    </div>
  );
};
```

### 4.2 커스텀 훅 구조

```tsx
// hooks/useKeywordAnalysis.ts
import { useState, useCallback } from 'react';
import { analyzeKeyword } from '@/services/api';
import { KeywordResult } from '@/types';

export const useKeywordAnalysis = () => {
  const [data, setData] = useState<KeywordResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (keyword: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeKeyword(keyword);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '분석 중 오류 발생');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, analyze };
};
```

### 4.3 API 서비스

```tsx
// services/api.ts
import axios from 'axios';
import { KeywordResult, CommentResult } from '@/types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 30000,
});

export const analyzeKeyword = async (keyword: string): Promise<KeywordResult> => {
  const { data } = await api.post('/keywords/analyze', { keyword });
  return data.data;
};

export const analyzeComments = async (videoUrl: string): Promise<CommentResult> => {
  const { data } = await api.post('/comments/analyze', { video_url: videoUrl });
  return data.data;
};
```

### 4.4 타입 정의

```tsx
// types/index.ts
export interface KeywordResult {
  keyword: string;
  searchVolume: number;
  competition: 'low' | 'medium' | 'high';
  competitionScore: number;
  relatedKeywords: RelatedKeyword[];
}

export interface RelatedKeyword {
  keyword: string;
  searchVolume: number;
  competition: 'low' | 'medium' | 'high';
}

export interface CommentResult {
  videoId: string;
  videoTitle: string;
  totalComments: number;
  analyzedComments: number;
  frequentWords: WordCount[];
  requests: UserRequest[];
  sentiment: Sentiment;
}

export interface WordCount {
  word: string;
  count: number;
}

export interface UserRequest {
  text: string;
  likes: number;
}

export interface Sentiment {
  positive: number;
  neutral: number;
  negative: number;
}
```

---

## 5. 백엔드 가이드

### 5.1 API 라우트

```python
# app/api/keywords.py
from fastapi import APIRouter, HTTPException
from app.schemas.keyword import KeywordRequest, KeywordResponse
from app.services.keyword_analyzer import KeywordAnalyzer

router = APIRouter(prefix="/keywords", tags=["keywords"])
analyzer = KeywordAnalyzer()

@router.post("/analyze", response_model=KeywordResponse)
async def analyze_keyword(request: KeywordRequest):
    """키워드 분석 API"""
    try:
        result = await analyzer.analyze(request.keyword)
        return {"data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 5.2 Pydantic 스키마

```python
# app/schemas/keyword.py
from pydantic import BaseModel, Field
from typing import List, Literal
from datetime import datetime

class KeywordRequest(BaseModel):
    keyword: str = Field(..., min_length=1, max_length=100)
    include_related: bool = True

class RelatedKeyword(BaseModel):
    keyword: str
    search_volume: int
    competition: Literal["low", "medium", "high"]

class KeywordData(BaseModel):
    keyword: str
    search_volume: int
    competition: Literal["low", "medium", "high"]
    competition_score: float = Field(..., ge=0, le=1)
    related_keywords: List[RelatedKeyword]

class KeywordResponse(BaseModel):
    data: KeywordData
    meta: dict = {"timestamp": datetime.utcnow().isoformat()}
```

### 5.3 서비스 레이어

```python
# app/services/keyword_analyzer.py
from typing import Optional
from app.schemas.keyword import KeywordData, RelatedKeyword
from app.services.youtube import YouTubeService
from app.core.database import get_cached, set_cached

class KeywordAnalyzer:
    def __init__(self):
        self.youtube = YouTubeService()

    async def analyze(self, keyword: str) -> KeywordData:
        # 캐시 확인
        cached = await get_cached(f"keyword:{keyword}")
        if cached:
            return KeywordData(**cached)

        # YouTube API 호출
        search_results = await self.youtube.search(keyword)

        # 경쟁도 계산
        competition_score = self._calculate_competition(search_results)
        competition = self._score_to_level(competition_score)

        # 관련 키워드 추출
        related = await self._get_related_keywords(keyword)

        result = KeywordData(
            keyword=keyword,
            search_volume=self._estimate_search_volume(search_results),
            competition=competition,
            competition_score=competition_score,
            related_keywords=related,
        )

        # 캐시 저장 (7일)
        await set_cached(f"keyword:{keyword}", result.dict(), ttl=7 * 24 * 3600)

        return result

    def _calculate_competition(self, results: list) -> float:
        # 경쟁도 계산 로직
        pass

    def _score_to_level(self, score: float) -> str:
        if score < 0.33:
            return "low"
        elif score < 0.66:
            return "medium"
        return "high"
```

### 5.4 환경 설정

```python
# app/core/config.py
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # YouTube API
    youtube_api_key: str

    # Database
    database_url: str = "sqlite:///./viewpulse.db"

    # App
    debug: bool = False
    api_prefix: str = "/api/v1"

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings()
```

---

## 6. 보안 체크리스트

### 6.1 절대 금지

- [ ] API 키 하드코딩 금지
- [ ] .env 파일 커밋 금지 (.gitignore에 추가)
- [ ] 사용자 입력 직접 출력 금지

### 6.2 환경 변수

```bash
# .env.example (커밋 O)
YOUTUBE_API_KEY=your-youtube-api-key-here
DATABASE_URL=sqlite:///./viewpulse.db
DEBUG=false

# .env (커밋 X)
YOUTUBE_API_KEY=AIza...실제키
DATABASE_URL=sqlite:///./viewpulse.db
DEBUG=true
```

### 6.3 .gitignore

```gitignore
# 환경 변수
.env
.env.local
.env.*.local

# 데이터베이스
*.db
*.sqlite

# Python
__pycache__/
*.py[cod]
.venv/
venv/

# Node
node_modules/
dist/

# IDE
.vscode/
.idea/
```

---

## 7. Git 워크플로우

### 7.1 브랜치 전략

```
main                # 안정 버전
├── feat/keyword    # 키워드 분석 기능
├── feat/comment    # 댓글 분석 기능
└── fix/bug-name    # 버그 수정
```

### 7.2 커밋 메시지

```
<type>(<scope>): <subject>

# 타입
feat: 새 기능
fix: 버그 수정
refactor: 리팩토링
docs: 문서
style: 포맷팅
test: 테스트
chore: 기타

# 예시
feat(keyword): 키워드 검색량 분석 API 구현
fix(comment): 댓글 수집 시 빈 배열 처리
```

---

## 8. 테스트

### 8.1 백엔드 테스트

```python
# tests/test_keywords.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_analyze_keyword():
    response = client.post(
        "/api/v1/keywords/analyze",
        json={"keyword": "바이브코딩"}
    )
    assert response.status_code == 200
    data = response.json()["data"]
    assert "search_volume" in data
    assert "competition" in data

def test_analyze_empty_keyword():
    response = client.post(
        "/api/v1/keywords/analyze",
        json={"keyword": ""}
    )
    assert response.status_code == 422  # Validation Error
```

### 8.2 테스트 실행

```bash
# 백엔드
cd backend
pytest -v

# 프론트엔드
cd frontend
npm test
```

---

## 9. AI 협업 프롬프트 템플릿

```markdown
## 작업
{{무엇을 해야 하는지}}

## 참조 문서
- PRD: {{관련 섹션}}
- TRD: {{관련 섹션}}

## 현재 상태
- 완료: {{완료된 것}}
- 진행 중: {{현재 작업}}

## 제약 조건
- {{지켜야 할 것}}

## 예상 결과
- {{생성될 파일}}
- {{기대 동작}}
```

---

## 10. 개발 순서 (권장)

```
1. 환경 설정
   - [ ] Python 가상환경 생성
   - [ ] Node.js 프로젝트 초기화
   - [ ] YouTube API 키 발급

2. 백엔드 기반
   - [ ] FastAPI 프로젝트 구조 생성
   - [ ] SQLite 데이터베이스 설정
   - [ ] YouTube API 연동

3. FEAT-1: 키워드 분석
   - [ ] 키워드 분석 API 구현
   - [ ] 프론트엔드 UI 구현
   - [ ] 통합 테스트

4. FEAT-2: 댓글 분석
   - [ ] 댓글 수집 API 구현
   - [ ] 텍스트 분석 로직
   - [ ] 프론트엔드 UI 구현
   - [ ] 통합 테스트

5. 마무리
   - [ ] 에러 처리
   - [ ] 로딩 상태 UI
   - [ ] 최종 테스트
```

---

## Decision Log

| 날짜 | 결정 | 이유 |
|------|------|------|
| 2024-01-17 | 모노레포 구조 | 단일 프로젝트, 관리 편의 |
| 2024-01-17 | TypeScript 사용 | 타입 안정성, 개발 생산성 |
| 2024-01-17 | Zustand 상태관리 | 간단한 API, 보일러플레이트 최소 |
| 2024-01-17 | pytest 테스트 | Python 표준, FastAPI 호환 |
