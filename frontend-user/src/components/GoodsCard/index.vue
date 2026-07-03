<template>
  <view class="goods-card" @click="handleClick">
    <image :src="goods.image" mode="aspectFill" class="goods-image" />
    <view class="goods-info">
      <text class="goods-name">{{ goods.name }}</text>
      <view class="goods-bottom">
        <text class="goods-price">¥{{ goods.price }}</text>
        <text class="goods-sales" v-if="goods.sales !== undefined">已售{{ goods.sales }}件</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface GoodsItem {
  id: number
  name: string
  price: string | number
  image: string
  sales?: number
}

interface Props {
  goods: GoodsItem
}

const props = defineProps<Props>()

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click', props.goods)
}
</script>

<style lang="scss" scoped>
.goods-card {
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;

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
      -webkit-line-clamp: 2;
      overflow: hidden;
      line-height: 1.4;
      height: 72rpx;
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
        font-size: 22rpx;
        color: #999;
      }
    }
  }
}
</style>
