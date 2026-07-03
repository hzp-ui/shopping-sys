package com.yunmu.shopping.distribution.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.distribution.entity.DistributionOrder;
import com.yunmu.shopping.distribution.entity.DistributionUser;
import com.yunmu.shopping.distribution.entity.DistributionWithdraw;
import com.yunmu.shopping.distribution.mapper.DistributionOrderMapper;
import com.yunmu.shopping.distribution.mapper.DistributionWithdrawMapper;
import com.yunmu.shopping.distribution.service.DistributionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/distribution")
@RequiredArgsConstructor
public class AdminDistributionController {

    private final DistributionService distributionService;
    private final DistributionOrderMapper distributionOrderMapper;
    private final DistributionWithdrawMapper distributionWithdrawMapper;

    @GetMapping("/distributor-list")
    public Result<PageResult<DistributionUser>> getDistributorList(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        LambdaQueryWrapper<DistributionUser> wrapper = new LambdaQueryWrapper<>();
        if (status != null) {
            wrapper.eq(DistributionUser::getStatus, status);
        }
        wrapper.orderByDesc(DistributionUser::getCreatedAt);
        Page<DistributionUser> page = new Page<>(pageNum, pageSize);
        distributionService.page(page, wrapper);
        PageResult<DistributionUser> result = new PageResult<>(page.getRecords(), page.getTotal(), pageNum, pageSize);
        return Result.success(result);
    }

    @GetMapping("/order-list")
    public Result<PageResult<DistributionOrder>> getDistributionOrderList(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        LambdaQueryWrapper<DistributionOrder> wrapper = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(DistributionOrder::getOrderNo, keyword);
        }
        if (status != null) {
            wrapper.eq(DistributionOrder::getStatus, status);
        }
        wrapper.orderByDesc(DistributionOrder::getCreatedAt);
        Page<DistributionOrder> page = new Page<>(pageNum, pageSize);
        distributionOrderMapper.selectPage(page, wrapper);
        PageResult<DistributionOrder> result = new PageResult<>(page.getRecords(), page.getTotal(), pageNum, pageSize);
        return Result.success(result);
    }

    @GetMapping("/commission-list")
    public Result<PageResult<DistributionOrder>> getCommissionList(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer type,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        LambdaQueryWrapper<DistributionOrder> wrapper = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(DistributionOrder::getOrderNo, keyword);
        }
        wrapper.orderByDesc(DistributionOrder::getCreatedAt);
        Page<DistributionOrder> page = new Page<>(pageNum, pageSize);
        distributionOrderMapper.selectPage(page, wrapper);
        PageResult<DistributionOrder> result = new PageResult<>(page.getRecords(), page.getTotal(), pageNum, pageSize);
        return Result.success(result);
    }

    @GetMapping("/withdraw-list")
    public Result<PageResult<DistributionWithdraw>> getWithdrawList(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        LambdaQueryWrapper<DistributionWithdraw> wrapper = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(DistributionWithdraw::getWithdrawNo, keyword);
        }
        if (status != null) {
            wrapper.eq(DistributionWithdraw::getStatus, status);
        }
        wrapper.orderByDesc(DistributionWithdraw::getCreatedAt);
        Page<DistributionWithdraw> page = new Page<>(pageNum, pageSize);
        distributionWithdrawMapper.selectPage(page, wrapper);
        PageResult<DistributionWithdraw> result = new PageResult<>(page.getRecords(), page.getTotal(), pageNum, pageSize);
        return Result.success(result);
    }

    @PutMapping("/withdraw/{id}/audit")
    public Result<Void> auditWithdraw(@PathVariable Long id, @RequestBody Map<String, Object> params) {
        Integer status = (Integer) params.get("status");
        String remark = (String) params.get("remark");
        DistributionWithdraw withdraw = new DistributionWithdraw();
        withdraw.setId(id);
        withdraw.setStatus(status);
        withdraw.setRemark(remark);
        withdraw.setAuditTime(LocalDateTime.now());
        distributionWithdrawMapper.updateById(withdraw);
        return Result.success();
    }

    @PutMapping("/distributor/{id}/status")
    public Result<Void> updateDistributorStatus(@PathVariable Long id, @RequestBody Map<String, Object> params) {
        Integer status = (Integer) params.get("status");
        DistributionUser distributor = new DistributionUser();
        distributor.setId(id);
        distributor.setStatus(status);
        distributionService.updateById(distributor);
        return Result.success();
    }

}
