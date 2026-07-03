import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { setStorage, getStorage, removeStorage } from '@/utils/storage'

const USER_INFO_KEY = 'user_info'
const TOKEN_KEY = 'token'

export interface UserInfo {
  id: number
  phone: string
  nickname: string
  avatar: string
  token: string
  gender?: number
  birthday?: string
  bio?: string
}

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo>({
    id: 0,
    phone: '',
    nickname: '',
    avatar: '',
    token: '',
    gender: 0,
    birthday: '',
    bio: ''
  })

  const isLogin = computed(() => !!userInfo.value.token)

  const initUserInfo = () => {
    const savedUserInfo = getStorage<UserInfo>(USER_INFO_KEY)
    if (savedUserInfo) {
      userInfo.value = savedUserInfo
    }
  }

  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
    setStorage(USER_INFO_KEY, info)
    setStorage(TOKEN_KEY, info.token)
  }

  const updateUserInfo = (info: Partial<UserInfo>) => {
    userInfo.value = { ...userInfo.value, ...info }
    setStorage(USER_INFO_KEY, userInfo.value)
  }

  const logout = () => {
    userInfo.value = {
      id: 0,
      phone: '',
      nickname: '',
      avatar: '',
      token: '',
      gender: 0,
      birthday: '',
      bio: ''
    }
    removeStorage(USER_INFO_KEY)
    removeStorage(TOKEN_KEY)
  }

  return {
    userInfo,
    isLogin,
    initUserInfo,
    setUserInfo,
    updateUserInfo,
    logout
  }
})
