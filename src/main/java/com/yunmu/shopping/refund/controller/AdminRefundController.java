package com.yunmu.shopping.refund.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.refund.entity.Refund;
import com.yunmu.shopping.refund.service.RefundService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/refund")
@RequiredArgsConstructor
public class AdminRefundController {

    private final RefundService refundService;

    @GetMapping("/list")
    public Result<PageResult<Refund>> getRefundList(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        LambdaQueryWrapper<Refund> wrapper = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(Refund::getRefundNo, keyword).or().like(Refund::getOrderNo, keyword);
        }
        if (status != null) {
            wrapper.eq(Refund::getRefundStatus, status);
        }
        wrapper.orderByDesc(Refund::getCreatedAt);
        Page<Refund> page = new Page<>(pageNum, pageSize);
        refundService.page(page, wrapper);
        PageResult<Refund> result = new PageResult<>(page.getRecords(), page.getTotal(), pageNum, pageSize);
        return Result.success(result);
    }

    @PutMapping("/{id}/audit")
    public Result<Void> auditRefund(@PathVariable Long id, @RequestBody Map<String, Object> params) {
        Integer status = (Integer) params.get("status");
        String auditRemark = (String) params.get("auditRemark");
        Refund refund = new Refund();
        refund.setId(id);
        refund.setRefundStatus(status);
        refund.setAuditRemark(auditRemark);
        refund.setAuditTime(LocalDateTime.now());
        refundService.updateById(refund);
        return Result.success();
    }

}
