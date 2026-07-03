<template>
  <view class="signin-page">
    <view class="navbar-container" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="navbar-content" :style="{ height: navBarHeight + 'px' }">
        <view class="navbar-left" @click="goHome">
          <view class="back-capsule">
            <text class="back-icon">🏠</text>
            <text class="back-text">首页</text>
          </view>
        </view>
        <view class="navbar-title">
          <text class="title-text">签到送礼</text>
        </view>
        <view class="navbar-right"></view>
      </view>
    </view>

    <view class="page-content">
    <view class="signin-header">
      <view class="header-content">
        <view class="points-info">
          <text class="points-label">我的积分</text>
          <text class="points-num">2680</text>
        </view>
        <view class="signin-btn" :class="{ signed: todaySigned }" @click="handleSignin">
          {{ todaySigned ? '已签到' : '立即签到' }}
        </view>
      </view>
    </view>

    <view class="signin-week">
      <view class="week-title">
        <text class="title-text">连续签到</text>
        <text class="sign-days">已连续签到 {{ continuousDays }} 天</text>
      </view>
      <view class="week-list">
        <view
          class="week-item"
          :class="{ signed: item.signed, today: item.isToday }"
          v-for="item in weekList"
          :key="item.day"
        >
          <text class="day-text">{{ item.dayText }}</text>
          <view class="sign-icon">
            <text v-if="item.signed">✓</text>
            <text v-else>{{ item.points }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="task-section">
      <view class="section-header">
        <text class="section-title">每日任务</text>
      </view>
      <view class="task-list">
        <view class="task-item" v-for="item in taskList" :key="item.id">
          <view class="task-icon">{{ item.icon }}</view>
          <view class="task-info">
            <text class="task-name">{{ item.name }}</text>
            <text class="task-reward">+{{ item.points }}积分</text>
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
        <text class="section-title">积分好礼</text>
        <text class="section-more">更多 ></text>
      </view>
      <scroll-view scroll-x class="goods-scroll">
        <view class="goods-item" v-for="item in goodsList" :key="item.id" @click="exchangeGoods(item)">
          <image :src="item.image" mode="aspectFill" class="goods-image" @error="onImgError(item)" />
          <text class="goods-name">{{ item.name }}</text>
          <text class="goods-points">{{ item.points }}积分</text>
        </view>
      </scroll-view>
    </view>
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

const todaySigned = ref(false)
const continuousDays = ref(7)

const weekList = ref<any[]>([])
const taskList = ref<any[]>([])
const goodsList = ref<any[]>([])

const initWeekList = () => {
  const days = ['一', '二', '三', '四', '五', '六', '日']
  const points = [5, 5, 10, 10, 15, 20, 30]
  weekList.value = days.map((day, index) => ({
    day: index,
    dayText: '周' + day,
    points: points[index],
    signed: index < 6,
    isToday: index === 6
  }))
}

const initTaskList = () => {
  taskList.value = [
    { id: 1, name: '浏览商品', icon: '👀', points: 5, done: true },
    { id: 2, name: '分享商品', icon: '📤', points: 10, done: false },
    { id: 3, name: '完善资料', icon: '📝', points: 20, done: false },
    { id: 4, name: '邀请好友', icon: '👥', points: 50, done: false }
  ]
}

const initGoodsList = () => {
  goodsList.value = [
    { id: 1, name: '5元优惠券', points: 200, image: 'https://picsum.photos/id/22/200/200' },
    { id: 2, name: '10元优惠券', points: 500, image: 'https://picsum.photos/id/24/200/200' },
    { id: 3, name: '定制帆布袋', points: 800, image: 'https://picsum.photos/id/21/200/200' },
    { id: 4, name: '定制马克杯', points: 1000, image: 'https://picsum.photos/id/30/200/200' }
  ]
}

const handleSignin = () => {
  if (todaySigned.value) return
  uni.showModal({
    title: '签到成功',
    content: '恭喜获得 30 积分！',
    showCancel: false,
    success: () => {
      todaySigned.value = true
      const todayItem = weekList.value.find(item => item.isToday)
      if (todayItem) {
        todayItem.signed = true
      }
      continuousDays.value++
    }
  })
}

const doTask = (item: any) => {
  if (item.done) return
  uni.showToast({ title: '去完成' + item.name, icon: 'none' })
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

const goHome = () => {
  uni.switchTab({ url: '/pages/home/index' })
}

const onImgError = (item: any) => {
  item.image = defaultImg
}

onMounted(() => {
  initWeekList()
  initTaskList()
  initGoodsList()
})
</script>

<style lang="scss" scoped>
.signin-page {
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

.signin-header {
  background: linear-gradient(135deg, #fdcb6e, #f39c12);
  padding: 30rpx 30rpx 40rpx;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .points-info {
      .points-label {
        display: block;
        font-size: 26rpx;
        color: rgba(255, 255, 255, 0.9);
      }

      .points-num {
        display: block;
        font-size: 48rpx;
        font-weight: bold;
        color: #fff;
        margin-top: 10rpx;
      }
    }

    .signin-btn {
      padding: 20rpx 50rpx;
      background-color: #fff;
      color: #e17055;
      font-size: 28rpx;
      font-weight: bold;
      border-radius: 40rpx;

      &.signed {
        background-color: rgba(255, 255, 255, 0.3);
        color: #fff;
      }
    }
  }
}

.signin-week {
  margin: -50rpx 20rpx 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  position: relative;
  z-index: 2;

  .week-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;

    .title-text {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
    }

    .sign-days {
      font-size: 24rpx;
      color: #ff6b00;
    }
  }

  .week-list {
    display: flex;
    justify-content: space-between;

    .week-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .day-text {
        font-size: 22rpx;
        color: #999;
        margin-bottom: 15rpx;
      }

      .sign-icon {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        background-color: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20rpx;
        color: #999;
      }

      &.signed {
        .day-text {
          color: #ff6b00;
        }

        .sign-icon {
          background-color: #ff6b00;
          color: #fff;
        }
      }

      &.today {
        .day-text {
          color: #ff6b00;
          font-weight: bold;
        }
      }
    }
  }
}

.task-section {
  margin: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;

  .section-header {
    margin-bottom: 20rpx;

    .section-title {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
    }
  }

  .task-list {
    .task-item {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .task-icon {
        font-size: 40rpx;
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

        .task-reward {
          font-size: 22rpx;
          color: #ff6b00;
          margin-top: 8rpx;
        }
      }

      .task-btn {
        padding: 12rpx 30rpx;
        background-color: #ff6b00;
        color: #fff;
        font-size: 24rpx;
        border-radius: 30rpx;

        &.done {
          background-color: #f0f0f0;
          color: #999;
        }
      }
    }
  }
}

.goods-section {
  margin: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx 0;

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
}

.goods-scroll {
  white-space: nowrap;
  padding: 0 30rpx;
}

.goods-item {
  display: inline-block;
  width: 200rpx;
  margin-right: 20rpx;
  vertical-align: top;

  &:last-child {
    margin-right: 0;
  }

  .goods-image {
    width: 200rpx;
    height: 200rpx;
    border-radius: 12rpx;
  }

  .goods-name {
    display: block;
    font-size: 24rpx;
    color: #333;
    margin-top: 10rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .goods-points {
    display: block;
    font-size: 24rpx;
    color: #ff6b00;
    font-weight: bold;
    margin-top: 6rpx;
  }
}
</style>
