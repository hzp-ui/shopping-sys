<template>
  <view class="goods-detail">
    <scroll-view scroll-y class="detail-scroll">
      <swiper class="goods-swiper" indicator-dots autoplay circular>
        <swiper-item v-for="(item, index) in goodsImages" :key="index">
          <image :src="item" mode="aspectFill" class="swiper-image" @error="onSwiperImgError(index)" />
        </swiper-item>
      </swiper>

      <view class="goods-info">
        <view class="price-row">
          <text class="goods-price">¥{{ goodsInfo.price }}</text>
          <text class="original-price">¥{{ goodsInfo.originalPrice }}</text>
          <text class="sales">已售{{ goodsInfo.sales }}件</text>
        </view>
        <text class="goods-name">{{ goodsInfo.name }}</text>
        <text class="goods-desc">{{ goodsInfo.description }}</text>
      </view>

      <view class="goods-spec" @click="showSpecPopup = true">
        <text class="spec-label">规格</text>
        <text class="spec-value">{{ selectedSpec || '请选择规格' }}</text>
        <text class="arrow">></text>
      </view>

      <view class="goods-detail-section">
        <view class="section-title">商品详情</view>
        <view class="detail-content">
          <image
            v-for="(img, index) in detailImages"
            :key="index"
            :src="img"
            mode="widthFix"
            class="detail-image"
            @error="onDetailImgError(index)"
          />
        </view>
      </view>
    </scroll-view>

    <view class="bottom-bar">
      <view class="bar-item" @click="goHome">
        <text class="bar-icon">🏠</text>
        <text class="bar-text">首页</text>
      </view>
      <view class="bar-item" @click="goCart">
        <text class="bar-icon">🛒</text>
        <text class="bar-text">购物车</text>
        <view class="cart-badge" v-if="cartCount > 0">{{ cartCount }}</view>
      </view>
      <view class="bar-btn add-cart" @click="addToCart">加入购物车</view>
      <view class="bar-btn buy-now" @click="buyNow">立即购买</view>
    </view>

    <view class="spec-popup" v-if="showSpecPopup" @click="showSpecPopup = false">
      <view class="popup-content" @click.stop>
        <view class="popup-header">
          <image :src="goodsImages[0]" mode="aspectFill" class="popup-image" @error="onPopupImgError" />
          <view class="popup-info">
            <text class="popup-price">¥{{ goodsInfo.price }}</text>
            <text class="popup-stock">库存：{{ goodsInfo.stock }}件</text>
          </view>
          <text class="close-btn" @click="showSpecPopup = false">✕</text>
        </view>

        <view class="spec-list">
          <view class="spec-group">
            <text class="spec-title">规格选择</text>
            <view class="spec-options">
              <view
                class="spec-option"
                :class="{ active: selectedSpec === spec }"
                v-for="spec in specList"
                :key="spec"
                @click="selectedSpec = spec"
              >
                {{ spec }}
              </view>
            </view>
          </view>

          <view class="spec-group">
            <text class="spec-title">购买数量</text>
            <view class="quantity-control">
              <view class="qty-btn" @click="decreaseQty">-</view>
              <text class="qty-num">{{ quantity }}</text>
              <view class="qty-btn" @click="increaseQty">+</view>
            </view>
          </view>
        </view>

        <view class="popup-footer">
          <view class="confirm-btn" @click="confirmSpec">确定</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'
import { getGoodsDetailApi } from '@/api'
import type { GoodsItem } from '@/api'

const cartStore = useCartStore()
const { cartCount } = storeToRefs(cartStore)

const defaultImg = 'https://picsum.photos/id/119/200/200'

const goodsId = ref(0)
const showSpecPopup = ref(false)
const selectedSpec = ref('')
const quantity = ref(1)
const loading = ref(true)

const goodsInfo = ref<Partial<GoodsItem>>({
  id: 0,
  name: '加载中...',
  price: 0,
  originalPrice: 0,
  sales: 0,
  stock: 0,
  description: ''
})

