import { test, expect } from '@playwright/test';

test.describe('Admin route protection', () => {
  test('redirects unauthenticated users away from /admin', async ({ page }) => {
    await page.goto('/admin');
    // AdminRoutesWrapper redirects to "/" when not authenticated
    await expect(page).not.toHaveURL('/admin');
  });

  test('redirects unauthenticated users away from /home', async ({ page }) => {
    await page.goto('/home');
    // ProtectedRoutesWrapper redirects to "/" when not authenticated
    await expect(page).not.toHaveURL('/home');
  });
});
