package com.yunmu.shopping.coupon.controller;

import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.coupon.entity.Coupon;
import com.yunmu.shopping.coupon.entity.UserCoupon;
import com.yunmu.shopping.coupon.service.CouponService;
import com.yunmu.shopping.security.UserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coupon")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @GetMapping("/list")
    public Result<PageResult<Coupon>> getCouponList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        PageResult<Coupon> result = couponService.getCouponList(pageNum, pageSize);
        return Result.success(result);
    }

    @PostMapping("/receive/{id}")
    public Result<Void> receiveCoupon(@PathVariable Long id) {
        Long userId = UserContext.getUserId();
        couponService.receiveCoupon(userId, id);
        return Result.success();
    }

}
