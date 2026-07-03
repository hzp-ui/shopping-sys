package com.yunmu.shopping.goods.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.goods.dto.GoodsDTO;
import com.yunmu.shopping.goods.dto.GoodsDetailVO;
import com.yunmu.shopping.goods.dto.GoodsQueryDTO;
import com.yunmu.shopping.goods.dto.GoodsVO;
import com.yunmu.shopping.goods.entity.Goods;

public interface GoodsService extends IService<Goods> {

    PageResult<GoodsVO> getGoodsList(GoodsQueryDTO query);

    GoodsDetailVO getGoodsDetail(Long id);

    PageResult<GoodsVO> searchGoods(String keyword, Integer pageNum, Integer pageSize);

    PageResult<GoodsVO> getAdminGoodsList(GoodsQueryDTO query);

    void addGoods(GoodsDTO dto);

    void updateGoods(GoodsDTO dto);

    void deleteGoods(Long id);

}
