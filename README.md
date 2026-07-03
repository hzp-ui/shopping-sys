# 匹诺商城管理系统 - 用户端 Web

基于 Vue 3 + Vant 构建的移动端电商商城前端，包含首页、商品、购物车、订单、个人中心、积分、优惠券、钱包、门店、发票、售后、分销等全模块功能。

## 技术栈

- **框架**: Vue 3 + TypeScript
- **UI 组件**: Vant 4.x
- **状态管理**: Pinia
- **路由**: Vue Router
- **请求库**: Axios
- **构建工具**: Vite
- **样式**: SCSS

## 功能模块

| 模块 | 功能说明 |
|------|---------|
| 首页 | 轮播图、导航入口、商品列表、新品/秒杀/拼团等特色专区 |
| 商品分类 | 分类导航、商品列表、商品筛选 |
| 商品详情 | 商品信息、SKU选择、加入购物车、立即购买、商品评价 |
| 购物车 | 商品列表、数量调整、删除、结算 |
| 订单管理 | 订单列表、订单详情、确认收货、评价、取消订单 |
| 个人中心 | 用户信息、订单入口、钱包/积分/优惠券入口 |
| 登录注册 | 手机号登录、验证码登录 |
| 地址管理 | 收货地址增删改查、默认地址设置 |
| 积分中心 | 积分明细、积分规则 |
| 优惠券 | 优惠券列表、领取、使用 |
| 钱包 | 余额明细、充值、提现、提现记录 |
| 门店 | 门店列表、门店详情 |
| 发票 | 发票列表、发票申请、发票详情 |
| 售后 | 售后申请、售后列表、售后详情 |
| 分销中心 | 分销员信息、分销订单、佣金记录、提现 |
| 收藏/足迹 | 商品收藏、浏览足迹 |
| 设置 | 个人设置、关于我们、客服中心 |

## 项目结构

```
src/
├── api/                  # API 接口封装
│   ├── index.ts          # 统一导出
│   ├── user.ts           # 用户/登录相关
│   ├── goods.ts          # 商品相关
│   ├── category.ts       # 分类相关
│   ├── cart.ts           # 购物车相关
│   ├── order.ts          # 订单相关
│   ├── home.ts           # 首页相关
│   ├── points.ts         # 积分相关
│   ├── coupon.ts         # 优惠券相关
│   ├── wallet.ts         # 钱包相关
│   ├── store.ts          # 门店相关
│   ├── invoice.ts        # 发票相关
│   ├── refund.ts         # 售后相关
│   ├── distribution.ts   # 分销相关
│   └── address.ts        # 地址相关
├── pages/                # 页面组件
│   ├── home/             # 首页
│   ├── category/         # 分类页
│   ├── cart/             # 购物车
│   ├── mine/             # 个人中心
│   ├── login/            # 登录页
│   ├── goods/            # 商品（列表、详情）
│   ├── order/            # 订单（列表、详情、确认、售后、退款、评价、物流）
│   ├── points/           # 积分（中心、规则）
│   ├── coupon/           # 优惠券
│   ├── wallet/           # 钱包（中心、充值、提现、提现记录）
│   ├── store/            # 门店（列表、详情）
│   ├── feature/          # 特色专区（新品、秒杀、拼团、签到、会员等）
│   ├── invoice/          # 发票（列表、申请、详情）
│   ├── refund/           # 售后
│   ├── distribution/     # 分销（中心、订单、佣金、提现）
│   ├── address/          # 地址管理
│   ├── favorite/         # 收藏
│   ├── footprint/        # 足迹
│   ├── search/           # 搜索
│   ├── profile/          # 个人资料
│   ├── setting/          # 设置
│   ├── about/            # 关于我们
│   └── service/          # 客服中心
├── components/           # 公共组件
│   ├── nav-bar/          # 导航栏组件
│   ├── GoodsCard/        # 商品卡片
│   └── EmptyData/        # 空数据组件
├── stores/               # Pinia 状态管理
│   ├── index.ts          # 入口
│   ├── user.ts           # 用户状态
│   └── cart.ts           # 购物车状态
├── utils/                # 工具函数
│   ├── request.ts        # Axios 封装
│   ├── storage.ts        # 本地存储封装
│   └── index.ts          # 通用工具
├── styles/               # 全局样式
│   └── common.scss       # 通用样式
├── static/               # 静态资源
│   └── tabbar/           # 底部导航图标
├── App.vue               # 根组件
├── main.ts               # 入口文件
├── pages.json            # 页面配置
└── manifest.json         # 应用配置
```

## 快速开始

### 环境要求

- Node.js 16+
- npm 或 pnpm

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问：http://localhost:5173 （默认端口以实际启动为准）

建议使用 Chrome 开发者工具的移动端模式浏览。

### 生产构建

```bash
npm run build
```

构建产物在 `dist` 目录。

### 代码检查

```bash
npm run lint
```

## 接口配置

接口基础地址在 `vite.config.ts` 中配置代理，默认代理到 `http://localhost:8080`。

如需修改后端地址，编辑 `vite.config.ts`：

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
```

## 请求封装

`src/utils/request.ts` 统一封装了 Axios：

- 请求拦截器：自动添加 `Authorization: Bearer {token}` 请求头
- 响应拦截器：统一处理返回格式，code !== 200 时自动提示错误
- 401 状态码：自动清除本地 token 并跳转到登录页

### 使用示例

```typescript
import request from '@/utils/request'

export const userApi = {
  login: (data) => {
    return request({
      url: '/user/login',
      method: 'post',
      data,
    })
  },
}
```

## 部署

### Nginx 配置示例

```nginx
server {
  listen 80;
  server_name m.example.com;

  root /var/www/web/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /api/ {
    proxy_pass http://localhost:8080/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

## License

MIT
