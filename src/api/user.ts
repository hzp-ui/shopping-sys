import { get, post } from '@/utils/request'

export interface LoginParams {
  phone: string
  password: string
  code?: string
}

export interface RegisterParams {
  phone: string
  password: string
  code: string
}

export interface UserInfo {
  id: number
  phone: string
  nickname: string
  avatar: string
  gender?: number
  birthday?: string
  bio?: string
}

export const loginApi = (data: LoginParams) => {
  return post<UserInfo>('/user/login', data)
}

export const registerApi = (data: RegisterParams) => {
  return post<UserInfo>('/user/register', data)
}

export const sendCodeApi = (phone: string) => {
  return get('/user/sendCode', { phone })
}

export const getUserInfoApi = () => {
  return get<UserInfo>('/user/info')
}

export const updateUserInfoApi = (data: Partial<UserInfo>) => {
  return post<UserInfo>('/user/update', data)
}

export const logoutApi = () => {
  return post('/user/logout')
}
