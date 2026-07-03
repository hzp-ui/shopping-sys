package com.yunmu.shopping.home.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.yunmu.shopping.common.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("banner")
public class Banner extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String title;

    private String image;

    private String linkType;

    private String linkUrl;

    private Long goodsId;

    private Integer sort;

    private Integer status;

}
