import { get, post, put } from '@/utils/request'

export interface LoginParams {
  phone: string
  password: string
}

export interface RegisterParams {
  phone: string
  password: string
  code: string
  inviteCode?: string
}

export interface SendCodeParams {
  phone: string
  type: string
}

export interface UserInfo {
  id: number
  phone: string
  nickname: string
  avatar: string
  gender?: number
  birthday?: string
  province?: string
  city?: string
  district?: string
  address?: string
  status?: number
  level?: number
  balance?: string
  points?: number
  inviteCode?: number
}

export interface LoginResult {
  token: string
  userId: number
}

export const loginApi = (data: LoginParams) => {
  return post<LoginResult>('/user/login', data)
}

export const registerApi = (data: RegisterParams) => {
  return post<LoginResult>('/user/register', data)
}

export const sendCodeApi = (data: SendCodeParams) => {
  return post('/user/sms-code', data)
}

export const getUserInfoApi = () => {
  return get<UserInfo>('/user/info')
}

export const updateUserInfoApi = (data: Partial<UserInfo>) => {
  return put('/user/update', data)
}

export const logoutApi = () => {
  return post('/user/logout')
}
