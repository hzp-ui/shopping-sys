package com.yunmu.shopping.coupon.controller;

import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.coupon.entity.UserCoupon;
import com.yunmu.shopping.coupon.service.CouponService;
import com.yunmu.shopping.security.UserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user/coupon")
@RequiredArgsConstructor
public class UserCouponController {

    private final CouponService couponService;

    @GetMapping
    public Result<PageResult<UserCoupon>> getUserCouponList(
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        Long userId = UserContext.getUserId();
        PageResult<UserCoupon> result = couponService.getUserCouponList(userId, status, pageNum, pageSize);
        return Result.success(result);
    }

}
