# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard.spec.js >> 控制台/仪表盘 >> 日期范围选择器存在
- Location: tests\admin\dashboard.spec.js:10:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.ant-picker-range')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.ant-picker-range')

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
  4  | test.describe('控制台/仪表盘', () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await login(page);
  7  |     await page.goto('/dashboard');
  8  |   });
  9  | 
  10 |   test('日期范围选择器存在', async ({ page }) => {
> 11 |     await expect(page.locator('.ant-picker-range')).toBeVisible();
     |                                                     ^ Error: expect(locator).toBeVisible() failed
  12 |   });
  13 | 
  14 |   test('四个统计卡片显示正确', async ({ page }) => {
  15 |     await expect(page.getByText('今日访问量')).toBeVisible();
  16 |     await expect(page.getByText('今日订单数')).toBeVisible();
  17 |     await expect(page.getByText('今日销售额')).toBeVisible();
  18 |     await expect(page.getByText('今日新增用户')).toBeVisible();
  19 |   });
  20 | 
  21 |   test('统计数据显示数值', async ({ page }) => {
  22 |     await page.waitForTimeout(1000);
  23 |     const cards = page.locator('.ant-statistic-content-value');
  24 |     await expect(cards).toHaveCount(4);
  25 |   });
  26 | 
  27 |   test('访问量趋势图表存在', async ({ page }) => {
  28 |     await expect(page.getByText('访问/订单趋势')).toBeVisible();
  29 |     await expect(page.locator('.echarts-for-react').first()).toBeVisible();
  30 |   });
  31 | 
  32 |   test('销售占比饼图存在', async ({ page }) => {
  33 |     await expect(page.getByText('商品分类销售占比')).toBeVisible();
  34 |     await expect(page.locator('.echarts-for-react').nth(1)).toBeVisible();
  35 |   });
  36 | 
  37 |   test('统计卡片包含增长/下降标识', async ({ page }) => {
  38 |     page.waitForTimeout(1000);
  39 |     const upArrows = page.locator('.anticon-arrow-up');
  40 |     const downArrows = page.locator('.anticon-arrow-down');
  41 |     await expect(upArrows.first()).toBeVisible();
  42 |     await expect(downArrows.first()).toBeVisible();
  43 |   });
  44 | 
  45 |   test('折线图图例显示正确', async ({ page }) => {
  46 |     await expect(page.getByText('访问量')).toBeVisible();
  47 |     await expect(page.getByText('订单量')).toBeVisible();
  48 |   });
  49 | 
  50 |   test('饼图图例包含商品分类', async ({ page }) => {
  51 |     await expect(page.getByText('电子产品')).toBeVisible();
  52 |     await expect(page.getByText('服装鞋帽')).toBeVisible();
  53 |     await expect(page.getByText('食品饮料')).toBeVisible();
  54 |   });
  55 | });
  56 | 
```