<template>
  <view class="recharge-page">
    <view class="navbar-container" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="navbar-content" :style="{ height: navBarHeight + 'px' }">
        <view class="navbar-left" @click="goHome">
          <view class="back-capsule">
            <text class="back-icon">🏠</text>
            <text class="back-text">首页</text>
          </view>
        </view>
        <view class="navbar-title">
          <text class="title-text">充值记录</text>
        </view>
        <view class="navbar-right"></view>
      </view>
    </view>

    <view class="page-content">
      <view class="recharge-header">
        <view class="header-content">
          <text class="title">充值记录</text>
          <text class="subtitle">查看您的所有充值明细</text>
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

      <scroll-view scroll-y class="recharge-scroll" @scrolltolower="loadMore">
        <view class="scroll-content">
          <view class="recharge-item" v-for="item in rechargeList" :key="item.id">
          <view class="recharge-info">
            <view class="recharge-amount">
              <text class="amount-text">+¥{{ item.amount }}</text>
            </view>
            <view class="recharge-detail">
              <text class="recharge-time">{{ item.time }}</text>
              <text class="recharge-method">{{ item.method }}</text>
            </view>
          </view>
          <view class="recharge-status" :class="item.status">
            {{ getStatusText(item.status) }}
          </view>
        </view>

        <view class="empty-recharge" v-if="rechargeList.length === 0 && !loading">
          <text class="empty-icon">💳</text>
          <text class="empty-text">暂无充值记录</text>
        </view>

        <view class="loading-more" v-if="loading">
          <text>加载中...</text>
        </view>
        <view class="no-more" v-else-if="noMore && rechargeList.length > 0">
          <text>没有更多了</text>
        </view>
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
const rechargeList = ref<any[]>([])
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = 10

const tabList = [
  { type: 'all', name: '全部' },
  { type: 'pending', name: '充值中' },
  { type: 'success', name: '已完成' },
  { type: 'failed', name: '已失败' }
]

const mockRecharges: Record<string, any[]> = {
  all: [
    { id: 1, amount: '200.00', time: '2026-07-01 10:15:30', method: '微信支付', status: 'success' },
    { id: 2, amount: '500.00', time: '2026-06-28 14:20:15', method: '支付宝', status: 'success' },
    { id: 3, amount: '1000.00', time: '2026-06-25 09:30:00', method: '银行卡', status: 'success' },
    { id: 4, amount: '100.00', time: '2026-06-20 16:45:22', method: '微信支付', status: 'failed' },
    { id: 5, amount: '300.00', time: '2026-06-18 11:00:00', method: '支付宝', status: 'success' },
    { id: 6, amount: '50.00', time: '2026-06-15 08:30:00', method: '微信支付', status: 'pending' },
    { id: 7, amount: '800.00', time: '2026-06-10 15:20:00', method: '银行卡', status: 'success' },
    { id: 8, amount: '150.00', time: '2026-06-05 13:10:00', method: '微信支付', status: 'success' },
    { id: 9, amount: '68.00', time: '2026-06-02 10:05:00', method: '支付宝', status: 'failed' },
    { id: 10, amount: '200.00', time: '2026-06-01 09:00:00', method: '微信支付', status: 'success' }
  ],
  pending: [
    { id: 6, amount: '50.00', time: '2026-06-15 08:30:00', method: '微信支付', status: 'pending' }
  ],
  success: [
    { id: 1, amount: '200.00', time: '2026-07-01 10:15:30', method: '微信支付', status: 'success' },
    { id: 2, amount: '500.00', time: '2026-06-28 14:20:15', method: '支付宝', status: 'success' },
    { id: 3, amount: '1000.00', time: '2026-06-25 09:30:00', method: '银行卡', status: 'success' },
    { id: 5, amount: '300.00', time: '2026-06-18 11:00:00', method: '支付宝', status: 'success' },
    { id: 7, amount: '800.00', time: '2026-06-10 15:20:00', method: '银行卡', status: 'success' },
    { id: 8, amount: '150.00', time: '2026-06-05 13:10:00', method: '微信支付', status: 'success' },
    { id: 10, amount: '200.00', time: '2026-06-01 09:00:00', method: '微信支付', status: 'success' }
  ],
  failed: [
    { id: 4, amount: '100.00', time: '2026-06-20 16:45:22', method: '微信支付', status: 'failed' },
    { id: 9, amount: '68.00', time: '2026-06-02 10:05:00', method: '支付宝', status: 'failed' }
  ]
}

const loadRecharges = () => {
  loading.value = true
  setTimeout(() => {
    rechargeList.value = [...(mockRecharges[currentTab.value] || [])]
    loading.value = false
    noMore.value = true
  }, 500)
}

const loadMore = () => {
  if (loading.value || noMore.value) return
  page.value++
  loadRecharges()
}

const switchTab = (type: string) => {
  currentTab.value = type
  page.value = 1
  rechargeList.value = []
  noMore.value = false
  loadRecharges()
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '充值中',
    success: '已完成',
    failed: '已失败'
  }
  return statusMap[status] || status
}

const goHome = () => {
  uni.switchTab({ url: '/pages/home/index' })
}

onMounted(() => {
  loadRecharges()
})
</script>

<style lang="scss" scoped>
.recharge-page {
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

.recharge-header {
  background: linear-gradient(135deg, #0984e3, #74b9ff);
  padding: 30rpx 30rpx 40rpx;

  .header-content {
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
      color: #0984e3;
      font-weight: bold;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 40rpx;
        height: 4rpx;
        background-color: #0984e3;
        border-radius: 2rpx;
      }
    }
  }
}

.recharge-scroll {
  flex: 1;
}

.scroll-content {
  padding: 20rpx;
}

.recharge-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 30rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;

  .recharge-info {
    flex: 1;

    .recharge-amount {
      .amount-text {
        font-size: 36rpx;
        font-weight: bold;
        color: #00b894;
      }
    }

    .recharge-detail {
      display: flex;
      align-items: center;
      margin-top: 10rpx;
      gap: 20rpx;

      .recharge-time {
        font-size: 24rpx;
        color: #999;
      }

      .recharge-method {
        font-size: 24rpx;
        color: #666;
        padding: 4rpx 12rpx;
        background-color: #f5f5f5;
        border-radius: 8rpx;
      }
    }
  }

  .recharge-status {
    font-size: 26rpx;
    padding: 8rpx 20rpx;
    border-radius: 20rpx;

    &.pending {
      color: #f39c12;
      background-color: rgba(243, 156, 18, 0.1);
    }

    &.success {
      color: #00b894;
      background-color: rgba(0, 184, 148, 0.1);
    }

    &.failed {
      color: #e74c3c;
      background-color: rgba(231, 76, 60, 0.1);
    }
  }
}

.empty-recharge {
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
