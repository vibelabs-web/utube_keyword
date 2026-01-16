# Project Memory

## 기본 정보
- 프로젝트명: zettel (유튜브 키워드 분석기 & 댓글 분석기)
- 기술 스택: FastAPI + React + SQLite
- 시작일: 2024-01-17

## 아키텍처
- 백엔드: FastAPI + Python 3.11+ + SQLAlchemy 2.0 + Pydantic v2
- 프론트엔드: React 19 + Vite + TypeScript + TailwindCSS + Zustand
- 데이터베이스: SQLite (단일 사용자, 파일 기반)

## 특이사항
- 인증: 인증 없음 (개인 도구)
- 외부 API: YouTube Data API v3
- 캐싱: 키워드 7일, 댓글 1일 TTL
