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
        <view class="header-content">
          <text class="balance-label">可提现金额（元）</text>
          <text class="balance-amount">¥1288.50</text>
        </view>
      </view>

      <view class="withdraw-form">
        <view class="form-section">
          <text class="section-title">提现金额</text>
          <view class="amount-input-wrapper">
            <text class="currency-symbol">¥</text>
            <input
              type="digit"
              class="amount-input"
              v-model="withdrawAmount"
              placeholder="请输入提现金额"
              placeholder-class="placeholder-text"
            />
          </view>
          <view class="quick-amounts">
            <view
              class="quick-item"
              :class="{ active: selectedQuick === 100 }"
              @click="selectQuickAmount(100)"
            >
              100元
            </view>
            <view
              class="quick-item"
              :class="{ active: selectedQuick === 200 }"
              @click="selectQuickAmount(200)"
            >
              200元
            </view>
            <view
              class="quick-item"
              :class="{ active: selectedQuick === 500 }"
              @click="selectQuickAmount(500)"
            >
              500元
            </view>
            <view
              class="quick-item all-btn"
              @click="withdrawAll"
            >
              全部提现
            </view>
          </view>
        </view>

        <view class="form-section">
          <text class="section-title">提现方式</text>
          <view class="method-list">
            <view
              class="method-item"
              :class="{ active: selectedMethod === 'wechat' }"
              @click="selectMethod('wechat')"
            >
              <view class="method-icon wechat">💬</view>
              <view class="method-info">
                <text class="method-name">微信</text>
                <text class="method-desc">提现到微信钱包</text>
              </view>
              <view class="method-check">
                <view class="check-circle" v-if="selectedMethod === 'wechat'">✓</view>
              </view>
            </view>
            <view
              class="method-item"
              :class="{ active: selectedMethod === 'alipay' }"
              @click="selectMethod('alipay')"
            >
              <view class="method-icon alipay">💙</view>
              <view class="method-info">
                <text class="method-name">支付宝</text>
                <text class="method-desc">提现到支付宝账户</text>
              </view>
              <view class="method-check">
                <view class="check-circle" v-if="selectedMethod === 'alipay'">✓</view>
              </view>
            </view>
            <view
              class="method-item"
              :class="{ active: selectedMethod === 'bank' }"
              @click="selectMethod('bank')"
            >
              <view class="method-icon bank">🏦</view>
              <view class="method-info">
                <text class="method-name">银行卡</text>
                <text class="method-desc">中国工商银行 **** 8888</text>
              </view>
              <view class="method-check">
                <view class="check-circle" v-if="selectedMethod === 'bank'">✓</view>
              </view>
            </view>
          </view>
        </view>

        <view class="notice-section">
          <view class="notice-title">
            <text class="notice-icon">📋</text>
            <text class="notice-text">到账说明</text>
          </view>
          <view class="notice-content">
            <text class="notice-item">• 提现申请提交后，1-3个工作日内到账</text>
            <text class="notice-item">• 单笔最低提现金额10元，最高5000元</text>
            <text class="notice-item">• 每日最多可提现3次</text>
            <text class="notice-item">• 提现手续费1%，最低1元，最高10元</text>
          </view>
        </view>
      </view>

      <view class="submit-section">
        <view class="fee-info" v-if="withdrawAmount && parseFloat(withdrawAmount) > 0">
          <text class="fee-label">预计手续费：</text>
          <text class="fee-value">¥{{ calculateFee }}</text>
          <text class="fee-label">实际到账：</text>
          <text class="fee-value highlight">¥{{ calculateActual }}</text>
        </view>
        <view class="submit-btn" :class="{ disabled: !canSubmit }" @click="submitWithdraw">
          确认提现
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const statusBarHeight = ref(20)
const navBarHeight = ref(44)

const sysInfo = uni.getSystemInfoSync()
statusBarHeight.value = sysInfo.statusBarHeight || 20
const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
if (menuButtonInfo) {
  navBarHeight.value = (menuButtonInfo.top - statusBarHeight.value) * 2 + menuButtonInfo.height
}

const withdrawAmount = ref('')
const selectedMethod = ref('wechat')
const selectedQuick = ref<number | null>(null)

const availableBalance = 1288.50

const calculateFee = computed(() => {
  if (!withdrawAmount.value || parseFloat(withdrawAmount.value) <= 0) return '0.00'
  let fee = parseFloat(withdrawAmount.value) * 0.01
  if (fee < 1) fee = 1
  if (fee > 10) fee = 10
  return fee.toFixed(2)
})

