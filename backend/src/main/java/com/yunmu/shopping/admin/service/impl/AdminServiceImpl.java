package com.yunmu.shopping.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yunmu.shopping.admin.dto.AdminLoginDTO;
import com.yunmu.shopping.admin.dto.AdminVO;
import com.yunmu.shopping.admin.entity.Admin;
import com.yunmu.shopping.admin.mapper.AdminMapper;
import com.yunmu.shopping.admin.service.AdminService;
import com.yunmu.shopping.common.BusinessException;
import com.yunmu.shopping.common.ResultCode;
import com.yunmu.shopping.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl extends ServiceImpl<AdminMapper, Admin> implements AdminService {

    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public String login(AdminLoginDTO dto) {
        Admin admin = getOne(new LambdaQueryWrapper<Admin>()
                .eq(Admin::getUsername, dto.getUsername())
                .last("limit 1"));
        if (admin == null) {
            throw new BusinessException(ResultCode.LOGIN_ERROR);
        }

        if (admin.getStatus() != 1) {
            throw new BusinessException(ResultCode.USER_DISABLED);
        }

        if (!passwordEncoder.matches(dto.getPassword(), admin.getPassword())) {
            throw new BusinessException(ResultCode.LOGIN_ERROR);
        }

        return jwtTokenProvider.generateAdminToken(admin.getId(), admin.getUsername());
    }

    @Override
    public AdminVO getAdminInfo(Long adminId) {
        Admin admin = getById(adminId);
        if (admin == null) {
            throw new BusinessException(ResultCode.USER_NOT_EXIST);
        }

        AdminVO vo = new AdminVO();
        BeanUtils.copyProperties(admin, vo);
        return vo;
    }

}
