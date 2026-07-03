package com.yunmu.shopping.home.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.home.entity.Banner;
import com.yunmu.shopping.home.entity.HomeNav;
import com.yunmu.shopping.home.mapper.BannerMapper;
import com.yunmu.shopping.home.mapper.HomeNavMapper;
import com.yunmu.shopping.home.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/home")
@RequiredArgsConstructor
public class AdminHomeController {

    private final HomeService homeService;
    private final BannerMapper bannerMapper;
    private final HomeNavMapper homeNavMapper;

    @GetMapping("/banner-list")
    public Result<PageResult<Banner>> getBannerList(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        LambdaQueryWrapper<Banner> wrapper = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(Banner::getTitle, keyword);
        }
        if (status != null) {
            wrapper.eq(Banner::getStatus, status);
        }
        wrapper.orderByAsc(Banner::getSort);
        Page<Banner> page = new Page<>(pageNum, pageSize);
        bannerMapper.selectPage(page, wrapper);
        PageResult<Banner> result = new PageResult<>(page.getRecords(), page.getTotal(), pageNum, pageSize);
        return Result.success(result);
    }

    @PostMapping("/banner")
    public Result<Void> addBanner(@RequestBody Banner banner) {
        bannerMapper.insert(banner);
        return Result.success();
    }

    @PutMapping("/banner")
    public Result<Void> updateBanner(@RequestBody Banner banner) {
        bannerMapper.updateById(banner);
        return Result.success();
    }

    @DeleteMapping("/banner/{id}")
    public Result<Void> deleteBanner(@PathVariable Long id) {
        bannerMapper.deleteById(id);
        return Result.success();
    }

    @GetMapping("/nav-list")
    public Result<PageResult<HomeNav>> getNavList(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        LambdaQueryWrapper<HomeNav> wrapper = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(HomeNav::getName, keyword);
        }
        if (status != null) {
            wrapper.eq(HomeNav::getStatus, status);
        }
        wrapper.orderByAsc(HomeNav::getSort);
        Page<HomeNav> page = new Page<>(pageNum, pageSize);
        homeNavMapper.selectPage(page, wrapper);
        PageResult<HomeNav> result = new PageResult<>(page.getRecords(), page.getTotal(), pageNum, pageSize);
        return Result.success(result);
    }

    @PostMapping("/nav")
    public Result<Void> addNav(@RequestBody HomeNav nav) {
        homeNavMapper.insert(nav);
        return Result.success();
    }

    @PutMapping("/nav")
    public Result<Void> updateNav(@RequestBody HomeNav nav) {
        homeNavMapper.updateById(nav);
        return Result.success();
    }

    @DeleteMapping("/nav/{id}")
    public Result<Void> deleteNav(@PathVariable Long id) {
        homeNavMapper.deleteById(id);
        return Result.success();
    }

}
