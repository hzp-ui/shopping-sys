import { useState } from 'react'
import { Layout, Menu, theme, Avatar, Dropdown, Space } from 'antd'
import {
  DashboardOutlined,
  ShoppingOutlined,
  UnorderedListOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
  WalletOutlined,
  ShopOutlined,
  FileTextOutlined,
  TrophyOutlined,
  TagOutlined,
  HomeOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useUserStore } from '@/stores/userStore'
import { userApi } from '@/api/user'
import { message } from 'antd'

const { Header, Sider, Content } = Layout

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()
  const navigate = useNavigate()
  const location = useLocation()
  const { userInfo, logout } = useUserStore()

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '控制台',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: '/goods',
      icon: <ShoppingOutlined />,
      label: '商品管理',
      children: [
        {
          key: '/goods/list',
          label: '商品列表',
          onClick: () => navigate('/goods/list'),
        },
        {
          key: '/goods/category',
          label: '商品分类',
          onClick: () => navigate('/goods/category'),
        },
      ],
    },
    {
      key: '/order/list',
      icon: <UnorderedListOutlined />,
      label: '订单管理',
      onClick: () => navigate('/order/list'),
    },
    {
      key: '/user/list',
      icon: <UserOutlined />,
      label: '用户管理',
      onClick: () => navigate('/user/list'),
    },
    {
      key: '/points',
      icon: <TrophyOutlined />,
      label: '积分管理',
      children: [
        {
          key: '/points/record',
          label: '积分记录',
          onClick: () => navigate('/points/record'),
        },
        {
          key: '/points/rule',
          label: '积分规则',
          onClick: () => navigate('/points/rule'),
        },
      ],
    },
    {
      key: '/marketing',
      icon: <TagOutlined />,
      label: '营销管理',
      children: [
        {
          key: '/marketing/coupon',
          label: '优惠券管理',
          onClick: () => navigate('/marketing/coupon'),
        },
        {
          key: '/marketing/seckill',
          label: '秒杀活动',
          onClick: () => navigate('/marketing/seckill'),
        },
      ],
    },
    {
      key: '/home',
      icon: <HomeOutlined />,
      label: '首页管理',
      children: [
        {
          key: '/home/banner',
          label: 'Banner管理',
          onClick: () => navigate('/home/banner'),
        },
        {
          key: '/home/nav',
          label: '导航管理',
          onClick: () => navigate('/home/nav'),
        },
      ],
    },
    {
      key: '/refund',
      icon: <ExclamationCircleOutlined />,
      label: '售后管理',
      children: [
        {
          key: '/refund/list',
          label: '退款管理',
          onClick: () => navigate('/refund/list'),
        },
      ],
    },
    {
      key: '/wallet',
      icon: <WalletOutlined />,
      label: '钱包管理',
      children: [
        {
          key: '/wallet/balance',
          label: '余额管理',
          onClick: () => navigate('/wallet/balance'),
        },
        {
          key: '/wallet/withdraw',
          label: '提现管理',
          onClick: () => navigate('/wallet/withdraw'),
        },
      ],
    },
    {
      key: '/store',
      icon: <ShopOutlined />,
      label: '门店管理',
      children: [
        {
          key: '/store/list',
          label: '门店列表',
          onClick: () => navigate('/store/list'),
        },
        {
          key: '/store/apply',
          label: '门店申请',
          onClick: () => navigate('/store/apply'),
        },
        {
          key: '/store/verify',
          label: '核销记录',
          onClick: () => navigate('/store/verify'),
        },
      ],
    },
    {
      key: '/invoice',
      icon: <FileTextOutlined />,
      label: '发票管理',
      children: [
        {
          key: '/invoice/list',
          label: '发票申请',
          onClick: () => navigate('/invoice/list'),
        },
      ],
    },
    {
      key: '/distribution',
      icon: <TeamOutlined />,
      label: '分销管理',
      children: [
        {
          key: '/distribution/distributor',
          label: '分销员管理',
          onClick: () => navigate('/distribution/distributor'),
        },
        {
          key: '/distribution/order',
          label: '分销订单',
          onClick: () => navigate('/distribution/order'),
        },
        {
          key: '/distribution/commission',
          label: '佣金明细',
          onClick: () => navigate('/distribution/commission'),
        },
        {
          key: '/distribution/withdraw',
          label: '提现管理',
          onClick: () => navigate('/distribution/withdraw'),
        },
      ],
    },
  ]

  const userMenuItems = [
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '个人设置',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: async () => {
        try {
          await userApi.logout()
        } catch (e) {
          console.error('退出登录失败:', e)
        }
        logout()
        message.success('已退出登录')
        navigate('/login')
      },
    },
  ]

  const getSelectedKeys = () => {
    const pathname = location.pathname
    if (
      pathname.startsWith('/goods') ||
      pathname.startsWith('/refund') ||
      pathname.startsWith('/wallet') ||
      pathname.startsWith('/store') ||
      pathname.startsWith('/invoice') ||
      pathname.startsWith('/distribution') ||
      pathname.startsWith('/points') ||
      pathname.startsWith('/marketing') ||
      pathname.startsWith('/home')
    ) {
      return [pathname]
    }
    return [pathname]
  }

  const getOpenKeys = () => {
    const pathname = location.pathname
    if (pathname.startsWith('/goods')) {
      return ['/goods']
    }
    if (pathname.startsWith('/refund')) {
      return ['/refund']
    }
    if (pathname.startsWith('/wallet')) {
      return ['/wallet']
    }
    if (pathname.startsWith('/store')) {
      return ['/store']
    }
    if (pathname.startsWith('/invoice')) {
      return ['/invoice']
    }
    if (pathname.startsWith('/points')) {
      return ['/points']
    }
    if (pathname.startsWith('/marketing')) {
      return ['/marketing']
    }
    if (pathname.startsWith('/home')) {
      return ['/home']
    }
    if (pathname.startsWith('/distribution')) {
      return ['/distribution']
    }
    return []
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
        <div
          style={{
            height: 64,
            margin: 16,
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: collapsed ? 14 : 18,
            fontWeight: 'bold',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {collapsed ? '匹诺' : '匹诺商城管理系统'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 16px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {collapsed ? (
            <MenuUnfoldOutlined
              style={{ fontSize: 20, cursor: 'pointer' }}
              onClick={() => setCollapsed(!collapsed)}
            />
          ) : (
            <MenuFoldOutlined
              style={{ fontSize: 20, cursor: 'pointer' }}
              onClick={() => setCollapsed(!collapsed)}
            />
          )}
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar src={userInfo?.avatar} icon={<UserOutlined />} />
              <span>{userInfo?.nickname || '管理员'}</span>
            </Space>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: 24,
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
