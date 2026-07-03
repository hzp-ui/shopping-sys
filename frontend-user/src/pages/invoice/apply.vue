<template>
  <view class="invoice-apply-page">
    <view class="navbar-container" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="navbar-content" :style="{ height: navBarHeight + 'px' }">
        <view class="navbar-left" @click="goHome">
          <view class="back-capsule">
            <text class="back-icon">🏠</text>
            <text class="back-text">首页</text>
          </view>
        </view>
        <view class="navbar-title">
          <text class="title-text">申请开票</text>
        </view>
        <view class="navbar-right"></view>
      </view>
    </view>

    <view class="page-content">
      <view class="invoice-header">
        <view class="header-content">
          <text class="title">申请开票</text>
          <text class="subtitle">请填写发票信息，我们将尽快为您开具</text>
        </view>
      </view>

      <scroll-view scroll-y class="apply-scroll">
        <view class="form-section">
          <view class="section-title">选择订单</view>
          <view class="order-card" @click="selectOrder">
            <view class="order-info" v-if="selectedOrder">
              <view class="order-header">
                <text class="order-no">订单号：{{ selectedOrder.orderNo }}</text>
                <text class="change-btn">更换订单</text>
              </view>
              <view class="order-goods">
                <view class="goods-item" v-for="item in selectedOrder.goodsList" :key="item.id">
                  <text class="goods-name">{{ item.name }}</text>
                  <text class="goods-price">¥{{ item.price }} x{{ item.count }}</text>
                </view>
              </view>
              <view class="order-amount">
                <text class="amount-label">开票金额</text>
                <text class="amount-value">¥{{ selectedOrder.amount }}</text>
              </view>
            </view>
            <view class="order-placeholder" v-else>
              <text class="placeholder-icon">📦</text>
              <text class="placeholder-text">点击选择需要开票的订单</text>
            </view>
          </view>
        </view>

        <view class="form-section">
          <view class="section-title">发票类型</view>
          <view class="type-options">
            <view
              class="type-option"
              :class="{ active: invoiceType === 'electronic' }"
              @click="invoiceType = 'electronic'"
            >
              <view class="option-radio">
                <view class="radio-inner" v-if="invoiceType === 'electronic'"></view>
              </view>
              <view class="option-content">
                <text class="option-title">电子普通发票</text>
                <text class="option-desc">开具后发送至邮箱，可直接下载</text>
              </view>
            </view>
            <view
              class="type-option"
              :class="{ active: invoiceType === 'special' }"
              @click="invoiceType = 'special'"
            >
              <view class="option-radio">
                <view class="radio-inner" v-if="invoiceType === 'special'"></view>
              </view>
              <view class="option-content">
                <text class="option-title">增值税专用发票</text>
                <text class="option-desc">需提供完整的企业开票信息</text>
              </view>
            </view>
          </view>
        </view>

        <view class="form-section">
          <view class="section-title">发票抬头</view>
          <view class="title-options">
            <view
              class="title-option"
              :class="{ active: titleType === 'personal' }"
              @click="titleType = 'personal'"
            >
              个人
            </view>
            <view
              class="title-option"
              :class="{ active: titleType === 'company' }"
              @click="titleType = 'company'"
            >
              单位
            </view>
          </view>

          <view class="form-item">
            <text class="form-label">抬头名称</text>
            <input
              class="form-input"
              :placeholder="titleType === 'personal' ? '请输入个人姓名' : '请输入单位名称'"
              v-model="titleName"
            />
          </view>

          <view class="form-item" v-if="titleType === 'company'">
            <text class="form-label">税号</text>
            <input
              class="form-input"
              placeholder="请输入纳税人识别号"
              v-model="taxNo"
            />
          </view>
        </view>

        <view class="form-section">
          <view class="section-title">收票信息</view>
          <view class="form-item">
            <text class="form-label">收票人邮箱</text>
            <input
              class="form-input"
              type="text"
              placeholder="请输入接收发票的邮箱"
              v-model="email"
            />
          </view>
          <view class="form-item">
            <text class="form-label">收票人手机号</text>
            <input
              class="form-input"
              type="number"
              placeholder="请输入手机号"
              v-model="phone"
            />
          </view>
        </view>

        <view class="form-section">
          <view class="section-title">备注信息</view>
          <textarea
            class="form-textarea"
            placeholder="请输入备注信息（选填）"
            v-model="remark"
          />
        </view>

        <view class="bottom-space"></view>
      </scroll-view>

      <view class="submit-bar">
        <view class="submit-amount">
          <text class="amount-label">开票金额</text>
          <text class="amount-value">¥{{ selectedOrder ? selectedOrder.amount : '0.00' }}</text>
        </view>
        <view class="submit-btn" :class="{ disabled: !canSubmit }" @click="submitApply">
          提交申请
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const statusBarHeight = ref(20)
const navBarHeight = ref(44)

const sysInfo = uni.getSystemInfoSync()
statusBarHeight.value = sysInfo.statusBarHeight || 20
const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
if (menuButtonInfo) {
  navBarHeight.value = (menuButtonInfo.top - statusBarHeight.value) * 2 + menuButtonInfo.height
}

