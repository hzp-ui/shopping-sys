<template>
  <view class="order-list">
    <view class="order-tabs">
      <view
        class="tab-item"
        :class="{ active: currentStatus === item.status }"
        v-for="item in tabList"
        :key="item.status"
        @click="switchTab(item.status)"
      >
        {{ item.name }}
      </view>
    </view>

    <scroll-view scroll-y class="order-scroll" @scrolltolower="loadMore">
      <view class="scroll-content">
        <view class="order-item" v-for="order in orderList" :key="order.id">
        <view class="order-header">
          <text class="order-no">订单号：{{ order.orderNo }}</text>
          <text class="order-status" :class="'status-' + order.status">
            {{ getStatusText(order.status) }}
          </text>
        </view>

        <view class="goods-list">
          <view class="goods-item" v-for="item in order.goodsList" :key="item.id" @click="goGoodsDetail(item.id)">
            <image :src="item.image" mode="aspectFill" class="goods-image" @error="onGoodsImgError(item)" />
            <view class="goods-info">
              <text class="goods-name">{{ item.name }}</text>
              <text class="goods-spec">{{ item.spec }}</text>
              <view class="price-row">
                <text class="goods-price">¥{{ item.price }}</text>
                <text class="goods-quantity">x{{ item.quantity }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="order-footer">
          <view class="total-info">
            <text class="total-label">共{{ order.totalCount }}件商品，实付：</text>
            <text class="total-price">¥{{ order.totalPrice }}</text>
          </view>
          <view class="order-actions">
            <view class="action-btn" v-if="order.status === 1" @click="cancelOrder(order.id)">取消订单</view>
            <view class="action-btn" v-if="order.status === 1" @click="payOrder(order.id)">去付款</view>
            <view class="action-btn" v-if="order.status === 3" @click="goLogistics(order.id)">查看物流</view>
            <view class="action-btn" v-if="order.status === 3" @click="confirmReceive(order.id)">确认收货</view>
            <view class="action-btn" v-if="order.status === 4" @click="goReview(order.id)">去评价</view>
            <view class="action-btn" v-if="order.status === 5" @click="goLogistics(order.id)">查看物流</view>
            <view class="action-btn" v-if="order.status === 5" @click="applyInvoice(order.id)">申请发票</view>
            <view class="action-btn" v-if="order.status === 5" @click="applyRefund(order.id)">申请售后</view>
          </view>
        </view>
      </view>

      <view class="empty-order" v-if="orderList.length === 0 && !loading">
        <text class="empty-icon">📦</text>
        <text class="empty-text">暂无相关订单</text>
      </view>

      <view class="loading-more" v-if="loading">
        <text>加载中...</text>
      </view>
      <view class="no-more" v-else-if="noMore">
        <text>没有更多了</text>
      </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const defaultImg = 'https://picsum.photos/id/119/200/200'

const currentStatus = ref(0)
const orderList = ref<any[]>([])
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = 10

const tabList = [
  { status: 0, name: '全部' },
  { status: 1, name: '待付款' },
  { status: 2, name: '待发货' },
  { status: 3, name: '待收货' },
  { status: 4, name: '待评价' },
  { status: 5, name: '退款/售后' }
]

const statusText: Record<number, string> = {
  1: '待付款',
  2: '待发货',
  3: '待收货',
  4: '待评价',
  5: '已完成',
  6: '已取消'
}

const getStatusText = (status: number) => {
  return statusText[status] || ''
}

const generateMockOrders = () => {
  const orders = []
  for (let i = 0; i < 3; i++) {
    const status = currentStatus.value === 0 ? (i % 5) + 1 : currentStatus.value
    orders.push({
      id: (page.value - 1) * pageSize + i + 1,
      orderNo: `YM${Date.now()}${i}`,
      status,
      totalCount: 2,
      totalPrice: (Math.random() * 200 + 50).toFixed(2),
      goodsList: [
        {
          id: 1,
          name: '云亩优选新鲜红富士苹果 5斤装',
          spec: '5斤装',
          price: '29.90',
          quantity: 1,
          image: 'https://picsum.photos/id/1080/160/160'
        },
        {
          id: 2,
          name: '云亩优选有机蔬菜套餐',
          spec: '套餐A',
          price: '39.90',
          quantity: 1,
          image: 'https://picsum.photos/id/292/160/160'
        }
      ]
    })
  }
  return orders
}

const loadOrders = () => {
  loading.value = true
  setTimeout(() => {
    const newOrders = generateMockOrders()
    orderList.value.push(...newOrders)
    loading.value = false
    if (page.value >= 3) {
      noMore.value = true
    }
  }, 500)
}

const loadMore = () => {
  if (loading.value || noMore.value) return
  page.value++
  loadOrders()
}

const switchTab = (status: number) => {
  if (status === 5) {
    uni.navigateTo({ url: '/pages/order/aftersale' })
    return
  }
  currentStatus.value = status
  page.value = 1
  orderList.value = []
  noMore.value = false
  loadOrders()
}

const goGoodsDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/goods/detail?id=${id}` })
}

const cancelOrder = (id: number) => {
  uni.showModal({
    title: '提示',
    content: '确定取消该订单吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '已取消', icon: 'success' })
      }
    }
  })
}

const payOrder = (id: number) => {
  uni.showToast({ title: '去付款', icon: 'none' })
}

const confirmReceive = (id: number) => {
  uni.showModal({
    title: '提示',
    content: '确认收货吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '已确认收货', icon: 'success' })
      }
    }
  })
}

const goReview = (id: number) => {
  uni.navigateTo({ url: `/pages/order/review?orderId=${id}` })
}

const applyRefund = (id: number) => {
  uni.navigateTo({ url: `/pages/order/refund?orderId=${id}` })
}

const goLogistics = (id: number) => {
  uni.navigateTo({ url: `/pages/order/logistics?orderId=${id}` })
}

const applyInvoice = (id: number) => {
  uni.navigateTo({ url: `/pages/invoice/apply?orderId=${id}` })
}

const onGoodsImgError = (item: any) => {
  item.image = defaultImg
}

onLoad((options) => {
  if (options?.status) {
    currentStatus.value = Number(options.status)
  }
})

onMounted(() => {
  loadOrders()
})
</script>

<style lang="scss" scoped>
.order-list {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.order-tabs {
  display: flex;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 10;

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

.order-scroll {
  flex: 1;
  overflow: hidden;
}

.scroll-content {
  padding: 20rpx;
}

.order-item {
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  overflow: hidden;

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    border-bottom: 1rpx solid #f5f5f5;

    .order-no {
      font-size: 24rpx;
      color: #999;
    }

    .order-status {
      font-size: 26rpx;
      font-weight: bold;

      &.status-1 {
        color: #ff6b00;
      }

      &.status-2 {
        color: #0984e3;
      }

      &.status-3 {
        color: #00b894;
      }

      &.status-4 {
        color: #6c5ce7;
      }

      &.status-5 {
        color: #999;
      }
    }
  }

  .goods-list {
    padding: 0 20rpx;

    .goods-item {
      display: flex;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .goods-image {
        width: 140rpx;
        height: 140rpx;
        border-radius: 8rpx;
        margin-right: 20rpx;
      }

      .goods-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .goods-name {
          font-size: 26rpx;
          color: #333;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          line-height: 1.4;
        }

        .goods-spec {
          font-size: 22rpx;
          color: #999;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .goods-price {
            font-size: 26rpx;
            color: #ff6b00;
            font-weight: bold;
          }

          .goods-quantity {
            font-size: 24rpx;
            color: #999;
          }
        }
      }
    }
  }

  .order-footer {
    padding: 20rpx;
    border-top: 1rpx solid #f5f5f5;

    .total-info {
      text-align: right;
      margin-bottom: 15rpx;

      .total-label {
        font-size: 24rpx;
        color: #666;
      }

      .total-price {
        font-size: 32rpx;
        font-weight: bold;
        color: #ff6b00;
      }
    }

    .order-actions {
      display: flex;
      justify-content: flex-end;

      .action-btn {
        padding: 12rpx 30rpx;
        margin-left: 20rpx;
        border: 2rpx solid #ddd;
        border-radius: 30rpx;
        font-size: 24rpx;
        color: #666;

        &:last-child {
          border-color: #ff6b00;
          color: #ff6b00;
        }
      }
    }
  }
}

.empty-order {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;

  .empty-icon {
    font-size: 100rpx;
    margin-bottom: 20rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}

.loading-more,
.no-more {
  text-align: center;
  padding: 30rpx;
  font-size: 24rpx;
  color: #999;
}
</style>
