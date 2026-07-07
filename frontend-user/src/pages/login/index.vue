<template>
  <view class="login-page">
    <view class="logo-section">
      <view class="logo-icon">🛒</view>
      <text class="logo-title">云亩商城</text>
      <text class="logo-desc">优选好物，新鲜直达</text>
    </view>

    <view class="form-section">
      <view class="tab-group">
        <view
          class="tab-item"
          :class="{ active: isLogin }"
          @click="isLogin = true"
        >
          登录
        </view>
        <view
          class="tab-item"
          :class="{ active: !isLogin }"
          @click="isLogin = false"
        >
          注册
        </view>
      </view>

      <view class="form-item">
        <text class="item-label">手机号</text>
        <input
          type="number"
          class="item-input"
          placeholder="请输入手机号"
          v-model="form.phone"
          maxlength="11"
        />
      </view>

      <view class="form-item">
        <text class="item-label">{{ isLogin ? '密码' : '设置密码' }}</text>
        <input
          type="password"
          class="item-input"
          placeholder="请输入密码"
          v-model="form.password"
        />
      </view>

      <view class="form-item" v-if="!isLogin">
        <text class="item-label">确认密码</text>
        <input
          type="password"
          class="item-input"
          placeholder="请再次输入密码"
          v-model="form.confirmPassword"
        />
      </view>

      <view class="form-item code-item" v-if="!isLogin">
        <text class="item-label">验证码</text>
        <input
          type="number"
          class="item-input"
          placeholder="请输入验证码"
          v-model="form.code"
          maxlength="6"
        />
        <view class="code-btn" :class="{ disabled: countdown > 0 }" @click="sendCode">
          {{ countdown > 0 ? countdown + 's' : '获取验证码' }}
        </view>
      </view>

      <view class="agreement" v-if="!isLogin">
        <view class="checkbox" @click="agreed = !agreed">
          <text v-if="agreed" class="checked">✓</text>
        </view>
        <text class="agreement-text">
          我已阅读并同意
          <text class="link">《用户协议》</text>
          和
          <text class="link">《隐私政策》</text>
        </text>
      </view>

      <view class="submit-btn" @click="handleSubmit">
        {{ isLogin ? '登录' : '注册' }}
      </view>

      <view class="forgot-password" v-if="isLogin" @click="forgotPassword">
        忘记密码？
      </view>
    </view>

    <view class="other-login">
      <view class="divider">
        <text class="divider-text">其他登录方式</text>
      </view>
      <view class="login-methods">
        <view class="method-item">
          <text class="method-icon">💚</text>
          <text class="method-text">微信</text>
        </view>
        <view class="method-item">
          <text class="method-icon">📱</text>
          <text class="method-text">手机号一键登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { loginApi, registerApi, sendCodeApi, getUserInfoApi } from '@/api/user'

const userStore = useUserStore()

const isLogin = ref(true)
const countdown = ref(0)
const agreed = ref(false)

const form = ref({
  phone: '',
  password: '',
  confirmPassword: '',
  code: ''
})

