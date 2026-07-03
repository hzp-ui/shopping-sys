<template>
  <view class="service-page">
    <view class="service-header">
      <text class="title">客服中心</text>
      <text class="subtitle">有问题，随时找我们</text>
    </view>

    <view class="service-list">
      <view class="service-item" @click="goOnlineService">
        <view class="service-icon">💬</view>
        <view class="service-info">
          <text class="service-name">在线客服</text>
          <text class="service-desc">7×24小时在线服务</text>
        </view>
        <text class="arrow">></text>
      </view>

      <view class="service-item" @click="callService">
        <view class="service-icon">📞</view>
        <view class="service-info">
          <text class="service-name">电话客服</text>
          <text class="service-desc">400-888-8888</text>
        </view>
        <text class="arrow">></text>
      </view>

      <view class="service-item" @click="goFeedback">
        <view class="service-icon">📝</view>
        <view class="service-info">
          <text class="service-name">意见反馈</text>
          <text class="service-desc">您的建议对我们很重要</text>
        </view>
        <text class="arrow">></text>
      </view>
    </view>

    <view class="faq-section">
      <view class="faq-title">
        <text class="title-text">常见问题</text>
      </view>
      <view class="faq-item" v-for="(item, index) in faqList" :key="index" @click="toggleFaq(index)">
        <view class="faq-question">
          <text class="question-text">{{ item.question }}</text>
          <text class="toggle-icon">{{ item.expanded ? '−' : '+' }}</text>
        </view>
        <view class="faq-answer" v-if="item.expanded">
          <text>{{ item.answer }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const faqList = ref([
  {
    question: '如何申请退款？',
    answer: '您可以在"我的订单"中找到对应订单，点击"申请售后"按钮，填写退款原因后提交，我们会在1-3个工作日内处理。',
    expanded: false
  },
  {
    question: '商品多久能发货？',
    answer: '一般情况下，当天16:00前下单的商品当天发货，16:00后下单的商品次日发货。如遇促销活动或特殊情况，可能会有延迟。',
    expanded: false
  },
  {
    question: '如何修改收货地址？',
    answer: '您可以在"我的-收货地址"中添加或修改收货地址。订单发货前，您可以联系客服修改收货地址。',
    expanded: false
  },
  {
    question: '积分如何获取和使用？',
    answer: '购物消费可获得积分（1元=1积分），评价晒单也可获得额外积分。积分可在积分商城兑换优惠券或实物礼品。',
    expanded: false
  }
])

const toggleFaq = (index: number) => {
  faqList.value[index].expanded = !faqList.value[index].expanded
}

const goOnlineService = () => {
  uni.showToast({ title: '正在连接客服...', icon: 'none' })
}

const callService = () => {
  uni.makePhoneCall({
    phoneNumber: '4008888888',
    fail: () => {
      uni.showToast({ title: '拨号失败', icon: 'none' })
    }
  })
}

const goFeedback = () => {
  uni.showToast({ title: '意见反馈', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.service-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.service-header {
  background: linear-gradient(135deg, #ff6b00, #ff8c00);
  padding: 60rpx 30rpx;
  text-align: center;

  .title {
    display: block;
    font-size: 36rpx;
    font-weight: bold;
    color: #fff;
  }

  .subtitle {
    display: block;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 10rpx;
  }
}

.service-list {
  margin: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;

  .service-item {
    display: flex;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .service-icon {
      font-size: 48rpx;
      margin-right: 25rpx;
    }

    .service-info {
      flex: 1;
      display: flex;
      flex-direction: column;

      .service-name {
        font-size: 30rpx;
        color: #333;
        font-weight: 500;
      }

      .service-desc {
        font-size: 24rpx;
        color: #999;
        margin-top: 8rpx;
      }
    }

    .arrow {
      font-size: 28rpx;
      color: #ccc;
    }
  }
}

.faq-section {
  margin: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;

  .faq-title {
    padding: 25rpx 30rpx;
    border-bottom: 1rpx solid #f5f5f5;

    .title-text {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
    }
  }

  .faq-item {
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .faq-question {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 25rpx 30rpx;

      .question-text {
        font-size: 28rpx;
        color: #333;
      }

      .toggle-icon {
        font-size: 36rpx;
        color: #999;
      }
    }

    .faq-answer {
      padding: 0 30rpx 25rpx;
      font-size: 26rpx;
      color: #666;
      line-height: 1.6;
    }
  }
}
</style>
