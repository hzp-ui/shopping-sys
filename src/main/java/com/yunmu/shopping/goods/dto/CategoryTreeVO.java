package com.yunmu.shopping.goods.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class CategoryTreeVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private Long parentId;

    private String name;

    private String icon;

    private String image;

    private Integer sort;

    private Integer level;

    private List<CategoryTreeVO> children;

}
