package com.yunmu.shopping.dashboard.controller;

import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.goods.mapper.GoodsMapper;
import com.yunmu.shopping.order.entity.Order;
import com.yunmu.shopping.order.mapper.OrderMapper;
import com.yunmu.shopping.user.mapper.UserMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final OrderMapper orderMapper;
    private final UserMapper userMapper;
    private final GoodsMapper goodsMapper;

    @GetMapping({"/statistics", "/stats"})
    public Result<Map<String, Object>> getStatistics() {
        Map<String, Object> result = new HashMap<>();

        Long orderCount = orderMapper.selectCount(new LambdaQueryWrapper<>());
        result.put("totalOrders", orderCount);

        BigDecimal totalSales = BigDecimal.ZERO;
        result.put("totalSales", totalSales);

        Long userCount = userMapper.selectCount(new LambdaQueryWrapper<>());
        result.put("totalUsers", userCount);

        Long goodsCount = goodsMapper.selectCount(new LambdaQueryWrapper<>());
        result.put("totalGoods", goodsCount);

        result.put("totalVisits", 12580);

        Long todayOrderCount = 0L;
        result.put("todayOrders", todayOrderCount);

        BigDecimal todaySales = BigDecimal.ZERO;
        result.put("todaySales", todaySales);

        Long todayNewUsers = 0L;
        result.put("todayNewUsers", todayNewUsers);

        result.put("todayVisits", 1128);

        Long pendingOrderCount = orderMapper.selectCount(new LambdaQueryWrapper<Order>()
                .eq(Order::getOrderStatus, 0));
        result.put("pendingOrderCount", pendingOrderCount);

        Long shippedOrderCount = orderMapper.selectCount(new LambdaQueryWrapper<Order>()
                .eq(Order::getOrderStatus, 2));
        result.put("shippedOrderCount", shippedOrderCount);

        return Result.success(result);
    }

}
