package com.yunmu.shopping.goods.controller;

import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.goods.dto.CategoryTreeVO;
import com.yunmu.shopping.goods.entity.GoodsCategory;
import com.yunmu.shopping.goods.service.GoodsCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {

    private final GoodsCategoryService goodsCategoryService;

    @GetMapping("/list")
    public Result<List<GoodsCategory>> getCategoryList() {
        List<GoodsCategory> list = goodsCategoryService.getCategoryList();
        return Result.success(list);
    }

    @GetMapping("/tree")
    public Result<List<CategoryTreeVO>> getCategoryTree() {
        List<CategoryTreeVO> tree = goodsCategoryService.getCategoryTree();
        return Result.success(tree);
    }

}
