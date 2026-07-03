import { get } from '@/utils/request'

export interface CategoryItem {
  id: number
  parentId: number
  name: string
  icon: string
  sort: number
  children?: CategoryItem[]
}

export const getCategoryTreeApi = () => {
  return get<CategoryItem[]>('/category/tree')
}

export const getCategoryListApi = (parentId?: number) => {
  return get<CategoryItem[]>('/category/list', { parentId })
}
