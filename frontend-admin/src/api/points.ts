import request from '@/utils/request'
import type { PageParams, PageResult } from './goods'

export interface PointsRecordItem {
  id: number
  userId: number
  userName: string
  points: number
  type: number
  source: string
  desc: string
  createTime: string
}

export interface PointsRule {
  id?: number
  consumePerYuan: number
  signInPoints: number
  expireDays: number
}

export interface PointsRecordQueryParams extends PageParams {
  userName?: string
  type?: number
}

export const pointsApi = {
  getPointsRecordList: (params: PointsRecordQueryParams) => {
    return request<PageResult<PointsRecordItem>>({
      url: '/admin/points/record-list',
      method: 'get',
      params,
    })
  },

  getPointsRuleList: () => {
    return request<PointsRule[]>({
      url: '/admin/points/rule-list',
      method: 'get',
    })
  },

  updatePointsRule: (data: PointsRule) => {
    return request({
      url: '/admin/points/rule',
      method: 'put',
      data,
    })
  },
}
