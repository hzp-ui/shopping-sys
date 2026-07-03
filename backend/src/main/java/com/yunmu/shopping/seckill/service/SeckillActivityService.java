package com.yunmu.shopping.seckill.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.seckill.entity.SeckillActivity;

public interface SeckillActivityService extends IService<SeckillActivity> {

    PageResult<SeckillActivity> getActivityList(Integer pageNum, Integer pageSize, String keyword, Integer status);

}
