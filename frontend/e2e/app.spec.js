import { test, expect } from '@playwright/test'

// E2E suite — requires running backend (localhost:8080) + frontend (localhost:5173).
// Test accounts come from env vars; never hardcode credentials.
// Run: npx playwright test

const USER = {
  name: process.env.E2E_USER_NAME || 'E2E Test User',
  email: process.env.E2E_USER_EMAIL || '',
  password: process.env.E2E_USER_PASSWORD || '',
}
const ADMIN = {
  email: process.env.E2E_ADMIN_EMAIL || '',
  password: process.env.E2E_ADMIN_PASSWORD || '',
}
const hasUser = Boolean(USER.email && USER.password)
const hasAdmin = Boolean(ADMIN.email && ADMIN.password)

test.describe('Public pages', () => {
  test('landing page renders', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/.+/)
    await expect(page.getByRole('link', { name: /sign in|log in/i }).first()).toBeVisible()
  })

  test('unknown route shows 404', async ({ page }) => {
    await page.goto('/definitely-not-a-route')
    await expect(page.getByText(/404|not found/i)).toBeVisible()
  })
})

test.describe('Authentication', () => {
  test.skip(!hasUser, 'E2E_USER_* env vars not set')

  test('login with valid credentials reaches dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill(USER.email)
    await page.getByLabel(/password/i).fill(USER.password)
    await page.getByRole('button', { name: /sign in/i }).click()
    await page.waitForURL(/\/app\//)
    await expect(page).not.toHaveURL(/\/login/)
  })

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('nobody@example.com')
    await page.getByLabel(/password/i).fill('WrongPass1!')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByRole('alert')).toBeVisible({ timeout: 10_000 })
  })

  test('protected route redirects to login', async ({ page }) => {
    await page.goto('/app/feed')
    await page.waitForURL(/\/login/)
  })

  test('logout returns to public site', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill(USER.email)
    await page.getByLabel(/password/i).fill(USER.password)
    await page.getByRole('button', { name: /sign in/i }).click()
    await page.waitForURL(/\/app\//)
    await page.getByRole('button', { name: /log ?out/i }).first().click()
    await page.waitForURL(/\/(login)?$/)
  })
})

test.describe('Password reset', () => {
  test('forgot password accepts email and shows confirmation', async ({ page }) => {
    await page.goto('/forgot-password')
    await page.getByLabel(/email/i).fill(USER.email || 'test@example.com')
    await page.getByRole('button', { name: /send|reset|continue/i }).click()
    await expect(page.getByRole('status').or(page.getByText(/sent|check your email/i))).toBeVisible({ timeout: 10_000 })
  })

  test('reset page validates mismatched passwords', async ({ page }) => {
    await page.goto('/reset-password')
    await page.getByLabel(/reset code|token|otp/i).fill('123456')
    await page.getByLabel('New password').fill('Password1!')
    await page.getByLabel('Confirm new password').fill('Different1!')
    await page.getByRole('button', { name: /reset|update/i }).click()
    await expect(page.getByText(/do not match|match/i)).toBeVisible()
  })
})

test.describe('Admin', () => {
  test.skip(!hasAdmin, 'E2E_ADMIN_* env vars not set')

  test('admin route protection redirects to admin login', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await page.waitForURL(/\/login/)
  })

  test('admin login reaches dashboard via main login page', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill(ADMIN.email)
    await page.getByLabel(/password/i).fill(ADMIN.password)
    await page.getByRole('button', { name: /sign in|log in/i }).click()
    await page.waitForURL(/\/admin\/dashboard/)
  })
})
