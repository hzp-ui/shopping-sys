package com.yunmu.shopping.order.dto;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderConfirmVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long addressId;

    private String receiverName;

    private String receiverPhone;

    private String receiverProvince;

    private String receiverCity;

    private String receiverDistrict;

    private String receiverAddress;

    private BigDecimal goodsAmount;

    private BigDecimal freightAmount;

    private BigDecimal couponAmount;

    private BigDecimal payAmount;

    private List<OrderItemVO> goodsList;

}
