# 匹诺商城管理系统

一套完整的电商商城管理系统，包含管理后台、用户端 H5 和后端服务，支持商品、订单、用户、积分、营销、首页、售后、钱包、门店、发票、分销等全模块功能。

## 技术栈

### 后端
- **框架**: Spring Boot 3.x
- **ORM**: MyBatis Plus
- **数据库**: MySQL 8.x / H2（内存数据库，用于开发测试）
- **认证**: JWT
- **缓存**: Redis
- **构建**: Maven

### 管理端前端
- **框架**: React 18 + TypeScript
- **UI 组件**: Ant Design 5.x
- **状态管理**: Zustand
- **请求库**: Axios
- **路由**: React Router v6
- **构建**: Vite

### 用户端前端
- **框架**: Vue 3
- **UI 组件**: Vant
- **构建**: Vite

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

### 用户端
- 首页、商品列表、商品详情
- 购物车、订单管理
- 个人中心、地址管理
- 积分、优惠券、钱包
- 售后、发票、门店
- 分销中心

## 项目结构

```
shopping-sys/
├── backend/              # 后端服务
│   ├── src/main/java/com/yunmu/shopping/
│   │   ├── admin/        # 管理员模块
│   │   ├── goods/        # 商品模块
│   │   ├── order/        # 订单模块
│   │   ├── user/         # 用户模块
│   │   ├── points/       # 积分模块
│   │   ├── coupon/       # 优惠券模块
│   │   ├── seckill/      # 秒杀模块
│   │   ├── home/         # 首页模块
│   │   ├── refund/       # 售后模块
│   │   ├── wallet/       # 钱包模块
│   │   ├── store/        # 门店模块
│   │   ├── invoice/      # 发票模块
│   │   ├── distribution/ # 分销模块
│   │   ├── common/       # 公共类（Result、PageResult、异常处理等）
│   │   ├── security/     # 安全认证（JWT、拦截器）
│   │   └── config/       # 配置类
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
└── frontend-user/        # 用户端前端
    └── src/
        ├── api/          # API 接口封装
        ├── pages/        # 页面组件
        ├── components/   # 公共组件
        └── static/       # 静态资源
```

## 快速开始

### 环境要求
- JDK 17+
- Node.js 16+
- Maven 3.6+
- MySQL 8.x（可选，默认使用 H2 内存数据库）

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

默认管理员账号：`admin` / `admin123`

### 管理端前端启动
```bash
cd frontend-admin
npm install
npm run dev
```

访问：http://localhost:3001

### 用户端前端启动
```bash
cd frontend-user
npm install
npm run dev
```

## API 接口

所有管理端接口统一前缀：`/api/admin`

### 认证相关
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/admin/login | 管理员登录 |
| GET | /api/admin/info | 获取管理员信息 |
| POST | /api/admin/logout | 退出登录 |

### 商品相关
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

# 用户端
cd frontend-user
npm run build
```
构建产物在各项目的 `dist` 目录，可部署到 Nginx 等静态服务器。

## 开发说明

- 后端统一返回格式：`{ code: 200, message: '操作成功', data: ..., timestamp: ... }`
- 分页返回格式：`{ list: [...], total: 100, pageNum: 1, pageSize: 10 }`
- 前端请求统一通过 `request.ts` 封装，自动处理 token 和错误提示

## License

MIT
