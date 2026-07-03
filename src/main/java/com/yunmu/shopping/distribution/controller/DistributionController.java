package com.yunmu.shopping.distribution.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.distribution.entity.DistributionOrder;
import com.yunmu.shopping.distribution.service.DistributionService;
import com.yunmu.shopping.goods.dto.GoodsVO;
import com.yunmu.shopping.goods.entity.Goods;
import com.yunmu.shopping.goods.mapper.GoodsMapper;
import com.yunmu.shopping.security.UserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/distribution")
@RequiredArgsConstructor
public class DistributionController {

    private final DistributionService distributionService;
    private final GoodsMapper goodsMapper;

    @GetMapping("/center")
    public Result<Map<String, Object>> getDistributionCenter() {
        Long userId = UserContext.getUserId();
        Map<String, Object> result = distributionService.getDistributionCenter(userId);
        return Result.success(result);
    }

    @GetMapping("/products")
    public Result<PageResult<GoodsVO>> getDistributionProducts(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        Page<Goods> page = new Page<>(pageNum, pageSize);
        goodsMapper.selectPage(page, new LambdaQueryWrapper<Goods>()
                .eq(Goods::getStatus, 1)
                .eq(Goods::getIsDistribution, 1)
                .orderByDesc(Goods::getDistributionAmount));

        List<GoodsVO> voList = page.getRecords().stream().map(goods -> {
            GoodsVO vo = new GoodsVO();
            BeanUtils.copyProperties(goods, vo);
            return vo;
        }).collect(Collectors.toList());

        return Result.success(new PageResult<>(voList, page.getTotal(), pageNum, pageSize));
    }

    @GetMapping("/orders")
    public Result<PageResult<DistributionOrder>> getDistributionOrders(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        Long userId = UserContext.getUserId();
        PageResult<DistributionOrder> result = distributionService.getDistributionOrders(userId, pageNum, pageSize);
        return Result.success(result);
    }

    @GetMapping("/commission")
    public Result<PageResult<Map<String, Object>>> getCommissionRecords(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        Long userId = UserContext.getUserId();
        PageResult<Map<String, Object>> result = distributionService.getCommissionRecords(userId, pageNum, pageSize);
        return Result.success(result);
    }

}
