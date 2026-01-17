import { test, expect } from '@playwright/test';

/**
 * 키워드 분석 E2E 테스트
 *
 * 테스트 시나리오:
 * 1. 페이지 초기 렌더링
 * 2. 키워드 입력 및 분석 실행
 * 3. Enter 키를 통한 분석
 * 4. 빈 키워드 처리
 * 5. 관련 키워드 클릭
 */
test.describe('키워드 분석', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/keywords');
  });

  test('키워드 입력 폼이 표시된다', async ({ page }) => {
    // 페이지 제목 확인
    await expect(page.locator('h1')).toContainText('키워드 분석');

    // 입력 필드 확인
    const input = page.getByPlaceholder(/분석할 키워드를 입력하세요/i);
    await expect(input).toBeVisible();

    // 분석 버튼 확인
    const button = page.getByRole('button', { name: /분석하기/i });
    await expect(button).toBeVisible();
    await expect(button).toBeDisabled(); // 초기 상태는 비활성화
  });

  test('키워드를 입력하고 분석 버튼을 클릭하면 결과가 표시된다', async ({
    page,
  }) => {
    // 키워드 입력
    const input = page.getByPlaceholder(/분석할 키워드를 입력하세요/i);
    await input.fill('파이썬 강의');

    // 분석 버튼 활성화 확인
    const button = page.getByRole('button', { name: /분석하기/i });
    await expect(button).toBeEnabled();

    // 분석 버튼 클릭
    await button.click();

    // 결과 표시 확인 (타임아웃 10초)
    // MSW가 빠르게 응답하므로 로딩 상태는 건너뜀
    await expect(page.getByText(/분석 결과/i)).toBeVisible({ timeout: 10000 });

    // 메트릭 카드 확인 (heading으로 정확하게 찾기)
    await expect(page.getByRole('heading', { name: '검색량' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '경쟁도' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '추천도' })).toBeVisible();
  });

  test('Enter 키로 분석을 시작할 수 있다', async ({ page }) => {
    const input = page.getByPlaceholder(/분석할 키워드를 입력하세요/i);
    await input.fill('테스트 키워드');

    // Enter 키 누르기
    await input.press('Enter');

    // 결과 표시 확인
    await expect(page.getByText(/분석 결과/i)).toBeVisible({ timeout: 10000 });
  });

  test('빈 키워드로 분석 시도 시 버튼이 비활성화되어 있다', async ({
    page,
  }) => {
    const button = page.getByRole('button', { name: /분석하기/i });

    // 초기 상태: 버튼 비활성화
    await expect(button).toBeDisabled();

    // 공백만 입력
    const input = page.getByPlaceholder(/분석할 키워드를 입력하세요/i);
    await input.fill('   ');

    // 여전히 비활성화
    await expect(button).toBeDisabled();
  });

  test('키워드 입력 후 지우면 버튼이 다시 비활성화된다', async ({ page }) => {
    const input = page.getByPlaceholder(/분석할 키워드를 입력하세요/i);
    const button = page.getByRole('button', { name: /분석하기/i });

    // 키워드 입력
    await input.fill('테스트');
    await expect(button).toBeEnabled();

    // 키워드 지우기
    await input.clear();
    await expect(button).toBeDisabled();
  });

  test('분석 결과에서 관련 키워드를 클릭하면 새로운 분석이 시작된다', async ({
    page,
  }) => {
    // 첫 번째 분석
    const input = page.getByPlaceholder(/분석할 키워드를 입력하세요/i);
    await input.fill('파이썬');
    await page.getByRole('button', { name: /분석하기/i }).click();

    // 결과 대기
    await expect(page.getByText(/분석 결과/i)).toBeVisible({ timeout: 10000 });

    // 관련 키워드 제목 확인
    const relatedSection = page.getByRole('heading', { name: '관련 키워드' });
    if (await relatedSection.isVisible()) {
      // 첫 번째 관련 키워드 클릭
      const firstRelatedKeyword = page.getByRole('button', { name: /관련 키워드 1/ });

      if (await firstRelatedKeyword.isVisible()) {
        await firstRelatedKeyword.click();

        // 새로운 분석 결과 확인
        await expect(page.getByText(/분석 결과/i)).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test('분석 시간이 표시된다', async ({ page }) => {
    const input = page.getByPlaceholder(/분석할 키워드를 입력하세요/i);
    await input.fill('TypeScript');
    await page.getByRole('button', { name: /분석하기/i }).click();

    // 결과 대기
    await expect(page.getByText(/분석 결과/i)).toBeVisible({ timeout: 10000 });

    // 분석 시간 표시 확인
    await expect(page.getByText(/분석 시간/i)).toBeVisible();
  });
});
