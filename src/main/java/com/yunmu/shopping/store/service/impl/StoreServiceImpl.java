package com.yunmu.shopping.store.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yunmu.shopping.common.BusinessException;
import com.yunmu.shopping.common.ResultCode;
import com.yunmu.shopping.store.entity.Store;
import com.yunmu.shopping.store.mapper.StoreMapper;
import com.yunmu.shopping.store.service.StoreService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StoreServiceImpl extends ServiceImpl<StoreMapper, Store> implements StoreService {

    @Override
    public List<Store> getStoreList() {
        return list(new LambdaQueryWrapper<Store>()
                .eq(Store::getStatus, 1)
                .orderByAsc(Store::getSort));
    }

    @Override
    public Store getStoreDetail(Long id) {
        Store store = getById(id);
        if (store == null || store.getStatus() != 1) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        return store;
    }

}
