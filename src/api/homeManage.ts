import request from '@/utils/request'
import type { PageParams, PageResult } from './goods'

export interface BannerItem {
  id: number
  title: string
  image: string
  linkType: number
  linkUrl: string
  goodsId: number
  sort: number
  status: number
  createTime: string
}

export interface NavItem {
  id: number
  name: string
  icon: string
  linkType: number
  linkUrl: string
  categoryId: number
  sort: number
  status: number
  createTime: string
}

export interface BannerQueryParams extends PageParams {
  title?: string
  status?: number
}

export interface NavQueryParams extends PageParams {
  name?: string
  status?: number
}

export const homeManageApi = {
  getBannerList: (params: BannerQueryParams) => {
    return request<PageResult<BannerItem>>({
      url: '/admin/home/banner-list',
      method: 'get',
      params,
    })
  },

  addBanner: (data: Partial<BannerItem>) => {
    return request({
      url: '/admin/home/banner',
      method: 'post',
      data,
    })
  },

  updateBanner: (data: Partial<BannerItem>) => {
    return request({
      url: '/admin/home/banner',
      method: 'put',
      data,
    })
  },

  deleteBanner: (id: number) => {
    return request({
      url: `/admin/home/banner/${id}`,
      method: 'delete',
    })
  },

  getNavList: (params: NavQueryParams) => {
    return request<PageResult<NavItem>>({
      url: '/admin/home/nav-list',
      method: 'get',
      params,
    })
  },

  addNav: (data: Partial<NavItem>) => {
    return request({
      url: '/admin/home/nav',
      method: 'post',
      data,
    })
  },

  updateNav: (data: Partial<NavItem>) => {
    return request({
      url: '/admin/home/nav',
      method: 'put',
      data,
    })
  },

  deleteNav: (id: number) => {
    return request({
      url: `/admin/home/nav/${id}`,
      method: 'delete',
    })
  },
}
