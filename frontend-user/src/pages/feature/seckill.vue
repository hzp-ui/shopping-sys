<template>
  <view class="seckill-page">
    <view class="navbar-container" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="navbar-content" :style="{ height: navBarHeight + 'px' }">
        <view class="navbar-left" @click="goHome">
          <view class="back-capsule">
            <text class="back-icon">🏠</text>
            <text class="back-text">首页</text>
          </view>
        </view>
        <view class="navbar-search" @click="goSearch">
          <text class="search-icon">🔍</text>
          <text class="search-placeholder">搜索秒杀商品</text>
        </view>
        <view class="navbar-right"></view>
      </view>
    </view>

    <view class="page-content">
    <view class="seckill-header">
      <view class="header-content">
        <text class="title">限时秒杀</text>
        <view class="countdown">
          <text class="countdown-label">距结束</text>
          <text class="time">{{ countdown.hours }}</text>
          <text class="colon">:</text>
          <text class="time">{{ countdown.minutes }}</text>
          <text class="colon">:</text>
          <text class="time">{{ countdown.seconds }}</text>
        </view>
      </view>
    </view>

    <view class="seckill-tabs">
      <view
        class="tab-item"
        :class="{ active: currentRound === item.round }"
        v-for="item in roundList"
        :key="item.round"
        @click="switchRound(item.round)"
      >
        <text class="round-time">{{ item.time }}</text>
        <text class="round-status">{{ item.status }}</text>
      </view>
    </view>

    <scroll-view scroll-y class="goods-scroll" @scrolltolower="loadMore">
      <view class="goods-grid">
        <view class="goods-item" v-for="item in goodsList" :key="item.id" @click="goGoodsDetail(item.id)">
          <view class="seckill-tag">秒杀</view>
          <image :src="item.image" mode="aspectFill" class="goods-image" @error="onImgError(item)" />
          <view class="goods-info">
            <text class="goods-name">{{ item.name }}</text>
            <text class="goods-desc">{{ item.desc }}</text>
            <view class="price-row">
              <text class="seckill-price">¥{{ item.seckillPrice }}</text>
              <text class="original-price">¥{{ item.originalPrice }}</text>
            </view>
            <view class="progress-section">
              <view class="progress-bar">
                <view class="progress-inner" :style="{ width: item.progress + '%' }"></view>
              </view>
              <text class="progress-text">已抢{{ item.progress }}%</text>
            </view>
            <view class="buy-btn">
              <text>马上抢</text>
            </view>
          </view>
        </view>
      </view>

      <view class="empty-list" v-if="goodsList.length === 0 && !loading">
        <text class="empty-icon">⚡</text>
        <text class="empty-text">暂无秒杀商品</text>
      </view>

      <view class="loading-more" v-if="loading">
        <text>加载中...</text>
      </view>
      <view class="no-more" v-else-if="noMore && goodsList.length > 0">
        <text>没有更多了</text>
      </view>
    </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const defaultImg = 'https://picsum.photos/id/119/400/400'

const statusBarHeight = ref(20)
const navBarHeight = ref(44)

const sysInfo = uni.getSystemInfoSync()
statusBarHeight.value = sysInfo.statusBarHeight || 20
const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
if (menuButtonInfo) {
  navBarHeight.value = (menuButtonInfo.top - statusBarHeight.value) * 2 + menuButtonInfo.height
}

const currentRound = ref('10')
const goodsList = ref<any[]>([])
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = 10

const countdown = ref({
  hours: '02',
  minutes: '30',
  seconds: '00'
})

let timer: any = null

const roundList = [
  { round: '08', time: '08:00', status: '已结束' },
  { round: '10', time: '10:00', status: '抢购中' },
  { round: '12', time: '12:00', status: '即将开始' },
  { round: '14', time: '14:00', status: '即将开始' },
  { round: '18', time: '18:00', status: '即将开始' },
  { round: '20', time: '20:00', status: '即将开始' }
]

const mockGoods = [
  { id: 1, name: '云亩无线蓝牙耳机', desc: '主动降噪，超长续航', seckillPrice: '199.00', originalPrice: '299.00', progress: 65, image: 'https://picsum.photos/id/4/400/400' },
  { id: 8, name: '云亩有机苹果 5斤', desc: '新鲜直达，脆甜多汁', seckillPrice: '19.90', originalPrice: '29.90', progress: 85, image: 'https://picsum.photos/id/1080/400/400' },
  { id: 6, name: '云亩时尚运动鞋', desc: '轻量透气，缓震舒适', seckillPrice: '299.00', originalPrice: '399.00', progress: 45, image: 'https://picsum.photos/id/21/400/400' },
  { id: 10, name: '云亩新鲜草莓 2斤', desc: '当季新鲜，香甜可口', seckillPrice: '29.90', originalPrice: '39.90', progress: 72, image: 'https://picsum.photos/id/102/400/400' },
  { id: 11, name: '云亩进口车厘子 1斤', desc: '进口优选，果肉饱满', seckillPrice: '59.90', originalPrice: '89.90', progress: 58, image: 'https://picsum.photos/id/109/400/400' },
  { id: 12, name: '云亩精选芒果 5斤', desc: '热带水果，香甜多汁', seckillPrice: '35.90', originalPrice: '49.90', progress: 38, image: 'https://picsum.photos/id/119/400/400' },
  { id: 13, name: '云亩新鲜猕猴桃 10个', desc: '维C之王，营养丰富', seckillPrice: '24.90', originalPrice: '35.90', progress: 92, image: 'https://picsum.photos/id/118/400/400' },
  { id: 14, name: '云亩保湿精华液', desc: '深层补水，焕亮肤色', seckillPrice: '128.00', originalPrice: '198.00', progress: 55, image: 'https://picsum.photos/id/24/400/400' },
  { id: 15, name: '云亩智能手表 Ultra', desc: '健康监测，运动追踪', seckillPrice: '1499.00', originalPrice: '1999.00', progress: 32, image: 'https://picsum.photos/id/7/400/400' }
]

