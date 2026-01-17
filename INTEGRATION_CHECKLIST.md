# Zettel 통합 체크리스트

프로젝트 통합 및 배포 전 확인 사항

## 1. 환경 설정 체크리스트

### 환경 변수
- [ ] `.env` 파일이 프로젝트 루트에 존재
- [ ] `YOUTUBE_API_KEY` 설정됨
- [ ] `SECRET_KEY` 설정됨 (프로덕션용 강력한 키)
- [ ] `backend/.env` 파일 설정 완료
- [ ] `frontend/.env` 파일 설정 완료 (필요시)

### 의존성
- [ ] Python 3.11 이상 설치
- [ ] Node.js 20 이상 설치
- [ ] 백엔드 의존성 설치 (`pip install -r requirements.txt`)
- [ ] 프론트엔드 의존성 설치 (`npm install`)

## 2. 로컬 개발 환경 체크리스트

### 백엔드
- [ ] 가상환경 활성화
- [ ] 데이터베이스 마이그레이션 실행 (필요시)
- [ ] 백엔드 서버 실행 (`uvicorn app.main:app --reload`)
- [ ] http://localhost:8000 접속 확인
- [ ] http://localhost:8000/docs API 문서 확인
- [ ] http://localhost:8000/ 헬스체크 확인

### 프론트엔드
- [ ] 프론트엔드 서버 실행 (`npm run dev`)
- [ ] http://localhost:5173 접속 확인
- [ ] Vite 프록시 설정 확인 (`vite.config.ts`)
- [ ] CORS 설정 확인 (백엔드 `main.py`)

### 통합 테스트
- [ ] 프론트엔드에서 백엔드 API 호출 성공
- [ ] 키워드 분석 기능 테스트
- [ ] 댓글 분석 기능 테스트
- [ ] 에러 핸들링 확인
- [ ] 로딩 상태 확인

## 3. Docker 환경 체크리스트

### Docker 빌드
- [ ] `backend/Dockerfile` 존재
- [ ] `frontend/Dockerfile` 존재
- [ ] `frontend/Dockerfile.dev` 존재
- [ ] `docker-compose.yml` 존재
- [ ] `docker-compose.dev.yml` 존재

### Docker 실행 (개발)
```bash
docker compose -f docker-compose.dev.yml up --build
```
- [ ] 백엔드 컨테이너 정상 실행
- [ ] 프론트엔드 컨테이너 정상 실행
- [ ] 볼륨 마운트 확인 (코드 변경 반영)
- [ ] 포트 매핑 확인 (8000, 5173)

### Docker 실행 (프로덕션)
```bash
docker compose up --build
```
- [ ] 백엔드 컨테이너 정상 실행
- [ ] 프론트엔드 컨테이너 정상 실행 (Nginx)
- [ ] 헬스체크 통과
- [ ] 의존성 확인 (frontend depends_on backend)

## 4. API 엔드포인트 체크리스트

### 기본 엔드포인트
```bash
# 루트
curl http://localhost:8000/

# 헬스체크 (백엔드)
curl http://localhost:8000/

# API 문서
curl http://localhost:8000/docs
```
- [ ] 루트 엔드포인트 응답
- [ ] 헬스체크 성공
- [ ] Swagger UI 접근 가능

### 키워드 분석
```bash
curl -X POST http://localhost:8000/api/v1/keywords/analyze \
  -H "Content-Type: application/json" \
  -d '{"keyword":"python tutorial"}'
```
- [ ] 키워드 분석 요청 성공
- [ ] 응답 스키마 검증
- [ ] 에러 처리 확인

### 댓글 분석
```bash
curl -X POST http://localhost:8000/api/v1/comments/analyze \
  -H "Content-Type: application/json" \
  -d '{"video_id":"dQw4w9WgXcQ"}'
```
- [ ] 댓글 분석 요청 성공
- [ ] 응답 스키마 검증
- [ ] 에러 처리 확인

## 5. 프론트엔드 체크리스트

### UI 컴포넌트
- [ ] 키워드 분석 페이지 렌더링
- [ ] 댓글 분석 페이지 렌더링
- [ ] 로딩 스피너 표시
- [ ] 에러 메시지 표시
- [ ] 결과 데이터 표시

### API 통합
- [ ] TanStack Query 설정 확인
- [ ] API 클라이언트 설정 확인
- [ ] 프록시를 통한 API 호출
- [ ] 응답 데이터 파싱
- [ ] 에러 핸들링

### 라우팅
- [ ] 홈 페이지 (/)
- [ ] 키워드 분석 페이지
- [ ] 댓글 분석 페이지
- [ ] 404 페이지 (없는 경로)

## 6. 테스트 체크리스트

