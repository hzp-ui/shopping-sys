const { test, expect } = require('@playwright/test');
const { login } = require('./helpers/auth');

test.describe('控制台/仪表盘', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/dashboard');
  });

  test('日期范围选择器存在', async ({ page }) => {
    await expect(page.locator('.ant-picker-range')).toBeVisible();
  });

  test('四个统计卡片显示正确', async ({ page }) => {
    await expect(page.getByText('今日访问量')).toBeVisible();
    await expect(page.getByText('今日订单数')).toBeVisible();
    await expect(page.getByText('今日销售额')).toBeVisible();
    await expect(page.getByText('今日新增用户')).toBeVisible();
  });

  test('统计数据显示数值', async ({ page }) => {
    await page.waitForTimeout(1000);
    const cards = page.locator('.ant-statistic-content-value');
    await expect(cards).toHaveCount(4);
  });

  test('访问量趋势图表存在', async ({ page }) => {
    await expect(page.getByText('访问/订单趋势')).toBeVisible();
    await expect(page.locator('.echarts-for-react').first()).toBeVisible();
  });

  test('销售占比饼图存在', async ({ page }) => {
    await expect(page.getByText('商品分类销售占比')).toBeVisible();
    await expect(page.locator('.echarts-for-react').nth(1)).toBeVisible();
  });

  test('统计卡片包含增长/下降标识', async ({ page }) => {
    page.waitForTimeout(1000);
    const upArrows = page.locator('.anticon-arrow-up');
    const downArrows = page.locator('.anticon-arrow-down');
    await expect(upArrows.first()).toBeVisible();
    await expect(downArrows.first()).toBeVisible();
  });

  test('折线图图例显示正确', async ({ page }) => {
    await expect(page.getByText('访问量')).toBeVisible();
    await expect(page.getByText('订单量')).toBeVisible();
  });

  test('饼图图例包含商品分类', async ({ page }) => {
    await expect(page.getByText('电子产品')).toBeVisible();
    await expect(page.getByText('服装鞋帽')).toBeVisible();
    await expect(page.getByText('食品饮料')).toBeVisible();
  });
});
