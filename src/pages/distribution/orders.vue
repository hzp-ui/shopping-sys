<template>
  <view class="orders-page">
    <view class="navbar-container" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="navbar-content" :style="{ height: navBarHeight + 'px' }">
        <view class="navbar-left" @click="goHome">
          <view class="back-capsule">
            <text class="back-icon">🏠</text>
            <text class="back-text">首页</text>
          </view>
        </view>
        <view class="navbar-title">
          <text class="title-text">分销订单</text>
        </view>
        <view class="navbar-right"></view>
      </view>
    </view>

    <view class="page-content">
      <view class="orders-header">
        <view class="header-stats">
          <view class="header-stat">
            <text class="stat-num">128</text>
            <text class="stat-label">全部订单</text>
          </view>
          <view class="header-stat">
            <text class="stat-num">35</text>
            <text class="stat-label">待结算</text>
          </view>
          <view class="header-stat">
            <text class="stat-num">86</text>
            <text class="stat-label">已结算</text>
          </view>
          <view class="header-stat">
            <text class="stat-num">7</text>
            <text class="stat-label">已失效</text>
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
            :class="{ active: currentTab === 'pending' }"
            @click="switchTab('pending')"
          >
            <text class="tab-text">待结算</text>
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
            :class="{ active: currentTab === 'invalid' }"
            @click="switchTab('invalid')"
          >
            <text class="tab-text">已失效</text>
          </view>
        </view>
      </view>

      <scroll-view scroll-y class="order-scroll">
        <view class="scroll-content">
          <view class="order-card" v-for="order in filteredOrders" :key="order.id">
            <view class="order-header">
              <text class="order-no">订单号：{{ order.orderNo }}</text>
              <text class="order-status" :class="order.status">{{ order.statusText }}</text>
            </view>
            <view class="order-content">
              <image class="goods-image" :src="order.goodsImage" mode="aspectFill"></image>
              <view class="goods-info">
                <text class="goods-name">{{ order.goodsName }}</text>
                <text class="goods-spec">{{ order.goodsSpec }}</text>
                <view class="order-meta">
                  <text class="user-name">下单用户：{{ order.userName }}</text>
                  <text class="order-time">{{ order.orderTime }}</text>
                </view>
              </view>
            </view>
            <view class="order-footer">
              <text class="commission-label">佣金金额</text>
              <text class="commission-amount">¥{{ order.commission }}</text>
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

