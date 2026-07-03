import request from '@/utils/request'

// 登录参数
export interface LoginParams {
  username: string
  password: string
}

// 登录返回
export interface LoginResult {
  token: string
  userInfo: {
    id: number
    username: string
    nickname: string
    avatar?: string
  }
}

// 用户相关 API
export const userApi = {
  // 登录
  login: (data: LoginParams) => {
    return request<LoginResult>({
      url: '/admin/login',
      method: 'post',
      data,
    })
  },

  // 获取用户信息
  getUserInfo: () => {
    return request({
      url: '/admin/info',
      method: 'get',
    })
  },

  // 登出
  logout: () => {
    return request({
      url: '/admin/logout',
      method: 'post',
    })
  },
}
