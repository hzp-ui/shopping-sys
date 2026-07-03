<template>
  <view class="logistics-page">
    <view class="navbar-container" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="navbar-content" :style="{ height: navBarHeight + 'px' }">
        <view class="navbar-left" @click="goHome">
          <view class="back-capsule">
            <text class="back-icon">🏠</text>
            <text class="back-text">首页</text>
          </view>
        </view>
        <view class="navbar-title">
          <text class="title-text">物流详情</text>
        </view>
        <view class="navbar-right"></view>
      </view>
    </view>

    <view class="page-content">
      <view class="logistics-header">
        <view class="header-content">
          <view class="status-info">
            <text class="status-icon">🚚</text>
            <view class="status-text">
              <text class="status-title">运输中</text>
              <text class="status-desc">快递员正在飞速送货中，请耐心等待</text>
            </view>
          </view>
          <view class="express-info">
            <text class="express-name">顺丰速运</text>
            <text class="express-no">SF1234567890123</text>
          </view>
        </view>
      </view>

      <view class="goods-info">
        <image src="https://picsum.photos/id/4/200/200" mode="aspectFill" class="goods-image" />
        <view class="goods-detail">
          <text class="goods-name">云亩无线蓝牙耳机 主动降噪 超长续航</text>
          <text class="goods-spec">颜色：黑色 / 版本：Pro版</text>
          <text class="goods-count">x1</text>
        </view>
      </view>

      <view class="address-card">
        <view class="address-icon">📍</view>
        <view class="address-info">
          <view class="address-top">
            <text class="receiver-name">张三</text>
            <text class="receiver-phone">138****8888</text>
          </view>
          <text class="address-detail">北京市朝阳区建国路88号SOHO现代城A座1201室</text>
        </view>
      </view>

      <view class="trace-card">
        <view class="card-title">
          <text class="title-text">物流轨迹</text>
        </view>
        <view class="trace-list">
          <view
            class="trace-item"
            :class="{ first: index === 0 }"
            v-for="(item, index) in traceList"
            :key="index"
          >
            <view class="trace-dot">
              <view class="dot-inner" :class="{ active: index === 0 }"></view>
            </view>
            <view class="trace-line" v-if="index < traceList.length - 1"></view>
            <view class="trace-content">
              <text class="trace-desc">{{ item.desc }}</text>
              <text class="trace-time">{{ item.time }}</text>
              <text class="trace-location" v-if="item.location">{{ item.location }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="action-buttons">
        <view class="action-btn">
          <text class="btn-icon">📞</text>
          <text class="btn-text">联系快递员</text>
        </view>
        <view class="action-btn">
          <text class="btn-icon">📞</text>
          <text class="btn-text">联系客服</text>
        </view>
        <view class="action-btn">
          <text class="btn-icon">📍</text>
          <text class="btn-text">物流地图</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const statusBarHeight = ref(20)
const navBarHeight = ref(44)

const sysInfo = uni.getSystemInfoSync()
statusBarHeight.value = sysInfo.statusBarHeight || 20
const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
if (menuButtonInfo) {
  navBarHeight.value = (menuButtonInfo.top - statusBarHeight.value) * 2 + menuButtonInfo.height
}

const traceList = ref([
  {
    desc: '快件正在派送中，快递员：李师傅，电话：138****6666',
    time: '2026-07-02 09:30:00',
    location: '北京市朝阳区'
  },
  {
    desc: '快件已到达【北京朝阳营业点】',
    time: '2026-07-02 07:15:00',
    location: '北京市朝阳区'
  },
  {
    desc: '快件已从【北京转运中心】发出',
    time: '2026-07-02 03:20:00',
    location: '北京市大兴区'
  },
  {
    desc: '快件已到达【北京转运中心】',
    time: '2026-07-01 22:45:00',
    location: '北京市大兴区'
  },
  {
    desc: '快件已从【深圳集散中心】发出',
    time: '2026-07-01 18:30:00',
    location: '深圳市宝安区'
  },
  {
    desc: '快件已到达【深圳集散中心】',
    time: '2026-07-01 15:20:00',
    location: '深圳市宝安区'
  },
  {
    desc: '商家已发货',
    time: '2026-07-01 14:00:00',
    location: '深圳市南山区科技园'
  },
  {
    desc: '订单已提交，等待商家发货',
    time: '2026-06-30 20:15:00',
    location: ''
  }
])

const goHome = () => {
  uni.switchTab({ url: '/pages/home/index' })
}
</script>

<style lang="scss" scoped>
.logistics-page {
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
    margin-right: 6rpx;
  }

  .back-text {
    font-size: 24rpx;
    color: #333;
  }
}

