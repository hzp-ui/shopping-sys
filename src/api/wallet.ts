import request from '@/utils/request'
import type { PageParams, PageResult } from './goods'

export interface UserWalletItem {
  id: number
  userId: number
  userName: string
  balance: number
  totalIncome: number
  totalWithdraw: number
  updateTime: string
}

export interface WalletWithdrawItem {
  id: number
  userId: number
  userName: string
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

export interface UserWalletQueryParams extends PageParams {
  userName?: string
}

export interface WalletWithdrawQueryParams extends PageParams {
  userName?: string
  status?: number
}

export const walletApi = {
  getBalanceList: (params: UserWalletQueryParams) => {
    return request<PageResult<UserWalletItem>>({
      url: '/admin/wallet/balance-list',
      method: 'get',
      params,
    })
  },

  adjustUserBalance: (userId: number, amount: number, type: number, remark?: string) => {
    return request({
      url: '/admin/wallet/adjust',
      method: 'put',
      data: { userId, amount, type, remark },
    })
  },

  getWalletWithdrawList: (params: WalletWithdrawQueryParams) => {
    return request<PageResult<WalletWithdrawItem>>({
      url: '/admin/wallet/withdraw-list',
      method: 'get',
      params,
    })
  },

  auditWalletWithdraw: (id: number, status: number, remark?: string) => {
    return request({
      url: `/admin/wallet/withdraw/${id}/audit`,
      method: 'put',
      data: { status, remark },
    })
  },
}
