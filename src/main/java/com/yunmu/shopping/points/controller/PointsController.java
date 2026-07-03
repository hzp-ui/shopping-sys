package com.yunmu.shopping.points.controller;

import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.points.entity.PointsRecord;
import com.yunmu.shopping.points.service.PointsService;
import com.yunmu.shopping.security.UserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/points")
@RequiredArgsConstructor
public class PointsController {

    private final PointsService pointsService;

    @GetMapping("/records")
    public Result<PageResult<PointsRecord>> getPointsRecords(
            @RequestParam(required = false) Integer type,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        Long userId = UserContext.getUserId();
        PageResult<PointsRecord> result = pointsService.getPointsRecords(userId, type, pageNum, pageSize);
        return Result.success(result);
    }

}
