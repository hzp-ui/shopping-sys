package com.yunmu.shopping.store.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.store.entity.Store;
import com.yunmu.shopping.store.entity.StoreApply;
import com.yunmu.shopping.store.mapper.StoreApplyMapper;
import com.yunmu.shopping.store.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/store")
@RequiredArgsConstructor
public class AdminStoreController {

    private final StoreService storeService;
    private final StoreApplyMapper storeApplyMapper;

    @GetMapping("/list")
    public Result<PageResult<Store>> getStoreList(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        LambdaQueryWrapper<Store> wrapper = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(Store::getName, keyword);
        }
        if (status != null) {
            wrapper.eq(Store::getStatus, status);
        }
        wrapper.orderByDesc(Store::getCreatedAt);
        Page<Store> page = new Page<>(pageNum, pageSize);
        storeService.page(page, wrapper);
        PageResult<Store> result = new PageResult<>(page.getRecords(), page.getTotal(), pageNum, pageSize);
        return Result.success(result);
    }

    @GetMapping("/verify-list")
    public Result<PageResult<StoreApply>> getVerifyList(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        LambdaQueryWrapper<StoreApply> wrapper = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(StoreApply::getStoreName, keyword);
        }
        if (status != null) {
            wrapper.eq(StoreApply::getStatus, status);
        }
        wrapper.orderByDesc(StoreApply::getCreatedAt);
        Page<StoreApply> page = new Page<>(pageNum, pageSize);
        storeApplyMapper.selectPage(page, wrapper);
        PageResult<StoreApply> result = new PageResult<>(page.getRecords(), page.getTotal(), pageNum, pageSize);
        return Result.success(result);
    }

    @PutMapping("/verify/{id}")
    public Result<Void> verifyStore(@PathVariable Long id, @RequestBody Map<String, Object> params) {
        Integer status = (Integer) params.get("status");
        String remark = (String) params.get("remark");
        StoreApply apply = new StoreApply();
        apply.setId(id);
        apply.setStatus(status);
        apply.setRemark(remark);
        apply.setAuditTime(LocalDateTime.now());
        storeApplyMapper.updateById(apply);
        return Result.success();
    }

    @PutMapping("/{id}/status")
    public Result<Void> updateStoreStatus(@PathVariable Long id, @RequestBody Map<String, Object> params) {
        Integer status = (Integer) params.get("status");
        Store store = new Store();
        store.setId(id);
        store.setStatus(status);
        storeService.updateById(store);
        return Result.success();
    }

}
