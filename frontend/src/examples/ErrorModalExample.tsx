/**
 * ErrorModal Usage Examples
 *
 * 이 파일은 ErrorModal 컴포넌트의 실제 사용 예제를 보여줍니다.
 * 개발 참고용으로만 사용하고, 프로덕션 빌드에서는 제외하세요.
 */

import { ErrorModal } from '@/components/ui';
import type { ErrorType } from '@/utils/errorMessages';
import { useState } from 'react';

export default function ErrorModalExample() {
  const [currentError, setCurrentError] = useState<{
    isOpen: boolean;
    type?: ErrorType;
    title?: string;
    message?: string;
  }>({ isOpen: false });

  const errorTypes: ErrorType[] = [
    'network',
    'quota_exceeded',
    'invalid_api_key',
    'video_not_found',
    'comments_disabled',
    'server_error',
    'unknown',
  ];

  const showError = (type: ErrorType) => {
    setCurrentError({ isOpen: true, type });
  };

  const showCustomError = () => {
    setCurrentError({
      isOpen: true,
      title: '커스텀 에러',
      message: '이것은 직접 지정한 에러 메시지입니다.',
    });
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ErrorModal Examples</h1>

      {/* ErrorType 예제 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">1. ErrorType 기반</h2>
        <p className="text-gray-600 mb-4">
          사전 정의된 에러 타입을 사용하여 일관된 메시지를 표시합니다.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {errorTypes.map((type) => (
            <button
              key={type}
              onClick={() => showError(type)}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              {type}
            </button>
          ))}
        </div>
      </section>

      {/* 커스텀 메시지 예제 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">2. 커스텀 메시지</h2>
        <p className="text-gray-600 mb-4">
          title과 message를 직접 지정할 수 있습니다.
        </p>
        <button
          onClick={showCustomError}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          커스텀 에러 표시
        </button>
      </section>

      {/* 재시도 버튼 예제 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">3. 재시도 버튼</h2>
        <p className="text-gray-600 mb-4">
          onRetry를 전달하면 재시도 버튼이 표시됩니다.
        </p>
        <button
          onClick={() =>
            setCurrentError({ isOpen: true, type: 'network' })
          }
          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
        >
          재시도 버튼 있는 에러
        </button>
      </section>

      {/* 코드 예제 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">4. 코드 예제</h2>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
          <code>{`import { ErrorModal } from '@/components/ui';

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
}`}</code>
        </pre>
      </section>

      {/* ErrorModal */}
      <ErrorModal
        isOpen={currentError.isOpen}
        title={currentError.title}
        message={currentError.message}
        errorType={currentError.type}
        onClose={() => setCurrentError({ isOpen: false })}
        onRetry={() => {
          console.log('재시도 클릭됨');
          setCurrentError({ isOpen: false });
        }}
      />
    </div>
  );
}
