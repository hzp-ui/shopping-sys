package com.yunmu.shopping.goods.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.yunmu.shopping.common.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("goods_review")
public class GoodsReview extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private Long id;

    private Long goodsId;

    private Long orderId;

    private Long userId;

    private Integer rating;

    private String content;

    private String images;

    private Integer status;

    private Integer isAnonymous;

}
