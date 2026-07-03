import { useState, useEffect } from 'react'
import { Card, Form, InputNumber, Button, message, Space } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { pointsApi, type PointsRule } from '@/api/points'

function PointsRule() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [ruleData, setRuleData] = useState<PointsRule | null>(null)
  const [form] = Form.useForm()

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await pointsApi.getPointsRuleList()
      if (res && res.length > 0) {
        const rule = res[0]
        setRuleData(rule)
        form.setFieldsValue(rule)
      }
    } catch (error) {
      console.error('获取积分规则失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      setSaving(true)
      await pointsApi.updatePointsRule({ ...ruleData, ...values })
      message.success('保存成功')
      loadData()
    } catch (error) {
      console.error('保存失败:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <Card title="积分规则" loading={loading}>
        <Form form={form} layout="vertical" style={{ maxWidth: 500 }}>
          <Form.Item
            label="消费每元获得积分"
            name="consumePerYuan"
            rules={[{ required: true, message: '请输入消费每元获得积分' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} addonAfter="积分/元" />
          </Form.Item>
          <Form.Item
            label="每日签到获得积分"
            name="signInPoints"
            rules={[{ required: true, message: '请输入签到积分' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} addonAfter="积分/天" />
          </Form.Item>
          <Form.Item
            label="积分有效期（天）"
            name="expireDays"
            rules={[{ required: true, message: '请输入积分有效期' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} addonAfter="天" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={handleSave}>
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default PointsRule
