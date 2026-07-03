<template>
  <view class="invoice-detail-page">
    <view class="navbar-container" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="navbar-content" :style="{ height: navBarHeight + 'px' }">
        <view class="navbar-left" @click="goHome">
          <view class="back-capsule">
            <text class="back-icon">🏠</text>
            <text class="back-text">首页</text>
          </view>
        </view>
        <view class="navbar-title">
          <text class="title-text">发票详情</text>
        </view>
        <view class="navbar-right"></view>
      </view>
    </view>

    <view class="page-content">
      <view class="invoice-header">
        <view class="header-content">
          <view class="status-icon">✅</view>
          <text class="status-text">已完成</text>
          <text class="status-desc">发票已开具成功</text>
        </view>
      </view>

      <scroll-view scroll-y class="detail-scroll">
        <view class="info-section">
          <view class="section-title">发票信息</view>
          <view class="info-row">
            <text class="info-label">发票类型</text>
            <text class="info-value">{{ invoiceDetail.invoiceType }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">发票号码</text>
            <text class="info-value">{{ invoiceDetail.invoiceNo }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">开票金额</text>
            <text class="info-value amount">¥{{ invoiceDetail.amount }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">开票时间</text>
            <text class="info-value">{{ invoiceDetail.invoiceTime }}</text>
          </view>
        </view>

        <view class="info-section">
          <view class="section-title">购买方信息</view>
          <view class="info-row">
            <text class="info-label">名称</text>
            <text class="info-value">{{ invoiceDetail.buyer.name }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">税号</text>
            <text class="info-value">{{ invoiceDetail.buyer.taxNo }}</text>
          </view>
          <view class="info-row" v-if="invoiceDetail.buyer.address">
            <text class="info-label">地址电话</text>
            <text class="info-value">{{ invoiceDetail.buyer.address }}</text>
          </view>
          <view class="info-row" v-if="invoiceDetail.buyer.bank">
            <text class="info-label">开户行及账号</text>
            <text class="info-value">{{ invoiceDetail.buyer.bank }}</text>
          </view>
        </view>

        <view class="info-section">
          <view class="section-title">销售方信息</view>
          <view class="info-row">
            <text class="info-label">名称</text>
            <text class="info-value">{{ invoiceDetail.seller.name }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">税号</text>
            <text class="info-value">{{ invoiceDetail.seller.taxNo }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">地址电话</text>
            <text class="info-value">{{ invoiceDetail.seller.address }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">开户行及账号</text>
            <text class="info-value">{{ invoiceDetail.seller.bank }}</text>
          </view>
        </view>

        <view class="info-section">
          <view class="section-title">商品明细</view>
          <view class="goods-item" v-for="item in invoiceDetail.goodsList" :key="item.id">
            <view class="goods-info">
              <text class="goods-name">{{ item.name }}</text>
              <text class="goods-spec">{{ item.spec }}</text>
            </view>
            <view class="goods-price">
              <text class="price-num">¥{{ item.price }}</text>
              <text class="goods-count">x{{ item.count }}</text>
            </view>
          </view>
          <view class="total-row">
            <text class="total-label">合计</text>
            <text class="total-value">¥{{ invoiceDetail.amount }}</text>
          </view>
        </view>

        <view class="action-section">
          <view class="action-btn primary" @click="downloadInvoice">
            <text class="btn-icon">⬇️</text>
            <text class="btn-text">下载发票</text>
          </view>
          <view class="action-btn" @click="sendToEmail">
            <text class="btn-icon">📧</text>
            <text class="btn-text">发送到邮箱</text>
          </view>
          <view class="action-btn" @click="viewPdf">
            <text class="btn-icon">📄</text>
            <text class="btn-text">查看PDF</text>
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

const invoiceDetail = ref({
  invoiceType: '电子普通发票',
  invoiceNo: 'FP2026070100012345',
  amount: '299.00',
  invoiceTime: '2026-07-01 14:30:00',
  buyer: {
    name: '张三',
    taxNo: '91310000MA1G8K2X3T',
    address: '',
    bank: ''
  },
  seller: {
    name: '云亩科技有限公司',
    taxNo: '91330100MA27W8Q91E',
    address: '浙江省杭州市西湖区文三路100号 0571-88888888',
    bank: '中国工商银行杭州分行 1234567890123456789'
  },
  goodsList: [
    { id: 1, name: '无线蓝牙耳机', spec: '白色 / 标准版', price: '299.00', count: 1 }
  ]
})

const goHome = () => {
  uni.switchTab({ url: '/pages/home/index' })
}

const downloadInvoice = () => {
  uni.showToast({
    title: '开始下载',
    icon: 'success'
  })
}

const sendToEmail = () => {
  uni.showModal({
    title: '发送到邮箱',
    content: '发票将发送至您的注册邮箱',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '发送成功',
          icon: 'success'
        })
      }
    }
  })
}

const viewPdf = () => {
  uni.showToast({
    title: '正在打开PDF',
    icon: 'loading'
  })
}

onMounted(() => {
})
</script>

<style lang="scss" scoped>
.invoice-detail-page {
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
  padding: 40rpx 30rpx 50rpx;

  .header-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;

    .status-icon {
      font-size: 80rpx;
      margin-bottom: 15rpx;
    }

    .status-text {
      font-size: 36rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
    }

    .status-desc {
      font-size: 24rpx;
      opacity: 0.8;
    }
  }
}

.detail-scroll {
  flex: 1;
  padding: 20rpx;
}

.info-section {
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
    padding-bottom: 15rpx;
    border-bottom: 1rpx solid #f0f0f0;
  }
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15rpx 0;

  .info-label {
    font-size: 26rpx;
    color: #999;
    flex-shrink: 0;
  }

  .info-value {
    font-size: 26rpx;
    color: #333;
    text-align: right;
    flex: 1;
    margin-left: 20rpx;
    word-break: break-all;

    &.amount {
      color: #e74c3c;
      font-weight: bold;
      font-size: 30rpx;
    }
  }
}

.goods-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  .goods-info {
    flex: 1;
    display: flex;
    flex-direction: column;

    .goods-name {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 8rpx;
    }

    .goods-spec {
      font-size: 22rpx;
      color: #999;
    }
  }

  .goods-price {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .price-num {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
    }

    .goods-count {
      font-size: 22rpx;
      color: #999;
      margin-top: 5rpx;
    }
  }
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;

  .total-label {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
  }

  .total-value {
    font-size: 32rpx;
    color: #e74c3c;
    font-weight: bold;
  }
}

.action-section {
  padding: 30rpx 0;
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 25rpx;
    background-color: #fff;
    border-radius: 12rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.03);

    .btn-icon {
      font-size: 32rpx;
      margin-right: 12rpx;
    }

    .btn-text {
      font-size: 28rpx;
      color: #333;
    }

    &.primary {
      background: linear-gradient(135deg, #00cec9, #81ecec);

      .btn-text {
        color: #fff;
        font-weight: 500;
      }
    }
  }
}
</style>
