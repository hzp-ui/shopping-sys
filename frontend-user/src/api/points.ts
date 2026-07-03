import { get } from '@/utils/request'

export interface PointsRecord {
  id: number
  points: number
  type: number
  source: string
  desc: string
  createTime: string
}

export const getPointsRecordsApi = (params?: { type?: number; page?: number; pageSize?: number }) => {
  return get<{ list: PointsRecord[]; total: number }>('/points/records', params)
}
