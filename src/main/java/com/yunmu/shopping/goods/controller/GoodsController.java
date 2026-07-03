package com.yunmu.shopping.goods.controller;

import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.goods.dto.GoodsDetailVO;
import com.yunmu.shopping.goods.dto.GoodsQueryDTO;
import com.yunmu.shopping.goods.dto.GoodsVO;
import com.yunmu.shopping.goods.service.GoodsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/goods")
@RequiredArgsConstructor
public class GoodsController {

    private final GoodsService goodsService;

    @GetMapping("/list")
    public Result<PageResult<GoodsVO>> getGoodsList(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String sortField,
            @RequestParam(required = false) String sortOrder) {
        GoodsQueryDTO query = new GoodsQueryDTO();
        query.setCategoryId(categoryId);
        query.setKeyword(keyword);
        query.setPageNum(pageNum);
        query.setPageSize(pageSize);
        query.setSortField(sortField);
        query.setSortOrder(sortOrder);
        PageResult<GoodsVO> result = goodsService.getGoodsList(query);
        return Result.success(result);
    }

    @GetMapping("/detail/{id}")
    public Result<GoodsDetailVO> getGoodsDetail(@PathVariable Long id) {
        GoodsDetailVO detail = goodsService.getGoodsDetail(id);
        return Result.success(detail);
    }

    @GetMapping("/search")
    public Result<PageResult<GoodsVO>> searchGoods(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        PageResult<GoodsVO> result = goodsService.searchGoods(keyword, pageNum, pageSize);
        return Result.success(result);
    }

}