### 백엔드 테스트
```bash
cd backend
pytest
pytest --cov=app --cov-report=html
```
- [ ] 모든 단위 테스트 통과
- [ ] 통합 테스트 통과
- [ ] 커버리지 80% 이상
- [ ] 에지 케이스 처리 확인

### 프론트엔드 테스트
```bash
cd frontend
npm test
npm run test:e2e
```
- [ ] 컴포넌트 테스트 통과
- [ ] E2E 테스트 통과
- [ ] 타입 체크 통과 (`npm run type-check`)
- [ ] 린트 검사 통과 (`npm run lint`)

### 통합 테스트 스크립트
```bash
./test-integration.sh
```
- [ ] 스크립트 실행 성공
- [ ] 모든 체크 통과
- [ ] 프록시 연결 확인

## 7. 보안 체크리스트

### 환경 변수
- [ ] `.env` 파일이 `.gitignore`에 포함
- [ ] 프로덕션 환경에서 강력한 `SECRET_KEY` 사용
- [ ] API 키가 코드에 하드코딩되지 않음
- [ ] 민감한 정보가 로그에 출력되지 않음

### CORS
- [ ] 프로덕션 환경에서 허용된 오리진만 설정
- [ ] 개발 환경과 프로덕션 환경 분리
- [ ] 와일드카드 `*` 사용 금지 (프로덕션)

### API 보안
- [ ] 입력 검증 (Pydantic)
- [ ] SQL 인젝션 방지 (ORM 사용)
- [ ] XSS 방지 (프론트엔드)
- [ ] CSRF 토큰 (필요시)

## 8. 성능 체크리스트

### 백엔드
- [ ] 데이터베이스 쿼리 최적화
- [ ] 적절한 인덱스 설정
- [ ] 응답 캐싱 (필요시)
- [ ] 비동기 처리 활용

### 프론트엔드
- [ ] 코드 스플리팅
- [ ] 이미지 최적화
- [ ] 번들 크기 확인 (`npm run build`)
- [ ] Lighthouse 점수 확인

### Docker
- [ ] 멀티 스테이지 빌드 사용
- [ ] 이미지 크기 최적화
- [ ] 레이어 캐싱 활용
- [ ] 불필요한 파일 제외 (.dockerignore)

## 9. 문서화 체크리스트

### README
- [ ] 프로젝트 소개
- [ ] 설치 방법
- [ ] 실행 방법
- [ ] API 문서 링크
- [ ] 트러블슈팅

### API 문서
- [ ] Swagger UI 접근 가능
- [ ] 모든 엔드포인트 문서화
- [ ] 요청/응답 스키마 명시
- [ ] 예제 포함

### 코드 주석
- [ ] 복잡한 로직에 주석 추가
- [ ] 함수/클래스 docstring 작성
- [ ] 타입 힌트 추가

## 10. 배포 준비 체크리스트

### 프로덕션 빌드
- [ ] 백엔드 프로덕션 모드 테스트
- [ ] 프론트엔드 빌드 성공 (`npm run build`)
- [ ] 빌드된 파일 확인 (`frontend/dist/`)
- [ ] 정적 파일 서빙 테스트

### 환경 설정
- [ ] 프로덕션 환경 변수 설정
- [ ] 데이터베이스 백업 계획
- [ ] 로깅 설정
- [ ] 모니터링 설정

### 배포
- [ ] 도메인 설정
- [ ] SSL 인증서 설정
- [ ] 방화벽 규칙 설정
- [ ] 헬스체크 엔드포인트 설정

## 11. 롤백 계획

### 배포 실패 시
- [ ] 이전 버전으로 롤백 방법 확인
- [ ] 데이터베이스 롤백 스크립트 준비
- [ ] 로그 수집 방법 확인
- [ ] 모니터링 알림 설정

## 12. 모니터링 체크리스트

### 로그
- [ ] 애플리케이션 로그 수집
- [ ] 에러 로그 추적
- [ ] 접근 로그 분석
- [ ] 로그 로테이션 설정

### 메트릭
- [ ] CPU/메모리 사용률
- [ ] API 응답 시간
- [ ] 에러율
- [ ] 요청 수 (RPS)

### 알림
- [ ] 에러 알림 설정
- [ ] 성능 저하 알림
- [ ] 디스크 사용률 알림
- [ ] 헬스체크 실패 알림

## 완료 확인

모든 체크리스트 항목을 확인한 후:
- [ ] 개발 환경 테스트 완료
- [ ] Docker 환경 테스트 완료
- [ ] 통합 테스트 통과
- [ ] 문서화 완료
- [ ] 배포 준비 완료

## 다음 단계

1. CI/CD 파이프라인 구축
2. 프로덕션 환경 배포
3. 모니터링 및 로깅 설정
4. 성능 최적화
5. 사용자 피드백 수집
