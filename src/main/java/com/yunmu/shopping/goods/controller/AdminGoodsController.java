package com.yunmu.shopping.goods.controller;

import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.goods.dto.GoodsDTO;
import com.yunmu.shopping.goods.dto.GoodsQueryDTO;
import com.yunmu.shopping.goods.dto.GoodsVO;
import com.yunmu.shopping.goods.service.GoodsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/goods")
@RequiredArgsConstructor
public class AdminGoodsController {

    private final GoodsService goodsService;

    @GetMapping("/list")
    public Result<PageResult<GoodsVO>> getGoodsList(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        GoodsQueryDTO query = new GoodsQueryDTO();
        query.setCategoryId(categoryId);
        query.setKeyword(keyword);
        query.setStatus(status);
        query.setPageNum(pageNum);
        query.setPageSize(pageSize);
        PageResult<GoodsVO> result = goodsService.getAdminGoodsList(query);
        return Result.success(result);
    }

    @PostMapping
    public Result<Void> addGoods(@Valid @RequestBody GoodsDTO dto) {
        goodsService.addGoods(dto);
        return Result.success();
    }

    @PutMapping
    public Result<Void> updateGoods(@Valid @RequestBody GoodsDTO dto) {
        goodsService.updateGoods(dto);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteGoods(@PathVariable Long id) {
        goodsService.deleteGoods(id);
        return Result.success();
    }

}
