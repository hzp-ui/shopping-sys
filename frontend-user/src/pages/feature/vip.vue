<template>
  <view class="vip-page">
    <view class="navbar-container" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="navbar-content" :style="{ height: navBarHeight + 'px' }">
        <view class="navbar-left" @click="goHome">
          <view class="back-capsule">
            <text class="back-icon">🏠</text>
            <text class="back-text">首页</text>
          </view>
        </view>
        <view class="navbar-title">
          <text class="title-text">会员中心</text>
        </view>
        <view class="navbar-right"></view>
      </view>
    </view>

    <view class="page-content">
    <view class="vip-header">
      <view class="header-content">
        <view class="user-info">
          <image :src="avatar" mode="aspectFill" class="avatar" @error="onAvatarError" />
          <view class="info">
            <text class="nickname">云亩会员</text>
            <view class="vip-badge">
              <text class="badge-icon">👑</text>
              <text class="badge-text">{{ vipLevel }}</text>
            </view>
          </view>
        </view>

        <view class="progress-section">
          <view class="progress-info">
            <text class="growth-text">成长值 {{ growthValue }}/{{ nextLevelValue }}</text>
            <text class="next-text">距下一等级还差 {{ nextLevelValue - growthValue }} 成长值</text>
          </view>
          <view class="progress-bar">
            <view class="progress-inner" :style="{ width: progressPercent + '%' }"></view>
          </view>
        </view>
      </view>
    </view>

    <view class="benefits-section">
      <view class="section-header">
        <text class="section-title">会员权益</text>
      </view>
      <view class="benefits-grid">
        <view class="benefit-item" v-for="item in benefitList" :key="item.id">
          <view class="benefit-icon">{{ item.icon }}</view>
          <text class="benefit-name">{{ item.name }}</text>
          <text class="benefit-desc">{{ item.desc }}</text>
        </view>
      </view>
    </view>

    <view class="task-section">
      <view class="section-header">
        <text class="section-title">成长任务</text>
        <text class="section-more">更多 ></text>
      </view>
      <view class="task-list">
        <view class="task-item" v-for="item in taskList" :key="item.id">
          <view class="task-icon">{{ item.icon }}</view>
          <view class="task-info">
            <text class="task-name">{{ item.name }}</text>
            <text class="task-growth">+{{ item.growth }}成长值</text>
          </view>
          <view
            class="task-btn"
            :class="{ done: item.done }"
            @click="doTask(item)"
          >
            {{ item.done ? '已完成' : '去完成' }}
          </view>
        </view>
      </view>
    </view>

    <view class="goods-section">
      <view class="section-header">
        <text class="section-title">会员专享价</text>
        <text class="section-more">更多 ></text>
      </view>
      <scroll-view scroll-x class="goods-scroll">
        <view class="goods-item" v-for="item in goodsList" :key="item.id" @click="goGoodsDetail(item.id)">
          <image :src="item.image" mode="aspectFill" class="goods-image" @error="onImgError(item)" />
          <text class="goods-name">{{ item.name }}</text>
          <view class="price-row">
            <text class="vip-price">¥{{ item.vipPrice }}</text>
            <text class="original-price">¥{{ item.originalPrice }}</text>
          </view>
        </view>
      </scroll-view>
    </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const defaultImg = 'https://picsum.photos/id/119/200/200'

const statusBarHeight = ref(20)
const navBarHeight = ref(44)

const sysInfo = uni.getSystemInfoSync()
statusBarHeight.value = sysInfo.statusBarHeight || 20
const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
if (menuButtonInfo) {
  navBarHeight.value = (menuButtonInfo.top - statusBarHeight.value) * 2 + menuButtonInfo.height
}

const avatar = ref('https://picsum.photos/id/1005/200/200')
const vipLevel = ref('黄金会员')
const growthValue = ref(2680)
const nextLevelValue = ref(5000)

const progressPercent = computed(() => {
  return Math.min((growthValue.value / nextLevelValue.value) * 100, 100)
})

const benefitList = ref<any[]>([])
const taskList = ref<any[]>([])
const goodsList = ref<any[]>([])

const initBenefitList = () => {
  benefitList.value = [
    { id: 1, icon: '💰', name: '专属折扣', desc: '全场95折' },
    { id: 2, icon: '🎁', name: '生日礼包', desc: '生日送好礼' },
    { id: 3, icon: '🚚', name: '免运费', desc: '每月3次' },
    { id: 4, icon: '⚡', name: '优先发货', desc: '极速发货' },
    { id: 5, icon: '💎', name: '积分翻倍', desc: '购物2倍积分' },
    { id: 6, icon: '👑', name: '专属客服', desc: 'VIP专线' },
    { id: 7, icon: '🎫', name: '专属券', desc: '每月领券' },
    { id: 8, icon: '📦', name: '试用特权', desc: '新品试用' }
  ]
}

const initTaskList = () => {
  taskList.value = [
    { id: 1, name: '每日签到', icon: '📅', growth: 5, done: true },
    { id: 2, name: '购物满100元', icon: '🛒', growth: 20, done: false },
    { id: 3, name: '评价商品', icon: '✍️', growth: 10, done: false },
    { id: 4, name: '邀请好友', icon: '👥', growth: 50, done: false }
  ]
}

