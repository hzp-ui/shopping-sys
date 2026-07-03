import { get } from '@/utils/request'

export interface DistributorInfo {
  userId: number
  nickname: string
  avatar: string
  level: number
  totalCommission: number
  availableCommission: number
  teamCount: number
  todayOrderCount: number
  todayCommission: number
}

export interface DistributionOrder {
  id: number
  orderNo: string
  goodsName: string
  goodsImage: string
  userName: string
  commission: number
  status: number
  createTime: string
}

export interface CommissionRecord {
  id: number
  orderNo: string
  goodsName: string
  commission: number
  status: number
  settleTime?: string
  createTime: string
}

export const getDistributionInfoApi = () => {
  return get<DistributorInfo>('/distribution/info')
}

export const getDistributionOrdersApi = (params?: { status?: number; page?: number; pageSize?: number }) => {
  return get<{ list: DistributionOrder[]; total: number }>('/distribution/orders', params)
}

export const getCommissionRecordsApi = (params?: { status?: number; page?: number; pageSize?: number }) => {
  return get<{ list: CommissionRecord[]; total: number }>('/distribution/commission', params)
}

export const getDistributionGoodsApi = (params?: { page?: number; pageSize?: number }) => {
  return get<{ list: any[]; total: number }>('/distribution/goods', params)
}
