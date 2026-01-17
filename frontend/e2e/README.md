# E2E 테스트 가이드

이 디렉토리는 Playwright를 사용한 E2E(End-to-End) 테스트를 포함합니다.

## 테스트 파일 구조

```
e2e/
├── keyword.spec.ts      # 키워드 분석 기능 테스트
├── comment.spec.ts      # 댓글 분석 기능 테스트
├── navigation.spec.ts   # 페이지 네비게이션 테스트
├── error.spec.ts        # 에러 처리 테스트
└── msw.spec.ts          # MSW 동작 확인 테스트
```

## 실행 방법

### 기본 실행
```bash
npm run test:e2e
```

### UI 모드 (시각적 테스트 실행)
```bash
npm run test:e2e:ui
```

### 디버그 모드
```bash
npm run test:e2e:debug
```

### 특정 파일만 실행
```bash
npx playwright test e2e/keyword.spec.ts
```

### 특정 테스트만 실행
```bash
npx playwright test -g "키워드 입력"
```

## HTML 리포트 확인
```bash
npm run test:e2e:report
```

## 주요 기능

### 1. MSW 통합
- Mock Service Worker를 사용하여 실제 API 없이 테스트
- 개발 환경에서 자동 활성화 (`VITE_USE_MSW=true`)

### 2. 자동 개발 서버 시작
- `playwright.config.ts`의 `webServer` 설정으로 자동 시작
- 테스트 실행 전 개발 서버가 준비될 때까지 대기

### 3. 스크린샷 자동 저장
- 실패한 테스트의 스크린샷 자동 저장
- `test-results/` 디렉토리에 저장

## 테스트 작성 가이드

### Role-based 셀렉터 사용
```typescript
// 권장
await page.getByRole('button', { name: /분석하기/i });
await page.getByRole('heading', { name: /영상 정보/i });

// 비권장
await page.locator('button');
```

### Strict Mode Violation 방지
```typescript
// 여러 요소가 매칭될 경우 first() 사용
await page.getByText('500').first();
```

### 적절한 타임아웃 설정
```typescript
// MSW가 빠르게 응답하므로 긴 타임아웃 필요 없음
await expect(page.getByText(/결과/i)).toBeVisible({ timeout: 10000 });
```

## 문제 해결

### MSW가 시작되지 않는 경우
1. `.env.development` 파일에 `VITE_USE_MSW=true` 확인
2. 개발 서버 재시작

### 테스트가 타임아웃되는 경우
1. 개발 서버가 실행 중인지 확인
2. `playwright.config.ts`의 타임아웃 설정 확인
3. 네트워크 연결 확인 (프리텐다드 폰트 로딩)

### 셀렉터를 찾을 수 없는 경우
1. Playwright Inspector로 디버그: `npm run test:e2e:debug`
2. 스크린샷 확인: `test-results/` 디렉토리
3. 더 구체적인 셀렉터 사용

## 참고 자료
- [Playwright 공식 문서](https://playwright.dev/)
- [MSW 공식 문서](https://mswjs.io/)
