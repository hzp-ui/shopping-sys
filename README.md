# 匹诺商城管理系统 - 后端服务

基于 Spring Boot 3.x + MyBatis Plus 构建的电商商城后端服务，支持商品、订单、用户、积分、营销、首页、售后、钱包、门店、发票、分销等全模块功能。

## 技术栈

- **框架**: Spring Boot 3.x
- **ORM**: MyBatis Plus
- **数据库**: MySQL 8.x / H2（内存数据库，开发测试用）
- **认证**: JWT
- **缓存**: Redis
- **构建工具**: Maven

## 功能模块

| 模块 | 说明 |
|------|------|
| 管理员模块 | 登录、登出、信息获取 |
| 商品模块 | 商品管理、商品分类、SKU、评价 |
| 订单模块 | 订单列表、订单详情、订单状态管理 |
| 用户模块 | 用户列表、用户状态管理 |
| 积分模块 | 积分记录、积分规则 |
| 营销模块 | 优惠券、秒杀活动 |
| 首页模块 | 轮播图、导航管理 |
| 售后模块 | 售后申请、售后处理 |
| 钱包模块 | 余额明细、提现管理 |
| 门店模块 | 门店列表、门店审核、入驻申请 |
| 发票模块 | 发票列表、发票申请 |
| 分销模块 | 分销员、分销订单、佣金记录、提现管理 |

## 项目结构

```
src/main/java/com/yunmu/shopping/
├── ShoppingApplication.java    # 启动类
├── admin/                       # 管理员模块
├── goods/                       # 商品模块
├── order/                       # 订单模块
├── user/                        # 用户模块
├── points/                      # 积分模块
├── coupon/                      # 优惠券模块
├── seckill/                     # 秒杀模块
├── home/                        # 首页模块
├── refund/                      # 售后模块
├── wallet/                      # 钱包模块
├── store/                       # 门店模块
├── invoice/                     # 发票模块
├── distribution/                # 分销模块
├── address/                     # 地址模块
├── cart/                        # 购物车模块
├── common/                      # 公共类
│   ├── Result.java              # 统一返回结果
│   ├── PageResult.java          # 分页结果
│   ├── BusinessException.java   # 业务异常
│   ├── ResultCode.java          # 结果码枚举
│   └── GlobalExceptionHandler.java # 全局异常处理
├── security/                    # 安全认证
│   ├── JwtTokenProvider.java    # JWT工具类
│   ├── JwtAuthenticationFilter.java # 认证过滤器
│   └── UserContext.java         # 用户上下文
├── config/                      # 配置类
└── ...
src/main/resources/
├── application.yml              # 主配置
├── application-h2.yml           # H2数据库配置
└── sql/
    ├── schema-h2.sql            # H2建表脚本+测试数据
    ├── seckill.sql              # 秒杀表补充脚本
    └── shopping_init.sql        # MySQL初始化脚本
```

## 快速开始

### 环境要求

- JDK 17+
- Maven 3.6+
- MySQL 8.x（可选，默认使用 H2）

### 使用 H2 内存数据库启动（推荐快速体验）

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

服务启动后访问：http://localhost:8080

默认管理员账号：`admin` / `admin123`

### 使用 MySQL 数据库启动

1. 创建数据库：

```sql
CREATE DATABASE shopping DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 修改 `src/main/resources/application.yml` 中的数据库连接配置：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/shopping?useUnicode=true&characterEncoding=UTF-8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: root
    password: your_password
```

3. 执行建表 SQL（参考 `src/main/resources/sql/schema-h2.sql`，根据 MySQL 语法调整）

4. 启动服务：

```bash
mvn spring-boot:run
```

### 打包部署

```bash
mvn clean package -DskipTests
java -jar target/shopping-1.0.0.jar
```

### Docker 部署

```bash
docker build -t shopping-backend .
docker run -p 8080:8080 shopping-backend
```

## API 接口

### 统一返回格式

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {},
  "timestamp": 1234567890
}
```

### 分页返回格式

```json
{
  "list": [],
  "total": 100,
  "pageNum": 1,
  "pageSize": 10
}
```

### 管理端接口（/api/admin 前缀）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/admin/login | 登录 |
| GET | /api/admin/info | 获取管理员信息 |
| POST | /api/admin/logout | 退出登录 |
| GET | /api/admin/goods/list | 商品列表 |
| POST | /api/admin/goods | 新增商品 |
| PUT | /api/admin/goods | 修改商品 |
| DELETE | /api/admin/goods/{id} | 删除商品 |
| GET | /api/admin/category/list | 分类列表 |
| POST | /api/admin/category | 新增分类 |
| PUT | /api/admin/category | 修改分类 |
| DELETE | /api/admin/category/{id} | 删除分类 |
| GET | /api/admin/order/list | 订单列表 |
| GET | /api/admin/order/{id} | 订单详情 |
| GET | /api/admin/user/list | 用户列表 |
| PUT | /api/admin/user/{id}/status | 更新用户状态 |
| GET | /api/admin/points/record-list | 积分记录 |
| GET | /api/admin/points/rule-list | 积分规则 |
| GET | /api/admin/coupon/list | 优惠券列表 |
| GET | /api/admin/seckill/list | 秒杀活动列表 |
| GET | /api/admin/home/banner-list | 轮播图列表 |
| GET | /api/admin/home/nav-list | 导航列表 |
| GET | /api/admin/refund/list | 售后列表 |
| GET | /api/admin/wallet/balance-list | 余额明细 |
| GET | /api/admin/wallet/withdraw-list | 提现列表 |
| GET | /api/admin/store/list | 门店列表 |
| GET | /api/admin/store/apply-list | 入驻申请列表 |
| GET | /api/admin/invoice/list | 发票列表 |
| GET | /api/admin/distribution/user-list | 分销员列表 |
| GET | /api/admin/distribution/order-list | 分销订单列表 |
| GET | /api/admin/distribution/commission-list | 佣金记录 |
| GET | /api/admin/distribution/withdraw-list | 提现列表 |

更多接口请查看各模块 Controller 源码。

## 开发说明

- 所有 Controller 统一返回 `Result<T>` 包装类
- 分页查询统一使用 `PageResult<T>` 包装类
- 业务异常抛出 `BusinessException`，由全局异常处理器统一处理
- 请求需要在 Header 中携带 `Authorization: Bearer {token}`

## License

MIT
