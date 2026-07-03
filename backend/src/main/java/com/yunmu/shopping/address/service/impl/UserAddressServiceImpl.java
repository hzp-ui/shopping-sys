package com.yunmu.shopping.address.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yunmu.shopping.address.dto.UserAddressDTO;
import com.yunmu.shopping.address.entity.UserAddress;
import com.yunmu.shopping.address.mapper.UserAddressMapper;
import com.yunmu.shopping.address.service.UserAddressService;
import com.yunmu.shopping.common.BusinessException;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserAddressServiceImpl extends ServiceImpl<UserAddressMapper, UserAddress> implements UserAddressService {

    @Override
    public List<UserAddress> getAddressList(Long userId) {
        return list(new LambdaQueryWrapper<UserAddress>()
                .eq(UserAddress::getUserId, userId)
                .orderByDesc(UserAddress::getIsDefault)
                .orderByDesc(UserAddress::getCreatedAt));
    }

    @Override
    public void addAddress(Long userId, UserAddressDTO dto) {
        UserAddress address = new UserAddress();
        BeanUtils.copyProperties(dto, address);
        address.setUserId(userId);

        if (dto.getIsDefault() != null && dto.getIsDefault() == 1) {
            update(new LambdaUpdateWrapper<UserAddress>()
                    .eq(UserAddress::getUserId, userId)
                    .eq(UserAddress::getIsDefault, 1)
                    .set(UserAddress::getIsDefault, 0));
        }

        long count = count(new LambdaQueryWrapper<UserAddress>().eq(UserAddress::getUserId, userId));
        if (count == 0) {
            address.setIsDefault(1);
        }

        save(address);
    }

    @Override
    public void updateAddress(Long userId, Long id, UserAddressDTO dto) {
        UserAddress address = getById(id);
        if (address == null || !address.getUserId().equals(userId)) {
            throw new BusinessException("地址不存在");
        }

        BeanUtils.copyProperties(dto, address);
        address.setId(id);

        if (dto.getIsDefault() != null && dto.getIsDefault() == 1) {
            update(new LambdaUpdateWrapper<UserAddress>()
                    .eq(UserAddress::getUserId, userId)
                    .ne(UserAddress::getId, id)
                    .eq(UserAddress::getIsDefault, 1)
                    .set(UserAddress::getIsDefault, 0));
        }

        updateById(address);
    }

    @Override
    public void deleteAddress(Long userId, Long id) {
        UserAddress address = getById(id);
        if (address == null || !address.getUserId().equals(userId)) {
            throw new BusinessException("地址不存在");
        }
        removeById(id);
    }

    @Override
    public void setDefault(Long userId, Long id) {
        UserAddress address = getById(id);
        if (address == null || !address.getUserId().equals(userId)) {
            throw new BusinessException("地址不存在");
        }

        update(new LambdaUpdateWrapper<UserAddress>()
                .eq(UserAddress::getUserId, userId)
                .eq(UserAddress::getIsDefault, 1)
                .set(UserAddress::getIsDefault, 0));

        update(new LambdaUpdateWrapper<UserAddress>()
                .eq(UserAddress::getId, id)
                .set(UserAddress::getIsDefault, 1));
    }

}
