<template>
  <view class="settings-page">
    <view class="settings-group">
      <text class="group-title">账号设置</text>
      <view class="setting-item" @click="handleItem('phone')">
        <text>📱 绑定手机号</text>
        <text class="si-value">138****8888 ›</text>
      </view>
      <view class="setting-item" @click="handleItem('wechat')">
        <text>💬 绑定微信</text>
        <text class="si-value">已绑定 ›</text>
      </view>
    </view>

    <view class="settings-group">
      <text class="group-title">隐私</text>
      <view class="setting-item">
        <text>👁️ 隐身模式</text>
        <switch :checked="privacy.hidden" @change="privacy.hidden = $event.detail.value" color="#e94560" />
      </view>
      <view class="setting-item">
        <text>📍 隐藏距离</text>
        <switch :checked="privacy.hideDistance" @change="privacy.hideDistance = $event.detail.value" color="#e94560" />
      </view>
      <view class="setting-item">
        <text>🚫 黑名单</text>
        <text class="si-value">0人 ›</text>
      </view>
    </view>

    <view class="settings-group">
      <text class="group-title">通知</text>
      <view class="setting-item">
        <text>🔔 新消息通知</text>
        <switch :checked="notify.msg" @change="notify.msg = $event.detail.value" color="#e94560" />
      </view>
      <view class="setting-item">
        <text>🍻 酒局提醒</text>
        <switch :checked="notify.event" @change="notify.event = $event.detail.value" color="#e94560" />
      </view>
      <view class="setting-item">
        <text>🤝 匹配通知</text>
        <switch :checked="notify.match" @change="notify.match = $event.detail.value" color="#e94560" />
      </view>
    </view>

    <view class="settings-group">
      <text class="group-title">其他</text>
      <view class="setting-item" @click="handleItem('cache')">
        <text>🗑️ 清除缓存</text>
        <text class="si-value">12.5MB ›</text>
      </view>
      <view class="setting-item" @click="handleItem('feedback')">
        <text>💡 意见反馈</text>
        <text class="si-value">›</text>
      </view>
      <view class="setting-item" @click="handleItem('about')">
        <text>ℹ️ 关于酒搭子</text>
        <text class="si-value">v1.0.0 ›</text>
      </view>
    </view>

    <!-- 注销账号 -->
    <view class="danger-section">
      <button class="delete-btn" @click="handleDelete">注销账号</button>
    </view>
  </view>
</template>

<script setup>
import { reactive } from 'vue'

const privacy = reactive({ hidden: false, hideDistance: false })
const notify = reactive({ msg: true, event: true, match: true })

function handleItem(key) {
  const actions = {
    phone: '手机号绑定',
    wechat: '微信绑定',
    cache: '缓存已清除',
    feedback: '意见反馈',
    about: '关于酒搭子 v1.0.0'
  }
  uni.showToast({ title: actions[key] || key, icon: 'success' })
}

function handleDelete() {
  uni.showModal({
    title: '确认注销',
    content: '注销后所有数据将无法恢复，确定要注销吗？',
    confirmColor: '#ff4757',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '账号已注销', icon: 'none' })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.settings-page {
  min-height: 100vh;
  background: $bg-dark;
  padding: $spacing-md;
}

.settings-group {
  margin-bottom: $spacing-lg;
  
  .group-title {
    font-size: $font-sm;
    color: $text-muted;
    padding: 0 $spacing-sm;
    margin-bottom: $spacing-sm;
    display: block;
  }
  
  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: $bg-card;
    padding: $spacing-md;
    border-bottom: 1rpx solid rgba(255,255,255,0.03);
    
    &:first-of-type { border-radius: $radius-md $radius-md 0 0; }
    &:last-of-type { border-radius: 0 0 $radius-md $radius-md; border-bottom: none; }
    
    font-size: $font-md;
    
    .si-value { color: $text-muted; font-size: $font-sm; }
  }
}

.danger-section {
  padding: $spacing-xl $spacing-md;
  
  .delete-btn {
    width: 100%;
    height: 88rpx;
    background: transparent;
    color: $danger;
    border: 1rpx solid rgba(255,71,87,0.3);
    border-radius: $radius-md;
    font-size: $font-md;
  }
}
</style>
