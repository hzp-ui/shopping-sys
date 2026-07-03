<template>
  <view class="refund-page">
    <scroll-view scroll-y class="refund-scroll">
      <view class="refund-type">
        <text class="section-title">售后类型</text>
        <view class="type-list">
          <view
            class="type-item"
            :class="{ active: refundType === item.value }"
            v-for="item in typeList"
            :key="item.value"
            @click="refundType = item.value"
          >
            <text class="type-name">{{ item.label }}</text>
            <text class="type-desc">{{ item.desc }}</text>
          </view>
        </view>
      </view>

      <view class="goods-section">
        <text class="section-title">商品信息</text>
        <view class="goods-item" v-for="item in goodsList" :key="item.id">
          <image :src="item.image" mode="aspectFill" class="goods-image" @error="onImgError(item)" />
          <view class="goods-info">
            <text class="goods-name">{{ item.name }}</text>
            <text class="goods-spec">{{ item.spec }}</text>
            <view class="goods-bottom">
              <text class="goods-price">¥{{ item.price }}</text>
              <text class="goods-quantity">x{{ item.quantity }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="reason-section">
        <text class="section-title">申请原因</text>
        <view class="reason-list">
          <view
            class="reason-item"
            :class="{ active: refundReason === item }"
            v-for="item in reasonList"
            :key="item"
            @click="refundReason = item"
          >
            {{ item }}
          </view>
        </view>
      </view>

      <view class="amount-section">
        <text class="section-title">退款金额</text>
        <view class="amount-row">
          <text class="amount-label">退款金额</text>
          <text class="amount-value">¥{{ refundAmount }}</text>
        </view>
        <text class="amount-tip">最多可退 ¥{{ refundAmount }}</text>
      </view>

      <view class="desc-section">
        <text class="section-title">问题描述</text>
        <textarea
          v-model="refundDesc"
          class="textarea"
          placeholder="请详细描述您遇到的问题，以便我们更好地为您处理~"
          maxlength="500"
          :auto-height="true"
        />
        <text class="word-count">{{ refundDesc.length }}/500</text>
      </view>
    </scroll-view>

    <view class="bottom-bar">
      <view class="submit-btn" @click="submitRefund">提交申请</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const defaultImg = 'https://picsum.photos/id/119/200/200'

const orderId = ref<number>(0)
const refundType = ref('return')
const refundReason = ref('质量问题')
const refundAmount = ref('87.63')
const refundDesc = ref('')

const typeList = [
  { value: 'return', label: '退货退款', desc: '需将商品寄回' },
  { value: 'exchange', label: '换货', desc: '更换同款商品' },
  { value: 'only_refund', label: '仅退款', desc: '无需寄回商品' }
]

const reasonList = [
  '质量问题',
  '发错货/漏发货',
  '商品与描述不符',
  '不想要了',
  '其他原因'
]

const goodsList = ref<any[]>([])

const submitRefund = () => {
  if (!refundReason.value) {
    uni.showToast({ title: '请选择申请原因', icon: 'none' })
    return
  }
  uni.showModal({
    title: '提示',
    content: '确定提交售后申请吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '申请提交成功', icon: 'success' })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
    }
  })
}

const onImgError = (item: any) => {
  item.image = defaultImg
}

onLoad((options) => {
  if (options?.orderId) {
    orderId.value = Number(options.orderId)
  }
})

onMounted(() => {
  goodsList.value = [
    {
      id: 1,
      name: '云亩优选新鲜红富士苹果 5斤装',
      spec: '5斤装',
      price: '29.90',
      quantity: 1,
      image: 'https://picsum.photos/id/1080/160/160'
    },
    {
      id: 2,
      name: '云亩优选有机蔬菜套餐',
      spec: '套餐A',
      price: '39.90',
      quantity: 1,
      image: 'https://picsum.photos/id/292/160/160'
    }
  ]
})
</script>

<style lang="scss" scoped>
.refund-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.refund-scroll {
  flex: 1;
  padding: 20rpx;
}

.section-title {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.refund-type {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .type-list {
    display: flex;
    gap: 20rpx;

    .type-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 25rpx 10rpx;
      border: 2rpx solid #eee;
      border-radius: 12rpx;

      &.active {
        border-color: #ff6b00;
        background-color: #fff5f0;
      }

      .type-name {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
      }

      .type-desc {
        font-size: 22rpx;
        color: #999;
        margin-top: 8rpx;
      }
    }
  }
}

.goods-section {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .goods-item {
    display: flex;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .goods-image {
      width: 140rpx;
      height: 140rpx;
      border-radius: 8rpx;
      margin-right: 20rpx;
      flex-shrink: 0;
    }

    .goods-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

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

      .goods-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .goods-price {
          font-size: 28rpx;
          color: #ff6b00;
          font-weight: bold;
        }

        .goods-quantity {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }
}

.reason-section {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .reason-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;

    .reason-item {
      padding: 15rpx 30rpx;
      border: 2rpx solid #eee;
      border-radius: 30rpx;
      font-size: 26rpx;
      color: #666;

      &.active {
        border-color: #ff6b00;
        color: #ff6b00;
        background-color: #fff5f0;
      }
    }
  }
}

.amount-section {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .amount-row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .amount-label {
      font-size: 28rpx;
      color: #333;
    }

    .amount-value {
      font-size: 36rpx;
      color: #ff6b00;
      font-weight: bold;
    }
  }

  .amount-tip {
    display: block;
    font-size: 22rpx;
    color: #999;
    margin-top: 10rpx;
    text-align: right;
  }
}

.desc-section {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  position: relative;

  .textarea {
    width: 100%;
    min-height: 200rpx;
    padding: 20rpx;
    background-color: #f9f9f9;
    border-radius: 8rpx;
    font-size: 26rpx;
    color: #333;
    box-sizing: border-box;
  }

  .word-count {
    position: absolute;
    right: 50rpx;
    bottom: 45rpx;
    font-size: 22rpx;
    color: #999;
  }
}

.bottom-bar {
  padding: 20rpx 30rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background-color: #fff;
  border-top: 1rpx solid #f0f0f0;

  .submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 88rpx;
    background-color: #ff6b00;
    color: #fff;
    font-size: 30rpx;
    border-radius: 44rpx;
  }
}
</style>
