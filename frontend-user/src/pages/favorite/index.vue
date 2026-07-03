<template>
  <view class="favorite-page">
    <scroll-view scroll-y class="favorite-scroll" @scrolltolower="loadMore">
      <view class="scroll-content">
        <view class="goods-grid">
        <view class="goods-item" v-for="item in goodsList" :key="item.id" @click="goGoodsDetail(item.id)">
          <image :src="item.image" mode="aspectFill" class="goods-image" @error="onImgError(item)" />
          <view class="goods-info">
            <text class="goods-name">{{ item.name }}</text>
            <view class="price-row">
              <text class="goods-price">¥{{ item.price }}</text>
              <view class="cancel-btn" @click.stop="cancelFavorite(item.id)">
                <text>取消</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="empty-favorite" v-if="goodsList.length === 0 && !loading">
        <text class="empty-icon">❤️</text>
        <text class="empty-text">暂无收藏商品</text>
        <text class="empty-desc">快去收藏喜欢的商品吧</text>
        <view class="go-shopping" @click="goShopping">去逛逛</view>
      </view>

      <view class="loading-more" v-if="loading">
        <text>加载中...</text>
      </view>
      <view class="no-more" v-else-if="noMore && goodsList.length > 0">
        <text>没有更多了</text>
      </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const defaultImg = 'https://picsum.photos/id/119/400/400'

const goodsList = ref<any[]>([])
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = 10

const mockGoods = [
  { id: 1, name: '云亩智能手机 Pro Max', price: '5999.00', image: 'https://picsum.photos/id/1/400/400' },
  { id: 2, name: '云亩无线蓝牙耳机', price: '299.00', image: 'https://picsum.photos/id/4/400/400' },
  { id: 3, name: '云亩智能手表 Ultra', price: '1999.00', image: 'https://picsum.photos/id/7/400/400' },
  { id: 8, name: '云亩有机苹果 5斤', price: '29.90', image: 'https://picsum.photos/id/1080/400/400' }
]

const loadGoods = () => {
  loading.value = true
  setTimeout(() => {
    if (page.value === 1) {
      goodsList.value = [...mockGoods]
    }
    loading.value = false
    noMore.value = true
  }, 500)
}

const loadMore = () => {
  if (loading.value || noMore.value) return
  page.value++
  loadGoods()
}

const goGoodsDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/goods/detail?id=${id}` })
}

const cancelFavorite = (id: number) => {
  uni.showModal({
    title: '提示',
    content: '确定取消收藏吗？',
    success: (res) => {
      if (res.confirm) {
        goodsList.value = goodsList.value.filter(item => item.id !== id)
        uni.showToast({ title: '已取消收藏', icon: 'success' })
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
  loadGoods()
})
</script>

<style lang="scss" scoped>
.favorite-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.favorite-scroll {
  flex: 1;
}

.scroll-content {
  padding: 20rpx;
}

.goods-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.goods-item {
  width: 48%;
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  overflow: hidden;

  .goods-image {
    width: 100%;
    height: 340rpx;
  }

  .goods-info {
    padding: 20rpx;

    .goods-name {
      font-size: 26rpx;
      color: #333;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      line-height: 1.4;
      height: 72rpx;
    }

    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15rpx;

      .goods-price {
        font-size: 30rpx;
        color: #ff6b00;
        font-weight: bold;
      }

      .cancel-btn {
        padding: 8rpx 20rpx;
        border: 1rpx solid #ddd;
        border-radius: 24rpx;
        font-size: 22rpx;
        color: #666;
      }
    }
  }
}

.empty-favorite {
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
