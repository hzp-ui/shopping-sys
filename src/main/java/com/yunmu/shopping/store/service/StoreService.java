package com.yunmu.shopping.store.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.yunmu.shopping.store.entity.Store;

import java.util.List;

public interface StoreService extends IService<Store> {

    List<Store> getStoreList();

    Store getStoreDetail(Long id);

}
