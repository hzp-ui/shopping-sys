package com.yunmu.shopping.distribution.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.distribution.entity.DistributionOrder;
import com.yunmu.shopping.distribution.entity.DistributionUser;
import com.yunmu.shopping.distribution.mapper.DistributionOrderMapper;
import com.yunmu.shopping.distribution.mapper.DistributionUserMapper;
import com.yunmu.shopping.distribution.service.DistributionService;
import com.yunmu.shopping.goods.dto.GoodsVO;
import com.yunmu.shopping.goods.entity.Goods;
import com.yunmu.shopping.goods.mapper.GoodsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DistributionServiceImpl extends ServiceImpl<DistributionUserMapper, DistributionUser> implements DistributionService {

    private final DistributionOrderMapper distributionOrderMapper;
    private final GoodsMapper goodsMapper;

    @Override
    public Map<String, Object> getDistributionCenter(Long userId) {
        Map<String, Object> result = new HashMap<>();

        DistributionUser distributionUser = getOne(new LambdaQueryWrapper<DistributionUser>()
                .eq(DistributionUser::getUserId, userId)
                .last("limit 1"));

        if (distributionUser == null) {
            distributionUser = new DistributionUser();
            distributionUser.setUserId(userId);
            distributionUser.setLevel(1);
            distributionUser.setTotalCommission(BigDecimal.ZERO);
            distributionUser.setAvailableCommission(BigDecimal.ZERO);
            distributionUser.setFrozenCommission(BigDecimal.ZERO);
            distributionUser.setWithdrawnCommission(BigDecimal.ZERO);
            distributionUser.setOrderCount(0);
            distributionUser.setTeamCount(0);
            distributionUser.setStatus(0);
        }

        result.put("distributionUser", distributionUser);

        List<Goods> goodsList = goodsMapper.selectList(new LambdaQueryWrapper<Goods>()
                .eq(Goods::getStatus, 1)
                .eq(Goods::getIsDistribution, 1)
                .orderByDesc(Goods::getDistributionAmount)
                .last("limit 4"));
        List<GoodsVO> goodsVOList = goodsList.stream().map(goods -> {
            GoodsVO vo = new GoodsVO();
            BeanUtils.copyProperties(goods, vo);
            return vo;
        }).collect(Collectors.toList());
        result.put("hotProducts", goodsVOList);

        return result;
    }

    @Override
    public PageResult<DistributionOrder> getDistributionOrders(Long userId, Integer pageNum, Integer pageSize) {
        LambdaQueryWrapper<DistributionOrder> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DistributionOrder::getDistributionUserId, userId)
                .orderByDesc(DistributionOrder::getCreatedAt);

        Page<DistributionOrder> page = new Page<>(pageNum, pageSize);
        distributionOrderMapper.selectPage(page, wrapper);

        return new PageResult<>(page.getRecords(), page.getTotal(), pageNum, pageSize);
    }

    @Override
    public PageResult<Map<String, Object>> getCommissionRecords(Long userId, Integer pageNum, Integer pageSize) {
        Page<DistributionOrder> page = new Page<>(pageNum, pageSize);
        distributionOrderMapper.selectPage(page, new LambdaQueryWrapper<DistributionOrder>()
                .eq(DistributionOrder::getDistributionUserId, userId)
                .orderByDesc(DistributionOrder::getCreatedAt));

        List<Map<String, Object>> records = page.getRecords().stream().map(order -> {
            Map<String, Object> record = new HashMap<>();
            record.put("id", order.getId());
            record.put("orderNo", order.getOrderNo());
            record.put("orderAmount", order.getOrderAmount());
            record.put("commissionAmount", order.getCommissionAmount());
            record.put("status", order.getStatus());
            record.put("createdAt", order.getCreatedAt());
            record.put("type", "commission");
            return record;
        }).collect(Collectors.toList());

        return new PageResult<>(records, page.getTotal(), pageNum, pageSize);
    }

}
