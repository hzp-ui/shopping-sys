<template>
  <view class="coupon-center-page">
    <view class="navbar-container" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="navbar-content" :style="{ height: navBarHeight + 'px' }">
        <view class="navbar-left" @click="goHome">
          <view class="back-capsule">
            <text class="back-icon">🏠</text>
            <text class="back-text">首页</text>
          </view>
        </view>
        <view class="navbar-title">
          <text class="title-text">领券中心</text>
        </view>
        <view class="navbar-right"></view>
      </view>
    </view>

    <view class="page-content">
    <view class="coupon-header">
      <view class="header-content">
        <view class="header-top">
          <view class="title-wrap">
            <text class="title">领券中心</text>
            <text class="subtitle">好券天天领，省钱小能手</text>
          </view>
          <view class="my-coupon-btn" @click="goMyCoupon">
            <text class="my-coupon-text">我的优惠券</text>
            <text class="my-coupon-arrow">›</text>
          </view>
        </view>
      </view>
    </view>

    <view class="tabs">
      <view
        class="tab-item"
        :class="{ active: currentTab === item.type }"
        v-for="item in tabList"
        :key="item.type"
        @click="switchTab(item.type)"
      >
        {{ item.name }}
      </view>
    </view>

    <scroll-view scroll-y class="coupon-scroll" @scrolltolower="loadMore">
      <view class="coupon-item" v-for="item in couponList" :key="item.id">
        <view class="coupon-left">
          <text class="coupon-amount">¥{{ item.amount }}</text>
          <text class="coupon-condition">满{{ item.minAmount }}可用</text>
        </view>
        <view class="coupon-right">
          <text class="coupon-name">{{ item.name }}</text>
          <text class="coupon-time">{{ item.startTime }} - {{ item.endTime }}</text>
          <text class="coupon-count">已领{{ item.receivedCount }}张</text>
          <view
            class="receive-btn"
            :class="{ received: item.received }"
            @click="receiveCoupon(item)"
          >
            {{ item.received ? '已领取' : '立即领取' }}
          </view>
        </view>
      </view>

      <view class="empty-coupon" v-if="couponList.length === 0 && !loading">
        <text class="empty-icon">🎫</text>
        <text class="empty-text">暂无优惠券</text>
      </view>

      <view class="loading-more" v-if="loading">
        <text>加载中...</text>
      </view>
      <view class="no-more" v-else-if="noMore && couponList.length > 0">
        <text>没有更多了</text>
      </view>
    </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const statusBarHeight = ref(20)
const navBarHeight = ref(44)

const sysInfo = uni.getSystemInfoSync()
statusBarHeight.value = sysInfo.statusBarHeight || 20
const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
if (menuButtonInfo) {
  navBarHeight.value = (menuButtonInfo.top - statusBarHeight.value) * 2 + menuButtonInfo.height
}

const currentTab = ref('all')
const couponList = ref<any[]>([])
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = 10

const tabList = [
  { type: 'all', name: '全部' },
  { type: 'full', name: '满减券' },
  { type: 'new', name: '新人专享' },
  { type: 'category', name: '品类券' }
]

const mockCoupons: Record<string, any[]> = {
  all: [
    { id: 1, name: '新人专享优惠券', amount: 10, minAmount: 50, startTime: '2026-07-01', endTime: '2026-07-31', receivedCount: 12580, received: false },
    { id: 2, name: '满减优惠券', amount: 20, minAmount: 100, startTime: '2026-07-01', endTime: '2026-07-15', receivedCount: 8960, received: false },
    { id: 3, name: '生鲜品类券', amount: 5, minAmount: 30, startTime: '2026-07-01', endTime: '2026-08-01', receivedCount: 5680, received: true },
    { id: 4, name: '数码品类券', amount: 50, minAmount: 500, startTime: '2026-07-01', endTime: '2026-07-31', receivedCount: 3200, received: false }
  ],
  full: [
    { id: 2, name: '满减优惠券', amount: 20, minAmount: 100, startTime: '2026-07-01', endTime: '2026-07-15', receivedCount: 8960, received: false }
  ],
  new: [
    { id: 1, name: '新人专享优惠券', amount: 10, minAmount: 50, startTime: '2026-07-01', endTime: '2026-07-31', receivedCount: 12580, received: false }
  ],
  category: [
    { id: 3, name: '生鲜品类券', amount: 5, minAmount: 30, startTime: '2026-07-01', endTime: '2026-08-01', receivedCount: 5680, received: true },
    { id: 4, name: '数码品类券', amount: 50, minAmount: 500, startTime: '2026-07-01', endTime: '2026-07-31', receivedCount: 3200, received: false }
  ]
}

