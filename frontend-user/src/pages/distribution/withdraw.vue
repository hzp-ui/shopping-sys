<template>
  <view class="withdraw-page">
    <view class="navbar-container" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="navbar-content" :style="{ height: navBarHeight + 'px' }">
        <view class="navbar-left" @click="goHome">
          <view class="back-capsule">
            <text class="back-icon">🏠</text>
            <text class="back-text">首页</text>
          </view>
        </view>
        <view class="navbar-title">
          <text class="title-text">提现申请</text>
        </view>
        <view class="navbar-right"></view>
      </view>
    </view>

    <view class="page-content">
      <view class="withdraw-header">
        <text class="balance-label">可提现佣金（元）</text>
        <text class="balance-amount">¥1288.50</text>
      </view>

      <view class="withdraw-card">
        <view class="form-item">
          <text class="form-label">提现金额</text>
          <view class="amount-input-wrap">
          <text class="currency-symbol">¥</text>
          <input
            class="amount-input"
            type="digit"
            v-model="withdrawAmount"
            placeholder="请输入提现金额"
            placeholder-class="input-placeholder"
          />
        </view>
        <view class="withdraw-all" @click="withdrawAll">全部提现</view>
        </view>

        <view class="form-item">
          <text class="form-label">提现方式</text>
          <view class="method-list">
            <view
              class="method-item"
              :class="{ active: selectedMethod === 'wechat' }"
              @click="selectMethod('wechat')"
            >
              <text class="method-icon">💚</text>
              <text class="method-name">微信</text>
              <view class="method-check" v-if="selectedMethod === 'wechat'">✓</view>
            </view>
            <view
              class="method-item"
              :class="{ active: selectedMethod === 'alipay' }"
              @click="selectMethod('alipay')"
            >
              <text class="method-icon">💙</text>
              <text class="method-name">支付宝</text>
              <view class="method-check" v-if="selectedMethod === 'alipay'">✓</view>
            </view>
            <view
              class="method-item"
              :class="{ active: selectedMethod === 'bank' }"
              @click="selectMethod('bank')"
            >
              <text class="method-icon">🏦</text>
              <text class="method-name">银行卡</text>
              <view class="method-check" v-if="selectedMethod === 'bank'">✓</view>
            </view>
          </view>
        </view>
      </view>

      <view class="record-entry" @click="goWithdrawRecord">
        <view class="entry-left">
          <text class="entry-icon">📋</text>
          <text class="entry-text">提现记录</text>
        </view>
        <text class="entry-arrow">›</text>
      </view>

      <view class="rules-card">
        <view class="rules-title">
          <text class="rules-icon">📌</text>
          <text class="rules-text">提现规则</text>
        </view>
        <view class="rules-list">
          <text class="rule-item">• 最低提现金额为 10 元</text>
          <text class="rule-item">• 提现申请提交后，T+3 个工作日内到账</text>
          <text class="rule-item">• 单笔提现最高限额为 5000 元</text>
          <text class="rule-item">• 每月最多可提现 5 次</text>
          <text class="rule-item">• 如遇节假日到账时间可能会有所顺延</text>
        </view>
      </view>

      <view class="submit-section">
        <button class="submit-btn" @click="submitWithdraw">提交申请</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const statusBarHeight = ref(20)
const navBarHeight = ref(44)
const withdrawAmount = ref('')
const selectedMethod = ref('wechat')

const sysInfo = uni.getSystemInfoSync()
statusBarHeight.value = sysInfo.statusBarHeight || 20
const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
if (menuButtonInfo) {
  navBarHeight.value = (menuButtonInfo.top - statusBarHeight.value) * 2 + menuButtonInfo.height
}

const goHome = () => {
  uni.switchTab({ url: '/pages/home/index' })
}

const selectMethod = (method: string) => {
  selectedMethod.value = method
}

const withdrawAll = () => {
  withdrawAmount.value = '1288.50'
}

const goWithdrawRecord = () => {
  uni.showToast({ title: '提现记录', icon: 'none' })
}

const submitWithdraw = () => {
  if (!withdrawAmount.value || parseFloat(withdrawAmount.value) <= 0) {
    uni.showToast({ title: '请输入提现金额', icon: 'none' })
    return
  }
  if (parseFloat(withdrawAmount.value) < 10) {
    uni.showToast({ title: '最低提现10元', icon: 'none' })
    return
  }
  if (parseFloat(withdrawAmount.value) > 1288.50) {
    uni.showToast({ title: '提现金额不足', icon: 'none' })
    return
  }
  uni.showModal({
    title: '提现确认',
    content: `确认提现 ¥${withdrawAmount.value} 元到${selectedMethod.value === 'wechat' ? '微信' : selectedMethod.value === 'alipay' ? '支付宝' : '银行卡'}？`,
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '申请已提交', icon: 'success' })
        withdrawAmount.value = ''
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.withdraw-page {
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

.withdraw-header {
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  padding: 50rpx 30rpx 60rpx;
  text-align: center;

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

.withdraw-card {
  background-color: #fff;
  margin: -20rpx 20rpx 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
  position: relative;
  z-index: 10;

  .form-item {
    margin-bottom: 30rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .form-label {
      display: block;
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
      margin-bottom: 20rpx;
    }

    .amount-input-wrap {
      display: flex;
      align-items: center;
      border-bottom: 2rpx solid #eee;
      padding-bottom: 20rpx;
      margin-bottom: 16rpx;

      .currency-symbol {
        font-size: 36rpx;
        color: #333;
        font-weight: bold;
        margin-right: 10rpx;
      }

      .amount-input {
        flex: 1;
        font-size: 48rpx;
        font-weight: bold;
        color: #333;
      }

      .input-placeholder {
        font-size: 28rpx;
        color: #ccc;
        font-weight: normal;
      }
    }

    .withdraw-all {
      text-align: right;
      font-size: 24rpx;
      color: #6c5ce7;
    }

    .method-list {
      display: flex;
      gap: 20rpx;

      .method-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 24rpx 16rpx;
        border: 2rpx solid #eee;
        border-radius: 12rpx;
        position: relative;

        &.active {
          border-color: #6c5ce7;
          background-color: rgba(108, 92, 231, 0.05);
        }

        .method-icon {
          font-size: 40rpx;
          margin-bottom: 10rpx;
        }

        .method-name {
          font-size: 24rpx;
          color: #333;
        }

        .method-check {
          position: absolute;
          top: 10rpx;
          right: 10rpx;
          width: 32rpx;
          height: 32rpx;
          background-color: #6c5ce7;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20rpx;
          color: #fff;
        }
      }
    }
  }
}

.record-entry {
  background-color: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .entry-left {
    display: flex;
    align-items: center;

    .entry-icon {
      font-size: 36rpx;
      margin-right: 16rpx;
    }

    .entry-text {
      font-size: 28rpx;
      color: #333;
    }
  }

  .entry-arrow {
    font-size: 32rpx;
    color: #ccc;
  }
}

.rules-card {
  background-color: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;

  .rules-title {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    .rules-icon {
      font-size: 28rpx;
      margin-right: 10rpx;
    }

    .rules-text {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
    }
  }

  .rules-list {
    .rule-item {
      display: block;
      font-size: 24rpx;
      color: #666;
      line-height: 1.8;
    }
  }
}

.submit-section {
  padding: 40rpx 20rpx;

  .submit-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: linear-gradient(135deg, #6c5ce7, #a29bfe);
    color: #fff;
    font-size: 32rpx;
    font-weight: bold;
    border-radius: 44rpx;
    border: none;
  }
}
</style>
