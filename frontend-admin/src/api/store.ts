import request from '@/utils/request'
import type { PageParams, PageResult } from './goods'

export interface StoreItem {
  id: number
  name: string
  address: string
  phone: string
  businessHours: string
  image: string
  status: number
  createTime: string
}

export interface StoreVerifyItem {
  id: number
  verifyCode: string
  orderNo: string
  storeId: number
  storeName: string
  verifierId: number
  verifierName: string
  createTime: string
}

export interface StoreQueryParams extends PageParams {
  name?: string
  status?: number
}

export interface StoreVerifyQueryParams extends PageParams {
  verifyCode?: string
  storeId?: number
}

export const storeApi = {
  getStoreList: (params: StoreQueryParams) => {
    return request<PageResult<StoreItem>>({
      url: '/admin/store/list',
      method: 'get',
      params,
    })
  },

  updateStoreStatus: (id: number, status: number) => {
    return request({
      url: `/admin/store/${id}/status`,
      method: 'put',
      data: { status },
    })
  },

  getStoreVerifyList: (params: StoreVerifyQueryParams) => {
    return request<PageResult<StoreVerifyItem>>({
      url: '/admin/store/verify-list',
      method: 'get',
      params,
    })
  },

  auditStoreVerify: (id: number, status: number, remark?: string) => {
    return request({
      url: `/admin/store/verify/${id}`,
      method: 'put',
      data: { status, remark },
    })
  },

  auditStore: (id: number, status: number, remark?: string) => {
    return request({
      url: `/admin/store/verify/${id}`,
      method: 'put',
      data: { status, remark },
    })
  },
}
