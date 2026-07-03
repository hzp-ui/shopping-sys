<template>
  <view class="home-container">
    <view class="search-bar">
      <view class="search-input" @click="goSearch">
        <text class="search-icon">🔍</text>
        <input type="text" placeholder="搜索商品" v-model="keyword" @confirm="handleSearch" />
      </view>
    </view>

    <scroll-view scroll-y class="content-scroll" @scrolltolower="loadMore">
      <view class="banner">
        <swiper class="banner-swiper" indicator-dots autoplay circular interval="3000">
          <swiper-item v-for="(item, index) in bannerList" :key="index">
            <image :src="item.image" mode="aspectFill" class="banner-image" @error="onBannerImgError(index)" />
          </swiper-item>
        </swiper>
      </view>

      <view class="notice-bar">
        <text class="notice-icon">📢</text>
        <scroll-view scroll-x class="notice-scroll" scroll-with-animation :scroll-left="noticeScrollLeft">
          <view class="notice-content">
            <text class="notice-text" v-for="(item, index) in noticeList" :key="index">{{ item }}</text>
          </view>
        </scroll-view>
        <text class="notice-more">更多</text>
      </view>

      <view class="category-nav">
        <view class="nav-item" v-for="(item, index) in featureNavList" :key="index" @click="goFeature(item.path)">
          <view class="nav-icon-wrap">
            <text class="nav-icon-text">{{ item.icon }}</text>
          </view>
          <text class="nav-text">{{ item.name }}</text>
        </view>
      </view>

      <view class="section-title">
        <text class="title-text">限时秒杀</text>
        <text class="more-text" @click="goFeature('/pages/feature/seckill')">更多 ></text>
      </view>

      <scroll-view
        scroll-x
        class="seckill-scroll"
        :scroll-left="scrollLeft"
        scroll-with-animation
        @scrolltoupper="onScrollToUpper"
      >
        <view class="seckill-item" v-for="(item, index) in displaySeckillList" :key="index" @click="goGoodsDetail(item.id)">
          <image :src="item.image" mode="aspectFill" class="seckill-image" @error="onSeckillImgError(index)" />
          <text class="seckill-price">¥{{ item.price }}</text>
          <text class="seckill-old-price">¥{{ item.originalPrice }}</text>
        </view>
      </scroll-view>

      <view class="section-title">
        <text class="title-text">猜你喜欢</text>
      </view>

      <view class="goods-list">
        <view class="goods-item" v-for="(item, index) in goodsList" :key="item.id" @click="goGoodsDetail(item.id)">
          <image :src="item.image" mode="aspectFill" class="goods-image" @error="onGoodsImgError(index)" />
          <view class="goods-info">
            <text class="goods-name">{{ item.name }}</text>
            <view class="goods-price-row">
              <text class="goods-price">¥{{ item.price }}</text>
              <text class="goods-sales">已售{{ item.sales }}件</text>
            </view>
          </view>
        </view>
      </view>

      <view class="loading-more" v-if="loading">
        <text>加载中...</text>
      </view>
      <view class="no-more" v-else-if="noMore">
        <text>没有更多了</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { onPullDownRefresh, onShow } from '@dcloudio/uni-app'
import { getBannerListApi, getNavListApi, getRecommendProductsApi, getSeckillProductsApi, getGoodsListApi } from '@/api'
import type { BannerItem, NavItem, GoodsItem } from '@/api'

const defaultImg = 'https://picsum.photos/id/119/200/200'

const keyword = ref('')
const bannerList = ref<BannerItem[]>([])
const categoryList = ref<any[]>([])
const seckillList = ref<GoodsItem[]>([])
const goodsList = ref<GoodsItem[]>([])
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = 10

const scrollLeft = ref(0)
const itemWidth = 220
let scrollTimer: any = null
let isScrolling = false
let currentIndex = 0

const displaySeckillList = computed(() => {
  if (seckillList.value.length === 0) return []
  return [...seckillList.value, ...seckillList.value]
})

const noticeList = [
  '🎉 新人专享：注册即送100元优惠券大礼包',
  '🔥 限时秒杀进行中，9.9元起包邮到家',
  '🎁 邀请好友立得20元现金红包，上不封顶',
  '⭐ 会员专享：全场95折，每月8号会员日折上折',
  '🚚 全场满49元包邮，生鲜冷链直达',
  '💎 积分当钱花，100积分抵1元'
]

const noticeScrollLeft = ref(0)
let noticeTimer: any = null
let noticeIndex = 0

const startNoticeScroll = () => {
  if (noticeTimer) return
  noticeTimer = setInterval(() => {
    noticeIndex++
    if (noticeIndex >= noticeList.length) {
      noticeIndex = 0
      noticeScrollLeft.value = 0
      return
    }
    noticeScrollLeft.value = noticeIndex * 500
  }, 3000)
}

