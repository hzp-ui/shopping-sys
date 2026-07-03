const { test, expect } = require('@playwright/test');

test.describe('登录页面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('页面标题和Logo显示正确', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('云亩商城管理系统');
    await expect(page.locator('p')).toContainText('欢迎登录');
  });

  test('用户名和密码输入框存在', async ({ page }) => {
    await expect(page.locator('input[placeholder="用户名"]')).toBeVisible();
    await expect(page.locator('input[placeholder="密码"]')).toBeVisible();
  });

  test('登录按钮存在', async ({ page }) => {
    await expect(page.locator('button[type="submit"]')).toContainText('登录');
  });

  test('空表单提交显示验证错误', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('.ant-form-item-explain-error').first()).toBeVisible();
  });

  test('只输入用户名显示密码验证错误', async ({ page }) => {
    await page.fill('input[placeholder="用户名"]', 'admin');
    await page.click('button[type="submit"]');
    await expect(page.locator('.ant-form-item-explain-error')).toContainText('请输入密码');
  });

  test('成功登录跳转到控制台', async ({ page }) => {
    await page.fill('input[placeholder="用户名"]', 'admin');
    await page.fill('input[placeholder="密码"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('登录成功显示成功提示', async ({ page }) => {
    await page.fill('input[placeholder="用户名"]', 'admin');
    await page.fill('input[placeholder="密码"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page.locator('.ant-message-success')).toBeVisible({ timeout: 5000 });
  });
});
