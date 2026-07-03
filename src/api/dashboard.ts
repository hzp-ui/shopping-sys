import request from '@/utils/request'

export interface DashboardStats {
  todayVisits: number
  todayOrders: number
  todaySales: number
  todayNewUsers: number
  totalVisits: number
  totalOrders: number
  totalSales: number
  totalUsers: number
}

export const dashboardApi = {
  getStats: () => {
    return request<DashboardStats>({
      url: '/admin/dashboard/stats',
      method: 'get',
    })
  },
}
