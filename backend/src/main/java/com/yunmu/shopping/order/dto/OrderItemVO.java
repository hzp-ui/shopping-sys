package com.yunmu.shopping.order.dto;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class OrderItemVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private Long orderId;

    private Long goodsId;

    private Long skuId;

    private String goodsName;

    private String goodsImage;

    private String skuName;

    private String specValues;

    private Integer quantity;

    private BigDecimal price;

    private BigDecimal totalPrice;

}
