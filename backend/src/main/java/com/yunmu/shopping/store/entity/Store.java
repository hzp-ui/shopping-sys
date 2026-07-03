package com.yunmu.shopping.store.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.yunmu.shopping.common.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("store")
public class Store extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String name;

    private String logo;

    private String banner;

    private String description;

    private String province;

    private String city;

    private String district;

    private String address;

    private String longitude;

    private String latitude;

    private String phone;

    private String businessHours;

    private Integer sort;

    private Integer status;

    private BigDecimal deliveryFee;

    private BigDecimal freeDeliveryAmount;

    private Integer deliveryDistance;

}