const goodsImages = ref<string[]>([defaultImg])
const detailImages = ref<string[]>([])
const specList = ref<string[]>(['默认规格'])

const loadGoodsDetail = async () => {
  try {
    loading.value = true
    const res: any = await getGoodsDetailApi(goodsId.value)
    if (res.code === 200) {
      const data = res.data
      goodsInfo.value = {
        id: data.id,
        name: data.name,
        price: data.price,
        originalPrice: data.originalPrice,
        sales: data.sales,
        stock: data.stock,
        description: data.subtitle || data.detail || ''
      }
      if (data.images && data.images.length > 0) {
        goodsImages.value = data.images
      } else if (data.mainImage) {
        goodsImages.value = [data.mainImage]
      }
      detailImages.value = data.images && data.images.length > 0 ? data.images : goodsImages.value
      if (data.skuList && data.skuList.length > 0) {
        specList.value = data.skuList.map((sku: any) => sku.specs || sku.name || '默认规格')
      }
    }
  } catch (e) {
    console.error('加载商品详情失败', e)
    goodsInfo.value = {
      id: goodsId.value,
      name: '云亩优选商品',
      price: 29.9,
      originalPrice: 59.9,
      sales: 100,
      stock: 1000,
      description: '精选优质商品，品质保障。'
    }
    goodsImages.value = [`https://picsum.photos/id/${goodsId.value % 100}/750/750`]
    detailImages.value = goodsImages.value
  } finally {
    loading.value = false
  }
}

const increaseQty = () => {
  if ((goodsInfo.value.stock || 0) > 0 && quantity.value < (goodsInfo.value.stock || 0)) {
    quantity.value++
  }
}

const decreaseQty = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const confirmSpec = () => {
  if (!selectedSpec.value) {
    uni.showToast({ title: '请选择规格', icon: 'none' })
    return
  }
  showSpecPopup.value = false
}

const addToCart = () => {
  if (!selectedSpec.value) {
    showSpecPopup.value = true
    return
  }
  cartStore.addToCart({
    id: goodsId.value,
    name: goodsInfo.value.name || '',
    price: goodsInfo.value.price || 0,
    image: goodsImages.value[0],
    spec: selectedSpec.value,
    quantity: quantity.value,
    selected: true
  })
  uni.showToast({ title: '已加入购物车', icon: 'success' })
}

const buyNow = () => {
  if (!selectedSpec.value) {
    showSpecPopup.value = true
    return
  }
  uni.navigateTo({ url: '/pages/order/confirm' })
}

const goHome = () => {
  uni.switchTab({ url: '/pages/home/index' })
}

const goCart = () => {
  uni.switchTab({ url: '/pages/cart/index' })
}

const onSwiperImgError = (index: number) => {
  if (goodsImages.value[index]) {
    goodsImages.value[index] = defaultImg
  }
}

const onDetailImgError = (index: number) => {
  if (detailImages.value[index]) {
    detailImages.value[index] = defaultImg
  }
}

const onPopupImgError = () => {
  if (goodsImages.value[0]) {
    goodsImages.value[0] = defaultImg
  }
}

onLoad((options) => {
  if (options?.id) {
    goodsId.value = Number(options.id)
    loadGoodsDetail()
  }
})
</script>

