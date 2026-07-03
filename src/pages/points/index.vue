<template>
  <view class="points-page">
    <view class="points-header">
      <view class="points-info">
        <text class="points-label">我的积分</text>
        <text class="points-num">2680</text>
      </view>
      <view class="points-actions">
        <view class="points-tip" @click="goPointsRules">
          <text>积分规则</text>
          <text class="arrow">></text>
        </view>
        <view class="points-tip" @click="goPointsDetail">
          <text>积分明细</text>
          <text class="arrow">></text>
        </view>
      </view>
    </view>

    <view class="section-title">
      <text class="title-text">积分兑换</text>
    </view>

    <scroll-view scroll-y class="points-scroll">
      <view class="goods-grid">
        <view class="goods-item" v-for="item in goodsList" :key="item.id" @click="exchangeGoods(item)">
          <image :src="item.image" mode="aspectFill" class="goods-image" @error="onImgError(item)" />
          <view class="goods-info">
            <text class="goods-name">{{ item.name }}</text>
            <view class="exchange-row">
              <text class="points-price">{{ item.points }}积分</text>
              <view class="exchange-btn">立即兑换</view>
            </view>
          </view>
        </view>
      </view>

      <view class="loading-more" v-if="loading">
        <text>加载中...</text>
      </view>
      <view class="no-more" v-else-if="noMore">
        <text>没有更多了</text>
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

const mockGoods = [
  { id: 1, name: '云亩定制帆布袋', points: 500, image: 'https://picsum.photos/id/21/400/400' },
  { id: 2, name: '5元无门槛优惠券', points: 200, image: 'https://picsum.photos/id/22/400/400' },
  { id: 3, name: '10元满减券', points: 500, image: 'https://picsum.photos/id/24/400/400' },
  { id: 4, name: '云亩有机苹果 2斤', points: 1000, image: 'https://picsum.photos/id/1080/400/400' },
  { id: 5, name: '云亩定制马克杯', points: 800, image: 'https://picsum.photos/id/30/400/400' },
  { id: 6, name: '20元无门槛券', points: 1500, image: 'https://picsum.photos/id/26/400/400' }
]

const loadGoods = () => {
  loading.value = true
  setTimeout(() => {
    goodsList.value = [...mockGoods]
    loading.value = false
    noMore.value = true
  }, 500)
}

const exchangeGoods = (item: any) => {
  uni.showModal({
    title: '积分兑换',
    content: `确定使用 ${item.points} 积分兑换"${item.name}"吗？`,
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '兑换成功', icon: 'success' })
      }
    }
  })
}

const goPointsDetail = () => {
  uni.showToast({ title: '积分明细', icon: 'none' })
}

const goPointsRules = () => {
  uni.navigateTo({ url: '/pages/points/rules' })
}

const onImgError = (item: any) => {
  item.image = defaultImg
}

onMounted(() => {
  loadGoods()
})
</script>

<style lang="scss" scoped>
.points-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.points-header {
  background: linear-gradient(135deg, #ff6b00, #ff8c00);
  padding: 40rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .points-info {
    .points-label {
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.8);
    }

    .points-num {
      font-size: 48rpx;
      font-weight: bold;
      color: #fff;
      margin-top: 10rpx;
    }
  }

  .points-tip {
    display: flex;
    align-items: center;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.9);

    .arrow {
      margin-left: 10rpx;
    }
  }
}

.section-title {
  padding: 30rpx 30rpx 20rpx;

  .title-text {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
  }
}

.points-scroll {
  flex: 1;
  padding: 0 20rpx 20rpx;
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
    height: 300rpx;
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

    .exchange-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15rpx;

      .points-price {
        font-size: 28rpx;
        color: #ff6b00;
        font-weight: bold;
      }

      .exchange-btn {
        padding: 8rpx 20rpx;
        background-color: #ff6b00;
        color: #fff;
        font-size: 22rpx;
        border-radius: 24rpx;
      }
    }
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
