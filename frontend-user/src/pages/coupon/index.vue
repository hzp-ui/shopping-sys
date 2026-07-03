<template>
  <view class="coupon-page">
    <view class="coupon-tabs">
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

    <scroll-view scroll-y class="coupon-scroll">
      <view class="scroll-content">
        <view class="coupon-item" v-for="item in couponList" :key="item.id" :class="{ used: item.status === 2, expired: item.status === 3 }">
        <view class="coupon-left">
          <text class="coupon-amount">¥{{ item.amount }}</text>
          <text class="coupon-condition">满{{ item.minAmount }}可用</text>
        </view>
        <view class="coupon-right">
          <text class="coupon-name">{{ item.name }}</text>
          <text class="coupon-time">{{ item.startTime }} 至 {{ item.endTime }}</text>
          <view class="coupon-btn" @click="useCoupon(item)" v-if="item.status === 1">立即使用</view>
          <view class="coupon-btn disabled" v-else-if="item.status === 2">已使用</view>
          <view class="coupon-btn disabled" v-else>已过期</view>
        </view>
      </view>

      <view class="empty-coupon" v-if="couponList.length === 0">
        <text class="empty-icon">🎫</text>
        <text class="empty-text">暂无优惠券</text>
        <text class="empty-desc">去逛逛发现更多优惠吧</text>
      </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const currentTab = ref(1)
const couponList = ref<any[]>([])

const tabList = [
  { type: 1, name: '可使用' },
  { type: 2, name: '已使用' },
  { type: 3, name: '已过期' }
]

const mockCoupons: Record<number, any[]> = {
  1: [
    { id: 1, name: '新人专享优惠券', amount: 10, minAmount: 50, startTime: '2026-07-01', endTime: '2026-07-31', status: 1 },
    { id: 2, name: '满减优惠券', amount: 20, minAmount: 100, startTime: '2026-07-01', endTime: '2026-07-15', status: 1 },
    { id: 3, name: '生鲜品类券', amount: 5, minAmount: 30, startTime: '2026-07-01', endTime: '2026-08-01', status: 1 }
  ],
  2: [
    { id: 4, name: '618大促券', amount: 50, minAmount: 200, startTime: '2026-06-01', endTime: '2026-06-20', status: 2 }
  ],
  3: [
    { id: 5, name: '五一特惠券', amount: 15, minAmount: 80, startTime: '2026-05-01', endTime: '2026-05-07', status: 3 }
  ]
}

const loadCoupons = () => {
  couponList.value = mockCoupons[currentTab.value] || []
}

const switchTab = (type: number) => {
  currentTab.value = type
  loadCoupons()
}

const useCoupon = (item: any) => {
  uni.switchTab({ url: '/pages/home/index' })
}

onMounted(() => {
  loadCoupons()
})
</script>

<style lang="scss" scoped>
.coupon-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.coupon-tabs {
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
      color: #ff6b00;
      font-weight: bold;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 40rpx;
        height: 4rpx;
        background-color: #ff6b00;
        border-radius: 2rpx;
      }
    }
  }
}

.coupon-scroll {
  flex: 1;
}

.scroll-content {
  padding: 20rpx;
}

.coupon-item {
  display: flex;
  margin-bottom: 20rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background: linear-gradient(135deg, #fff5f0 0%, #fff 100%);
  position: relative;

  &.used,
  &.expired {
    opacity: 0.6;
    filter: grayscale(0.5);
  }
}

.coupon-left {
  width: 200rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff6b00 0%, #ff8c00 100%);
  color: #fff;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    right: -10rpx;
    top: 50%;
    transform: translateY(-50%);
    width: 20rpx;
    height: 20rpx;
    background-color: #f5f5f5;
    border-radius: 50%;
  }

  .coupon-amount {
    font-size: 48rpx;
    font-weight: bold;
    line-height: 1;
  }

  .coupon-condition {
    font-size: 22rpx;
    margin-top: 10rpx;
    opacity: 0.9;
  }
}

.coupon-right {
  flex: 1;
  padding: 25rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .coupon-name {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 10rpx;
  }

  .coupon-time {
    font-size: 22rpx;
    color: #999;
    margin-bottom: 15rpx;
  }

  .coupon-btn {
    align-self: flex-start;
    padding: 10rpx 30rpx;
    background-color: #ff6b00;
    color: #fff;
    font-size: 24rpx;
    border-radius: 30rpx;

    &.disabled {
      background-color: #ccc;
    }
  }
}

.empty-coupon {
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
    font-size: 32rpx;
    color: #333;
    margin-bottom: 15rpx;
  }

  .empty-desc {
    font-size: 26rpx;
    color: #999;
  }
}
</style>
