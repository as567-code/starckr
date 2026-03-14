import { test, expect } from '@playwright/test';

test.describe('Login page', () => {
  test('renders login form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('shows inline validation error for missing inputs', async ({ page }) => {
    await page.goto('/login');
    // Click submit without filling anything — client-side validation fires
    await page.getByRole('button', { name: /sign in/i }).click();
    // MUI TextField helper text indicates the error; page stays at /login
    await expect(page).toHaveURL('/login');
    // At least one error helper text should be visible
    await expect(page.getByText(/this field is required/i).first()).toBeVisible();
  });

  test('shows error dialog on wrong credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('nobody@test.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();
    // AlertDialog renders a MUI Dialog (role="dialog") on auth failure
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 8000 });
  });

  test('has a link to the register page', async ({ page }) => {
    await page.goto('/login');
    const link = page.getByRole('link', { name: /create one/i });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL('/register');
  });
});

test.describe('Register page', () => {
  test('renders registration form', async ({ page }) => {
    await page.goto('/register');
    // Heading text from RegisterPage.tsx: "Create an account"
    await expect(
      page.getByRole('heading', { name: /create an account/i }),
    ).toBeVisible();
    await expect(page.getByLabel(/first name/i)).toBeVisible();
    await expect(page.getByLabel(/last name/i)).toBeVisible();
    await expect(page.getByLabel(/^email$/i)).toBeVisible();
    await expect(page.getByLabel(/^password$/i)).toBeVisible();
    await expect(page.getByLabel(/confirm password/i)).toBeVisible();
  });

  test('shows validation errors for empty form submission', async ({ page }) => {
    await page.goto('/register');
    // Button text from RegisterPage.tsx: "Create account"
    await page.getByRole('button', { name: /create account/i }).click();
    // Client-side validation fires; page stays on /register
    await expect(page).toHaveURL('/register');
    // At least one required-field error should appear
    await expect(page.getByText(/this field is required/i).first()).toBeVisible();
  });

  test('has a link back to the login page', async ({ page }) => {
    await page.goto('/register');
    const link = page.getByRole('link', { name: /sign in/i });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL('/login');
  });
});
