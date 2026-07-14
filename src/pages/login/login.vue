<template>
  <view class="login-page">
    <!-- 背景装饰 -->
    <view class="bg-decoration">
      <view class="circle c1"></view>
      <view class="circle c2"></view>
      <view class="circle c3"></view>
    </view>

    <!-- Logo + 标语 -->
    <view class="hero fade-in-up">
      <text class="logo-emoji">🍻</text>
      <text class="app-name text-gradient">酒搭子</text>
      <text class="slogan">找到你的喝酒搭子</text>
      <text class="sub-slogan">一个人的酒是寂寞，一群人的酒是快乐</text>
    </view>

    <!-- 特性展示 -->
    <view class="features">
      <view class="feature-item" v-for="(item, i) in features" :key="i"
            :style="{ animationDelay: (0.3 + i * 0.15) + 's' }">
        <text class="feature-icon">{{ item.icon }}</text>
        <text class="feature-text">{{ item.text }}</text>
      </view>
    </view>

    <!-- 登录按钮 -->
    <view class="login-actions">
      <button class="wechat-btn" @click="handleWechatLogin" 
              :loading="loading" hover-class="btn-hover">
        <text class="wx-icon">💬</text>
        <text>微信一键登录</text>
      </button>
      
      <button class="phone-btn" @click="handlePhoneLogin" hover-class="btn-hover">
        <text class="phone-icon">📱</text>
        <text>手机号登录</text>
      </button>
      
      <view class="agree-text">
        登录即同意<text class="link" @click="showAgreement">《用户协议》</text>和<text class="link" @click="showAgreement">《隐私政策》</text>
      </view>
    </view>

    <!-- 手机号登录弹窗 -->
    <u-popup :show="showPhonePopup" mode="bottom" round="24" @close="showPhonePopup = false">
      <view class="phone-popup">
        <text class="popup-title">手机号登录</text>
        <u-input v-model="phone" placeholder="请输入手机号" type="number" maxlength="11"
                 border="surround" clearable class="phone-input" />
        <u-code-input v-model="code" maxlength="6" @finish="handleCodeFinish" 
                      class="code-input" v-if="showCode" />
        <u-button type="primary" text="获取验证码" @click="sendCode" 
                  :loading="sending" v-if="!showCode" />
        <u-button type="primary" text="登录" @click="handlePhoneConfirm"
                  :loading="loading" v-if="showCode" />
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const loading = ref(false)
const showPhonePopup = ref(false)
const showCode = ref(false)
const sending = ref(false)
const phone = ref('')
const code = ref('')

const features = [
  { icon: '🍺', text: '发现附近酒局' },
  { icon: '🤝', text: '匹配喝酒搭子' },
  { icon: '📍', text: 'LBS精准定位' },
  { icon: '🎯', text: '兴趣精准匹配' }
]

async function handleWechatLogin() {
  loading.value = true
  try {
    // #ifdef MP-WEIXIN
    const { code } = await uni.login({ provider: 'weixin' })
    console.log('微信 code:', code)
    // #endif
    await userStore.login('weixin')
    uni.switchTab({ url: '/pages/discover/discover' })
  } catch (e) {
    uni.showToast({ title: '登录失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function handlePhoneLogin() {
  showPhonePopup.value = true
}

function sendCode() {
  if (phone.value.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  sending.value = true
  setTimeout(() => {
    sending.value = false
    showCode.value = true
    uni.showToast({ title: '验证码已发送', icon: 'success' })
  }, 1000)
}

function handleCodeFinish(text) {
  code.value = text
}

async function handlePhoneConfirm() {
  loading.value = true
  try {
    await userStore.login('phone')
    showPhonePopup.value = false
    uni.switchTab({ url: '/pages/discover/discover' })
  } finally {
    loading.value = false
  }
}

function showAgreement() {
  uni.showToast({ title: '用户协议页面', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: $bg-dark;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx $spacing-lg 60rpx;
  position: relative;
  overflow: hidden;
}

.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  
  .circle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.06;
    
    &.c1 {
      width: 600rpx;
      height: 600rpx;
      background: $primary;
      top: -200rpx;
      right: -150rpx;
    }
    &.c2 {
      width: 400rpx;
      height: 400rpx;
      background: $beer;
      bottom: 200rpx;
      left: -100rpx;
    }
    &.c3 {
      width: 300rpx;
      height: 300rpx;
      background: $cocktail;
      top: 50%;
      right: -50rpx;
    }
  }
}

.hero {
  text-align: center;
  margin-bottom: 80rpx;
  
  .logo-emoji {
    font-size: 120rpx;
    display: block;
    margin-bottom: $spacing-md;
  }
  
  .app-name {
    font-size: 72rpx;
    font-weight: 900;
    display: block;
    margin-bottom: $spacing-sm;
  }
  
  .slogan {
    font-size: $font-lg;
    color: $text-secondary;
    display: block;
    margin-bottom: $spacing-xs;
  }
  
  .sub-slogan {
    font-size: $font-sm;
    color: $text-muted;
  }
}

.features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: $spacing-md;
  margin-bottom: 80rpx;
  width: 100%;
  
  .feature-item {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    background: $bg-card;
    padding: $spacing-sm $spacing-md;
    border-radius: 50rpx;
    animation: fadeInUp 0.6s ease-out both;
    
    .feature-icon {
      font-size: $font-lg;
    }
    .feature-text {
      font-size: $font-sm;
      color: $text-secondary;
    }
  }
}

.login-actions {
  width: 100%;
  max-width: 600rpx;
  
  .wechat-btn, .phone-btn {
    width: 100%;
    height: 100rpx;
    border-radius: $radius-lg;
    font-size: $font-md;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;
    border: none;
    margin-bottom: $spacing-md;
    
    &:active {
      transform: scale(0.98);
    }
  }
  
  .wechat-btn {
    background: linear-gradient(135deg, #07c160, #06ad56);
    color: #fff;
    box-shadow: 0 8rpx 24rpx rgba(7, 193, 96, 0.3);
  }
  
  .phone-btn {
    background: $bg-card;
    color: $text-primary;
    border: 1rpx solid rgba(255, 255, 255, 0.15);
  }
}

.agree-text {
  text-align: center;
  font-size: $font-xs;
  color: $text-muted;
  margin-top: $spacing-md;
  
  .link {
    color: $primary;
  }
}

.phone-popup {
  background: $bg-card;
  padding: $spacing-xl $spacing-lg;
  padding-bottom: 60rpx;
  
  .popup-title {
    font-size: $font-xl;
    font-weight: 700;
    display: block;
    text-align: center;
    margin-bottom: $spacing-xl;
  }
  
  .phone-input, .code-input {
    margin-bottom: $spacing-lg;
  }
}
</style>
