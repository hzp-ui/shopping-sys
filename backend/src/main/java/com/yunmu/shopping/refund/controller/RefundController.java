package com.yunmu.shopping.refund.controller;

import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.refund.dto.RefundApplyDTO;
import com.yunmu.shopping.refund.entity.Refund;
import com.yunmu.shopping.refund.service.RefundService;
import com.yunmu.shopping.security.UserContext;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/refund")
@RequiredArgsConstructor
public class RefundController {

    private final RefundService refundService;

    @PostMapping("/apply")
    public Result<Void> applyRefund(@Valid @RequestBody RefundApplyDTO dto) {
        Long userId = UserContext.getUserId();
        refundService.applyRefund(userId, dto);
        return Result.success();
    }

    @GetMapping("/list")
    public Result<PageResult<Refund>> getRefundList(
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        Long userId = UserContext.getUserId();
        PageResult<Refund> result = refundService.getRefundList(userId, status, pageNum, pageSize);
        return Result.success(result);
    }

    @GetMapping("/detail/{id}")
    public Result<Refund> getRefundDetail(@PathVariable Long id) {
        Long userId = UserContext.getUserId();
        Refund refund = refundService.getRefundDetail(userId, id);
        return Result.success(refund);
    }

}
