package com.yunmu.shopping.goods.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.yunmu.shopping.goods.dto.CategoryTreeVO;
import com.yunmu.shopping.goods.entity.GoodsCategory;

import java.util.List;

public interface GoodsCategoryService extends IService<GoodsCategory> {

    List<GoodsCategory> getCategoryList();

    List<CategoryTreeVO> getCategoryTree();

}
