package com.yunmu.shopping.seckill.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yunmu.shopping.seckill.entity.SeckillActivity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface SeckillActivityMapper extends BaseMapper<SeckillActivity> {

    @Update("CREATE TABLE IF NOT EXISTS seckill_activity (" +
            "id BIGINT PRIMARY KEY AUTO_INCREMENT, " +
            "name VARCHAR(100) NOT NULL, " +
            "start_time DATETIME NOT NULL, " +
            "end_time DATETIME NOT NULL, " +
            "goods_count INT DEFAULT 0, " +
            "seckill_price DECIMAL(10,2) DEFAULT 0, " +
            "original_price DECIMAL(10,2) DEFAULT 0, " +
            "sort INT DEFAULT 0, " +
            "status TINYINT DEFAULT 1, " +
            "deleted TINYINT DEFAULT 0, " +
            "created_at DATETIME DEFAULT CURRENT_TIMESTAMP, " +
            "updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" +
            ")")
    void createTableIfNotExists();

}
