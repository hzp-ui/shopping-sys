import { useState, useEffect } from 'react'
import { Table, Button, Space, Input, Tag, Avatar, message, Modal, Descriptions } from 'antd'
import { SearchOutlined, CheckOutlined, CloseOutlined, UserOutlined, EnvironmentOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { storeApi, type StoreVerifyItem } from '@/api/store'

function StoreVerifyList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<StoreVerifyItem[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailItem, setDetailItem] = useState<StoreVerifyItem | null>(null)
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
      const res = await storeApi.getStoreVerifyList({
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
      console.error('获取门店审核列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const columns: ColumnsType<StoreVerifyItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '门店logo',
      dataIndex: 'logo',
      key: 'logo',
      width: 80,
      render: (logo: string) => (
        <Avatar src={logo} icon={<UserOutlined />} shape="square" />
      ),
    },
    {
      title: '门店名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
      key: 'applicant',
      width: 120,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 140,
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: '审核状态',
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
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => handleDetail(record)}>
            详情
          </Button>
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

  const handleDetail = (record: StoreVerifyItem) => {
    setDetailItem(record)
    setDetailVisible(true)
  }

  const handleAudit = (record: StoreVerifyItem, status: number) => {
    Modal.confirm({
      title: status === 1 ? '确认通过' : '确认拒绝',
      content: `确定要${status === 1 ? '通过' : '拒绝'}该门店入驻申请吗？`,
      onOk: async () => {
        try {
          await storeApi.auditStore(record.id, status)
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
          placeholder="请输入门店名称/申请人"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
          onPressEnter={handleSearch}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value ? Number(e.target.value) : undefined)}
          style={{ padding: '4px 11px', borderRadius: 6, border: '1px solid #d9d9d9', width: 120 }}
        >
          <option value="">全部状态</option>
          <option value="0">待审核</option>
          <option value="1">审核通过</option>
          <option value="2">审核拒绝</option>
        </select>
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

      <Modal
        title="门店详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {detailItem && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="门店名称" span={2}>
              {detailItem.name}
            </Descriptions.Item>
            <Descriptions.Item label="申请人">{detailItem.applicant}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{detailItem.phone}</Descriptions.Item>
            <Descriptions.Item label="审核状态">
              <Tag color={statusMap[detailItem.status]?.color}>{statusMap[detailItem.status]?.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="申请时间">{detailItem.createTime}</Descriptions.Item>
            <Descriptions.Item label="地址" span={2}>
              <Space>
                <EnvironmentOutlined />
                {detailItem.address}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}

export default StoreVerifyList
