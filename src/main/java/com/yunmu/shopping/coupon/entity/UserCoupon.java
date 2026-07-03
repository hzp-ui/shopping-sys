package com.yunmu.shopping.coupon.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.yunmu.shopping.common.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("user_coupon")
public class UserCoupon extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private Long id;

    private Long userId;

    private Long couponId;

    private String couponName;

    private Integer couponType;

    private BigDecimal amount;

    private BigDecimal minAmount;

    private BigDecimal discount;

    private LocalDateTime receiveTime;

    private LocalDateTime validStartTime;

    private LocalDateTime validEndTime;

    private LocalDateTime usedTime;

    private Long orderId;

    private Integer status;

}
