<template>
  <view class="app-root">
    <text class="title">🍻 酒搭子</text>
    <text class="subtitle">uni-app 框架已加载</text>
    
    <!-- 导航测试 -->
    <view class="nav-cards">
      <view class="nav-card" v-for="item in navItems" :key="item.text"
            @click="count++">
        <text class="card-icon">{{ item.icon }}</text>
        <text class="card-title">{{ item.text }}</text>
        <text class="card-desc">{{ item.desc }}</text>
      </view>
    </view>

    <button class="enter-btn" @click="count++">
      进入酒搭子 ({{ count }})
    </button>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)

const navItems = [
  { icon: '🔍', text: '发现搭子', desc: '附近酒友推荐' },
  { icon: '💘', text: '匹配', desc: '左滑右滑约酒' },
  { icon: '🍺', text: '酒局', desc: '发起/加入酒局' },
  { icon: '💬', text: '消息', desc: '与酒友聊天' },
  { icon: '👤', text: '我的', desc: '个人主页' },
]
</script>

<style>
.app-root {
  min-height: 100vh;
  background: #0f0f1a;
  padding: 60rpx 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 48rpx;
  font-weight: 900;
  background: linear-gradient(135deg, #e94560, #ff6b81);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8rpx;
}

.subtitle {
  font-size: 26rpx;
  color: #666680;
  margin-bottom: 60rpx;
}

.nav-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  justify-content: center;
  width: 100%;
  margin-bottom: 60rpx;
}

.nav-card {
  width: 200rpx;
  background: #1a1a2e;
  border-radius: 16rpx;
  padding: 30rpx 20rpx;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}

.card-icon {
  font-size: 44rpx;
}

.card-title {
  font-size: 28rpx;
  color: #fff;
  font-weight: 600;
}

.card-desc {
  font-size: 20rpx;
  color: #666680;
}

.enter-btn {
  background: linear-gradient(135deg, #e94560, #ff6b81);
  color: #fff;
  border: none;
  border-radius: 50rpx;
  padding: 24rpx 80rpx;
  font-size: 32rpx;
  font-weight: 700;
  box-shadow: 0 8rpx 24rpx rgba(233,69,96,0.3);
}
</style>
