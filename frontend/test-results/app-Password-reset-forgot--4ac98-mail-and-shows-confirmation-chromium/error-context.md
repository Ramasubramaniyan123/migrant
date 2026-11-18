# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.js >> Password reset >> forgot password accepts email and shows confirmation
- Location: e2e\app.spec.js:69:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/forgot-password
Call log:
  - navigating to "http://localhost:5173/forgot-password", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | 
  3   | // E2E suite — requires running backend (localhost:8080) + frontend (localhost:5173).
  4   | // Test accounts come from env vars; never hardcode credentials.
  5   | // Run: npx playwright test
  6   | 
  7   | const USER = {
  8   |   name: process.env.E2E_USER_NAME || 'E2E Test User',
  9   |   email: process.env.E2E_USER_EMAIL || '',
  10  |   password: process.env.E2E_USER_PASSWORD || '',
  11  | }
  12  | const ADMIN = {
  13  |   email: process.env.E2E_ADMIN_EMAIL || '',
  14  |   password: process.env.E2E_ADMIN_PASSWORD || '',
  15  | }
  16  | const hasUser = Boolean(USER.email && USER.password)
  17  | const hasAdmin = Boolean(ADMIN.email && ADMIN.password)
  18  | 
  19  | test.describe('Public pages', () => {
  20  |   test('landing page renders', async ({ page }) => {
  21  |     await page.goto('/')
  22  |     await expect(page).toHaveTitle(/.+/)
  23  |     await expect(page.getByRole('link', { name: /sign in|log in/i }).first()).toBeVisible()
  24  |   })
  25  | 
  26  |   test('unknown route shows 404', async ({ page }) => {
  27  |     await page.goto('/definitely-not-a-route')
  28  |     await expect(page.getByText(/404|not found/i)).toBeVisible()
  29  |   })
  30  | })
  31  | 
  32  | test.describe('Authentication', () => {
  33  |   test.skip(!hasUser, 'E2E_USER_* env vars not set')
  34  | 
  35  |   test('login with valid credentials reaches dashboard', async ({ page }) => {
  36  |     await page.goto('/login')
  37  |     await page.getByLabel(/email/i).fill(USER.email)
  38  |     await page.getByLabel(/password/i).fill(USER.password)
  39  |     await page.getByRole('button', { name: /sign in/i }).click()
  40  |     await page.waitForURL(/\/app\//)
  41  |     await expect(page).not.toHaveURL(/\/login/)
  42  |   })
  43  | 
  44  |   test('login with invalid credentials shows error', async ({ page }) => {
  45  |     await page.goto('/login')
  46  |     await page.getByLabel(/email/i).fill('nobody@example.com')
  47  |     await page.getByLabel(/password/i).fill('WrongPass1!')
  48  |     await page.getByRole('button', { name: /sign in/i }).click()
  49  |     await expect(page.getByRole('alert')).toBeVisible({ timeout: 10_000 })
  50  |   })
  51  | 
  52  |   test('protected route redirects to login', async ({ page }) => {
  53  |     await page.goto('/app/feed')
  54  |     await page.waitForURL(/\/login/)
  55  |   })
  56  | 
  57  |   test('logout returns to public site', async ({ page }) => {
  58  |     await page.goto('/login')
  59  |     await page.getByLabel(/email/i).fill(USER.email)
  60  |     await page.getByLabel(/password/i).fill(USER.password)
  61  |     await page.getByRole('button', { name: /sign in/i }).click()
  62  |     await page.waitForURL(/\/app\//)
  63  |     await page.getByRole('button', { name: /log ?out/i }).first().click()
  64  |     await page.waitForURL(/\/(login)?$/)
  65  |   })
  66  | })
  67  | 
  68  | test.describe('Password reset', () => {
  69  |   test('forgot password accepts email and shows confirmation', async ({ page }) => {
> 70  |     await page.goto('/forgot-password')
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/forgot-password
  71  |     await page.getByLabel(/email/i).fill(USER.email || 'test@example.com')
  72  |     await page.getByRole('button', { name: /send|reset|continue/i }).click()
  73  |     await expect(page.getByRole('status').or(page.getByText(/sent|check your email/i))).toBeVisible({ timeout: 10_000 })
  74  |   })
  75  | 
  76  |   test('reset page validates mismatched passwords', async ({ page }) => {
  77  |     await page.goto('/reset-password')
  78  |     await page.getByLabel(/reset code|token|otp/i).fill('123456')
  79  |     await page.getByLabel('New password').fill('Password1!')
  80  |     await page.getByLabel('Confirm new password').fill('Different1!')
  81  |     await page.getByRole('button', { name: /reset|update/i }).click()
  82  |     await expect(page.getByText(/do not match|match/i)).toBeVisible()
  83  |   })
  84  | })
  85  | 
  86  | test.describe('Admin', () => {
  87  |   test.skip(!hasAdmin, 'E2E_ADMIN_* env vars not set')
  88  | 
  89  |   test('admin route protection redirects to admin login', async ({ page }) => {
  90  |     await page.goto('/admin/dashboard')
  91  |     await page.waitForURL(/\/admin\/login/)
  92  |   })
  93  | 
  94  |   test('admin login reaches dashboard', async ({ page }) => {
  95  |     await page.goto('/admin/login')
  96  |     await page.getByLabel(/email/i).fill(ADMIN.email)
  97  |     await page.getByLabel(/password/i).fill(ADMIN.password)
  98  |     await page.getByRole('button', { name: /sign in|log in/i }).click()
  99  |     await page.waitForURL(/\/admin\/dashboard/)
  100 |   })
  101 | })
  102 | 
```