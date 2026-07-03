package com.yunmu.shopping.goods.dto;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class GoodsVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private Long categoryId;

    private String categoryName;

    private String name;

    private String subtitle;

    private String mainImage;

    private String images;

    private String detail;

    private BigDecimal price;

    private BigDecimal originalPrice;

    private Integer stock;

    private Integer sales;

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

    private LocalDateTime createdAt;

}
