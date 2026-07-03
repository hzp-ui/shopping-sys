package com.yunmu.shopping.refund.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class RefundApplyDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull(message = "订单ID不能为空")
    private Long orderId;

    private Long orderItemId;

    @NotNull(message = "退款类型不能为空")
    private Integer type;

    @NotBlank(message = "退款原因不能为空")
    private String reason;

    private String description;

    private String images;

    @NotNull(message = "退款金额不能为空")
    private BigDecimal refundAmount;

}
