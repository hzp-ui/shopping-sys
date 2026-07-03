import { useState, useEffect } from 'react'
import { Table, Button, Space, Input, Tag, Avatar, message, Modal, Descriptions } from 'antd'
import { SearchOutlined, EyeOutlined, UserOutlined, EnvironmentOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { storeApi, type StoreItem } from '@/api/store'

function StoreList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<StoreItem[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailItem, setDetailItem] = useState<StoreItem | null>(null)
  const [searchText, setSearchText] = useState('')

  const statusMap: Record<number, { text: string; color: string }> = {
    0: { text: '关闭', color: 'default' },
    1: { text: '营业中', color: 'green' },
  }

  const loadData = async (page = 1, pageSize = 10, keyword = '') => {
    setLoading(true)
    try {
      const res = await storeApi.getStoreList({
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
      console.error('获取门店列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const columns: ColumnsType<StoreItem> = [
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
      title: '联系人',
      dataIndex: 'contact',
      key: 'contact',
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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
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

  const handleDetail = (record: StoreItem) => {
    setDetailItem(record)
    setDetailVisible(true)
  }

  const handleSearch = () => {
    loadData(1, pagination.pageSize, searchText)
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
        <Input
          placeholder="请输入门店名称/联系人"
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
            <Descriptions.Item label="联系人">{detailItem.contact}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{detailItem.phone}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusMap[detailItem.status]?.color}>{statusMap[detailItem.status]?.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">{detailItem.createTime}</Descriptions.Item>
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

export default StoreList
