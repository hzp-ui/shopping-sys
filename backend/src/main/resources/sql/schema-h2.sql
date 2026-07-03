-- =============================================
-- 云亩商城系统 - H2数据库初始化脚本
-- 用于测试环境
-- =============================================

-- =============================================
-- 1. 用户相关表
-- =============================================

DROP TABLE IF EXISTS user_address;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS order_item;
DROP TABLE IF EXISTS order_info;
DROP TABLE IF EXISTS goods_review;
DROP TABLE IF EXISTS goods_sku;
DROP TABLE IF EXISTS goods;
DROP TABLE IF EXISTS goods_category;
DROP TABLE IF EXISTS banner;
DROP TABLE IF EXISTS home_nav;
DROP TABLE IF EXISTS distribution_order;
DROP TABLE IF EXISTS distribution_withdraw;
DROP TABLE IF EXISTS distribution_user;
DROP TABLE IF EXISTS store_apply;
DROP TABLE IF EXISTS store;
DROP TABLE IF EXISTS invoice;
DROP TABLE IF EXISTS refund;
DROP TABLE IF EXISTS wallet_record;
DROP TABLE IF EXISTS wallet_withdraw;
DROP TABLE IF EXISTS wallet;
DROP TABLE IF EXISTS points_record;
DROP TABLE IF EXISTS user_coupon;
DROP TABLE IF EXISTS coupon;
DROP TABLE IF EXISTS admin;
DROP TABLE IF EXISTS sys_user;

