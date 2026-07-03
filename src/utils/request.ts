import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { message } from 'antd'
import { useUserStore } from '@/stores/userStore'

// 请求配置
const service: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const { token } = useUserStore.getState()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    if (res.code !== 200) {
      message.error(res.message || '请求失败')
      if (res.code === 401) {
        useUserStore.getState().logout()
        window.location.href = '/login'
      }
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res.data
  },
  (error) => {
    message.error(error.message || '网络错误')
    return Promise.reject(error)
  },
)

// 封装请求方法
export function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  return service.request<any, T>(config)
}

export default service
