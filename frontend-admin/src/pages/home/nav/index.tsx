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
  Image,
  InputNumber,
} from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { homeManageApi, type NavItem } from '@/api/homeManage'

function NavList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<NavItem[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState<NavItem | null>(null)
  const [searchForm] = Form.useForm()
  const [modalForm] = Form.useForm()

  const statusMap: Record<number, { text: string; color: string }> = {
    0: { text: '禁用', color: 'default' },
    1: { text: '启用', color: 'green' },
  }

  const linkTypeMap: Record<number, string> = {
    1: '无链接',
    2: '商品详情',
    3: '分类页面',
    4: '自定义链接',
  }

  const loadData = async (page = 1, pageSize = 10) => {
    setLoading(true)
    try {
      const values = searchForm.getFieldsValue()
      const res = await homeManageApi.getNavList({
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
      console.error('获取导航列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const columns: ColumnsType<NavItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 100,
      render: (icon: string) => (
        <Image
          width={40}
          height={40}
          src={icon}
          fallback="https://picsum.photos/40/40"
        />
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '链接类型',
      dataIndex: 'linkType',
      key: 'linkType',
      width: 120,
      render: (type: number) => linkTypeMap[type] || '-',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
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
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          {record.status === 1 ? (
            <Button type="link" size="small" icon={<ArrowDownOutlined />} onClick={() => handleToggleStatus(record)} danger>
              禁用
            </Button>
          ) : (
            <Button type="link" size="small" icon={<ArrowUpOutlined />} onClick={() => handleToggleStatus(record)}>
              启用
            </Button>
          )}
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            删除
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

  const handleEdit = (record: NavItem) => {
    setEditingItem(record)
    modalForm.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleToggleStatus = (record: NavItem) => {
    const newStatus = record.status === 1 ? 0 : 1
    Modal.confirm({
      title: newStatus === 1 ? '确认启用' : '确认禁用',
      content: `确定要${newStatus === 1 ? '启用' : '禁用'}该导航吗？`,
      onOk: async () => {
        try {
          await homeManageApi.updateNav({ ...record, status: newStatus })
          message.success(newStatus === 1 ? '启用成功' : '禁用成功')
          loadData(pagination.current, pagination.pageSize)
        } catch (error) {
          console.error('更新状态失败:', error)
        }
      },
    })
  }

  const handleDelete = (record: NavItem) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该导航吗？',
      onOk: async () => {
        try {
          await homeManageApi.deleteNav(record.id)
          message.success('删除成功')
          loadData(pagination.current, pagination.pageSize)
        } catch (error) {
          console.error('删除失败:', error)
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
      if (editingItem) {
        await homeManageApi.updateNav({ ...editingItem, ...values })
        message.success('编辑成功')
      } else {
        await homeManageApi.addNav(values)
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
          <Input placeholder="请输入名称" style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select placeholder="请选择状态" style={{ width: 150 }} allowClear>
            <Select.Option value={0}>禁用</Select.Option>
            <Select.Option value={1}>启用</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            搜索
          </Button>
        </Form.Item>
        <Form.Item style={{ marginLeft: 'auto' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增导航
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
        title={editingItem ? '编辑导航' : '新增导航'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalOk}
        confirmLoading={loading}
        width={500}
      >
        <Form form={modalForm} layout="vertical">
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item
            label="图标地址"
            name="icon"
            rules={[{ required: true, message: '请输入图标地址' }]}
          >
            <Input placeholder="请输入图标URL" />
          </Form.Item>
          <Form.Item
            label="链接类型"
            name="linkType"
            rules={[{ required: true, message: '请选择链接类型' }]}
          >
            <Select placeholder="请选择">
              <Select.Option value={1}>无链接</Select.Option>
              <Select.Option value={2}>商品详情</Select.Option>
              <Select.Option value={3}>分类页面</Select.Option>
              <Select.Option value={4}>自定义链接</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="链接地址"
            name="linkUrl"
          >
            <Input placeholder="请输入链接地址" />
          </Form.Item>
          <Form.Item
            label="排序"
            name="sort"
            rules={[{ required: true, message: '请输入排序值' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择">
              <Select.Option value={0}>禁用</Select.Option>
              <Select.Option value={1}>启用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default NavList
