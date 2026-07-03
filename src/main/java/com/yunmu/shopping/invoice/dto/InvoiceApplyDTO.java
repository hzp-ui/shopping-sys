package com.yunmu.shopping.invoice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;

@Data
public class InvoiceApplyDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull(message = "订单ID不能为空")
    private Long orderId;

    @NotNull(message = "发票类型不能为空")
    private Integer type;

    @NotNull(message = "抬头类型不能为空")
    private Integer titleType;

    @NotBlank(message = "发票抬头不能为空")
    private String title;

    private String taxNumber;

    private String companyAddress;

    private String companyPhone;

    private String bankName;

    private String bankAccount;

    @NotBlank(message = "邮箱不能为空")
    private String email;

    private String remark;

}
