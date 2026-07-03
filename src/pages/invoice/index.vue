<template>
  <view class="invoice-page">
    <view class="navbar-container" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="navbar-content" :style="{ height: navBarHeight + 'px' }">
        <view class="navbar-left" @click="goHome">
          <view class="back-capsule">
            <text class="back-icon">🏠</text>
            <text class="back-text">首页</text>
          </view>
        </view>
        <view class="navbar-title">
          <text class="title-text">发票中心</text>
        </view>
        <view class="navbar-right"></view>
      </view>
    </view>

    <view class="page-content">
      <view class="invoice-header">
        <view class="header-content">
          <view class="amount-row">
            <view class="amount-item">
              <text class="amount-label">可开票金额</text>
              <text class="amount-value">¥{{ availableAmount }}</text>
            </view>
            <view class="amount-divider"></view>
            <view class="amount-item">
              <text class="amount-label">已开票金额</text>
              <text class="amount-value">¥{{ invoicedAmount }}</text>
            </view>
          </view>
          <view class="quick-btns">
            <view class="quick-btn" @click="goApply">
              <text class="quick-btn-icon">📝</text>
              <text class="quick-btn-text">申请开票</text>
            </view>
            <view class="quick-btn" @click="goRecord">
              <text class="quick-btn-icon">📋</text>
              <text class="quick-btn-text">开票记录</text>
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

      <scroll-view scroll-y class="invoice-scroll" @scrolltolower="loadMore">
        <view class="scroll-content">
          <view class="invoice-item" v-for="item in invoiceList" :key="item.id" @click="goDetail(item)">
          <view class="invoice-header-row">
            <text class="order-no">订单号：{{ item.orderNo }}</text>
            <text class="invoice-status" :class="item.status">{{ statusText[item.status] }}</text>
          </view>
          <view class="invoice-body">
            <view class="invoice-type">
              <text class="type-icon">📄</text>
              <text class="type-text">{{ item.invoiceType }}</text>
            </view>
            <view class="invoice-amount">
              <text class="amount-label">开票金额</text>
              <text class="amount-num">¥{{ item.amount }}</text>
            </view>
          </view>
          <view class="invoice-footer">
            <text class="invoice-time">{{ item.invoiceTime }}</text>
            <text class="invoice-action">查看详情 ›</text>
          </view>
        </view>

        <view class="empty-invoice" v-if="invoiceList.length === 0 && !loading">
          <text class="empty-icon">📄</text>
          <text class="empty-text">暂无发票记录</text>
        </view>

        <view class="loading-more" v-if="loading">
          <text>加载中...</text>
        </view>
        <view class="no-more" v-else-if="noMore && invoiceList.length > 0">
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
const invoiceList = ref<any[]>([])
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = 10
const availableAmount = ref('1,280.00')
const invoicedAmount = ref('3,560.00')

const statusText: Record<string, string> = {
  pending: '待开票',
  processing: '开票中',
  completed: '已完成',
  failed: '已失败'
}

const tabList = [
  { type: 'all', name: '全部' },
  { type: 'pending', name: '待开票' },
  { type: 'processing', name: '开票中' },
  { type: 'completed', name: '已完成' },
  { type: 'failed', name: '已失败' }
]

const mockInvoices: Record<string, any[]> = {
  all: [
    { id: 1, orderNo: 'ORD202607010001', invoiceType: '电子普通发票', amount: '299.00', status: 'completed', invoiceTime: '2026-07-01 14:30:00' },
    { id: 2, orderNo: 'ORD202606280002', invoiceType: '电子普通发票', amount: '599.00', status: 'processing', invoiceTime: '2026-06-28 10:20:00' },
    { id: 3, orderNo: 'ORD202606250003', invoiceType: '增值税专用发票', amount: '1,280.00', status: 'pending', invoiceTime: '2026-06-25 16:45:00' },
    { id: 4, orderNo: 'ORD202606200004', invoiceType: '电子普通发票', amount: '89.90', status: 'completed', invoiceTime: '2026-06-20 09:15:00' },
    { id: 5, orderNo: 'ORD202606180005', invoiceType: '电子普通发票', amount: '199.00', status: 'failed', invoiceTime: '2026-06-18 11:30:00' },
    { id: 6, orderNo: 'ORD202606150006', invoiceType: '增值税专用发票', amount: '2,560.00', status: 'completed', invoiceTime: '2026-06-15 15:00:00' },
    { id: 7, orderNo: 'ORD202606100007', invoiceType: '电子普通发票', amount: '158.00', status: 'pending', invoiceTime: '2026-06-10 08:45:00' },
    { id: 8, orderNo: 'ORD202606050008', invoiceType: '电子普通发票', amount: '459.00', status: 'completed', invoiceTime: '2026-06-05 13:20:00' },
    { id: 9, orderNo: 'ORD202606010009', invoiceType: '增值税专用发票', amount: '899.00', status: 'processing', invoiceTime: '2026-06-01 17:10:00' }
  ],
  pending: [
    { id: 3, orderNo: 'ORD202606250003', invoiceType: '增值税专用发票', amount: '1,280.00', status: 'pending', invoiceTime: '2026-06-25 16:45:00' },
    { id: 7, orderNo: 'ORD202606100007', invoiceType: '电子普通发票', amount: '158.00', status: 'pending', invoiceTime: '2026-06-10 08:45:00' }
  ],
  processing: [
    { id: 2, orderNo: 'ORD202606280002', invoiceType: '电子普通发票', amount: '599.00', status: 'processing', invoiceTime: '2026-06-28 10:20:00' },
    { id: 9, orderNo: 'ORD202606010009', invoiceType: '增值税专用发票', amount: '899.00', status: 'processing', invoiceTime: '2026-06-01 17:10:00' }
  ],
  completed: [
    { id: 1, orderNo: 'ORD202607010001', invoiceType: '电子普通发票', amount: '299.00', status: 'completed', invoiceTime: '2026-07-01 14:30:00' },
    { id: 4, orderNo: 'ORD202606200004', invoiceType: '电子普通发票', amount: '89.90', status: 'completed', invoiceTime: '2026-06-20 09:15:00' },
    { id: 6, orderNo: 'ORD202606150006', invoiceType: '增值税专用发票', amount: '2,560.00', status: 'completed', invoiceTime: '2026-06-15 15:00:00' },
    { id: 8, orderNo: 'ORD202606050008', invoiceType: '电子普通发票', amount: '459.00', status: 'completed', invoiceTime: '2026-06-05 13:20:00' }
  ],
  failed: [
    { id: 5, orderNo: 'ORD202606180005', invoiceType: '电子普通发票', amount: '199.00', status: 'failed', invoiceTime: '2026-06-18 11:30:00' }
  ]
}

