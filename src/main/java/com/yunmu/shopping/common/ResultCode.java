package com.yunmu.shopping.common;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ResultCode {

    SUCCESS(200, "操作成功"),
    ERROR(500, "操作失败"),

    BAD_REQUEST(400, "请求参数错误"),
    UNAUTHORIZED(401, "未登录或登录已过期"),
    FORBIDDEN(403, "没有访问权限"),
    NOT_FOUND(404, "资源不存在"),

    LOGIN_ERROR(1001, "用户名或密码错误"),
    USER_DISABLED(1002, "账号已被禁用"),
    USER_NOT_EXIST(1003, "用户不存在"),
    USER_ALREADY_EXIST(1004, "用户已存在"),
    PHONE_ALREADY_EXIST(1005, "手机号已被注册"),
    SMS_CODE_ERROR(1006, "验证码错误或已过期"),
    PASSWORD_ERROR(1007, "原密码错误"),

    GOODS_NOT_EXIST(2001, "商品不存在"),
    GOODS_OFF_SHELF(2002, "商品已下架"),
    STOCK_NOT_ENOUGH(2003, "库存不足"),

    ORDER_NOT_EXIST(3001, "订单不存在"),
    ORDER_STATUS_ERROR(3002, "订单状态错误"),
    ORDER_CANCEL_ERROR(3003, "订单取消失败"),

    PAY_ERROR(4001, "支付失败"),
    PAY_AMOUNT_ERROR(4002, "支付金额错误"),
    PAY_STATUS_ERROR(4003, "支付状态错误"),

    COUPON_NOT_EXIST(5001, "优惠券不存在"),
    COUPON_NOT_AVAILABLE(5002, "优惠券不可用"),
    COUPON_USED(5003, "优惠券已使用"),
    COUPON_EXPIRED(5004, "优惠券已过期"),

    BALANCE_NOT_ENOUGH(6001, "余额不足"),
    WITHDRAW_AMOUNT_ERROR(6002, "提现金额错误"),
    WITHDRAW_MIN_ERROR(6003, "低于最低提现金额"),

    FILE_UPLOAD_ERROR(7001, "文件上传失败"),
    FILE_SIZE_ERROR(7002, "文件大小超出限制"),

    PARAM_VALIDATE_ERROR(8001, "参数校验失败");

    private final Integer code;
    private final String message;

}
