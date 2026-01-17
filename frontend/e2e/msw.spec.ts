import { test, expect } from '@playwright/test';

/**
 * MSW 동작 확인 테스트
 */
test.describe('MSW 동작 확인', () => {
  test('브라우저 콘솔에서 MSW 시작 로그 확인', async ({ page }) => {
    const logs: string[] = [];

    // 콘솔 메시지 수집
    page.on('console', (msg) => {
      logs.push(msg.text());
    });

    await page.goto('/keywords');

    // MSW 로그 확인
    await page.waitForTimeout(2000);

    const mswLogs = logs.filter((log) => log.includes('[MSW]'));
    console.log('MSW Logs:', mswLogs);

    expect(logs.some((log) => log.includes('MSW'))).toBeTruthy();
  });

  test('API 요청이 MSW에 의해 가로채지는지 확인', async ({ page }) => {
    await page.goto('/keywords');

    // 네트워크 요청 추적
    const requests: string[] = [];
    page.on('request', (request) => {
      requests.push(request.url());
    });

    // 키워드 입력 및 분석
    await page.getByPlaceholder(/분석할 키워드를 입력하세요/i).fill('테스트');
    await page.getByRole('button', { name: /분석하기/i }).click();

    // 약간의 대기 시간
    await page.waitForTimeout(2000);

    console.log('Requests:', requests);

    // API 요청이 발생했는지 확인
    const hasApiRequest = requests.some((url) => url.includes('/api/v1/keywords/analyze'));
    expect(hasApiRequest).toBeTruthy();
  });
});
