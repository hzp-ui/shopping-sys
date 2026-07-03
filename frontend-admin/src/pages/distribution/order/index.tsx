import { useState, useEffect } from 'react'
import { Table, Button, Space, Input, Tag, message, Modal, Descriptions } from 'antd'
import { SearchOutlined, EyeOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { distributionApi, type DistributionOrderItem } from '@/api/distribution'

function DistributionOrderList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<DistributionOrderItem[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailItem, setDetailItem] = useState<DistributionOrderItem | null>(null)
  const [searchText, setSearchText] = useState('')

  const statusMap: Record<number, { text: string; color: string }> = {
    0: { text: '待结算', color: 'orange' },
    1: { text: '已结算', color: 'green' },
    2: { text: '已取消', color: 'default' },
  }

  const loadData = async (page = 1, pageSize = 10, keyword = '') => {
    setLoading(true)
    try {
      const res = await distributionApi.getDistributionOrderList({
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
      console.error('获取分销订单列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const columns: ColumnsType<DistributionOrderItem> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 180,
    },
    {
      title: '分销员',
      dataIndex: 'distributorName',
      key: 'distributorName',
    },
    {
      title: '下单用户',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '订单金额',
      dataIndex: 'orderAmount',
      key: 'orderAmount',
      width: 120,
      render: (val: number) => `¥${val.toFixed(2)}`,
    },
    {
      title: '佣金金额',
      dataIndex: 'commissionAmount',
      key: 'commissionAmount',
      width: 120,
      render: (val: number) => `¥${val.toFixed(2)}`,
    },
    {
      title: '佣金比例',
      dataIndex: 'commissionRatio',
      key: 'commissionRatio',
      width: 100,
      render: (val: number) => `${val}%`,
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

  const handleDetail = (record: DistributionOrderItem) => {
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
          placeholder="请输入订单号/分销员"
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
        title="订单详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {detailItem && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="订单号" span={2}>
              {detailItem.orderNo}
            </Descriptions.Item>
            <Descriptions.Item label="分销员">{detailItem.distributorName}</Descriptions.Item>
            <Descriptions.Item label="下单用户">{detailItem.userName}</Descriptions.Item>
            <Descriptions.Item label="订单金额">¥{detailItem.orderAmount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="佣金金额">¥{detailItem.commissionAmount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="佣金比例">{detailItem.commissionRatio}%</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusMap[detailItem.status]?.color}>{statusMap[detailItem.status]?.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="创建时间" span={2}>
              {detailItem.createTime}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}

export default DistributionOrderList
