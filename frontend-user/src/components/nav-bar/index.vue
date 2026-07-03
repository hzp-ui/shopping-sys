<template>
  <view class="navbar-container" :style="{ paddingTop: statusBarHeight + 'px' }">
    <view class="navbar-content" :style="{ height: navBarHeight + 'px' }">
      <view class="navbar-left" @click="handleBack">
        <view class="back-capsule">
          <text class="back-icon">←</text>
          <text class="back-text">首页</text>
        </view>
      </view>

      <view class="navbar-search" v-if="showSearch" @click="handleSearchClick">
        <text class="search-icon">🔍</text>
        <input
          v-if="searchInput"
          class="search-input"
          :value="keyword"
          :placeholder="placeholder"
          confirm-type="search"
          @confirm="handleSearchConfirm"
          @input="handleInput"
        />
        <text v-else class="search-placeholder">{{ placeholder }}</text>
      </view>

      <view class="navbar-title" v-else>
        <text class="title-text">{{ title }}</text>
      </view>

      <view class="navbar-right">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showSearch: {
    type: Boolean,
    default: false
  },
  searchInput: {
    type: Boolean,
    default: false
  },
  keyword: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '搜索商品'
  },
  backToHome: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['search', 'back', 'searchClick', 'input'])

const statusBarHeight = ref(20)
const navBarHeight = ref(44)

const sysInfo = uni.getSystemInfoSync()
statusBarHeight.value = sysInfo.statusBarHeight || 20

const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
if (menuButtonInfo) {
  navBarHeight.value = (menuButtonInfo.top - statusBarHeight.value) * 2 + menuButtonInfo.height
}

const handleBack = () => {
  if (props.backToHome) {
    uni.switchTab({ url: '/pages/home/index' })
  } else {
    uni.navigateBack()
  }
  emit('back')
}

const handleSearchClick = () => {
  if (!props.searchInput) {
    emit('searchClick')
  }
}

const handleSearchConfirm = (e: any) => {
  emit('search', e.detail.value)
}

const handleInput = (e: any) => {
  emit('input', e.detail.value)
}
</script>

<style lang="scss" scoped>
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

  .search-input {
    flex: 1;
    font-size: 26rpx;
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
</style>
