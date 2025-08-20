import { test, expect } from '@playwright/test';

test('hello query works', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(/Message:/)).toBeVisible();
})