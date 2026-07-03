package com.yunmu.shopping.cart.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.yunmu.shopping.cart.dto.CartAddDTO;
import com.yunmu.shopping.cart.dto.CartUpdateDTO;
import com.yunmu.shopping.cart.dto.CartVO;
import com.yunmu.shopping.cart.entity.Cart;

import java.util.List;

public interface CartService extends IService<Cart> {

    List<CartVO> getCartList(Long userId);

    void addCart(Long userId, CartAddDTO dto);

    void updateCart(Long userId, CartUpdateDTO dto);

    void deleteCart(Long userId, Long id);

}
