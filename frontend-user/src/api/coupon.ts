import { get, post } from '@/utils/request'

export interface CouponItem {
  id: number
  name: string
  type: number
  value: number
  minAmount: number
  startTime: string
  endTime: string
  status: number
}

export const getCouponListApi = () => {
  return get<CouponItem[]>('/coupon/list')
}

export const receiveCouponApi = (id: number) => {
  return post(`/coupon/receive/${id}`)
}

export const getUserCouponListApi = (status?: number) => {
  return get<CouponItem[]>('/user/coupon/list', { status })
}
