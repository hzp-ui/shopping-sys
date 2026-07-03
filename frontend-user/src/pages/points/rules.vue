<template>
  <view class="rules-page">
    <view class="navbar-container" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="navbar-content" :style="{ height: navBarHeight + 'px' }">
        <view class="navbar-left" @click="goHome">
          <view class="back-capsule">
            <text class="back-icon">🏠</text>
            <text class="back-text">首页</text>
          </view>
        </view>
        <view class="navbar-title">
          <text class="title-text">积分规则</text>
        </view>
        <view class="navbar-right"></view>
      </view>
    </view>

    <view class="page-content">
      <view class="points-header">
        <view class="header-content">
          <text class="points-label">我的积分</text>
          <text class="points-num">{{ currentPoints }}</text>
          <text class="points-tip">积分可抵扣现金，好礼换不停</text>
        </view>
      </view>

      <view class="section">
        <view class="section-header">
          <text class="section-icon">🎁</text>
          <text class="section-title">积分获取方式</text>
        </view>
        <view class="rule-list">
          <view class="rule-item" v-for="(item, index) in earnList" :key="index">
            <view class="rule-index">{{ index + 1 }}</view>
            <view class="rule-content">
              <text class="rule-name">{{ item.name }}</text>
              <text class="rule-desc">{{ item.desc }}</text>
            </view>
            <view class="rule-points">+{{ item.points }}</view>
          </view>
        </view>
      </view>

      <view class="section">
        <view class="section-header">
          <text class="section-icon">🛍️</text>
          <text class="section-title">积分使用方式</text>
        </view>
        <view class="rule-list">
          <view class="rule-item" v-for="(item, index) in useList" :key="index">
            <view class="rule-index">{{ index + 1 }}</view>
            <view class="rule-content">
              <text class="rule-name">{{ item.name }}</text>
              <text class="rule-desc">{{ item.desc }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="section validity-section">
        <view class="section-header">
          <text class="section-icon">⏰</text>
          <text class="section-title">积分有效期</text>
        </view>
        <view class="validity-content">
          <text class="validity-text">积分有效期为 <text class="highlight">1年</text>，自获得之日起计算，到期自动清零。</text>
          <text class="validity-tip">温馨提示：请及时使用您的积分，避免过期失效哦~</text>
        </view>
      </view>

      <view class="section faq-section">
        <view class="section-header">
          <text class="section-icon">❓</text>
          <text class="section-title">常见问题</text>
        </view>
        <view class="faq-list">
          <view class="faq-item" v-for="(item, index) in faqList" :key="index" @click="toggleFaq(index)">
            <view class="faq-question">
              <text class="faq-q">Q：{{ item.question }}</text>
              <text class="faq-arrow" :class="{ open: item.open }">▼</text>
            </view>
            <view class="faq-answer" v-show="item.open">
              <text class="faq-a">A：{{ item.answer }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const statusBarHeight = ref(20)
const navBarHeight = ref(44)

const sysInfo = uni.getSystemInfoSync()
statusBarHeight.value = sysInfo.statusBarHeight || 20
const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
if (menuButtonInfo) {
  navBarHeight.value = (menuButtonInfo.top - statusBarHeight.value) * 2 + menuButtonInfo.height
}

const currentPoints = ref(2680)

const earnList = ref([
  {
    name: '消费送积分',
    desc: '每消费1元送1积分，消费越多积分越多',
    points: '1元=1积分'
  },
  {
    name: '签到送积分',
    desc: '每日签到得5积分，连续签到额外奖励',
    points: '5积分/天'
  },
  {
    name: '评价送积分',
    desc: '发表评价得10积分，带图评价额外+5积分',
    points: '10-15积分'
  },
  {
    name: '邀请好友',
    desc: '邀请好友注册得100积分，好友首单再得50积分',
    points: '100积分'
  },
  {
    name: '完善资料',
    desc: '完善个人资料得50积分，仅限首次',
    points: '50积分'
  },
  {
    name: '生日福利',
    desc: '生日当天消费享双倍积分',
    points: '双倍积分'
  }
])

const useList = ref([
  {
    name: '积分抵扣',
    desc: '100积分抵1元，最高抵扣订单金额10%'
  },
  {
    name: '积分兑换',
    desc: '积分商城兑换优惠券、礼品等精选好物'
  },
  {
    name: '积分抽奖',
    desc: '每日免费抽奖1次，消耗积分抽大奖'
  }
])

const faqList = ref([
  {
    question: '积分怎么获得？',
    answer: '您可以通过消费、签到、评价、邀请好友、完善资料等多种方式获得积分。消费1元送1积分，每日签到得5积分，发表评价得10积分。',
    open: false
  },
  {
    question: '积分有有效期吗？',
    answer: '积分有效期为1年，自获得之日起计算，到期自动清零。请您及时使用积分，避免过期失效。',
    open: false
  },
  {
    question: '积分可以提现吗？',
    answer: '积分不可提现，不可转让，仅限本人使用。您可以使用积分抵扣订单金额，或在积分商城兑换商品。',
    open: false
  },
  {
    question: '退货后积分怎么办？',
    answer: '订单发生退货退款时，该订单所获得的积分将被扣除。如积分已使用，将从剩余积分中扣除。',
    open: false
  },
  {
    question: '积分抵扣有上限吗？',
    answer: '单笔订单积分抵扣最高不超过订单金额的10%，具体以实际支付页面显示为准。',
    open: false
  }
])

const goHome = () => {
  uni.switchTab({ url: '/pages/home/index' })
}

const toggleFaq = (index: number) => {
  faqList.value[index].open = !faqList.value[index].open
}
</script>

<style lang="scss" scoped>
.rules-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.navbar-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: transparent;

  .back-capsule {
    background-color: rgba(255, 255, 255, 0.9);
  }

  .title-text {
    color: #fff;
  }
}

.navbar-content {
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  position: relative;
}

.navbar-left {
  flex-shrink: 0;
  margin-right: 20rpx;
}

.back-capsule {
  display: flex;
  align-items: center;
  padding: 8rpx 16rpx;
  border-radius: 30rpx;

  .back-icon {
    font-size: 24rpx;
    margin-right: 6rpx;
  }

  .back-text {
    font-size: 24rpx;
    color: #333;
  }
}

.navbar-title {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  .title-text {
    font-size: 32rpx;
    font-weight: bold;
  }
}

.navbar-right {
  flex-shrink: 0;
  margin-left: 20rpx;
  min-width: 80rpx;
}

.page-content {
  padding-top: 180rpx;
  padding-bottom: 40rpx;
}

.points-header {
  margin-top: -180rpx;
  background: linear-gradient(135deg, #ff9f43, #feca57);
  padding: 60rpx 30rpx 80rpx;

  .header-content {
    display: flex;
    flex-direction: column;
    align-items: center;

    .points-label {
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 16rpx;
    }

    .points-num {
      font-size: 72rpx;
      font-weight: bold;
      color: #fff;
      line-height: 1;
    }

    .points-tip {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.8);
      margin-top: 16rpx;
    }
  }
}

.section {
  margin: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;

  .section-header {
    display: flex;
    align-items: center;
    margin-bottom: 25rpx;

    .section-icon {
      font-size: 36rpx;
      margin-right: 12rpx;
    }

    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }
}

.rule-list {
  .rule-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    &:first-child {
      padding-top: 0;
    }

    .rule-index {
      width: 40rpx;
      height: 40rpx;
      background: linear-gradient(135deg, #ff9f43, #feca57);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22rpx;
      color: #fff;
      font-weight: bold;
      flex-shrink: 0;
      margin-right: 20rpx;
    }

    .rule-content {
      flex: 1;
      display: flex;
      flex-direction: column;

      .rule-name {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
        margin-bottom: 6rpx;
      }

      .rule-desc {
        font-size: 24rpx;
        color: #999;
      }
    }

    .rule-points {
      font-size: 26rpx;
      color: #ff6b00;
      font-weight: bold;
      flex-shrink: 0;
      margin-left: 20rpx;
    }
  }
}

.validity-section {
  .validity-content {
    .validity-text {
      display: block;
      font-size: 28rpx;
      color: #333;
      line-height: 1.6;

      .highlight {
        color: #ff6b00;
        font-weight: bold;
      }
    }

    .validity-tip {
      display: block;
      font-size: 24rpx;
      color: #999;
      margin-top: 12rpx;
    }
  }
}

.faq-section {
  .faq-list {
    .faq-item {
      border-bottom: 1rpx solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .faq-question {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 25rpx 0;

        .faq-q {
          font-size: 28rpx;
          color: #333;
          flex: 1;
        }

        .faq-arrow {
          font-size: 20rpx;
          color: #999;
          margin-left: 20rpx;
          transition: transform 0.3s;

          &.open {
            transform: rotate(180deg);
          }
        }
      }

      .faq-answer {
        padding-bottom: 25rpx;

        .faq-a {
          font-size: 26rpx;
          color: #666;
          line-height: 1.6;
        }
      }
    }
  }
}
</style>
