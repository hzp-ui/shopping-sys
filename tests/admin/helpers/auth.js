// 登录帮助函数
async function login(page, username = 'admin', password = 'admin123') {
  await page.goto('/login');
  await page.fill('input[placeholder="用户名"]', username);
  await page.fill('input[placeholder="密码"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 10000 });
}

module.exports = { login };
