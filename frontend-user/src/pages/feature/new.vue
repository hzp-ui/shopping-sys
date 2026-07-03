<template>
  <view class="new-goods-page">
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
          <text class="search-placeholder">搜索新品</text>
        </view>
        <view class="navbar-right"></view>
      </view>
    </view>

    <view class="page-content">
      <view class="header">
        <view class="header-content">
          <text class="title">新品首发</text>
          <text class="subtitle">抢先体验，上新必抢</text>
        </view>
      </view>

      <view class="tabs">
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

      <scroll-view scroll-y class="goods-scroll" @scrolltolower="loadMore">
        <view class="goods-grid">
          <view class="goods-item" v-for="item in goodsList" :key="item.id" @click="goGoodsDetail(item.id)">
            <view class="new-tag">新品</view>
            <image :src="item.image" mode="aspectFill" class="goods-image" @error="onImgError(item)" />
            <view class="goods-info">
              <text class="goods-name">{{ item.name }}</text>
              <text class="goods-desc">{{ item.desc }}</text>
              <view class="goods-bottom">
                <text class="goods-price">¥{{ item.price }}</text>
                <text class="goods-sales">{{ item.sales }}人已抢</text>
              </view>
            </view>
          </view>
        </view>

        <view class="empty-list" v-if="goodsList.length === 0 && !loading">
          <text class="empty-icon">🆕</text>
          <text class="empty-text">暂无新品</text>
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
import { ref, onMounted } from 'vue'

const defaultImg = 'https://picsum.photos/id/119/400/400'

const statusBarHeight = ref(20)
const navBarHeight = ref(44)

const sysInfo = uni.getSystemInfoSync()
statusBarHeight.value = sysInfo.statusBarHeight || 20
const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
if (menuButtonInfo) {
  navBarHeight.value = (menuButtonInfo.top - statusBarHeight.value) * 2 + menuButtonInfo.height
}

const currentTab = ref('all')
const goodsList = ref<any[]>([])
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = 10

const tabList = [
  { type: 'all', name: '全部' },
  { type: 'phone', name: '手机数码' },
  { type: 'home', name: '家用电器' },
  { type: 'beauty', name: '美妆个护' },
  { type: 'food', name: '食品生鲜' }
]

const mockGoods = [
  { id: 1, name: '云亩智能手机 Pro Max', desc: '旗舰级性能，超清影像系统', price: '5999.00', sales: 500, image: 'https://picsum.photos/id/1/400/400' },
  { id: 2, name: '云亩无线蓝牙耳机', desc: '主动降噪，超长续航', price: '299.00', sales: 2000, image: 'https://picsum.photos/id/4/400/400' },
  { id: 3, name: '云亩智能手表 Ultra', desc: '全天候健康监测', price: '1999.00', sales: 800, image: 'https://picsum.photos/id/7/400/400' },
  { id: 6, name: '云亩时尚运动鞋', desc: '轻量透气，缓震舒适', price: '399.00', sales: 1500, image: 'https://picsum.photos/id/21/400/400' },
  { id: 7, name: '云亩保湿精华液', desc: '深层补水，焕亮肤色', price: '198.00', sales: 1200, image: 'https://picsum.photos/id/24/400/400' },
  { id: 8, name: '云亩有机苹果 5斤', desc: '新鲜直达，脆甜多汁', price: '29.90', sales: 3000, image: 'https://picsum.photos/id/1080/400/400' }
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

const switchTab = (type: string) => {
  currentTab.value = type
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
})
</script>

<style lang="scss" scoped>
.new-goods-page {
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

.header {
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  padding: 30rpx 30rpx 40rpx;

  .header-content {
    .title {
      display: block;
      font-size: 36rpx;
      font-weight: bold;
      color: #fff;
    }

    .subtitle {
      display: block;
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.8);
      margin-top: 10rpx;
    }
  }
}

.tabs {
  display: flex;
  background-color: #fff;
  padding: 0 20rpx;

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 25rpx 0;
    font-size: 26rpx;
    color: #666;
    position: relative;

    &.active {
      color: #6c5ce7;
      font-weight: bold;

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
  }
}

.goods-scroll {
  flex: 1;
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

  .new-tag {
    position: absolute;
    top: 15rpx;
    left: 15rpx;
    z-index: 2;
    padding: 6rpx 16rpx;
    background: linear-gradient(135deg, #6c5ce7, #a29bfe);
    color: #fff;
    font-size: 20rpx;
    border-radius: 6rpx;
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

    .goods-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15rpx;

      .goods-price {
        font-size: 30rpx;
        color: #ff6b00;
        font-weight: bold;
      }

      .goods-sales {
        font-size: 22rpx;
        color: #999;
      }
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
