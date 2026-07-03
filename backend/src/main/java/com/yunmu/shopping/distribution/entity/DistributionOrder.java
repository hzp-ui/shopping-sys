package com.yunmu.shopping.distribution.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.yunmu.shopping.common.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("distribution_order")
public class DistributionOrder extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private Long id;

    private Long userId;

    private Long orderId;

    private String orderNo;

    private Long distributionUserId;

    private BigDecimal orderAmount;

    private BigDecimal commissionAmount;

    private BigDecimal distributionRate;

    private Integer level;

    private Integer status;

    private java.time.LocalDateTime settleTime;

}
