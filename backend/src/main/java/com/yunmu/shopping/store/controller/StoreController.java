package com.yunmu.shopping.store.controller;

import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.store.entity.Store;
import com.yunmu.shopping.store.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/store")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;

    @GetMapping("/list")
    public Result<List<Store>> getStoreList() {
        List<Store> list = storeService.getStoreList();
        return Result.success(list);
    }

    @GetMapping("/detail/{id}")
    public Result<Store> getStoreDetail(@PathVariable Long id) {
        Store store = storeService.getStoreDetail(id);
        return Result.success(store);
    }

}
