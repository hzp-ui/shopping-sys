package com.yunmu.shopping.order.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.yunmu.shopping.common.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("order_item")
public class OrderItem extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private Long id;

    private Long orderId;

    private String orderNo;

    private Long userId;

    private Long goodsId;

    private Long skuId;

    private String goodsName;

    private String goodsImage;

    private String skuName;

    private String specValues;

    private Integer quantity;

    private BigDecimal price;

    private BigDecimal totalPrice;

    private BigDecimal originalPrice;

    private Integer isRefund;

    private Integer refundStatus;

    private Integer isComment;

}
