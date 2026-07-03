package com.yunmu.shopping.coupon.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yunmu.shopping.common.BusinessException;
import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.common.ResultCode;
import com.yunmu.shopping.coupon.entity.Coupon;
import com.yunmu.shopping.coupon.entity.UserCoupon;
import com.yunmu.shopping.coupon.mapper.CouponMapper;
import com.yunmu.shopping.coupon.mapper.UserCouponMapper;
import com.yunmu.shopping.coupon.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CouponServiceImpl extends ServiceImpl<CouponMapper, Coupon> implements CouponService {

    private final UserCouponMapper userCouponMapper;

    @Override
    public PageResult<Coupon> getCouponList(Integer pageNum, Integer pageSize) {
        LambdaQueryWrapper<Coupon> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Coupon::getStatus, 1)
                .gt(Coupon::getEndTime, LocalDateTime.now())
                .orderByAsc(Coupon::getSort);

        Page<Coupon> page = new Page<>(pageNum, pageSize);
        page(page, wrapper);

        return new PageResult<>(page.getRecords(), page.getTotal(), pageNum, pageSize);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void receiveCoupon(Long userId, Long couponId) {
        Coupon coupon = getById(couponId);
        if (coupon == null || coupon.getStatus() != 1) {
            throw new BusinessException(ResultCode.COUPON_NOT_EXIST);
        }

        if (coupon.getEndTime().isBefore(LocalDateTime.now())) {
            throw new BusinessException(ResultCode.COUPON_EXPIRED);
        }

        Long receivedCount = userCouponMapper.selectCount(new LambdaQueryWrapper<UserCoupon>()
                .eq(UserCoupon::getUserId, userId)
                .eq(UserCoupon::getCouponId, couponId));
        if (coupon.getPerLimit() != null && receivedCount >= coupon.getPerLimit()) {
            throw new BusinessException(ResultCode.COUPON_NOT_AVAILABLE, "已达到领取上限");
        }

        if (coupon.getTotalCount() != null && coupon.getReceivedCount() >= coupon.getTotalCount()) {
            throw new BusinessException(ResultCode.COUPON_NOT_AVAILABLE, "优惠券已领完");
        }

        UserCoupon userCoupon = new UserCoupon();
        userCoupon.setUserId(userId);
        userCoupon.setCouponId(couponId);
        userCoupon.setCouponName(coupon.getName());
        userCoupon.setCouponType(coupon.getType());
        userCoupon.setAmount(coupon.getAmount());
        userCoupon.setMinAmount(coupon.getMinAmount());
        userCoupon.setDiscount(coupon.getDiscount());
        userCoupon.setReceiveTime(LocalDateTime.now());
        userCoupon.setValidStartTime(coupon.getStartTime());
        userCoupon.setValidEndTime(coupon.getEndTime());
        userCoupon.setStatus(0);
        userCouponMapper.insert(userCoupon);

        coupon.setReceivedCount(coupon.getReceivedCount() + 1);
        updateById(coupon);
    }

    @Override
    public PageResult<UserCoupon> getUserCouponList(Long userId, Integer status, Integer pageNum, Integer pageSize) {
        LambdaQueryWrapper<UserCoupon> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserCoupon::getUserId, userId);

        if (status != null) {
            wrapper.eq(UserCoupon::getStatus, status);
        }

        wrapper.orderByDesc(UserCoupon::getReceiveTime);

        Page<UserCoupon> page = new Page<>(pageNum, pageSize);
        userCouponMapper.selectPage(page, wrapper);

        return new PageResult<>(page.getRecords(), page.getTotal(), pageNum, pageSize);
    }

}
