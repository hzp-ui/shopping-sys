package com.yunmu.shopping.admin.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.yunmu.shopping.admin.dto.AdminLoginDTO;
import com.yunmu.shopping.admin.dto.AdminVO;
import com.yunmu.shopping.admin.entity.Admin;

public interface AdminService extends IService<Admin> {

    String login(AdminLoginDTO dto);

    AdminVO getAdminInfo(Long adminId);

}
