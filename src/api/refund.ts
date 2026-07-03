import { get, post } from '@/utils/request'

export interface RefundItem {
  id: number
  refundNo: string
  orderId: number
  orderNo: string
  type: number
  amount: number
  reason: string
  status: number
  applyTime: string
  handleTime?: string
  handleRemark?: string
  goodsName: string
  goodsImage: string
}

export const getRefundListApi = (params?: { status?: number; page?: number; pageSize?: number }) => {
  return get<{ list: RefundItem[]; total: number }>('/refund/list', params)
}

export const applyRefundApi = (data: { orderId: number; type: number; amount: number; reason: string }) => {
  return post('/refund/apply', data)
}

export const getRefundDetailApi = (id: number) => {
  return get<RefundItem>(`/refund/detail/${id}`)
}
