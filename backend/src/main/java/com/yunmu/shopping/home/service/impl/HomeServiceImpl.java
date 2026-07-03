package com.yunmu.shopping.home.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.yunmu.shopping.goods.dto.GoodsVO;
import com.yunmu.shopping.goods.entity.Goods;
import com.yunmu.shopping.goods.mapper.GoodsMapper;
import com.yunmu.shopping.home.entity.Banner;
import com.yunmu.shopping.home.entity.HomeNav;
import com.yunmu.shopping.home.mapper.BannerMapper;
import com.yunmu.shopping.home.mapper.HomeNavMapper;
import com.yunmu.shopping.home.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HomeServiceImpl implements HomeService {

    private final BannerMapper bannerMapper;
    private final HomeNavMapper homeNavMapper;
    private final GoodsMapper goodsMapper;

    @Override
    public List<Banner> getBannerList() {
        return bannerMapper.selectList(new LambdaQueryWrapper<Banner>()
                .eq(Banner::getStatus, 1)
                .orderByAsc(Banner::getSort));
    }

    @Override
    public List<HomeNav> getNavList() {
        return homeNavMapper.selectList(new LambdaQueryWrapper<HomeNav>()
                .eq(HomeNav::getStatus, 1)
                .orderByAsc(HomeNav::getSort));
    }

    @Override
    public List<GoodsVO> getRecommendProducts() {
        List<Goods> goodsList = goodsMapper.selectList(new LambdaQueryWrapper<Goods>()
                .eq(Goods::getStatus, 1)
                .eq(Goods::getIsRecommend, 1)
                .orderByDesc(Goods::getSales)
                .last("limit 10"));
        return convertToVOList(goodsList);
    }

    @Override
    public List<GoodsVO> getSeckillProducts() {
        List<Goods> goodsList = goodsMapper.selectList(new LambdaQueryWrapper<Goods>()
                .eq(Goods::getStatus, 1)
                .eq(Goods::getIsSeckill, 1)
                .orderByAsc(Goods::getSeckillPrice)
                .last("limit 10"));
        return convertToVOList(goodsList);
    }

    @Override
    public List<GoodsVO> getGroupProducts() {
        List<Goods> goodsList = goodsMapper.selectList(new LambdaQueryWrapper<Goods>()
                .eq(Goods::getStatus, 1)
                .eq(Goods::getIsGroup, 1)
                .orderByAsc(Goods::getGroupPrice)
                .last("limit 10"));
        return convertToVOList(goodsList);
    }

    @Override
    public List<GoodsVO> getDistributionProducts() {
        List<Goods> goodsList = goodsMapper.selectList(new LambdaQueryWrapper<Goods>()
                .eq(Goods::getStatus, 1)
                .eq(Goods::getIsDistribution, 1)
                .orderByDesc(Goods::getDistributionAmount)
                .last("limit 10"));
        return convertToVOList(goodsList);
    }

    private List<GoodsVO> convertToVOList(List<Goods> goodsList) {
        return goodsList.stream().map(goods -> {
            GoodsVO vo = new GoodsVO();
            BeanUtils.copyProperties(goods, vo);
            return vo;
        }).collect(Collectors.toList());
    }

}
