<template>
  <view class="order-confirm">
    <scroll-view scroll-y class="confirm-scroll">
      <view class="address-section" @click="selectAddress">
        <view class="address-icon">📍</view>
        <view class="address-info" v-if="addressInfo.name">
          <view class="address-top">
            <text class="name">{{ addressInfo.name }}</text>
            <text class="phone">{{ addressInfo.phone }}</text>
          </view>
          <text class="address-detail">{{ addressInfo.detail }}</text>
        </view>
        <view class="no-address" v-else>
          <text>请选择收货地址</text>
        </view>
        <text class="arrow">></text>
      </view>

      <view class="goods-section">
        <view class="store-name">云亩优选旗舰店</view>
        <view class="goods-item" v-for="item in goodsList" :key="item.id">
          <image :src="item.image" mode="aspectFill" class="goods-image" @error="onGoodsImgError(item)" />
          <view class="goods-info">
            <text class="goods-name">{{ item.name }}</text>
            <text class="goods-spec">{{ item.spec }}</text>
            <view class="price-row">
              <text class="goods-price">¥{{ item.price }}</text>
              <text class="goods-quantity">x{{ item.quantity }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="delivery-section">
        <view class="section-row">
          <text class="row-label">配送方式</text>
          <text class="row-value">快递配送</text>
        </view>
        <view class="section-row">
          <text class="row-label">运费</text>
          <text class="row-value">{{ freight > 0 ? '¥' + freight : '免运费' }}</text>
        </view>
      </view>

      <view class="remark-section">
        <text class="remark-label">订单备注</text>
        <input
          type="text"
          class="remark-input"
          placeholder="选填，请输入订单备注"
          v-model="remark"
        />
      </view>

      <view class="summary-section">
        <view class="summary-row">
          <text class="summary-label">商品金额</text>
          <text class="summary-value">¥{{ goodsTotal }}</text>
        </view>
        <view class="summary-row">
          <text class="summary-label">运费</text>
          <text class="summary-value">{{ freight > 0 ? '¥' + freight : '免运费' }}</text>
        </view>
        <view class="summary-row">
          <text class="summary-label">优惠</text>
          <text class="summary-value discount">-¥0.00</text>
        </view>
      </view>
    </scroll-view>

    <view class="bottom-bar">
      <view class="total-info">
        <text class="total-label">实付款：</text>
        <text class="total-price">¥{{ totalPrice }}</text>
      </view>
      <view class="submit-btn" @click="submitOrder">提交订单</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'

const defaultImg = 'https://picsum.photos/id/119/200/200'

const cartStore = useCartStore()
const { cartList } = storeToRefs(cartStore)

const addressInfo = ref({
  name: '张三',
  phone: '138****8888',
  detail: '北京市朝阳区某某街道某某小区1号楼101室'
})

const remark = ref('')
const freight = ref(0)

const goodsList = computed(() => {
  return cartList.value.filter(item => item.selected)
})

const goodsTotal = computed(() => {
  return goodsList.value
    .reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
    .toFixed(2)
})

const totalPrice = computed(() => {
  return (Number(goodsTotal.value) + freight.value).toFixed(2)
})

const selectAddress = () => {
  uni.showToast({ title: '选择收货地址', icon: 'none' })
}

const submitOrder = () => {
  if (!addressInfo.value.name) {
    uni.showToast({ title: '请选择收货地址', icon: 'none' })
    return
  }
  uni.showModal({
    title: '提示',
    content: '确认提交订单吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showLoading({ title: '提交中...' })
        setTimeout(() => {
          uni.hideLoading()
          uni.showToast({ title: '下单成功', icon: 'success' })
          setTimeout(() => {
            uni.redirectTo({ url: '/pages/order/list?status=1' })
          }, 1500)
        }, 1000)
      }
    }
  })
}

const onGoodsImgError = (item: any) => {
  item.image = defaultImg
}
</script>

<style lang="scss" scoped>
.order-confirm {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.confirm-scroll {
  flex: 1;
  overflow: hidden;
}

.address-section {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background-color: #fff;
  margin-bottom: 20rpx;

  .address-icon {
    font-size: 40rpx;
    margin-right: 20rpx;
  }

  .address-info {
    flex: 1;

    .address-top {
      display: flex;
      align-items: center;
      margin-bottom: 10rpx;

      .name {
        font-size: 30rpx;
        font-weight: bold;
        color: #333;
        margin-right: 20rpx;
      }

      .phone {
        font-size: 28rpx;
        color: #666;
      }
    }

    .address-detail {
      font-size: 26rpx;
      color: #666;
      line-height: 1.4;
    }
  }

  .no-address {
    flex: 1;
    font-size: 28rpx;
    color: #999;
  }

  .arrow {
    font-size: 28rpx;
    color: #ccc;
  }
}

.goods-section {
  background-color: #fff;
  padding: 0 30rpx;
  margin-bottom: 20rpx;

  .store-name {
    padding: 20rpx 0;
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    border-bottom: 1rpx solid #f5f5f5;
  }

  .goods-item {
    display: flex;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .goods-image {
      width: 160rpx;
      height: 160rpx;
      border-radius: 8rpx;
      margin-right: 20rpx;
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
        font-size: 24rpx;
        color: #999;
      }

      .price-row {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .goods-price {
          font-size: 28rpx;
          color: #ff6b00;
          font-weight: bold;
        }

        .goods-quantity {
          font-size: 26rpx;
          color: #999;
        }
      }
    }
  }
}

.delivery-section {
  background-color: #fff;
  padding: 0 30rpx;
  margin-bottom: 20rpx;

  .section-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25rpx 0;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .row-label {
      font-size: 28rpx;
      color: #666;
    }

    .row-value {
      font-size: 28rpx;
      color: #333;
    }
  }
}

.remark-section {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background-color: #fff;
  margin-bottom: 20rpx;

  .remark-label {
    font-size: 28rpx;
    color: #666;
    margin-right: 20rpx;
    flex-shrink: 0;
  }

  .remark-input {
    flex: 1;
    font-size: 28rpx;
    color: #333;
  }
}

.summary-section {
  background-color: #fff;
  padding: 20rpx 30rpx;
  margin-bottom: 200rpx;

  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15rpx 0;

    .summary-label {
      font-size: 26rpx;
      color: #666;
    }

    .summary-value {
      font-size: 26rpx;
      color: #333;

      &.discount {
        color: #ff6b00;
      }
    }
  }
}

.bottom-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

  .total-info {
    .total-label {
      font-size: 26rpx;
      color: #666;
    }

    .total-price {
      font-size: 40rpx;
      font-weight: bold;
      color: #ff6b00;
    }
  }

  .submit-btn {
    padding: 20rpx 60rpx;
    background: linear-gradient(135deg, #ff6b00, #ff8c00);
    color: #fff;
    font-size: 30rpx;
    border-radius: 40rpx;
  }
}
</style>
