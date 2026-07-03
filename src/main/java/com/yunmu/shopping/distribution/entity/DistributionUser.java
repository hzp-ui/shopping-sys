package com.yunmu.shopping.distribution.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.yunmu.shopping.common.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("distribution_user")
public class DistributionUser extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private Long id;

    private Long userId;

    private Integer level;

    private BigDecimal totalCommission;

    private BigDecimal availableCommission;

    private BigDecimal frozenCommission;

    private BigDecimal withdrawnCommission;

    private Integer orderCount;

    private Integer teamCount;

    private Integer status;

}
