package com.yunmu.shopping.goods.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.yunmu.shopping.common.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("goods")
public class Goods extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private Long id;

    private Long categoryId;

    private String name;

    private String subtitle;

    private String mainImage;

    private String images;

    private String detail;

    private BigDecimal price;

    private BigDecimal originalPrice;

    private Integer stock;

    private Integer sales;

    private Integer sort;

    private Integer status;

    private Integer isNew;

    private Integer isHot;

    private Integer isRecommend;

    private Integer isSeckill;

    private BigDecimal seckillPrice;

    private Integer isGroup;

    private BigDecimal groupPrice;

    private Integer groupNum;

    private Integer isDistribution;

    private BigDecimal distributionRate;

    private BigDecimal distributionAmount;

}
