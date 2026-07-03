package com.yunmu.shopping.user.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.yunmu.shopping.common.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("sys_user")
public class User extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String phone;

    private String password;

    private String nickname;

    private String avatar;

    private Integer gender;

    private LocalDateTime birthday;

    private String province;

    private String city;

    private String district;

    private String address;

    private BigDecimal balance;

    private Integer points;

    private Integer level;

    private Long inviteCode;

    private Long parentId;

    private Integer status;

    private String registerIp;

    private LocalDateTime lastLoginTime;

    private String lastLoginIp;

}
