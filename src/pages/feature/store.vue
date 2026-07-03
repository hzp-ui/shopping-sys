<template>
  <view class="store-page">
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
          <text class="search-placeholder">搜索门店</text>
        </view>
        <view class="navbar-right"></view>
      </view>
    </view>

    <view class="page-content">
    <view class="store-header">
      <view class="location-bar">
        <text class="location-icon">📍</text>
        <text class="location-text">{{ currentCity }}</text>
        <text class="location-arrow">▼</text>
      </view>
      <view class="search-bar">
        <text class="search-icon">🔍</text>
        <input class="search-input" placeholder="搜索门店名称" v-model="keyword" @confirm="handleStoreSearch" />
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

    <scroll-view scroll-y class="store-scroll" @scrolltolower="loadMore">
      <view class="store-item" v-for="item in storeList" :key="item.id" @click="goStoreDetail(item.id)">
        <image :src="item.image" mode="aspectFill" class="store-image" @error="onImgError(item)" />
        <view class="store-info">
          <view class="store-header-row">
            <text class="store-name">{{ item.name }}</text>
            <view class="distance">{{ item.distance }}km</view>
          </view>
          <view class="store-rating">
            <text class="rating-text">⭐ {{ item.rating }}</text>
            <text class="sales-text">月售{{ item.sales }}单</text>
          </view>
          <text class="store-address">{{ item.address }}</text>
          <view class="store-tags">
            <text class="tag" v-for="(tag, index) in item.tags" :key="index">{{ tag }}</text>
          </view>
        </view>
      </view>

      <view class="empty-store" v-if="storeList.length === 0 && !loading">
        <text class="empty-icon">🏬</text>
        <text class="empty-text">暂无附近门店</text>
      </view>

      <view class="loading-more" v-if="loading">
        <text>加载中...</text>
      </view>
      <view class="no-more" v-else-if="noMore && storeList.length > 0">
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

const currentCity = ref('杭州市')
const keyword = ref('')
const currentTab = ref('all')
const storeList = ref<any[]>([])
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = 10

const tabList = [
  { type: 'all', name: '全部' },
  { type: 'nearby', name: '附近' },
  { type: 'smart', name: '智能排序' }
]

const mockStores = [
  {
    id: 1,
    name: '云亩优选·西湖店',
    image: 'https://picsum.photos/id/28/400/300',
    rating: 4.9,
    sales: 2856,
    distance: 0.5,
    address: '西湖区文三路 123 号云亩大厦 1 层',
    tags: ['自提', '配送', '新品']
  },
  {
    id: 2,
    name: '云亩优选·余杭店',
    image: 'https://picsum.photos/id/42/400/300',
    rating: 4.8,
    sales: 1980,
    distance: 3.2,
    address: '余杭区未来科技城梦想小镇创业街 88 号',
    tags: ['自提', '配送']
  },
  {
    id: 3,
    name: '云亩优选·滨江店',
    image: 'https://picsum.photos/id/39/400/300',
    rating: 4.7,
    sales: 1520,
    distance: 5.8,
    address: '滨江区江南大道 567 号星光大道 B1 层',
    tags: ['配送', '满减']
  }
]

const loadStores = () => {
  loading.value = true
  setTimeout(() => {
    if (page.value === 1) {
      storeList.value = [...mockStores]
    }
    loading.value = false
    noMore.value = true
  }, 500)
}

const loadMore = () => {
  if (loading.value || noMore.value) return
  page.value++
  loadStores()
}

const switchTab = (type: string) => {
  currentTab.value = type
  page.value = 1
  storeList.value = []
  noMore.value = false
  loadStores()
}

const handleStoreSearch = () => {
  page.value = 1
  storeList.value = []
  noMore.value = false
  loadStores()
}

const goHome = () => {
  uni.switchTab({ url: '/pages/home/index' })
}

const goSearch = () => {
  uni.navigateTo({ url: '/pages/search/index' })
}

const goStoreDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/feature/store-detail?id=${id}` })
}

const onImgError = (item: any) => {
  item.image = defaultImg
}

onMounted(() => {
  loadStores()
})
</script>

<style lang="scss" scoped>
.store-page {
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

.store-header {
  background: linear-gradient(135deg, #00b894, #55efc4);
  padding: 20rpx 30rpx 30rpx;

  .location-bar {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    .location-icon {
      font-size: 28rpx;
      margin-right: 10rpx;
    }

    .location-text {
      font-size: 28rpx;
      color: #fff;
      font-weight: 500;
    }

    .location-arrow {
      font-size: 20rpx;
      color: #fff;
      margin-left: 8rpx;
    }
  }

  .search-bar {
    display: flex;
    align-items: center;
    height: 72rpx;
    background-color: #fff;
    border-radius: 36rpx;
    padding: 0 25rpx;

    .search-icon {
      font-size: 28rpx;
      margin-right: 15rpx;
    }

    .search-input {
      flex: 1;
      font-size: 26rpx;
      color: #333;
    }
  }
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
      color: #00b894;
      font-weight: bold;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 40rpx;
        height: 4rpx;
        background-color: #00b894;
        border-radius: 2rpx;
      }
    }
  }
}

.store-scroll {
  flex: 1;
  padding: 20rpx;
}

.store-item {
  display: flex;
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  overflow: hidden;

  .store-image {
    width: 200rpx;
    height: 200rpx;
    flex-shrink: 0;
  }

  .store-info {
    flex: 1;
    padding: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .store-header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

      .store-name {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
        flex: 1;
      }

      .distance {
        font-size: 22rpx;
        color: #999;
        flex-shrink: 0;
        margin-left: 10rpx;
      }
    }

    .store-rating {
      display: flex;
      align-items: center;

      .rating-text {
        font-size: 24rpx;
        color: #ff6b00;
        margin-right: 15rpx;
      }

      .sales-text {
        font-size: 22rpx;
        color: #999;
      }
    }

    .store-address {
      font-size: 24rpx;
      color: #666;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }

    .store-tags {
      display: flex;
      gap: 10rpx;

      .tag {
        font-size: 20rpx;
        color: #00b894;
        background-color: #e8f8f5;
        padding: 4rpx 12rpx;
        border-radius: 4rpx;
      }
    }
  }
}

.empty-store {
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
