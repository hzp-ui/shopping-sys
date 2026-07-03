package com.yunmu.shopping.store.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.yunmu.shopping.common.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("store_apply")
public class StoreApply extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private Long id;

    private Long userId;

    private String storeName;

    private String contactName;

    private String contactPhone;

    private String province;

    private String city;

    private String district;

    private String address;

    private String idCardFront;

    private String idCardBack;

    private String businessLicense;

    private Integer status;

    private String remark;

    private java.time.LocalDateTime auditTime;

    private Long auditAdminId;

}
