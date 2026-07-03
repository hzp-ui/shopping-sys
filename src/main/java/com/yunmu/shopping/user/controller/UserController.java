package com.yunmu.shopping.user.controller;

import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.security.UserContext;
import com.yunmu.shopping.user.dto.LoginDTO;
import com.yunmu.shopping.user.dto.RegisterDTO;
import com.yunmu.shopping.user.dto.SmsCodeDTO;
import com.yunmu.shopping.user.dto.UpdateUserDTO;
import com.yunmu.shopping.user.dto.UserVO;
import com.yunmu.shopping.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public Result<Map<String, Object>> register(@Valid @RequestBody RegisterDTO dto) {
        String token = userService.register(dto);
        UserVO userVO = userService.getUserInfoByPhone(dto.getPhone());
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("userId", userVO.getId());
        return Result.success(data);
    }

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@Valid @RequestBody LoginDTO dto) {
        String token = userService.login(dto);
        UserVO userVO = userService.getUserInfoByPhone(dto.getPhone());
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("userId", userVO.getId());
        return Result.success(data);
    }

    @PostMapping("/sms-code")
    public Result<Void> sendSmsCode(@Valid @RequestBody SmsCodeDTO dto) {
        userService.sendSmsCode(dto.getPhone(), dto.getType());
        return Result.success();
    }

    @GetMapping("/info")
    public Result<UserVO> getUserInfo() {
        Long userId = UserContext.getUserId();
        UserVO userVO = userService.getUserInfo(userId);
        return Result.success(userVO);
    }

    @PutMapping("/update")
    public Result<Void> updateUser(@Valid @RequestBody UpdateUserDTO dto) {
        Long userId = UserContext.getUserId();
        userService.updateUser(userId, dto);
        return Result.success();
    }

}
