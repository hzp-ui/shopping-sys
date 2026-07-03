package com.yunmu.shopping.wallet.controller;

import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.common.Result;
import com.yunmu.shopping.security.UserContext;
import com.yunmu.shopping.wallet.entity.WalletRecord;
import com.yunmu.shopping.wallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping("/balance")
    public Result<Map<String, BigDecimal>> getBalance() {
        Long userId = UserContext.getUserId();
        BigDecimal balance = walletService.getBalance(userId);
        Map<String, BigDecimal> data = new HashMap<>();
        data.put("balance", balance);
        return Result.success(data);
    }

    @GetMapping("/records")
    public Result<PageResult<WalletRecord>> getWalletRecords(
            @RequestParam(required = false) Integer type,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        Long userId = UserContext.getUserId();
        PageResult<WalletRecord> result = walletService.getWalletRecords(userId, type, pageNum, pageSize);
        return Result.success(result);
    }

}
