import { Navigate, type RouteObject } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import BlankLayout from '@/layouts/BlankLayout'
import Login from '@/pages/login'
import Dashboard from '@/pages/dashboard'
import GoodsList from '@/pages/goods/list'
import GoodsCategory from '@/pages/goods/category'
import OrderList from '@/pages/order/list'
import UserList from '@/pages/user/list'
import PointsRecord from '@/pages/points/record'
import PointsRule from '@/pages/points/rule'
import CouponList from '@/pages/marketing/coupon'
import SeckillList from '@/pages/marketing/seckill'
import BannerList from '@/pages/home/banner'
import NavList from '@/pages/home/nav'
import StoreList from '@/pages/store/list'
import StoreApply from '@/pages/store/apply'
import StoreVerify from '@/pages/store/verify'
import InvoiceList from '@/pages/invoice/list'
import DistributorList from '@/pages/distribution/distributor'
import DistributionOrderList from '@/pages/distribution/order'
import CommissionList from '@/pages/distribution/commission'
import DistributionWithdrawList from '@/pages/distribution/withdraw'
import RefundList from '@/pages/refund/list'
import BalanceList from '@/pages/wallet/balance'
import WithdrawList from '@/pages/wallet/withdraw'

// 路由配置
const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: (
      <BlankLayout>
        <Login />
      </BlankLayout>
    ),
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'goods/list',
        element: <GoodsList />,
      },
      {
        path: 'goods/category',
        element: <GoodsCategory />,
      },
      {
        path: 'order/list',
        element: <OrderList />,
      },
      {
        path: 'user/list',
        element: <UserList />,
      },
      {
        path: 'points/record',
        element: <PointsRecord />,
      },
      {
        path: 'points/rule',
        element: <PointsRule />,
      },
      {
        path: 'marketing/coupon',
        element: <CouponList />,
      },
      {
        path: 'marketing/seckill',
        element: <SeckillList />,
      },
      {
        path: 'home/banner',
        element: <BannerList />,
      },
      {
        path: 'home/nav',
        element: <NavList />,
      },
      {
        path: 'store/list',
        element: <StoreList />,
      },
      {
        path: 'store/apply',
        element: <StoreApply />,
      },
      {
        path: 'store/verify',
        element: <StoreVerify />,
      },
      {
        path: 'invoice/list',
        element: <InvoiceList />,
      },
      {
        path: 'refund/list',
        element: <RefundList />,
      },
      {
        path: 'wallet/balance',
        element: <BalanceList />,
      },
      {
        path: 'wallet/withdraw',
        element: <WithdrawList />,
      },
      {
        path: 'distribution/distributor',
        element: <DistributorList />,
      },
      {
        path: 'distribution/order',
        element: <DistributionOrderList />,
      },
      {
        path: 'distribution/commission',
        element: <CommissionList />,
      },
      {
        path: 'distribution/withdraw',
        element: <DistributionWithdrawList />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]

export default routes
