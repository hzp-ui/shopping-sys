<template>
  <view class="distribution-page">
    <view class="navbar-container" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="navbar-content" :style="{ height: navBarHeight + 'px' }">
        <view class="navbar-left" @click="goHome">
          <view class="back-capsule">
            <text class="back-icon">🏠</text>
            <text class="back-text">首页</text>
          </view>
        </view>
        <view class="navbar-title">
          <text class="title-text">分销中心</text>
        </view>
        <view class="navbar-right"></view>
      </view>
    </view>

    <view class="page-content">
      <view class="distribution-header">
        <view class="user-info">
          <image class="avatar" src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20avatar%20portrait%20friendly%20smile&image_size=square" mode="aspectFill"></image>
          <view class="user-detail">
            <text class="nickname">张小明</text>
            <view class="level-badge">
              <text class="level-text">🥇 金牌分销员</text>
            </view>
          </view>
        </view>

        <view class="stats-row">
          <view class="stat-item">
            <text class="stat-amount">¥5680.00</text>
            <text class="stat-label">累计佣金</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-amount">¥1288.50</text>
            <text class="stat-label">可提现</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-amount">¥3200.00</text>
            <text class="stat-label">待结算</text>
          </view>
        </view>
      </view>

      <view class="quick-entries">
        <view class="entry-item" @click="goDistributionGoods">
          <view class="entry-icon">🛍️</view>
          <text class="entry-text">分销商品</text>
        </view>
        <view class="entry-item" @click="goOrders">
          <view class="entry-icon">📦</view>
          <text class="entry-text">分销订单</text>
        </view>
        <view class="entry-item" @click="goCommission">
          <view class="entry-icon">💰</view>
          <text class="entry-text">佣金明细</text>
        </view>
        <view class="entry-item" @click="goWithdraw">
          <view class="entry-icon">💳</view>
          <text class="entry-text">提现申请</text>
        </view>
        <view class="entry-item" @click="goTeam">
          <view class="entry-icon">👥</view>
          <text class="entry-text">我的团队</text>
        </view>
        <view class="entry-item" @click="goShare">
          <view class="entry-icon">📤</view>
          <text class="entry-text">分享推广</text>
        </view>
      </view>

      <view class="today-data">
        <view class="section-title">今日数据</view>
        <view class="today-stats">
          <view class="today-item">
            <text class="today-num">5</text>
            <text class="today-label">新增粉丝</text>
          </view>
          <view class="today-item">
            <text class="today-num">3</text>
            <text class="today-label">新增订单</text>
          </view>
          <view class="today-item">
            <text class="today-num">¥88.50</text>
            <text class="today-label">预计佣金</text>
          </view>
        </view>
      </view>

      <view class="recent-section">
        <view class="section-header">
          <text class="section-title">最近佣金</text>
          <text class="section-more" @click="goCommission">查看全部 ›</text>
        </view>
        <view class="commission-list">
          <view class="commission-item" v-for="item in commissionList" :key="item.id">
            <view class="commission-icon">
              {{ item.icon }}
            </view>
            <view class="commission-info">
              <text class="commission-name">{{ item.name }}</text>
              <text class="commission-time">{{ item.time }}</text>
            </view>
            <view class="commission-amount">
              +¥{{ item.amount }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const statusBarHeight = ref(20)
const navBarHeight = ref(44)

const sysInfo = uni.getSystemInfoSync()
statusBarHeight.value = sysInfo.statusBarHeight || 20
const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
if (menuButtonInfo) {
  navBarHeight.value = (menuButtonInfo.top - statusBarHeight.value) * 2 + menuButtonInfo.height
}

const commissionList = ref([
  { id: 1, name: '订单佣金 - 有机蔬菜套餐', time: '2026-07-02 14:30', amount: '35.60', icon: '🛒' },
  { id: 2, name: '邀请奖励 - 李华加入', time: '2026-07-02 10:15', amount: '50.00', icon: '🤝' },
  { id: 3, name: '订单佣金 - 水果礼盒', time: '2026-07-01 19:45', amount: '28.80', icon: '🛒' },
  { id: 4, name: '团队返利 - 二级分销', time: '2026-07-01 16:20', amount: '15.00', icon: '👥' },
  { id: 5, name: '订单佣金 - 零食大礼包', time: '2026-06-30 11:00', amount: '42.50', icon: '🛒' }
])

const goHome = () => {
  uni.switchTab({ url: '/pages/home/index' })
}

const goDistributionGoods = () => {
  uni.navigateTo({ url: '/pages/feature/distribution' })
}

const goOrders = () => {
  uni.navigateTo({ url: '/pages/distribution/orders' })
}

const goCommission = () => {
  uni.navigateTo({ url: '/pages/distribution/commission' })
}

const goWithdraw = () => {
  uni.navigateTo({ url: '/pages/distribution/withdraw' })
}

const goTeam = () => {
  uni.showToast({ title: '我的团队', icon: 'none' })
}

const goShare = () => {
  uni.showToast({ title: '分享推广', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.distribution-page {
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

.distribution-header {
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  padding: 40rpx 30rpx 50rpx;

  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;

    .avatar {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      border: 4rpx solid rgba(255, 255, 255, 0.3);
      margin-right: 24rpx;
    }

    .user-detail {
      flex: 1;

      .nickname {
        display: block;
        font-size: 32rpx;
        font-weight: bold;
        color: #fff;
        margin-bottom: 10rpx;
      }

      .level-badge {
        display: inline-block;
        background: rgba(255, 255, 255, 0.2);
        padding: 6rpx 16rpx;
        border-radius: 20rpx;

        .level-text {
          font-size: 22rpx;
          color: #fff;
        }
      }
    }
  }

  .stats-row {
    display: flex;
    align-items: center;
    justify-content: space-around;

    .stat-item {
      flex: 1;
      text-align: center;

      .stat-amount {
        display: block;
        font-size: 36rpx;
        font-weight: bold;
        color: #fff;
        margin-bottom: 8rpx;
      }

      .stat-label {
        display: block;
        font-size: 22rpx;
        color: rgba(255, 255, 255, 0.8);
      }
    }

    .stat-divider {
      width: 2rpx;
      height: 60rpx;
      background-color: rgba(255, 255, 255, 0.3);
    }
  }
}

.quick-entries {
  background-color: #fff;
  margin: -20rpx 20rpx 20rpx;
  border-radius: 16rpx;
  padding: 30rpx 0;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  z-index: 10;

  .entry-item {
    width: 33.33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 0;

    .entry-icon {
      font-size: 48rpx;
      margin-bottom: 12rpx;
    }

    .entry-text {
      font-size: 24rpx;
      color: #333;
    }
  }
}

.today-data {
  background-color: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;

  .section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 24rpx;
  }

  .today-stats {
    display: flex;
    justify-content: space-around;

    .today-item {
      text-align: center;

      .today-num {
        display: block;
        font-size: 36rpx;
        font-weight: bold;
        color: #6c5ce7;
        margin-bottom: 8rpx;
      }

      .today-label {
        display: block;
        font-size: 24rpx;
        color: #999;
      }
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
      color: #6c5ce7;
    }
  }

  .commission-list {
    .commission-item {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .commission-icon {
        width: 70rpx;
        height: 70rpx;
        border-radius: 50%;
        background-color: rgba(108, 92, 231, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
        margin-right: 20rpx;
      }

      .commission-info {
        flex: 1;

        .commission-name {
          display: block;
          font-size: 28rpx;
          color: #333;
          margin-bottom: 8rpx;
        }

        .commission-time {
          display: block;
          font-size: 22rpx;
          color: #999;
        }
      }

      .commission-amount {
        font-size: 30rpx;
        font-weight: bold;
        color: #00b894;
      }
    }
  }
}
</style>
