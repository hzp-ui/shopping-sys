import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 用户信息类型
interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar?: string
  role?: string
}

// 用户 Store 类型
interface UserStore {
  token: string
  userInfo: UserInfo | null
  setToken: (token: string) => void
  setUserInfo: (userInfo: UserInfo | null) => void
  logout: () => void
}

// 用户状态管理
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      token: '',
      userInfo: null,
      setToken: (token) => set({ token }),
      setUserInfo: (userInfo) => set({ userInfo }),
      logout: () => set({ token: '', userInfo: null }),
    }),
    {
      name: 'user-storage',
    },
  ),
)
