package com.yunmu.shopping.admin.controller;

import com.yunmu.shopping.admin.dto.AdminLoginDTO;
import com.yunmu.shopping.admin.dto.AdminVO;
import com.yunmu.shopping.admin.service.AdminService;
import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.security.UserContext;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/login")
    public Result<Map<String, String>> login(@Valid @RequestBody AdminLoginDTO dto) {
        String token = adminService.login(dto);
        Map<String, String> data = new HashMap<>();
        data.put("token", token);
        return Result.success(data);
    }

    @GetMapping("/info")
    public Result<AdminVO> getAdminInfo() {
        Long adminId = UserContext.getAdminId();
        AdminVO adminVO = adminService.getAdminInfo(adminId);
        return Result.success(adminVO);
    }

    @PostMapping("/logout")
    public Result<Void> logout() {
        return Result.success();
    }

}