const calculateActual = computed(() => {
  if (!withdrawAmount.value || parseFloat(withdrawAmount.value) <= 0) return '0.00'
  const actual = parseFloat(withdrawAmount.value) - parseFloat(calculateFee.value)
  return actual.toFixed(2)
})

const canSubmit = computed(() => {
  const amount = parseFloat(withdrawAmount.value)
  return amount >= 10 && amount <= availableBalance && selectedMethod.value
})

const selectQuickAmount = (amount: number) => {
  selectedQuick.value = amount
  withdrawAmount.value = amount.toString()
}

const withdrawAll = () => {
  selectedQuick.value = null
  withdrawAmount.value = availableBalance.toString()
}

const selectMethod = (method: string) => {
  selectedMethod.value = method
}

const submitWithdraw = () => {
  if (!canSubmit.value) return
  uni.showModal({
    title: '提现申请提交成功',
    content: `您已申请提现¥${withdrawAmount.value}，请耐心等待审核`,
    showCancel: false,
    success: () => {
      uni.navigateBack()
    }
  })
}

const goHome = () => {
  uni.switchTab({ url: '/pages/home/index' })
}

onMounted(() => {})
</script>

<style lang="scss" scoped>
.withdraw-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 200rpx;
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
  background: linear-gradient(135deg, #0984e3, #74b9ff);
  padding: 40rpx 30rpx 50rpx;

  .header-content {
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
}

.withdraw-form {
  padding: 20rpx;

  .form-section {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;

    .section-title {
      display: block;
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
    }
  }
}

.amount-input-wrapper {
  display: flex;
  align-items: center;
  border-bottom: 2rpx solid #eee;
  padding-bottom: 20rpx;

  .currency-symbol {
    font-size: 48rpx;
    font-weight: bold;
    color: #333;
    margin-right: 10rpx;
  }

  .amount-input {
    flex: 1;
    font-size: 48rpx;
    font-weight: bold;
    color: #333;
  }

  .placeholder-text {
    font-size: 32rpx;
    font-weight: normal;
    color: #ccc;
  }
}

.quick-amounts {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-top: 20rpx;

  .quick-item {
    flex: 1;
    min-width: 100rpx;
    text-align: center;
    padding: 16rpx 0;
    font-size: 26rpx;
    color: #666;
    background-color: #f5f5f5;
    border-radius: 8rpx;
    border: 2rpx solid transparent;

    &.active {
      color: #0984e3;
      background-color: rgba(9, 132, 227, 0.1);
      border-color: #0984e3;
    }

    &.all-btn {
      color: #0984e3;
      background-color: rgba(9, 132, 227, 0.1);
    }
  }
}

.method-list {
  .method-item {
    display: flex;
    align-items: center;
    padding: 25rpx 0;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    &.active {
      background-color: rgba(9, 132, 227, 0.02);
    }

    .method-icon {
      width: 80rpx;
      height: 80rpx;
      border-radius: 12rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40rpx;
      margin-right: 20rpx;

      &.wechat {
        background-color: rgba(0, 184, 148, 0.1);
      }

      &.alipay {
        background-color: rgba(23, 145, 231, 0.1);
      }

      &.bank {
        background-color: rgba(9, 132, 227, 0.1);
      }
    }

    .method-info {
      flex: 1;

      .method-name {
        display: block;
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 6rpx;
      }

      .method-desc {
        display: block;
        font-size: 22rpx;
        color: #999;
      }
    }

    .method-check {
      width: 40rpx;
      height: 40rpx;

      .check-circle {
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        background-color: #0984e3;
        color: #fff;
        font-size: 24rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

.notice-section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;

  .notice-title {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    .notice-icon {
      font-size: 32rpx;
      margin-right: 10rpx;
    }

    .notice-text {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
    }
  }

  .notice-content {
    .notice-item {
      display: block;
      font-size: 24rpx;
      color: #666;
      line-height: 1.8;
    }
  }
}

.submit-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 20rpx 30rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

  .fee-info {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 15rpx;
    gap: 10rpx;

    .fee-label {
      font-size: 24rpx;
      color: #666;
    }

    .fee-value {
      font-size: 26rpx;
      color: #333;
      font-weight: bold;

      &.highlight {
        color: #e74c3c;
        font-size: 30rpx;
      }
    }
  }

  .submit-btn {
    width: 100%;
    height: 90rpx;
    line-height: 90rpx;
    text-align: center;
    background: linear-gradient(135deg, #0984e3, #74b9ff);
    color: #fff;
    font-size: 32rpx;
    font-weight: bold;
    border-radius: 45rpx;

    &.disabled {
      background: #ccc;
      opacity: 0.6;
    }
  }
}
</style>
