import { get } from '@/utils/request'

export interface StoreItem {
  id: number
  name: string
  address: string
  phone: string
  businessHours: string
  image: string
  latitude?: number
  longitude?: number
  distance?: string
}

export const getStoreListApi = (params?: { page?: number; pageSize?: number }) => {
  return get<{ list: StoreItem[]; total: number }>('/store/list', params)
}

export const getStoreDetailApi = (id: number) => {
  return get<StoreItem>(`/store/detail/${id}`)
}
