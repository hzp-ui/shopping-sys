package com.yunmu.shopping.refund.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.yunmu.shopping.common.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("refund")
public class Refund extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String refundNo;

    private Long userId;

    private Long orderId;

    private String orderNo;

    private Long orderItemId;

    private Integer type;

    private String reason;

    private String description;

    private String images;

    private BigDecimal refundAmount;

    private Integer refundStatus;

    private String remark;

    private LocalDateTime applyTime;

    private LocalDateTime auditTime;

    private Long auditAdminId;

    private String auditRemark;

    private LocalDateTime refundTime;

}
