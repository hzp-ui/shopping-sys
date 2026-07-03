# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: goods.spec.js >> 商品管理 - 商品列表 >> 搜索按钮可点击
- Location: tests\admin\goods.spec.js:20:3

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
    - menuitem "shopping 商品管理" [expanded]:
      - img "shopping"
      - text: 商品管理
    - menu:
      - menuitem "商品列表"
      - menuitem "商品分类"
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
  1   | const { test, expect } = require('@playwright/test');
  2   | const { login } = require('./helpers/auth');
  3   | 
  4   | test.describe('商品管理 - 商品列表', () => {
  5   |   test.beforeEach(async ({ page }) => {
  6   |     await login(page);
  7   |     await page.goto('/goods/list');
  8   |   });
  9   | 
  10  |   test('页面标题和搜索区域显示正确', async ({ page }) => {
  11  |     await expect(page.getByText('商品名称')).toBeVisible();
  12  |     await expect(page.getByText('状态')).toBeVisible();
  13  |     await expect(page.getByText('分类')).toBeVisible();
  14  |   });
  15  | 
  16  |   test('搜索输入框存在', async ({ page }) => {
  17  |     await expect(page.locator('input[placeholder="请输入商品名称"]')).toBeVisible();
  18  |   });
  19  | 
  20  |   test('搜索按钮可点击', async ({ page }) => {
> 21  |     await expect(page.getByRole('button', { name: '搜索' })).toBeVisible();
      |                                                            ^ Error: expect(locator).toBeVisible() failed
  22  |   });
  23  | 
  24  |   test('新增商品按钮存在', async ({ page }) => {
  25  |     await expect(page.getByRole('button', { name: /新增/ })).toBeVisible();
  26  |   });
  27  | 
  28  |   test('商品表格显示正确', async ({ page }) => {
  29  |     await expect(page.locator('.ant-table')).toBeVisible();
  30  |   });
  31  | 
  32  |   test('表格列头显示正确', async ({ page }) => {
  33  |     await expect(page.getByText('ID')).toBeVisible();
  34  |     await expect(page.getByText('商品名称')).toBeVisible();
  35  |     await expect(page.getByText('商品分类')).toBeVisible();
  36  |     await expect(page.getByText('价格')).toBeVisible();
  37  |     await expect(page.getByText('库存')).toBeVisible();
  38  |     await expect(page.getByText('状态')).toBeVisible();
  39  |     await expect(page.getByText('创建时间')).toBeVisible();
  40  |     await expect(page.getByText('操作')).toBeVisible();
  41  |   });
  42  | 
  43  |   test('表格有数据行', async ({ page }) => {
  44  |     await page.waitForTimeout(500);
  45  |     const rows = page.locator('.ant-table-tbody tr');
  46  |     await expect(rows.first()).toBeVisible();
  47  |   });
  48  | 
  49  |   test('商品状态标签显示正确（上架/下架）', async ({ page }) => {
  50  |     await page.waitForTimeout(500);
  51  |     const tags = page.locator('.ant-tag');
  52  |     await expect(tags.first()).toBeVisible();
  53  |   });
  54  | 
  55  |   test('操作列有编辑和删除按钮', async ({ page }) => {
  56  |     await page.waitForTimeout(500);
  57  |     await expect(page.getByRole('button', { name: '编辑' }).first()).toBeVisible();
  58  |     await expect(page.getByRole('button', { name: '删除' }).first()).toBeVisible();
  59  |   });
  60  | 
  61  |   test('点击新增按钮打开弹窗', async ({ page }) => {
  62  |     await page.getByRole('button', { name: /新增/ }).click();
  63  |     await expect(page.locator('.ant-modal-title')).toContainText('商品');
  64  |   });
  65  | 
  66  |   test('点击编辑按钮打开弹窗', async ({ page }) => {
  67  |     await page.waitForTimeout(500);
  68  |     await page.getByRole('button', { name: '编辑' }).first().click();
  69  |     await expect(page.locator('.ant-modal-title')).toContainText('商品');
  70  |   });
  71  | 
  72  |   test('点击删除按钮显示确认弹窗', async ({ page }) => {
  73  |     await page.waitForTimeout(500);
  74  |     page.on('dialog', dialog => dialog.accept());
  75  |     await page.getByRole('button', { name: '删除' }).first().click();
  76  |   });
  77  | 
  78  |   test('分页组件存在', async ({ page }) => {
  79  |     await expect(page.locator('.ant-pagination')).toBeVisible();
  80  |   });
  81  | 
  82  |   test('可以切换分页', async ({ page }) => {
  83  |     await page.waitForTimeout(500);
  84  |     const page2 = page.locator('.ant-pagination-item-2');
  85  |     if (await page2.isVisible()) {
  86  |       await page2.click();
  87  |       await expect(page2).toHaveClass(/ant-pagination-item-active/);
  88  |     }
  89  |   });
  90  | });
  91  | 
  92  | test.describe('商品管理 - 商品分类', () => {
  93  |   test.beforeEach(async ({ page }) => {
  94  |     await login(page);
  95  |     await page.goto('/goods/category');
  96  |   });
  97  | 
  98  |   test('页面正确加载', async ({ page }) => {
  99  |     await expect(page.locator('.ant-table')).toBeVisible();
  100 |   });
  101 | 
  102 |   test('新增分类按钮存在', async ({ page }) => {
  103 |     await expect(page.getByRole('button', { name: /新增/ })).toBeVisible();
  104 |   });
  105 | 
  106 |   test('表格有分类数据', async ({ page }) => {
  107 |     await page.waitForTimeout(500);
  108 |     const rows = page.locator('.ant-table-tbody tr');
  109 |     await expect(rows.first()).toBeVisible();
  110 |   });
  111 | 
  112 |   test('点击新增打开弹窗', async ({ page }) => {
  113 |     await page.getByRole('button', { name: /新增/ }).click();
  114 |     await expect(page.locator('.ant-modal-title')).toBeVisible();
  115 |   });
  116 | });
  117 | 
```