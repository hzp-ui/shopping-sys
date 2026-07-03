<template>
  <view class="profile-page">
    <view class="avatar-section">
      <image :src="userInfo.avatar" mode="aspectFill" class="avatar" @error="onAvatarError" />
      <view class="change-avatar" @click="changeAvatar">更换头像</view>
    </view>

    <view class="form-section">
      <view class="form-item">
        <text class="item-label">昵称</text>
        <input
          type="text"
          class="item-input"
          placeholder="请输入昵称"
          v-model="form.nickname"
        />
      </view>

      <view class="form-item">
        <text class="item-label">手机号</text>
        <view class="item-value">{{ userInfo.phone }}</view>
      </view>

      <view class="form-item">
        <text class="item-label">性别</text>
        <view class="gender-group">
          <view
            class="gender-item"
            :class="{ active: form.gender === 1 }"
            @click="form.gender = 1"
          >
            男
          </view>
          <view
            class="gender-item"
            :class="{ active: form.gender === 2 }"
            @click="form.gender = 2"
          >
            女
          </view>
        </view>
      </view>

      <view class="form-item">
        <text class="item-label">生日</text>
        <picker mode="date" @change="onDateChange">
          <view class="item-value">{{ form.birthday || '请选择生日' }}</view>
        </picker>
      </view>

      <view class="form-item">
        <text class="item-label">个人简介</text>
        <textarea
          class="item-textarea"
          placeholder="介绍一下自己吧..."
          v-model="form.bio"
          maxlength="100"
        />
      </view>
    </view>

    <view class="save-btn" @click="saveProfile">保存</view>

    <view class="logout-btn" @click="logout">退出登录</view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const defaultAvatar = 'https://picsum.photos/id/1005/200/200'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const form = reactive({
  nickname: userInfo.value.nickname,
  gender: 0,
  birthday: '',
  bio: ''
})

const changeAvatar = () => {
  uni.showToast({ title: '更换头像', icon: 'none' })
}

const onDateChange = (e: any) => {
  form.birthday = e.detail.value
}

const saveProfile = () => {
  if (!form.nickname) {
    uni.showToast({ title: '请输入昵称', icon: 'none' })
    return
  }
  uni.showLoading({ title: '保存中...' })
  setTimeout(() => {
    uni.hideLoading()
    userStore.updateUserInfo({
      nickname: form.nickname,
      gender: form.gender,
      birthday: form.birthday,
      bio: form.bio
    })
    uni.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }, 1000)
}

const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        uni.showToast({ title: '已退出登录', icon: 'success' })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
    }
  })
}

const onAvatarError = () => {
  if (userStore.userInfo) {
    userStore.userInfo.avatar = defaultAvatar
  }
}
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0;
  background-color: #fff;
  margin-bottom: 20rpx;

  .avatar {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    margin-bottom: 20rpx;
  }

  .change-avatar {
    font-size: 26rpx;
    color: #ff6b00;
  }
}

.form-section {
  background-color: #fff;
  padding: 0 30rpx;

  .form-item {
    display: flex;
    align-items: flex-start;
    padding: 30rpx 0;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .item-label {
      width: 160rpx;
      font-size: 28rpx;
      color: #666;
      flex-shrink: 0;
      padding-top: 6rpx;
    }

    .item-input {
      flex: 1;
      font-size: 28rpx;
      color: #333;
    }

    .item-value {
      flex: 1;
      font-size: 28rpx;
      color: #333;
    }

    .item-textarea {
      flex: 1;
      height: 150rpx;
      font-size: 28rpx;
      color: #333;
      line-height: 1.5;
    }

    .gender-group {
      display: flex;

      .gender-item {
        padding: 12rpx 40rpx;
        margin-right: 20rpx;
        border: 2rpx solid #ddd;
        border-radius: 30rpx;
        font-size: 26rpx;
        color: #666;

        &.active {
          border-color: #ff6b00;
          color: #ff6b00;
          background-color: #fff3e6;
        }
      }
    }
  }
}

.save-btn {
  margin: 60rpx 30rpx 30rpx;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  background: linear-gradient(135deg, #ff6b00, #ff8c00);
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  border-radius: 45rpx;
}

.logout-btn {
  margin: 0 30rpx;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  background-color: #fff;
  color: #ff4757;
  font-size: 30rpx;
  border-radius: 45rpx;
}
</style>
