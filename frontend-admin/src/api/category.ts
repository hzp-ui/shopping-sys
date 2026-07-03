import request from '@/utils/request'

export interface Category {
  id: number
  name: string
  parentId: number
  sort: number
  status: number
  createTime?: string
  children?: Category[]
}

export const categoryApi = {
  getCategoryList: () => {
    return request<Category[]>({
      url: '/admin/category/list',
      method: 'get',
    })
  },

  addCategory: (data: Partial<Category>) => {
    return request({
      url: '/admin/category',
      method: 'post',
      data,
    })
  },

  updateCategory: (data: Partial<Category>) => {
    return request({
      url: '/admin/category',
      method: 'put',
      data,
    })
  },

  deleteCategory: (id: number) => {
    return request({
      url: `/admin/category/${id}`,
      method: 'delete',
    })
  },
}