CREATE TABLE sys_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    phone VARCHAR(20) UNIQUE,
    password VARCHAR(200) NOT NULL,
    nickname VARCHAR(50),
    avatar VARCHAR(500),
    gender INT DEFAULT 0,
    birthday TIMESTAMP,
    province VARCHAR(50),
    city VARCHAR(50),
    district VARCHAR(50),
    address VARCHAR(500),
    balance DECIMAL(10,2) DEFAULT 0,
    points INT DEFAULT 0,
    level INT DEFAULT 1,
    invite_code BIGINT,
    parent_id BIGINT,
    status INT DEFAULT 1,
    register_ip VARCHAR(50),
    last_login_time TIMESTAMP,
    last_login_ip VARCHAR(50),
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_address (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    province VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    district VARCHAR(50) NOT NULL,
    detail VARCHAR(500) NOT NULL,
    postal_code VARCHAR(20),
    is_default INT DEFAULT 0,
    sort INT DEFAULT 0,
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 2. 商品相关表
-- =============================================

CREATE TABLE goods_category (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    parent_id BIGINT DEFAULT 0,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(500),
    image VARCHAR(500),
    sort INT DEFAULT 0,
    status INT DEFAULT 1,
    level INT DEFAULT 1,
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE goods (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    subtitle VARCHAR(500),
    main_image VARCHAR(500) NOT NULL,
    images TEXT,
    detail TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    stock INT DEFAULT 0,
    sales INT DEFAULT 0,
    sort INT DEFAULT 0,
    status INT DEFAULT 1,
    is_new INT DEFAULT 0,
    is_hot INT DEFAULT 0,
    is_recommend INT DEFAULT 0,
    is_seckill INT DEFAULT 0,
    seckill_price DECIMAL(10,2),
    is_group INT DEFAULT 0,
    group_price DECIMAL(10,2),
    group_num INT DEFAULT 0,
    is_distribution INT DEFAULT 0,
    distribution_rate DECIMAL(5,2) DEFAULT 0,
    distribution_amount DECIMAL(10,2) DEFAULT 0,
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE goods_sku (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    goods_id BIGINT NOT NULL,
    sku_name VARCHAR(200) NOT NULL,
    spec_values VARCHAR(500) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    stock INT DEFAULT 0,
    image VARCHAR(500),
    sort INT DEFAULT 0,
    status INT DEFAULT 1,
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE goods_review (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    goods_id BIGINT NOT NULL,
    order_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    rating INT NOT NULL,
    content VARCHAR(1000),
    images VARCHAR(1000),
    status INT DEFAULT 1,
    is_anonymous INT DEFAULT 0,
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 3. 购物车表
-- =============================================

CREATE TABLE cart (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    goods_id BIGINT NOT NULL,
    sku_id BIGINT,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    goods_name VARCHAR(200) NOT NULL,
    goods_image VARCHAR(500) NOT NULL,
    sku_name VARCHAR(200),
    spec_values VARCHAR(500),
    selected INT DEFAULT 1,
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 4. 订单相关表
-- =============================================

CREATE TABLE order_info (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_no VARCHAR(32) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    order_type INT DEFAULT 0,
    order_status INT DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    goods_amount DECIMAL(10,2),
    freight_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    coupon_amount DECIMAL(10,2) DEFAULT 0,
    pay_amount DECIMAL(10,2) NOT NULL,
    pay_type INT,
    pay_time TIMESTAMP,
    receiver_name VARCHAR(50),
    receiver_phone VARCHAR(20),
    receiver_province VARCHAR(50),
    receiver_city VARCHAR(50),
    receiver_district VARCHAR(50),
    receiver_address VARCHAR(500),
    logistics_no VARCHAR(50),
    logistics_company VARCHAR(50),
    ship_time TIMESTAMP,
    receive_time TIMESTAMP,
    remark VARCHAR(500),
    coupon_id BIGINT,
    coupon_deduction DECIMAL(10,2),
    is_refund INT DEFAULT 0,
    is_comment INT DEFAULT 0,
    is_distribution INT DEFAULT 0,
    distribution_user_id BIGINT,
    distribution_amount DECIMAL(10,2),
    distribution_status INT DEFAULT 0,
    finish_time TIMESTAMP,
    cancel_time TIMESTAMP,
    cancel_reason VARCHAR(500),
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_item (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    order_no VARCHAR(32) NOT NULL,
    user_id BIGINT NOT NULL,
    goods_id BIGINT NOT NULL,
    sku_id BIGINT,
    goods_name VARCHAR(200) NOT NULL,
    goods_image VARCHAR(500) NOT NULL,
    sku_name VARCHAR(200),
    spec_values VARCHAR(500),
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    is_refund INT DEFAULT 0,
    refund_status INT DEFAULT 0,
    is_comment INT DEFAULT 0,
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 5. 分销相关表
-- =============================================

CREATE TABLE distribution_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    level INT DEFAULT 1,
    total_commission DECIMAL(10,2) DEFAULT 0,
    available_commission DECIMAL(10,2) DEFAULT 0,
    frozen_commission DECIMAL(10,2) DEFAULT 0,
    withdrawn_commission DECIMAL(10,2) DEFAULT 0,
    order_count INT DEFAULT 0,
    team_count INT DEFAULT 0,
    status INT DEFAULT 1,
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE distribution_order (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    order_id BIGINT NOT NULL,
    order_no VARCHAR(32) NOT NULL,
    distribution_user_id BIGINT NOT NULL,
    order_amount DECIMAL(10,2),
    commission_amount DECIMAL(10,2) NOT NULL,
    distribution_rate DECIMAL(5,2),
    level INT DEFAULT 1,
    status INT DEFAULT 0,
    settle_time TIMESTAMP,
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE distribution_withdraw (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    withdraw_no VARCHAR(32) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    fee DECIMAL(10,2) DEFAULT 0,
    actual_amount DECIMAL(10,2) NOT NULL,
    pay_type INT NOT NULL,
    pay_account VARCHAR(500) NOT NULL,
    pay_name VARCHAR(100),
    status INT DEFAULT 0,
    remark VARCHAR(500),
    audit_time TIMESTAMP,
    pay_time TIMESTAMP,
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 6. 门店相关表
-- =============================================

CREATE TABLE store (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    logo VARCHAR(500),
    banner VARCHAR(500),
    description VARCHAR(1000),
    province VARCHAR(50),
    city VARCHAR(50),
    district VARCHAR(50),
    address VARCHAR(500) NOT NULL,
    longitude VARCHAR(50),
    latitude VARCHAR(50),
    phone VARCHAR(20),
    business_hours VARCHAR(200),
    sort INT DEFAULT 0,
    status INT DEFAULT 1,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    free_delivery_amount DECIMAL(10,2) DEFAULT 0,
    delivery_distance INT DEFAULT 0,
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE store_apply (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    store_name VARCHAR(100) NOT NULL,
    contact_name VARCHAR(50),
    contact_phone VARCHAR(20) NOT NULL,
    province VARCHAR(50),
    city VARCHAR(50),
    district VARCHAR(50),
    address VARCHAR(500) NOT NULL,
    id_card_front VARCHAR(500),
    id_card_back VARCHAR(500),
    business_license VARCHAR(500),
    status INT DEFAULT 0,
    remark VARCHAR(500),
    audit_time TIMESTAMP,
    audit_admin_id BIGINT,
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 7. 发票相关表
-- =============================================

CREATE TABLE invoice (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    order_id BIGINT NOT NULL,
    order_no VARCHAR(32) NOT NULL,
    type INT NOT NULL,
    title_type INT,
    title VARCHAR(200) NOT NULL,
    tax_number VARCHAR(100),
    company_address VARCHAR(500),
    company_phone VARCHAR(20),
    bank_name VARCHAR(100),
    bank_account VARCHAR(100),
    email VARCHAR(100),
    amount DECIMAL(10,2) NOT NULL,
    status INT DEFAULT 0,
    remark VARCHAR(500),
    issue_time TIMESTAMP,
    invoice_no VARCHAR(50),
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 8. 售后相关表
-- =============================================

CREATE TABLE refund (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    refund_no VARCHAR(32) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    order_id BIGINT NOT NULL,
    order_no VARCHAR(32) NOT NULL,
    order_item_id BIGINT,
    type INT DEFAULT 1,
    reason VARCHAR(500) NOT NULL,
    description VARCHAR(1000),
    images VARCHAR(1000),
    refund_amount DECIMAL(10,2) NOT NULL,
    refund_status INT DEFAULT 0,
    remark VARCHAR(500),
    apply_time TIMESTAMP,
    audit_time TIMESTAMP,
    audit_admin_id BIGINT,
    audit_remark VARCHAR(500),
    refund_time TIMESTAMP,
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 9. 钱包相关表
-- =============================================

CREATE TABLE wallet (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    balance DECIMAL(10,2) DEFAULT 0,
    frozen_amount DECIMAL(10,2) DEFAULT 0,
    total_recharge DECIMAL(10,2) DEFAULT 0,
    total_consume DECIMAL(10,2) DEFAULT 0,
    total_withdraw DECIMAL(10,2) DEFAULT 0,
    status INT DEFAULT 1,
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wallet_record (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    record_no VARCHAR(32) UNIQUE NOT NULL,
    type INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    before_balance DECIMAL(10,2) NOT NULL,
    after_balance DECIMAL(10,2) NOT NULL,
    description VARCHAR(500),
    order_id BIGINT,
    order_no VARCHAR(32),
    status INT DEFAULT 1,
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wallet_withdraw (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    withdraw_no VARCHAR(32) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    fee DECIMAL(10,2) DEFAULT 0,
    actual_amount DECIMAL(10,2) NOT NULL,
    pay_type INT NOT NULL,
    pay_account VARCHAR(500) NOT NULL,
    pay_name VARCHAR(100),
    status INT DEFAULT 0,
    remark VARCHAR(500),
    audit_time TIMESTAMP,
    pay_time TIMESTAMP,
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 10. 积分相关表
-- =============================================

CREATE TABLE points_record (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    record_no VARCHAR(32) UNIQUE NOT NULL,
    type INT NOT NULL,
    points INT NOT NULL,
    before_points INT NOT NULL,
    after_points INT NOT NULL,
    description VARCHAR(500),
    order_id BIGINT,
    order_no VARCHAR(32),
    status INT DEFAULT 1,
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 11. 营销相关表
-- =============================================

CREATE TABLE coupon (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    min_amount DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(5,2),
    total_count INT DEFAULT 0,
    used_count INT DEFAULT 0,
    received_count INT DEFAULT 0,
    per_limit INT DEFAULT 1,
    receive_type INT DEFAULT 0,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    valid_days INT,
    use_type INT DEFAULT 0,
    category_id BIGINT,
    description VARCHAR(500),
    sort INT DEFAULT 0,
    status INT DEFAULT 1,
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_coupon (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    coupon_id BIGINT NOT NULL,
    coupon_name VARCHAR(100) NOT NULL,
    coupon_type INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    min_amount DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(5,2),
    receive_time TIMESTAMP,
    valid_start_time TIMESTAMP,
    valid_end_time TIMESTAMP,
    used_time TIMESTAMP,
    order_id BIGINT,
    status INT DEFAULT 0,
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 12. 首页相关表
-- =============================================

CREATE TABLE banner (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100),
    image VARCHAR(500) NOT NULL,
    link_type VARCHAR(20),
    link_url VARCHAR(500),
    goods_id BIGINT,
    sort INT DEFAULT 0,
    status INT DEFAULT 1,
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE home_nav (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(500),
    link_type VARCHAR(20),
    link_url VARCHAR(500),
    category_id BIGINT,
    sort INT DEFAULT 0,
    status INT DEFAULT 1,
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 13. 管理员表
-- =============================================

CREATE TABLE admin (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    nickname VARCHAR(50),
    avatar VARCHAR(500),
    role VARCHAR(50),
    status INT DEFAULT 1,
    last_login_time TIMESTAMP,
    last_login_ip VARCHAR(50),
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 初始化数据
-- =============================================

-- 管理员账号: admin / admin123 (BCrypt加密)
INSERT INTO admin (username, password, nickname, role) VALUES
('admin', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', '超级管理员', 'admin');

-- 商品分类
INSERT INTO goods_category (name, parent_id, sort, level) VALUES
('推荐', 0, 1, 1),
('手机数码', 0, 2, 1),
('家用电器', 0, 3, 1),
('服装鞋包', 0, 4, 1),
('美妆个护', 0, 5, 1),
('食品生鲜', 0, 6, 1);

-- 首页轮播图
INSERT INTO banner (title, image, link_type, link_url, sort) VALUES
('新品上市', 'https://picsum.photos/id/1068/800/300', 'goods', '', 1),
('限时特惠', 'https://picsum.photos/id/26/800/300', 'goods', '', 2),
('会员专享', 'https://picsum.photos/id/425/800/300', 'goods', '', 3);

-- 首页导航
INSERT INTO home_nav (name, icon, link_type, sort) VALUES
('新品首发', 'https://picsum.photos/seed/newproduct/100/100', 1, 1),
('限时秒杀', 'https://picsum.photos/seed/seckill/100/100', 1, 2),
('拼团优惠', 'https://picsum.photos/seed/groupbuy/100/100', 1, 3),
('分销专区', 'https://picsum.photos/seed/distribution/100/100', 1, 4),
('领券中心', 'https://picsum.photos/seed/coupon/100/100', 1, 5),
('签到送礼', 'https://picsum.photos/seed/signin/100/100', 1, 6),
('附近门店', 'https://picsum.photos/seed/store/100/100', 1, 7),
('会员中心', 'https://picsum.photos/seed/vip/100/100', 1, 8);

-- 示例商品
INSERT INTO goods (name, category_id, subtitle, main_image, images, price, original_price, stock, sales, status, sort, is_new, is_hot, is_recommend, is_seckill, seckill_price, is_group, group_price, group_num, is_distribution, distribution_rate, detail) VALUES
('云亩智能手机 Pro Max', 2, '旗舰级性能，超清影像系统', 'https://picsum.photos/id/1/400/400', '["https://picsum.photos/id/1/800/800","https://picsum.photos/id/2/800/800","https://picsum.photos/id/3/800/800"]', 5999.00, 6999.00, 1000, 500, 1, 1, 1, 1, 1, 0, 0.00, 0, 0.00, 0, 1, 10.00, '云亩智能手机 Pro Max，搭载最新旗舰处理器，超清三摄系统，超长续航。'),
('云亩无线蓝牙耳机', 2, '主动降噪，超长续航', 'https://picsum.photos/id/4/400/400', '["https://picsum.photos/id/4/800/800","https://picsum.photos/id/5/800/800","https://picsum.photos/id/6/800/800"]', 299.00, 399.00, 5000, 2000, 1, 2, 1, 1, 1, 1, 199.00, 0, 0.00, 0, 1, 10.00, '云亩无线蓝牙耳机，主动降噪技术，单次续航8小时，总续航32小时。'),
('云亩智能手表 Ultra', 2, '健康监测，运动追踪', 'https://picsum.photos/id/7/400/400', '["https://picsum.photos/id/7/800/800","https://picsum.photos/id/8/800/800","https://picsum.photos/id/9/800/800"]', 1999.00, 2499.00, 2000, 800, 1, 3, 1, 0, 1, 0, 0.00, 0, 0.00, 0, 1, 10.00, '云亩智能手表 Ultra，全天候健康监测，100+运动模式，防水50米。'),
('云亩4K超清电视 65寸', 3, '超薄全面屏，AI智能', 'https://picsum.photos/id/10/400/400', '["https://picsum.photos/id/10/800/800","https://picsum.photos/id/11/800/800","https://picsum.photos/id/12/800/800"]', 3999.00, 4999.00, 500, 200, 1, 4, 0, 1, 1, 0, 0.00, 0, 0.00, 0, 0, 0, '云亩4K超清电视，65英寸超薄全面屏，AI语音控制，海量影视资源。'),
('云亩变频空调 1.5匹', 3, '一级能效，静音运行', 'https://picsum.photos/id/13/400/400', '["https://picsum.photos/id/13/800/800","https://picsum.photos/id/14/800/800","https://picsum.photos/id/15/800/800"]', 2999.00, 3499.00, 800, 300, 1, 5, 0, 0, 0, 0, 0.00, 0, 0.00, 0, 0, 0, '云亩变频空调，一级能效，快速制冷制热，静音运行，智能温控。'),
('云亩时尚运动鞋', 4, '轻便透气，舒适缓震', 'https://picsum.photos/id/21/400/400', '["https://picsum.photos/id/21/800/800","https://picsum.photos/id/22/800/800","https://picsum.photos/id/23/800/800"]', 399.00, 599.00, 3000, 1500, 1, 6, 1, 1, 0, 1, 299.00, 1, 259.00, 2, 1, 5.00, '云亩时尚运动鞋，飞织鞋面轻便透气，气垫缓震科技，舒适一整天。'),
('云亩保湿精华液', 5, '深层补水，提亮肤色', 'https://picsum.photos/id/24/400/400', '["https://picsum.photos/id/24/800/800","https://picsum.photos/id/25/800/800","https://picsum.photos/id/26/800/800"]', 198.00, 298.00, 2000, 1200, 1, 7, 0, 1, 1, 0, 0.00, 0, 0.00, 0, 1, 8.00, '云亩保湿精华液，玻尿酸精华深层补水，烟酰胺提亮肤色，温和不刺激。'),
('云亩有机苹果 5斤', 6, '新鲜直采，脆甜多汁', 'https://picsum.photos/id/1080/400/400', '["https://picsum.photos/id/1080/800/800","https://picsum.photos/id/102/800/800","https://picsum.photos/id/292/800/800"]', 29.90, 49.90, 5000, 3000, 1, 8, 1, 1, 1, 1, 19.90, 1, 15.90, 5, 1, 15.00, '云亩有机苹果，果园直采，不打农药不打蜡，脆甜多汁，营养丰富。'),
('云亩新鲜草莓 2斤', 6, '当季新鲜，香甜可口', 'https://picsum.photos/id/102/400/400', '["https://picsum.photos/id/102/800/800","https://picsum.photos/id/103/800/800"]', 39.90, 59.90, 3000, 1800, 1, 9, 1, 0, 1, 1, 29.90, 0, 0.00, 0, 0, 0, '云亩新鲜草莓，当季直采，颗粒饱满，香甜可口。'),
('云亩进口车厘子 1斤', 6, '进口优选，果肉饱满', 'https://picsum.photos/id/109/400/400', '["https://picsum.photos/id/109/800/800","https://picsum.photos/id/110/800/800"]', 89.90, 129.00, 2000, 900, 1, 10, 1, 0, 1, 1, 59.90, 0, 0.00, 0, 0, 0, '云亩进口车厘子，智利进口，JJ级大果，果肉饱满，脆甜多汁。'),
('云亩精选芒果 5斤', 6, '热带水果，香甜多汁', 'https://picsum.photos/id/119/400/400', '["https://picsum.photos/id/119/800/800","https://picsum.photos/id/120/800/800"]', 49.90, 69.90, 4000, 2200, 1, 11, 0, 0, 1, 1, 35.90, 0, 0.00, 0, 0, 0, '云亩精选芒果，海南直采，金煌芒品种，果肉细腻，香甜多汁。'),
('云亩新鲜猕猴桃 10个', 6, '维C之王，营养丰富', 'https://picsum.photos/id/118/400/400', '["https://picsum.photos/id/118/800/800","https://picsum.photos/id/117/800/800"]', 35.90, 49.90, 3500, 1600, 1, 12, 0, 0, 1, 1, 24.90, 0, 0.00, 0, 0, 0, '云亩新鲜猕猴桃，陕西徐香品种，果肉翠绿，酸甜可口，维C满满。'),
('云亩有机牛奶 250ml*12', 7, '新鲜直达，营养健康', 'https://picsum.photos/id/115/400/400', '["https://picsum.photos/id/115/800/800","https://picsum.photos/id/116/800/800"]', 59.90, 79.90, 2500, 1300, 1, 13, 0, 0, 1, 1, 45.90, 0, 0.00, 0, 0, 0, '云亩有机牛奶，牧场直供，巴氏杀菌，保留天然营养。');

-- 优惠券
INSERT INTO coupon (name, type, amount, min_amount, total_count, per_limit, valid_days, status, sort) VALUES
('新人专享券', 1, 50.00, 200.00, 10000, 1, 30, 1, 1),
('满100减10', 1, 10.00, 100.00, 50000, 3, 7, 1, 2),
('满500减50', 1, 50.00, 500.00, 10000, 1, 15, 1, 3);

-- =============================================
-- 秒杀活动表
-- =============================================
DROP TABLE IF EXISTS seckill_activity;
CREATE TABLE seckill_activity (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    goods_count INT DEFAULT 0,
    seckill_price DECIMAL(10,2) DEFAULT 0,
    original_price DECIMAL(10,2) DEFAULT 0,
    sort INT DEFAULT 0,
    status TINYINT DEFAULT 1,
    deleted TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO seckill_activity (name, start_time, end_time, goods_count, seckill_price, original_price, sort, status) VALUES
('限时秒杀1', '2024-01-01 00:00:00', '2024-12-31 23:59:59', 100, 9.90, 99.00, 1, 1),
('限时秒杀2', '2024-01-01 00:00:00', '2024-12-31 23:59:59', 50, 19.90, 199.00, 2, 1),
('限时秒杀3', '2024-01-01 00:00:00', '2024-12-31 23:59:59', 200, 29.90, 299.00, 3, 1);
