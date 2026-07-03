package com.yunmu.shopping.seckill.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.seckill.entity.SeckillActivity;
import com.yunmu.shopping.seckill.mapper.SeckillActivityMapper;
import com.yunmu.shopping.seckill.service.SeckillActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SeckillActivityServiceImpl extends ServiceImpl<SeckillActivityMapper, SeckillActivity> implements SeckillActivityService {

    @Override
    public PageResult<SeckillActivity> getActivityList(Integer pageNum, Integer pageSize, String keyword, Integer status) {
        LambdaQueryWrapper<SeckillActivity> wrapper = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(SeckillActivity::getName, keyword);
        }
        if (status != null) {
            wrapper.eq(SeckillActivity::getStatus, status);
        }
        wrapper.orderByDesc(SeckillActivity::getCreatedAt);

        Page<SeckillActivity> page = new Page<>(pageNum, pageSize);
        page(page, wrapper);

        return new PageResult<>(page.getRecords(), page.getTotal(), pageNum, pageSize);
    }

}
