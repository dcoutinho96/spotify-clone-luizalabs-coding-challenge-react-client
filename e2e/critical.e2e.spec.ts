import { test, expect } from '@playwright/test';

test.describe('Critical User Flows', () => {
  test('homepage loads and shows login for unauthenticated users', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Spotify/i);
    await expect(page.getByTestId('home-content')).toBeVisible();
    await expect(page.getByTestId('home-login-instructions')).toBeVisible();
    await expect(page.getByTestId('home-login-button')).toBeVisible();
    await expect(page.getByTestId('navbar')).not.toBeVisible();
  });

  test('login button is accessible and clickable', async ({ page }) => {
    await page.goto('/');
    const loginButton = page.getByTestId('home-login-button');
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();
    await expect(loginButton).toContainText(/Log In/i);
  });

  test('page has proper semantic structure', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const logo = page.locator('img[alt*="Spotify"]');
    await expect(logo).toBeVisible();
  });

  test('responsive design works on different screen sizes', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1280, height: 720 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await expect(page.getByTestId('home-content')).toBeVisible();
    }
  });
});
