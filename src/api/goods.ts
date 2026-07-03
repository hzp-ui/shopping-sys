import request from '@/utils/request'

export interface PageParams {
  pageNum: number
  pageSize: number
}

export interface PageResult<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}

export interface Goods {
  id: number
  name: string
  categoryId: number
  categoryName?: string
  price: number
  stock: number
  image?: string
  description?: string
  status: number
  createTime?: string
  updateTime?: string
}

export interface GoodsQueryParams extends PageParams {
  name?: string
  categoryId?: number
  status?: number
}

export const goodsApi = {
  getGoodsList: (params: GoodsQueryParams) => {
    return request<PageResult<Goods>>({
      url: '/admin/goods/list',
      method: 'get',
      params,
    })
  },

  addGoods: (data: Partial<Goods>) => {
    return request({
      url: '/admin/goods',
      method: 'post',
      data,
    })
  },

  updateGoods: (data: Partial<Goods>) => {
    return request({
      url: '/admin/goods',
      method: 'put',
      data,
    })
  },

  deleteGoods: (id: number) => {
    return request({
      url: `/admin/goods/${id}`,
      method: 'delete',
    })
  },
}
