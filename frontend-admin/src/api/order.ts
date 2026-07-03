import request from '@/utils/request'
import type { PageParams, PageResult } from './goods'

export interface Order {
  id: number
  orderNo: string
  userId: number
  username?: string
  totalAmount: number
  payAmount: number
  status: number
  statusText?: string
  createTime?: string
  payTime?: string
  deliveryTime?: string
  finishTime?: string
}

export interface OrderQueryParams extends PageParams {
  orderNo?: string
  status?: number
}

export const orderApi = {
  getOrderList: (params: OrderQueryParams) => {
    return request<PageResult<Order>>({
      url: '/admin/order/list',
      method: 'get',
      params,
    })
  },

  getOrderDetail: (id: number) => {
    return request<Order>({
      url: `/admin/order/${id}`,
      method: 'get',
    })
  },

  shipOrder: (id: number) => {
    return request({
      url: `/admin/order/ship/${id}`,
      method: 'post',
    })
  },
}
