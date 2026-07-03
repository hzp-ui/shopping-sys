package com.yunmu.shopping.user.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.yunmu.shopping.user.dto.LoginDTO;
import com.yunmu.shopping.user.dto.RegisterDTO;
import com.yunmu.shopping.user.dto.UpdateUserDTO;
import com.yunmu.shopping.user.dto.UserVO;
import com.yunmu.shopping.user.entity.User;

public interface UserService extends IService<User> {

    String register(RegisterDTO dto);

    String login(LoginDTO dto);

    void sendSmsCode(String phone, String type);

    UserVO getUserInfo(Long userId);

    UserVO getUserInfoByPhone(String phone);

    void updateUser(Long userId, UpdateUserDTO dto);

}
