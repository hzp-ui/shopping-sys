<template>
  <view class="distribution-page">
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
          <text class="search-placeholder">搜索分销商品</text>
        </view>
        <view class="navbar-right"></view>
      </view>
    </view>

    <view class="page-content">
    <view class="dist-header">
      <view class="header-content">
        <view class="user-info">
          <view class="avatar">
            <text class="avatar-icon">👤</text>
          </view>
          <view class="info">
            <text class="title">分销专区</text>
            <text class="subtitle">分享好物，赚取佣金</text>
          </view>
          <view class="center-btn" @click="goDistributionCenter">
            <text class="center-btn-text">分销中心</text>
            <text class="center-btn-arrow">›</text>
          </view>
        </view>
        <view class="income-card">
          <view class="income-item">
            <text class="income-label">累计收益</text>
            <text class="income-value">¥1,286.50</text>
          </view>
          <view class="income-item">
            <text class="income-label">可提现</text>
            <text class="income-value">¥580.00</text>
          </view>
          <view class="income-item">
            <text class="income-label">待结算</text>
            <text class="income-value">¥706.50</text>
          </view>
        </view>
      </view>
    </view>

    <view class="action-bar">
      <view class="action-item" @click="goWithdraw">
        <text class="action-icon">💰</text>
        <text class="action-text">立即提现</text>
      </view>
      <view class="action-item" @click="goIncomeDetail">
        <text class="action-icon">📊</text>
        <text class="action-text">收益明细</text>
      </view>
      <view class="action-item" @click="goTeam">
        <text class="action-icon">👥</text>
        <text class="action-text">我的团队</text>
      </view>
      <view class="action-item" @click="goOrder">
        <text class="action-icon">📦</text>
        <text class="action-text">分销订单</text>
      </view>
    </view>

    <view class="section-header">
      <text class="section-title">高佣好物</text>
      <text class="section-more">更多 ></text>
    </view>

    <scroll-view scroll-y class="goods-scroll" @scrolltolower="loadMore">
      <view class="goods-grid">
        <view class="goods-item" v-for="item in goodsList" :key="item.id" @click="goGoodsDetail(item.id)">
          <image :src="item.image" mode="aspectFill" class="goods-image" @error="onImgError(item)" />
          <view class="goods-info">
            <text class="goods-name">{{ item.name }}</text>
            <view class="price-row">
              <text class="goods-price">¥{{ item.price }}</text>
              <text class="commission">佣金¥{{ item.commission }}</text>
            </view>
            <view class="share-btn" @click.stop="shareGoods(item)">
              <text>分享赚佣金</text>
            </view>
          </view>
        </view>
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
  { id: 1, name: '云亩智能手机 Pro Max', price: '5999.00', commission: '599.90', image: 'https://picsum.photos/id/1/400/400' },
  { id: 2, name: '云亩无线蓝牙耳机', price: '299.00', commission: '29.90', image: 'https://picsum.photos/id/4/400/400' },
  { id: 3, name: '云亩智能手表 Ultra', price: '1999.00', commission: '199.90', image: 'https://picsum.photos/id/7/400/400' },
  { id: 8, name: '云亩有机苹果 5斤', price: '29.90', commission: '4.50', image: 'https://picsum.photos/id/1080/400/400' }
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

const shareGoods = (item: any) => {
  uni.showToast({ title: '分享' + item.name, icon: 'none' })
}

const goWithdraw = () => {
  uni.showToast({ title: '立即提现', icon: 'none' })
}

const goIncomeDetail = () => {
  uni.showToast({ title: '收益明细', icon: 'none' })
}

const goTeam = () => {
  uni.showToast({ title: '我的团队', icon: 'none' })
}

const goOrder = () => {
  uni.showToast({ title: '分销订单', icon: 'none' })
}

const goHome = () => {
  uni.switchTab({ url: '/pages/home/index' })
}

const goSearch = () => {
  uni.navigateTo({ url: '/pages/search/index' })
}

const goDistributionCenter = () => {
  uni.navigateTo({ url: '/pages/distribution/center' })
}

const onImgError = (item: any) => {
  item.image = defaultImg
}

onMounted(() => {
  loadGoods()
})
</script>

<style lang="scss" scoped>
.distribution-page {
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

.dist-header {
  background: linear-gradient(135deg, #6c5ce7, #fd79a8);
  padding: 30rpx 30rpx 40rpx;

  .header-content {
    .user-info {
      display: flex;
      align-items: center;
      margin-bottom: 30rpx;

      .avatar {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20rpx;

        .avatar-icon {
          font-size: 50rpx;
        }
      }

      .info {
        flex: 1;

        .title {
          display: block;
          font-size: 32rpx;
          font-weight: bold;
          color: #fff;
        }

        .subtitle {
          display: block;
          font-size: 24rpx;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 8rpx;
        }
      }

      .center-btn {
        display: flex;
        align-items: center;
        padding: 12rpx 24rpx;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 30rpx;

        .center-btn-text {
          font-size: 24rpx;
          color: #fff;
        }

        .center-btn-arrow {
          font-size: 28rpx;
          color: #fff;
          margin-left: 6rpx;
        }
      }
    }

    .income-card {
      display: flex;
      background-color: #fff;
      border-radius: 16rpx;
      padding: 30rpx 0;

      .income-item {
        flex: 1;
        text-align: center;
        border-right: 1rpx solid #f0f0f0;

        &:last-child {
          border-right: none;
        }

        .income-label {
          display: block;
          font-size: 24rpx;
          color: #999;
        }

        .income-value {
          display: block;
          font-size: 32rpx;
          font-weight: bold;
          color: #ff6b00;
          margin-top: 10rpx;
        }
      }
    }
  }
}

.action-bar {
  display: flex;
  margin: -30rpx 20rpx 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx 0;
  position: relative;
  z-index: 2;

  .action-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    .action-icon {
      font-size: 40rpx;
      margin-bottom: 10rpx;
    }

    .action-text {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;

  .section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
  }

  .section-more {
    font-size: 26rpx;
    color: #999;
  }
}

.goods-scroll {
  flex: 1;
  padding: 0 20rpx;
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

    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15rpx;

      .goods-price {
        font-size: 28rpx;
        color: #ff6b00;
        font-weight: bold;
      }

      .commission {
        font-size: 20rpx;
        color: #6c5ce7;
        background-color: #f0edfc;
        padding: 4rpx 12rpx;
        border-radius: 6rpx;
      }
    }

    .share-btn {
      margin-top: 15rpx;
      text-align: center;
      padding: 12rpx 0;
      background: linear-gradient(90deg, #6c5ce7, #a29bfe);
      color: #fff;
      font-size: 24rpx;
      border-radius: 30rpx;
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
