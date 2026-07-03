package com.yunmu.shopping.cart.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yunmu.shopping.cart.dto.CartAddDTO;
import com.yunmu.shopping.cart.dto.CartUpdateDTO;
import com.yunmu.shopping.cart.dto.CartVO;
import com.yunmu.shopping.cart.entity.Cart;
import com.yunmu.shopping.cart.mapper.CartMapper;
import com.yunmu.shopping.cart.service.CartService;
import com.yunmu.shopping.common.BusinessException;
import com.yunmu.shopping.common.ResultCode;
import com.yunmu.shopping.goods.entity.Goods;
import com.yunmu.shopping.goods.entity.GoodsSku;
import com.yunmu.shopping.goods.mapper.GoodsMapper;
import com.yunmu.shopping.goods.mapper.GoodsSkuMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl extends ServiceImpl<CartMapper, Cart> implements CartService {

    private final GoodsMapper goodsMapper;
    private final GoodsSkuMapper goodsSkuMapper;

    @Override
    public List<CartVO> getCartList(Long userId) {
        List<Cart> cartList = list(new LambdaQueryWrapper<Cart>()
                .eq(Cart::getUserId, userId)
                .orderByDesc(Cart::getCreatedAt));
        return cartList.stream().map(cart -> {
            CartVO vo = new CartVO();
            BeanUtils.copyProperties(cart, vo);
            return vo;
        }).collect(Collectors.toList());
    }

    @Override
    public void addCart(Long userId, CartAddDTO dto) {
        Goods goods = goodsMapper.selectById(dto.getGoodsId());
        if (goods == null || goods.getStatus() != 1) {
            throw new BusinessException(ResultCode.GOODS_NOT_EXIST);
        }

        Cart existCart = getOne(new LambdaQueryWrapper<Cart>()
                .eq(Cart::getUserId, userId)
                .eq(Cart::getGoodsId, dto.getGoodsId())
                .eq(Cart::getSkuId, dto.getSkuId() != null ? dto.getSkuId() : 0)
                .last("limit 1"));

        if (existCart != null) {
            existCart.setQuantity(existCart.getQuantity() + dto.getQuantity());
            updateById(existCart);
            return;
        }

        Cart cart = new Cart();
        cart.setUserId(userId);
        cart.setGoodsId(dto.getGoodsId());
        cart.setSkuId(dto.getSkuId() != null ? dto.getSkuId() : 0);
        cart.setQuantity(dto.getQuantity());
        cart.setGoodsName(goods.getName());
        cart.setGoodsImage(goods.getMainImage());
        cart.setSelected(1);

        if (dto.getSkuId() != null) {
            GoodsSku sku = goodsSkuMapper.selectById(dto.getSkuId());
            if (sku != null) {
                cart.setPrice(sku.getPrice());
                cart.setSkuName(sku.getSkuName());
                cart.setSpecValues(sku.getSpecValues());
            }
        } else {
            cart.setPrice(goods.getPrice());
        }

        save(cart);
    }

    @Override
    public void updateCart(Long userId, CartUpdateDTO dto) {
        Cart cart = getById(dto.getId());
        if (cart == null || !cart.getUserId().equals(userId)) {
            throw new BusinessException("购物车商品不存在");
        }
        cart.setQuantity(dto.getQuantity());
        updateById(cart);
    }

    @Override
    public void deleteCart(Long userId, Long id) {
        Cart cart = getById(id);
        if (cart == null || !cart.getUserId().equals(userId)) {
            throw new BusinessException("购物车商品不存在");
        }
        removeById(id);
    }

}
