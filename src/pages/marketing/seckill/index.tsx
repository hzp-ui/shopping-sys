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
  DatePicker,
} from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  ShoppingOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { marketingApi, type SeckillItem } from '@/api/marketing'

function SeckillList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<SeckillItem[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState<SeckillItem | null>(null)
  const [goodsVisible, setGoodsVisible] = useState(false)
  const [currentSeckill, setCurrentSeckill] = useState<SeckillItem | null>(null)
  const [searchForm] = Form.useForm()
  const [modalForm] = Form.useForm()

  const statusMap: Record<number, { text: string; color: string }> = {
    0: { text: '未开始', color: 'default' },
    1: { text: '进行中', color: 'green' },
    2: { text: '已结束', color: 'red' },
  }

  const loadData = async (page = 1, pageSize = 10) => {
    setLoading(true)
    try {
      const values = searchForm.getFieldsValue()
      const res = await marketingApi.getSeckillList({
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
      console.error('获取秒杀活动列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const columns: ColumnsType<SeckillItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '活动名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 180,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 180,
    },
    {
      title: '商品数量',
      dataIndex: 'goodsCount',
      key: 'goodsCount',
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
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<ShoppingOutlined />} onClick={() => handleViewGoods(record)}>
            查看商品
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
        </Space>
      ),
    },
  ]

  const handleAdd = () => {
    setEditingItem(null)
    modalForm.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record: SeckillItem) => {
    setEditingItem(record)
    modalForm.setFieldsValue({
      name: record.name,
      dateRange: [dayjs(record.startTime), dayjs(record.endTime)],
    })
    setModalVisible(true)
  }

  const handleViewGoods = (record: SeckillItem) => {
    setCurrentSeckill(record)
    setGoodsVisible(true)
  }

  const handleSearch = () => {
    loadData(1, pagination.pageSize)
  }

  const handleModalOk = async () => {
    try {
      const values = await modalForm.validateFields()
      const { dateRange, ...rest } = values
      const submitData = {
        ...rest,
        startTime: dateRange[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: dateRange[1].format('YYYY-MM-DD HH:mm:ss'),
      }
      if (editingItem) {
        await marketingApi.updateSeckill({ ...editingItem, ...submitData })
        message.success('编辑成功')
      } else {
        await marketingApi.addSeckill(submitData)
        message.success('新增成功')
      }
      setModalVisible(false)
      loadData(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('表单提交失败:', error)
    }
  }

  return (
    <div>
      <Form form={searchForm} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="name" label="名称">
          <Input placeholder="请输入活动名称" style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select placeholder="请选择状态" style={{ width: 150 }} allowClear>
            <Select.Option value={0}>未开始</Select.Option>
            <Select.Option value={1}>进行中</Select.Option>
            <Select.Option value={2}>已结束</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            搜索
          </Button>
        </Form.Item>
        <Form.Item style={{ marginLeft: 'auto' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增活动
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
        title={editingItem ? '编辑秒杀活动' : '新增秒杀活动'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalOk}
        confirmLoading={loading}
        width={500}
      >
        <Form form={modalForm} layout="vertical">
          <Form.Item
            label="活动名称"
            name="name"
            rules={[{ required: true, message: '请输入活动名称' }]}
          >
            <Input placeholder="请输入活动名称" />
          </Form.Item>
          <Form.Item
            label="活动时间"
            name="dateRange"
            rules={[{ required: true, message: '请选择活动时间' }]}
          >
            <DatePicker.RangePicker showTime style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`${currentSeckill?.name} - 秒杀商品`}
        open={goodsVisible}
        onCancel={() => setGoodsVisible(false)}
        footer={null}
        width={600}
      >
        <p style={{ color: '#999', textAlign: 'center', padding: '40px 0' }}>
          暂无秒杀商品数据
        </p>
      </Modal>
    </div>
  )
}

export default SeckillList
