# 테스트 가이드

## 테스트 환경

- **테스트 프레임워크**: Vitest
- **렌더링**: @testing-library/react
- **Assertions**: @testing-library/jest-dom
- **Mock API**: MSW (Mock Service Worker)

## 테스트 실행

### 기본 테스트
```bash
npm test
```

### Watch 모드
```bash
npm test -- --watch
```

### UI 모드 (권장)
```bash
npm run test:ui
```

### 커버리지 리포트
```bash
npm run test:coverage
```

## 테스트 구조

```
src/
├── __tests__/              # 테스트 파일
│   ├── App.test.tsx       # App 컴포넌트 테스트
│   └── mocks/
│       └── handlers.test.tsx  # MSW 핸들러 검증
├── test/
│   └── setup.ts           # 테스트 전역 설정
└── mocks/                 # MSW 설정
    ├── handlers/          # API 핸들러
    ├── browser.ts         # 브라우저용 워커
    └── server.ts          # 테스트용 서버
```

## 테스트 작성 가이드

### 1. 컴포넌트 테스트

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### 2. API 호출 테스트

```typescript
import { describe, it, expect } from 'vitest';
import axios from 'axios';

describe('API Tests', () => {
  it('fetches data successfully', async () => {
    const response = await axios.get('/api/v1/data');
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('success', true);
  });
});
```

### 3. 사용자 인터랙션 테스트

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('User Interaction', () => {
  it('handles button click', async () => {
    const user = userEvent.setup();
    render(<MyForm />);

    const button = screen.getByRole('button', { name: '제출' });
    await user.click(button);

    expect(screen.getByText('제출 완료')).toBeInTheDocument();
  });
});
```

## MSW 핸들러 추가

새로운 API 엔드포인트를 모킹해야 할 때:

1. `src/mocks/handlers/` 에 새 파일 생성
2. 핸들러 작성:

```typescript
import { http, HttpResponse } from 'msw';

export const myHandlers = [
  http.get('/api/v1/my-endpoint', () => {
    return HttpResponse.json({
      success: true,
      data: { message: 'Hello' }
    });
  }),
];
```

3. `handlers/index.ts`에 추가
4. 테스트 작성하여 검증

## 현재 테스트 커버리지

### App 컴포넌트
- [x] 렌더링 정상 동작
- [x] 헤더 표시
- [x] 네비게이션 링크
- [x] 메인 콘텐츠 영역
- [x] 버튼 렌더링

### MSW 핸들러
- [x] 키워드 분석 API
- [x] 키워드 히스토리 API
- [x] 댓글 분석 API
- [x] 댓글 히스토리 API
- [x] 데이터 구조 검증

## 베스트 프랙티스

1. **Arrange-Act-Assert 패턴 사용**
   - 준비(Arrange): 테스트 데이터 셋업
   - 실행(Act): 테스트할 동작 실행
   - 검증(Assert): 결과 확인

2. **의미 있는 테스트 작성**
   - 테스트 이름은 명확하게
   - 하나의 테스트는 하나의 기능만 검증
   - 테스트 간 독립성 유지

3. **Testing Library 원칙**
   - 사용자 관점에서 테스트
   - Implementation details 테스트 지양
   - Accessibility를 고려한 쿼리 사용

4. **MSW 활용**
   - 네트워크 요청을 실제와 동일하게 모킹
   - 에러 케이스도 테스트
   - 타임아웃, 로딩 상태 검증

## 문제 해결

### 테스트가 실패하는 경우

1. MSW 서버가 제대로 시작되었는지 확인
2. 핸들러가 올바른 엔드포인트를 모킹하는지 확인
3. 응답 데이터 구조가 기대값과 일치하는지 확인

### 타입 에러

```bash
# 타입 체크
npm run build
```

### 린트 에러

```bash
# ESLint 실행
npm run lint
```

## 참고 자료

- [Vitest 공식 문서](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [MSW 문서](https://mswjs.io/)
