package com.yunmu.shopping.goods.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yunmu.shopping.common.BusinessException;
import com.yunmu.shopping.common.PageResult;
import com.yunmu.shopping.common.ResultCode;
import com.yunmu.shopping.goods.dto.GoodsDTO;
import com.yunmu.shopping.goods.dto.GoodsDetailVO;
import com.yunmu.shopping.goods.dto.GoodsQueryDTO;
import com.yunmu.shopping.goods.dto.GoodsSkuVO;
import com.yunmu.shopping.goods.dto.GoodsVO;
import com.yunmu.shopping.goods.entity.Goods;
import com.yunmu.shopping.goods.entity.GoodsCategory;
import com.yunmu.shopping.goods.entity.GoodsSku;
import com.yunmu.shopping.goods.mapper.GoodsCategoryMapper;
import com.yunmu.shopping.goods.mapper.GoodsMapper;
import com.yunmu.shopping.goods.mapper.GoodsSkuMapper;
import com.yunmu.shopping.goods.service.GoodsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoodsServiceImpl extends ServiceImpl<GoodsMapper, Goods> implements GoodsService {

    private final GoodsSkuMapper goodsSkuMapper;
    private final GoodsCategoryMapper goodsCategoryMapper;

    @Override
    public PageResult<GoodsVO> getGoodsList(GoodsQueryDTO query) {
        LambdaQueryWrapper<Goods> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Goods::getStatus, 1);

        if (query.getCategoryId() != null) {
            wrapper.eq(Goods::getCategoryId, query.getCategoryId());
        }
        if (StringUtils.hasText(query.getKeyword())) {
            wrapper.like(Goods::getName, query.getKeyword());
        }
        if (query.getIsNew() != null) {
            wrapper.eq(Goods::getIsNew, query.getIsNew());
        }
        if (query.getIsHot() != null) {
            wrapper.eq(Goods::getIsHot, query.getIsHot());
        }
        if (query.getIsRecommend() != null) {
            wrapper.eq(Goods::getIsRecommend, query.getIsRecommend());
        }
        if (query.getIsSeckill() != null) {
            wrapper.eq(Goods::getIsSeckill, query.getIsSeckill());
        }
        if (query.getIsGroup() != null) {
            wrapper.eq(Goods::getIsGroup, query.getIsGroup());
        }
        if (query.getIsDistribution() != null) {
            wrapper.eq(Goods::getIsDistribution, query.getIsDistribution());
        }

        if (StringUtils.hasText(query.getSortField()) && StringUtils.hasText(query.getSortOrder())) {
            boolean isAsc = "asc".equalsIgnoreCase(query.getSortOrder());
            if ("sales".equals(query.getSortField())) {
                wrapper.orderBy(true, isAsc, Goods::getSales);
            } else if ("price".equals(query.getSortField())) {
                wrapper.orderBy(true, isAsc, Goods::getPrice);
            } else if ("sort".equals(query.getSortField())) {
                wrapper.orderBy(true, isAsc, Goods::getSort);
            }
        } else {
            wrapper.orderByDesc(Goods::getSort);
        }

        Page<Goods> page = new Page<>(query.getPageNum(), query.getPageSize());
        page(page, wrapper);

        List<GoodsVO> voList = page.getRecords().stream().map(goods -> {
            GoodsVO vo = new GoodsVO();
            BeanUtils.copyProperties(goods, vo);
            return vo;
        }).collect(Collectors.toList());

        return new PageResult<>(voList, page.getTotal(), query.getPageNum(), query.getPageSize());
    }

    @Override
    public GoodsDetailVO getGoodsDetail(Long id) {
        Goods goods = getById(id);
        if (goods == null) {
            throw new BusinessException(ResultCode.GOODS_NOT_EXIST);
        }

        GoodsDetailVO vo = new GoodsDetailVO();
        BeanUtils.copyProperties(goods, vo);

        if (StringUtils.hasText(goods.getImages())) {
            vo.setImages(Arrays.asList(goods.getImages().split(",")));
        }

        List<GoodsSku> skuList = goodsSkuMapper.selectList(new LambdaQueryWrapper<GoodsSku>()
                .eq(GoodsSku::getGoodsId, id)
                .eq(GoodsSku::getStatus, 1)
                .orderByAsc(GoodsSku::getSort));
        List<GoodsSkuVO> skuVOList = skuList.stream().map(sku -> {
            GoodsSkuVO skuVO = new GoodsSkuVO();
            BeanUtils.copyProperties(sku, skuVO);
            return skuVO;
        }).collect(Collectors.toList());
        vo.setSkuList(skuVOList);

        return vo;
    }

    @Override
    public PageResult<GoodsVO> searchGoods(String keyword, Integer pageNum, Integer pageSize) {
        GoodsQueryDTO query = new GoodsQueryDTO();
        query.setKeyword(keyword);
        query.setPageNum(pageNum);
        query.setPageSize(pageSize);
        return getGoodsList(query);
    }

    @Override
    public PageResult<GoodsVO> getAdminGoodsList(GoodsQueryDTO query) {
        LambdaQueryWrapper<Goods> wrapper = new LambdaQueryWrapper<>();

        if (query.getCategoryId() != null) {
            wrapper.eq(Goods::getCategoryId, query.getCategoryId());
        }
        if (StringUtils.hasText(query.getKeyword())) {
            wrapper.like(Goods::getName, query.getKeyword());
        }
        if (query.getStatus() != null) {
            wrapper.eq(Goods::getStatus, query.getStatus());
        }

        wrapper.orderByDesc(Goods::getId);

        Page<Goods> page = new Page<>(query.getPageNum(), query.getPageSize());
        page(page, wrapper);

        List<GoodsVO> voList = page.getRecords().stream().map(goods -> {
            GoodsVO vo = new GoodsVO();
            BeanUtils.copyProperties(goods, vo);
            return vo;
        }).collect(Collectors.toList());

        List<Long> categoryIds = voList.stream()
                .map(GoodsVO::getCategoryId)
                .filter(id -> id != null)
                .distinct()
                .collect(Collectors.toList());
        if (!categoryIds.isEmpty()) {
            List<GoodsCategory> categories = goodsCategoryMapper.selectBatchIds(categoryIds);
            Map<Long, String> categoryNameMap = categories.stream()
                    .collect(Collectors.toMap(GoodsCategory::getId, GoodsCategory::getName));
            voList.forEach(vo -> {
                if (vo.getCategoryId() != null) {
                    vo.setCategoryName(categoryNameMap.get(vo.getCategoryId()));
                }
            });
        }

        return new PageResult<>(voList, page.getTotal(), query.getPageNum(), query.getPageSize());
    }

    @Override
    public void addGoods(GoodsDTO dto) {
        Goods goods = new Goods();
        BeanUtils.copyProperties(dto, goods);
        if (goods.getStatus() == null) {
            goods.setStatus(1);
        }
        save(goods);
    }

    @Override
    public void updateGoods(GoodsDTO dto) {
        Goods goods = getById(dto.getId());
        if (goods == null) {
            throw new BusinessException(ResultCode.GOODS_NOT_EXIST);
        }
        BeanUtils.copyProperties(dto, goods);
        updateById(goods);
    }

    @Override
    public void deleteGoods(Long id) {
        Goods goods = getById(id);
        if (goods == null) {
            throw new BusinessException(ResultCode.GOODS_NOT_EXIST);
        }
        removeById(id);
    }

}
