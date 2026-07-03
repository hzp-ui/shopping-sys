package com.yunmu.shopping.config;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.yunmu.shopping.seckill.entity.SeckillActivity;
import com.yunmu.shopping.seckill.mapper.SeckillActivityMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final SeckillActivityMapper seckillActivityMapper;

    @Override
    public void run(String... args) {
        try {
            initSeckillData();
        } catch (Exception e) {
            log.warn("初始化秒杀数据失败: {}", e.getMessage());
        }
    }

    private void initSeckillData() {
        try {
            seckillActivityMapper.createTableIfNotExists();
            log.info("秒杀表检查完成");

            Long count = seckillActivityMapper.selectCount(new LambdaQueryWrapper<>());
            if (count != null && count > 0) {
                log.info("秒杀数据已存在，跳过初始化");
                return;
            }

            SeckillActivity activity1 = new SeckillActivity();
            activity1.setName("限时秒杀1");
            activity1.setStartTime(LocalDateTime.of(2024, 1, 1, 0, 0, 0));
            activity1.setEndTime(LocalDateTime.of(2024, 12, 31, 23, 59, 59));
            activity1.setGoodsCount(100);
            activity1.setSeckillPrice(new BigDecimal("9.90"));
            activity1.setOriginalPrice(new BigDecimal("99.00"));
            activity1.setSort(1);
            activity1.setStatus(1);
            seckillActivityMapper.insert(activity1);

            SeckillActivity activity2 = new SeckillActivity();
            activity2.setName("限时秒杀2");
            activity2.setStartTime(LocalDateTime.of(2024, 1, 1, 0, 0, 0));
            activity2.setEndTime(LocalDateTime.of(2024, 12, 31, 23, 59, 59));
            activity2.setGoodsCount(50);
            activity2.setSeckillPrice(new BigDecimal("19.90"));
            activity2.setOriginalPrice(new BigDecimal("199.00"));
            activity2.setSort(2);
            activity2.setStatus(1);
            seckillActivityMapper.insert(activity2);

            SeckillActivity activity3 = new SeckillActivity();
            activity3.setName("限时秒杀3");
            activity3.setStartTime(LocalDateTime.of(2024, 1, 1, 0, 0, 0));
            activity3.setEndTime(LocalDateTime.of(2024, 12, 31, 23, 59, 59));
            activity3.setGoodsCount(200);
            activity3.setSeckillPrice(new BigDecimal("29.90"));
            activity3.setOriginalPrice(new BigDecimal("299.00"));
            activity3.setSort(3);
            activity3.setStatus(1);
            seckillActivityMapper.insert(activity3);

            log.info("秒杀测试数据初始化成功");
        } catch (Exception e) {
            log.error("初始化秒杀数据失败", e);
        }
    }
}