const startCountdown = () => {
  let totalSeconds = 2 * 3600 + 30 * 60
  timer = setInterval(() => {
    totalSeconds--
    if (totalSeconds <= 0) {
      totalSeconds = 0
      clearInterval(timer)
    }
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    countdown.value = {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    }
  }, 1000)
}

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

const switchRound = (round: string) => {
  currentRound.value = round
  page.value = 1
  goodsList.value = []
  noMore.value = false
  loadGoods()
}

const goGoodsDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/goods/detail?id=${id}` })
}

const goHome = () => {
  uni.switchTab({ url: '/pages/home/index' })
}

const goSearch = () => {
  uni.navigateTo({ url: '/pages/search/index' })
}

const onImgError = (item: any) => {
  item.image = defaultImg
}

onMounted(() => {
  loadGoods()
  startCountdown()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style lang="scss" scoped>
.seckill-page {
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

.navbar-search {
  flex: 1;
  display: flex;
  align-items: center;
  height: 64rpx;
  background-color: #f5f5f5;
  border-radius: 32rpx;
  padding: 0 24rpx;

  .search-icon {
    font-size: 26rpx;
    margin-right: 12rpx;
    flex-shrink: 0;
  }

  .search-placeholder {
    font-size: 26rpx;
    color: #999;
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

.seckill-header {
  background: linear-gradient(135deg, #ff4757, #ff6b00);
  padding: 30rpx 30rpx 40rpx;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: 36rpx;
      font-weight: bold;
      color: #fff;
    }

    .countdown {
      display: flex;
      align-items: center;

      .countdown-label {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.9);
        margin-right: 15rpx;
      }

      .time {
        width: 40rpx;
        height: 40rpx;
        line-height: 40rpx;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.3);
        color: #fff;
        font-size: 24rpx;
        font-weight: bold;
        border-radius: 6rpx;
      }

      .colon {
        color: #fff;
        font-size: 24rpx;
        font-weight: bold;
        margin: 0 6rpx;
      }
    }
  }
}

.seckill-tabs {
  display: flex;
  background-color: #fff;
  overflow-x: auto;
  white-space: nowrap;

  .tab-item {
    flex-shrink: 0;
    padding: 20rpx 30rpx;
    text-align: center;
    position: relative;

    &.active {
      .round-time {
        color: #ff4757;
        font-weight: bold;
      }

      .round-status {
        color: #ff4757;
      }

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 40rpx;
        height: 4rpx;
        background-color: #ff4757;
        border-radius: 2rpx;
      }
    }

    .round-time {
      font-size: 28rpx;
      color: #666;
    }

    .round-status {
      font-size: 22rpx;
      color: #999;
      margin-top: 6rpx;
      display: block;
    }
  }
}

.goods-scroll {
  height: calc(100vh - 400rpx);
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
  position: relative;

  .seckill-tag {
    position: absolute;
    top: 15rpx;
    left: 15rpx;
    z-index: 2;
    padding: 6rpx 16rpx;
    background: linear-gradient(135deg, #ff4757, #ff6b00);
    color: #fff;
    font-size: 20rpx;
    border-radius: 6rpx;
    font-weight: bold;
  }

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
      -webkit-line-clamp: 1;
      overflow: hidden;
      line-height: 1.4;
      font-weight: 500;
    }

    .goods-desc {
      font-size: 22rpx;
      color: #999;
      margin-top: 8rpx;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }

    .price-row {
      display: flex;
      align-items: baseline;
      margin-top: 12rpx;

      .seckill-price {
        font-size: 32rpx;
        color: #ff4757;
        font-weight: bold;
      }

      .original-price {
        font-size: 22rpx;
        color: #999;
        text-decoration: line-through;
        margin-left: 10rpx;
      }
    }

    .progress-section {
      margin-top: 12rpx;
    }

    .progress-bar {
      position: relative;
      height: 24rpx;
      background-color: #fff0f0;
      border-radius: 12rpx;
      overflow: hidden;

      .progress-inner {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: linear-gradient(90deg, #ff4757, #ff6b00);
        border-radius: 12rpx;
      }
    }

    .progress-text {
      display: block;
      text-align: right;
      font-size: 20rpx;
      color: #ff4757;
      margin-top: 4rpx;
      font-weight: 500;
    }

    .buy-btn {
      text-align: center;
      padding: 14rpx 0;
      background: linear-gradient(90deg, #ff4757, #ff6b00);
      color: #fff;
      font-size: 24rpx;
      font-weight: bold;
      border-radius: 30rpx;
      margin-top: 15rpx;
    }
  }
}

.empty-list {
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