const initGoodsList = () => {
  goodsList.value = [
    { id: 1, name: '云亩智能手机 Pro Max', vipPrice: '5699.00', originalPrice: '5999.00', image: 'https://picsum.photos/id/1/300/300' },
    { id: 2, name: '云亩无线蓝牙耳机', vipPrice: '279.00', originalPrice: '299.00', image: 'https://picsum.photos/id/4/300/300' },
    { id: 8, name: '云亩有机苹果 5斤', vipPrice: '27.90', originalPrice: '29.90', image: 'https://picsum.photos/id/1080/300/300' }
  ]
}

const doTask = (item: any) => {
  if (item.done) return
  uni.showToast({ title: '去完成' + item.name, icon: 'none' })
}

const goGoodsDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/goods/detail?id=${id}` })
}

const goHome = () => {
  uni.switchTab({ url: '/pages/home/index' })
}

const onAvatarError = () => {
  avatar.value = defaultImg
}

const onImgError = (item: any) => {
  item.image = defaultImg
}

onMounted(() => {
  initBenefitList()
  initTaskList()
  initGoodsList()
})
</script>

<style lang="scss" scoped>
.vip-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 40rpx;
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

.navbar-title {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  .title-text {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
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

.vip-header {
  background: linear-gradient(135deg, #d4af37, #f1c40f);
  padding: 30rpx 30rpx 40rpx;

  .header-content {
    .user-info {
      display: flex;
      align-items: center;
      margin-bottom: 40rpx;

      .avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        border: 4rpx solid rgba(253, 203, 110, 0.5);
        margin-right: 25rpx;
      }

      .info {
        .nickname {
          display: block;
          font-size: 32rpx;
          font-weight: bold;
          color: #fff;
        }

        .vip-badge {
          display: inline-flex;
          align-items: center;
          margin-top: 10rpx;
          padding: 6rpx 20rpx;
          background: linear-gradient(90deg, #fdcb6e, #e17055);
          border-radius: 20rpx;

          .badge-icon {
            font-size: 24rpx;
            margin-right: 8rpx;
          }

          .badge-text {
            font-size: 22rpx;
            color: #fff;
            font-weight: 500;
          }
        }
      }
    }

    .progress-section {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 12rpx;
      padding: 25rpx;

      .progress-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15rpx;

        .growth-text {
          font-size: 26rpx;
          color: #fdcb6e;
          font-weight: 500;
        }

        .next-text {
          font-size: 22rpx;
          color: rgba(255, 255, 255, 0.6);
        }
      }

      .progress-bar {
        height: 12rpx;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 6rpx;
        overflow: hidden;

        .progress-inner {
          height: 100%;
          background: linear-gradient(90deg, #fdcb6e, #e17055);
          border-radius: 6rpx;
        }
      }
    }
  }
}

.benefits-section,
.task-section,
.goods-section {
  margin: 0 20rpx 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx 0;
}

.benefits-section {
  margin-top: -50rpx;
  position: relative;
  z-index: 2;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30rpx 20rpx;

  .section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
  }

  .section-more {
    font-size: 24rpx;
    color: #999;
  }
}

.benefits-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 0 10rpx;

  .benefit-item {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 0;

    .benefit-icon {
      font-size: 40rpx;
      margin-bottom: 10rpx;
    }

    .benefit-name {
      font-size: 24rpx;
      color: #333;
      font-weight: 500;
    }

    .benefit-desc {
      font-size: 20rpx;
      color: #999;
      margin-top: 6rpx;
    }
  }
}

.task-list {
  padding: 0 30rpx;

  .task-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .task-icon {
      font-size: 36rpx;
      margin-right: 20rpx;
    }

    .task-info {
      flex: 1;
      display: flex;
      flex-direction: column;

      .task-name {
        font-size: 28rpx;
        color: #333;
      }

      .task-growth {
        font-size: 22rpx;
        color: #e17055;
        margin-top: 6rpx;
      }
    }

    .task-btn {
      padding: 12rpx 30rpx;
      background: linear-gradient(90deg, #fdcb6e, #e17055);
      color: #fff;
      font-size: 24rpx;
      border-radius: 30rpx;

      &.done {
        background: #f0f0f0;
        color: #999;
      }
    }
  }
}

.goods-scroll {
  white-space: nowrap;
  padding: 0 30rpx;
}

.goods-item {
  display: inline-block;
  width: 220rpx;
  margin-right: 20rpx;
  vertical-align: top;

  &:last-child {
    margin-right: 0;
  }

  .goods-image {
    width: 220rpx;
    height: 220rpx;
    border-radius: 12rpx;
  }

  .goods-name {
    display: block;
    font-size: 24rpx;
    color: #333;
    margin-top: 12rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .price-row {
    display: flex;
    align-items: baseline;
    margin-top: 8rpx;

    .vip-price {
      font-size: 28rpx;
      color: #e17055;
      font-weight: bold;
    }

    .original-price {
      font-size: 20rpx;
      color: #999;
      text-decoration: line-through;
      margin-left: 10rpx;
    }
  }
}
</style>
