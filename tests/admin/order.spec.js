const { test, expect } = require('@playwright/test');
const { login } = require('./helpers/auth');

test.describe('订单管理', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/order/list');
  });

  test('页面正确加载', async ({ page }) => {
    await expect(page.locator('.ant-table')).toBeVisible();
  });

  test('搜索区域显示正确', async ({ page }) => {
    await expect(page.getByText('订单号')).toBeVisible();
    await expect(page.getByText('用户名')).toBeVisible();
    await expect(page.getByText('订单状态')).toBeVisible();
  });

  test('搜索输入框存在', async ({ page }) => {
    await expect(page.locator('input[placeholder="请输入订单号"]')).toBeVisible();
    await expect(page.locator('input[placeholder="请输入用户名"]')).toBeVisible();
  });

  test('搜索按钮可点击', async ({ page }) => {
    await expect(page.getByRole('button', { name: '搜索' })).toBeVisible();
  });

  test('订单表格列头显示正确', async ({ page }) => {
    await expect(page.getByText('ID')).toBeVisible();
    await expect(page.getByText('订单号')).toBeVisible();
    await expect(page.getByText('用户')).toBeVisible();
    await expect(page.getByText('订单金额')).toBeVisible();
    await expect(page.getByText('实付金额')).toBeVisible();
    await expect(page.getByText('订单状态')).toBeVisible();
    await expect(page.getByText('创建时间')).toBeVisible();
    await expect(page.getByText('操作')).toBeVisible();
  });

  test('表格有订单数据', async ({ page }) => {
    await page.waitForTimeout(500);
    const rows = page.locator('.ant-table-tbody tr');
    await expect(rows.first()).toBeVisible();
  });

  test('订单状态标签显示正确', async ({ page }) => {
    await page.waitForTimeout(500);
    const tags = page.locator('.ant-tag');
    await expect(tags.first()).toBeVisible();
  });

  test('包含多种订单状态', async ({ page }) => {
    await page.waitForTimeout(500);
    const statuses = ['待付款', '待发货', '已发货', '已完成', '已取消'];
    let found = false;
    for (const status of statuses) {
      const locator = page.getByText(status).first();
      if (await locator.isVisible()) {
        found = true;
        break;
      }
    }
    expect(found).toBeTruthy();
  });

  test('查看详情按钮存在', async ({ page }) => {
    await page.waitForTimeout(500);
    await expect(page.getByRole('button', { name: '详情' }).first()).toBeVisible();
  });

  test('点击详情打开弹窗', async ({ page }) => {
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: '详情' }).first().click();
    await expect(page.locator('.ant-modal-title')).toContainText('订单详情');
  });

  test('订单详情弹窗包含订单信息', async ({ page }) => {
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: '详情' }).first().click();
    await expect(page.locator('.ant-descriptions')).toBeVisible();
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
