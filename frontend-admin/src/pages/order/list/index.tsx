import { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  Modal,
  Form,
  message,
  Tag,
  Descriptions,
} from 'antd'
import { SearchOutlined, EyeOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { orderApi, type Order } from '@/api/order'

function OrderList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Order[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailItem, setDetailItem] = useState<Order | null>(null)
  const [searchForm] = Form.useForm()

  const statusMap: Record<number, { text: string; color: string }> = {
    0: { text: '待付款', color: 'orange' },
    1: { text: '待发货', color: 'blue' },
    2: { text: '已发货', color: 'cyan' },
    3: { text: '已完成', color: 'green' },
    4: { text: '已取消', color: 'red' },
  }

  const loadData = async (page = 1, pageSize = 10) => {
    setLoading(true)
    try {
      const values = searchForm.getFieldsValue()
      const res = await orderApi.getOrderList({
        pageNum: page,
        pageSize,
        ...values,
      })
      setData(res.list)
      setPagination({
        current: res.pageNum,
        pageSize: res.pageSize,
        total: res.total,
      })
    } catch (error) {
      console.error('获取订单列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const columns: ColumnsType<Order> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 200,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '订单金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '实付金额',
      dataIndex: 'payAmount',
      key: 'payAmount',
      width: 120,
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '订单状态',
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
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleDetail(record)}>
            详情
          </Button>
        </Space>
      ),
    },
  ]

  const handleDetail = (record: Order) => {
    setDetailItem(record)
    setDetailVisible(true)
  }

  const handleDelivery = async () => {
    if (!detailItem) return
    Modal.confirm({
      title: '确认发货',
      content: '确定要发货吗？',
      onOk: async () => {
        try {
          await orderApi.shipOrder(detailItem.id)
          message.success('发货成功')
          setDetailVisible(false)
          loadData(pagination.current, pagination.pageSize)
        } catch (error) {
          console.error('发货失败:', error)
        }
      },
    })
  }

  const handleSearch = () => {
    loadData(1, pagination.pageSize)
  }

  return (
    <div>
      <Form form={searchForm} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="orderNo" label="订单号">
          <Input placeholder="请输入订单号" style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name="status" label="订单状态">
          <Select placeholder="请选择状态" style={{ width: 150 }} allowClear>
            <Select.Option value={0}>待付款</Select.Option>
            <Select.Option value={1}>待发货</Select.Option>
            <Select.Option value={2}>已发货</Select.Option>
            <Select.Option value={3}>已完成</Select.Option>
            <Select.Option value={4}>已取消</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            搜索
          </Button>
        </Form.Item>
      </Form>

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
          onChange: (page, pageSize) => loadData(page, pageSize),
        }}
      />

      <Modal
        title="订单详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={
          detailItem?.status === 1 ? (
            <Button type="primary" onClick={handleDelivery}>
              发货
            </Button>
          ) : null
        }
        width={600}
      >
        {detailItem && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="订单号" span={2}>
              {detailItem.orderNo}
            </Descriptions.Item>
            <Descriptions.Item label="用户名">{detailItem.username}</Descriptions.Item>
            <Descriptions.Item label="订单状态">
              <Tag color={statusMap[detailItem.status]?.color}>{statusMap[detailItem.status]?.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="订单金额">¥{detailItem.totalAmount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="实付金额">¥{detailItem.payAmount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="创建时间" span={2}>
              {detailItem.createTime}
            </Descriptions.Item>
            {detailItem.payTime && (
              <Descriptions.Item label="支付时间" span={2}>
                {detailItem.payTime}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}

export default OrderList
