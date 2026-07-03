-- 秒杀活动表
DROP TABLE IF EXISTS seckill_activity;
CREATE TABLE seckill_activity (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '活动名称',
    start_time DATETIME NOT NULL COMMENT '开始时间',
    end_time DATETIME NOT NULL COMMENT '结束时间',
    goods_count INT DEFAULT 0 COMMENT '商品数量',
    seckill_price DECIMAL(10,2) DEFAULT 0 COMMENT '秒杀价',
    original_price DECIMAL(10,2) DEFAULT 0 COMMENT '原价',
    sort INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_start_time (start_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='秒杀活动表';

-- 插入测试数据
INSERT INTO seckill_activity (name, start_time, end_time, goods_count, seckill_price, original_price, sort, status) VALUES
('限时秒杀1', '2024-01-01 00:00:00', '2024-12-31 23:59:59', 100, 9.90, 99.00, 1, 1),
('限时秒杀2', '2024-01-01 00:00:00', '2024-12-31 23:59:59', 50, 19.90, 199.00, 2, 1),
('限时秒杀3', '2024-01-01 00:00:00', '2024-12-31 23:59:59', 200, 29.90, 299.00, 3, 1);
