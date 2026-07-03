package com.yunmu.shopping.coupon.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.coupon.entity.Coupon;
import com.yunmu.shopping.coupon.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/coupon")
@RequiredArgsConstructor
public class AdminCouponController {

    private final CouponService couponService;

    @GetMapping("/list")
    public Result<PageResult<Coupon>> getCouponList(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        LambdaQueryWrapper<Coupon> wrapper = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(Coupon::getName, keyword);
        }
        if (status != null) {
            wrapper.eq(Coupon::getStatus, status);
        }
        wrapper.orderByDesc(Coupon::getCreatedAt);
        Page<Coupon> page = new Page<>(pageNum, pageSize);
        couponService.page(page, wrapper);
        PageResult<Coupon> result = new PageResult<>(page.getRecords(), page.getTotal(), pageNum, pageSize);
        return Result.success(result);
    }

    @PostMapping
    public Result<Void> addCoupon(@RequestBody Coupon coupon) {
        couponService.save(coupon);
        return Result.success();
    }

    @PutMapping
    public Result<Void> updateCoupon(@RequestBody Coupon coupon) {
        couponService.updateById(coupon);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteCoupon(@PathVariable Long id) {
        couponService.removeById(id);
        return Result.success();
    }

}
