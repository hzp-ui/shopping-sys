<template>
  <view class="footprint-page">
    <view class="header-bar">
      <text class="title">浏览足迹</text>
      <view class="clear-btn" @click="clearAll" v-if="footprintList.length > 0">
        <text>清空</text>
      </view>
    </view>

    <scroll-view scroll-y class="footprint-scroll" @scrolltolower="loadMore">
      <view class="scroll-content">
        <view class="goods-list">
        <view class="goods-item" v-for="item in footprintList" :key="item.id" @click="goGoodsDetail(item.id)">
          <image :src="item.image" mode="aspectFill" class="goods-image" @error="onImgError(item)" />
          <view class="goods-info">
            <text class="goods-name">{{ item.name }}</text>
            <text class="goods-price">¥{{ item.price }}</text>
            <text class="view-time">{{ item.viewTime }}浏览</text>
          </view>
        </view>
      </view>

      <view class="empty-footprint" v-if="footprintList.length === 0 && !loading">
        <text class="empty-icon">👣</text>
        <text class="empty-text">暂无浏览足迹</text>
        <text class="empty-desc">去发现更多好物吧</text>
        <view class="go-shopping" @click="goShopping">去逛逛</view>
      </view>

      <view class="loading-more" v-if="loading">
        <text>加载中...</text>
      </view>
      <view class="no-more" v-else-if="noMore && footprintList.length > 0">
        <text>没有更多了</text>
      </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const defaultImg = 'https://picsum.photos/id/119/400/400'

const footprintList = ref<any[]>([])
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = 10

const mockFootprints = [
  { id: 1, name: '云亩智能手机 Pro Max', price: '5999.00', image: 'https://picsum.photos/id/1/400/400', viewTime: '今天 10:30' },
  { id: 2, name: '云亩无线蓝牙耳机', price: '299.00', image: 'https://picsum.photos/id/4/400/400', viewTime: '今天 09:15' },
  { id: 3, name: '云亩智能手表 Ultra', price: '1999.00', image: 'https://picsum.photos/id/7/400/400', viewTime: '昨天 20:45' },
  { id: 4, name: '云亩4K超清电视 65寸', price: '3999.00', image: 'https://picsum.photos/id/10/400/400', viewTime: '昨天 15:20' },
  { id: 8, name: '云亩有机苹果 5斤', price: '29.90', image: 'https://picsum.photos/id/1080/400/400', viewTime: '3天前' }
]

const loadFootprints = () => {
  loading.value = true
  setTimeout(() => {
    if (page.value === 1) {
      footprintList.value = [...mockFootprints]
    }
    loading.value = false
    noMore.value = true
  }, 500)
}

const loadMore = () => {
  if (loading.value || noMore.value) return
  page.value++
  loadFootprints()
}

const goGoodsDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/goods/detail?id=${id}` })
}

const clearAll = () => {
  uni.showModal({
    title: '提示',
    content: '确定清空所有浏览足迹吗？',
    success: (res) => {
      if (res.confirm) {
        footprintList.value = []
        uni.showToast({ title: '已清空', icon: 'success' })
      }
    }
  })
}

const goShopping = () => {
  uni.switchTab({ url: '/pages/home/index' })
}

const onImgError = (item: any) => {
  item.image = defaultImg
}

onMounted(() => {
  loadFootprints()
})
</script>

<style lang="scss" scoped>
.footprint-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;

  .title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
  }

  .clear-btn {
    font-size: 26rpx;
    color: #999;
  }
}

.footprint-scroll {
  flex: 1;
}

.scroll-content {
  padding: 20rpx;
}

.goods-list {
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
}

.goods-item {
  display: flex;
  padding: 25rpx;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .goods-image {
    width: 180rpx;
    height: 180rpx;
    border-radius: 8rpx;
    margin-right: 25rpx;
    flex-shrink: 0;
  }

  .goods-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .goods-name {
      font-size: 28rpx;
      color: #333;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      line-height: 1.4;
    }

    .goods-price {
      font-size: 32rpx;
      color: #ff6b00;
      font-weight: bold;
    }

    .view-time {
      font-size: 22rpx;
      color: #999;
    }
  }
}

.empty-footprint {
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
    margin-bottom: 40rpx;
  }

  .go-shopping {
    padding: 20rpx 60rpx;
    background-color: #ff6b00;
    color: #fff;
    font-size: 28rpx;
    border-radius: 40rpx;
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