const loadInvoices = () => {
  loading.value = true
  setTimeout(() => {
    invoiceList.value = [...(mockInvoices[currentTab.value] || [])]
    loading.value = false
    noMore.value = true
  }, 500)
}

const loadMore = () => {
  if (loading.value || noMore.value) return
  page.value++
  loadInvoices()
}

const switchTab = (type: string) => {
  currentTab.value = type
  page.value = 1
  invoiceList.value = []
  noMore.value = false
  loadInvoices()
}

const goHome = () => {
  uni.switchTab({ url: '/pages/home/index' })
}

const goDetail = (item: any) => {
  uni.navigateTo({ url: '/pages/invoice/detail?id=' + item.id })
}

const goApply = () => {
  uni.navigateTo({ url: '/pages/invoice/apply' })
}

const goRecord = () => {
  switchTab('all')
}

onMounted(() => {
  loadInvoices()
})
</script>

<style lang="scss" scoped>
.invoice-page {
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

.invoice-header {
  background: linear-gradient(135deg, #00cec9, #81ecec);
  padding: 30rpx 30rpx 40rpx;

  .header-content {
    .amount-row {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 20rpx 0;
    }

    .amount-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .amount-label {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 10rpx;
      }

      .amount-value {
        font-size: 40rpx;
        font-weight: bold;
        color: #fff;
      }
    }

    .amount-divider {
      width: 2rpx;
      height: 60rpx;
      background-color: rgba(255, 255, 255, 0.3);
    }

    .quick-btns {
      display: flex;
      justify-content: space-around;
      margin-top: 30rpx;
    }

    .quick-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20rpx 40rpx;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 12rpx;

      .quick-btn-icon {
        font-size: 36rpx;
        margin-bottom: 8rpx;
      }

      .quick-btn-text {
        font-size: 24rpx;
        color: #fff;
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
      color: #00cec9;
      font-weight: bold;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 40rpx;
        height: 4rpx;
        background-color: #00cec9;
        border-radius: 2rpx;
      }
    }
  }
}

.invoice-scroll {
  flex: 1;
}

.scroll-content {
  padding: 20rpx;
}

.invoice-item {
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 25rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.03);
}

.invoice-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 15rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .order-no {
    font-size: 24rpx;
    color: #999;
  }

  .invoice-status {
    font-size: 24rpx;
    font-weight: bold;
    padding: 6rpx 16rpx;
    border-radius: 20rpx;

    &.pending {
      color: #f39c12;
      background-color: rgba(243, 156, 18, 0.1);
    }

    &.processing {
      color: #3498db;
      background-color: rgba(52, 152, 219, 0.1);
    }

    &.completed {
      color: #27ae60;
      background-color: rgba(39, 174, 96, 0.1);
    }

    &.failed {
      color: #95a5a6;
      background-color: rgba(149, 165, 166, 0.1);
    }
  }
}

.invoice-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;

  .invoice-type {
    display: flex;
    align-items: center;

    .type-icon {
      font-size: 32rpx;
      margin-right: 10rpx;
    }

    .type-text {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
    }
  }

  .invoice-amount {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .amount-label {
      font-size: 22rpx;
      color: #999;
      margin-bottom: 5rpx;
    }

    .amount-num {
      font-size: 32rpx;
      font-weight: bold;
      color: #e74c3c;
    }
  }
}

.invoice-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .invoice-time {
    font-size: 22rpx;
    color: #999;
  }

  .invoice-action {
    font-size: 24rpx;
    color: #00cec9;
  }
}

.empty-invoice {
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
