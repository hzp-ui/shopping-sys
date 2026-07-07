<template>
  <view class="address-page">
    <scroll-view scroll-y class="address-scroll">
      <view
        class="address-item"
        v-for="item in addressList"
        :key="item.id"
        @click="selectAddress(item)"
      >
        <view class="address-content">
          <view class="address-header">
            <text class="name">{{ item.name }}</text>
            <text class="phone">{{ item.phone }}</text>
            <view class="default-tag" v-if="item.isDefault === 1">默认</view>
          </view>
          <text class="address-detail">{{
            item.province + item.city + item.district + item.detail
          }}</text>
        </view>
        <view class="address-actions">
          <view class="action-btn" @click.stop="editAddress(item)">
            <text class="action-icon">✏️</text>
            <text>编辑</text>
          </view>
          <view class="action-btn" @click.stop="deleteAddress(item.id)">
            <text class="action-icon">🗑️</text>
            <text>删除</text>
          </view>
        </view>
      </view>

      <view class="empty-address" v-if="addressList.length === 0 && !loading">
        <text class="empty-icon">📍</text>
        <text class="empty-text">暂无收货地址</text>
        <text class="empty-desc">点击下方按钮添加收货地址</text>
      </view>
    </scroll-view>

    <view class="bottom-bar">
      <view class="add-btn" @click="addAddress">
        <text class="add-icon">+</text>
        <text>新增收货地址</text>
      </view>
    </view>

    <view class="modal-mask" v-if="showModal" @click="closeModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">{{ isEdit ? '编辑地址' : '新增地址' }}</text>
          <text class="modal-close" @click="closeModal">✕</text>
        </view>
        <view class="form-item">
          <text class="form-label">收货人</text>
          <input
            class="form-input"
            v-model="formData.name"
            placeholder="请输入收货人姓名"
          />
        </view>
        <view class="form-item">
          <text class="form-label">手机号</text>
          <input
            class="form-input"
            v-model="formData.phone"
            type="number"
            placeholder="请输入手机号"
          />
        </view>
        <view class="form-item">
          <text class="form-label">省份</text>
          <input
            class="form-input"
            v-model="formData.province"
            placeholder="请输入省份"
          />
        </view>
        <view class="form-item">
          <text class="form-label">城市</text>
          <input
            class="form-input"
            v-model="formData.city"
            placeholder="请输入城市"
          />
        </view>
        <view class="form-item">
          <text class="form-label">区县</text>
          <input
            class="form-input"
            v-model="formData.district"
            placeholder="请输入区县"
          />
        </view>
        <view class="form-item">
          <text class="form-label">详细地址</text>
          <input
            class="form-input"
            v-model="formData.detail"
            placeholder="请输入详细地址"
          />
        </view>
        <view class="form-item form-switch">
          <text class="form-label">设为默认地址</text>
          <switch
            :checked="formData.isDefault === 1"
            @change="onDefaultChange"
            color="#ff6b00"
          />
        </view>
        <view class="modal-footer">
          <view class="btn-cancel" @click="closeModal">取消</view>
          <view class="btn-confirm" @click="submitForm">确定</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getAddressListApi,
  addAddressApi,
  updateAddressApi,
  deleteAddressApi,
  setDefaultAddressApi,
  type AddressItem
} from '@/api/address'

const addressList = ref<AddressItem[]>([])
const loading = ref(false)
const showModal = ref(false)
const isEdit = ref(false)
const editId = ref<number | null>(null)

const formData = ref({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: 0 as number
})

const resetForm = () => {
  formData.value = {
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    isDefault: 0
  }
  editId.value = null
  isEdit.value = false
}

const loadAddressList = async () => {
  loading.value = true
  try {
    const res = await getAddressListApi()
    addressList.value = res.data || []
  } catch (e) {
    console.error('加载地址列表失败', e)
  } finally {
    loading.value = false
  }
}

const selectAddress = (item: AddressItem) => {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  }
}

const addAddress = () => {
  resetForm()
  isEdit.value = false
  showModal.value = true
}

