package com.yunmu.shopping.order.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class OrderCreateDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull(message = "地址ID不能为空")
    private Long addressId;

    @NotNull(message = "商品列表不能为空")
    private List<OrderItemDTO> goodsList;

    private Long couponId;

    private String remark;

    private Integer payType;

    @Data
    public static class OrderItemDTO implements Serializable {
        private static final long serialVersionUID = 1L;

        @NotNull(message = "商品ID不能为空")
        private Long goodsId;

        private Long skuId;

        @NotNull(message = "数量不能为空")
        private Integer quantity;
    }
}
