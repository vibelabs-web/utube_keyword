/**
 * MSW 초기화 함수
 * 테스트 환경에서만 사용됩니다. 개발 환경에서는 실제 API를 사용합니다.
 */
export async function enableMocking() {
  // 기존 MSW Service Worker 제거
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      if (registration.active?.scriptURL.includes('mockServiceWorker')) {
        await registration.unregister();
        console.log('[MSW] Service worker unregistered');
      }
    }
  }

  // MSW는 테스트 환경에서만 사용 - 개발 환경에서는 항상 실제 API 사용
  console.log('[MSW] Disabled - using real API');
  return;
}
