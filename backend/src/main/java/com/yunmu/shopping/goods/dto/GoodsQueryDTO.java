package com.yunmu.shopping.goods.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class GoodsQueryDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long categoryId;

    private String keyword;

    private Integer isNew;

    private Integer isHot;

    private Integer isRecommend;

    private Integer isSeckill;

    private Integer isGroup;

    private Integer isDistribution;

    private Integer status;

    private Integer pageNum = 1;

    private Integer pageSize = 10;

    private String sortField;

    private String sortOrder;

}
