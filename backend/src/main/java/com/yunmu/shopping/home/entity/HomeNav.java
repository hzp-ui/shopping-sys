package com.yunmu.shopping.home.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.yunmu.shopping.common.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("home_nav")
public class HomeNav extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String name;

    private String icon;

    private String linkType;

    private String linkUrl;

    private Long categoryId;

    private Integer sort;

    private Integer status;

}
