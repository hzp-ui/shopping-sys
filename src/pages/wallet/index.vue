<template>
  <view class="wallet-page">
    <view class="navbar-container" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="navbar-content" :style="{ height: navBarHeight + 'px' }">
        <view class="navbar-left" @click="goHome">
          <view class="back-capsule">
            <text class="back-icon">🏠</text>
            <text class="back-text">首页</text>
          </view>
        </view>
        <view class="navbar-title">
          <text class="title-text">我的钱包</text>
        </view>
        <view class="navbar-right"></view>
      </view>
    </view>

    <view class="page-content">
      <view class="wallet-header">
        <view class="header-content">
          <text class="balance-label">账户余额（元）</text>
          <text class="balance-amount">¥1288.50</text>
        </view>
        <view class="action-buttons">
          <view class="action-btn" @click="goRecharge">
            <text class="btn-icon">💰</text>
            <text class="btn-text">充值</text>
          </view>
          <view class="action-btn" @click="goWithdraw">
            <text class="btn-icon">💳</text>
            <text class="btn-text">提现</text>
          </view>
        </view>
      </view>

      <view class="function-entries">
        <view class="entry-item" @click="goRechargeRecord">
          <view class="entry-icon">📋</view>
          <text class="entry-text">充值记录</text>
          <text class="entry-arrow">›</text>
        </view>
        <view class="entry-item" @click="goWithdrawRecord">
          <view class="entry-icon">📝</view>
          <text class="entry-text">提现记录</text>
          <text class="entry-arrow">›</text>
        </view>
        <view class="entry-item">
          <view class="entry-icon">🏦</view>
          <text class="entry-text">银行卡</text>
          <text class="entry-arrow">›</text>
        </view>
        <view class="entry-item">
          <view class="entry-icon">⚙️</view>
          <text class="entry-text">支付设置</text>
          <text class="entry-arrow">›</text>
        </view>
      </view>

      <view class="recent-section">
        <view class="section-header">
          <text class="section-title">最近交易</text>
          <text class="section-more" @click="goAllRecords">查看全部 ›</text>
        </view>
        <view class="transaction-list">
          <view class="transaction-item" v-for="item in transactionList" :key="item.id">
            <view class="transaction-icon" :class="{ income: item.type === 'income', expense: item.type === 'expense' }">
              {{ item.icon }}
            </view>
            <view class="transaction-info">
              <text class="transaction-name">{{ item.name }}</text>
              <text class="transaction-time">{{ item.time }}</text>
            </view>
            <view class="transaction-amount" :class="{ income: item.type === 'income', expense: item.type === 'expense' }">
              {{ item.type === 'income' ? '+' : '-' }}¥{{ item.amount }}
            </view>
          </view>
        </view>
      </view>
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

const transactionList = ref([
  { id: 1, name: '订单退款', time: '2026-07-02 14:30', amount: '68.00', type: 'income', icon: '↩️' },
  { id: 2, name: '微信充值', time: '2026-07-01 10:15', amount: '200.00', type: 'income', icon: '💰' },
  { id: 3, name: '购物消费', time: '2026-06-30 19:45', amount: '156.80', type: 'expense', icon: '🛒' },
  { id: 4, name: '提现到银行卡', time: '2026-06-28 09:20', amount: '500.00', type: 'expense', icon: '💳' },
  { id: 5, name: '签到奖励', time: '2026-06-27 08:00', amount: '0.50', type: 'income', icon: '🎁' }
])

const goHome = () => {
  uni.switchTab({ url: '/pages/home/index' })
}

const goRecharge = () => {
  uni.navigateTo({ url: '/pages/wallet/recharge' })
}

const goWithdraw = () => {
  uni.navigateTo({ url: '/pages/wallet/withdraw' })
}

const goRechargeRecord = () => {
  uni.navigateTo({ url: '/pages/wallet/recharge' })
}

const goWithdrawRecord = () => {
  uni.navigateTo({ url: '/pages/wallet/withdraw-record' })
}

const goAllRecords = () => {
  uni.showToast({ title: '全部记录', icon: 'none' })
}

onMounted(() => {})
</script>

<style lang="scss" scoped>
.wallet-page {
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

.wallet-header {
  background: linear-gradient(135deg, #0984e3, #74b9ff);
  padding: 40rpx 30rpx 50rpx;

  .header-content {
    text-align: center;
    margin-bottom: 40rpx;

    .balance-label {
      display: block;
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 15rpx;
    }

    .balance-amount {
      display: block;
      font-size: 64rpx;
      font-weight: bold;
      color: #fff;
    }
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 60rpx;

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;

      .btn-icon {
        font-size: 48rpx;
        margin-bottom: 10rpx;
      }

      .btn-text {
        font-size: 26rpx;
        color: #fff;
      }
    }
  }
}

.function-entries {
  background-color: #fff;
  margin: -20rpx 20rpx 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
  position: relative;
  z-index: 10;

  .entry-item {
    display: flex;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .entry-icon {
      font-size: 40rpx;
      margin-right: 20rpx;
    }

    .entry-text {
      flex: 1;
      font-size: 28rpx;
      color: #333;
    }

    .entry-arrow {
      font-size: 32rpx;
      color: #ccc;
    }
  }
}

.recent-section {
  background-color: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;

    .section-title {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
    }

    .section-more {
      font-size: 24rpx;
      color: #0984e3;
    }
  }

  .transaction-list {
    .transaction-item {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .transaction-icon {
        width: 70rpx;
        height: 70rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
        margin-right: 20rpx;

        &.income {
          background-color: rgba(0, 184, 148, 0.1);
        }

        &.expense {
          background-color: rgba(231, 76, 60, 0.1);
        }
      }

      .transaction-info {
        flex: 1;

        .transaction-name {
          display: block;
          font-size: 28rpx;
          color: #333;
          margin-bottom: 8rpx;
        }

        .transaction-time {
          display: block;
          font-size: 22rpx;
          color: #999;
        }
      }

      .transaction-amount {
        font-size: 30rpx;
        font-weight: bold;

        &.income {
          color: #00b894;
        }

        &.expense {
          color: #e74c3c;
        }
      }
    }
  }
}
</style>
