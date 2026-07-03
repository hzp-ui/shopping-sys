package com.yunmu.shopping.coupon.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.yunmu.shopping.common.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("coupon")
public class Coupon extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String name;

    private Integer type;

    private BigDecimal amount;

    private BigDecimal minAmount;

    private BigDecimal discount;

    private Integer totalCount;

    private Integer usedCount;

    private Integer receivedCount;

    private Integer perLimit;

    private Integer receiveType;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Integer validDays;

    private Integer useType;

    private Long categoryId;

    private String description;

    private Integer sort;

    private Integer status;

}
