import { test, expect } from '@playwright/test';

test.describe('Complete User Journeys', () => {
  test('new user onboarding journey', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('home-content')).toBeVisible();
    await expect(page.getByTestId('home-login-instructions')).toBeVisible();

    const loginButton = page.getByTestId('home-login-button');
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();

    await loginButton.click();
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });

  test('error handling journey (404 only)', async ({ page }) => {
    await page.goto('/non-existent-route');
    await page.waitForSelector('[data-testid="error-404"]', { timeout: 10000 });
    await expect(page.getByTestId('error-404')).toBeVisible();
  });

  test('accessibility journey', async ({ page }) => {
    await page.goto('/');

    const loginButton = page.getByTestId('home-login-button');
    await expect(loginButton).toBeVisible();

    await page.keyboard.press('Tab');
    await expect(loginButton).toBeFocused();

    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });
});
