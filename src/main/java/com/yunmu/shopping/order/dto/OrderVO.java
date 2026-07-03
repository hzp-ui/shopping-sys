package com.yunmu.shopping.order.dto;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderVO implements Serializable {

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

    private LocalDateTime createdAt;

    private List<OrderItemVO> itemList;

}
