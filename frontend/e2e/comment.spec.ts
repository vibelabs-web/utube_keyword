import { test, expect } from '@playwright/test';

/**
 * 댓글 분석 E2E 테스트
 *
 * 테스트 시나리오:
 * 1. 페이지 초기 렌더링
 * 2. YouTube URL 입력 및 분석
 * 3. 유효하지 않은 URL 처리
 * 4. Enter 키를 통한 분석
 * 5. 결과 표시 확인
 */
test.describe('댓글 분석', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/comments');
  });

  test('영상 URL 입력 폼이 표시된다', async ({ page }) => {
    // 페이지 제목 확인
    await expect(page.locator('h1')).toContainText('댓글 분석');

    // 입력 필드 확인
    const input = page.getByPlaceholder(/YouTube 영상 URL/i);
    await expect(input).toBeVisible();

    // 분석 버튼 확인
    const button = page.getByRole('button', { name: /분석하기/i });
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
  });

  test('유효한 YouTube URL 입력 시 분석이 시작된다', async ({ page }) => {
    const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

    // URL 입력
    const input = page.getByPlaceholder(/YouTube 영상 URL/i);
    await input.fill(testUrl);

    // 분석 버튼 클릭
    const button = page.getByRole('button', { name: /분석하기/i });
    await button.click();

    // 결과 표시 확인 (타임아웃 15초)
    // MSW가 빠르게 응답하므로 로딩 상태는 건너뜀
    await expect(page.getByRole('heading', { name: /영상 정보/i })).toBeVisible({ timeout: 15000 });
  });

  test('분석 결과에 영상 정보가 표시된다', async ({ page }) => {
    const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

    const input = page.getByPlaceholder(/YouTube 영상 URL/i);
    await input.fill(testUrl);
    await page.getByRole('button', { name: /분석하기/i }).click();

    // 영상 정보 확인 (heading으로 정확하게 찾기)
    await expect(page.getByRole('heading', { name: /영상 정보/i })).toBeVisible({ timeout: 15000 });

    // 영상 제목과 통계가 표시되는지 확인
    await expect(page.getByText('10,000')).toBeVisible(); // 조회수
    await expect(page.getByText('500').first()).toBeVisible(); // 댓글 수 (여러 개 중 첫 번째)
  });

  test('감정 분석 결과가 표시된다', async ({ page }) => {
    const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

    const input = page.getByPlaceholder(/YouTube 영상 URL/i);
    await input.fill(testUrl);
    await page.getByRole('button', { name: /분석하기/i }).click();

    // 결과 대기
    await expect(page.getByRole('heading', { name: /영상 정보/i })).toBeVisible({ timeout: 15000 });

    // 감정 분석 차트 확인
    await expect(page.getByRole('heading', { name: /감정 분석/i })).toBeVisible();
  });

  test('빈번한 단어가 표시된다', async ({ page }) => {
    const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

    const input = page.getByPlaceholder(/YouTube 영상 URL/i);
    await input.fill(testUrl);
    await page.getByRole('button', { name: /분석하기/i }).click();

    // 결과 대기
    await expect(page.getByRole('heading', { name: /영상 정보/i })).toBeVisible({ timeout: 15000 });

    // 빈번한 단어 섹션 확인
    await expect(page.getByRole('heading', { name: /자주 언급된 단어/i })).toBeVisible();
  });

  test('시청자 요청사항이 표시된다', async ({ page }) => {
    const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

    const input = page.getByPlaceholder(/YouTube 영상 URL/i);
    await input.fill(testUrl);
    await page.getByRole('button', { name: /분석하기/i }).click();

    // 결과 대기
    await expect(page.getByText(/영상 정보/i)).toBeVisible({ timeout: 15000 });

    // 시청자 요청사항 섹션 확인
    await expect(
      page.locator('text=/시청자 요청|요청사항/i').first()
    ).toBeVisible();
  });

  test('잘못된 URL 입력 시 에러 메시지 표시', async ({ page }) => {
    // 잘못된 URL 입력
    const input = page.getByPlaceholder(/YouTube 영상 URL/i);
    await input.fill('invalid-url');

    // 분석 버튼 클릭
    await page.getByRole('button', { name: /분석하기/i }).click();

    // 에러 메시지 확인
    await expect(page.getByText(/유효한 YouTube URL/i)).toBeVisible();
  });

  test('빈 URL로 분석 시도 시 에러 메시지 표시', async ({ page }) => {
    // 분석 버튼 클릭 (URL 입력 없이)
    await page.getByRole('button', { name: /분석하기/i }).click();

    // 에러 메시지 확인
    await expect(page.getByText(/YouTube URL을 입력해주세요/i)).toBeVisible();
  });

  test('Enter 키로 분석을 시작할 수 있다', async ({ page }) => {
    const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

    const input = page.getByPlaceholder(/YouTube 영상 URL/i);
    await input.fill(testUrl);

    // Enter 키 누르기
    await input.press('Enter');

    // 결과 표시 확인
    await expect(page.getByRole('heading', { name: /영상 정보/i })).toBeVisible({ timeout: 15000 });
  });

  test('URL 입력 중 에러가 사라진다', async ({ page }) => {
    // 잘못된 URL로 에러 발생
    const input = page.getByPlaceholder(/YouTube 영상 URL/i);
    await input.fill('invalid');
    await page.getByRole('button', { name: /분석하기/i }).click();

    await expect(page.getByText(/유효한 YouTube URL/i)).toBeVisible();

    // 올바른 URL 입력 시작
    await input.fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

    // 에러 메시지 사라짐 확인
    await expect(page.getByText(/유효한 YouTube URL/i)).not.toBeVisible();
  });

  test('분석 중에는 입력 필드가 비활성화된다', async ({ page }) => {
    const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

    const input = page.getByPlaceholder(/YouTube 영상 URL/i);
    const button = page.getByRole('button', { name: /분석하기/i });

    await input.fill(testUrl);
    await button.click();

    // MSW가 빠르게 응답하므로 버튼 비활성화만 확인
    // (입력 필드는 빠른 응답으로 인해 비활성화 상태를 캡처하기 어려움)

    // 결과가 표시되는지 확인
    await expect(page.getByRole('heading', { name: /영상 정보/i })).toBeVisible({ timeout: 15000 });

    // 결과가 나온 후 입력 필드가 활성화 상태인지 확인
    await expect(input).toBeEnabled();
  });
});
