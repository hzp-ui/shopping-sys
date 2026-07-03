# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: order.spec.js >> 订单管理 >> 搜索按钮可点击
- Location: tests\admin\order.spec.js:25:3

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
  4  | test.describe('订单管理', () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await login(page);
  7  |     await page.goto('/order/list');
  8  |   });
  9  | 
  10 |   test('页面正确加载', async ({ page }) => {
  11 |     await expect(page.locator('.ant-table')).toBeVisible();
  12 |   });
  13 | 
  14 |   test('搜索区域显示正确', async ({ page }) => {
  15 |     await expect(page.getByText('订单号')).toBeVisible();
  16 |     await expect(page.getByText('用户名')).toBeVisible();
  17 |     await expect(page.getByText('订单状态')).toBeVisible();
  18 |   });
  19 | 
  20 |   test('搜索输入框存在', async ({ page }) => {
  21 |     await expect(page.locator('input[placeholder="请输入订单号"]')).toBeVisible();
  22 |     await expect(page.locator('input[placeholder="请输入用户名"]')).toBeVisible();
  23 |   });
  24 | 
  25 |   test('搜索按钮可点击', async ({ page }) => {
> 26 |     await expect(page.getByRole('button', { name: '搜索' })).toBeVisible();
     |                                                            ^ Error: expect(locator).toBeVisible() failed
  27 |   });
  28 | 
  29 |   test('订单表格列头显示正确', async ({ page }) => {
  30 |     await expect(page.getByText('ID')).toBeVisible();
  31 |     await expect(page.getByText('订单号')).toBeVisible();
  32 |     await expect(page.getByText('用户')).toBeVisible();
  33 |     await expect(page.getByText('订单金额')).toBeVisible();
  34 |     await expect(page.getByText('实付金额')).toBeVisible();
  35 |     await expect(page.getByText('订单状态')).toBeVisible();
  36 |     await expect(page.getByText('创建时间')).toBeVisible();
  37 |     await expect(page.getByText('操作')).toBeVisible();
  38 |   });
  39 | 
  40 |   test('表格有订单数据', async ({ page }) => {
  41 |     await page.waitForTimeout(500);
  42 |     const rows = page.locator('.ant-table-tbody tr');
  43 |     await expect(rows.first()).toBeVisible();
  44 |   });
  45 | 
  46 |   test('订单状态标签显示正确', async ({ page }) => {
  47 |     await page.waitForTimeout(500);
  48 |     const tags = page.locator('.ant-tag');
  49 |     await expect(tags.first()).toBeVisible();
  50 |   });
  51 | 
  52 |   test('包含多种订单状态', async ({ page }) => {
  53 |     await page.waitForTimeout(500);
  54 |     const statuses = ['待付款', '待发货', '已发货', '已完成', '已取消'];
  55 |     let found = false;
  56 |     for (const status of statuses) {
  57 |       const locator = page.getByText(status).first();
  58 |       if (await locator.isVisible()) {
  59 |         found = true;
  60 |         break;
  61 |       }
  62 |     }
  63 |     expect(found).toBeTruthy();
  64 |   });
  65 | 
  66 |   test('查看详情按钮存在', async ({ page }) => {
  67 |     await page.waitForTimeout(500);
  68 |     await expect(page.getByRole('button', { name: '详情' }).first()).toBeVisible();
  69 |   });
  70 | 
  71 |   test('点击详情打开弹窗', async ({ page }) => {
  72 |     await page.waitForTimeout(500);
  73 |     await page.getByRole('button', { name: '详情' }).first().click();
  74 |     await expect(page.locator('.ant-modal-title')).toContainText('订单详情');
  75 |   });
  76 | 
  77 |   test('订单详情弹窗包含订单信息', async ({ page }) => {
  78 |     await page.waitForTimeout(500);
  79 |     await page.getByRole('button', { name: '详情' }).first().click();
  80 |     await expect(page.locator('.ant-descriptions')).toBeVisible();
  81 |   });
  82 | 
  83 |   test('分页组件存在', async ({ page }) => {
  84 |     await expect(page.locator('.ant-pagination')).toBeVisible();
  85 |   });
  86 | 
  87 |   test('可以切换分页', async ({ page }) => {
  88 |     await page.waitForTimeout(500);
  89 |     const page2 = page.locator('.ant-pagination-item-2');
  90 |     if (await page2.isVisible()) {
  91 |       await page2.click();
  92 |       await expect(page2).toHaveClass(/ant-pagination-item-active/);
  93 |     }
  94 |   });
  95 | });
  96 | 
```