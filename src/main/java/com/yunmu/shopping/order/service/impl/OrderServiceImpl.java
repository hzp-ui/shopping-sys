package com.yunmu.shopping.order.service.impl;

import cn.hutool.core.util.IdUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yunmu.shopping.address.entity.UserAddress;
import com.yunmu.shopping.address.mapper.UserAddressMapper;
import com.yunmu.shopping.common.BusinessException;
import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.common.ResultCode;
import com.yunmu.shopping.goods.entity.Goods;
import com.yunmu.shopping.goods.entity.GoodsSku;
import com.yunmu.shopping.goods.mapper.GoodsMapper;
import com.yunmu.shopping.goods.mapper.GoodsSkuMapper;
import com.yunmu.shopping.order.dto.OrderConfirmDTO;
import com.yunmu.shopping.order.dto.OrderConfirmVO;
import com.yunmu.shopping.order.dto.OrderCreateDTO;
import com.yunmu.shopping.order.dto.OrderItemVO;
import com.yunmu.shopping.order.dto.OrderVO;
import com.yunmu.shopping.order.entity.Order;
import com.yunmu.shopping.order.entity.OrderItem;
import com.yunmu.shopping.order.mapper.OrderItemMapper;
import com.yunmu.shopping.order.mapper.OrderMapper;
import com.yunmu.shopping.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl extends ServiceImpl<OrderMapper, Order> implements OrderService {

    private final OrderItemMapper orderItemMapper;
    private final GoodsMapper goodsMapper;
    private final GoodsSkuMapper goodsSkuMapper;
    private final UserAddressMapper userAddressMapper;

    @Override
    public OrderConfirmVO confirmOrder(Long userId, OrderConfirmDTO dto) {
        OrderConfirmVO vo = new OrderConfirmVO();

        if (dto.getAddressId() != null) {
            UserAddress address = userAddressMapper.selectById(dto.getAddressId());
            if (address != null && address.getUserId().equals(userId)) {
                vo.setAddressId(address.getId());
                vo.setReceiverName(address.getName());
                vo.setReceiverPhone(address.getPhone());
                vo.setReceiverProvince(address.getProvince());
                vo.setReceiverCity(address.getCity());
                vo.setReceiverDistrict(address.getDistrict());
                vo.setReceiverAddress(address.getDetail());
            }
        } else {
            UserAddress defaultAddress = userAddressMapper.selectOne(new LambdaQueryWrapper<UserAddress>()
                    .eq(UserAddress::getUserId, userId)
                    .eq(UserAddress::getIsDefault, 1)
                    .last("limit 1"));
            if (defaultAddress != null) {
                vo.setAddressId(defaultAddress.getId());
                vo.setReceiverName(defaultAddress.getName());
                vo.setReceiverPhone(defaultAddress.getPhone());
                vo.setReceiverProvince(defaultAddress.getProvince());
                vo.setReceiverCity(defaultAddress.getCity());
                vo.setReceiverDistrict(defaultAddress.getDistrict());
                vo.setReceiverAddress(defaultAddress.getDetail());
            }
        }

        BigDecimal goodsAmount = BigDecimal.ZERO;
        List<OrderItemVO> goodsList = new ArrayList<>();

        if (dto.getGoodsList() != null) {
            for (OrderConfirmDTO.OrderItemDTO item : dto.getGoodsList()) {
                Goods goods = goodsMapper.selectById(item.getGoodsId());
                if (goods == null || goods.getStatus() != 1) {
                    throw new BusinessException(ResultCode.GOODS_NOT_EXIST);
                }

                BigDecimal price = goods.getPrice();
                String skuName = "";
                String specValues = "";
                String image = goods.getMainImage();

                if (item.getSkuId() != null) {
                    GoodsSku sku = goodsSkuMapper.selectById(item.getSkuId());
                    if (sku != null) {
                        price = sku.getPrice();
                        skuName = sku.getSkuName();
                        specValues = sku.getSpecValues();
                        if (StringUtils.hasText(sku.getImage())) {
                            image = sku.getImage();
                        }
                    }
                }

                BigDecimal totalPrice = price.multiply(new BigDecimal(item.getQuantity()));
                goodsAmount = goodsAmount.add(totalPrice);

                OrderItemVO itemVO = new OrderItemVO();
                itemVO.setGoodsId(goods.getId());
                itemVO.setSkuId(item.getSkuId());
                itemVO.setGoodsName(goods.getName());
                itemVO.setGoodsImage(image);
                itemVO.setSkuName(skuName);
                itemVO.setSpecValues(specValues);
                itemVO.setQuantity(item.getQuantity());
                itemVO.setPrice(price);
                itemVO.setTotalPrice(totalPrice);
                goodsList.add(itemVO);
            }
        }

        vo.setGoodsList(goodsList);
        vo.setGoodsAmount(goodsAmount);
        vo.setFreightAmount(BigDecimal.ZERO);
        vo.setCouponAmount(BigDecimal.ZERO);
        vo.setPayAmount(goodsAmount);

        return vo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String createOrder(Long userId, OrderCreateDTO dto) {
        UserAddress address = userAddressMapper.selectById(dto.getAddressId());
        if (address == null || !address.getUserId().equals(userId)) {
            throw new BusinessException("收货地址不存在");
        }

        if (dto.getGoodsList() == null || dto.getGoodsList().isEmpty()) {
            throw new BusinessException("商品列表不能为空");
        }

        String orderNo = IdUtil.getSnowflakeNextIdStr();

        BigDecimal goodsAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderCreateDTO.OrderItemDTO item : dto.getGoodsList()) {
            Goods goods = goodsMapper.selectById(item.getGoodsId());
            if (goods == null || goods.getStatus() != 1) {
                throw new BusinessException(ResultCode.GOODS_NOT_EXIST);
            }

            BigDecimal price = goods.getPrice();
            String skuName = "";
            String specValues = "";
            String image = goods.getMainImage();

            if (item.getSkuId() != null) {
                GoodsSku sku = goodsSkuMapper.selectById(item.getSkuId());
                if (sku != null) {
                    if (sku.getStock() < item.getQuantity()) {
                        throw new BusinessException(ResultCode.STOCK_NOT_ENOUGH);
                    }
                    price = sku.getPrice();
                    skuName = sku.getSkuName();
                    specValues = sku.getSpecValues();
                    if (StringUtils.hasText(sku.getImage())) {
                        image = sku.getImage();
                    }
                    sku.setStock(sku.getStock() - item.getQuantity());
                    goodsSkuMapper.updateById(sku);
                }
            } else {
                if (goods.getStock() < item.getQuantity()) {
                    throw new BusinessException(ResultCode.STOCK_NOT_ENOUGH);
                }
                goods.setStock(goods.getStock() - item.getQuantity());
                goods.setSales(goods.getSales() + item.getQuantity());
                goodsMapper.updateById(goods);
            }

            BigDecimal totalPrice = price.multiply(new BigDecimal(item.getQuantity()));
            goodsAmount = goodsAmount.add(totalPrice);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrderId(0L);
            orderItem.setOrderNo(orderNo);
            orderItem.setUserId(userId);
            orderItem.setGoodsId(goods.getId());
            orderItem.setSkuId(item.getSkuId());
            orderItem.setGoodsName(goods.getName());
            orderItem.setGoodsImage(image);
            orderItem.setSkuName(skuName);
            orderItem.setSpecValues(specValues);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(price);
            orderItem.setTotalPrice(totalPrice);
            orderItems.add(orderItem);
        }

        Order order = new Order();
        order.setOrderNo(orderNo);
        order.setUserId(userId);
        order.setOrderType(1);
        order.setOrderStatus(0);
        order.setGoodsAmount(goodsAmount);
        order.setFreightAmount(BigDecimal.ZERO);
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setCouponAmount(BigDecimal.ZERO);
        order.setTotalAmount(goodsAmount);
        order.setPayAmount(goodsAmount);
        order.setPayType(dto.getPayType() != null ? dto.getPayType() : 1);
        order.setReceiverName(address.getName());
        order.setReceiverPhone(address.getPhone());
        order.setReceiverProvince(address.getProvince());
        order.setReceiverCity(address.getCity());
        order.setReceiverDistrict(address.getDistrict());
        order.setReceiverAddress(address.getDetail());
        order.setRemark(dto.getRemark());
        save(order);

        for (OrderItem item : orderItems) {
            item.setOrderId(order.getId());
            orderItemMapper.insert(item);
        }

        return orderNo;
    }

    @Override
    public PageResult<OrderVO> getOrderList(Long userId, Integer status, Integer pageNum, Integer pageSize) {
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Order::getUserId, userId);

        if (status != null) {
            wrapper.eq(Order::getOrderStatus, status);
        }

        wrapper.orderByDesc(Order::getCreatedAt);

        Page<Order> page = new Page<>(pageNum, pageSize);
        page(page, wrapper);

        List<OrderVO> voList = page.getRecords().stream().map(order -> {
            OrderVO vo = new OrderVO();
            BeanUtils.copyProperties(order, vo);
            vo.setItemList(getOrderItems(order.getId()));
            return vo;
        }).collect(Collectors.toList());

        return new PageResult<>(voList, page.getTotal(), pageNum, pageSize);
    }

    @Override
    public OrderVO getOrderDetail(Long userId, Long id) {
        Order order = getById(id);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.ORDER_NOT_EXIST);
        }

        OrderVO vo = new OrderVO();
        BeanUtils.copyProperties(order, vo);
        vo.setItemList(getOrderItems(id));
        return vo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void cancelOrder(Long userId, Long id) {
        Order order = getById(id);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.ORDER_NOT_EXIST);
        }

        if (order.getOrderStatus() != 0) {
            throw new BusinessException(ResultCode.ORDER_CANCEL_ERROR);
        }

        order.setOrderStatus(6);
        order.setCancelTime(LocalDateTime.now());
        order.setCancelReason("用户取消");
        updateById(order);

        List<OrderItem> items = orderItemMapper.selectList(new LambdaQueryWrapper<OrderItem>()
                .eq(OrderItem::getOrderId, id));

        for (OrderItem item : items) {
            if (item.getSkuId() != null && item.getSkuId() > 0) {
                GoodsSku sku = goodsSkuMapper.selectById(item.getSkuId());
                if (sku != null) {
                    sku.setStock(sku.getStock() + item.getQuantity());
                    goodsSkuMapper.updateById(sku);
                }
            } else {
                Goods goods = goodsMapper.selectById(item.getGoodsId());
                if (goods != null) {
                    goods.setStock(goods.getStock() + item.getQuantity());
                    goods.setSales(Math.max(0, goods.getSales() - item.getQuantity()));
                    goodsMapper.updateById(goods);
                }
            }
        }
    }

    @Override
    public PageResult<OrderVO> getAdminOrderList(Integer status, String keyword, Integer pageNum, Integer pageSize) {
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<>();

        if (status != null) {
            wrapper.eq(Order::getOrderStatus, status);
        }
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(Order::getOrderNo, keyword)
                    .or().like(Order::getReceiverName, keyword)
                    .or().like(Order::getReceiverPhone, keyword));
        }

        wrapper.orderByDesc(Order::getCreatedAt);

        Page<Order> page = new Page<>(pageNum, pageSize);
        page(page, wrapper);

        List<OrderVO> voList = page.getRecords().stream().map(order -> {
            OrderVO vo = new OrderVO();
            BeanUtils.copyProperties(order, vo);
            vo.setItemList(getOrderItems(order.getId()));
            return vo;
        }).collect(Collectors.toList());

        return new PageResult<>(voList, page.getTotal(), pageNum, pageSize);
    }

    @Override
    public OrderVO getAdminOrderDetail(Long id) {
        Order order = getById(id);
        if (order == null) {
            throw new BusinessException(ResultCode.ORDER_NOT_EXIST);
        }
        OrderVO vo = new OrderVO();
        BeanUtils.copyProperties(order, vo);
        vo.setItemList(getOrderItems(id));
        return vo;
    }

    @Override
    public void shipOrder(Long id, String logisticsNo, String logisticsCompany) {
        Order order = getById(id);
        if (order == null) {
            throw new BusinessException(ResultCode.ORDER_NOT_EXIST);
        }

        if (order.getOrderStatus() != 1) {
            throw new BusinessException(ResultCode.ORDER_STATUS_ERROR);
        }

        order.setOrderStatus(2);
        order.setLogisticsNo(logisticsNo);
        order.setLogisticsCompany(logisticsCompany);
        order.setShipTime(LocalDateTime.now());
        updateById(order);
    }

    private List<OrderItemVO> getOrderItems(Long orderId) {
        List<OrderItem> items = orderItemMapper.selectList(new LambdaQueryWrapper<OrderItem>()
                .eq(OrderItem::getOrderId, orderId));
        return items.stream().map(item -> {
            OrderItemVO vo = new OrderItemVO();
            BeanUtils.copyProperties(item, vo);
            return vo;
        }).collect(Collectors.toList());
    }

}
