<template>
  <view class="store-detail-page">
    <view class="navbar-container" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="navbar-content" :style="{ height: navBarHeight + 'px' }">
        <view class="navbar-left" @click="goHome">
          <view class="back-capsule">
            <text class="back-icon">🏠</text>
            <text class="back-text">首页</text>
          </view>
        </view>
        <view class="navbar-title">
          <text class="title-text">门店详情</text>
        </view>
        <view class="navbar-right"></view>
      </view>
    </view>

    <view class="page-content">
      <view class="store-header">
        <image :src="storeInfo.image" mode="aspectFill" class="store-banner" @error="onBannerError" />
        <view class="store-info-card">
          <view class="store-main">
            <text class="store-name">{{ storeInfo.name }}</text>
            <view class="store-stats">
              <text class="rating">⭐ {{ storeInfo.rating }}</text>
              <text class="divider">|</text>
              <text class="sales">月售{{ storeInfo.sales }}单</text>
              <text class="divider">|</text>
              <text class="distance">{{ storeInfo.distance }}km</text>
            </view>
            <view class="store-tags">
              <text class="tag" v-for="(tag, index) in storeInfo.tags" :key="index">{{ tag }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="section address-section">
        <view class="section-icon">📍</view>
        <view class="section-content">
          <text class="section-label">门店地址</text>
          <text class="address-text">{{ storeInfo.address }}</text>
        </view>
        <view class="section-actions">
          <view class="action-btn" @click="handleNavigate">
            <text class="action-icon">🧭</text>
            <text class="action-text">导航</text>
          </view>
          <view class="action-btn" @click="handleCall">
            <text class="action-icon">📞</text>
            <text class="action-text">电话</text>
          </view>
        </view>
      </view>

      <view class="section">
        <view class="section-icon">🕐</view>
        <view class="section-content">
          <text class="section-label">营业时间</text>
          <text class="section-value">{{ storeInfo.businessHours }}</text>
        </view>
      </view>

      <view class="section">
        <view class="section-icon">📱</view>
        <view class="section-content">
          <text class="section-label">联系电话</text>
          <text class="section-value">{{ storeInfo.phone }}</text>
        </view>
      </view>

      <view class="section intro-section">
        <text class="section-title">门店介绍</text>
        <text class="intro-text">{{ storeInfo.intro }}</text>
      </view>

      <view class="section services-section">
        <text class="section-title">门店服务</text>
        <view class="services-list">
          <view class="service-item" v-for="(item, index) in serviceList" :key="index">
            <text class="service-icon">{{ item.icon }}</text>
            <text class="service-name">{{ item.name }}</text>
            <text class="service-desc">{{ item.desc }}</text>
          </view>
        </view>
      </view>

      <view class="section goods-section">
        <view class="section-header">
          <text class="section-title">热门商品推荐</text>
          <text class="section-more" @click="goGoodsList">查看全部 ></text>
        </view>
        <view class="goods-grid">
          <view class="goods-item" v-for="item in goodsList" :key="item.id" @click="goGoodsDetail(item.id)">
            <image :src="item.image" mode="aspectFill" class="goods-image" @error="onImgError(item)" />
            <view class="goods-info">
              <text class="goods-name">{{ item.name }}</text>
              <view class="goods-bottom">
                <text class="goods-price">¥{{ item.price }}</text>
                <text class="goods-sales">月售{{ item.sales }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="bottom-placeholder"></view>
    </view>

    <view class="bottom-bar">
      <view class="bar-item" @click="handleNavigate">
        <text class="bar-icon">🧭</text>
        <text class="bar-text">导航</text>
      </view>
      <view class="bar-item" @click="handleCall">
        <text class="bar-icon">📞</text>
        <text class="bar-text">电话</text>
      </view>
      <view class="bar-btn" @click="goGoodsList">
        <text class="btn-text">查看商品</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const defaultImg = 'https://picsum.photos/id/119/400/400'
const bannerDefaultImg = 'https://picsum.photos/id/28/800/400'

const statusBarHeight = ref(20)
const navBarHeight = ref(44)

const sysInfo = uni.getSystemInfoSync()
statusBarHeight.value = sysInfo.statusBarHeight || 20
const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
if (menuButtonInfo) {
  navBarHeight.value = (menuButtonInfo.top - statusBarHeight.value) * 2 + menuButtonInfo.height
}

const storeInfo = ref({
  id: 1,
  name: '云亩优选·西湖店',
  image: 'https://picsum.photos/id/28/800/400',
  rating: 4.9,
  sales: 2856,
  distance: 0.5,
  address: '西湖区文三路 123 号云亩大厦 1 层',
  phone: '0571-88886666',
  businessHours: '08:00 - 22:00',
  tags: ['24小时营业', '扫码自提', '支持配送'],
  intro: '云亩优选·西湖店是云亩品牌旗下的精品生鲜超市，位于西湖区核心商圈。店内精选全球优质生鲜商品，涵盖新鲜蔬果、肉类禽蛋、海鲜水产、粮油干货、休闲零食等万余种商品。我们坚持"新鲜、优质、实惠"的经营理念，为您提供便捷的购物体验和贴心的服务。支持线上下单配送到家，也可到店自提扫码核销。'
})

const serviceList = ref([
  { icon: '🛒', name: '到店自提', desc: '线上下单，到店自提更便捷' },
  { icon: '🚚', name: '商家配送', desc: '3公里内最快30分钟送达' },
  { icon: '📱', name: '扫码核销', desc: '出示二维码，快速核销取货' }
])

const goodsList = ref<any[]>([])

const mockGoods = [
  { id: 1, name: '云亩有机苹果 500g', price: 9.9, sales: 1256, image: 'https://picsum.photos/id/1080/400/400' },
  { id: 2, name: '新鲜草莓 1盒', price: 29.9, sales: 892, image: 'https://picsum.photos/id/102/400/400' },
  { id: 3, name: '精选五花肉 500g', price: 35.8, sales: 654, image: 'https://picsum.photos/id/1083/400/400' },
  { id: 4, name: '纯牛奶 1L装', price: 15.9, sales: 2341, image: 'https://picsum.photos/id/1024/400/400' },
  { id: 5, name: '土鸡蛋 10枚装', price: 19.9, sales: 1567, image: 'https://picsum.photos/id/101/400/400' },
  { id: 6, name: '新鲜香蕉 1kg', price: 6.9, sales: 1890, image: 'https://picsum.photos/id/1007/400/400' }
]

const loadGoods = () => {
  goodsList.value = [...mockGoods]
}

const goHome = () => {
  uni.switchTab({ url: '/pages/home/index' })
}

const handleNavigate = () => {
  uni.showToast({ title: '正在打开地图导航...', icon: 'none' })
}

const handleCall = () => {
  uni.makePhoneCall({
    phoneNumber: storeInfo.value.phone,
    fail: () => {
      uni.showToast({ title: '呼叫失败', icon: 'none' })
    }
  })
}

const goGoodsList = () => {
  uni.showToast({ title: '查看商品列表', icon: 'none' })
}

const goGoodsDetail = (id: number) => {
  uni.navigateTo({ url: '/pages/goods/detail?id=' + id })
}

const onBannerError = () => {
  storeInfo.value.image = bannerDefaultImg
}

const onImgError = (item: any) => {
  item.image = defaultImg
}

onMounted(() => {
  loadGoods()
})
</script>

<style lang="scss" scoped>
.store-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;
}

.navbar-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: transparent;

  .back-capsule {
    background-color: rgba(255, 255, 255, 0.9);
  }

  .title-text {
    color: #fff;
  }
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
  border-radius: 30rpx;

  .back-icon {
    font-size: 24rpx;
    margin-right: 6rpx;
  }

  .back-text {
    font-size: 24rpx;
    color: #333;
  }
}

