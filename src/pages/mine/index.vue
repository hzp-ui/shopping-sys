<template>
  <view class="mine-container">
    <view class="mine-header">
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
      <view class="header-content">
        <view class="user-info" v-if="isLogin" @click="goProfile">
          <image :src="userInfo.avatar" mode="aspectFill" class="avatar" @error="onAvatarError" />
          <view class="info">
            <text class="nickname">{{ userInfo.nickname }}</text>
            <text class="user-id">ID: {{ userInfo.id }}</text>
          </view>
          <text class="arrow">></text>
        </view>
        <view class="user-info" v-else @click="goLogin">
          <view class="avatar-placeholder">
            <text class="avatar-icon">👤</text>
          </view>
          <view class="info">
            <text class="login-tip">点击登录/注册</text>
            <text class="login-desc">登录享更多优惠</text>
          </view>
          <text class="arrow">></text>
        </view>
      </view>
    </view>

    <view class="order-section">
      <view class="section-header">
        <text class="section-title">我的订单</text>
        <view class="all-order" @click="goOrderList(0)">
          <text>全部订单</text>
          <text class="arrow">></text>
        </view>
      </view>
      <view class="order-tabs">
        <view class="tab-item" v-for="item in orderTabs" :key="item.status" @click="goOrderList(item.status)">
          <view class="tab-icon">{{ item.icon }}</view>
          <text class="tab-text">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-item" v-for="item in menuList" :key="item.index" @click="handleMenuClick(item)">
        <text class="menu-icon">{{ item.icon }}</text>
        <text class="menu-name">{{ item.name }}</text>
        <text class="arrow">></text>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-item" @click="handleSetting">
        <text class="menu-icon">⚙️</text>
        <text class="menu-name">设置</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @click="handleAbout">
        <text class="menu-icon">ℹ️</text>
        <text class="menu-name">关于我们</text>
        <text class="arrow">></text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const defaultAvatar = 'https://picsum.photos/id/1005/200/200'

const userStore = useUserStore()
const { userInfo, isLogin } = storeToRefs(userStore)

const statusBarHeight = ref(20)

uni.getSystemInfo({
  success: (res) => {
    statusBarHeight.value = res.statusBarHeight || 20
  }
})

const orderTabs = [
  { status: 1, name: '待付款', icon: '💰' },
  { status: 2, name: '待发货', icon: '📦' },
  { status: 3, name: '待收货', icon: '🚚' },
  { status: 4, name: '待评价', icon: '✍️' },
  { status: 5, name: '退款/售后', icon: '🔄' }
]

const menuList = [
  { index: 1, name: '收货地址', icon: '📍', path: '/pages/address/index' },
  { index: 2, name: '优惠券', icon: '🎫', path: '/pages/coupon/index' },
  { index: 3, name: '收藏夹', icon: '❤️', path: '/pages/favorite/index' },
  { index: 4, name: '足迹', icon: '👣', path: '/pages/footprint/index' },
  { index: 5, name: '我的钱包', icon: '💰', path: '/pages/wallet/index' },
  { index: 6, name: '发票中心', icon: '🧾', path: '/pages/invoice/index' },
  { index: 7, name: '分销中心', icon: '🤝', path: '/pages/distribution/center' },
  { index: 8, name: '积分商城', icon: '🎁', path: '/pages/points/index' },
  { index: 9, name: '客服中心', icon: '💬', path: '/pages/service/index' }
]

const goProfile = () => {
  uni.navigateTo({ url: '/pages/profile/index' })
}

const goLogin = () => {
  uni.navigateTo({ url: '/pages/login/index' })
}

const goOrderList = (status: number) => {
  if (status === 5) {
    uni.navigateTo({ url: '/pages/order/aftersale' })
  } else {
    uni.navigateTo({ url: `/pages/order/list?status=${status}` })
  }
}

const handleMenuClick = (item: any) => {
  if (item.path) {
    uni.navigateTo({ url: item.path })
  }
}

const handleSetting = () => {
  uni.navigateTo({ url: '/pages/setting/index' })
}

const handleAbout = () => {
  uni.navigateTo({ url: '/pages/about/index' })
}

const onAvatarError = () => {
  if (userStore.userInfo) {
    userStore.userInfo.avatar = defaultAvatar
  }
}
</script>

<style lang="scss" scoped>
.mine-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.mine-header {
  background: linear-gradient(135deg, #ff6b00, #ff8c00);
  padding-bottom: 40rpx;

  .header-content {
    padding: 20rpx 30rpx;
  }

  .user-info {
    display: flex;
    align-items: center;

    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      border: 4rpx solid #fff;
      margin-right: 20rpx;
    }

    .avatar-placeholder {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20rpx;

      .avatar-icon {
        font-size: 60rpx;
      }
    }

    .info {
      flex: 1;
      display: flex;
      flex-direction: column;

      .nickname {
        font-size: 32rpx;
        font-weight: bold;
        color: #fff;
      }

      .user-id {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.8);
        margin-top: 10rpx;
      }

      .login-tip {
        font-size: 32rpx;
        font-weight: bold;
        color: #fff;
      }

      .login-desc {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.8);
        margin-top: 10rpx;
      }
    }

    .arrow {
      color: rgba(255, 255, 255, 0.8);
      font-size: 30rpx;
    }
  }
}

.order-section {
  margin: 20rpx 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx 0;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30rpx 20rpx;
    border-bottom: 1rpx solid #f5f5f5;

    .section-title {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
    }

    .all-order {
      display: flex;
      align-items: center;
      font-size: 26rpx;
      color: #666;

      .arrow {
        margin-left: 10rpx;
      }
    }
  }

  .order-tabs {
    display: flex;
    padding-top: 20rpx;

    .tab-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;

      .tab-icon {
        font-size: 40rpx;
        margin-bottom: 10rpx;
      }

      .tab-text {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

.menu-section {
  margin: 20rpx 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;

  .menu-item {
    display: flex;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .menu-icon {
      font-size: 36rpx;
      margin-right: 20rpx;
    }

    .menu-name {
      flex: 1;
      font-size: 28rpx;
      color: #333;
    }

    .arrow {
      font-size: 28rpx;
      color: #ccc;
    }
  }
}
</style>
