<template>
  <view class="category-container">
    <view class="category-content">
      <scroll-view scroll-y class="left-nav">
        <view
          class="nav-item"
          :class="{ active: currentCategory === item.id }"
          v-for="item in categoryList"
          :key="item.id"
          @click="switchCategory(item.id)"
        >
          {{ item.name }}
        </view>
      </scroll-view>

      <scroll-view scroll-y class="right-content">
        <view class="banner-section">
          <image :src="bannerImg" mode="aspectFill" class="banner-image" @error="onBannerError()" />
        </view>

        <view class="sub-category-section" v-for="group in subCategoryGroups" :key="group.title">
          <view class="section-title">{{ group.title }}</view>
          <view class="sub-category-list">
            <view
              class="sub-item"
              v-for="item in group.list"
              :key="item.id"
              @click="goGoodsList(item.id)"
            >
              <image :src="item.icon" mode="aspectFit" class="sub-icon" @error="onSubIconError(item)" />
              <text class="sub-name">{{ item.name }}</text>
            </view>
          </view>
        </view>

        <view class="goods-section" v-if="goodsList.length > 0">
          <view class="section-title">热门商品</view>
          <view class="goods-list">
            <view class="goods-item" v-for="item in goodsList" :key="item.id" @click="goGoodsDetail(item.id)">
              <image :src="item.image" mode="aspectFill" class="goods-image" @error="onGoodsImgError(item)" />
              <text class="goods-name">{{ item.name }}</text>
              <text class="goods-price">¥{{ item.price }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { getCategoryTreeApi, getGoodsListApi } from '@/api'
import type { CategoryItem, GoodsItem } from '@/api'

const defaultImg = 'https://picsum.photos/id/119/200/200'
const bannerImg = ref('https://picsum.photos/id/1068/600/200')

const categoryList = ref<CategoryItem[]>([])
const currentCategory = ref<number>(0)
const subCategoryGroups = ref<{ title: string; list: CategoryItem[] }[]>([])
const goodsList = ref<any[]>([])

const loadCategories = async () => {
  try {
    const res: any = await getCategoryTreeApi()
    if (res.code === 200) {
      categoryList.value = res.data || []
      if (categoryList.value.length > 0) {
        currentCategory.value = categoryList.value[0].id
        loadSubCategories(categoryList.value[0])
      }
    }
  } catch (e) {
    console.error('加载分类失败', e)
    categoryList.value = [
      { id: 1, parentId: 0, name: '手机数码', icon: '', sort: 1, children: [] },
      { id: 2, parentId: 0, name: '家用电器', icon: '', sort: 2, children: [] },
      { id: 3, parentId: 0, name: '服装鞋包', icon: '', sort: 3, children: [] },
      { id: 4, parentId: 0, name: '美妆个护', icon: '', sort: 4, children: [] },
      { id: 5, parentId: 0, name: '食品生鲜', icon: '', sort: 5, children: [] }
    ]
    currentCategory.value = 1
    subCategoryGroups.value = [{
      title: '热门分类',
      list: [
        { id: 101, parentId: 1, name: '智能手机', icon: 'https://picsum.photos/id/1/100/100', sort: 1 },
        { id: 102, parentId: 1, name: '耳机音响', icon: 'https://picsum.photos/id/4/100/100', sort: 2 },
        { id: 103, parentId: 1, name: '智能手表', icon: 'https://picsum.photos/id/7/100/100', sort: 3 }
      ]
    }]
  }
}

const loadSubCategories = (category: CategoryItem) => {
  const children = category.children || []
  if (children.length > 0) {
    subCategoryGroups.value = [{
      title: category.name,
      list: children.map((child, index) => ({
        ...child,
        icon: child.icon || `https://picsum.photos/id/${(index + 1) * 10}/100/100`
      }))
    }]
  } else {
    subCategoryGroups.value = [{
      title: '热门分类',
      list: [
        { id: category.id * 100 + 1, parentId: category.id, name: '热门推荐', icon: 'https://picsum.photos/id/11/100/100', sort: 1 },
        { id: category.id * 100 + 2, parentId: category.id, name: '新品上市', icon: 'https://picsum.photos/id/12/100/100', sort: 2 },
        { id: category.id * 100 + 3, parentId: category.id, name: '精选好物', icon: 'https://picsum.photos/id/13/100/100', sort: 3 },
        { id: category.id * 100 + 4, parentId: category.id, name: '特价专区', icon: 'https://picsum.photos/id/14/100/100', sort: 4 },
        { id: category.id * 100 + 5, parentId: category.id, name: '限时秒杀', icon: 'https://picsum.photos/id/15/100/100', sort: 5 },
        { id: category.id * 100 + 6, parentId: category.id, name: '会员专享', icon: 'https://picsum.photos/id/16/100/100', sort: 6 }
      ]
    }]
  }
  loadGoodsByCategory(category.id)
}

const loadGoodsByCategory = async (categoryId: number) => {
  try {
    const res: any = await getGoodsListApi({ categoryId, page: 1, pageSize: 6 })
    if (res.code === 200) {
      goodsList.value = (res.data.list || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.mainImage
      }))
    }
  } catch (e) {
    console.error('加载分类商品失败', e)
  }
}

