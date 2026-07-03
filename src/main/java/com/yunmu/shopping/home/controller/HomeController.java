package com.yunmu.shopping.home.controller;

import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.goods.dto.GoodsVO;
import com.yunmu.shopping.home.entity.Banner;
import com.yunmu.shopping.home.entity.HomeNav;
import com.yunmu.shopping.home.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/home")
@RequiredArgsConstructor
public class HomeController {

    private final HomeService homeService;

    @GetMapping("/banner")
    public Result<List<Banner>> getBannerList() {
        List<Banner> list = homeService.getBannerList();
        return Result.success(list);
    }

    @GetMapping("/nav")
    public Result<List<HomeNav>> getNavList() {
        List<HomeNav> list = homeService.getNavList();
        return Result.success(list);
    }

    @GetMapping("/recommend-products")
    public Result<List<GoodsVO>> getRecommendProducts() {
        List<GoodsVO> list = homeService.getRecommendProducts();
        return Result.success(list);
    }

    @GetMapping("/seckill-products")
    public Result<List<GoodsVO>> getSeckillProducts() {
        List<GoodsVO> list = homeService.getSeckillProducts();
        return Result.success(list);
    }

    @GetMapping("/group-products")
    public Result<List<GoodsVO>> getGroupProducts() {
        List<GoodsVO> list = homeService.getGroupProducts();
        return Result.success(list);
    }

    @GetMapping("/distribution-products")
    public Result<List<GoodsVO>> getDistributionProducts() {
        List<GoodsVO> list = homeService.getDistributionProducts();
        return Result.success(list);
    }

}