const sendCode = async () => {
  if (countdown.value > 0) return
  if (!form.value.phone || form.value.phone.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  try {
    await sendCodeApi({ phone: form.value.phone, type: 'register' })
    uni.showToast({ title: '验证码已发送', icon: 'success' })
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (e) {
    console.error('发送验证码失败', e)
  }
}

const handleLogin = async () => {
  try {
    const res = await loginApi({
      phone: form.value.phone,
      password: form.value.password
    })
    const token = res.data.token
    userStore.setUserInfo({
      id: res.data.userId,
      phone: form.value.phone,
      nickname: '',
      avatar: '',
      token: token
    })
    try {
      const userInfoRes = await getUserInfoApi()
      if (userInfoRes.data) {
        userStore.setUserInfo({
          ...userInfoRes.data,
          token: token
        })
      }
    } catch (e) {
      console.error('获取用户信息失败', e)
    }
    uni.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (e) {
    console.error('登录失败', e)
  }
}

const handleRegister = async () => {
  try {
    const res = await registerApi({
      phone: form.value.phone,
      password: form.value.password,
      code: form.value.code
    })
    const token = res.data.token
    userStore.setUserInfo({
      id: res.data.userId,
      phone: form.value.phone,
      nickname: '',
      avatar: '',
      token: token
    })
    try {
      const userInfoRes = await getUserInfoApi()
      if (userInfoRes.data) {
        userStore.setUserInfo({
          ...userInfoRes.data,
          token: token
        })
      }
    } catch (e) {
      console.error('获取用户信息失败', e)
    }
    uni.showToast({ title: '注册成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (e) {
    console.error('注册失败', e)
  }
}

const handleSubmit = () => {
  if (!form.value.phone || form.value.phone.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  if (!form.value.password) {
    uni.showToast({ title: '请输入密码', icon: 'none' })
    return
  }
  if (form.value.password.length < 6 || form.value.password.length > 20) {
    uni.showToast({ title: '密码长度必须在6-20位之间', icon: 'none' })
    return
  }
  if (!isLogin.value) {
    if (form.value.password !== form.value.confirmPassword) {
      uni.showToast({ title: '两次密码输入不一致', icon: 'none' })
      return
    }
    if (!agreed.value) {
      uni.showToast({ title: '请同意用户协议和隐私政策', icon: 'none' })
      return
    }
    if (!form.value.code) {
      uni.showToast({ title: '请输入验证码', icon: 'none' })
      return
    }
  }

  uni.showLoading({ title: isLogin.value ? '登录中...' : '注册中...' })
  if (isLogin.value) {
    handleLogin().finally(() => {
      uni.hideLoading()
    })
  } else {
    handleRegister().finally(() => {
      uni.hideLoading()
    })
  }
}

const forgotPassword = () => {
  uni.showToast({ title: '忘记密码', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background-color: #fff;
  padding: 0 60rpx;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100rpx;
  padding-bottom: 80rpx;

  .logo-icon {
    font-size: 120rpx;
    margin-bottom: 20rpx;
  }

  .logo-title {
    font-size: 48rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 10rpx;
  }

  .logo-desc {
    font-size: 26rpx;
    color: #999;
  }
}

.form-section {
  .tab-group {
    display: flex;
    margin-bottom: 60rpx;

    .tab-item {
      flex: 1;
      text-align: center;
      font-size: 32rpx;
      color: #666;
      padding-bottom: 20rpx;
      position: relative;

      &.active {
        color: #ff6b00;
        font-weight: bold;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60rpx;
          height: 6rpx;
          background-color: #ff6b00;
          border-radius: 3rpx;
        }
      }
    }
  }

  .form-item {
    position: relative;
    margin-bottom: 40rpx;

    .item-label {
      display: block;
      font-size: 26rpx;
      color: #666;
      margin-bottom: 15rpx;
    }

    .item-input {
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      padding: 0 20rpx;
      font-size: 30rpx;
      color: #333;
      border-bottom: 2rpx solid #eee;
    }

    &.code-item {
      .code-btn {
        position: absolute;
        right: 0;
        bottom: 20rpx;
        padding: 12rpx 24rpx;
        font-size: 24rpx;
        color: #ff6b00;
        border: 2rpx solid #ff6b00;
        border-radius: 30rpx;

        &.disabled {
          color: #ccc;
          border-color: #ccc;
        }
      }
    }
  }

  .agreement {
    display: flex;
    align-items: flex-start;
    margin-bottom: 40rpx;

    .checkbox {
      width: 32rpx;
      height: 32rpx;
      border: 2rpx solid #ddd;
      border-radius: 6rpx;
      margin-right: 15rpx;
      margin-top: 4rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .checked {
        font-size: 24rpx;
        color: #ff6b00;
      }
    }

    .agreement-text {
      flex: 1;
      font-size: 24rpx;
      color: #999;
      line-height: 1.5;

      .link {
        color: #ff6b00;
      }
    }
  }

  .submit-btn {
    height: 90rpx;
    line-height: 90rpx;
    text-align: center;
    background: linear-gradient(135deg, #ff6b00, #ff8c00);
    color: #fff;
    font-size: 32rpx;
    font-weight: bold;
    border-radius: 45rpx;
    margin-bottom: 30rpx;
  }

  .forgot-password {
    text-align: right;
    font-size: 26rpx;
    color: #999;
  }
}

.other-login {
  margin-top: 100rpx;

  .divider {
    display: flex;
    align-items: center;
    margin-bottom: 50rpx;

    &::before,
    &::after {
      content: '';
      flex: 1;
      height: 1rpx;
      background-color: #eee;
    }

    .divider-text {
      padding: 0 30rpx;
      font-size: 24rpx;
      color: #999;
    }
  }

  .login-methods {
    display: flex;
    justify-content: center;

    .method-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 50rpx;

      .method-icon {
        font-size: 60rpx;
        margin-bottom: 10rpx;
      }

      .method-text {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}
</style>
