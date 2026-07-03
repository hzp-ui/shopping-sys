package com.yunmu.shopping.invoice.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.yunmu.shopping.common.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("invoice")
public class Invoice extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private Long id;

    private Long userId;

    private Long orderId;

    private String orderNo;

    private Integer type;

    private Integer titleType;

    private String title;

    private String taxNumber;

    private String companyAddress;

    private String companyPhone;

    private String bankName;

    private String bankAccount;

    private String email;

    private BigDecimal amount;

    private Integer status;

    private String remark;

    private LocalDateTime issueTime;

    private String invoiceNo;

}
