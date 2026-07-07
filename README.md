# 云亩商城系统

一套完整的电商商城系统，包含管理后台、用户端小程序（H5）和后端服务，支持商品、订单、用户、积分、营销、首页、售后、钱包、门店、发票、分销等全模块功能。

## 技术栈

### 后端
- **框架**: Spring Boot 3.2.x
- **ORM**: MyBatis Plus
- **数据库**: MySQL 8.x / H2（内存数据库，用于开发测试）
- **认证**: JWT + Spring Security
- **缓存**: Redis
- **构建**: Maven

### 管理端前端
- **框架**: React 18 + TypeScript
- **UI 组件**: Ant Design 5.x
- **状态管理**: Zustand
- **请求库**: Axios
- **路由**: React Router v6
- **构建**: Vite

### 用户端前端（小程序/H5）
- **框架**: Vue 3 + TypeScript
- **UI 组件**: Vant 4
- **状态管理**: Pinia
- **请求库**: 封装 uni-app request
- **构建**: Vite + uni-app
- **支持平台**: 微信小程序、H5

## 功能模块

### 管理后台
| 模块 | 功能说明 |
|------|---------|
| 控制台 | 数据统计、销售趋势、分类占比 |
| 商品管理 | 商品列表、商品分类 |
| 订单管理 | 订单列表、订单详情 |
| 用户管理 | 用户列表、用户状态管理 |
| 积分管理 | 积分记录、积分规则 |
| 营销管理 | 优惠券、秒杀活动 |
| 首页管理 | 轮播图、导航管理 |
| 售后管理 | 售后列表 |
| 钱包管理 | 余额明细、提现管理 |
| 门店管理 | 门店列表、门店审核、入驻申请 |
| 发票管理 | 发票列表 |
| 分销管理 | 分销员、分销订单、佣金记录、提现管理 |

### 用户端（小程序/H5）
| 模块 | 功能说明 |
|------|---------|
| 首页 | 轮播图、导航分类、秒杀专区、推荐商品 |
| 商品 | 商品列表、商品详情、搜索 |
| 购物车 | 购物车列表、结算 |
| 订单 | 订单列表、订单详情、取消订单、确认收货 |
| 个人中心 | 用户信息、收货地址、积分、优惠券 |
| 收货地址 | 地址列表、新增地址、编辑地址、删除地址、设为默认 |
| 钱包 | 余额明细、提现 |
| 售后 | 售后申请、售后列表 |
| 发票 | 发票列表、发票申请 |
| 门店 | 门店列表、门店详情 |
| 分销中心 | 分销数据、分销订单、佣金记录 |

## 项目结构

```
shopping-sys/
├── backend/              # 后端服务
│   ├── src/main/java/com/yunmu/shopping/
│   │   ├── admin/        # 管理员模块
│   │   ├── goods/        # 商品模块
│   │   ├── order/        # 订单模块
│   │   ├── user/         # 用户模块（登录注册、用户信息、收货地址）
│   │   ├── points/       # 积分模块
│   │   ├── coupon/       # 优惠券模块
│   │   ├── seckill/      # 秒杀模块
│   │   ├── home/         # 首页模块（轮播图、导航）
│   │   ├── refund/       # 售后模块
│   │   ├── wallet/       # 钱包模块
│   │   ├── store/        # 门店模块
│   │   ├── invoice/      # 发票模块
│   │   ├── distribution/ # 分销模块
│   │   ├── address/      # 收货地址模块
│   │   ├── common/       # 公共类（Result、PageResult、异常处理等）
│   │   ├── security/     # 安全认证（JWT、Spring Security配置）
│   │   └── config/       # 配置类（Redis、数据源、跨域等）
│   └── src/main/resources/
│       ├── application.yml       # 主配置
│       ├── application-h2.yml    # H2 数据库配置
│       └── sql/                  # 数据库脚本
├── frontend-admin/       # 管理端前端
│   └── src/
│       ├── api/          # API 接口封装
│       ├── pages/        # 页面组件
│       ├── layouts/      # 布局组件
│       ├── stores/       # 状态管理
│       ├── utils/        # 工具函数
│       └── router/       # 路由配置
└── frontend-user/        # 用户端前端（小程序/H5）
    └── src/
        ├── api/          # API 接口封装
        ├── pages/        # 页面组件
        ├── components/   # 公共组件
        ├── stores/       # 状态管理（Pinia）
        ├── utils/        # 工具函数
        └── static/       # 静态资源
```

## 快速开始

### 环境要求
- JDK 17+
- Node.js 16+
- Maven 3.6+
- MySQL 8.x（可选，默认使用 H2 内存数据库）
- Redis（可选，有降级处理）

