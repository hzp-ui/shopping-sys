import request from '@/utils/request'
import type { PageParams, PageResult } from './goods'

export interface DistributorItem {
  id: number
  userId: number
  username: string
  nickname: string
  avatar: string
  parentId: number
  parentName: string
  level: number
  totalCommission: number
  availableCommission: number
  status: number
  createTime: string
}

export interface DistributionOrderItem {
  id: number
  orderNo: string
  userId: number
  userName: string
  distributorId: number
  distributorName: string
  goodsName: string
  commission: number
  status: number
  createTime: string
}

export interface CommissionRecordItem {
  id: number
  distributorId: number
  distributorName: string
  orderNo: string
  commission: number
  status: number
  settleTime: string
  createTime: string
}

export interface DistributionWithdrawItem {
  id: number
  distributorId: number
  distributorName: string
  amount: number
  fee: number
  actualAmount: number
  method: number
  account: string
  accountName: string
  status: number
  applyTime: string
  auditTime: string
  auditRemark: string
}

export interface DistributorQueryParams extends PageParams {
  username?: string
  status?: number
}

export interface DistributionOrderQueryParams extends PageParams {
  orderNo?: string
  distributorName?: string
  status?: number
}

export interface CommissionRecordQueryParams extends PageParams {
  distributorName?: string
  status?: number
}

export interface DistributionWithdrawQueryParams extends PageParams {
  distributorName?: string
  status?: number
}

export const distributionApi = {
  getDistributorList: (params: DistributorQueryParams) => {
    return request<PageResult<DistributorItem>>({
      url: '/admin/distribution/distributor-list',
      method: 'get',
      params,
    })
  },

  updateDistributorStatus: (id: number, status: number) => {
    return request({
      url: `/admin/distribution/distributor/${id}/status`,
      method: 'put',
      data: { status },
    })
  },

  getDistributionOrderList: (params: DistributionOrderQueryParams) => {
    return request<PageResult<DistributionOrderItem>>({
      url: '/admin/distribution/order-list',
      method: 'get',
      params,
    })
  },

  getCommissionRecordList: (params: CommissionRecordQueryParams) => {
    return request<PageResult<CommissionRecordItem>>({
      url: '/admin/distribution/commission-list',
      method: 'get',
      params,
    })
  },

  getDistributionWithdrawList: (params: DistributionWithdrawQueryParams) => {
    return request<PageResult<DistributionWithdrawItem>>({
      url: '/admin/distribution/withdraw-list',
      method: 'get',
      params,
    })
  },

  auditDistributionWithdraw: (id: number, status: number, remark?: string) => {
    return request({
      url: `/admin/distribution/withdraw/${id}/audit`,
      method: 'put',
      data: { status, remark },
    })
  },

  getCommissionList: (params: CommissionRecordQueryParams) => {
    return request<PageResult<CommissionRecordItem>>({
      url: '/admin/distribution/commission-list',
      method: 'get',
      params,
    })
  },

  getWithdrawList: (params: DistributionWithdrawQueryParams) => {
    return request<PageResult<DistributionWithdrawItem>>({
      url: '/admin/distribution/withdraw-list',
      method: 'get',
      params,
    })
  },

  auditWithdraw: (id: number, status: number, remark?: string) => {
    return request({
      url: `/admin/distribution/withdraw/${id}/audit`,
      method: 'put',
      data: { status, remark },
    })
  },
}
