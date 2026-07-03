import request from '@/utils/request'
import type { PageParams, PageResult } from './goods'

export interface InvoiceItem {
  id: number
  orderId: number
  orderNo: string
  userId: number
  userName: string
  type: number
  title: string
  taxNo: string
  amount: number
  status: number
  applyTime: string
  openTime: string
  remark: string
}

export interface InvoiceQueryParams extends PageParams {
  orderNo?: string
  userName?: string
  status?: number
}

export const invoiceApi = {
  getInvoiceList: (params: InvoiceQueryParams) => {
    return request<PageResult<InvoiceItem>>({
      url: '/admin/invoice/list',
      method: 'get',
      params,
    })
  },

  updateInvoiceStatus: (id: number, status: number, remark?: string) => {
    return request({
      url: `/admin/invoice/${id}/status`,
      method: 'put',
      data: { status, remark },
    })
  },
}
