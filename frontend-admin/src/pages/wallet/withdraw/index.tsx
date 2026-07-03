import { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Space,
  Input,
  Tag,
  message,
  Modal,
  Descriptions,
  Form,
  Input as AntInput,
  Select,
} from 'antd'
import { SearchOutlined, CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { walletApi, type WalletWithdrawItem } from '@/api/wallet'

function WalletWithdrawList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<WalletWithdrawItem[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailItem, setDetailItem] = useState<WalletWithdrawItem | null>(null)
  const [auditVisible, setAuditVisible] = useState(false)
  const [auditItem, setAuditItem] = useState<WalletWithdrawItem | null>(null)
  const [auditStatus, setAuditStatus] = useState(1)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<number | undefined>()
  const [auditForm] = Form.useForm()

  const statusMap: Record<number, { text: string; color: string }> = {
    0: { text: '待审核', color: 'orange' },
    1: { text: '审核通过', color: 'green' },
    2: { text: '审核拒绝', color: 'red' },
  }

  const methodMap: Record<number, string> = {
    1: '微信',
    2: '支付宝',
    3: '银行卡',
  }

  const loadData = async (page = 1, pageSize = 10, userName = '', status?: number) => {
    setLoading(true)
    try {
      const res = await walletApi.getWalletWithdrawList({
        pageNum: page,
        pageSize,
        userName,
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

  const columns: ColumnsType<WalletWithdrawItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户',
      dataIndex: 'userName',
      key: 'userName',
      width: 120,
    },
    {
      title: '提现金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (val: number) => `¥${val.toFixed(2)}`,
    },
    {
      title: '手续费',
      dataIndex: 'fee',
      key: 'fee',
      width: 100,
      render: (val: number) => `¥${val.toFixed(2)}`,
    },
    {
      title: '实际到账',
      dataIndex: 'actualAmount',
      key: 'actualAmount',
      width: 120,
      render: (val: number) => `¥${val.toFixed(2)}`,
    },
    {
      title: '提现方式',
      dataIndex: 'method',
      key: 'method',
      width: 100,
      render: (val: number) => methodMap[val] || '-',
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

  const handleDetail = (record: WalletWithdrawItem) => {
    setDetailItem(record)
    setDetailVisible(true)
  }

  const handleAudit = (record: WalletWithdrawItem, status: number) => {
    setAuditItem(record)
    setAuditStatus(status)
    auditForm.resetFields()
    setAuditVisible(true)
  }

  const handleAuditOk = async () => {
    if (!auditItem) return
    try {
      const values = await auditForm.validateFields()
      await walletApi.auditWalletWithdraw(auditItem.id, auditStatus, values.remark)
      message.success(auditStatus === 1 ? '审核通过' : '审核拒绝')
      setAuditVisible(false)
      loadData(pagination.current, pagination.pageSize, searchText, statusFilter)
    } catch (error) {
      console.error('审核失败:', error)
    }
  }

  const handleSearch = () => {
    loadData(1, pagination.pageSize, searchText, statusFilter)
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <Input
          placeholder="请输入用户名"
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

      <Modal
        title="提现详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {detailItem && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="用户" span={2}>
              {detailItem.userName}
            </Descriptions.Item>
            <Descriptions.Item label="提现金额">¥{detailItem.amount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="手续费">¥{detailItem.fee.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="实际到账">¥{detailItem.actualAmount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="提现方式">{methodMap[detailItem.method]}</Descriptions.Item>
            <Descriptions.Item label="收款账号" span={2}>
              {detailItem.account}
            </Descriptions.Item>
            <Descriptions.Item label="账户姓名" span={2}>
              {detailItem.accountName}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusMap[detailItem.status]?.color}>{statusMap[detailItem.status]?.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="申请时间">{detailItem.applyTime}</Descriptions.Item>
            {detailItem.auditTime && (
              <Descriptions.Item label="审核时间" span={2}>
                {detailItem.auditTime}
              </Descriptions.Item>
            )}
            {detailItem.auditRemark && (
              <Descriptions.Item label="审核备注" span={2}>
                {detailItem.auditRemark}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      <Modal
        title={auditStatus === 1 ? '确认通过' : '确认拒绝'}
        open={auditVisible}
        onCancel={() => setAuditVisible(false)}
        onOk={handleAuditOk}
        confirmLoading={loading}
      >
        <Form form={auditForm} layout="vertical">
          <Form.Item label="备注" name="remark">
            <AntInput.TextArea rows={3} placeholder="请输入备注（选填）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default WalletWithdrawList
