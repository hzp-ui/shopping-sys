package com.yunmu.shopping.invoice.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.invoice.dto.InvoiceApplyDTO;
import com.yunmu.shopping.invoice.entity.Invoice;
import com.yunmu.shopping.invoice.mapper.InvoiceMapper;
import com.yunmu.shopping.invoice.service.InvoiceService;
import com.yunmu.shopping.order.entity.Order;
import com.yunmu.shopping.order.mapper.OrderMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl extends ServiceImpl<InvoiceMapper, Invoice> implements InvoiceService {

    private final OrderMapper orderMapper;

    @Override
    public void applyInvoice(Long userId, InvoiceApplyDTO dto) {
        Order order = orderMapper.selectById(dto.getOrderId());
        if (order == null || !order.getUserId().equals(userId)) {
            throw new RuntimeException("订单不存在");
        }

        Invoice existInvoice = getOne(new LambdaQueryWrapper<Invoice>()
                .eq(Invoice::getOrderId, dto.getOrderId())
                .last("limit 1"));
        if (existInvoice != null) {
            throw new RuntimeException("该订单已申请发票");
        }

        Invoice invoice = new Invoice();
        BeanUtils.copyProperties(dto, invoice);
        invoice.setUserId(userId);
        invoice.setOrderNo(order.getOrderNo());
        invoice.setAmount(order.getPayAmount());
        invoice.setStatus(0);
        save(invoice);
    }

    @Override
    public PageResult<Invoice> getInvoiceList(Long userId, Integer pageNum, Integer pageSize) {
        LambdaQueryWrapper<Invoice> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Invoice::getUserId, userId)
                .orderByDesc(Invoice::getCreatedAt);

        Page<Invoice> page = new Page<>(pageNum, pageSize);
        page(page, wrapper);

        return new PageResult<>(page.getRecords(), page.getTotal(), pageNum, pageSize);
    }

}
