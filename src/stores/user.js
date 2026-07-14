import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref(null)
  const isLogin = computed(() => !!token.value)

  // Mock 用户数据
  const mockUser = {
    id: 'u_001',
    nickname: '酒中仙',
    avatar: '/static/default-avatar.png',
    phone: '138****8888',
    gender: 1, // 1:男 2:女
    age: 28,
    bio: '人生得意须尽欢，莫使金樽空对月 🍻',
    city: '深圳',
    district: '南山区',
    drinkPrefs: ['啤酒', '威士忌', '鸡尾酒'],
    drinkLevel: 3, // 1-5 酒量等级
    occupation: '程序员',
    tags: ['夜猫子', '烧烤达人', 'K歌之王'],
    photos: [
      'https://picsum.photos/400/400?random=1',
      'https://picsum.photos/400/400?random=2',
      'https://picsum.photos/400/400?random=3'
    ],
    stats: {
      events: 12,
      friends: 48,
      rating: 4.8
    },
    vip: false,
    createdAt: '2024-01-15'
  }

  function login(provider = 'weixin') {
    // Mock 登录
    return new Promise((resolve) => {
      uni.showLoading({ title: '登录中...' })
      setTimeout(() => {
        token.value = 'mock_token_' + Date.now()
        userInfo.value = { ...mockUser }
        uni.setStorageSync('token', token.value)
        uni.setStorageSync('userInfo', JSON.stringify(userInfo.value))
        uni.hideLoading()
        resolve(userInfo.value)
      }, 1000)
    })
  }

  function checkLogin() {
    const savedToken = uni.getStorageSync('token')
    const savedInfo = uni.getStorageSync('userInfo')
    if (savedToken && savedInfo) {
      token.value = savedToken
      try {
        userInfo.value = JSON.parse(savedInfo)
      } catch {
        userInfo.value = mockUser
      }
    }
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    uni.removeStorageSync('token')
    uni.removeStorageSync('userInfo')
    uni.reLaunch({ url: '/pages/login/login' })
  }

  function updateProfile(data) {
    userInfo.value = { ...userInfo.value, ...data }
    uni.setStorageSync('userInfo', JSON.stringify(userInfo.value))
    uni.showToast({ title: '保存成功', icon: 'success' })
  }

  return { token, userInfo, isLogin, login, checkLogin, logout, updateProfile }
})
