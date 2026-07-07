import { get, post, put, del } from '@/utils/request'

export interface AddressItem {
  id: number
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault: number
}

export const getAddressListApi = () => {
  return get<AddressItem[]>('/user/address/list')
}

export const addAddressApi = (data: Omit<AddressItem, 'id'>) => {
  return post('/user/address', data)
}

export const updateAddressApi = (id: number, data: Partial<AddressItem>) => {
  return put(`/user/address/${id}`, data)
}

export const deleteAddressApi = (id: number) => {
  return del(`/user/address/${id}`)
}

export const setDefaultAddressApi = (id: number) => {
  return post(`/user/address/default/${id}`)
}
