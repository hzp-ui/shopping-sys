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
import { SearchOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface StoreApplyItem {
  id: number
  applicant: string
  storeName: string
  address: string
  phone: string
  businessLicense: string
  status: number
  applyTime: string
  auditRemark?: string
}

function StoreApply() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<StoreApplyItem[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailItem, setDetailItem] = useState<StoreApplyItem | null>(null)
  const [auditVisible, setAuditVisible] = useState(false)
  const [auditItem, setAuditItem] = useState<StoreApplyItem | null>(null)
  const [auditType, setAuditType] = useState<'pass' | 'reject'>('pass')
  const [auditForm] = Form.useForm()
  const [searchForm] = Form.useForm()

  const statusMap: Record<number, { text: string; color: string }> = {
    0: { text: '待审核', color: 'orange' },
    1: { text: '已通过', color: 'green' },
    2: { text: '已拒绝', color: 'red' },
  }

  const mockData: StoreApplyItem[] = Array.from({ length: 15 }).map((_, index) => {
    const status = index % 3
    return {
      id: index + 1,
      applicant: `申请人${index + 1}`,
      storeName: `云亩门店${index + 1}`,
      address: `北京市朝阳区建国路${index + 1}号`,
      phone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      businessLicense: `91110000MA0${String(index).padStart(6, '0')}X`,
      status,
      applyTime: `2026-06-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
      auditRemark: status !== 0 ? (status === 1 ? '审核通过' : '资料不完整') : undefined,
    }
  })

  const loadData = (page = 1, pageSize = 10) => {
    setLoading(true)
    setTimeout(() => {
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const filteredData = mockData.slice(start, end)
      setData(filteredData)
      setPagination({
        current: page,
        pageSize,
        total: mockData.length,
      })
      setLoading(false)
    }, 300)
  }

  useEffect(() => {
    loadData()
  }, [])

  const columns: ColumnsType<StoreApplyItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
      key: 'applicant',
      width: 100,
    },
    {
      title: '门店名称',
      dataIndex: 'storeName',
      key: 'storeName',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 140,
    },
    {
      title: '营业执照',
      dataIndex: 'businessLicense',
      key: 'businessLicense',
      width: 180,
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
      dataIndex: 'applyTime',
      key: 'applyTime',
      width: 180,
    },
    {
      title: '审核备注',
      dataIndex: 'auditRemark',
      key: 'auditRemark',
      width: 120,
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          {record.status === 0 && (
            <>
              <Button
                type="link"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleAudit(record, 'pass')}
              >
                通过
              </Button>
              <Button
                type="link"
                size="small"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleAudit(record, 'reject')}
              >
                拒绝
              </Button>
            </>
          )}
          {record.status !== 0 && (
            <Button type="link" size="small" onClick={() => handleDetail(record)}>
              查看
            </Button>
          )}
        </Space>
      ),
    },
  ]

  const handleDetail = (record: StoreApplyItem) => {
    setDetailItem(record)
    setDetailVisible(true)
  }

  const handleAudit = (record: StoreApplyItem, type: 'pass' | 'reject') => {
    setAuditItem(record)
    setAuditType(type)
    auditForm.resetFields()
    setAuditVisible(true)
  }

  const handleAuditSubmit = () => {
    auditForm.validateFields().then((_values) => {
      message.success(`${auditType === 'pass' ? '通过' : '拒绝'}成功`)
      setAuditVisible(false)
      loadData(pagination.current, pagination.pageSize)
    })
  }

  const handleSearch = () => {
    loadData(1, pagination.pageSize)
  }

  return (
    <div>
      <Form form={searchForm} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="storeName" label="门店名称">
          <Input placeholder="请输入门店名称" style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select placeholder="请选择状态" style={{ width: 150 }} allowClear>
            <Select.Option value={0}>待审核</Select.Option>
            <Select.Option value={1}>已通过</Select.Option>
            <Select.Option value={2}>已拒绝</Select.Option>
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
        title="申请详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {detailItem && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="ID" span={2}>
              {detailItem.id}
            </Descriptions.Item>
            <Descriptions.Item label="申请人">{detailItem.applicant}</Descriptions.Item>
            <Descriptions.Item label="申请时间">{detailItem.applyTime}</Descriptions.Item>
            <Descriptions.Item label="门店名称" span={2}>
              {detailItem.storeName}
            </Descriptions.Item>
            <Descriptions.Item label="地址" span={2}>
              {detailItem.address}
            </Descriptions.Item>
            <Descriptions.Item label="联系电话">{detailItem.phone}</Descriptions.Item>
            <Descriptions.Item label="营业执照">{detailItem.businessLicense}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusMap[detailItem.status]?.color}>{statusMap[detailItem.status]?.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="审核备注" span={2}>
              {detailItem.auditRemark || '-'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal
        title={`${auditType === 'pass' ? '审核通过' : '审核拒绝'} - ${auditItem?.storeName || ''}`}
        open={auditVisible}
        onCancel={() => setAuditVisible(false)}
        onOk={handleAuditSubmit}
        width={500}
      >
        <Form form={auditForm} layout="vertical">
          <Form.Item
            name="remark"
            label="审核备注"
            rules={auditType === 'reject' ? [{ required: true, message: '请输入审核备注' }] : []}
          >
            <Input.TextArea
              rows={4}
              placeholder={auditType === 'pass' ? '请输入审核备注（选填）' : '请输入拒绝原因'}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default StoreApply
