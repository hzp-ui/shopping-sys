package com.yunmu.shopping.address.controller;

import com.yunmu.shopping.address.dto.UserAddressDTO;
import com.yunmu.shopping.address.entity.UserAddress;
import com.yunmu.shopping.address.service.UserAddressService;
import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.security.UserContext;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/address")
@RequiredArgsConstructor
public class UserAddressController {

    private final UserAddressService userAddressService;

    @GetMapping("/list")
    public Result<List<UserAddress>> getAddressList() {
        Long userId = UserContext.getUserId();
        List<UserAddress> list = userAddressService.getAddressList(userId);
        return Result.success(list);
    }

    @PostMapping
    public Result<Void> addAddress(@Valid @RequestBody UserAddressDTO dto) {
        Long userId = UserContext.getUserId();
        userAddressService.addAddress(userId, dto);
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> updateAddress(@PathVariable Long id, @Valid @RequestBody UserAddressDTO dto) {
        Long userId = UserContext.getUserId();
        userAddressService.updateAddress(userId, id, dto);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteAddress(@PathVariable Long id) {
        Long userId = UserContext.getUserId();
        userAddressService.deleteAddress(userId, id);
        return Result.success();
    }

    @PostMapping("/default/{id}")
    public Result<Void> setDefault(@PathVariable Long id) {
        Long userId = UserContext.getUserId();
        userAddressService.setDefault(userId, id);
        return Result.success();
    }

}
