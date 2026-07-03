import request from '@/utils/request'
import type { PageParams, PageResult } from './goods'

export interface CouponItem {
  id: number
  name: string
  type: number
  value: number
  minAmount: number
  totalCount: number
  receivedCount: number
  usedCount: number
  startTime: string
  endTime: string
  status: number
  createTime: string
}

export interface SeckillItem {
  id: number
  name: string
  startTime: string
  endTime: string
  goodsCount: number
  status: number
  createTime: string
}

export interface CouponQueryParams extends PageParams {
  name?: string
  status?: number
}

export interface SeckillQueryParams extends PageParams {
  name?: string
  status?: number
}

export const marketingApi = {
  getCouponList: (params: CouponQueryParams) => {
    return request<PageResult<CouponItem>>({
      url: '/admin/coupon/list',
      method: 'get',
      params,
    })
  },

  addCoupon: (data: Partial<CouponItem>) => {
    return request({
      url: '/admin/coupon',
      method: 'post',
      data,
    })
  },

  updateCoupon: (data: Partial<CouponItem>) => {
    return request({
      url: '/admin/coupon',
      method: 'put',
      data,
    })
  },

  deleteCoupon: (id: number) => {
    return request({
      url: `/admin/coupon/${id}`,
      method: 'delete',
    })
  },

  getSeckillList: (params: SeckillQueryParams) => {
    return request<PageResult<SeckillItem>>({
      url: '/admin/seckill/list',
      method: 'get',
      params,
    })
  },

  addSeckill: (data: Partial<SeckillItem>) => {
    return request({
      url: '/admin/seckill',
      method: 'post',
      data,
    })
  },

  updateSeckill: (data: Partial<SeckillItem>) => {
    return request({
      url: '/admin/seckill',
      method: 'put',
      data,
    })
  },

  deleteSeckill: (id: number) => {
    return request({
      url: `/admin/seckill/${id}`,
      method: 'delete',
    })
  },
}
