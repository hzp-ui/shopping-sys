package com.yunmu.shopping.refund.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.refund.dto.RefundApplyDTO;
import com.yunmu.shopping.refund.entity.Refund;

public interface RefundService extends IService<Refund> {

    void applyRefund(Long userId, RefundApplyDTO dto);

    PageResult<Refund> getRefundList(Long userId, Integer status, Integer pageNum, Integer pageSize);

    Refund getRefundDetail(Long userId, Long id);

}
