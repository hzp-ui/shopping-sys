import { useState, useEffect } from 'react'
import { Table, Button, Space, Input, Avatar, Tag, message } from 'antd'
import { SearchOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { distributionApi, type DistributorItem } from '@/api/distribution'

function DistributorList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<DistributorItem[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [searchText, setSearchText] = useState('')

  const statusMap: Record<number, { text: string; color: string }> = {
    0: { text: '禁用', color: 'default' },
    1: { text: '正常', color: 'green' },
  }

  const loadData = async (page = 1, pageSize = 10, keyword = '') => {
    setLoading(true)
    try {
      const res = await distributionApi.getDistributorList({
        pageNum: page,
        pageSize,
        keyword,
      })
      setData(res.list)
      setPagination({
        current: res.pageNum,
        pageSize: res.pageSize,
        total: res.total,
      })
    } catch (error) {
      console.error('获取分销员列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const columns: ColumnsType<DistributorItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar: string) => (
        <Avatar src={avatar} icon={<UserOutlined />} />
      ),
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 140,
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      width: 100,
    },
    {
      title: '累计佣金',
      dataIndex: 'totalCommission',
      key: 'totalCommission',
      width: 120,
      render: (val: number) => `¥${val.toFixed(2)}`,
    },
    {
      title: '可提现佣金',
      dataIndex: 'availableCommission',
      key: 'availableCommission',
      width: 120,
      render: (val: number) => `¥${val.toFixed(2)}`,
    },
    {
      title: '下级人数',
      dataIndex: 'subordinateCount',
      key: 'subordinateCount',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>
      ),
    },
    {
      title: '加入时间',
      dataIndex: 'joinTime',
      key: 'joinTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleDetail(record)}>
            详情
          </Button>
        </Space>
      ),
    },
  ]

  const handleDetail = (record: DistributorItem) => {
    message.info(`查看分销员 ${record.nickname} 详情功能开发中...`)
  }

  const handleSearch = () => {
    loadData(1, pagination.pageSize, searchText)
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
        <Input
          placeholder="请输入昵称/手机号"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
          prefix={<SearchOutlined />}
          onPressEnter={handleSearch}
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          搜索
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => loadData(page, pageSize, searchText),
        }}
      />
    </div>
  )
}

export default DistributorList
