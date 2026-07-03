package com.yunmu.shopping.wallet.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.yunmu.shopping.common.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("wallet")
public class Wallet extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private Long id;

    private Long userId;

    private BigDecimal balance;

    private BigDecimal frozenAmount;

    private BigDecimal totalRecharge;

    private BigDecimal totalConsume;

    private BigDecimal totalWithdraw;

    private Integer status;

}
