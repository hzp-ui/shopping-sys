import { get, post } from '@/utils/request'

export interface WalletInfo {
  balance: number
  totalIncome: number
  totalWithdraw: number
}

export interface WalletRecord {
  id: number
  type: number
  amount: number
  desc: string
  createTime: string
  status: number
}

export interface WithdrawRecord {
  id: number
  amount: number
  fee: number
  actualAmount: number
  method: number
  account: string
  status: number
  applyTime: string
  auditTime?: string
  remark?: string
}

export const getWalletInfoApi = () => {
  return get<WalletInfo>('/wallet/info')
}

export const getWalletRecordsApi = (params?: { type?: number; page?: number; pageSize?: number }) => {
  return get<{ list: WalletRecord[]; total: number }>('/wallet/records', params)
}

export const getWithdrawRecordsApi = (params?: { status?: number; page?: number; pageSize?: number }) => {
  return get<{ list: WithdrawRecord[]; total: number }>('/wallet/withdraw/list', params)
}

export const applyWithdrawApi = (data: { amount: number; method: number; account: string; accountName?: string }) => {
  return post('/wallet/withdraw/apply', data)
}
