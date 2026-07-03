package com.yunmu.shopping.seckill.controller;

import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.seckill.entity.SeckillActivity;
import com.yunmu.shopping.seckill.service.SeckillActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/seckill")
@RequiredArgsConstructor
public class AdminSeckillController {

    private final SeckillActivityService seckillActivityService;

    @GetMapping("/list")
    public Result<PageResult<SeckillActivity>> getSeckillList(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        PageResult<SeckillActivity> result = seckillActivityService.getActivityList(pageNum, pageSize, keyword, status);
        return Result.success(result);
    }

    @PostMapping
    public Result<Void> addSeckill(@RequestBody SeckillActivity activity) {
        seckillActivityService.save(activity);
        return Result.success();
    }

    @PutMapping
    public Result<Void> updateSeckill(@RequestBody SeckillActivity activity) {
        seckillActivityService.updateById(activity);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteSeckill(@PathVariable Long id) {
        seckillActivityService.removeById(id);
        return Result.success();
    }

}
