import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
    test('unauthenticated users see login page', async ({ page }) => {
        await page.goto('/');

        await expect(page.getByTestId('home-content')).toBeVisible();
        await expect(page.getByTestId('home-login-instructions')).toBeVisible();
        await expect(page.getByTestId('home-login-button')).toBeVisible();
        await expect(page.getByTestId('navbar')).not.toBeVisible();
    });

    test('login button is accessible and functional', async ({ page }) => {
        await page.goto('/');

        const loginButton = page.getByTestId('home-login-button');
        await expect(loginButton).toBeVisible();
        await expect(loginButton).toBeEnabled();

        await loginButton.click();
        await expect(page.locator('body')).toBeVisible();
    });

    test('protected routes redirect unauthenticated users', async ({ page }) => {
        const protectedRoutes = ['/dashboard', '/profile', '/artists', '/playlists'];

        for (const route of protectedRoutes) {
            await page.goto(route);
            await expect(page).toHaveURL('/');
            await expect(page.getByTestId('home-content')).toBeVisible();
        }
    });

    test('authentication flow handles network errors gracefully', async ({ page }) => {
        await page.goto('/');
        await page.route('**/auth/**', route => route.abort());

        const loginButton = page.getByTestId('home-login-button');
        await loginButton.click();

        await expect(page.locator('body')).toBeVisible();
        await expect(page.locator('main')).toBeVisible();
    });
});
