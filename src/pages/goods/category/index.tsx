import { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Tag,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { categoryApi, type Category } from '@/api/category'

function GoodsCategory() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Category[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState<Category | null>(null)
  const [form] = Form.useForm()

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await categoryApi.getCategoryList()
      setData(res as unknown as Category[])
    } catch (error) {
      console.error('获取分类列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const columns: ColumnsType<Category> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '父级ID',
      dataIndex: 'parentId',
      key: 'parentId',
      width: 100,
      render: (parentId: number) => parentId || '一级分类',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) =>
        status === 1 ? <Tag color="green">启用</Tag> : <Tag color="red">禁用</Tag>,
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
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  const handleAdd = () => {
    setEditingItem(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record: Category) => {
    setEditingItem(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该分类吗？',
      onOk: async () => {
        try {
          await categoryApi.deleteCategory(id)
          message.success('删除成功')
          loadData()
        } catch (error) {
          console.error('删除分类失败:', error)
        }
      },
    })
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingItem) {
        await categoryApi.updateCategory({ ...editingItem, ...values })
        message.success('修改成功')
      } else {
        await categoryApi.addCategory(values)
        message.success('新增成功')
      }
      setModalVisible(false)
      loadData()
    } catch (error) {
      console.error('表单提交失败:', error)
    }
  }

  const parentOptions = data
    .filter((item) => item.parentId === 0)
    .map((item) => ({ value: item.id, label: item.name }))

  return (
    <div>
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增分类
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      <Modal
        title={editingItem ? '编辑分类' : '新增分类'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="parentId"
            label="父级分类"
            rules={[{ required: true, message: '请选择父级分类' }]}
          >
            <Select>
              <Select.Option value={0}>一级分类</Select.Option>
              {parentOptions.map((opt) => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="name"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          <Form.Item
            name="sort"
            label="排序"
            rules={[{ required: true, message: '请输入排序' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入排序" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default GoodsCategory
