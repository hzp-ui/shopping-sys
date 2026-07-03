<template>
  <view class="group-page">
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
          <text class="search-placeholder">搜索拼团商品</text>
        </view>
        <view class="navbar-right"></view>
      </view>
    </view>

    <view class="page-content">
    <view class="group-header">
      <view class="header-content">
        <text class="title">拼团优惠</text>
        <text class="subtitle">人多更划算，拼团更便宜</text>
      </view>
    </view>

    <scroll-view scroll-y class="group-scroll" @scrolltolower="loadMore">
      <view class="group-item" v-for="item in goodsList" :key="item.id" @click="goGoodsDetail(item.id)">
        <image :src="item.image" mode="aspectFill" class="goods-image" @error="onImgError(item)" />
        <view class="goods-info">
          <text class="goods-name">{{ item.name }}</text>
          <text class="goods-desc">{{ item.desc }}</text>
          <view class="price-row">
            <view class="group-price">
              <text class="price-label">拼团价</text>
              <text class="price-value">¥{{ item.groupPrice }}</text>
            </view>
            <text class="original-price">¥{{ item.originalPrice }}</text>
          </view>
          <view class="group-info">
            <text class="group-num">{{ item.groupNum }}人团</text>
            <text class="group-count">已拼{{ item.groupCount }}件</text>
          </view>
          <view class="group-btn">
            <text>去开团</text>
          </view>
        </view>
      </view>

      <view class="empty-list" v-if="goodsList.length === 0 && !loading">
        <text class="empty-icon">👥</text>
        <text class="empty-text">暂无拼团商品</text>
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

const goodsList = ref<any[]>([])
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = 10

const mockGoods = [
  { id: 8, name: '云亩有机苹果 5斤', desc: '新鲜直达，脆甜多汁', groupPrice: '15.90', originalPrice: '29.90', groupNum: 5, groupCount: 3000, image: 'https://picsum.photos/id/1080/400/400' },
  { id: 6, name: '云亩时尚运动鞋', desc: '轻量透气，缓震舒适', groupPrice: '259.00', originalPrice: '399.00', groupNum: 2, groupCount: 1500, image: 'https://picsum.photos/id/21/400/400' },
  { id: 2, name: '云亩无线蓝牙耳机', desc: '主动降噪，超长续航', groupPrice: '199.00', originalPrice: '299.00', groupNum: 3, groupCount: 2000, image: 'https://picsum.photos/id/4/400/400' }
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
.group-page {
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

.group-header {
  background: linear-gradient(135deg, #00b894, #55efc4);
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

.group-scroll {
  flex: 1;
  padding: 20rpx;
}

.group-item {
  display: flex;
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  overflow: hidden;

  .goods-image {
    width: 240rpx;
    height: 240rpx;
    flex-shrink: 0;
  }

  .goods-info {
    flex: 1;
    padding: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .goods-name {
      font-size: 28rpx;
      color: #333;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      line-height: 1.4;
      font-weight: 500;
    }

    .goods-desc {
      font-size: 24rpx;
      color: #999;
    }

    .price-row {
      display: flex;
      align-items: baseline;

      .group-price {
        display: flex;
        align-items: baseline;

        .price-label {
          font-size: 20rpx;
          color: #fff;
          background-color: #ff6b00;
          padding: 4rpx 10rpx;
          border-radius: 4rpx;
          margin-right: 10rpx;
        }

        .price-value {
          font-size: 36rpx;
          color: #ff6b00;
          font-weight: bold;
        }
      }

      .original-price {
        font-size: 24rpx;
        color: #999;
        text-decoration: line-through;
        margin-left: 15rpx;
      }
    }

    .group-info {
      display: flex;
      justify-content: space-between;
      font-size: 22rpx;
      color: #999;

      .group-num {
        color: #00b894;
      }
    }

    .group-btn {
      align-self: flex-end;
      padding: 10rpx 35rpx;
      background: linear-gradient(90deg, #ff6b00, #ff8c00);
      color: #fff;
      font-size: 24rpx;
      font-weight: bold;
      border-radius: 30rpx;
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
