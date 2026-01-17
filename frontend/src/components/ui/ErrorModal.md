# ErrorModal Component

## 개요

사용자에게 에러를 명확하게 전달하기 위한 모달 다이얼로그 컴포넌트입니다.
Apple HIG 접근성 가이드라인을 준수하며, 다양한 API 에러 타입에 대응합니다.

## 기능

- **타입 안전 에러 메시지**: `ErrorType` 기반 자동 메시지 표시
- **커스텀 메시지**: 직접 제목/메시지 지정 가능
- **재시도 액션**: 선택적 재시도 버튼 제공
- **키보드 지원**: Escape 키로 닫기
- **백드롭 클릭**: 배경 클릭으로 닫기
- **ARIA 접근성**: 스크린 리더 완벽 지원

## 사용법

### 기본 사용 (ErrorType)

```tsx
import { ErrorModal } from '@/components/ui';
import { useState } from 'react';

function MyComponent() {
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  return (
    <ErrorModal
      isOpen={isErrorOpen}
      errorType="network"
      onClose={() => setIsErrorOpen(false)}
      onRetry={handleRetry}
    />
  );
}
```

### 커스텀 메시지

```tsx
<ErrorModal
  isOpen={true}
  title="업로드 실패"
  message="파일 크기가 10MB를 초과했습니다."
  onClose={handleClose}
/>
```

### 재시도 버튼 없이

```tsx
<ErrorModal
  isOpen={true}
  errorType="comments_disabled"
  onClose={handleClose}
  // onRetry 생략하면 재시도 버튼 표시 안 됨
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isOpen` | `boolean` | ✅ | - | 모달 표시 여부 |
| `onClose` | `() => void` | ✅ | - | 닫기 핸들러 |
| `title` | `string` | - | errorType에 따름 | 에러 제목 |
| `message` | `string` | - | errorType에 따름 | 에러 메시지 |
| `errorType` | `ErrorType` | - | - | 사전 정의된 에러 타입 |
| `onRetry` | `() => void` | - | - | 재시도 핸들러 (선택) |

## ErrorType 목록

| Type | Title | Message |
|------|-------|---------|
| `network` | 네트워크 오류 | 서버에 연결할 수 없습니다. |
| `quota_exceeded` | API 할당량 초과 | YouTube API 일일 할당량이 초과되었습니다. |
| `invalid_api_key` | API 키 오류 | YouTube API 키가 유효하지 않습니다. |
| `video_not_found` | 영상을 찾을 수 없음 | 요청한 YouTube 영상을 찾을 수 없습니다. |
| `comments_disabled` | 댓글 비활성화 | 이 영상은 댓글이 비활성화되어 있습니다. |
| `server_error` | 서버 오류 | 서버에서 오류가 발생했습니다. |
| `unknown` | 알 수 없는 오류 | 예상치 못한 오류가 발생했습니다. |

## API와 함께 사용하기

```tsx
import { ErrorModal } from '@/components/ui';
import type { ErrorType } from '@/utils/errorMessages';
import { useState } from 'react';
import axios from 'axios';

function VideoAnalyzer() {
  const [error, setError] = useState<{
    isOpen: boolean;
    type?: ErrorType;
  }>({ isOpen: false });

  const analyzeVideo = async (url: string) => {
    try {
      await axios.post('/api/analyze', { url });
    } catch (err: any) {
      // 백엔드 에러 코드를 ErrorType으로 매핑
      const errorType = mapApiErrorToType(err.response?.data?.code);
      setError({ isOpen: true, type: errorType });
    }
  };

  const handleRetry = () => {
    setError({ isOpen: false });
    analyzeVideo(lastUrl); // 재시도 로직
  };

  return (
    <>
      {/* Your UI */}
      <ErrorModal
        isOpen={error.isOpen}
        errorType={error.type}
        onClose={() => setError({ isOpen: false })}
        onRetry={handleRetry}
      />
    </>
  );
}

// 헬퍼 함수: API 에러 코드를 ErrorType으로 변환
function mapApiErrorToType(code?: string): ErrorType {
  const mapping: Record<string, ErrorType> = {
    'NETWORK_ERROR': 'network',
    'QUOTA_EXCEEDED': 'quota_exceeded',
    'INVALID_API_KEY': 'invalid_api_key',
    'VIDEO_NOT_FOUND': 'video_not_found',
    'COMMENTS_DISABLED': 'comments_disabled',
    'SERVER_ERROR': 'server_error',
  };
  return mapping[code || ''] || 'unknown';
}
```

## TanStack Query와 함께 사용하기

```tsx
import { ErrorModal } from '@/components/ui';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

function KeywordAnalyzer() {
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const { mutate, error, reset } = useMutation({
    mutationFn: analyzeKeyword,
    onError: () => setIsErrorOpen(true),
  });

  const handleRetry = () => {
    setIsErrorOpen(false);
    reset(); // TanStack Query 에러 초기화
    mutate({ keyword: lastKeyword });
  };

  return (
    <ErrorModal
      isOpen={isErrorOpen}
      title="키워드 분석 실패"
      message={error?.message || '다시 시도해주세요.'}
      onClose={() => {
        setIsErrorOpen(false);
        reset();
      }}
      onRetry={handleRetry}
    />
  );
}
```

## 접근성

- **role="dialog"**: 모달 다이얼로그 역할 명시
- **aria-modal="true"**: 모달 상태 표시
- **aria-labelledby**: 제목과 연결
- **키보드 네비게이션**:
  - `Escape`: 모달 닫기
  - `Tab`: 버튼 간 이동
- **포커스 트랩**: 모달 내부에서만 포커스 이동

## 디자인 가이드라인

- **터치 타겟**: 버튼 최소 44×44px
- **색상 대비**: WCAG AA 준수
- **여백**: 8px 그리드 시스템
- **애니메이션**: 부드러운 페이드인/아웃 (Framer Motion 권장)

## 테스트

```bash
npm test -- ErrorModal.test.tsx
```

모든 테스트가 통과해야 합니다:
- ✅ 에러 제목/메시지 렌더링
- ✅ isOpen=false일 때 숨김
- ✅ 닫기 버튼 동작
- ✅ 재시도 버튼 동작
- ✅ ErrorType별 메시지 표시
- ✅ ARIA 속성 검증
