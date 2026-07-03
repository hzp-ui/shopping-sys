import request from '@/utils/request'
import type { PageParams, PageResult } from './goods'

export interface User {
  id: number
  username: string
  nickname: string
  phone?: string
  email?: string
  avatar?: string
  status: number
  createTime?: string
}

export interface UserQueryParams extends PageParams {
  username?: string
  status?: number
}

export const userManageApi = {
  getUserList: (params: UserQueryParams) => {
    return request<PageResult<User>>({
      url: '/admin/user/list',
      method: 'get',
      params,
    })
  },

  updateUserStatus: (id: number, status: number) => {
    return request({
      url: `/admin/user/${id}/status`,
      method: 'put',
      data: { status },
    })
  },
}
