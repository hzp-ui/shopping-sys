<template>
  <view class="about-page">
    <view class="about-header">
      <view class="logo">🛒</view>
      <text class="app-name">云亩商城</text>
      <text class="version">v1.0.0</text>
    </view>

    <view class="about-section">
      <view class="section-title">
        <text class="title-text">关于我们</text>
      </view>
      <view class="section-content">
        <text class="content-text">
          云亩商城是一个专注于优质商品的电商平台，致力于为用户提供高品质的购物体验。我们严选每一件商品，确保品质可靠，让您购物无忧。
        </text>
        <text class="content-text">
          云亩，让生活更美好。
        </text>
      </view>
    </view>

    <view class="about-section">
      <view class="section-title">
        <text class="title-text">联系我们</text>
      </view>
      <view class="contact-list">
        <view class="contact-item">
          <text class="contact-label">客服电话</text>
          <text class="contact-value">400-888-8888</text>
        </view>
        <view class="contact-item">
          <text class="contact-label">服务时间</text>
          <text class="contact-value">7×24小时</text>
        </view>
        <view class="contact-item">
          <text class="contact-label">官方邮箱</text>
          <text class="contact-value">service@yunmu.com</text>
        </view>
        <view class="contact-item">
          <text class="contact-label">公司地址</text>
          <text class="contact-value">浙江省杭州市西湖区文三路123号</text>
        </view>
      </view>
    </view>

    <view class="about-section">
      <view class="section-title">
        <text class="title-text">法律信息</text>
      </view>
      <view class="menu-list">
        <view class="menu-item" @click="goAgreement">
          <text class="menu-label">用户协议</text>
          <text class="arrow">></text>
        </view>
        <view class="menu-item" @click="goPrivacy">
          <text class="menu-label">隐私政策</text>
          <text class="arrow">></text>
        </view>
      </view>
    </view>

    <view class="copyright">
      <text>© 2026 云亩科技 版权所有</text>
    </view>
  </view>
</template>

<script setup lang="ts">
const goAgreement = () => {
  uni.showToast({ title: '用户协议', icon: 'none' })
}

const goPrivacy = () => {
  uni.showToast({ title: '隐私政策', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.about-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.about-header {
  background-color: #fff;
  padding: 60rpx 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .logo {
    font-size: 100rpx;
    margin-bottom: 20rpx;
  }

  .app-name {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }

  .version {
    font-size: 24rpx;
    color: #999;
    margin-top: 10rpx;
  }
}

.about-section {
  margin-top: 20rpx;
  background-color: #fff;

  .section-title {
    padding: 25rpx 30rpx;
    border-bottom: 1rpx solid #f5f5f5;

    .title-text {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
    }
  }

  .section-content {
    padding: 25rpx 30rpx;

    .content-text {
      display: block;
      font-size: 26rpx;
      color: #666;
      line-height: 1.8;
      margin-bottom: 20rpx;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.contact-list {
  padding: 0 30rpx;

  .contact-item {
    display: flex;
    justify-content: space-between;
    padding: 25rpx 0;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .contact-label {
      font-size: 28rpx;
      color: #666;
    }

    .contact-value {
      font-size: 28rpx;
      color: #333;
    }
  }
}

.menu-list {
  .menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .menu-label {
      font-size: 28rpx;
      color: #333;
    }

    .arrow {
      font-size: 28rpx;
      color: #ccc;
    }
  }
}

.copyright {
  padding: 40rpx 30rpx;
  text-align: center;
  font-size: 24rpx;
  color: #999;
}
</style>
