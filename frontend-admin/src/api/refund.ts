import request from '@/utils/request'
import type { PageParams, PageResult } from './goods'

export interface RefundItem {
  id: number
  refundNo: string
  orderId: number
  orderNo: string
  userId: number
  userName: string
  type: number
  amount: number
  reason: string
  status: number
  applyTime: string
  handleTime: string
  handleRemark: string
  goodsName: string
  goodsImage: string
}

export interface RefundQueryParams extends PageParams {
  orderNo?: string
  userName?: string
  status?: number
}

export const refundApi = {
  getRefundList: (params: RefundQueryParams) => {
    return request<PageResult<RefundItem>>({
      url: '/admin/refund/list',
      method: 'get',
      params,
    })
  },

  auditRefund: (id: number, status: number, remark?: string) => {
    return request({
      url: `/admin/refund/${id}/audit`,
      method: 'put',
      data: { status, remark },
    })
  },
}
