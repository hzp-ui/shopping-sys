package com.yunmu.shopping.home.service;

import com.yunmu.shopping.goods.dto.GoodsVO;
import com.yunmu.shopping.home.entity.Banner;
import com.yunmu.shopping.home.entity.HomeNav;

import java.util.List;

public interface HomeService {

    List<Banner> getBannerList();

    List<HomeNav> getNavList();

    List<GoodsVO> getRecommendProducts();

    List<GoodsVO> getSeckillProducts();

    List<GoodsVO> getGroupProducts();

    List<GoodsVO> getDistributionProducts();

}
