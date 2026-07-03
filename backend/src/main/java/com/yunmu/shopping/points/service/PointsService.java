package com.yunmu.shopping.points.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.points.entity.PointsRecord;

public interface PointsService extends IService<PointsRecord> {

    PageResult<PointsRecord> getPointsRecords(Long userId, Integer type, Integer pageNum, Integer pageSize);

}
