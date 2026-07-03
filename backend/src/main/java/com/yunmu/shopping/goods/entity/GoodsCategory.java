package com.yunmu.shopping.goods.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.yunmu.shopping.common.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("goods_category")
public class GoodsCategory extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private Long id;

    private Long parentId;

    private String name;

    private String icon;

    private String image;

    private Integer sort;

    private Integer status;

    private Integer level;

}
