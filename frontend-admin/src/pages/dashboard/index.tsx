import { useState, useEffect } from 'react'
import { Row, Col, Card, Statistic, Space, DatePicker, message } from 'antd'
import {
  EyeOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { dashboardApi, type DashboardStats } from '@/api/dashboard'

const { RangePicker } = DatePicker

function Dashboard() {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    todayVisits: 0,
    todayOrders: 0,
    todaySales: 0,
    todayNewUsers: 0,
    totalVisits: 0,
    totalOrders: 0,
    totalSales: 0,
    totalUsers: 0,
  })

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await dashboardApi.getStats()
      setStats(res)
    } catch (error) {
      console.error('获取统计数据失败:', error)
      message.error('获取统计数据失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div>
      <Space style={{ marginBottom: 24 }}>
        <RangePicker
          style={{ width: 280 }}
        />
      </Space>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="今日访问量"
              value={stats.todayVisits}
              prefix={<EyeOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="今日订单数"
              value={stats.todayOrders}
              prefix={<ShoppingCartOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="今日销售额"
              value={stats.todaySales}
              precision={2}
              prefix={<DollarOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="今日新增用户"
              value={stats.todayNewUsers}
              prefix={<UserOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="总访问量" loading={loading}>
            <Statistic
              value={stats.totalVisits}
              prefix={<EyeOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="总订单数" loading={loading}>
            <Statistic
              value={stats.totalOrders}
              prefix={<ShoppingCartOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="总销售额" loading={loading}>
            <Statistic
              value={stats.totalSales}
              precision={2}
              prefix={<DollarOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="总用户数" loading={loading}>
            <Statistic
              value={stats.totalUsers}
              prefix={<UserOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
