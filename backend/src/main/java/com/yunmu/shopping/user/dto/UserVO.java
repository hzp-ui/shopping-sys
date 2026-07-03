package com.yunmu.shopping.user.dto;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class UserVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String phone;

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

    private Integer status;

    private LocalDateTime createdAt;

}