.navbar-title {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  .title-text {
    font-size: 32rpx;
    font-weight: bold;
  }
}

.navbar-right {
  flex-shrink: 0;
  margin-left: 20rpx;
  min-width: 80rpx;
}

.page-content {
  padding-top: 180rpx;
  padding-bottom: 30rpx;
}

.store-header {
  margin-top: -180rpx;
  position: relative;

  .store-banner {
    width: 100%;
    height: 400rpx;
    display: block;
  }

  .store-info-card {
    margin: -60rpx 20rpx 0;
    background-color: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    position: relative;
    z-index: 2;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);

    .store-main {
      .store-name {
        display: block;
        font-size: 36rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 16rpx;
      }

      .store-stats {
        display: flex;
        align-items: center;
        margin-bottom: 16rpx;

        .rating {
          font-size: 26rpx;
          color: #ff6b00;
        }

        .divider {
          font-size: 24rpx;
          color: #ddd;
          margin: 0 16rpx;
        }

        .sales,
        .distance {
          font-size: 24rpx;
          color: #999;
        }
      }

      .store-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 12rpx;

        .tag {
          font-size: 22rpx;
          color: #00b894;
          background: linear-gradient(135deg, #e8f8f5, #d0f0e8);
          padding: 6rpx 16rpx;
          border-radius: 20rpx;
        }
      }
    }
  }
}

