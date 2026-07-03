<template>
  <view class="search-page">
    <view class="search-header">
      <view class="search-bar">
        <text class="search-icon">🔍</text>
        <input
          class="search-input"
          v-model="keyword"
          placeholder="搜索商品"
          focus
          confirm-type="search"
          @confirm="handleSearch"
        />
        <view class="clear-btn" v-if="keyword" @click="clearKeyword">
          <text>✕</text>
        </view>
      </view>
      <view class="cancel-btn" @click="goBack">取消</view>
    </view>

    <view class="search-content" v-if="!hasSearched">
      <view class="search-section" v-if="historyList.length > 0">
        <view class="section-header">
          <text class="section-title">搜索历史</text>
          <view class="clear-history" @click="clearHistory">
            <text>🗑️ 清空</text>
          </view>
        </view>
        <view class="tag-list">
          <view class="tag-item" v-for="(item, index) in historyList" :key="index" @click="searchByTag(item)">
            {{ item }}
          </view>
        </view>
      </view>

      <view class="search-section">
        <view class="section-header">
          <text class="section-title">热门搜索</text>
        </view>
        <view class="tag-list">
          <view class="tag-item hot" v-for="(item, index) in hotList" :key="index" @click="searchByTag(item)">
            {{ item }}
          </view>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="search-result" v-else @scrolltolower="loadMore">
      <view class="result-tabs">
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
      </view>

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

      <view class="empty-result" v-if="goodsList.length === 0 && !loading">
        <text class="empty-icon">🔍</text>
        <text class="empty-text">未找到相关商品</text>
        <text class="empty-desc">换个关键词试试吧</text>
      </view>

      <view class="loading-more" v-if="loading">
        <text>加载中...</text>
      </view>
      <view class="no-more" v-else-if="noMore && goodsList.length > 0">
        <text>没有更多了</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const defaultImg = 'https://picsum.photos/id/119/400/400'

const keyword = ref('')
const hasSearched = ref(false)
const historyList = ref<string[]>(['苹果', '手机', '耳机'])
const hotList = ['智能手机', '蓝牙耳机', '有机水果', '智能手表', '运动鞋', '护肤精华']
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

const handleSearch = () => {
  if (!keyword.value.trim()) return
  addToHistory(keyword.value.trim())
  hasSearched.value = true
  page.value = 1
  goodsList.value = []
  noMore.value = false
  loadGoods()
}

const searchByTag = (tag: string) => {
  keyword.value = tag
  handleSearch()
}

const addToHistory = (kw: string) => {
  const index = historyList.value.indexOf(kw)
  if (index > -1) {
    historyList.value.splice(index, 1)
  }
  historyList.value.unshift(kw)
  if (historyList.value.length > 10) {
    historyList.value.pop()
  }
}

const clearKeyword = () => {
  keyword.value = ''
  hasSearched.value = false
  goodsList.value = []
}

const clearHistory = () => {
  uni.showModal({
    title: '提示',
    content: '确定清空搜索历史吗？',
    success: (res) => {
      if (res.confirm) {
        historyList.value = []
      }
    }
  })
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

const goGoodsDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/goods/detail?id=${id}` })
}

const goBack = () => {
  uni.navigateBack()
}

const onImgError = (item: any) => {
  item.image = defaultImg
}

onLoad((options) => {
  if (options?.keyword) {
    keyword.value = options.keyword
    handleSearch()
  }
})
</script>

<style lang="scss" scoped>
.search-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.search-header {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;

  .search-bar {
    flex: 1;
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

    .search-input {
      flex: 1;
      font-size: 28rpx;
      color: #333;
    }

    .clear-btn {
      font-size: 28rpx;
      color: #999;
      padding: 10rpx;
    }
  }

  .cancel-btn {
    margin-left: 20rpx;
    font-size: 28rpx;
    color: #666;
  }
}

.search-content {
  flex: 1;
  padding: 20rpx 30rpx;
}

.search-section {
  margin-bottom: 40rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .section-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
    }

    .clear-history {
      font-size: 24rpx;
      color: #999;
    }
  }
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;

  .tag-item {
    padding: 15rpx 30rpx;
    background-color: #fff;
    border-radius: 30rpx;
    font-size: 26rpx;
    color: #666;

    &.hot {
      color: #ff6b00;
      background-color: #fff5f0;
    }
  }
}

.search-result {
  flex: 1;
}

.result-tabs {
  display: flex;
  background-color: #fff;
  padding: 0 20rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 25rpx 0;
    font-size: 28rpx;
    color: #666;
    position: relative;

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

.goods-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 20rpx;
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

.empty-result {
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
    font-size: 32rpx;
    color: #333;
    margin-bottom: 15rpx;
  }

  .empty-desc {
    font-size: 26rpx;
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
