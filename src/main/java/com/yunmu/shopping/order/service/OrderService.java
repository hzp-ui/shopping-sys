package com.yunmu.shopping.order.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.order.dto.OrderConfirmDTO;
import com.yunmu.shopping.order.dto.OrderConfirmVO;
import com.yunmu.shopping.order.dto.OrderCreateDTO;
import com.yunmu.shopping.order.dto.OrderVO;
import com.yunmu.shopping.order.entity.Order;

public interface OrderService extends IService<Order> {

    OrderConfirmVO confirmOrder(Long userId, OrderConfirmDTO dto);

    String createOrder(Long userId, OrderCreateDTO dto);

    PageResult<OrderVO> getOrderList(Long userId, Integer status, Integer pageNum, Integer pageSize);

    OrderVO getOrderDetail(Long userId, Long id);

    void cancelOrder(Long userId, Long id);

    PageResult<OrderVO> getAdminOrderList(Integer status, String keyword, Integer pageNum, Integer pageSize);

    OrderVO getAdminOrderDetail(Long id);

    void shipOrder(Long id, String logisticsNo, String logisticsCompany);

}
