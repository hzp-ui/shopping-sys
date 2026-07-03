package com.yunmu.shopping.refund.service.impl;

import cn.hutool.core.util.IdUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yunmu.shopping.common.BusinessException;
import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.common.ResultCode;
import com.yunmu.shopping.order.entity.Order;
import com.yunmu.shopping.order.mapper.OrderMapper;
import com.yunmu.shopping.refund.dto.RefundApplyDTO;
import com.yunmu.shopping.refund.entity.Refund;
import com.yunmu.shopping.refund.mapper.RefundMapper;
import com.yunmu.shopping.refund.service.RefundService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RefundServiceImpl extends ServiceImpl<RefundMapper, Refund> implements RefundService {

    private final OrderMapper orderMapper;

    @Override
    public void applyRefund(Long userId, RefundApplyDTO dto) {
        Order order = orderMapper.selectById(dto.getOrderId());
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.ORDER_NOT_EXIST);
        }

        Refund refund = new Refund();
        BeanUtils.copyProperties(dto, refund);
        refund.setRefundNo(IdUtil.getSnowflakeNextIdStr());
        refund.setUserId(userId);
        refund.setOrderNo(order.getOrderNo());
        refund.setRefundStatus(0);
        refund.setApplyTime(LocalDateTime.now());
        save(refund);
    }

    @Override
    public PageResult<Refund> getRefundList(Long userId, Integer status, Integer pageNum, Integer pageSize) {
        LambdaQueryWrapper<Refund> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Refund::getUserId, userId);

        if (status != null) {
            wrapper.eq(Refund::getRefundStatus, status);
        }

        wrapper.orderByDesc(Refund::getCreatedAt);

        Page<Refund> page = new Page<>(pageNum, pageSize);
        page(page, wrapper);

        return new PageResult<>(page.getRecords(), page.getTotal(), pageNum, pageSize);
    }

    @Override
    public Refund getRefundDetail(Long userId, Long id) {
        Refund refund = getById(id);
        if (refund == null || !refund.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        return refund;
    }

}
