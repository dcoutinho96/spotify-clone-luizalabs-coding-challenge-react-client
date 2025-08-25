import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing', () => {
  test('protected routes redirect unauthenticated users', async ({ page }) => {
    const protectedRoutes = ['/dashboard', '/profile', '/artists', '/playlists'];

    for (const route of protectedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL('/');
      await expect(page.getByTestId('home-content')).toBeVisible();
    }
  });

  test('public routes are accessible without authentication', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('home-content')).toBeVisible();

    await page.goto('/login');
    await expect(page).toHaveURL('/login');
  });

  test('browser navigation works correctly', async ({ page }) => {
    await page.goto('/');
    await page.goto('/login');
    await expect(page).toHaveURL('/login');

    await page.goBack();
    await expect(page).toHaveURL('/');

    await page.goForward();
    await expect(page).toHaveURL('/login');
  });

  test('404 errors are handled gracefully', async ({ page }) => {
    await page.goto('/non-existent-route');
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('body')).toBeVisible();
  });
});
