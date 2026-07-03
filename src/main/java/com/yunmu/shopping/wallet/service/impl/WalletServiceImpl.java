package com.yunmu.shopping.wallet.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.wallet.entity.Wallet;
import com.yunmu.shopping.wallet.entity.WalletRecord;
import com.yunmu.shopping.wallet.mapper.WalletMapper;
import com.yunmu.shopping.wallet.mapper.WalletRecordMapper;
import com.yunmu.shopping.wallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl extends ServiceImpl<WalletMapper, Wallet> implements WalletService {

    private final WalletRecordMapper walletRecordMapper;

    @Override
    public BigDecimal getBalance(Long userId) {
        Wallet wallet = getOne(new LambdaQueryWrapper<Wallet>()
                .eq(Wallet::getUserId, userId)
                .last("limit 1"));
        if (wallet == null) {
            return BigDecimal.ZERO;
        }
        return wallet.getBalance();
    }

    @Override
    public PageResult<WalletRecord> getWalletRecords(Long userId, Integer type, Integer pageNum, Integer pageSize) {
        LambdaQueryWrapper<WalletRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(WalletRecord::getUserId, userId);

        if (type != null) {
            wrapper.eq(WalletRecord::getType, type);
        }

        wrapper.orderByDesc(WalletRecord::getCreatedAt);

        Page<WalletRecord> page = new Page<>(pageNum, pageSize);
        walletRecordMapper.selectPage(page, wrapper);

        return new PageResult<>(page.getRecords(), page.getTotal(), pageNum, pageSize);
    }

}
