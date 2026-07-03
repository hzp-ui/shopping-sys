package com.yunmu.shopping.cart.dto;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CartVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private Long userId;

    private Long goodsId;

    private Long skuId;

    private Integer quantity;

    private BigDecimal price;

    private String goodsName;

    private String goodsImage;

    private String skuName;

    private String specValues;

    private Integer selected;

    private LocalDateTime createdAt;

}
