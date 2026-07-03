package com.yunmu.shopping.user.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class UpdateUserDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Size(max = 50, message = "昵称长度不能超过50个字符")
    private String nickname;

    private String avatar;

    private Integer gender;

    private LocalDateTime birthday;

    private String province;

    private String city;

    private String district;

    private String address;

}
