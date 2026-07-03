package com.yunmu.shopping.cart.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.io.Serializable;

@Data
public class CartUpdateDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull(message = "购物车ID不能为空")
    private Long id;

    @NotNull(message = "数量不能为空")
    @Min(value = 1, message = "数量最小为1")
    private Integer quantity;

}