const loadCoupons = () => {
  loading.value = true
  setTimeout(() => {
    couponList.value = [...(mockCoupons[currentTab.value] || [])]
    loading.value = false
    noMore.value = true
  }, 500)
}

const loadMore = () => {
  if (loading.value || noMore.value) return
  page.value++
  loadCoupons()
}

const switchTab = (type: string) => {
  currentTab.value = type
  page.value = 1
  couponList.value = []
  noMore.value = false
  loadCoupons()
}

const receiveCoupon = (item: any) => {
  if (item.received) return
  uni.showModal({
    title: '领取成功',
    content: `恭喜您获得"${item.name}"`,
    showCancel: false,
    success: () => {
      item.received = true
    }
  })
}

const goHome = () => {
  uni.switchTab({ url: '/pages/home/index' })
}

const goMyCoupon = () => {
  uni.navigateTo({ url: '/pages/coupon/index' })
}

onMounted(() => {
  loadCoupons()
})
</script>

<style lang="scss" scoped>
.coupon-center-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.navbar-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: #fff;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.navbar-content {
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  position: relative;
}

.navbar-left {
  flex-shrink: 0;
  margin-right: 20rpx;
}

.back-capsule {
  display: flex;
  align-items: center;
  padding: 8rpx 16rpx;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 30rpx;

  .back-icon {
    font-size: 24rpx;
    color: #333;
    margin-right: 6rpx;
  }

  .back-text {
    font-size: 24rpx;
    color: #333;
  }
}

.navbar-title {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  .title-text {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }
}

.navbar-right {
  flex-shrink: 0;
  margin-left: 20rpx;
  min-width: 80rpx;
}

.page-content {
  padding-top: 180rpx;
}

.coupon-header {
  background: linear-gradient(135deg, #fdcb6e, #e17055);
  padding: 30rpx 30rpx 40rpx;

  .header-content {
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .title-wrap {
      flex: 1;
    }

    .title {
      display: block;
      font-size: 36rpx;
      font-weight: bold;
      color: #fff;
    }

    .subtitle {
      display: block;
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.8);
      margin-top: 10rpx;
    }

    .my-coupon-btn {
      display: flex;
      align-items: center;
      padding: 12rpx 24rpx;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 30rpx;

      .my-coupon-text {
        font-size: 24rpx;
        color: #fff;
      }

      .my-coupon-arrow {
        font-size: 28rpx;
        color: #fff;
        margin-left: 6rpx;
      }
    }
  }
}

.tabs {
  display: flex;
  background-color: #fff;

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 25rpx 0;
    font-size: 28rpx;
    color: #666;
    position: relative;

    &.active {
      color: #e17055;
      font-weight: bold;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 40rpx;
        height: 4rpx;
        background-color: #e17055;
        border-radius: 2rpx;
      }
    }
  }
}

.coupon-scroll {
  flex: 1;
  padding: 20rpx;
}

.coupon-item {
  display: flex;
  margin-bottom: 20rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background: linear-gradient(135deg, #fff5f0 0%, #fff 100%);
}

.coupon-left {
  width: 200rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff6b00 0%, #ff8c00 100%);
  color: #fff;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    right: -10rpx;
    top: 50%;
    transform: translateY(-50%);
    width: 20rpx;
    height: 20rpx;
    background-color: #f5f5f5;
    border-radius: 50%;
  }

  .coupon-amount {
    font-size: 48rpx;
    font-weight: bold;
    line-height: 1;
  }

  .coupon-condition {
    font-size: 22rpx;
    margin-top: 10rpx;
    opacity: 0.9;
  }
}

.coupon-right {
  flex: 1;
  padding: 25rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .coupon-name {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 10rpx;
  }

  .coupon-time {
    font-size: 22rpx;
    color: #999;
    margin-bottom: 8rpx;
  }

  .coupon-count {
    font-size: 22rpx;
    color: #999;
    margin-bottom: 15rpx;
  }

  .receive-btn {
    align-self: flex-start;
    padding: 10rpx 30rpx;
    background-color: #ff6b00;
    color: #fff;
    font-size: 24rpx;
    border-radius: 30rpx;

    &.received {
      background-color: #ccc;
    }
  }
}

.empty-coupon {
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
    font-size: 28rpx;
    color: #999;
  }
}

.loading-more,
.no-more {
  text-align: center;
  padding: 30rpx;
  font-size: 24rpx;
  color: #999;
}
</style>
