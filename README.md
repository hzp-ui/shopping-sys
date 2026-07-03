# 匹诺商城管理系统 - 管理端前端

基于 React 18 + TypeScript + Ant Design 5 构建的电商商城管理后台，包含商品、订单、用户、积分、营销、首页、售后、钱包、门店、发票、分销等全模块功能。

## 技术栈

- **框架**: React 18 + TypeScript
- **UI 组件**: Ant Design 5.x
- **状态管理**: Zustand
- **路由**: React Router v6
- **请求库**: Axios
- **构建工具**: Vite
- **代码规范**: ESLint + Prettier

## 功能模块

| 模块 | 功能说明 |
|------|---------|
| 登录/登出 | 管理员登录、退出登录、Token 管理 |
| 控制台 | 数据统计、销售趋势图、分类占比图 |
| 商品管理 | 商品列表（增删改查）、商品分类管理 |
| 订单管理 | 订单列表、订单详情、订单状态 |
| 用户管理 | 用户列表、用户状态管理 |
| 积分管理 | 积分记录、积分规则 |
| 营销管理 | 优惠券管理、秒杀活动管理 |
| 首页管理 | 轮播图管理、导航管理 |
| 售后管理 | 售后申请列表 |
| 钱包管理 | 余额明细、提现管理 |
| 门店管理 | 门店列表、门店审核、入驻申请 |
| 发票管理 | 发票列表 |
| 分销管理 | 分销员、分销订单、佣金记录、提现管理 |

## 项目结构

```
src/
├── api/                  # API 接口封装
│   ├── user.ts           # 用户/登录相关
│   ├── goods.ts          # 商品相关
│   ├── category.ts       # 分类相关
│   ├── order.ts          # 订单相关
│   ├── userManage.ts     # 用户管理
│   ├── points.ts         # 积分相关
│   ├── marketing.ts      # 营销/优惠券/秒杀
│   ├── homeManage.ts     # 首页轮播图/导航
│   ├── refund.ts         # 售后相关
│   ├── wallet.ts         # 钱包相关
│   ├── store.ts          # 门店相关
│   ├── invoice.ts        # 发票相关
│   ├── distribution.ts   # 分销相关
│   └── dashboard.ts      # 仪表盘/控制台
├── pages/                # 页面组件
│   ├── login/            # 登录页
│   ├── dashboard/        # 控制台
│   ├── goods/            # 商品管理（列表、分类）
│   ├── order/            # 订单管理
│   ├── user/             # 用户管理
│   ├── points/           # 积分管理（记录、规则）
│   ├── marketing/        # 营销管理（优惠券、秒杀）
│   ├── home/             # 首页管理（轮播图、导航）
│   ├── refund/           # 售后管理
│   ├── wallet/           # 钱包管理（余额、提现）
│   ├── store/            # 门店管理（列表、审核、申请）
│   ├── invoice/          # 发票管理
│   └── distribution/     # 分销管理（分销员、订单、佣金、提现）
├── layouts/              # 布局组件
│   ├── MainLayout.tsx    # 主布局（侧边栏+顶栏+内容区）
│   └── BlankLayout.tsx   # 空白布局（登录页用）
├── router/               # 路由配置
│   └── index.tsx
├── stores/               # 状态管理
│   └── userStore.ts      # 用户状态
├── utils/                # 工具函数
│   └── request.ts        # Axios 封装（拦截器、Token 处理）
├── styles/               # 全局样式
├── App.tsx               # 根组件
├── main.tsx              # 入口文件
└── vite-env.d.ts         # Vite 类型声明
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

访问：http://localhost:3001

默认管理员账号：`admin` / `admin123`

### 生产构建

```bash
npm run build
```

构建产物在 `dist` 目录，可部署到 Nginx 等静态服务器。

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
      url: '/admin/login',
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
  server_name admin.example.com;

  root /var/www/admin/dist;
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

### Docker 部署

项目已提供 `Dockerfile` 和 `nginx.conf`，可直接构建镜像：

```bash
docker build -t shopping-admin-frontend .
docker run -p 80:80 shopping-admin-frontend
```

## License

MIT
