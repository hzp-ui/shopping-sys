import { get } from '@/utils/request'
import type { GoodsItem } from './goods'

export interface BannerItem {
  id: number
  title: string
  image: string
  linkType: string
  linkUrl: string
  goodsId: number
}

export interface NavItem {
  id: number
  name: string
  icon: string
  linkType: string
  linkUrl: string
  categoryId: number
}

export const getBannerListApi = () => {
  return get<BannerItem[]>('/home/banner')
}

export const getNavListApi = () => {
  return get<NavItem[]>('/home/nav')
}

export const getRecommendProductsApi = () => {
  return get<GoodsItem[]>('/home/recommend-products')
}

export const getSeckillProductsApi = () => {
  return get<GoodsItem[]>('/home/seckill-products')
}
