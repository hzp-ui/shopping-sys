<template>
  <view class="empty-data">
    <text class="empty-icon">{{ icon }}</text>
    <text class="empty-text">{{ text }}</text>
    <view class="empty-btn" v-if="showBtn" @click="handleClick">{{ btnText }}</view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  icon?: string
  text?: string
  showBtn?: boolean
  btnText?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: '📭',
  text: '暂无数据',
  showBtn: false,
  btnText: '去看看'
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>

<style lang="scss" scoped>
.empty-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;

  .empty-icon {
    font-size: 100rpx;
    margin-bottom: 20rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 30rpx;
  }

  .empty-btn {
    padding: 16rpx 50rpx;
    border: 2rpx solid #ff6b00;
    color: #ff6b00;
    font-size: 26rpx;
    border-radius: 30rpx;
  }
}
</style>
