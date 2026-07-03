const { test, expect } = require('@playwright/test');
const { login } = require('./helpers/auth');

test.describe('用户管理', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/user/list');
  });

  test('页面正确加载', async ({ page }) => {
    await expect(page.locator('.ant-table')).toBeVisible();
  });

  test('搜索区域显示正确', async ({ page }) => {
    await expect(page.getByText('用户名')).toBeVisible();
    await expect(page.getByText('手机号')).toBeVisible();
    await expect(page.getByText('状态')).toBeVisible();
  });

  test('搜索输入框存在', async ({ page }) => {
    await expect(page.locator('input[placeholder="请输入用户名"]')).toBeVisible();
    await expect(page.locator('input[placeholder="请输入手机号"]')).toBeVisible();
  });

  test('搜索按钮可点击', async ({ page }) => {
    await expect(page.getByRole('button', { name: '搜索' })).toBeVisible();
  });

  test('用户表格列头显示正确', async ({ page }) => {
    await expect(page.getByText('ID')).toBeVisible();
    await expect(page.getByText('头像')).toBeVisible();
    await expect(page.getByText('用户名')).toBeVisible();
    await expect(page.getByText('昵称')).toBeVisible();
    await expect(page.getByText('手机号')).toBeVisible();
    await expect(page.getByText('邮箱')).toBeVisible();
    await expect(page.getByText('状态')).toBeVisible();
    await expect(page.getByText('创建时间')).toBeVisible();
  });

  test('表格有用户数据', async ({ page }) => {
    await page.waitForTimeout(500);
    const rows = page.locator('.ant-table-tbody tr');
    await expect(rows.first()).toBeVisible();
  });

  test('用户头像显示', async ({ page }) => {
    await page.waitForTimeout(500);
    const avatars = page.locator('.ant-avatar');
    await expect(avatars.first()).toBeVisible();
  });

  test('状态开关存在', async ({ page }) => {
    await page.waitForTimeout(500);
    const switches = page.locator('.ant-switch');
    await expect(switches.first()).toBeVisible();
  });

  test('可以切换用户状态', async ({ page }) => {
    await page.waitForTimeout(500);
    const switchEl = page.locator('.ant-switch').first();
    const initialState = await switchEl.getAttribute('aria-checked');
    await switchEl.click();
    const newState = await switchEl.getAttribute('aria-checked');
    expect(newState).not.toBe(initialState);
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

  test('重置按钮存在', async ({ page }) => {
    await expect(page.getByRole('button', { name: '重置' })).toBeVisible();
  });

  test('点击重置清空搜索条件', async ({ page }) => {
    const input = page.locator('input[placeholder="请输入用户名"]');
    await input.fill('testuser');
    await expect(input).toHaveValue('testuser');
    await page.getByRole('button', { name: '重置' }).click();
    await expect(input).toHaveValue('');
  });
});
