package com.yunmu.shopping.wallet.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.wallet.entity.Wallet;
import com.yunmu.shopping.wallet.entity.WalletRecord;

import java.math.BigDecimal;

public interface WalletService extends IService<Wallet> {

    BigDecimal getBalance(Long userId);

    PageResult<WalletRecord> getWalletRecords(Long userId, Integer type, Integer pageNum, Integer pageSize);

}
