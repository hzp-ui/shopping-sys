import { get } from '@/utils/request'

export interface GoodsItem {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  sales: number
  description?: string
  stock?: number
  images?: string[]
  specs?: GoodsSpec[]
}

export interface GoodsSpec {
  id: number
  name: string
  price: number
  stock: number
}

export interface CategoryItem {
  id: number
  name: string
  icon?: string
  children?: CategoryItem[]
}

export const getGoodsListApi = (params: {
  page?: number
  pageSize?: number
  categoryId?: number
  keyword?: string
}) => {
  return get<{ list: GoodsItem[]; total: number }>('/goods/list', params)
}

export const getGoodsDetailApi = (id: number) => {
  return get<GoodsItem>(`/goods/detail/${id}`)
}

export const getCategoryListApi = () => {
  return get<CategoryItem[]>('/category/list')
}
