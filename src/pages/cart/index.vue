<template>
  <view class="cart-container">
    <view class="cart-header">
      <text class="header-title">购物车</text>
      <text class="edit-btn" @click="toggleEdit">{{ isEdit ? '完成' : '编辑' }}</text>
    </view>

    <view class="cart-content" v-if="cartList.length > 0">
      <scroll-view scroll-y class="cart-scroll">
        <view class="scroll-content">
          <view
            class="cart-item"
            v-for="item in cartList"
            :key="item.id"
          >
          <view class="checkbox" @click="toggleSelect(item.id)">
            <text :class="['icon', item.selected ? 'selected' : '']">
              {{ item.selected ? '✓' : '' }}
            </text>
          </view>

          <image :src="item.image" mode="aspectFill" class="goods-image" @click="goGoodsDetail(item.id)" @error="onItemImgError(item)" />

          <view class="goods-info">
            <text class="goods-name">{{ item.name }}</text>
            <text class="goods-spec">{{ item.spec }}</text>
            <view class="price-row">
              <text class="goods-price">¥{{ item.price }}</text>
              <view class="quantity-control">
                <view class="btn" @click="decreaseQuantity(item.id)">-</view>
                <text class="quantity">{{ item.quantity }}</text>
                <view class="btn" @click="increaseQuantity(item.id)">+</view>
              </view>
            </view>
          </view>
        </view>
        </view>
      </scroll-view>

      <view class="cart-footer">
        <view class="select-all" @click="toggleSelectAll">
          <text :class="['icon', isAllSelected ? 'selected' : '']">
            {{ isAllSelected ? '✓' : '' }}
          </text>
          <text class="select-text">全选</text>
        </view>

        <view class="footer-right">
          <view class="total-price" v-if="!isEdit">
            <text class="total-label">合计：</text>
            <text class="total-amount">¥{{ totalPrice }}</text>
          </view>
          <view class="footer-btn" v-if="!isEdit" @click="goCheckout">
            去结算({{ selectedCount }})
          </view>
          <view class="footer-btn delete-btn" v-else @click="deleteSelected">
            删除
          </view>
        </view>
      </view>
    </view>

    <view class="empty-cart" v-else>
      <view class="empty-icon-wrap">
        <text class="empty-icon">🛒</text>
      </view>
      <text class="empty-text">购物车空空如也</text>
      <view class="go-shopping" @click="goHome">去逛逛</view>
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

const isEdit = ref(false)

const isAllSelected = computed(() => {
  if (cartList.value.length === 0) return false
  return cartList.value.every(item => item.selected)
})

const selectedCount = computed(() => {
  return cartList.value.filter(item => item.selected).reduce((sum, item) => sum + item.quantity, 0)
})

const totalPrice = computed(() => {
  return cartList.value
    .filter(item => item.selected)
    .reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
    .toFixed(2)
})

const toggleEdit = () => {
  isEdit.value = !isEdit.value
}

const toggleSelect = (id: number) => {
  cartStore.toggleSelect(id)
}

const toggleSelectAll = () => {
  cartStore.toggleSelectAll()
}

const increaseQuantity = (id: number) => {
  cartStore.updateQuantity(id, 1)
}

const decreaseQuantity = (id: number) => {
  const item = cartList.value.find(i => i.id === id)
  if (item && item.quantity > 1) {
    cartStore.updateQuantity(id, -1)
  }
}

const deleteSelected = () => {
  uni.showModal({
    title: '提示',
    content: '确定删除选中的商品吗？',
    success: (res) => {
      if (res.confirm) {
        cartStore.deleteSelected()
      }
    }
  })
}

const goGoodsDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/goods/detail?id=${id}` })
}

const goCheckout = () => {
  if (selectedCount.value === 0) {
    uni.showToast({ title: '请选择商品', icon: 'none' })
    return
  }
  uni.navigateTo({ url: '/pages/order/confirm' })
}

const goHome = () => {
  uni.switchTab({ url: '/pages/home/index' })
}

const onItemImgError = (item: any) => {
  item.image = defaultImg
}
</script>

<style lang="scss" scoped>
.cart-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  background-color: #fff;

  .header-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }

  .edit-btn {
    font-size: 28rpx;
    color: #ff6b00;
  }
}

.cart-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cart-scroll {
  flex: 1;
}

.scroll-content {
  padding: 20rpx;

  .cart-item {
    display: flex;
    align-items: center;
    padding: 20rpx;
    background-color: #fff;
    border-radius: 12rpx;
    margin-bottom: 20rpx;

    .checkbox {
      width: 40rpx;
      height: 40rpx;
      margin-right: 20rpx;

      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40rpx;
        height: 40rpx;
        border: 2rpx solid #ddd;
        border-radius: 50%;
        font-size: 24rpx;
        color: #fff;

        &.selected {
          background-color: #ff6b00;
          border-color: #ff6b00;
        }
      }
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

      .goods-name {
        font-size: 28rpx;
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
        margin-top: 10rpx;
      }

      .price-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10rpx;

        .goods-price {
          font-size: 30rpx;
          color: #ff6b00;
          font-weight: bold;
        }

        .quantity-control {
          display: flex;
          align-items: center;

          .btn {
            width: 50rpx;
            height: 50rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f5f5f5;
            border-radius: 6rpx;
            font-size: 30rpx;
            color: #666;
          }

          .quantity {
            width: 60rpx;
            text-align: center;
            font-size: 28rpx;
            color: #333;
          }
        }
      }
    }
  }
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

  .select-all {
    display: flex;
    align-items: center;

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40rpx;
      height: 40rpx;
      border: 2rpx solid #ddd;
      border-radius: 50%;
      font-size: 24rpx;
      color: #fff;
      margin-right: 10rpx;

      &.selected {
        background-color: #ff6b00;
        border-color: #ff6b00;
      }
    }

    .select-text {
      font-size: 28rpx;
      color: #666;
    }
  }

  .footer-right {
    display: flex;
    align-items: center;

    .total-price {
      margin-right: 30rpx;

      .total-label {
        font-size: 26rpx;
        color: #666;
      }

      .total-amount {
        font-size: 36rpx;
        color: #ff6b00;
        font-weight: bold;
      }
    }

    .footer-btn {
      padding: 20rpx 40rpx;
      background: linear-gradient(135deg, #ff6b00, #ff8c00);
      color: #fff;
      font-size: 28rpx;
      border-radius: 40rpx;

      &.delete-btn {
        background: #ff4757;
      }
    }
  }
}

.empty-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 200rpx;

  .empty-icon-wrap {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 30rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.5;

    .empty-icon {
      font-size: 120rpx;
    }
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 30rpx;
  }

  .go-shopping {
    padding: 20rpx 60rpx;
    background: linear-gradient(135deg, #ff6b00, #ff8c00);
    color: #fff;
    font-size: 28rpx;
    border-radius: 40rpx;
  }
}
</style>
