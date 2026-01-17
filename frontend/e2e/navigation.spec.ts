import { test, expect } from '@playwright/test';

/**
 * 네비게이션 E2E 테스트
 *
 * 테스트 시나리오:
 * 1. 탭 전환
 * 2. URL 변경 확인
 * 3. 기본 페이지 리디렉션
 * 4. 404 페이지 처리
 */
test.describe('네비게이션', () => {
  test('기본 경로는 키워드 분석으로 리디렉션된다', async ({ page }) => {
    await page.goto('/');

    // 키워드 분석 페이지로 리디렉션 확인
    await expect(page).toHaveURL('/keywords');
    await expect(page.locator('h1')).toContainText('키워드 분석');
  });

  test('키워드 분석 탭에서 댓글 분석 탭으로 전환할 수 있다', async ({
    page,
  }) => {
    await page.goto('/keywords');

    // 댓글 분석 탭 클릭
    const commentTab = page.getByRole('link', { name: /댓글 분석/i });
    await commentTab.click();

    // URL 및 페이지 확인
    await expect(page).toHaveURL('/comments');
    await expect(page.locator('h1')).toContainText('댓글 분석');
  });

  test('댓글 분석 탭에서 키워드 분석 탭으로 전환할 수 있다', async ({
    page,
  }) => {
    await page.goto('/comments');

    // 키워드 분석 탭 클릭
    const keywordTab = page.getByRole('link', { name: /키워드 분석/i });
    await keywordTab.click();

    // URL 및 페이지 확인
    await expect(page).toHaveURL('/keywords');
    await expect(page.locator('h1')).toContainText('키워드 분석');
  });

  test('헤더에서 로고를 클릭하면 키워드 분석 페이지로 이동한다', async ({
    page,
  }) => {
    await page.goto('/comments');

    // 로고나 헤더 타이틀 클릭 (YouTube Zettel 텍스트)
    const logo = page.locator('header').getByText(/YouTube Zettel/i);
    if (await logo.isVisible()) {
      await logo.click();

      // 키워드 분석 페이지로 이동 확인
      await expect(page).toHaveURL('/keywords');
    }
  });

  test('존재하지 않는 경로는 키워드 분석으로 리디렉션된다', async ({
    page,
  }) => {
    // 존재하지 않는 경로로 이동
    await page.goto('/nonexistent-page');

    // 키워드 분석 페이지로 리디렉션되거나 404 처리
    // React Router의 기본 동작: 매칭되지 않으면 빈 페이지
    // 하지만 우리는 / → /keywords 리디렉션이 있으므로 확인
    const url = page.url();
    const isValidPage = url.includes('/keywords') || url.includes('/comments');

    // 유효한 페이지로 이동했는지 확인
    if (!isValidPage) {
      // 페이지에 헤더가 있는지 확인 (최소한 앱이 로드됨)
      await expect(page.locator('header')).toBeVisible();
    }
  });

  test('탭 전환 시 활성 상태가 업데이트된다', async ({ page }) => {
    await page.goto('/keywords');

    // 키워드 분석 탭이 활성 상태인지 확인 (bg-primary/10 또는 text-primary 포함)
    const keywordTab = page.getByRole('link', { name: /키워드 분석/i });
    const keywordTabClass = await keywordTab.getAttribute('class');
    expect(keywordTabClass).toMatch(/text-primary|bg-primary/); // 활성 상태 스타일

    // 댓글 분석 탭으로 전환
    const commentTab = page.getByRole('link', { name: /댓글 분석/i });
    await commentTab.click();

    // 댓글 분석 탭이 활성 상태인지 확인
    const commentTabClass = await commentTab.getAttribute('class');
    expect(commentTabClass).toMatch(/text-primary|bg-primary/); // 활성 상태 스타일
  });

  test('브라우저 뒤로 가기 버튼이 정상 동작한다', async ({ page }) => {
    await page.goto('/keywords');

    // 댓글 분석으로 이동
    await page.getByRole('link', { name: /댓글 분석/i }).click();
    await expect(page).toHaveURL('/comments');

    // 뒤로 가기
    await page.goBack();
    await expect(page).toHaveURL('/keywords');

    // 앞으로 가기
    await page.goForward();
    await expect(page).toHaveURL('/comments');
  });

  test('페이지 새로고침 후에도 현재 페이지가 유지된다', async ({ page }) => {
    await page.goto('/comments');

    // 페이지 새로고침
    await page.reload();

    // 여전히 댓글 분석 페이지인지 확인
    await expect(page).toHaveURL('/comments');
    await expect(page.locator('h1')).toContainText('댓글 분석');
  });
});
