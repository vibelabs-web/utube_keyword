# MSW (Mock Service Worker) 설정

이 디렉토리는 MSW를 사용하여 백엔드 API를 모킹하는 설정을 포함합니다.

## 구조

```
mocks/
├── handlers/           # API 엔드포인트별 핸들러
│   ├── keyword.ts     # 키워드 분석 API 핸들러
│   ├── comment.ts     # 댓글 분석 API 핸들러
│   └── index.ts       # 모든 핸들러 통합
├── browser.ts         # 브라우저용 MSW 워커 (개발 환경)
├── server.ts          # Node.js용 MSW 서버 (테스트 환경)
└── init.ts            # MSW 초기화 함수
```

## 사용 방법

### 1. 개발 환경에서 MSW 활성화

`.env.local` 파일 생성:
```bash
VITE_USE_MSW=true
```

`main.tsx`에서 MSW 활성화:
```typescript
import { enableMocking } from './mocks/init';

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
```

### 2. 테스트 환경에서 자동 활성화

테스트 실행 시 `src/test/setup.ts`에서 자동으로 MSW 서버가 시작됩니다.

```bash
npm test
```

## API 핸들러 추가 방법

1. `handlers/` 디렉토리에 새 파일 생성 (예: `user.ts`)
2. MSW 핸들러 작성:

```typescript
import { http, HttpResponse } from 'msw';

export const userHandlers = [
  http.get('/api/v1/users/:id', ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        name: 'Test User',
      },
    });
  }),
];
```

3. `handlers/index.ts`에 추가:

```typescript
import { userHandlers } from './user';

export const handlers = [
  ...keywordHandlers,
  ...commentHandlers,
  ...userHandlers,
];
```

## 주의사항

- 개발 환경에서 실제 백엔드를 사용하려면 `VITE_USE_MSW=false` 설정
- MSW는 개발/테스트 전용이며 프로덕션 빌드에는 포함되지 않음
- 핸들러 응답 형식은 백엔드 API 스펙과 일치해야 함

## 참고 자료

- [MSW 공식 문서](https://mswjs.io/)
- [MSW Browser Integration](https://mswjs.io/docs/integrations/browser)
- [MSW Node Integration](https://mswjs.io/docs/integrations/node)
