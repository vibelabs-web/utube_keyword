import { test, expect } from '@playwright/test';

/**
 * 에러 처리 E2E 테스트
 *
 * 주의: MSW가 활성화된 상태에서는 네트워크 에러 시뮬레이션이 제한적입니다.
 * 이 테스트들은 기본적인 에러 처리 흐름을 확인합니다.
 */
test.describe('에러 처리', () => {
  test('키워드 분석 - 빈 키워드 입력 시 버튼 비활성화', async ({ page }) => {
    await page.goto('/keywords');

    const button = page.getByRole('button', { name: /분석하기/i });

    // 빈 입력 시 버튼 비활성화
    await expect(button).toBeDisabled();
  });

  test('댓글 분석 - 잘못된 URL 입력 시 에러 메시지 표시', async ({ page }) => {
    await page.goto('/comments');

    // 잘못된 URL 입력
    await page.getByPlaceholder(/YouTube 영상 URL/i).fill('invalid-url');
    await page.getByRole('button', { name: /분석하기/i }).click();

    // 에러 메시지 확인
    await expect(page.getByText(/유효한 YouTube URL/i)).toBeVisible();
  });

  test('댓글 분석 - 빈 URL 입력 시 에러 메시지 표시', async ({ page }) => {
    await page.goto('/comments');

    // 분석 버튼 클릭 (URL 입력 없이)
    await page.getByRole('button', { name: /분석하기/i }).click();

    // 에러 메시지 확인
    await expect(page.getByText(/YouTube URL을 입력해주세요/i)).toBeVisible();
  });

  test('댓글 분석 - URL 입력 중 에러가 사라진다', async ({ page }) => {
    await page.goto('/comments');

    const input = page.getByPlaceholder(/YouTube 영상 URL/i);

    // 잘못된 URL로 에러 발생
    await input.fill('invalid');
    await page.getByRole('button', { name: /분석하기/i }).click();
    await expect(page.getByText(/유효한 YouTube URL/i)).toBeVisible();

    // 올바른 URL 입력 시작
    await input.fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

    // 에러 메시지 사라짐 확인
    await expect(page.getByText(/유효한 YouTube URL/i)).not.toBeVisible();
  });

  test('페이지 전환 시 에러 상태가 초기화된다', async ({ page }) => {
    await page.goto('/comments');

    // 에러 발생
    await page.getByRole('button', { name: /분석하기/i }).click();
    await expect(page.getByText(/YouTube URL을 입력해주세요/i)).toBeVisible();

    // 다른 페이지로 이동
    await page.getByRole('link', { name: /키워드 분석/i }).click();
    await expect(page).toHaveURL('/keywords');

    // 댓글 분석으로 돌아가면 에러 메시지가 없음
    await page.getByRole('link', { name: /댓글 분석/i }).click();
    await expect(page.getByText(/YouTube URL을 입력해주세요/i)).not.toBeVisible();
  });
});
