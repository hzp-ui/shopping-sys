import { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  message,
  Modal,
  Descriptions,
  Form,
  Input as AntInput,
} from 'antd'
import { SearchOutlined, CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { invoiceApi, type InvoiceItem } from '@/api/invoice'

function InvoiceList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<InvoiceItem[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailItem, setDetailItem] = useState<InvoiceItem | null>(null)
  const [auditVisible, setAuditVisible] = useState(false)
  const [auditItem, setAuditItem] = useState<InvoiceItem | null>(null)
  const [auditStatus, setAuditStatus] = useState(1)
  const [searchForm] = Form.useForm()
  const [auditForm] = Form.useForm()

  const statusMap: Record<number, { text: string; color: string }> = {
    0: { text: '待开票', color: 'orange' },
    1: { text: '已开票', color: 'green' },
    2: { text: '已拒绝', color: 'red' },
  }

  const typeMap: Record<number, string> = {
    1: '个人',
    2: '企业',
  }

  const loadData = async (page = 1, pageSize = 10) => {
    setLoading(true)
    try {
      const values = searchForm.getFieldsValue()
      const res = await invoiceApi.getInvoiceList({
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
      console.error('获取发票列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const columns: ColumnsType<InvoiceItem> = [
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
      width: 180,
    },
    {
      title: '申请人',
      dataIndex: 'userName',
      key: 'userName',
      width: 120,
    },
    {
      title: '发票类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: number) => typeMap[type] || '-',
    },
    {
      title: '发票抬头',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '税号',
      dataIndex: 'taxNo',
      key: 'taxNo',
      width: 200,
      render: (val: string) => val || '-',
    },
    {
      title: '开票金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (val: number) => `¥${val.toFixed(2)}`,
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
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleDetail(record)}>
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

  const handleDetail = (record: InvoiceItem) => {
    setDetailItem(record)
    setDetailVisible(true)
  }

  const handleAudit = (record: InvoiceItem, status: number) => {
    setAuditItem(record)
    setAuditStatus(status)
    auditForm.resetFields()
    setAuditVisible(true)
  }

  const handleAuditOk = async () => {
    if (!auditItem) return
    try {
      const values = await auditForm.validateFields()
      await invoiceApi.updateInvoiceStatus(auditItem.id, auditStatus, values.remark)
      message.success(auditStatus === 1 ? '开票成功' : '已拒绝')
      setAuditVisible(false)
      loadData(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('操作失败:', error)
    }
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
        <Form.Item name="status" label="状态">
          <Select placeholder="请选择状态" style={{ width: 150 }} allowClear>
            <Select.Option value={0}>待开票</Select.Option>
            <Select.Option value={1}>已开票</Select.Option>
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
        title="发票详情"
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
            <Descriptions.Item label="申请人">{detailItem.userName}</Descriptions.Item>
            <Descriptions.Item label="发票类型">{typeMap[detailItem.type]}</Descriptions.Item>
            <Descriptions.Item label="发票抬头">{detailItem.title}</Descriptions.Item>
            <Descriptions.Item label="税号">{detailItem.taxNo || '-'}</Descriptions.Item>
            <Descriptions.Item label="开票金额">¥{detailItem.amount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusMap[detailItem.status]?.color}>{statusMap[detailItem.status]?.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="申请时间" span={2}>
              {detailItem.applyTime}
            </Descriptions.Item>
            {detailItem.openTime && (
              <Descriptions.Item label="开票时间" span={2}>
                {detailItem.openTime}
              </Descriptions.Item>
            )}
            {detailItem.remark && (
              <Descriptions.Item label="备注" span={2}>
                {detailItem.remark}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      <Modal
        title={auditStatus === 1 ? '确认开票' : '确认拒绝'}
        open={auditVisible}
        onCancel={() => setAuditVisible(false)}
        onOk={handleAuditOk}
        confirmLoading={loading}
      >
        <Form form={auditForm} layout="vertical">
          <Form.Item
            label="备注"
            name="remark"
          >
            <AntInput.TextArea rows={3} placeholder="请输入备注（选填）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default InvoiceList
