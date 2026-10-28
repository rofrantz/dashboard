import {expect, test} from '@playwright/test';

test.describe('dashboard home', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/home$/);
    await expect(page.getByRole('heading', {name: 'Personal dashboard'})).toBeVisible();
  });

  test('renders the configured dashboard cards', async ({page}) => {
    await expect(page.locator('.react-grid-item')).toHaveCount(4);
    await expect(page.getByText('Today’s focus')).toBeVisible();
    await expect(page.getByText('Quick links')).toBeVisible();
  });

  test('allows cards to be dragged by their title handle', async ({page}) => {
    const card = page.locator('.react-grid-item').first();
    const handle = card.locator('.cursor-move');
    const before = await card.boundingBox();
    const handleBox = await handle.boundingBox();
    expect(before).not.toBeNull();
    expect(handleBox).not.toBeNull();

    await handle.hover();
    await page.mouse.down();
    await page.mouse.move(
      handleBox!.x + handleBox!.width / 2 + 120,
      handleBox!.y + handleBox!.height / 2,
      {steps: 10},
    );
    await page.mouse.up();

    await expect.poll(async () => (await card.boundingBox())?.x ?? 0).toBeGreaterThan(before!.x + 20);
  });

  test('allows cards to be resized with the southeast handle', async ({page}) => {
    const card = page.locator('.react-grid-item').first();
    const resizeHandle = card.locator('.react-resizable-handle-se');
    const before = await card.boundingBox();
    expect(before).not.toBeNull();
    await expect(resizeHandle).toBeVisible();

    const handleBox = await resizeHandle.boundingBox();
    expect(handleBox).not.toBeNull();
    await page.mouse.move(handleBox!.x + handleBox!.width / 2, handleBox!.y + handleBox!.height / 2);
    await page.mouse.down();
    await page.mouse.move(handleBox!.x + handleBox!.width / 2, handleBox!.y + handleBox!.height / 2 + 48, {steps: 10});
    await page.mouse.up();

    await expect.poll(async () => (await card.boundingBox())?.height ?? 0).toBeGreaterThan(before!.height + 20);
  });
});
