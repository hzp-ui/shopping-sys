-- =============================================
-- 云亩商城系统 - 数据库初始化脚本
-- 数据库版本: MySQL 8.0+
-- 字符集: utf8mb4
-- =============================================

CREATE DATABASE IF NOT EXISTS shopping DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE shopping;

-- =============================================
-- 1. 用户相关表
-- =============================================

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) COMMENT '用户名',
    password VARCHAR(200) NOT NULL COMMENT '密码',
    nickname VARCHAR(50) COMMENT '昵称',
    avatar VARCHAR(500) COMMENT '头像',
    phone VARCHAR(20) UNIQUE COMMENT '手机号',
    email VARCHAR(100) COMMENT '邮箱',
    gender TINYINT DEFAULT 0 COMMENT '性别：0-未知，1-男，2-女',
    birthday DATE COMMENT '生日',
    user_level INT DEFAULT 1 COMMENT '会员等级',
    points INT DEFAULT 0 COMMENT '积分',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-正常',
    openid VARCHAR(100) UNIQUE COMMENT '微信openid',
    unionid VARCHAR(100) COMMENT '微信unionid',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_phone (phone),
    INDEX idx_openid (openid),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

DROP TABLE IF EXISTS user_address;
CREATE TABLE user_address (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    name VARCHAR(50) NOT NULL COMMENT '收货人姓名',
    phone VARCHAR(20) NOT NULL COMMENT '收货人电话',
    province VARCHAR(50) NOT NULL COMMENT '省份',
    city VARCHAR(50) NOT NULL COMMENT '城市',
    district VARCHAR(50) NOT NULL COMMENT '区县',
    detail VARCHAR(500) NOT NULL COMMENT '详细地址',
    is_default TINYINT DEFAULT 0 COMMENT '是否默认：0-否，1-是',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户收货地址表';

-- =============================================
-- 2. 商品相关表
-- =============================================

DROP TABLE IF EXISTS goods_category;
CREATE TABLE goods_category (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL COMMENT '分类名称',
    parent_id BIGINT DEFAULT 0 COMMENT '父分类ID',
    icon VARCHAR(500) COMMENT '分类图标',
    banner VARCHAR(500) COMMENT '分类横幅',
    sort INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_parent_id (parent_id),
    INDEX idx_sort (sort)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品分类表';

DROP TABLE IF EXISTS goods;
CREATE TABLE goods (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL COMMENT '商品名称',
    category_id BIGINT NOT NULL COMMENT '分类ID',
    subtitle VARCHAR(500) COMMENT '副标题',
    main_image VARCHAR(500) NOT NULL COMMENT '主图',
    images TEXT COMMENT '商品图片列表，JSON数组',
    price DECIMAL(10,2) NOT NULL COMMENT '销售价',
    original_price DECIMAL(10,2) COMMENT '原价',
    cost_price DECIMAL(10,2) COMMENT '成本价',
    stock INT DEFAULT 0 COMMENT '库存',
    sales INT DEFAULT 0 COMMENT '销量',
    description TEXT COMMENT '商品详情',
    specs TEXT COMMENT '规格参数，JSON',
    is_distribution TINYINT DEFAULT 0 COMMENT '是否分销商品：0-否，1-是',
    distribution_rate DECIMAL(5,2) DEFAULT 0 COMMENT '分销佣金比例%',
    distribution_amount DECIMAL(10,2) DEFAULT 0 COMMENT '分销固定佣金',
    is_seckill TINYINT DEFAULT 0 COMMENT '是否秒杀：0-否，1-是',
    seckill_price DECIMAL(10,2) COMMENT '秒杀价',
    seckill_start DATETIME COMMENT '秒杀开始时间',
    seckill_end DATETIME COMMENT '秒杀结束时间',
    is_group TINYINT DEFAULT 0 COMMENT '是否拼团：0-否，1-是',
    group_price DECIMAL(10,2) COMMENT '拼团价',
    group_num INT DEFAULT 0 COMMENT '拼团人数',
    status TINYINT DEFAULT 1 COMMENT '状态：0-下架，1-上架',
    sort INT DEFAULT 0 COMMENT '排序',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category_id (category_id),
    INDEX idx_status (status),
    INDEX idx_sales (sales),
    INDEX idx_price (price),
    FULLTEXT idx_name (name) WITH PARSER ngram
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

DROP TABLE IF EXISTS goods_sku;
CREATE TABLE goods_sku (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    goods_id BIGINT NOT NULL COMMENT '商品ID',
    sku_name VARCHAR(200) NOT NULL COMMENT 'SKU名称',
    sku_values VARCHAR(500) NOT NULL COMMENT '规格值，JSON',
    price DECIMAL(10,2) NOT NULL COMMENT '价格',
    stock INT DEFAULT 0 COMMENT '库存',
    sku_image VARCHAR(500) COMMENT 'SKU图片',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_goods_id (goods_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品SKU表';

DROP TABLE IF EXISTS goods_review;
CREATE TABLE goods_review (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    goods_id BIGINT NOT NULL COMMENT '商品ID',
    order_id BIGINT NOT NULL COMMENT '订单ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    rating TINYINT NOT NULL COMMENT '评分：1-5',
    content VARCHAR(1000) COMMENT '评价内容',
    images VARCHAR(1000) COMMENT '评价图片，JSON数组',
    status TINYINT DEFAULT 1 COMMENT '状态：0-隐藏，1-显示',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_goods_id (goods_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品评价表';

-- =============================================
-- 3. 购物车表
-- =============================================

DROP TABLE IF EXISTS cart;
CREATE TABLE cart (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    goods_id BIGINT NOT NULL COMMENT '商品ID',
    sku_id BIGINT COMMENT 'SKU ID',
    goods_name VARCHAR(200) NOT NULL COMMENT '商品名称',
    goods_image VARCHAR(500) NOT NULL COMMENT '商品图片',
    sku_values VARCHAR(500) COMMENT '规格值',
    price DECIMAL(10,2) NOT NULL COMMENT '单价',
    quantity INT NOT NULL DEFAULT 1 COMMENT '数量',
    selected TINYINT DEFAULT 1 COMMENT '是否选中：0-否，1-是',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_goods_sku (user_id, goods_id, sku_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物车表';

-- =============================================
-- 4. 订单相关表
-- =============================================

DROP TABLE IF EXISTS `order`;
CREATE TABLE `order` (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_no VARCHAR(32) UNIQUE NOT NULL COMMENT '订单号',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    total_amount DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
    pay_amount DECIMAL(10,2) NOT NULL COMMENT '实付金额',
    freight_amount DECIMAL(10,2) DEFAULT 0 COMMENT '运费',
    discount_amount DECIMAL(10,2) DEFAULT 0 COMMENT '优惠金额',
    pay_type TINYINT COMMENT '支付方式：1-微信，2-支付宝，3-余额',
    pay_time DATETIME COMMENT '支付时间',
    delivery_type TINYINT DEFAULT 1 COMMENT '配送方式：1-商家配送，2-到店自提，3-自动发货',
    delivery_time DATETIME COMMENT '发货时间',
    receive_time DATETIME COMMENT '收货时间',
    finish_time DATETIME COMMENT '完成时间',
    status TINYINT DEFAULT 0 COMMENT '订单状态：0-待付款，1-待发货，2-待收货，3-待评价，4-已完成，5-已取消，6-退款中，7-已退款',
    remark VARCHAR(500) COMMENT '订单备注',
    receiver_name VARCHAR(50) COMMENT '收货人姓名',
    receiver_phone VARCHAR(20) COMMENT '收货人电话',
    receiver_address VARCHAR(500) COMMENT '收货地址',
    store_id BIGINT COMMENT '自提门店ID',
    verify_code VARCHAR(32) COMMENT '核销码',
    tracking_company VARCHAR(50) COMMENT '物流公司',
    tracking_no VARCHAR(50) COMMENT '物流单号',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_order_no (order_no),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

DROP TABLE IF EXISTS order_item;
CREATE TABLE order_item (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL COMMENT '订单ID',
    order_no VARCHAR(32) NOT NULL COMMENT '订单号',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    goods_id BIGINT NOT NULL COMMENT '商品ID',
    sku_id BIGINT COMMENT 'SKU ID',
    goods_name VARCHAR(200) NOT NULL COMMENT '商品名称',
    goods_image VARCHAR(500) NOT NULL COMMENT '商品图片',
    sku_values VARCHAR(500) COMMENT '规格值',
    price DECIMAL(10,2) NOT NULL COMMENT '单价',
    quantity INT NOT NULL COMMENT '数量',
    total_amount DECIMAL(10,2) NOT NULL COMMENT '小计金额',
    is_reviewed TINYINT DEFAULT 0 COMMENT '是否已评价：0-否，1-是',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id),
    INDEX idx_user_id (user_id),
    INDEX idx_goods_id (goods_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单商品表';

-- =============================================
-- 5. 分销相关表
-- =============================================

DROP TABLE IF EXISTS distribution_user;
CREATE TABLE distribution_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    parent_id BIGINT COMMENT '上级分销员ID',
    level INT DEFAULT 1 COMMENT '分销等级',
    total_commission DECIMAL(10,2) DEFAULT 0 COMMENT '总佣金',
    available_commission DECIMAL(10,2) DEFAULT 0 COMMENT '可提现佣金',
    frozen_commission DECIMAL(10,2) DEFAULT 0 COMMENT '冻结佣金',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_id (user_id),
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分销员表';

DROP TABLE IF EXISTS distribution_order;
CREATE TABLE distribution_order (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL COMMENT '订单ID',
    order_no VARCHAR(32) NOT NULL COMMENT '订单号',
    user_id BIGINT NOT NULL COMMENT '下单用户ID',
    distributor_id BIGINT NOT NULL COMMENT '分销员ID',
    goods_id BIGINT NOT NULL COMMENT '商品ID',
    goods_name VARCHAR(200) NOT NULL COMMENT '商品名称',
    commission_amount DECIMAL(10,2) NOT NULL COMMENT '佣金金额',
    status TINYINT DEFAULT 0 COMMENT '状态：0-待结算，1-已结算，2-已取消',
    settle_time DATETIME COMMENT '结算时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id),
    INDEX idx_distributor_id (distributor_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分销订单表';

DROP TABLE IF EXISTS distribution_withdraw;
CREATE TABLE distribution_withdraw (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    distributor_id BIGINT NOT NULL COMMENT '分销员ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    amount DECIMAL(10,2) NOT NULL COMMENT '提现金额',
    withdraw_type TINYINT NOT NULL COMMENT '提现方式：1-支付宝，2-微信，3-银行卡',
    account_info VARCHAR(500) NOT NULL COMMENT '账号信息JSON',
    status TINYINT DEFAULT 0 COMMENT '状态：0-待审核，1-已打款，2-已拒绝',
    remark VARCHAR(500) COMMENT '备注',
    audit_time DATETIME COMMENT '审核时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_distributor_id (distributor_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分销提现表';

-- =============================================
-- 6. 门店相关表
-- =============================================

DROP TABLE IF EXISTS store;
CREATE TABLE store (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '门店名称',
    address VARCHAR(500) NOT NULL COMMENT '门店地址',
    longitude DECIMAL(10,7) COMMENT '经度',
    latitude DECIMAL(10,7) COMMENT '纬度',
    phone VARCHAR(20) COMMENT '联系电话',
    business_hours VARCHAR(200) COMMENT '营业时间',
    store_image VARCHAR(500) COMMENT '门店图片',
    description VARCHAR(1000) COMMENT '门店描述',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='门店表';

DROP TABLE IF EXISTS store_apply;
CREATE TABLE store_apply (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '申请人ID',
    store_name VARCHAR(100) NOT NULL COMMENT '门店名称',
    address VARCHAR(500) NOT NULL COMMENT '门店地址',
    phone VARCHAR(20) NOT NULL COMMENT '联系电话',
    license_url VARCHAR(500) COMMENT '营业执照',
    id_card_front VARCHAR(500) COMMENT '身份证正面',
    id_card_back VARCHAR(500) COMMENT '身份证反面',
    status TINYINT DEFAULT 0 COMMENT '状态：0-待审核，1-已通过，2-已拒绝',
    remark VARCHAR(500) COMMENT '审核备注',
    audit_time DATETIME COMMENT '审核时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='门店申请表';

-- =============================================
-- 7. 发票相关表
-- =============================================

DROP TABLE IF EXISTS invoice;
CREATE TABLE invoice (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL COMMENT '订单ID',
    order_no VARCHAR(32) NOT NULL COMMENT '订单号',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    invoice_type TINYINT NOT NULL COMMENT '发票类型：1-个人，2-企业',
    invoice_title VARCHAR(200) NOT NULL COMMENT '发票抬头',
    tax_number VARCHAR(100) COMMENT '税号',
    amount DECIMAL(10,2) NOT NULL COMMENT '发票金额',
    status TINYINT DEFAULT 0 COMMENT '状态：0-待开具，1-已开具，2-已拒绝',
    invoice_url VARCHAR(500) COMMENT '发票URL',
    remark VARCHAR(500) COMMENT '备注',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='发票表';

-- =============================================
-- 8. 售后相关表
-- =============================================

DROP TABLE IF EXISTS refund;
CREATE TABLE refund (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL COMMENT '订单ID',
    order_no VARCHAR(32) NOT NULL COMMENT '订单号',
    order_item_id BIGINT COMMENT '订单项ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    refund_amount DECIMAL(10,2) NOT NULL COMMENT '退款金额',
    refund_reason VARCHAR(500) NOT NULL COMMENT '退款原因',
    refund_desc VARCHAR(1000) COMMENT '退款说明',
    refund_images VARCHAR(1000) COMMENT '退款图片，JSON数组',
    refund_type TINYINT DEFAULT 1 COMMENT '退款类型：1-仅退款，2-退货退款',
    refund_status TINYINT DEFAULT 0 COMMENT '退款状态：0-待处理，1-已同意，2-已拒绝，3-已退款，4-买家退货，5-卖家收货',
    handle_remark VARCHAR(500) COMMENT '处理备注',
    handle_time DATETIME COMMENT '处理时间',
    tracking_company VARCHAR(50) COMMENT '退货物流公司',
    tracking_no VARCHAR(50) COMMENT '退货物流单号',
    receive_time DATETIME COMMENT '收货时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id),
    INDEX idx_user_id (user_id),
    INDEX idx_refund_status (refund_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='退款表';

-- =============================================
-- 9. 钱包相关表
-- =============================================

DROP TABLE IF EXISTS wallet;
CREATE TABLE wallet (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    balance DECIMAL(10,2) DEFAULT 0 COMMENT '余额',
    frozen_amount DECIMAL(10,2) DEFAULT 0 COMMENT '冻结金额',
    total_recharge DECIMAL(10,2) DEFAULT 0 COMMENT '累计充值',
    total_consume DECIMAL(10,2) DEFAULT 0 COMMENT '累计消费',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='钱包表';

DROP TABLE IF EXISTS wallet_record;
CREATE TABLE wallet_record (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    amount DECIMAL(10,2) NOT NULL COMMENT '金额',
    record_type TINYINT NOT NULL COMMENT '记录类型：1-充值，2-消费，3-提现，4-退款，5-佣金',
    direction TINYINT NOT NULL COMMENT '方向：1-收入，2-支出',
    description VARCHAR(500) COMMENT '描述',
    order_no VARCHAR(32) COMMENT '关联订单号',
    balance_after DECIMAL(10,2) NOT NULL COMMENT '变动后余额',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_record_type (record_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='钱包记录表';

DROP TABLE IF EXISTS wallet_withdraw;
CREATE TABLE wallet_withdraw (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    amount DECIMAL(10,2) NOT NULL COMMENT '提现金额',
    withdraw_type TINYINT NOT NULL COMMENT '提现方式：1-支付宝，2-微信，3-银行卡',
    account_info VARCHAR(500) NOT NULL COMMENT '账号信息JSON',
    status TINYINT DEFAULT 0 COMMENT '状态：0-待审核，1-已打款，2-已拒绝',
    remark VARCHAR(500) COMMENT '备注',
    audit_time DATETIME COMMENT '审核时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='钱包提现表';

-- =============================================
-- 10. 积分相关表
-- =============================================

DROP TABLE IF EXISTS points_record;
CREATE TABLE points_record (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    points INT NOT NULL COMMENT '积分',
    record_type TINYINT NOT NULL COMMENT '记录类型：1-消费获取，2-签到获取，3-活动获取，4-消费抵扣',
    direction TINYINT NOT NULL COMMENT '方向：1-获取，2-消费',
    description VARCHAR(500) COMMENT '描述',
    order_no VARCHAR(32) COMMENT '关联订单号',
    points_after INT NOT NULL COMMENT '变动后积分',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_record_type (record_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分记录表';

-- =============================================
-- 11. 营销相关表
-- =============================================

DROP TABLE IF EXISTS coupon;
CREATE TABLE coupon (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '优惠券名称',
    type TINYINT NOT NULL COMMENT '类型：1-满减券，2-折扣券',
    amount DECIMAL(10,2) NOT NULL COMMENT '面值/折扣',
    min_amount DECIMAL(10,2) DEFAULT 0 COMMENT '最低使用金额',
    total_count INT DEFAULT 0 COMMENT '发放数量',
    used_count INT DEFAULT 0 COMMENT '已使用数量',
    receive_count INT DEFAULT 0 COMMENT '已领取数量',
    per_limit INT DEFAULT 1 COMMENT '每人限领',
    valid_type TINYINT DEFAULT 1 COMMENT '有效期类型：1-固定日期，2-领取后N天',
    valid_start DATETIME COMMENT '有效期开始',
    valid_end DATETIME COMMENT '有效期结束',
    valid_days INT COMMENT '领取后有效天数',
    goods_type TINYINT DEFAULT 0 COMMENT '适用商品：0-全部，1-指定分类，2-指定商品',
    goods_ids TEXT COMMENT '指定商品ID，JSON数组',
    category_ids TEXT COMMENT '指定分类ID，JSON数组',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    sort INT DEFAULT 0 COMMENT '排序',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='优惠券表';

DROP TABLE IF EXISTS user_coupon;
CREATE TABLE user_coupon (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    coupon_id BIGINT NOT NULL COMMENT '优惠券ID',
    coupon_name VARCHAR(100) NOT NULL COMMENT '优惠券名称',
    type TINYINT NOT NULL COMMENT '类型：1-满减券，2-折扣券',
    amount DECIMAL(10,2) NOT NULL COMMENT '面值/折扣',
    min_amount DECIMAL(10,2) DEFAULT 0 COMMENT '最低使用金额',
    status TINYINT DEFAULT 0 COMMENT '状态：0-未使用，1-已使用，2-已过期',
    use_time DATETIME COMMENT '使用时间',
    use_order_no VARCHAR(32) COMMENT '使用订单号',
    valid_start DATETIME COMMENT '有效期开始',
    valid_end DATETIME COMMENT '有效期结束',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_coupon_id (coupon_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户优惠券表';

-- =============================================
-- 12. 首页相关表
-- =============================================

DROP TABLE IF EXISTS banner;
CREATE TABLE banner (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) COMMENT '标题',
    image VARCHAR(500) NOT NULL COMMENT '图片',
    link_type TINYINT DEFAULT 0 COMMENT '跳转类型：0-无，1-商品，2-分类，3-活动页，4-外部链接',
    link_value VARCHAR(500) COMMENT '跳转值',
    position TINYINT DEFAULT 1 COMMENT '位置：1-首页轮播',
    sort INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_position (position),
    INDEX idx_sort (sort),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='轮播图表';

DROP TABLE IF EXISTS home_nav;
CREATE TABLE home_nav (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL COMMENT '名称',
    icon VARCHAR(500) COMMENT '图标',
    link_type TINYINT DEFAULT 0 COMMENT '跳转类型',
    link_value VARCHAR(500) COMMENT '跳转值',
    sort INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_sort (sort),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='首页导航表';

-- =============================================
-- 13. 管理员表
-- =============================================

DROP TABLE IF EXISTS admin;
CREATE TABLE admin (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
    password VARCHAR(200) NOT NULL COMMENT '密码',
    nickname VARCHAR(50) COMMENT '昵称',
    avatar VARCHAR(500) COMMENT '头像',
    role TINYINT DEFAULT 1 COMMENT '角色：1-超级管理员，2-普通管理员',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-正常',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员表';

-- =============================================
-- 初始化数据
-- =============================================

-- 管理员账号: admin / admin123
INSERT INTO admin (username, password, nickname, role) VALUES 
('admin', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', '超级管理员', 1);

-- 商品分类
INSERT INTO goods_category (name, parent_id, sort) VALUES 
('推荐', 0, 1),
('手机数码', 0, 2),
('家用电器', 0, 3),
('服装鞋包', 0, 4),
('美妆个护', 0, 5),
('食品生鲜', 0, 6);

-- 首页轮播图
INSERT INTO banner (title, image, link_type, link_value, position, sort) VALUES 
('新品上市', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=shopping%20mall%20banner%20new%20product%20launch%20modern&image_size=landscape_16_9', 0, '', 1, 1),
('限时特惠', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=shopping%20mall%20banner%20limited%20time%20sale%20discount&image_size=landscape_16_9', 0, '', 1, 2),
('会员专享', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=shopping%20mall%20banner%20vip%20member%20exclusive%20benefits&image_size=landscape_16_9', 0, '', 1, 3);

-- 首页导航
INSERT INTO home_nav (name, icon, sort) VALUES 
('新品首发', '', 1),
('限时秒杀', '', 2),
('拼团优惠', '', 3),
('分销专区', '', 4),
('领券中心', '', 5),
('签到送礼', '', 6),
('附近门店', '', 7),
('会员中心', '', 8);

-- 示例商品
INSERT INTO goods (name, category_id, subtitle, main_image, price, original_price, stock, sales, description, status, sort) VALUES 
('云亩智能手机 Pro Max', 2, '旗舰级性能，超清影像系统', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=smartphone%20pro%20max%20product%20photo%20white%20background&image_size=square_hd', 5999.00, 6999.00, 1000, 500, '云亩智能手机 Pro Max，搭载最新旗舰处理器，超清三摄系统，超长续航。', 1, 1),
('云亩无线蓝牙耳机', 2, '主动降噪，超长续航', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wireless%20bluetooth%20earbuds%20product%20photo%20white%20background&image_size=square_hd', 299.00, 399.00, 5000, 2000, '云亩无线蓝牙耳机，主动降噪技术，单次续航8小时，总续航32小时。', 1, 2),
('云亩智能手表 Ultra', 2, '健康监测，运动追踪', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=smart%20watch%20ultra%20fitness%20tracker%20product%20photo&image_size=square_hd', 1999.00, 2499.00, 2000, 800, '云亩智能手表 Ultra，全天候健康监测，100+运动模式，防水50米。', 1, 3),
('云亩4K超清电视 65寸', 3, '超薄全面屏，AI智能', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=4k%20ultra%20hd%20tv%2065%20inch%20smart%20tv%20product%20photo&image_size=square_hd', 3999.00, 4999.00, 500, 200, '云亩4K超清电视，65英寸超薄全面屏，AI语音控制，海量影视资源。', 1, 4),
('云亩变频空调 1.5匹', 3, '一级能效，静音运行', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=inverter%20air%20conditioner%201.5%20ton%20white%20product%20photo&image_size=square_hd', 2999.00, 3499.00, 800, 300, '云亩变频空调，一级能效，快速制冷制热，静音运行，智能温控。', 1, 5);

-- 更新商品分销设置
UPDATE goods SET is_distribution = 1, distribution_rate = 10.00 WHERE id IN (1, 2, 3);

-- 优惠券
INSERT INTO coupon (name, type, amount, min_amount, total_count, per_limit, valid_type, valid_days, status, sort) VALUES 
('新人专享券', 1, 50.00, 200.00, 10000, 1, 2, 30, 1, 1),
('满100减10', 1, 10.00, 100.00, 50000, 3, 2, 7, 1, 2),
('满500减50', 1, 50.00, 500.00, 10000, 1, 2, 15, 1, 3);
