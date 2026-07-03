# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: user.spec.js >> 用户管理 >> 搜索按钮可点击
- Location: tests\admin\user.spec.js:25:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: '搜索' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: '搜索' })

```

```yaml
- complementary:
  - text: 云亩商城管理系统
  - menu:
    - menuitem "dashboard 控制台":
      - img "dashboard"
      - text: 控制台
    - menuitem "shopping 商品管理":
      - img "shopping"
      - text: 商品管理
    - menuitem "unordered-list 订单管理":
      - img "unordered-list"
      - text: 订单管理
    - menuitem "user 用户管理":
      - img "user"
      - text: 用户管理
- banner:
  - img "menu-fold"
  - img "user"
  - text: 管理员
- main
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | const { login } = require('./helpers/auth');
  3  | 
  4  | test.describe('用户管理', () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await login(page);
  7  |     await page.goto('/user/list');
  8  |   });
  9  | 
  10 |   test('页面正确加载', async ({ page }) => {
  11 |     await expect(page.locator('.ant-table')).toBeVisible();
  12 |   });
  13 | 
  14 |   test('搜索区域显示正确', async ({ page }) => {
  15 |     await expect(page.getByText('用户名')).toBeVisible();
  16 |     await expect(page.getByText('手机号')).toBeVisible();
  17 |     await expect(page.getByText('状态')).toBeVisible();
  18 |   });
  19 | 
  20 |   test('搜索输入框存在', async ({ page }) => {
  21 |     await expect(page.locator('input[placeholder="请输入用户名"]')).toBeVisible();
  22 |     await expect(page.locator('input[placeholder="请输入手机号"]')).toBeVisible();
  23 |   });
  24 | 
  25 |   test('搜索按钮可点击', async ({ page }) => {
> 26 |     await expect(page.getByRole('button', { name: '搜索' })).toBeVisible();
     |                                                            ^ Error: expect(locator).toBeVisible() failed
  27 |   });
  28 | 
  29 |   test('用户表格列头显示正确', async ({ page }) => {
  30 |     await expect(page.getByText('ID')).toBeVisible();
  31 |     await expect(page.getByText('头像')).toBeVisible();
  32 |     await expect(page.getByText('用户名')).toBeVisible();
  33 |     await expect(page.getByText('昵称')).toBeVisible();
  34 |     await expect(page.getByText('手机号')).toBeVisible();
  35 |     await expect(page.getByText('邮箱')).toBeVisible();
  36 |     await expect(page.getByText('状态')).toBeVisible();
  37 |     await expect(page.getByText('创建时间')).toBeVisible();
  38 |   });
  39 | 
  40 |   test('表格有用户数据', async ({ page }) => {
  41 |     await page.waitForTimeout(500);
  42 |     const rows = page.locator('.ant-table-tbody tr');
  43 |     await expect(rows.first()).toBeVisible();
  44 |   });
  45 | 
  46 |   test('用户头像显示', async ({ page }) => {
  47 |     await page.waitForTimeout(500);
  48 |     const avatars = page.locator('.ant-avatar');
  49 |     await expect(avatars.first()).toBeVisible();
  50 |   });
  51 | 
  52 |   test('状态开关存在', async ({ page }) => {
  53 |     await page.waitForTimeout(500);
  54 |     const switches = page.locator('.ant-switch');
  55 |     await expect(switches.first()).toBeVisible();
  56 |   });
  57 | 
  58 |   test('可以切换用户状态', async ({ page }) => {
  59 |     await page.waitForTimeout(500);
  60 |     const switchEl = page.locator('.ant-switch').first();
  61 |     const initialState = await switchEl.getAttribute('aria-checked');
  62 |     await switchEl.click();
  63 |     const newState = await switchEl.getAttribute('aria-checked');
  64 |     expect(newState).not.toBe(initialState);
  65 |   });
  66 | 
  67 |   test('分页组件存在', async ({ page }) => {
  68 |     await expect(page.locator('.ant-pagination')).toBeVisible();
  69 |   });
  70 | 
  71 |   test('可以切换分页', async ({ page }) => {
  72 |     await page.waitForTimeout(500);
  73 |     const page2 = page.locator('.ant-pagination-item-2');
  74 |     if (await page2.isVisible()) {
  75 |       await page2.click();
  76 |       await expect(page2).toHaveClass(/ant-pagination-item-active/);
  77 |     }
  78 |   });
  79 | 
  80 |   test('重置按钮存在', async ({ page }) => {
  81 |     await expect(page.getByRole('button', { name: '重置' })).toBeVisible();
  82 |   });
  83 | 
  84 |   test('点击重置清空搜索条件', async ({ page }) => {
  85 |     const input = page.locator('input[placeholder="请输入用户名"]');
  86 |     await input.fill('testuser');
  87 |     await expect(input).toHaveValue('testuser');
  88 |     await page.getByRole('button', { name: '重置' }).click();
  89 |     await expect(input).toHaveValue('');
  90 |   });
  91 | });
  92 | 
```