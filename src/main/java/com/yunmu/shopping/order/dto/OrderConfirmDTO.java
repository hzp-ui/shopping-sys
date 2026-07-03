package com.yunmu.shopping.order.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class OrderConfirmDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long addressId;

    private List<OrderItemDTO> goodsList;

    private Long couponId;

    private String remark;

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
