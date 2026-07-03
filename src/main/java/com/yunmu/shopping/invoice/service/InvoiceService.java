package com.yunmu.shopping.invoice.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.invoice.dto.InvoiceApplyDTO;
import com.yunmu.shopping.invoice.entity.Invoice;

public interface InvoiceService extends IService<Invoice> {

    void applyInvoice(Long userId, InvoiceApplyDTO dto);

    PageResult<Invoice> getInvoiceList(Long userId, Integer pageNum, Integer pageSize);

}
