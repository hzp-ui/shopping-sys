import { get, post, del } from '@/utils/request'

export interface CartItem {
  id: number
  goodsId: number
  name: string
  price: number
  image: string
  spec: string
  quantity: number
  selected: boolean
}

export const getCartListApi = () => {
  return get<CartItem[]>('/cart/list')
}

export const addCartApi = (data: { goodsId: number; specId: number; quantity: number }) => {
  return post('/cart/add', data)
}

export const updateCartApi = (id: number, quantity: number) => {
  return post('/cart/update', { id, quantity })
}

export const deleteCartApi = (ids: number[]) => {
  return del('/cart/delete', { ids })
}
