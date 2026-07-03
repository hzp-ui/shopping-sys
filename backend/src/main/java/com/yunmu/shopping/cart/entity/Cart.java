package com.yunmu.shopping.cart.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.yunmu.shopping.common.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("cart")
public class Cart extends BaseEntity {

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

}
