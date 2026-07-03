package com.yunmu.shopping.points.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.points.entity.PointsRecord;
import com.yunmu.shopping.points.service.PointsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/points")
@RequiredArgsConstructor
public class AdminPointsController {

    private final PointsService pointsService;

    @GetMapping("/record-list")
    public Result<PageResult<PointsRecord>> getRecordList(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer type,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        LambdaQueryWrapper<PointsRecord> wrapper = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(PointsRecord::getRecordNo, keyword);
        }
        if (type != null) {
            wrapper.eq(PointsRecord::getType, type);
        }
        wrapper.orderByDesc(PointsRecord::getCreatedAt);
        Page<PointsRecord> page = new Page<>(pageNum, pageSize);
        pointsService.page(page, wrapper);
        PageResult<PointsRecord> result = new PageResult<>(page.getRecords(), page.getTotal(), pageNum, pageSize);
        return Result.success(result);
    }

    @GetMapping("/rule-list")
    public Result<List<Map<String, Object>>> getRuleList() {
        List<Map<String, Object>> rules = new ArrayList<>();
        Map<String, Object> rule1 = new HashMap<>();
        rule1.put("id", 1);
        rule1.put("name", "注册赠送积分");
        rule1.put("type", "register");
        rule1.put("points", 100);
        rule1.put("status", 1);
        rule1.put("description", "新用户注册赠送积分");
        rules.add(rule1);

        Map<String, Object> rule2 = new HashMap<>();
        rule2.put("id", 2);
        rule2.put("name", "消费赠送积分");
        rule2.put("type", "consume");
        rule2.put("points", 1);
        rule2.put("amount", 1);
        rule2.put("status", 1);
        rule2.put("description", "每消费1元赠送1积分");
        rules.add(rule2);

        Map<String, Object> rule3 = new HashMap<>();
        rule3.put("id", 3);
        rule3.put("name", "签到赠送积分");
        rule3.put("type", "signin");
        rule3.put("points", 10);
        rule3.put("status", 1);
        rule3.put("description", "每日签到赠送积分");
        rules.add(rule3);

        return Result.success(rules);
    }

    @PutMapping("/rule")
    public Result<Void> updateRule(@RequestBody Map<String, Object> rule) {
        return Result.success();
    }

}
