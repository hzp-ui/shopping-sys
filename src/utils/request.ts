import { getStorage } from './storage'

const TOKEN_KEY = 'token'

const baseURL = 'http://localhost:8080/api'

export interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
  timeout?: number
}

export interface ResponseData<T = any> {
  code: number
  message: string
  data: T
}

const request = <T = any>(options: RequestOptions): Promise<ResponseData<T>> => {
  return new Promise((resolve, reject) => {
    const token = getStorage<string>(TOKEN_KEY)

    uni.request({
      url: baseURL + options.url,
      method: options.method || 'GET',
      data: options.data,
      timeout: options.timeout || 15000,
      header: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.header
      },
      success: (res: any) => {
        const data = res.data as ResponseData<T>
        if (data.code === 200) {
          resolve(data)
        } else if (data.code === 401) {
          uni.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none'
          })
          uni.navigateTo({ url: '/pages/login/index' })
          reject(data)
        } else {
          uni.showToast({
            title: data.message || '请求失败',
            icon: 'none'
          })
          reject(data)
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '网络请求失败',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

export const get = <T = any>(url: string, data?: any) => {
  return request<T>({ url, method: 'GET', data })
}

export const post = <T = any>(url: string, data?: any) => {
  return request<T>({ url, method: 'POST', data })
}

export const put = <T = any>(url: string, data?: any) => {
  return request<T>({ url, method: 'PUT', data })
}

export const del = <T = any>(url: string, data?: any) => {
  return request<T>({ url, method: 'DELETE', data })
}

export default request
