package com.yunmu.shopping.goods.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.yunmu.shopping.common.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("goods_sku")
public class GoodsSku extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private Long id;

    private Long goodsId;

    private String skuName;

    private String specValues;

    private BigDecimal price;

    private BigDecimal originalPrice;

    private Integer stock;

    private String image;

    private Integer sort;

    private Integer status;

}
