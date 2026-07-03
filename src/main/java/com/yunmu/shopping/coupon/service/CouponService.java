package com.yunmu.shopping.coupon.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.coupon.entity.Coupon;
import com.yunmu.shopping.coupon.entity.UserCoupon;

import java.util.List;

public interface CouponService extends IService<Coupon> {

    PageResult<Coupon> getCouponList(Integer pageNum, Integer pageSize);

    void receiveCoupon(Long userId, Long couponId);

    PageResult<UserCoupon> getUserCouponList(Long userId, Integer status, Integer pageNum, Integer pageSize);

}
