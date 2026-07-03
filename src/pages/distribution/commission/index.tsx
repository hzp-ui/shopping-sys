import { useState, useEffect } from 'react'
import { Table, Button, Space, Input, Tag, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { distributionApi, type CommissionRecordItem } from '@/api/distribution'

function CommissionList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<CommissionRecordItem[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [searchText, setSearchText] = useState('')

  const typeMap: Record<number, { text: string; color: string }> = {
    1: { text: '订单佣金', color: 'green' },
    2: { text: '提现', color: 'red' },
    3: { text: '结算', color: 'blue' },
  }

  const loadData = async (page = 1, pageSize = 10, keyword = '') => {
    setLoading(true)
    try {
      const res = await distributionApi.getCommissionList({
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
      console.error('获取佣金明细失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const columns: ColumnsType<CommissionRecordItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '分销员',
      dataIndex: 'distributorName',
      key: 'distributorName',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: number) => (
        <Tag color={typeMap[type]?.color}>{typeMap[type]?.text}</Tag>
      ),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (val: number, record: CommissionRecordItem) => (
        <span style={{ color: record.type === 2 ? '#ff4d4f' : '#52c41a' }}>
          {record.type === 2 ? '-' : '+'}¥{val.toFixed(2)}
        </span>
      ),
    },
    {
      title: '关联订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 180,
      render: (val: string) => val || '-',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      render: (val: string) => val || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
  ]

  const handleSearch = () => {
    loadData(1, pagination.pageSize, searchText)
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
        <Input
          placeholder="请输入分销员/订单号"
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

export default CommissionList
