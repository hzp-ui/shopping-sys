package com.yunmu.shopping.distribution.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.yunmu.shopping.common.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("distribution_withdraw")
public class DistributionWithdraw extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private Long id;

    private Long userId;

    private String withdrawNo;

    private BigDecimal amount;

    private BigDecimal fee;

    private BigDecimal actualAmount;

    private Integer payType;

    private String payAccount;

    private String payName;

    private Integer status;

    private String remark;

    private java.time.LocalDateTime auditTime;

    private java.time.LocalDateTime payTime;

}
