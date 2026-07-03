package com.yunmu.shopping.invoice.controller;

import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.invoice.dto.InvoiceApplyDTO;
import com.yunmu.shopping.invoice.entity.Invoice;
import com.yunmu.shopping.invoice.service.InvoiceService;
import com.yunmu.shopping.security.UserContext;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoice")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping("/apply")
    public Result<Void> applyInvoice(@Valid @RequestBody InvoiceApplyDTO dto) {
        Long userId = UserContext.getUserId();
        invoiceService.applyInvoice(userId, dto);
        return Result.success();
    }

    @GetMapping("/list")
    public Result<PageResult<Invoice>> getInvoiceList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        Long userId = UserContext.getUserId();
        PageResult<Invoice> result = invoiceService.getInvoiceList(userId, pageNum, pageSize);
        return Result.success(result);
    }

}
