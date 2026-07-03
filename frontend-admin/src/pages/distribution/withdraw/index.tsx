import { useState, useEffect } from 'react'
import { Table, Button, Space, Input, Tag, message, Modal, Select } from 'antd'
import { SearchOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { distributionApi, type WithdrawRecordItem } from '@/api/distribution'

function WithdrawList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<WithdrawRecordItem[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<number | undefined>()

  const statusMap: Record<number, { text: string; color: string }> = {
    0: { text: '待审核', color: 'orange' },
    1: { text: '审核通过', color: 'green' },
    2: { text: '审核拒绝', color: 'red' },
  }

  const loadData = async (page = 1, pageSize = 10, keyword = '', status?: number) => {
    setLoading(true)
    try {
      const res = await distributionApi.getWithdrawList({
        pageNum: page,
        pageSize,
        keyword,
        status,
      })
      setData(res.list)
      setPagination({
        current: res.pageNum,
        pageSize: res.pageSize,
        total: res.total,
      })
    } catch (error) {
      console.error('获取提现记录失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const columns: ColumnsType<WithdrawRecordItem> = [
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
      title: '提现金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (val: number) => `¥${val.toFixed(2)}`,
    },
    {
      title: '提现方式',
      dataIndex: 'withdrawType',
      key: 'withdrawType',
      width: 120,
    },
    {
      title: '收款账号',
      dataIndex: 'account',
      key: 'account',
      width: 200,
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
      title: '申请时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          {record.status === 0 && (
            <>
              <Button type="link" size="small" icon={<CheckOutlined />} onClick={() => handleAudit(record, 1)}>
                通过
              </Button>
              <Button type="link" size="small" danger icon={<CloseOutlined />} onClick={() => handleAudit(record, 2)}>
                拒绝
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ]

  const handleAudit = (record: WithdrawRecordItem, status: number) => {
    Modal.confirm({
      title: status === 1 ? '确认通过' : '确认拒绝',
      content: `确定要${status === 1 ? '通过' : '拒绝'}该提现申请吗？`,
      onOk: async () => {
        try {
          await distributionApi.auditWithdraw(record.id, status)
          message.success(status === 1 ? '审核通过' : '审核拒绝')
          loadData(pagination.current, pagination.pageSize, searchText, statusFilter)
        } catch (error) {
          console.error('审核失败:', error)
        }
      },
    })
  }

  const handleSearch = () => {
    loadData(1, pagination.pageSize, searchText, statusFilter)
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <Input
          placeholder="请输入分销员"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
          onPressEnter={handleSearch}
        />
        <Select
          placeholder="状态"
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 120 }}
          allowClear
        >
          <Select.Option value={0}>待审核</Select.Option>
          <Select.Option value={1}>审核通过</Select.Option>
          <Select.Option value={2}>审核拒绝</Select.Option>
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
          onChange: (page, pageSize) => loadData(page, pageSize, searchText, statusFilter),
        }}
      />
    </div>
  )
}

export default WithdrawList
