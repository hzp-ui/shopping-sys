import { useState, useEffect } from 'react'
import { Table, Button, Space, Input, Tag, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { pointsApi, type PointsRecordItem } from '@/api/points'

function PointsRecordList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<PointsRecordItem[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [searchText, setSearchText] = useState('')
  const [typeFilter, setTypeFilter] = useState<number | undefined>()

  const typeMap: Record<number, { text: string; color: string }> = {
    1: { text: '获得', color: 'green' },
    2: { text: '消耗', color: 'red' },
  }

  const loadData = async (page = 1, pageSize = 10, userName = '', type?: number) => {
    setLoading(true)
    try {
      const res = await pointsApi.getPointsRecordList({
        pageNum: page,
        pageSize,
        userName,
        type,
      })
      setData(res.list)
      setPagination({
        current: res.pageNum,
        pageSize: res.pageSize,
        total: res.total,
      })
    } catch (error) {
      console.error('获取积分记录失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const columns: ColumnsType<PointsRecordItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户',
      dataIndex: 'userName',
      key: 'userName',
      width: 150,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: number) => (
        <Tag color={typeMap[type]?.color}>{typeMap[type]?.text}</Tag>
      ),
    },
    {
      title: '积分',
      dataIndex: 'points',
      key: 'points',
      width: 120,
      render: (val: number, record: PointsRecordItem) => (
        <span style={{ color: record.type === 1 ? '#52c41a' : '#ff4d4f' }}>
          {record.type === 1 ? '+' : '-'}{val}
        </span>
      ),
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 150,
    },
    {
      title: '描述',
      dataIndex: 'desc',
      key: 'desc',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
  ]

  const handleSearch = () => {
    loadData(1, pagination.pageSize, searchText, typeFilter)
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <Input
          placeholder="请输入用户名"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
          onPressEnter={handleSearch}
        />
        <Select
          placeholder="类型"
          value={typeFilter}
          onChange={setTypeFilter}
          style={{ width: 120 }}
          allowClear
        >
          <Select.Option value={1}>获得</Select.Option>
          <Select.Option value={2}>消耗</Select.Option>
        </Select>
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
          onChange: (page, pageSize) => loadData(page, pageSize, searchText, typeFilter),
        }}
      />
    </div>
  )
}

export default PointsRecordList
