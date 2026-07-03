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
  InputNumber,
  Descriptions,
} from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { marketingApi, type CouponItem } from '@/api/marketing'

const { RangePicker } = DatePicker

function CouponList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<CouponItem[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailItem, setDetailItem] = useState<CouponItem | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState<CouponItem | null>(null)
  const [searchForm] = Form.useForm()
  const [modalForm] = Form.useForm()

  const typeMap: Record<number, { text: string; color: string }> = {
    1: { text: '满减券', color: 'blue' },
    2: { text: '折扣券', color: 'purple' },
  }

  const statusMap: Record<number, { text: string; color: string }> = {
    0: { text: '下架', color: 'default' },
    1: { text: '上架', color: 'green' },
  }

  const loadData = async (page = 1, pageSize = 10) => {
    setLoading(true)
    try {
      const values = searchForm.getFieldsValue()
      const res = await marketingApi.getCouponList({
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
      console.error('获取优惠券列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const columns: ColumnsType<CouponItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '优惠券名称',
      dataIndex: 'name',
      key: 'name',
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
      title: '面值',
      dataIndex: 'value',
      key: 'value',
      width: 120,
      render: (value: number, record: CouponItem) => (
        record.type === 1 ? `¥${value}` : `${value}折`
      ),
    },
    {
      title: '满减条件',
      dataIndex: 'minAmount',
      key: 'minAmount',
      width: 120,
      render: (amount: number) => `满¥${amount}可用`,
    },
    {
      title: '有效期',
      key: 'validity',
      width: 300,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: 12 }}>开始：{record.startTime}</div>
          <div style={{ fontSize: 12 }}>结束：{record.endTime}</div>
        </div>
      ),
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
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleDetail(record)}>
            详情
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          {record.status === 1 ? (
            <Button type="link" size="small" icon={<ArrowDownOutlined />} onClick={() => handleToggleStatus(record)} danger>
              下架
            </Button>
          ) : (
            <Button type="link" size="small" icon={<ArrowUpOutlined />} onClick={() => handleToggleStatus(record)}>
              上架
            </Button>
          )}
        </Space>
      ),
    },
  ]

  const handleDetail = (record: CouponItem) => {
    setDetailItem(record)
    setDetailVisible(true)
  }

  const handleAdd = () => {
    setEditingItem(null)
    modalForm.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record: CouponItem) => {
    setEditingItem(record)
    modalForm.setFieldsValue({
      ...record,
      dateRange: [dayjs(record.startTime), dayjs(record.endTime)],
    })
    setModalVisible(true)
  }

  const handleToggleStatus = (record: CouponItem) => {
    const newStatus = record.status === 1 ? 0 : 1
    Modal.confirm({
      title: newStatus === 1 ? '确认上架' : '确认下架',
      content: `确定要${newStatus === 1 ? '上架' : '下架'}该优惠券吗？`,
      onOk: async () => {
        try {
          await marketingApi.updateCoupon({ ...record, status: newStatus })
          message.success(newStatus === 1 ? '上架成功' : '下架成功')
          loadData(pagination.current, pagination.pageSize)
        } catch (error) {
          console.error('更新优惠券状态失败:', error)
        }
      },
    })
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
        await marketingApi.updateCoupon({ ...editingItem, ...submitData })
        message.success('编辑成功')
      } else {
        await marketingApi.addCoupon(submitData)
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
          <Input placeholder="请输入优惠券名称" style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select placeholder="请选择状态" style={{ width: 150 }} allowClear>
            <Select.Option value={0}>下架</Select.Option>
            <Select.Option value={1}>上架</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            搜索
          </Button>
        </Form.Item>
        <Form.Item style={{ marginLeft: 'auto' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增优惠券
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
        title="优惠券详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {detailItem && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="优惠券名称" span={2}>
              {detailItem.name}
            </Descriptions.Item>
            <Descriptions.Item label="类型">
              <Tag color={typeMap[detailItem.type]?.color}>{typeMap[detailItem.type]?.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="面值">
              {detailItem.type === 1 ? `¥${detailItem.value}` : `${detailItem.value}折`}
            </Descriptions.Item>
            <Descriptions.Item label="满减条件">满¥{detailItem.minAmount}可用</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusMap[detailItem.status]?.color}>{statusMap[detailItem.status]?.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="开始时间" span={2}>
              {detailItem.startTime}
            </Descriptions.Item>
            <Descriptions.Item label="结束时间" span={2}>
              {detailItem.endTime}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间" span={2}>
              {detailItem.createTime}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal
        title={editingItem ? '编辑优惠券' : '新增优惠券'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalOk}
        confirmLoading={loading}
        width={500}
      >
        <Form form={modalForm} layout="vertical">
          <Form.Item
            label="优惠券名称"
            name="name"
            rules={[{ required: true, message: '请输入优惠券名称' }]}
          >
            <Input placeholder="请输入优惠券名称" />
          </Form.Item>
          <Form.Item
            label="优惠券类型"
            name="type"
            rules={[{ required: true, message: '请选择优惠券类型' }]}
          >
            <Select placeholder="请选择类型">
              <Select.Option value={1}>满减券</Select.Option>
              <Select.Option value={2}>折扣券</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="面值"
            name="value"
            rules={[{ required: true, message: '请输入面值' }]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              placeholder="满减券输入金额，折扣券输入折扣值（如80表示8折）"
            />
          </Form.Item>
          <Form.Item
            label="满减条件"
            name="minAmount"
            rules={[{ required: true, message: '请输入满减条件' }]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              addonBefore="满¥"
              addonAfter="可用"
            />
          </Form.Item>
          <Form.Item
            label="有效期"
            name="dateRange"
            rules={[{ required: true, message: '请选择有效期' }]}
          >
            <RangePicker showTime style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default CouponList
