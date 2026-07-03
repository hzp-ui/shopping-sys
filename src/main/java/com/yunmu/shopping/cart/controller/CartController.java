package com.yunmu.shopping.cart.controller;

import com.yunmu.shopping.cart.dto.CartAddDTO;
import com.yunmu.shopping.cart.dto.CartUpdateDTO;
import com.yunmu.shopping.cart.dto.CartVO;
import com.yunmu.shopping.cart.service.CartService;
import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.security.UserContext;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/list")
    public Result<List<CartVO>> getCartList() {
        Long userId = UserContext.getUserId();
        List<CartVO> list = cartService.getCartList(userId);
        return Result.success(list);
    }

    @PostMapping("/add")
    public Result<Void> addCart(@Valid @RequestBody CartAddDTO dto) {
        Long userId = UserContext.getUserId();
        cartService.addCart(userId, dto);
        return Result.success();
    }

    @PutMapping("/update")
    public Result<Void> updateCart(@Valid @RequestBody CartUpdateDTO dto) {
        Long userId = UserContext.getUserId();
        cartService.updateCart(userId, dto);
        return Result.success();
    }

    @DeleteMapping("/delete/{id}")
    public Result<Void> deleteCart(@PathVariable Long id) {
        Long userId = UserContext.getUserId();
        cartService.deleteCart(userId, id);
        return Result.success();
    }

}