### 后端启动

#### 使用 H2 内存数据库（推荐快速体验）
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

#### 使用 MySQL 数据库
1. 创建数据库：`CREATE DATABASE shopping DEFAULT CHARACTER SET utf8mb4;`
2. 修改 `backend/src/main/resources/application.yml` 中的数据库连接配置
3. 执行 `backend/src/main/resources/sql/schema-mysql.sql` 建表（如果有）
4. 启动：
```bash
cd backend
mvn spring-boot:run
```

后端服务启动后访问：http://localhost:8080

H2控制台：http://localhost:8080/h2-console （仅h2 profile下可用）

默认管理员账号：`admin` / `admin123`

测试用户注册万能验证码：`123456`（开发环境）

### 管理端前端启动
```bash
cd frontend-admin
npm install
npm run dev
```

访问：http://localhost:3001

### 用户端前端启动（H5模式）
```bash
cd frontend-user
npm install
npm run dev
```

访问：http://localhost:5173

#### 微信小程序模式
```bash
cd frontend-user
npm install
npm run dev:mp-weixin
```

使用微信开发者工具打开 `frontend-user/dist/dev/mp-weixin` 目录

## API 接口

### 管理端接口（统一前缀：`/api/admin`）

#### 认证相关
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/admin/login | 管理员登录 |
| GET | /api/admin/info | 获取管理员信息 |
| POST | /api/admin/logout | 退出登录 |

#### 商品相关
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/admin/goods/list | 商品列表（分页） |
| POST | /api/admin/goods | 新增商品 |
| PUT | /api/admin/goods | 修改商品 |
| DELETE | /api/admin/goods/{id} | 删除商品 |
| GET | /api/admin/category/list | 分类列表 |
| POST | /api/admin/category | 新增分类 |
| PUT | /api/admin/category | 修改分类 |
| DELETE | /api/admin/category/{id} | 删除分类 |

### 用户端接口（统一前缀：`/api`）

#### 认证相关
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/user/register | 用户注册 |
| POST | /api/user/login | 用户登录 |
| POST | /api/user/sms-code | 发送验证码 |
| GET | /api/user/info | 获取用户信息 |
| PUT | /api/user/update | 更新用户信息 |
| POST | /api/user/logout | 退出登录 |

#### 收货地址
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/user/address/list | 获取地址列表 |
| POST | /api/user/address | 新增地址 |
| PUT | /api/user/address/{id} | 修改地址 |
| DELETE | /api/user/address/{id} | 删除地址 |
| POST | /api/user/address/default/{id} | 设置默认地址 |

#### 首页相关
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/home/banner | 获取轮播图列表 |
| GET | /api/home/nav | 获取导航列表 |
| GET | /api/seckill/list | 获取秒杀活动列表 |
| GET | /api/goods/recommend | 获取推荐商品列表 |

#### 商品相关
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/category/tree | 获取分类树 |
| GET | /api/goods/list | 商品列表（分页） |
| GET | /api/goods/{id} | 商品详情 |

### 其他模块
更多接口请参考各模块 Controller 代码。

## 部署

### Docker 部署
后端已提供 Dockerfile，可直接构建镜像：
```bash
cd backend
docker build -t shopping-sys-backend .
docker run -p 8080:8080 shopping-sys-backend
```

### 前端构建
```bash
# 管理端
cd frontend-admin
npm run build

# 用户端 H5
cd frontend-user
npm run build:h5

# 用户端 微信小程序
cd frontend-user
npm run build:mp-weixin
```
构建产物在各项目的 `dist` 目录，可部署到 Nginx 等静态服务器。

## 开发说明

- 后端统一返回格式：`{ code: 200, message: '操作成功', data: ..., timestamp: ... }`
- 分页返回格式：`{ list: [...], total: 100, pageNum: 1, pageSize: 10 }`
- 前端请求统一通过 `request.ts` / `utils/request.ts` 封装，自动处理 token 和错误提示
- 用户端使用 Pinia 进行状态管理，用户信息和 token 持久化到本地存储
- 后端数据初始化：`DataInitializer` 类在启动时自动初始化管理员账号和测试数据

## 更新日志

### v1.1.0 (2026-07-07)
- ✅ 用户端收货地址模块API联调（列表、新增、编辑、删除、设为默认）
- ✅ 用户端登录注册模块API联调（登录、注册、发送验证码、获取用户信息）
- ✅ 修复前端API路径与后端不匹配问题
- ✅ 地址页面添加表单弹窗和完整表单验证

### v1.0.0
- 🎉 项目初始版本
- 完整的管理后台功能
- 用户端基础页面框架
- 后端各模块基础API

## License

MIT