const switchCategory = (id: number) => {
  currentCategory.value = id
  const category = categoryList.value.find(c => c.id === id)
  if (category) {
    loadSubCategories(category)
  }
}

const goGoodsList = (id: number) => {
  uni.navigateTo({ url: `/pages/goods/list?categoryId=${id}` })
}

const goGoodsDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/goods/detail?id=${id}` })
}

const onSubIconError = (item: any) => {
  item.icon = defaultImg
}

const onGoodsImgError = (item: any) => {
  item.image = defaultImg
}

const onBannerError = () => {
  bannerImg.value = defaultImg
}

onMounted(() => {
  loadCategories()
})
</script>

<style lang="scss" scoped>
.category-container {
  height: 100vh;
  background-color: #f5f5f5;
}

.category-content {
  display: flex;
  height: 100%;
}

.left-nav {
  width: 200rpx;
  height: 100%;
  background-color: #f8f8f8;

  .nav-item {
    padding: 30rpx 20rpx;
    text-align: center;
    font-size: 26rpx;
    color: #666;
    border-left: 6rpx solid transparent;

    &.active {
      background-color: #fff;
      color: #ff6b00;
      border-left-color: #ff6b00;
      font-weight: bold;
    }
  }
}

.right-content {
  flex: 1;
  height: 100%;
  padding: 20rpx;

  .banner-section {
    margin-bottom: 20rpx;

    .banner-image {
      width: 100%;
      height: 200rpx;
      border-radius: 12rpx;
    }
  }

  .sub-category-section {
    background-color: #fff;
    border-radius: 12rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;

    .section-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
    }

    .sub-category-list {
      display: flex;
      flex-wrap: wrap;

      .sub-item {
        width: 33.33%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 20rpx;

        .sub-icon {
          width: 100rpx;
          height: 100rpx;
          margin-bottom: 10rpx;
          border-radius: 12rpx;
        }

        .sub-name {
          font-size: 24rpx;
          color: #666;
        }
      }
    }
  }

  .goods-section {
    background-color: #fff;
    border-radius: 12rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;

    .section-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
    }

    .goods-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .goods-item {
        width: 48%;
        margin-bottom: 20rpx;
        background-color: #f9f9f9;
        border-radius: 12rpx;
        overflow: hidden;

        .goods-image {
          width: 100%;
          height: 200rpx;
        }

        .goods-name {
          display: block;
          padding: 10rpx;
          font-size: 24rpx;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .goods-price {
          display: block;
          padding: 0 10rpx 10rpx;
          font-size: 28rpx;
          color: #ff6b00;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