.navbar-title {
  flex: 1;
  text-align: center;

  .title-text {
    font-size: 32rpx;
    font-weight: 500;
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
  padding-bottom: 40rpx;
}

.logistics-header {
  background: linear-gradient(135deg, #0984e3, #74b9ff);
  padding: 30rpx 30rpx 40rpx;

  .header-content {
    .status-info {
      display: flex;
      align-items: center;
      margin-bottom: 25rpx;

      .status-icon {
        font-size: 60rpx;
        margin-right: 20rpx;
      }

      .status-text {
        display: flex;
        flex-direction: column;

        .status-title {
          font-size: 36rpx;
          font-weight: bold;
          color: #fff;
        }

        .status-desc {
          font-size: 24rpx;
          color: rgba(255, 255, 255, 0.85);
          margin-top: 6rpx;
        }
      }
    }

    .express-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.2);
      padding: 15rpx 20rpx;
      border-radius: 10rpx;

      .express-name {
        font-size: 26rpx;
        color: #fff;
        font-weight: 500;
      }

      .express-no {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }
}

.goods-info {
  display: flex;
  background-color: #fff;
  margin: 20rpx;
  padding: 20rpx;
  border-radius: 12rpx;

  .goods-image {
    width: 140rpx;
    height: 140rpx;
    border-radius: 10rpx;
    flex-shrink: 0;
  }

  .goods-detail {
    flex: 1;
    margin-left: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;

    .goods-name {
      font-size: 26rpx;
      color: #333;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      line-height: 1.4;
    }

    .goods-spec {
      font-size: 22rpx;
      color: #999;
      margin-top: 8rpx;
    }

    .goods-count {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 24rpx;
      color: #999;
    }
  }
}

.address-card {
  display: flex;
  background-color: #fff;
  margin: 0 20rpx 20rpx;
  padding: 25rpx 20rpx;
  border-radius: 12rpx;
  align-items: flex-start;

  .address-icon {
    font-size: 32rpx;
    margin-right: 15rpx;
    flex-shrink: 0;
  }

  .address-info {
    flex: 1;

    .address-top {
      display: flex;
      align-items: center;
      margin-bottom: 10rpx;

      .receiver-name {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
        margin-right: 20rpx;
      }

      .receiver-phone {
        font-size: 26rpx;
        color: #666;
      }
    }

    .address-detail {
      font-size: 24rpx;
      color: #666;
      line-height: 1.5;
    }
  }
}

.trace-card {
  background-color: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 12rpx;
  overflow: hidden;

  .card-title {
    padding: 25rpx 30rpx;
    border-bottom: 1rpx solid #f0f0f0;

    .title-text {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
    }
  }

  .trace-list {
    padding: 20rpx 30rpx;
  }

  .trace-item {
    display: flex;
    position: relative;
    padding-bottom: 30rpx;

    &:last-child {
      padding-bottom: 0;
    }

    .trace-dot {
      width: 30rpx;
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      padding-top: 8rpx;

      .dot-inner {
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
        background-color: #ddd;

        &.active {
          width: 20rpx;
          height: 20rpx;
          background-color: #0984e3;
          margin-top: -2rpx;
        }
      }
    }

    .trace-line {
      position: absolute;
      left: 44rpx;
      top: 28rpx;
      bottom: 0;
      width: 2rpx;
      background-color: #eee;
    }

    .trace-content {
      flex: 1;
      margin-left: 15rpx;

      .trace-desc {
        font-size: 26rpx;
        color: #333;
        line-height: 1.5;
      }

      .trace-time {
        display: block;
        font-size: 22rpx;
        color: #999;
        margin-top: 8rpx;
      }

      .trace-location {
        display: block;
        font-size: 22rpx;
        color: #666;
        margin-top: 4rpx;
      }
    }

    &.first {
      .trace-desc {
        color: #0984e3;
        font-weight: 500;
      }
    }
  }
}

.action-buttons {
  display: flex;
  background-color: #fff;
  margin: 0 20rpx;
  border-radius: 12rpx;
  padding: 20rpx 0;

  .action-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    .btn-icon {
      font-size: 40rpx;
      margin-bottom: 10rpx;
    }

    .btn-text {
      font-size: 22rpx;
      color: #666;
    }
  }
}
</style>
