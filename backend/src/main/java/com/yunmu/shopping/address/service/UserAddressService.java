package com.yunmu.shopping.address.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.yunmu.shopping.address.dto.UserAddressDTO;
import com.yunmu.shopping.address.entity.UserAddress;

import java.util.List;

public interface UserAddressService extends IService<UserAddress> {

    List<UserAddress> getAddressList(Long userId);

    void addAddress(Long userId, UserAddressDTO dto);

    void updateAddress(Long userId, Long id, UserAddressDTO dto);

    void deleteAddress(Long userId, Long id);

    void setDefault(Long userId, Long id);

}
