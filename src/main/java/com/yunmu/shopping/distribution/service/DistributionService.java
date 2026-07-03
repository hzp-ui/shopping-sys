package com.yunmu.shopping.distribution.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.distribution.entity.DistributionOrder;
import com.yunmu.shopping.distribution.entity.DistributionUser;

import java.math.BigDecimal;
import java.util.Map;

public interface DistributionService extends IService<DistributionUser> {

    Map<String, Object> getDistributionCenter(Long userId);

    PageResult<DistributionOrder> getDistributionOrders(Long userId, Integer pageNum, Integer pageSize);

    PageResult<Map<String, Object>> getCommissionRecords(Long userId, Integer pageNum, Integer pageSize);

}
