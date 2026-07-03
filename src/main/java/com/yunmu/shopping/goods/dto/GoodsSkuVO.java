package com.yunmu.shopping.goods.dto;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class GoodsSkuVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private Long goodsId;

    private String skuName;

    private String specValues;

    private BigDecimal price;

    private BigDecimal originalPrice;

    private Integer stock;

    private String image;

}
