package com.yunmu.shopping.points.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.points.entity.PointsRecord;
import com.yunmu.shopping.points.mapper.PointsRecordMapper;
import com.yunmu.shopping.points.service.PointsService;
import org.springframework.stereotype.Service;

@Service
public class PointsServiceImpl extends ServiceImpl<PointsRecordMapper, PointsRecord> implements PointsService {

    @Override
    public PageResult<PointsRecord> getPointsRecords(Long userId, Integer type, Integer pageNum, Integer pageSize) {
        LambdaQueryWrapper<PointsRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(PointsRecord::getUserId, userId);

        if (type != null) {
            wrapper.eq(PointsRecord::getType, type);
        }

        wrapper.orderByDesc(PointsRecord::getCreatedAt);

        Page<PointsRecord> page = new Page<>(pageNum, pageSize);
        page(page, wrapper);

        return new PageResult<>(page.getRecords(), page.getTotal(), pageNum, pageSize);
    }

}
