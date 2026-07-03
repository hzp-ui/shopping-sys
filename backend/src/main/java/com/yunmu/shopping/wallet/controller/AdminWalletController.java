package com.yunmu.shopping.wallet.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.wallet.entity.Wallet;
import com.yunmu.shopping.wallet.entity.WalletWithdraw;
import com.yunmu.shopping.wallet.mapper.WalletMapper;
import com.yunmu.shopping.wallet.mapper.WalletWithdrawMapper;
import com.yunmu.shopping.wallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/wallet")
@RequiredArgsConstructor
public class AdminWalletController {

    private final WalletService walletService;
    private final WalletWithdrawMapper walletWithdrawMapper;
    private final WalletMapper walletMapper;

    @GetMapping("/balance-list")
    public Result<PageResult<Wallet>> getBalanceList(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        LambdaQueryWrapper<Wallet> wrapper = new LambdaQueryWrapper<>();
        if (status != null) {
            wrapper.eq(Wallet::getStatus, status);
        }
        wrapper.orderByDesc(Wallet::getCreatedAt);
        Page<Wallet> page = new Page<>(pageNum, pageSize);
        walletService.page(page, wrapper);
        PageResult<Wallet> result = new PageResult<>(page.getRecords(), page.getTotal(), pageNum, pageSize);
        return Result.success(result);
    }

    @GetMapping("/withdraw-list")
    public Result<PageResult<WalletWithdraw>> getWithdrawList(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        LambdaQueryWrapper<WalletWithdraw> wrapper = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(WalletWithdraw::getWithdrawNo, keyword);
        }
        if (status != null) {
            wrapper.eq(WalletWithdraw::getStatus, status);
        }
        wrapper.orderByDesc(WalletWithdraw::getCreatedAt);
        Page<WalletWithdraw> page = new Page<>(pageNum, pageSize);
        walletWithdrawMapper.selectPage(page, wrapper);
        PageResult<WalletWithdraw> result = new PageResult<>(page.getRecords(), page.getTotal(), pageNum, pageSize);
        return Result.success(result);
    }

    @PutMapping("/withdraw/{id}/audit")
    public Result<Void> auditWithdraw(@PathVariable Long id, @RequestBody Map<String, Object> params) {
        Integer status = (Integer) params.get("status");
        String remark = (String) params.get("remark");
        WalletWithdraw withdraw = new WalletWithdraw();
        withdraw.setId(id);
        withdraw.setStatus(status);
        withdraw.setRemark(remark);
        withdraw.setAuditTime(LocalDateTime.now());
        walletWithdrawMapper.updateById(withdraw);
        return Result.success();
    }

    @PutMapping("/adjust")
    public Result<Void> adjustBalance(@RequestBody Map<String, Object> params) {
        Long userId = Long.valueOf(params.get("userId").toString());
        BigDecimal amount = new BigDecimal(params.get("amount").toString());
        Integer type = (Integer) params.get("type");

        Wallet wallet = walletMapper.selectOne(new LambdaQueryWrapper<Wallet>().eq(Wallet::getUserId, userId));
        if (wallet == null) {
            wallet = new Wallet();
            wallet.setUserId(userId);
            wallet.setBalance(BigDecimal.ZERO);
            wallet.setFrozenAmount(BigDecimal.ZERO);
            wallet.setTotalRecharge(BigDecimal.ZERO);
            wallet.setTotalConsume(BigDecimal.ZERO);
            wallet.setTotalWithdraw(BigDecimal.ZERO);
            wallet.setStatus(1);
            walletMapper.insert(wallet);
        }

        if (type == 1) {
            wallet.setBalance(wallet.getBalance().add(amount));
            wallet.setTotalRecharge(wallet.getTotalRecharge().add(amount));
        } else {
            wallet.setBalance(wallet.getBalance().subtract(amount));
            wallet.setTotalConsume(wallet.getTotalConsume().add(amount));
        }
        walletMapper.updateById(wallet);
        return Result.success();
    }

}
