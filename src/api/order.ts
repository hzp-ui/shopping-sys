import { get, post } from '@/utils/request'

export interface OrderItem {
  id: number
  orderNo: string
  status: number
  totalPrice: number
  totalCount: number
  createTime: string
  goodsList: OrderGoods[]
}

export interface OrderGoods {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  spec: string
}

export interface CreateOrderParams {
  addressId: number
  goodsList: { goodsId: number; specId: number; quantity: number }[]
  remark?: string
}

export const getOrderListApi = (params: { page?: number; pageSize?: number; status?: number }) => {
  return get<{ list: OrderItem[]; total: number }>('/order/list', params)
}

export const getOrderDetailApi = (id: number) => {
  return get<OrderItem>(`/order/detail/${id}`)
}

export const createOrderApi = (data: CreateOrderParams) => {
  return post<{ orderId: number; orderNo: string }>('/order/create', data)
}

export const cancelOrderApi = (id: number) => {
  return post(`/order/cancel/${id}`)
}

export const confirmReceiveApi = (id: number) => {
  return post(`/order/confirm/${id}`)
}

export const payOrderApi = (id: number) => {
  return post<{ payUrl: string }>(`/order/pay/${id}`)
}
