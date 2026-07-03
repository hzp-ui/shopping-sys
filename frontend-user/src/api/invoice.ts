import { get, post } from '@/utils/request'

export interface InvoiceItem {
  id: number
  orderId: number
  orderNo: string
  type: number
  title: string
  taxNo?: string
  amount: number
  status: number
  applyTime: string
  openTime?: string
  remark?: string
}

export const getInvoiceListApi = (params?: { status?: number; page?: number; pageSize?: number }) => {
  return get<{ list: InvoiceItem[]; total: number }>('/invoice/list', params)
}

export const applyInvoiceApi = (data: { orderId: number; type: number; title: string; taxNo?: string }) => {
  return post('/invoice/apply', data)
}

export const getInvoiceDetailApi = (id: number) => {
  return get<InvoiceItem>(`/invoice/detail/${id}`)
}
