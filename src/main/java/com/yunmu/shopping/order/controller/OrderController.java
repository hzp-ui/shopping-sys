package com.yunmu.shopping.order.controller;

import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.order.dto.OrderConfirmDTO;
import com.yunmu.shopping.order.dto.OrderConfirmVO;
import com.yunmu.shopping.order.dto.OrderCreateDTO;
import com.yunmu.shopping.order.dto.OrderVO;
import com.yunmu.shopping.order.service.OrderService;
import com.yunmu.shopping.security.UserContext;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/confirm")
    public Result<OrderConfirmVO> confirmOrder(@Valid @RequestBody OrderConfirmDTO dto) {
        Long userId = UserContext.getUserId();
        OrderConfirmVO vo = orderService.confirmOrder(userId, dto);
        return Result.success(vo);
    }

    @PostMapping("/create")
    public Result<Map<String, String>> createOrder(@Valid @RequestBody OrderCreateDTO dto) {
        Long userId = UserContext.getUserId();
        String orderNo = orderService.createOrder(userId, dto);
        Map<String, String> data = new HashMap<>();
        data.put("orderNo", orderNo);
        return Result.success(data);
    }

    @GetMapping("/list")
    public Result<PageResult<OrderVO>> getOrderList(
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        Long userId = UserContext.getUserId();
        PageResult<OrderVO> result = orderService.getOrderList(userId, status, pageNum, pageSize);
        return Result.success(result);
    }

    @GetMapping("/detail/{id}")
    public Result<OrderVO> getOrderDetail(@PathVariable Long id) {
        Long userId = UserContext.getUserId();
        OrderVO vo = orderService.getOrderDetail(userId, id);
        return Result.success(vo);
    }

    @PostMapping("/cancel/{id}")
    public Result<Void> cancelOrder(@PathVariable Long id) {
        Long userId = UserContext.getUserId();
        orderService.cancelOrder(userId, id);
        return Result.success();
    }

}