const selectedOrder = ref<any>({
  orderNo: 'ORD202607010001',
  amount: '299.00',
  goodsList: [
    { id: 1, name: '无线蓝牙耳机', price: '299.00', count: 1 }
  ]
})

const invoiceType = ref('electronic')
const titleType = ref('personal')
const titleName = ref('')
const taxNo = ref('')
const email = ref('')
const phone = ref('')
const remark = ref('')

const canSubmit = computed(() => {
  if (!selectedOrder.value) return false
  if (!titleName.value) return false
  if (titleType.value === 'company' && !taxNo.value) return false
  if (!email.value) return false
  if (!phone.value) return false
  return true
})

const goHome = () => {
  uni.switchTab({ url: '/pages/home/index' })
}

const selectOrder = () => {
  uni.showToast({
    title: '选择订单',
    icon: 'none'
  })
}

const submitApply = () => {
  if (!canSubmit.value) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none'
    })
    return
  }

  uni.showModal({
    title: '确认提交',
    content: '确认提交发票申请吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showLoading({ title: '提交中...' })
        setTimeout(() => {
          uni.hideLoading()
          uni.showToast({
            title: '申请提交成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(() => {
            uni.navigateBack()
          }, 2000)
        }, 1000)
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.invoice-apply-page {
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
  padding-bottom: 120rpx;
}

.invoice-header {
  background: linear-gradient(135deg, #00cec9, #81ecec);
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

.apply-scroll {
  flex: 1;
  padding: 20rpx;
}

.form-section {
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 25rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.03);

  .section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
}

.order-card {
  background-color: #f8f9fa;
  border-radius: 10rpx;
  padding: 20rpx;

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15rpx;

    .order-no {
      font-size: 24rpx;
      color: #666;
    }

    .change-btn {
      font-size: 24rpx;
      color: #00cec9;
    }
  }

  .order-goods {
    .goods-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10rpx 0;

      .goods-name {
        font-size: 26rpx;
        color: #333;
      }

      .goods-price {
        font-size: 26rpx;
        color: #666;
      }
    }
  }

  .order-amount {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15rpx;
    padding-top: 15rpx;
    border-top: 1rpx solid #e8e8e8;

    .amount-label {
      font-size: 26rpx;
      color: #666;
    }

    .amount-value {
      font-size: 32rpx;
      font-weight: bold;
      color: #e74c3c;
    }
  }

  .order-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40rpx 0;

    .placeholder-icon {
      font-size: 60rpx;
      margin-bottom: 15rpx;
    }

    .placeholder-text {
      font-size: 26rpx;
      color: #999;
    }
  }
}

.type-options {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.type-option {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #f8f9fa;
  border-radius: 10rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s;

  &.active {
    border-color: #00cec9;
    background-color: rgba(0, 206, 201, 0.05);
  }

  .option-radio {
    width: 36rpx;
    height: 36rpx;
    border: 2rpx solid #ddd;
    border-radius: 50%;
    margin-right: 15rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    .radio-inner {
      width: 20rpx;
      height: 20rpx;
      background-color: #00cec9;
      border-radius: 50%;
    }
  }

  .option-content {
    flex: 1;

    .option-title {
      display: block;
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
      margin-bottom: 5rpx;
    }

    .option-desc {
      display: block;
      font-size: 22rpx;
      color: #999;
    }
  }
}

.title-options {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.title-option {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  background-color: #f8f9fa;
  border-radius: 10rpx;
  font-size: 28rpx;
  color: #666;
  border: 2rpx solid transparent;
  transition: all 0.3s;

  &.active {
    border-color: #00cec9;
    color: #00cec9;
    background-color: rgba(0, 206, 201, 0.05);
    font-weight: 500;
  }
}

.form-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  .form-label {
    width: 180rpx;
    font-size: 28rpx;
    color: #333;
    flex-shrink: 0;
  }

  .form-input {
    flex: 1;
    font-size: 28rpx;
    color: #333;
    text-align: right;
  }
}

.form-textarea {
  width: 100%;
  min-height: 150rpx;
  padding: 20rpx;
  background-color: #f8f9fa;
  border-radius: 10rpx;
  font-size: 26rpx;
  color: #333;
  box-sizing: border-box;
}

.bottom-space {
  height: 30rpx;
}

.submit-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));

  .submit-amount {
    flex: 1;
    display: flex;
    flex-direction: column;

    .amount-label {
      font-size: 22rpx;
      color: #999;
      margin-bottom: 5rpx;
    }

    .amount-value {
      font-size: 36rpx;
      font-weight: bold;
      color: #e74c3c;
    }
  }

  .submit-btn {
    padding: 20rpx 60rpx;
    background: linear-gradient(135deg, #00cec9, #81ecec);
    color: #fff;
    font-size: 30rpx;
    font-weight: 500;
    border-radius: 40rpx;

    &.disabled {
      opacity: 0.5;
    }
  }
}
</style>
