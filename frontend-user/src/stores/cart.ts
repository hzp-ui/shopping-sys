import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { setStorage, getStorage } from '@/utils/storage'

const CART_KEY = 'cart_list'

export interface CartItem {
  id: number
  name: string
  price: string
  image: string
  spec: string
  quantity: number
  selected: boolean
}

export const useCartStore = defineStore('cart', () => {
  const cartList = ref<CartItem[]>([])

  const cartCount = computed(() => {
    return cartList.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const selectedCount = computed(() => {
    return cartList.value.filter(item => item.selected).reduce((sum, item) => sum + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return cartList.value
      .filter(item => item.selected)
      .reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
      .toFixed(2)
  })

  const initCart = () => {
    const savedCart = getStorage<CartItem[]>(CART_KEY)
    if (savedCart && savedCart.length > 0) {
      cartList.value = savedCart
    }
  }

  const saveCart = () => {
    setStorage(CART_KEY, cartList.value)
  }

  const addToCart = (goods: CartItem) => {
    const existItem = cartList.value.find(
      item => item.id === goods.id && item.spec === goods.spec
    )
    if (existItem) {
      existItem.quantity += goods.quantity
    } else {
      cartList.value.push(goods)
    }
    saveCart()
  }

  const updateQuantity = (id: number, delta: number) => {
    const item = cartList.value.find(item => item.id === id)
    if (item) {
      item.quantity += delta
      if (item.quantity < 1) {
        item.quantity = 1
      }
      saveCart()
    }
  }

  const toggleSelect = (id: number) => {
    const item = cartList.value.find(item => item.id === id)
    if (item) {
      item.selected = !item.selected
      saveCart()
    }
  }

  const toggleSelectAll = () => {
    const allSelected = cartList.value.every(item => item.selected)
    cartList.value.forEach(item => {
      item.selected = !allSelected
    })
    saveCart()
  }

  const deleteSelected = () => {
    cartList.value = cartList.value.filter(item => !item.selected)
    saveCart()
  }

  const removeFromCart = (id: number) => {
    const index = cartList.value.findIndex(item => item.id === id)
    if (index > -1) {
      cartList.value.splice(index, 1)
      saveCart()
    }
  }

  const clearCart = () => {
    cartList.value = []
    saveCart()
  }

  return {
    cartList,
    cartCount,
    selectedCount,
    totalPrice,
    initCart,
    addToCart,
    updateQuantity,
    toggleSelect,
    toggleSelectAll,
    deleteSelected,
    removeFromCart,
    clearCart
  }
})