const navIcons = ['🥬', '🍚', '🥩', '🥛', '🍷', '🍪', '🏠', '📦']

const featureNavList = [
  { id: 'new', name: '新品首发', icon: '🥬', path: '/pages/feature/new' },
  { id: 'seckill', name: '限时秒杀', icon: '🍚', path: '/pages/feature/seckill' },
  { id: 'group', name: '拼团优惠', icon: '🥩', path: '/pages/feature/group' },
  { id: 'distribution', name: '分销专区', icon: '🥛', path: '/pages/feature/distribution' },
  { id: 'coupon', name: '领券中心', icon: '🍷', path: '/pages/feature/coupon' },
  { id: 'signin', name: '签到送礼', icon: '🍪', path: '/pages/feature/signin' },
  { id: 'store', name: '附近门店', icon: '🏠', path: '/pages/feature/store' },
  { id: 'vip', name: '会员中心', icon: '📦', path: '/pages/feature/vip' }
]

const loadBanner = async () => {
  try {
    const res: any = await getBannerListApi()
    if (res.code === 200) {
      bannerList.value = res.data || []
    }
  } catch (e) {
    console.error('加载banner失败', e)
  }
}

const loadNav = async () => {
  try {
    const res: any = await getNavListApi()
    if (res.code === 200) {
      const navData = res.data || []
      categoryList.value = navData.map((item: NavItem, index: number) => ({
        id: item.id,
        name: item.name,
        iconText: navIcons[index % navIcons.length]
      }))
    }
  } catch (e) {
    console.error('加载导航失败', e)
    categoryList.value = [
      { id: 1, name: '生鲜果蔬', iconText: '🥬' },
      { id: 2, name: '粮油调味', iconText: '🍚' },
      { id: 3, name: '肉禽蛋品', iconText: '🥩' },
      { id: 4, name: '乳品烘焙', iconText: '🥛' },
      { id: 5, name: '酒水饮料', iconText: '🍷' },
      { id: 6, name: '休闲零食', iconText: '🍪' },
      { id: 7, name: '家居百货', iconText: '🏠' },
      { id: 8, name: '更多分类', iconText: '📦' }
    ]
  }
}

const loadSeckill = async () => {
  try {
    const res: any = await getSeckillProductsApi()
    if (res.code === 200) {
      seckillList.value = (res.data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.seckillPrice || item.price,
        originalPrice: item.originalPrice,
        image: item.mainImage
      }))
    }
  } catch (e) {
    console.error('加载秒杀失败', e)
  }
}

const startAutoScroll = () => {
  if (scrollTimer) return
  if (seckillList.value.length <= 1) return
  scrollTimer = setInterval(() => {
    if (isScrolling) return
    isScrolling = true
    currentIndex++
    scrollLeft.value = currentIndex * itemWidth

    setTimeout(() => {
      isScrolling = false
      if (currentIndex >= seckillList.value.length) {
        currentIndex = 0
        scrollLeft.value = 0
      }
    }, 600)
  }, 2500)
}

const stopAutoScroll = () => {
  if (scrollTimer) {
    clearInterval(scrollTimer)
    scrollTimer = null
  }
}

const onScrollToUpper = () => {
}

const loadGoods = async () => {
  loading.value = true
  try {
    const res: any = await getGoodsListApi({ page: page.value, pageSize: pageSize })
    if (res.code === 200) {
      const newGoods = (res.data.list || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        sales: item.sales,
        image: item.mainImage
      }))
      goodsList.value.push(...newGoods)
      if (newGoods.length < pageSize) {
        noMore.value = true
      }
    }
  } catch (e) {
    console.error('加载商品失败', e)
  } finally {
    loading.value = false
  }
}

const loadRecommend = async () => {
  try {
    const res: any = await getRecommendProductsApi()
    if (res.code === 200) {
      goodsList.value = (res.data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        sales: item.sales,
        image: item.mainImage
      }))
    }
  } catch (e) {
    console.error('加载推荐失败', e)
  }
}

const loadMore = () => {
  if (loading.value || noMore.value) return
  page.value++
  loadGoods()
}

const handleSearch = () => {
  uni.navigateTo({ url: `/pages/search/index?keyword=${keyword.value}` })
}

const goCategory = (id: number) => {
  uni.switchTab({ url: '/pages/category/index' })
}

const goFeature = (path: string) => {
  uni.navigateTo({ url: path })
}

const goGoodsDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/goods/detail?id=${id}` })
}

const onBannerImgError = (index: number) => {
  if (bannerList.value[index]) {
    bannerList.value[index].image = defaultImg
  }
}

const onSeckillImgError = (index: number) => {
  const realIndex = index % seckillList.value.length
  if (seckillList.value[realIndex]) {
    seckillList.value[realIndex].image = defaultImg
  }
}

const onGoodsImgError = (index: number) => {
  if (goodsList.value[index]) {
    goodsList.value[index].image = defaultImg
  }
}

const loadAll = async () => {
  await Promise.all([loadBanner(), loadNav(), loadSeckill()])
  await loadRecommend()
  startAutoScroll()
  startNoticeScroll()
}

onPullDownRefresh(async () => {
  page.value = 1
  goodsList.value = []
  noMore.value = false
  await loadAll()
  uni.stopPullDownRefresh()
})

onShow(() => {
  startAutoScroll()
  startNoticeScroll()
})

onMounted(() => {
  loadAll()
})

onUnmounted(() => {
  stopAutoScroll()
  if (noticeTimer) {
    clearInterval(noticeTimer)
    noticeTimer = null
  }
})
</script>

<style lang="scss" scoped>
.home-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.search-bar {
  padding: 20rpx 30rpx;
  background-color: #fff;

  .search-input {
    display: flex;
    align-items: center;
    height: 70rpx;
    padding: 0 20rpx;
    background-color: #f5f5f5;
    border-radius: 35rpx;

    .iconfont {
      margin-right: 10rpx;
      color: #999;
    }

    input {
      flex: 1;
      font-size: 28rpx;
    }
  }
}

.content-scroll {
  flex: 1;
  overflow: hidden;
}

.banner {
  padding: 20rpx 30rpx;

  .banner-swiper {
    height: 300rpx;
    border-radius: 16rpx;
    overflow: hidden;

    .banner-image {
      width: 100%;
      height: 100%;
    }
  }
}

.notice-bar {
  display: flex;
  align-items: center;
  background-color: #fff;
  margin: 0 30rpx 20rpx;
  padding: 20rpx 24rpx;
  border-radius: 12rpx;

  .notice-icon {
    font-size: 28rpx;
    margin-right: 12rpx;
    flex-shrink: 0;
  }

  .notice-scroll {
    flex: 1;
    height: 40rpx;
    white-space: nowrap;
    overflow: hidden;

    .notice-content {
      display: inline-block;
      white-space: nowrap;

      .notice-text {
        display: inline-block;
        font-size: 24rpx;
        color: #666;
        margin-right: 60rpx;
        line-height: 40rpx;
      }
    }
  }

  .notice-more {
    font-size: 22rpx;
    color: #999;
    margin-left: 12rpx;
    flex-shrink: 0;
  }
}

.category-nav {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx 0;
  background-color: #fff;
  margin: 0 30rpx 20rpx;
  border-radius: 16rpx;

  .nav-item {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 0;

    .nav-icon-wrap {
      width: 80rpx;
      height: 80rpx;
      margin-bottom: 10rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f9f9f9;
      border-radius: 50%;
    }

    .nav-icon-text {
      font-size: 40rpx;
    }

    .nav-text {
      font-size: 24rpx;
      color: #333;
    }
  }
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;

  .title-text {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }

  .more-text {
    font-size: 24rpx;
    color: #999;
  }
}

.seckill-scroll {
  white-space: nowrap;
  padding: 0 30rpx 20rpx;

  .seckill-item {
    display: inline-block;
    width: 200rpx;
    margin-right: 20rpx;
    background-color: #fff;
    border-radius: 12rpx;
    overflow: hidden;

    .seckill-image {
      width: 200rpx;
      height: 200rpx;
    }

    .seckill-price {
      display: block;
      padding: 10rpx 10rpx 0;
      font-size: 28rpx;
      color: #ff6b00;
      font-weight: bold;
    }

    .seckill-old-price {
      display: block;
      padding: 0 10rpx 10rpx;
      font-size: 22rpx;
      color: #999;
      text-decoration: line-through;
    }
  }
}

.goods-list {
  display: flex;
  flex-wrap: wrap;
  padding: 0 30rpx 30rpx;

  .goods-item {
    width: calc(50% - 10rpx);
    margin-bottom: 20rpx;
    background-color: #fff;
    border-radius: 12rpx;
    overflow: hidden;

    &:nth-child(even) {
      margin-left: 20rpx;
    }

    .goods-image {
      width: 100%;
      height: 340rpx;
    }

    .goods-info {
      padding: 20rpx;

      .goods-name {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        font-size: 26rpx;
        color: #333;
        line-height: 1.4;
        height: 72rpx;
      }

      .goods-price-row {
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
}

.loading-more,
.no-more {
  text-align: center;
  padding: 30rpx;
  font-size: 24rpx;
  color: #999;
}
</style>