<style lang="scss" scoped>
.goods-detail {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.detail-scroll {
  flex: 1;
  overflow: hidden;
}

.goods-swiper {
  width: 100%;
  height: 750rpx;

  .swiper-image {
    width: 100%;
    height: 100%;
  }
}

.goods-info {
  padding: 30rpx;
  background-color: #fff;

  .price-row {
    display: flex;
    align-items: baseline;
    margin-bottom: 20rpx;

    .goods-price {
      font-size: 48rpx;
      font-weight: bold;
      color: #ff6b00;
    }

    .original-price {
      margin-left: 20rpx;
      font-size: 26rpx;
      color: #999;
      text-decoration: line-through;
    }

    .sales {
      margin-left: auto;
      font-size: 24rpx;
      color: #999;
    }
  }

  .goods-name {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    line-height: 1.4;
    margin-bottom: 10rpx;
  }

  .goods-desc {
    font-size: 26rpx;
    color: #666;
    line-height: 1.5;
  }
}

.goods-spec {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background-color: #fff;
  margin-top: 20rpx;

  .spec-label {
    font-size: 28rpx;
    color: #666;
    margin-right: 20rpx;
  }

  .spec-value {
    flex: 1;
    font-size: 28rpx;
    color: #333;
  }

  .arrow {
    font-size: 28rpx;
    color: #ccc;
  }
}

.goods-detail-section {
  margin-top: 20rpx;
  background-color: #fff;
  padding-bottom: 200rpx;

  .section-title {
    padding: 30rpx;
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    border-bottom: 1rpx solid #f5f5f5;
  }

  .detail-content {
    .detail-image {
      width: 100%;
      display: block;
    }
  }
}

.bottom-bar {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

  .bar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100rpx;
    position: relative;

    .bar-icon {
      font-size: 36rpx;
    }

    .bar-text {
      font-size: 22rpx;
      color: #666;
      margin-top: 4rpx;
    }

    .cart-badge {
      position: absolute;
      top: -10rpx;
      right: 10rpx;
      min-width: 32rpx;
      height: 32rpx;
      padding: 0 8rpx;
      background-color: #ff6b00;
      color: #fff;
      font-size: 20rpx;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .bar-btn {
    flex: 1;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    font-size: 28rpx;
    color: #fff;
    border-radius: 40rpx;
    margin-left: 20rpx;

    &.add-cart {
      background: linear-gradient(135deg, #ffa502, #ff6b00);
    }

    &.buy-now {
      background: linear-gradient(135deg, #ff4757, #ff6b81);
    }
  }
}

.spec-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;

  .popup-content {
    width: 100%;
    background-color: #fff;
    border-radius: 24rpx 24rpx 0 0;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
  }

  .popup-header {
    display: flex;
    padding: 30rpx;
    border-bottom: 1rpx solid #f5f5f5;
    position: relative;

    .popup-image {
      width: 180rpx;
      height: 180rpx;
      border-radius: 12rpx;
      margin-right: 20rpx;
    }

    .popup-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .popup-price {
        font-size: 36rpx;
        font-weight: bold;
        color: #ff6b00;
      }

      .popup-stock {
        font-size: 24rpx;
        color: #999;
        margin-top: 10rpx;
      }
    }

    .close-btn {
      position: absolute;
      top: 20rpx;
      right: 20rpx;
      font-size: 36rpx;
      color: #999;
      padding: 10rpx;
    }
  }

  .spec-list {
    flex: 1;
    padding: 30rpx;
    overflow-y: auto;

    .spec-group {
      margin-bottom: 30rpx;

      .spec-title {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 20rpx;
      }

      .spec-options {
        display: flex;
        flex-wrap: wrap;

        .spec-option {
          padding: 16rpx 30rpx;
          margin-right: 20rpx;
          margin-bottom: 20rpx;
          background-color: #f5f5f5;
          border-radius: 8rpx;
          font-size: 26rpx;
          color: #666;

          &.active {
            background-color: #fff3e6;
            color: #ff6b00;
            border: 2rpx solid #ff6b00;
          }
        }
      }

      .quantity-control {
        display: flex;
        align-items: center;

        .qty-btn {
          width: 60rpx;
          height: 60rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f5f5f5;
          border-radius: 8rpx;
          font-size: 32rpx;
          color: #666;
        }

        .qty-num {
          width: 100rpx;
          text-align: center;
          font-size: 30rpx;
          color: #333;
        }
      }
    }
  }

  .popup-footer {
    padding: 20rpx 30rpx 40rpx;
    border-top: 1rpx solid #f5f5f5;

    .confirm-btn {
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      background: linear-gradient(135deg, #ff6b00, #ff8c00);
      color: #fff;
      font-size: 30rpx;
      border-radius: 40rpx;
    }
  }
}
</style>
