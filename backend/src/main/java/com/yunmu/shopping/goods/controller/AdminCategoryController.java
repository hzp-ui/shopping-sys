package com.yunmu.shopping.goods.controller;

import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.goods.dto.CategoryTreeVO;
import com.yunmu.shopping.goods.entity.GoodsCategory;
import com.yunmu.shopping.goods.service.GoodsCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/category")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final GoodsCategoryService goodsCategoryService;

    @GetMapping("/list")
    public Result<List<CategoryTreeVO>> getCategoryList() {
        List<CategoryTreeVO> tree = goodsCategoryService.getCategoryTree();
        return Result.success(tree);
    }

    @PostMapping
    public Result<Void> addCategory(@RequestBody GoodsCategory category) {
        goodsCategoryService.save(category);
        return Result.success();
    }

    @PutMapping
    public Result<Void> updateCategory(@RequestBody GoodsCategory category) {
        goodsCategoryService.updateById(category);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteCategory(@PathVariable Long id) {
        goodsCategoryService.removeById(id);
        return Result.success();
    }

}
