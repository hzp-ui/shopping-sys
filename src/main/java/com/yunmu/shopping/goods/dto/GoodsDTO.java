package com.yunmu.shopping.goods.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class GoodsDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    @NotNull(message = "分类ID不能为空")
    private Long categoryId;

    @NotBlank(message = "商品名称不能为空")
    private String name;

    private String subtitle;

    @NotBlank(message = "主图不能为空")
    private String mainImage;

    private String images;

    private String detail;

    @NotNull(message = "价格不能为空")
    private BigDecimal price;

    private BigDecimal originalPrice;

    @NotNull(message = "库存不能为空")
    private Integer stock;

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
