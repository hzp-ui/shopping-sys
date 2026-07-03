<template>
  <view class="aftersale-page">
    <view class="tabs">
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

    <scroll-view scroll-y class="aftersale-scroll" @scrolltolower="loadMore">
      <view class="scroll-content">
        <view class="aftersale-item" v-for="item in aftersaleList" :key="item.id">
          <view class="item-header">
            <text class="order-no">售后单号：{{ item.aftersaleNo }}</text>
            <text class="status" :class="'status-' + item.status">
              {{ getStatusText(item.status) }}
            </text>
          </view>

          <view class="goods-info" @click="goOrderDetail(item.orderId)">
            <image :src="item.goodsImage" mode="aspectFill" class="goods-image" @error="onImgError(item)" />
            <view class="goods-detail">
              <text class="goods-name">{{ item.goodsName }}</text>
              <text class="type-text">{{ getTypeText(item.type) }}</text>
              <text class="refund-amount">退款金额：¥{{ item.refundAmount }}</text>
            </view>
          </view>

          <view class="item-footer">
            <view class="apply-time">申请时间：{{ item.applyTime }}</view>
            <view class="actions">
              <view class="action-btn" v-if="item.status === 1" @click="cancelAftersale(item.id)">取消申请</view>
              <view class="action-btn primary" v-if="item.status === 1" @click="goProgress(item.id)">处理进度</view>
              <view class="action-btn primary" v-if="item.status === 2" @click="goProgress(item.id)">处理中</view>
              <view class="action-btn" v-if="item.status === 3" @click="goOrderDetail(item.orderId)">查看订单</view>
              <view class="action-btn primary" v-if="item.status === 3" @click="applyAgain(item.orderId)">再次申请</view>
              <view class="action-btn primary" v-if="item.status === 4" @click="goProgress(item.id)">查看详情</view>
            </view>
          </view>
        </view>

        <view class="empty-aftersale" v-if="aftersaleList.length === 0 && !loading">
          <text class="empty-icon">📦</text>
          <text class="empty-text">暂无售后记录</text>
        </view>

        <view class="loading-more" v-if="loading">
          <text>加载中...</text>
        </view>
        <view class="no-more" v-else-if="noMore && aftersaleList.length > 0">
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
const aftersaleList = ref<any[]>([])
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = 10

const tabList = [
  { status: 0, name: '全部' },
  { status: 1, name: '待处理' },
  { status: 2, name: '处理中' },
  { status: 3, name: '已完成' },
  { status: 4, name: '已拒绝' }
]

const statusText: Record<number, string> = {
  1: '待处理',
  2: '处理中',
  3: '已完成',
  4: '已拒绝'
}

const typeText: Record<string, string> = {
  return: '退货退款',
  exchange: '换货',
  only_refund: '仅退款'
}

const getStatusText = (status: number) => {
  return statusText[status] || ''
}

const getTypeText = (type: string) => {
  return typeText[type] || type
}

const mockAftersales: Record<number, any[]> = {
  0: [
    {
      id: 1,
      aftersaleNo: 'AS20260701001',
      orderId: 1,
      status: 1,
      type: 'return',
      goodsName: '云亩优选新鲜红富士苹果 5斤装',
      goodsImage: 'https://picsum.photos/id/1080/160/160',
      refundAmount: '29.90',
      applyTime: '2026-07-01 10:30'
    },
    {
      id: 2,
      aftersaleNo: 'AS20260628002',
      orderId: 2,
      status: 3,
      type: 'only_refund',
      goodsName: '云亩优选有机蔬菜套餐',
      goodsImage: 'https://picsum.photos/id/292/160/160',
      refundAmount: '39.90',
      applyTime: '2026-06-28 15:20'
    }
  ],
  1: [
    {
      id: 1,
      aftersaleNo: 'AS20260701001',
      orderId: 1,
      status: 1,
      type: 'return',
      goodsName: '云亩优选新鲜红富士苹果 5斤装',
      goodsImage: 'https://picsum.photos/id/1080/160/160',
      refundAmount: '29.90',
      applyTime: '2026-07-01 10:30'
    }
  ],
  2: [],
  3: [
    {
      id: 2,
      aftersaleNo: 'AS20260628002',
      orderId: 2,
      status: 3,
      type: 'only_refund',
      goodsName: '云亩优选有机蔬菜套餐',
      goodsImage: 'https://picsum.photos/id/292/160/160',
      refundAmount: '39.90',
      applyTime: '2026-06-28 15:20'
    }
  ],
  4: []
}

const loadAftersales = () => {
  loading.value = true
  setTimeout(() => {
    aftersaleList.value = mockAftersales[currentStatus.value] || []
    loading.value = false
    noMore.value = true
  }, 500)
}

const loadMore = () => {
  if (loading.value || noMore.value) return
  page.value++
  loadAftersales()
}

const switchTab = (status: number) => {
  currentStatus.value = status
  page.value = 1
  aftersaleList.value = []
  noMore.value = false
  loadAftersales()
}

const goOrderDetail = (orderId: number) => {
  uni.showToast({ title: '查看订单', icon: 'none' })
}

const goProgress = (id: number) => {
  uni.showToast({ title: '处理进度', icon: 'none' })
}

const cancelAftersale = (id: number) => {
  uni.showModal({
    title: '提示',
    content: '确定取消售后申请吗？',
    success: (res) => {
      if (res.confirm) {
        aftersaleList.value = aftersaleList.value.filter(item => item.id !== id)
        uni.showToast({ title: '已取消', icon: 'success' })
      }
    }
  })
}

const applyAgain = (orderId: number) => {
  uni.navigateTo({ url: `/pages/order/refund?orderId=${orderId}` })
}

const onImgError = (item: any) => {
  item.goodsImage = defaultImg
}

onLoad((options) => {
  if (options?.status) {
    currentStatus.value = Number(options.status)
  }
})

onMounted(() => {
  loadAftersales()
})
</script>

<style lang="scss" scoped>
.aftersale-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.tabs {
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

.aftersale-scroll {
  flex: 1;
}

.scroll-content {
  padding: 20rpx;
}

.aftersale-item {
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  overflow: hidden;

  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 25rpx;
    border-bottom: 1rpx solid #f5f5f5;

    .order-no {
      font-size: 24rpx;
      color: #999;
    }

    .status {
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
        color: #999;
      }
    }
  }

  .goods-info {
    display: flex;
    padding: 25rpx;
    border-bottom: 1rpx solid #f5f5f5;

    .goods-image {
      width: 140rpx;
      height: 140rpx;
      border-radius: 8rpx;
      margin-right: 20rpx;
      flex-shrink: 0;
    }

    .goods-detail {
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

      .type-text {
        font-size: 24rpx;
        color: #666;
      }

      .refund-amount {
        font-size: 26rpx;
        color: #ff6b00;
        font-weight: bold;
      }
    }
  }

  .item-footer {
    padding: 20rpx 25rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .apply-time {
      font-size: 22rpx;
      color: #999;
    }

    .actions {
      display: flex;

      .action-btn {
        padding: 12rpx 25rpx;
        margin-left: 15rpx;
        border: 2rpx solid #ddd;
        border-radius: 30rpx;
        font-size: 24rpx;
        color: #666;

        &.primary {
          border-color: #ff6b00;
          color: #ff6b00;
        }
      }
    }
  }
}

.empty-aftersale {
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
