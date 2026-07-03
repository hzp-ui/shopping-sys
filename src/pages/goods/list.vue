<template>
  <view class="goods-list-page">
    <view class="search-bar">
      <view class="search-box" @click="goSearch">
        <text class="search-icon">🔍</text>
        <text class="search-placeholder">{{ keyword || '搜索商品' }}</text>
      </view>
    </view>

    <view class="filter-tabs">
      <view
        class="tab-item"
        :class="{ active: sortType === 'default' }"
        @click="changeSort('default')"
      >
        综合
      </view>
      <view
        class="tab-item"
        :class="{ active: sortType === 'sales' }"
        @click="changeSort('sales')"
      >
        销量
      </view>
      <view
        class="tab-item"
        :class="{ active: sortType === 'price' }"
        @click="changeSort('price')"
      >
        价格
        <text class="sort-icon">{{ priceAsc ? '↑' : '↓' }}</text>
      </view>
      <view
        class="tab-item"
        :class="{ active: sortType === 'new' }"
        @click="changeSort('new')"
      >
        新品
      </view>
    </view>

    <scroll-view scroll-y class="goods-scroll" @scrolltolower="loadMore">
      <view class="scroll-content">
        <view class="goods-grid">
        <view class="goods-item" v-for="item in goodsList" :key="item.id" @click="goGoodsDetail(item.id)">
          <image :src="item.image" mode="aspectFill" class="goods-image" @error="onImgError(item)" />
          <view class="goods-info">
            <text class="goods-name">{{ item.name }}</text>
            <view class="goods-bottom">
              <text class="goods-price">¥{{ item.price }}</text>
              <text class="goods-sales">{{ item.sales }}人付款</text>
            </view>
          </view>
        </view>
      </view>

      <view class="empty-list" v-if="goodsList.length === 0 && !loading">
        <text class="empty-icon">📦</text>
        <text class="empty-text">暂无相关商品</text>
      </view>

      <view class="loading-more" v-if="loading">
        <text>加载中...</text>
      </view>
      <view class="no-more" v-else-if="noMore && goodsList.length > 0">
        <text>没有更多了</text>
      </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const defaultImg = 'https://picsum.photos/id/119/400/400'

const keyword = ref('')
const categoryId = ref<number>(0)
const sortType = ref('default')
const priceAsc = ref(false)
const goodsList = ref<any[]>([])
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = 10

const mockGoods = [
  { id: 1, name: '云亩智能手机 Pro Max', price: '5999.00', sales: 500, image: 'https://picsum.photos/id/1/400/400' },
  { id: 2, name: '云亩无线蓝牙耳机', price: '299.00', sales: 2000, image: 'https://picsum.photos/id/4/400/400' },
  { id: 3, name: '云亩智能手表 Ultra', price: '1999.00', sales: 800, image: 'https://picsum.photos/id/7/400/400' },
  { id: 4, name: '云亩4K超清电视 65寸', price: '3999.00', sales: 200, image: 'https://picsum.photos/id/10/400/400' },
  { id: 6, name: '云亩时尚运动鞋', price: '399.00', sales: 1500, image: 'https://picsum.photos/id/21/400/400' },
  { id: 8, name: '云亩有机苹果 5斤', price: '29.90', sales: 3000, image: 'https://picsum.photos/id/1080/400/400' }
]

const loadGoods = () => {
  loading.value = true
  setTimeout(() => {
    if (page.value === 1) {
      goodsList.value = [...mockGoods]
    }
    loading.value = false
    noMore.value = true
  }, 500)
}

const loadMore = () => {
  if (loading.value || noMore.value) return
  page.value++
  loadGoods()
}

const changeSort = (type: string) => {
  if (sortType.value === type && type === 'price') {
    priceAsc.value = !priceAsc.value
  } else {
    sortType.value = type
    if (type === 'price') {
      priceAsc.value = true
    }
  }
  page.value = 1
  goodsList.value = []
  noMore.value = false
  loadGoods()
}

const goSearch = () => {
  uni.navigateTo({ url: '/pages/search/index' })
}

const goGoodsDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/goods/detail?id=${id}` })
}

const onImgError = (item: any) => {
  item.image = defaultImg
}

onLoad((options) => {
  if (options?.keyword) {
    keyword.value = options.keyword
  }
  if (options?.categoryId) {
    categoryId.value = Number(options.categoryId)
  }
})

onMounted(() => {
  loadGoods()
})
</script>

<style lang="scss" scoped>
.goods-list-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.search-bar {
  padding: 20rpx 30rpx;
  background-color: #fff;

  .search-box {
    display: flex;
    align-items: center;
    height: 72rpx;
    background-color: #f5f5f5;
    border-radius: 36rpx;
    padding: 0 25rpx;

    .search-icon {
      font-size: 28rpx;
      margin-right: 15rpx;
    }

    .search-placeholder {
      font-size: 26rpx;
      color: #999;
    }
  }
}

.filter-tabs {
  display: flex;
  background-color: #fff;
  border-top: 1rpx solid #f0f0f0;

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 25rpx 0;
    font-size: 28rpx;
    color: #666;

    &.active {
      color: #ff6b00;
      font-weight: bold;
    }

    .sort-icon {
      font-size: 24rpx;
      margin-left: 5rpx;
    }
  }
}

.goods-scroll {
  flex: 1;
}

.scroll-content {
  padding: 20rpx;
}

.goods-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.goods-item {
  width: 48%;
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
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
      margin-top: 15rpx;

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

.empty-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 150rpx 0;

  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 30rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}

.loading-more,
.no-more {
  text-align: center;
  padding: 30rpx;
  font-size: 24rpx;
  color: #999;
}
</style>
