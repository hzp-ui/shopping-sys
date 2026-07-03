package com.yunmu.shopping.order.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.yunmu.shopping.common.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("order_info")
public class Order extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String orderNo;

    private Long userId;

    private Integer orderType;

    private Integer orderStatus;

    private BigDecimal totalAmount;

    private BigDecimal goodsAmount;

    private BigDecimal freightAmount;

    private BigDecimal discountAmount;

    private BigDecimal couponAmount;

    private BigDecimal payAmount;

    private Integer payType;

    private LocalDateTime payTime;

    private String receiverName;

    private String receiverPhone;

    private String receiverProvince;

    private String receiverCity;

    private String receiverDistrict;

    private String receiverAddress;

    private String logisticsNo;

    private String logisticsCompany;

    private LocalDateTime shipTime;

    private LocalDateTime receiveTime;

    private String remark;

    private Long couponId;

    private BigDecimal couponDeduction;

    private Integer isRefund;

    private Integer isComment;

    private Integer isDistribution;

    private Long distributionUserId;

    private BigDecimal distributionAmount;

    private Integer distributionStatus;

    private LocalDateTime finishTime;

    private LocalDateTime cancelTime;

    private String cancelReason;

}
