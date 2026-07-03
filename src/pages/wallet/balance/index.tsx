import { useState, useEffect } from 'react'
import { Table, Button, Space, Input, message, Modal, Form, InputNumber, Select } from 'antd'
import { SearchOutlined, EditOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { walletApi, type UserWalletItem } from '@/api/wallet'

function BalanceList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<UserWalletItem[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [searchText, setSearchText] = useState('')
  const [adjustVisible, setAdjustVisible] = useState(false)
  const [adjustItem, setAdjustItem] = useState<UserWalletItem | null>(null)
  const [adjustForm] = Form.useForm()

  const loadData = async (page = 1, pageSize = 10, userName = '') => {
    setLoading(true)
    try {
      const res = await walletApi.getBalanceList({
        pageNum: page,
        pageSize,
        userName,
      })
      setData(res.list)
      setPagination({
        current: res.pageNum,
        pageSize: res.pageSize,
        total: res.total,
      })
    } catch (error) {
      console.error('获取余额列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const columns: ColumnsType<UserWalletItem> = [
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
      width: 150,
    },
    {
      title: '当前余额',
      dataIndex: 'balance',
      key: 'balance',
      width: 120,
      render: (val: number) => `¥${val.toFixed(2)}`,
    },
    {
      title: '累计收入',
      dataIndex: 'totalIncome',
      key: 'totalIncome',
      width: 120,
      render: (val: number) => `¥${val.toFixed(2)}`,
    },
    {
      title: '累计提现',
      dataIndex: 'totalWithdraw',
      key: 'totalWithdraw',
      width: 120,
      render: (val: number) => `¥${val.toFixed(2)}`,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleAdjust(record)}>
            调整
          </Button>
        </Space>
      ),
    },
  ]

  const handleAdjust = (record: UserWalletItem) => {
    setAdjustItem(record)
    adjustForm.resetFields()
    setAdjustVisible(true)
  }

  const handleAdjustOk = async () => {
    if (!adjustItem) return
    try {
      const values = await adjustForm.validateFields()
      await walletApi.adjustUserBalance(adjustItem.userId, values.amount, values.type, values.remark)
      message.success('余额调整成功')
      setAdjustVisible(false)
      loadData(pagination.current, pagination.pageSize, searchText)
    } catch (error) {
      console.error('余额调整失败:', error)
    }
  }

  const handleSearch = () => {
    loadData(1, pagination.pageSize, searchText)
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
        <Input
          placeholder="请输入用户名"
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
        title="余额调整"
        open={adjustVisible}
        onCancel={() => setAdjustVisible(false)}
        onOk={handleAdjustOk}
        confirmLoading={loading}
      >
        <Form form={adjustForm} layout="vertical">
          <Form.Item label="调整类型" name="type" rules={[{ required: true, message: '请选择调整类型' }]}>
            <Select placeholder="请选择">
              <Select.Option value={1}>增加余额</Select.Option>
              <Select.Option value={2}>减少余额</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="调整金额" name="amount" rules={[{ required: true, message: '请输入调整金额' }]}>
            <InputNumber min={0} style={{ width: '100%' }} addonBefore="¥" />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea rows={3} placeholder="请输入备注（选填）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default BalanceList
