import { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Input,
  Select,
  Modal,
  Form,
  message,
  Avatar,
  Switch,
} from 'antd'
import { SearchOutlined, UserOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { userManageApi, type User } from '@/api/userManage'

function UserList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<User[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [searchForm] = Form.useForm()

  const loadData = async (page = 1, pageSize = 10) => {
    setLoading(true)
    try {
      const values = searchForm.getFieldsValue()
      const res = await userManageApi.getUserList({
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
      console.error('获取用户列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const columns: ColumnsType<User> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar?: string) => <Avatar src={avatar} icon={<UserOutlined />} />,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: number, record) => (
        <Switch
          checked={status === 1}
          onChange={(checked) => handleStatusChange(record.id, checked)}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
  ]

  const handleStatusChange = (id: number, checked: boolean) => {
    Modal.confirm({
      title: '确认操作',
      content: `确定要${checked ? '启用' : '禁用'}该用户吗？`,
      onOk: async () => {
        try {
          await userManageApi.updateUserStatus(id, checked ? 1 : 0)
          message.success(`已${checked ? '启用' : '禁用'}`)
          loadData(pagination.current, pagination.pageSize)
        } catch (error) {
          console.error('更新用户状态失败:', error)
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
        <Form.Item name="username" label="用户名">
          <Input placeholder="请输入用户名" style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select placeholder="请选择状态" style={{ width: 150 }} allowClear>
            <Select.Option value={1}>启用</Select.Option>
            <Select.Option value={0}>禁用</Select.Option>
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
    </div>
  )
}

export default UserList
