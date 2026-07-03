const { test, expect } = require('@playwright/test');
const { login } = require('./helpers/auth');

test.describe('侧边栏导航', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('侧边栏Logo显示正确', async ({ page }) => {
    await expect(page.locator('.ant-layout-sider')).toContainText('云亩商城管理系统');
  });

  test('控制台菜单可点击并跳转', async ({ page }) => {
    await page.getByText('控制台').click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('商品管理菜单可展开', async ({ page }) => {
    await page.getByText('商品管理').click();
    await expect(page.getByText('商品列表')).toBeVisible();
    await expect(page.getByText('商品分类')).toBeVisible();
  });

  test('商品列表页面可访问', async ({ page }) => {
    await page.getByText('商品管理').click();
    await page.getByText('商品列表').click();
    await expect(page).toHaveURL(/\/goods\/list/);
  });

  test('商品分类页面可访问', async ({ page }) => {
    await page.getByText('商品管理').click();
    await page.getByText('商品分类').click();
    await expect(page).toHaveURL(/\/goods\/category/);
  });

  test('订单管理页面可访问', async ({ page }) => {
    await page.getByText('订单管理').click();
    await expect(page).toHaveURL(/\/order\/list/);
  });

  test('用户管理页面可访问', async ({ page }) => {
    await page.getByText('用户管理').click();
    await expect(page).toHaveURL(/\/user\/list/);
  });

  test('侧边栏折叠展开功能', async ({ page }) => {
    const collapseButton = page.locator('.anticon-menu-fold, .anticon-menu-unfold').first();
    await expect(collapseButton).toBeVisible();
    await collapseButton.click();
    await expect(page.locator('.ant-layout-sider-collapsed')).toBeVisible();
    await collapseButton.click();
    await expect(page.locator('.ant-layout-sider-collapsed')).not.toBeVisible();
  });

  test('顶部用户信息显示', async ({ page }) => {
    await expect(page.locator('.ant-avatar')).toBeVisible();
    await expect(page.getByText('管理员')).toBeVisible();
  });

  test('退出登录功能', async ({ page }) => {
    await page.getByText('管理员').click();
    await page.getByText('退出登录').click();
    await expect(page).toHaveURL(/\/login/);
  });
});
