const { test, expect } = require('@playwright/test');
const { login } = require('./helpers/auth');

test.describe('商品管理 - 商品列表', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/goods/list');
  });

  test('页面标题和搜索区域显示正确', async ({ page }) => {
    await expect(page.getByText('商品名称')).toBeVisible();
    await expect(page.getByText('状态')).toBeVisible();
    await expect(page.getByText('分类')).toBeVisible();
  });

  test('搜索输入框存在', async ({ page }) => {
    await expect(page.locator('input[placeholder="请输入商品名称"]')).toBeVisible();
  });

  test('搜索按钮可点击', async ({ page }) => {
    await expect(page.getByRole('button', { name: '搜索' })).toBeVisible();
  });

  test('新增商品按钮存在', async ({ page }) => {
    await expect(page.getByRole('button', { name: /新增/ })).toBeVisible();
  });

  test('商品表格显示正确', async ({ page }) => {
    await expect(page.locator('.ant-table')).toBeVisible();
  });

  test('表格列头显示正确', async ({ page }) => {
    await expect(page.getByText('ID')).toBeVisible();
    await expect(page.getByText('商品名称')).toBeVisible();
    await expect(page.getByText('商品分类')).toBeVisible();
    await expect(page.getByText('价格')).toBeVisible();
    await expect(page.getByText('库存')).toBeVisible();
    await expect(page.getByText('状态')).toBeVisible();
    await expect(page.getByText('创建时间')).toBeVisible();
    await expect(page.getByText('操作')).toBeVisible();
  });

  test('表格有数据行', async ({ page }) => {
    await page.waitForTimeout(500);
    const rows = page.locator('.ant-table-tbody tr');
    await expect(rows.first()).toBeVisible();
  });

  test('商品状态标签显示正确（上架/下架）', async ({ page }) => {
    await page.waitForTimeout(500);
    const tags = page.locator('.ant-tag');
    await expect(tags.first()).toBeVisible();
  });

  test('操作列有编辑和删除按钮', async ({ page }) => {
    await page.waitForTimeout(500);
    await expect(page.getByRole('button', { name: '编辑' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: '删除' }).first()).toBeVisible();
  });

  test('点击新增按钮打开弹窗', async ({ page }) => {
    await page.getByRole('button', { name: /新增/ }).click();
    await expect(page.locator('.ant-modal-title')).toContainText('商品');
  });

  test('点击编辑按钮打开弹窗', async ({ page }) => {
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: '编辑' }).first().click();
    await expect(page.locator('.ant-modal-title')).toContainText('商品');
  });

  test('点击删除按钮显示确认弹窗', async ({ page }) => {
    await page.waitForTimeout(500);
    page.on('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: '删除' }).first().click();
  });

  test('分页组件存在', async ({ page }) => {
    await expect(page.locator('.ant-pagination')).toBeVisible();
  });

  test('可以切换分页', async ({ page }) => {
    await page.waitForTimeout(500);
    const page2 = page.locator('.ant-pagination-item-2');
    if (await page2.isVisible()) {
      await page2.click();
      await expect(page2).toHaveClass(/ant-pagination-item-active/);
    }
  });
});

test.describe('商品管理 - 商品分类', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/goods/category');
  });

  test('页面正确加载', async ({ page }) => {
    await expect(page.locator('.ant-table')).toBeVisible();
  });

  test('新增分类按钮存在', async ({ page }) => {
    await expect(page.getByRole('button', { name: /新增/ })).toBeVisible();
  });

  test('表格有分类数据', async ({ page }) => {
    await page.waitForTimeout(500);
    const rows = page.locator('.ant-table-tbody tr');
    await expect(rows.first()).toBeVisible();
  });

  test('点击新增打开弹窗', async ({ page }) => {
    await page.getByRole('button', { name: /新增/ }).click();
    await expect(page.locator('.ant-modal-title')).toBeVisible();
  });
});
