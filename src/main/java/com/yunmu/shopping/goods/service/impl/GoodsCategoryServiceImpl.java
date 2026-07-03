package com.yunmu.shopping.goods.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yunmu.shopping.goods.dto.CategoryTreeVO;
import com.yunmu.shopping.goods.entity.GoodsCategory;
import com.yunmu.shopping.goods.mapper.GoodsCategoryMapper;
import com.yunmu.shopping.goods.service.GoodsCategoryService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GoodsCategoryServiceImpl extends ServiceImpl<GoodsCategoryMapper, GoodsCategory> implements GoodsCategoryService {

    @Override
    public List<GoodsCategory> getCategoryList() {
        return list(new LambdaQueryWrapper<GoodsCategory>()
                .eq(GoodsCategory::getStatus, 1)
                .orderByAsc(GoodsCategory::getSort));
    }

    @Override
    public List<CategoryTreeVO> getCategoryTree() {
        List<GoodsCategory> allCategories = list(new LambdaQueryWrapper<GoodsCategory>()
                .eq(GoodsCategory::getStatus, 1)
                .orderByAsc(GoodsCategory::getSort));

        List<CategoryTreeVO> allVOs = allCategories.stream().map(category -> {
            CategoryTreeVO vo = new CategoryTreeVO();
            BeanUtils.copyProperties(category, vo);
            vo.setChildren(new ArrayList<>());
            return vo;
        }).collect(Collectors.toList());

        Map<Long, CategoryTreeVO> voMap = allVOs.stream()
                .collect(Collectors.toMap(CategoryTreeVO::getId, vo -> vo));

        List<CategoryTreeVO> rootList = new ArrayList<>();
        for (CategoryTreeVO vo : allVOs) {
            if (vo.getParentId() == null || vo.getParentId() == 0) {
                rootList.add(vo);
            } else {
                CategoryTreeVO parent = voMap.get(vo.getParentId());
                if (parent != null) {
                    parent.getChildren().add(vo);
                }
            }
        }

        return rootList;
    }

}
