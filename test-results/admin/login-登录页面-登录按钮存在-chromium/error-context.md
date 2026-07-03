# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.js >> 登录页面 >> 登录按钮存在
- Location: tests\admin\login.spec.js:18:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('button[type="submit"]')
Expected substring: "登录"
Received string:    "登 录"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('button[type="submit"]')
    13 × locator resolved to <button type="submit" class="ant-btn css-dev-only-do-not-override-mncuj7 ant-btn-primary ant-btn-color-primary ant-btn-variant-solid ant-btn-lg ant-btn-block">…</button>
       - unexpected value "登 录"

```

```yaml
- button "登 录"
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('登录页面', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/login');
  6  |   });
  7  | 
  8  |   test('页面标题和Logo显示正确', async ({ page }) => {
  9  |     await expect(page.locator('h1')).toContainText('云亩商城管理系统');
  10 |     await expect(page.locator('p')).toContainText('欢迎登录');
  11 |   });
  12 | 
  13 |   test('用户名和密码输入框存在', async ({ page }) => {
  14 |     await expect(page.locator('input[placeholder="用户名"]')).toBeVisible();
  15 |     await expect(page.locator('input[placeholder="密码"]')).toBeVisible();
  16 |   });
  17 | 
  18 |   test('登录按钮存在', async ({ page }) => {
> 19 |     await expect(page.locator('button[type="submit"]')).toContainText('登录');
     |                                                         ^ Error: expect(locator).toContainText(expected) failed
  20 |   });
  21 | 
  22 |   test('空表单提交显示验证错误', async ({ page }) => {
  23 |     await page.click('button[type="submit"]');
  24 |     await expect(page.locator('.ant-form-item-explain-error').first()).toBeVisible();
  25 |   });
  26 | 
  27 |   test('只输入用户名显示密码验证错误', async ({ page }) => {
  28 |     await page.fill('input[placeholder="用户名"]', 'admin');
  29 |     await page.click('button[type="submit"]');
  30 |     await expect(page.locator('.ant-form-item-explain-error')).toContainText('请输入密码');
  31 |   });
  32 | 
  33 |   test('成功登录跳转到控制台', async ({ page }) => {
  34 |     await page.fill('input[placeholder="用户名"]', 'admin');
  35 |     await page.fill('input[placeholder="密码"]', 'admin123');
  36 |     await page.click('button[type="submit"]');
  37 |     await expect(page).toHaveURL(/\/dashboard/);
  38 |   });
  39 | 
  40 |   test('登录成功显示成功提示', async ({ page }) => {
  41 |     await page.fill('input[placeholder="用户名"]', 'admin');
  42 |     await page.fill('input[placeholder="密码"]', 'admin123');
  43 |     await page.click('button[type="submit"]');
  44 |     await expect(page.locator('.ant-message-success')).toBeVisible({ timeout: 5000 });
  45 |   });
  46 | });
  47 | 
```