const orderList = ref([
  {
    id: 1,
    orderNo: 'DD2026070214302568',
    goodsName: '有机蔬菜套餐 新鲜时令蔬菜礼盒',
    goodsSpec: '6斤装 / 约8-10种',
    goodsImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20organic%20vegetables%20gift%20box&image_size=square',
    userName: '李**',
    orderTime: '2026-07-02 14:30',
    commission: '35.60',
    status: 'pending',
    statusText: '待结算'
  },
  {
    id: 2,
    orderNo: 'DD2026070210153241',
    goodsName: '进口水果礼盒 当季新鲜水果',
    goodsSpec: '10斤装 / 混合装',
    goodsImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20fruit%20gift%20box%20assorted&image_size=square',
    userName: '王**',
    orderTime: '2026-07-02 10:15',
    commission: '52.80',
    status: 'pending',
    statusText: '待结算'
  },
  {
    id: 3,
    orderNo: 'DD2026070119451236',
    goodsName: '零食大礼包 网红休闲食品组合',
    goodsSpec: '20款 / 约1500g',
    goodsImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=snack%20gift%20box%20assorted%20cookies%20candy&image_size=square',
    userName: '张**',
    orderTime: '2026-07-01 19:45',
    commission: '28.80',
    status: 'settled',
    statusText: '已结算'
  },
  {
    id: 4,
    orderNo: 'DD2026070116208975',
    goodsName: '精品牛肉礼盒 原切牛排套餐',
    goodsSpec: '6片装 / 共1200g',
    goodsImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20beef%20steak%20gift%20box&image_size=square',
    userName: '刘**',
    orderTime: '2026-07-01 16:20',
    commission: '88.00',
    status: 'settled',
    statusText: '已结算'
  },
  {
    id: 5,
    orderNo: 'DD2026063011004562',
    goodsName: '坚果大礼包 每日坚果混合装',
    goodsSpec: '30包 / 共750g',
    goodsImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mixed%20nuts%20gift%20box%20healthy%20snacks&image_size=square',
    userName: '陈**',
    orderTime: '2026-06-30 11:00',
    commission: '42.50',
    status: 'settled',
    statusText: '已结算'
  },
  {
    id: 6,
    orderNo: 'DD2026062915307891',
    goodsName: '有机大米 东北五常稻花香',
    goodsSpec: '10斤装 / 真空包装',
    goodsImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=organic%20rice%20package%20premium%20quality&image_size=square',
    userName: '赵**',
    orderTime: '2026-06-29 15:30',
    commission: '25.00',
    status: 'settled',
    statusText: '已结算'
  },
  {
    id: 7,
    orderNo: 'DD2026062809203456',
    goodsName: '蜂蜜礼盒 纯天然土蜂蜜',
    goodsSpec: '2瓶装 / 共1000g',
    goodsImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=natural%20honey%20gift%20jar%20set&image_size=square',
    userName: '孙**',
    orderTime: '2026-06-28 09:20',
    commission: '38.00',
    status: 'invalid',
    statusText: '已失效'
  },
  {
    id: 8,
    orderNo: 'DD2026062714506789',
    goodsName: '茶叶礼盒 明前龙井绿茶',
    goodsSpec: '250g / 特级',
    goodsImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20green%20tea%20gift%20box%20premium&image_size=square',
    userName: '周**',
    orderTime: '2026-06-27 14:50',
    commission: '65.00',
    status: 'settled',
    statusText: '已结算'
  },
  {
    id: 9,
    orderNo: 'DD2026062611301234',
    goodsName: '海鲜礼盒 冷冻海鲜大礼包',
    goodsSpec: '8种 / 约3000g',
    goodsImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=frozen%20seafood%20gift%20box%20assorted&image_size=square',
    userName: '吴**',
    orderTime: '2026-06-26 11:30',
    commission: '120.00',
    status: 'settled',
    statusText: '已结算'
  },
  {
    id: 10,
    orderNo: 'DD2026062518005678',
    goodsName: '红枣枸杞礼盒 宁夏特产',
    goodsSpec: '1000g / 特级',
    goodsImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=red%20dates%20goji%20berry%20gift%20box&image_size=square',
    userName: '郑**',
    orderTime: '2026-06-25 18:00',
    commission: '30.00',
    status: 'invalid',
    statusText: '已失效'
  }
])

const filteredOrders = computed(() => {
  if (currentTab.value === 'all') {
    return orderList.value
  }
  return orderList.value.filter(item => item.status === currentTab.value)
})

const goHome = () => {
  uni.switchTab({ url: '/pages/home/index' })
}

const switchTab = (tab: string) => {
  currentTab.value = tab
}
</script>

<style lang="scss" scoped>
.orders-page {
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

.orders-header {
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  padding: 30rpx 30rpx 40rpx;

  .header-stats {
    display: flex;
    justify-content: space-around;

    .header-stat {
      text-align: center;

      .stat-num {
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

.order-scroll {
  flex: 1;
}

.scroll-content {
  padding: 20rpx;
  padding-top: 10rpx;

  .order-card {
    background-color: #fff;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    overflow: hidden;

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 24rpx;
      border-bottom: 1rpx solid #f5f5f5;

      .order-no {
        font-size: 24rpx;
        color: #999;
      }

      .order-status {
        font-size: 24rpx;
        font-weight: bold;

        &.pending {
          color: #f39c12;
        }

        &.settled {
          color: #00b894;
        }

        &.invalid {
          color: #999;
        }
      }
    }

    .order-content {
      display: flex;
      padding: 24rpx;

      .goods-image {
        width: 160rpx;
        height: 160rpx;
        border-radius: 12rpx;
        margin-right: 20rpx;
        flex-shrink: 0;
      }

      .goods-info {
        flex: 1;
        display: flex;
        flex-direction: column;

        .goods-name {
          font-size: 28rpx;
          color: #333;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          margin-bottom: 10rpx;
        }

        .goods-spec {
          font-size: 22rpx;
          color: #999;
          margin-bottom: 10rpx;
        }

        .order-meta {
          margin-top: auto;

          .user-name {
            display: block;
            font-size: 22rpx;
            color: #666;
            margin-bottom: 6rpx;
          }

          .order-time {
            display: block;
            font-size: 22rpx;
            color: #999;
          }
        }
      }
    }

    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 24rpx;
      background-color: #fafafa;

      .commission-label {
        font-size: 24rpx;
        color: #666;
      }

      .commission-amount {
        font-size: 32rpx;
        font-weight: bold;
        color: #e74c3c;
      }
    }
  }
}
</style>
