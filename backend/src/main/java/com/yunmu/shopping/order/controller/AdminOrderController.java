package com.yunmu.shopping.order.controller;

import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.order.dto.OrderVO;
import com.yunmu.shopping.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/order")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping("/list")
    public Result<PageResult<OrderVO>> getOrderList(
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        PageResult<OrderVO> result = orderService.getAdminOrderList(status, keyword, pageNum, pageSize);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<OrderVO> getOrderDetail(@PathVariable Long id) {
        OrderVO order = orderService.getAdminOrderDetail(id);
        return Result.success(order);
    }

    @PostMapping("/ship/{id}")
    public Result<Void> shipOrder(@PathVariable Long id, @RequestBody(required = false) Map<String, String> params) {
        String logisticsNo = params != null ? params.get("logisticsNo") : null;
        String logisticsCompany = params != null ? params.get("logisticsCompany") : null;
        orderService.shipOrder(id, logisticsNo, logisticsCompany);
        return Result.success();
    }

}
