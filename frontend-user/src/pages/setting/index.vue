<template>
  <view class="setting-page">
    <view class="setting-section">
      <view class="setting-item" @click="goAccount">
        <text class="item-label">账号与安全</text>
        <text class="arrow">></text>
      </view>
      <view class="setting-item" @click="goMessageSetting">
        <text class="item-label">消息通知</text>
        <text class="arrow">></text>
      </view>
      <view class="setting-item" @click="goPrivacy">
        <text class="item-label">隐私设置</text>
        <text class="arrow">></text>
      </view>
    </view>

    <view class="setting-section">
      <view class="setting-item" @click="goAddress">
        <text class="item-label">收货地址管理</text>
        <text class="arrow">></text>
      </view>
      <view class="setting-item" @click="clearCache">
        <text class="item-label">清除缓存</text>
        <view class="item-value">
          <text class="cache-size">{{ cacheSize }}</text>
          <text class="arrow">></text>
        </view>
      </view>
    </view>

    <view class="setting-section">
      <view class="setting-item" @click="goAbout">
        <text class="item-label">关于云亩</text>
        <view class="item-value">
          <text class="version">v1.0.0</text>
          <text class="arrow">></text>
        </view>
      </view>
      <view class="setting-item" @click="goAgreement">
        <text class="item-label">用户协议</text>
        <text class="arrow">></text>
      </view>
      <view class="setting-item" @click="goPrivacyPolicy">
        <text class="item-label">隐私政策</text>
        <text class="arrow">></text>
      </view>
    </view>

    <view class="logout-section" v-if="isLogin">
      <view class="logout-btn" @click="handleLogout">退出登录</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { isLogin } = storeToRefs(userStore)

const cacheSize = ref('12.5 MB')

const goAccount = () => {
  uni.showToast({ title: '账号与安全', icon: 'none' })
}

const goMessageSetting = () => {
  uni.showToast({ title: '消息通知', icon: 'none' })
}

const goPrivacy = () => {
  uni.showToast({ title: '隐私设置', icon: 'none' })
}

const goAddress = () => {
  uni.navigateTo({ url: '/pages/address/index' })
}

const clearCache = () => {
  uni.showModal({
    title: '提示',
    content: '确定清除缓存吗？',
    success: (res) => {
      if (res.confirm) {
        cacheSize.value = '0 KB'
        uni.showToast({ title: '清除成功', icon: 'success' })
      }
    }
  })
}

const goAbout = () => {
  uni.navigateTo({ url: '/pages/about/index' })
}

const goAgreement = () => {
  uni.showToast({ title: '用户协议', icon: 'none' })
}

const goPrivacyPolicy = () => {
  uni.showToast({ title: '隐私政策', icon: 'none' })
}

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        uni.showToast({ title: '已退出登录', icon: 'success' })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.setting-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-top: 20rpx;
}

.setting-section {
  background-color: #fff;
  margin-bottom: 20rpx;

  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .item-label {
      font-size: 28rpx;
      color: #333;
    }

    .item-value {
      display: flex;
      align-items: center;

      .cache-size,
      .version {
        font-size: 26rpx;
        color: #999;
        margin-right: 10rpx;
      }
    }

    .arrow {
      font-size: 28rpx;
      color: #ccc;
    }
  }
}

.logout-section {
  padding: 40rpx 30rpx;

  .logout-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 88rpx;
    background-color: #fff;
    color: #ff4757;
    font-size: 30rpx;
    border-radius: 44rpx;
  }
}
</style>
