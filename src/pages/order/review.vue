<template>
  <view class="review-page">
    <scroll-view scroll-y class="review-scroll">
      <view class="order-info">
        <text class="order-label">订单编号：{{ orderNo }}</text>
      </view>

      <view class="review-section" v-for="item in goodsList" :key="item.id">
        <view class="goods-info">
          <image :src="item.image" mode="aspectFill" class="goods-image" @error="onImgError(item)" />
          <view class="goods-detail">
            <text class="goods-name">{{ item.name }}</text>
            <text class="goods-spec">{{ item.spec }}</text>
          </view>
        </view>

        <view class="rating-section">
          <text class="rating-label">商品评分</text>
          <view class="star-group">
            <text
              class="star"
              v-for="star in 5"
              :key="star"
              @click="setRating(item.id, star)"
            >
              {{ star <= item.rating ? '⭐' : '☆' }}
            </text>
          </view>
        </view>

        <view class="review-text">
          <textarea
            v-model="item.content"
            class="textarea"
            placeholder="分享您的使用体验，帮助更多小伙伴做出选择~"
            maxlength="500"
            :auto-height="true"
          />
          <text class="word-count">{{ item.content.length }}/500</text>
        </view>
      </view>
    </scroll-view>

    <view class="bottom-bar">
      <view class="submit-btn" @click="submitReview">提交评价</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const defaultImg = 'https://picsum.photos/id/119/200/200'

const orderNo = ref('')
const orderId = ref<number>(0)
const goodsList = ref<any[]>([])

const setRating = (goodsId: number, rating: number) => {
  const item = goodsList.value.find(g => g.id === goodsId)
  if (item) {
    item.rating = rating
  }
}

const submitReview = () => {
  const allRated = goodsList.value.every(item => item.rating > 0)
  if (!allRated) {
    uni.showToast({ title: '请为所有商品评分', icon: 'none' })
    return
  }
  uni.showModal({
    title: '提示',
    content: '确定提交评价吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '评价成功', icon: 'success' })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
    }
  })
}

const onImgError = (item: any) => {
  item.image = defaultImg
}

onLoad((options) => {
  if (options?.orderId) {
    orderId.value = Number(options.orderId)
    orderNo.value = `YM${options.orderId}${Date.now()}`
  }
})

onMounted(() => {
  goodsList.value = [
    {
      id: 1,
      name: '云亩优选新鲜红富士苹果 5斤装',
      spec: '5斤装',
      price: '29.90',
      image: 'https://picsum.photos/id/1080/160/160',
      rating: 5,
      content: ''
    },
    {
      id: 2,
      name: '云亩优选有机蔬菜套餐',
      spec: '套餐A',
      price: '39.90',
      image: 'https://picsum.photos/id/292/160/160',
      rating: 0,
      content: ''
    }
  ]
})
</script>

<style lang="scss" scoped>
.review-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.review-scroll {
  flex: 1;
  padding: 20rpx;
}

.order-info {
  background-color: #fff;
  padding: 25rpx 30rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;

  .order-label {
    font-size: 26rpx;
    color: #666;
  }
}

.review-section {
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 30rpx;

  .goods-info {
    display: flex;
    margin-bottom: 30rpx;

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
      justify-content: center;

      .goods-name {
        font-size: 28rpx;
        color: #333;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        line-height: 1.4;
      }

      .goods-spec {
        font-size: 24rpx;
        color: #999;
        margin-top: 10rpx;
      }
    }
  }

  .rating-section {
    display: flex;
    align-items: center;
    margin-bottom: 25rpx;
    padding-bottom: 25rpx;
    border-bottom: 1rpx solid #f5f5f5;

    .rating-label {
      font-size: 28rpx;
      color: #333;
      margin-right: 20rpx;
    }

    .star-group {
      display: flex;

      .star {
        font-size: 40rpx;
        margin-right: 10rpx;
      }
    }
  }

  .review-text {
    position: relative;

    .textarea {
      width: 100%;
      min-height: 200rpx;
      padding: 20rpx;
      background-color: #f9f9f9;
      border-radius: 8rpx;
      font-size: 26rpx;
      color: #333;
      box-sizing: border-box;
    }

    .word-count {
      position: absolute;
      right: 20rpx;
      bottom: 15rpx;
      font-size: 22rpx;
      color: #999;
    }
  }
}

.bottom-bar {
  padding: 20rpx 30rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background-color: #fff;
  border-top: 1rpx solid #f0f0f0;

  .submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 88rpx;
    background-color: #ff6b00;
    color: #fff;
    font-size: 30rpx;
    border-radius: 44rpx;
  }
}
</style>
