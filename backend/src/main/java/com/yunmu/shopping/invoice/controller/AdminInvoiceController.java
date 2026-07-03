package com.yunmu.shopping.invoice.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.invoice.entity.Invoice;
import com.yunmu.shopping.invoice.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/invoice")
@RequiredArgsConstructor
public class AdminInvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping("/list")
    public Result<PageResult<Invoice>> getInvoiceList(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        LambdaQueryWrapper<Invoice> wrapper = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(Invoice::getOrderNo, keyword).or().like(Invoice::getTitle, keyword);
        }
        if (status != null) {
            wrapper.eq(Invoice::getStatus, status);
        }
        wrapper.orderByDesc(Invoice::getCreatedAt);
        Page<Invoice> page = new Page<>(pageNum, pageSize);
        invoiceService.page(page, wrapper);
        PageResult<Invoice> result = new PageResult<>(page.getRecords(), page.getTotal(), pageNum, pageSize);
        return Result.success(result);
    }

    @PutMapping("/{id}/status")
    public Result<Void> updateInvoiceStatus(@PathVariable Long id, @RequestParam Integer status) {
        Invoice invoice = new Invoice();
        invoice.setId(id);
        invoice.setStatus(status);
        invoiceService.updateById(invoice);
        return Result.success();
    }

}
