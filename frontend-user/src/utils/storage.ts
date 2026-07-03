export const setStorage = (key: string, value: any) => {
  try {
    uni.setStorageSync(key, JSON.stringify(value))
  } catch (e) {
    console.error('setStorage error:', e)
  }
}

export const getStorage = <T = any>(key: string): T | null => {
  try {
    const value = uni.getStorageSync(key)
    return value ? JSON.parse(value) : null
  } catch (e) {
    console.error('getStorage error:', e)
    return null
  }
}

export const removeStorage = (key: string) => {
  try {
    uni.removeStorageSync(key)
  } catch (e) {
    console.error('removeStorage error:', e)
  }
}

export const clearStorage = () => {
  try {
    uni.clearStorageSync()
  } catch (e) {
    console.error('clearStorage error:', e)
  }
}
