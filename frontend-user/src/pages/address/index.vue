<template>
  <view class="address-page">
    <scroll-view scroll-y class="address-scroll">
      <view class="address-item" v-for="item in addressList" :key="item.id" @click="selectAddress(item)">
        <view class="address-content">
          <view class="address-header">
            <text class="name">{{ item.name }}</text>
            <text class="phone">{{ item.phone }}</text>
            <view class="default-tag" v-if="item.isDefault">默认</view>
          </view>
          <text class="address-detail">{{ item.province }}{{ item.city }}{{ item.district }}{{ item.detail }}</text>
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

      <view class="empty-address" v-if="addressList.length === 0">
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
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const addressList = ref<any[]>([])

const mockAddresses = [
  { id: 1, name: '张三', phone: '138****8888', province: '浙江省', city: '杭州市', district: '西湖区', detail: '文三路 123 号云亩大厦 1001室', isDefault: true },
  { id: 2, name: '李四', phone: '139****9999', province: '浙江省', city: '杭州市', district: '余杭区', detail: '未来科技城梦想小镇创业大厦 2002室', isDefault: false }
]

const loadAddressList = () => {
  setTimeout(() => {
    addressList.value = mockAddresses
  }, 300)
}

const selectAddress = (item: any) => {
  uni.showToast({ title: '选择了' + item.name, icon: 'none' })
}

const addAddress = () => {
  uni.showToast({ title: '新增地址', icon: 'none' })
}

const editAddress = (item: any) => {
  uni.showToast({ title: '编辑' + item.name, icon: 'none' })
}

const deleteAddress = (id: number) => {
  uni.showModal({
    title: '提示',
    content: '确定删除该地址吗？',
    success: (res) => {
      if (res.confirm) {
        addressList.value = addressList.value.filter(item => item.id !== id)
        uni.showToast({ title: '已删除', icon: 'success' })
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
</style>
