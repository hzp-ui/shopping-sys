<template>
  <view class="commission-page">
    <view class="navbar-container" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="navbar-content" :style="{ height: navBarHeight + 'px' }">
        <view class="navbar-left" @click="goHome">
          <view class="back-capsule">
            <text class="back-icon">🏠</text>
            <text class="back-text">首页</text>
          </view>
        </view>
        <view class="navbar-title">
          <text class="title-text">佣金明细</text>
        </view>
        <view class="navbar-right"></view>
      </view>
    </view>

    <view class="page-content">
      <view class="commission-header">
        <view class="header-stats">
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

      <view class="tabs-container">
        <view class="tabs">
          <view
            class="tab-item"
            :class="{ active: currentTab === 'all' }"
            @click="switchTab('all')"
          >
            <text class="tab-text">全部</text>
          </view>
          <view
            class="tab-item"
            :class="{ active: currentTab === 'settled' }"
            @click="switchTab('settled')"
          >
            <text class="tab-text">已结算</text>
          </view>
          <view
            class="tab-item"
            :class="{ active: currentTab === 'pending' }"
            @click="switchTab('pending')"
          >
            <text class="tab-text">待结算</text>
          </view>
          <view
            class="tab-item"
            :class="{ active: currentTab === 'invalid' }"
            @click="switchTab('invalid')"
          >
            <text class="tab-text">已失效</text>
          </view>
        </view>
      </view>

      <scroll-view scroll-y class="record-scroll">
        <view class="scroll-content">
          <view class="record-card" v-for="record in filteredRecords" :key="record.id">
            <view class="record-left">
              <view class="record-icon" :class="record.type">
                {{ record.icon }}
              </view>
              <view class="record-info">
                <text class="record-title">{{ record.title }}</text>
                <text class="record-desc">{{ record.desc }}</text>
                <text class="record-time">{{ record.time }}</text>
              </view>
            </view>
            <view class="record-right">
              <text class="record-amount" :class="record.type">
                {{ record.type === 'income' ? '+' : '-' }}¥{{ record.amount }}
              </text>
              <text class="record-status" :class="record.status">{{ record.statusText }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const statusBarHeight = ref(20)
const navBarHeight = ref(44)
const currentTab = ref('all')

const sysInfo = uni.getSystemInfoSync()
statusBarHeight.value = sysInfo.statusBarHeight || 20
const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
if (menuButtonInfo) {
  navBarHeight.value = (menuButtonInfo.top - statusBarHeight.value) * 2 + menuButtonInfo.height
}

const recordList = ref([
  {
    id: 1,
    title: '订单佣金',
    desc: '有机蔬菜套餐',
    icon: '🛒',
    amount: '35.60',
    time: '2026-07-02 14:30',
    type: 'income',
    status: 'pending',
    statusText: '待结算'
  },
  {
    id: 2,
    title: '邀请奖励',
    desc: '李华加入分销',
    icon: '🤝',
    amount: '50.00',
    time: '2026-07-02 10:15',
    type: 'income',
    status: 'settled',
    statusText: '已结算'
  },
  {
    id: 3,
    title: '订单佣金',
    desc: '水果礼盒',
    icon: '🛒',
    amount: '28.80',
    time: '2026-07-01 19:45',
    type: 'income',
    status: 'pending',
    statusText: '待结算'
  },
  {
    id: 4,
    title: '团队返利',
    desc: '二级分销提成',
    icon: '👥',
    amount: '15.00',
    time: '2026-07-01 16:20',
    type: 'income',
    status: 'settled',
    statusText: '已结算'
  },
  {
    id: 5,
    title: '订单佣金',
    desc: '零食大礼包',
    icon: '🛒',
    amount: '42.50',
    time: '2026-06-30 11:00',
    type: 'income',
    status: 'settled',
    statusText: '已结算'
  },
  {
    id: 6,
    title: '提现',
    desc: '提现到微信',
    icon: '💳',
    amount: '500.00',
    time: '2026-06-28 09:20',
    type: 'expense',
    status: 'settled',
    statusText: '已到账'
  },
  {
    id: 7,
    title: '订单佣金',
    desc: '精品牛肉礼盒',
    icon: '🥩',
    amount: '88.00',
    time: '2026-06-28 15:30',
    type: 'income',
    status: 'settled',
    statusText: '已结算'
  },
  {
    id: 8,
    title: '签到奖励',
    desc: '连续签到7天',
    icon: '🎁',
    amount: '5.00',
    time: '2026-06-27 08:00',
    type: 'income',
    status: 'settled',
    statusText: '已结算'
  },
  {
    id: 9,
    title: '订单佣金',
    desc: '蜂蜜礼盒 - 退款',
    icon: '↩️',
    amount: '38.00',
    time: '2026-06-26 14:50',
    type: 'expense',
    status: 'invalid',
    statusText: '已失效'
  },
  {
    id: 10,
    title: '订单佣金',
    desc: '坚果大礼包',
    icon: '🥜',
    amount: '42.50',
    time: '2026-06-25 10:15',
    type: 'income',
    status: 'settled',
    statusText: '已结算'
  },
  {
    id: 11,
    title: '邀请奖励',
    desc: '王芳加入分销',
    icon: '🤝',
    amount: '50.00',
    time: '2026-06-24 16:30',
    type: 'income',
    status: 'settled',
    statusText: '已结算'
  },
  {
    id: 12,
    title: '订单佣金',
    desc: '有机大米',
    icon: '🍚',
    amount: '25.00',
    time: '2026-06-23 11:20',
    type: 'income',
    status: 'settled',
    statusText: '已结算'
  },
  {
    id: 13,
    title: '提现',
    desc: '提现到支付宝',
    icon: '💳',
    amount: '300.00',
    time: '2026-06-20 10:00',
    type: 'expense',
    status: 'settled',
    statusText: '已到账'
  },
  {
    id: 14,
    title: '团队返利',
    desc: '三级分销提成',
    icon: '👥',
    amount: '8.50',
    time: '2026-06-19 14:45',
    type: 'income',
    status: 'settled',
    statusText: '已结算'
  },
  {
    id: 15,
    title: '订单佣金',
    desc: '茶叶礼盒 - 退款',
    icon: '↩️',
    amount: '65.00',
    time: '2026-06-18 09:30',
    type: 'expense',
    status: 'invalid',
    statusText: '已失效'
  }
])

const filteredRecords = computed(() => {
  if (currentTab.value === 'all') {
    return recordList.value
  }
  return recordList.value.filter(item => item.status === currentTab.value)
})

const goHome = () => {
  uni.switchTab({ url: '/pages/home/index' })
}

const switchTab = (tab: string) => {
  currentTab.value = tab
}
</script>

<style lang="scss" scoped>
.commission-page {
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
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.commission-header {
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  padding: 40rpx 30rpx 50rpx;

  .header-stats {
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

.tabs-container {
  background-color: #fff;
  margin: 0 20rpx;
  margin-top: -20rpx;
  border-radius: 16rpx 16rpx 0 0;
  position: relative;
  z-index: 10;

  .tabs {
    display: flex;

    .tab-item {
      flex: 1;
      text-align: center;
      padding: 24rpx 0;
      position: relative;

      &.active {
        .tab-text {
          color: #6c5ce7;
          font-weight: bold;
        }

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 40rpx;
          height: 4rpx;
          background-color: #6c5ce7;
          border-radius: 2rpx;
        }
      }

      .tab-text {
        font-size: 28rpx;
        color: #666;
      }
    }
  }
}

.record-scroll {
  flex: 1;
}

.scroll-content {
  padding: 20rpx;
  padding-top: 10rpx;

  .record-card {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 16rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .record-left {
      display: flex;
      align-items: center;
      flex: 1;

      .record-icon {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36rpx;
        margin-right: 20rpx;
        flex-shrink: 0;

        &.income {
          background-color: rgba(108, 92, 231, 0.1);
        }

        &.expense {
          background-color: rgba(231, 76, 60, 0.1);
        }
      }

      .record-info {
        flex: 1;

        .record-title {
          display: block;
          font-size: 28rpx;
          color: #333;
          font-weight: 500;
          margin-bottom: 6rpx;
        }

        .record-desc {
          display: block;
          font-size: 24rpx;
          color: #999;
          margin-bottom: 6rpx;
        }

        .record-time {
          display: block;
          font-size: 22rpx;
          color: #ccc;
        }
      }
    }

    .record-right {
      text-align: right;
      flex-shrink: 0;

      .record-amount {
        display: block;
        font-size: 32rpx;
        font-weight: bold;
        margin-bottom: 8rpx;

        &.income {
          color: #00b894;
        }

        &.expense {
          color: #e74c3c;
        }
      }

      .record-status {
        display: inline-block;
        font-size: 22rpx;
        padding: 4rpx 12rpx;
        border-radius: 10rpx;

        &.pending {
          color: #f39c12;
          background-color: rgba(243, 156, 18, 0.1);
        }

        &.settled {
          color: #00b894;
          background-color: rgba(0, 184, 148, 0.1);
        }

        &.invalid {
          color: #999;
          background-color: rgba(153, 153, 153, 0.1);
        }
      }
    }
  }
}
</style>