.section {
  margin: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 25rpx 30rpx;
  display: flex;
  align-items: center;

  .section-icon {
    font-size: 36rpx;
    margin-right: 20rpx;
    flex-shrink: 0;
  }

  .section-content {
    flex: 1;
    display: flex;
    flex-direction: column;

    .section-label {
      font-size: 26rpx;
      color: #999;
      margin-bottom: 8rpx;
    }

    .section-value {
      font-size: 28rpx;
      color: #333;
    }
  }

  .section-actions {
    display: flex;
    gap: 20rpx;
    flex-shrink: 0;

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;

      .action-icon {
        font-size: 36rpx;
        margin-bottom: 6rpx;
      }

      .action-text {
        font-size: 22rpx;
        color: #00b894;
      }
    }
  }

  .section-title {
    display: block;
    width: 100%;
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
}

.address-section {
  .address-text {
    font-size: 28rpx;
    color: #333;
    line-height: 1.5;
  }
}

.intro-section {
  flex-direction: column;
  align-items: flex-start;

  .intro-text {
    font-size: 26rpx;
    color: #666;
    line-height: 1.8;
  }
}

.services-section {
  flex-direction: column;
  align-items: flex-start;

  .services-list {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .service-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;

      .service-icon {
        font-size: 48rpx;
        margin-bottom: 12rpx;
      }

      .service-name {
        font-size: 26rpx;
        color: #333;
        font-weight: 500;
        margin-bottom: 6rpx;
      }

      .service-desc {
        font-size: 20rpx;
        color: #999;
        text-align: center;
      }
    }
  }
}

.goods-section {
  flex-direction: column;
  align-items: flex-start;

  .section-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .section-title {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 0;
      width: auto;
    }

    .section-more {
      font-size: 24rpx;
      color: #999;
    }
  }

  .goods-grid {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .goods-item {
      width: 48%;
      border-radius: 12rpx;
      overflow: hidden;
      margin-bottom: 20rpx;
      background-color: #fafafa;

      .goods-image {
        width: 100%;
        height: 260rpx;
        display: block;
      }

      .goods-info {
        padding: 16rpx;

        .goods-name {
          display: block;
          font-size: 26rpx;
          color: #333;
          line-height: 1.4;
          height: 72rpx;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }

        .goods-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10rpx;

          .goods-price {
            font-size: 30rpx;
            color: #ff6b00;
            font-weight: bold;
          }

          .goods-sales {
            font-size: 20rpx;
            color: #999;
          }
        }
      }
    }
  }
}

.bottom-placeholder {
  height: 120rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 16rpx 30rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 100;

  .bar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 40rpx;

    .bar-icon {
      font-size: 36rpx;
      margin-bottom: 4rpx;
    }

    .bar-text {
      font-size: 22rpx;
      color: #666;
    }
  }

  .bar-btn {
    flex: 1;
    height: 80rpx;
    background: linear-gradient(135deg, #00b894, #55efc4);
    border-radius: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .btn-text {
      font-size: 30rpx;
      color: #fff;
      font-weight: bold;
    }
  }
}
</style>