const editAddress = (item: AddressItem) => {
  resetForm()
  isEdit.value = true
  editId.value = item.id
  formData.value = {
    name: item.name,
    phone: item.phone,
    province: item.province,
    city: item.city,
    district: item.district,
    detail: item.detail,
    isDefault: item.isDefault
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const onDefaultChange = (e: any) => {
  formData.value.isDefault = e.detail.value ? 1 : 0
}

const validateForm = (): boolean => {
  if (!formData.value.name.trim()) {
    uni.showToast({ title: '请输入收货人姓名', icon: 'none' })
    return false
  }
  if (!formData.value.phone.trim()) {
    uni.showToast({ title: '请输入手机号', icon: 'none' })
    return false
  }
  if (!/^1[3-9]\d{9}$/.test(formData.value.phone)) {
    uni.showToast({ title: '手机号格式不正确', icon: 'none' })
    return false
  }
  if (!formData.value.province.trim()) {
    uni.showToast({ title: '请输入省份', icon: 'none' })
    return false
  }
  if (!formData.value.city.trim()) {
    uni.showToast({ title: '请输入城市', icon: 'none' })
    return false
  }
  if (!formData.value.district.trim()) {
    uni.showToast({ title: '请输入区县', icon: 'none' })
    return false
  }
  if (!formData.value.detail.trim()) {
    uni.showToast({ title: '请输入详细地址', icon: 'none' })
    return false
  }
  return true
}

const submitForm = async () => {
  if (!validateForm()) return

  try {
    if (isEdit.value && editId.value) {
      await updateAddressApi(editId.value, formData.value)
      uni.showToast({ title: '修改成功', icon: 'success' })
    } else {
      await addAddressApi(formData.value as Omit<AddressItem, 'id'>)
      uni.showToast({ title: '添加成功', icon: 'success' })
    }
    closeModal()
    loadAddressList()
  } catch (e) {
    console.error('提交失败', e)
  }
}

const deleteAddress = (id: number) => {
  uni.showModal({
    title: '提示',
    content: '确定删除该地址吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await deleteAddressApi(id)
          uni.showToast({ title: '删除成功', icon: 'success' })
          loadAddressList()
        } catch (e) {
          console.error('删除失败', e)
        }
      }
    }
  })
}

onMounted(() => {
  loadAddressList()
})
</script>

<style lang="scss" scoped>
.address-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.address-scroll {
  flex: 1;
  padding: 20rpx;
}

.address-item {
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
}

.address-content {
  flex: 1;

  .address-header {
    display: flex;
    align-items: center;
    margin-bottom: 15rpx;

    .name {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
      margin-right: 20rpx;
    }

    .phone {
      font-size: 28rpx;
      color: #666;
    }

    .default-tag {
      margin-left: 20rpx;
      padding: 4rpx 16rpx;
      background-color: #ff6b00;
      color: #fff;
      font-size: 22rpx;
      border-radius: 6rpx;
    }
  }

  .address-detail {
    font-size: 26rpx;
    color: #666;
    line-height: 1.5;
  }
}

.address-actions {
  display: flex;
  align-items: center;
  border-left: 1rpx solid #f0f0f0;
  padding-left: 20rpx;

  .action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10rpx 20rpx;
    font-size: 22rpx;
    color: #666;

    .action-icon {
      font-size: 32rpx;
      margin-bottom: 8rpx;
    }
  }
}

.empty-address {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 150rpx 0;

  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 30rpx;
  }

  .empty-text {
    font-size: 32rpx;
    color: #333;
    margin-bottom: 15rpx;
  }

  .empty-desc {
    font-size: 26rpx;
    color: #999;
  }
}

.bottom-bar {
  padding: 20rpx 30rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background-color: #fff;
  border-top: 1rpx solid #f0f0f0;

  .add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 88rpx;
    background-color: #ff6b00;
    color: #fff;
    font-size: 30rpx;
    border-radius: 44rpx;

    .add-icon {
      font-size: 36rpx;
      margin-right: 10rpx;
    }
  }
}

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  width: 600rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .modal-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }

  .modal-close {
    font-size: 36rpx;
    color: #999;
    padding: 10rpx;
  }
}

.form-item {
  margin-bottom: 24rpx;
  display: flex;
  flex-direction: column;

  .form-label {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 10rpx;
  }

  .form-input {
    height: 72rpx;
    padding: 0 20rpx;
    border: 1rpx solid #e0e0e0;
    border-radius: 8rpx;
    font-size: 28rpx;
    background-color: #fafafa;
  }

  &.form-switch {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .form-label {
      margin-bottom: 0;
    }
  }
}

.modal-footer {
  display: flex;
  gap: 20rpx;
  margin-top: 30rpx;

  .btn-cancel,
  .btn-confirm {
    flex: 1;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 40rpx;
    font-size: 28rpx;
  }

  .btn-cancel {
    background-color: #f5f5f5;
    color: #666;
  }

  .btn-confirm {
    background-color: #ff6b00;
    color: #fff;
  }
}
</style>
