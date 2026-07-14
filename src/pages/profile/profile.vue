<template>
  <view class="profile-page">
    <!-- 顶部背景 + 头像 -->
    <view class="profile-header">
      <view class="header-bg"></view>
      <view class="header-content">
        <image :src="userInfo?.avatar || '/static/default-avatar.png'" 
               class="profile-avatar" mode="aspectFill" @click="changeAvatar" />
        <text class="profile-name">{{ userInfo?.nickname || '未登录' }}</text>
        <text class="profile-bio">{{ userInfo?.bio || '这个人很懒，什么都没写...' }}</text>
        
        <view class="stats-row">
          <view class="stat-item">
            <text class="stat-num">{{ userInfo?.stats?.events || 0 }}</text>
            <text class="stat-label">参与酒局</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-num">{{ userInfo?.stats?.friends || 0 }}</text>
            <text class="stat-label">酒友</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-num">{{ userInfo?.stats?.rating || 0 }}</text>
            <text class="stat-label">评分</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 饮酒信息 -->
    <view class="drink-card card-glass">
      <view class="card-title-row">
        <text class="card-title">🍻 饮酒档案</text>
        <text class="edit-link" @click="goEdit">编辑</text>
      </view>
      
      <view class="drink-info-grid">
        <view class="drink-info-item">
          <text class="di-label">最爱酒类</text>
          <view class="di-tags">
            <text class="di-tag" v-for="d in userInfo?.drinkPrefs || []" :key="d">{{ d }}</text>
          </view>
        </view>
        <view class="drink-info-item">
          <text class="di-label">酒量等级</text>
          <view class="di-level">
            <text v-for="n in 5" :key="n" :class="{ filled: n <= (userInfo?.drinkLevel || 0) }">🍺</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 我的酒局 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">📋 我的酒局</text>
        <text class="section-more" @click="goMyEvents">全部 ›</text>
      </view>
      
      <scroll-view scroll-x class="event-scroll">
        <view class="my-event-list" v-if="myEvents.length > 0">
          <view class="my-event-card card-glass" v-for="e in myEvents" :key="e.id">
            <text class="me-title">{{ e.title }}</text>
            <text class="me-date">📅 {{ e.date }} {{ e.time }}</text>
            <view class="me-footer">
              <text class="me-role">{{ e.role === 'host' ? '发起人' : '参与者' }}</text>
              <text class="me-people">{{ e.currentPeople }}/{{ e.maxPeople }}人</text>
            </view>
            <view class="me-status" :class="e.status">{{ e.status === 'upcoming' ? '即将开始' : '进行中' }}</view>
          </view>
        </view>
        <view class="empty-my-events" v-else>
          <text class="empty-text">还没有酒局？</text>
          <button class="create-btn-mini" @click="goCreate">发起一个</button>
        </view>
      </scroll-view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-item" v-for="item in menus" :key="item.key" @click="handleMenu(item.key)">
        <text class="menu-icon">{{ item.icon }}</text>
        <text class="menu-text">{{ item.name }}</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-section">
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useEventStore } from '@/stores/event'

const userStore = useUserStore()
const eventStore = useEventStore()

const userInfo = computed(() => userStore.userInfo)
const myEvents = ref([])

const menus = [
  { key: 'events', icon: '📋', name: '我的酒局' },
  { key: 'friends', icon: '👥', name: '我的酒友' },
  { key: 'favorites', icon: '⭐', name: '收藏的酒吧' },
  { key: 'vip', icon: '👑', name: '会员中心' },
  { key: 'invite', icon: '📨', name: '邀请好友' },
  { key: 'settings', icon: '⚙️', name: '设置' },
  { key: 'about', icon: 'ℹ️', name: '关于酒搭子' }
]

onMounted(async () => {
  await eventStore.fetchMyEvents()
  myEvents.value = eventStore.myEvents
})

function changeAvatar() {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      userStore.updateProfile({ avatar: res.tempFilePaths[0] })
    }
  })
}

function goEdit() {
  uni.navigateTo({ url: '/pages/profile/edit' })
}

function goMyEvents() {
  uni.switchTab({ url: '/pages/index/index' })
}

function goCreate() {
  uni.navigateTo({ url: '/pages/event/create' })
}

function handleMenu(key) {
  if (key === 'settings') {
    uni.navigateTo({ url: '/pages/profile/settings' })
  } else {
    uni.showToast({ title: '功能开发中', icon: 'none' })
  }
}

function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background: $bg-dark;
  padding-bottom: 60rpx;
}

.profile-header {
  position: relative;
  padding-top: calc(var(--status-bar-height) + 60rpx);
  
  .header-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 400rpx;
    background: linear-gradient(180deg, $primary 0%, rgba(233,69,96,0.3) 60%, $bg-dark 100%);
  }
  
  .header-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 $spacing-lg;
    
    .profile-avatar {
      width: 160rpx;
      height: 160rpx;
      border-radius: 50%;
      border: 4rpx solid #fff;
      box-shadow: $shadow-md;
      margin-bottom: $spacing-md;
    }
    
    .profile-name {
      font-size: $font-xl;
      font-weight: 700;
      margin-bottom: $spacing-xs;
    }
    
    .profile-bio {
      font-size: $font-sm;
      color: rgba(255,255,255,0.7);
      text-align: center;
      margin-bottom: $spacing-lg;
    }
    
    .stats-row {
      display: flex;
      align-items: center;
      background: rgba(0,0,0,0.3);
      border-radius: $radius-md;
      padding: $spacing-md $spacing-xl;
      width: 100%;
      
      .stat-item {
        flex: 1;
        text-align: center;
        
        .stat-num { font-size: $font-xl; font-weight: 700; display: block; }
        .stat-label { font-size: $font-xs; color: $text-muted; }
      }
      
      .stat-divider {
        width: 1rpx;
        height: 40rpx;
        background: rgba(255,255,255,0.15);
      }
    }
  }
}

.drink-card {
  margin: $spacing-md $spacing-md;
  padding: $spacing-md;
  
  .card-title-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: $spacing-md;
    
    .card-title { font-size: $font-md; font-weight: 600; }
    .edit-link { font-size: $font-sm; color: $primary; }
  }
  
  .drink-info-grid {
    display: flex;
    justify-content: space-around;
    
    .drink-info-item {
      .di-label { font-size: $font-xs; color: $text-muted; display: block; margin-bottom: 8rpx; }
      
      .di-tags {
        display: flex;
        gap: 6rpx;
        .di-tag { font-size: $font-sm; color: $primary; background: rgba(233,69,96,0.1); padding: 4rpx 14rpx; border-radius: 14rpx; }
      }
      
      .di-level text { font-size: 28rpx; opacity: 0.3; &.filled { opacity: 1; } }
    }
  }
}

.section {
  padding: $spacing-md;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: $spacing-md;
    .section-title { font-size: $font-lg; font-weight: 700; }
    .section-more { font-size: $font-sm; color: $primary; }
  }
}

.event-scroll {
  white-space: nowrap;
  
  .my-event-list {
    display: inline-flex;
    gap: $spacing-md;
  }
  
  .my-event-card {
    width: 260rpx;
    padding: $spacing-md;
    position: relative;
    display: inline-block;
    white-space: normal;
    
    .me-title { font-size: $font-md; font-weight: 600; display: block; margin-bottom: 8rpx; }
    .me-date { font-size: $font-xs; color: $text-muted; display: block; margin-bottom: $spacing-sm; }
    
    .me-footer {
      display: flex;
      justify-content: space-between;
      .me-role { font-size: $font-xs; color: $primary; }
      .me-people { font-size: $font-xs; color: $text-muted; }
    }
    
    .me-status {
      position: absolute;
      top: $spacing-sm;
      right: $spacing-sm;
      font-size: 18rpx;
      padding: 2rpx 10rpx;
      border-radius: 8rpx;
      
      &.upcoming { background: rgba(46,213,115,0.2); color: $success; }
      &.ongoing { background: rgba(233,69,96,0.2); color: $primary; }
    }
  }
}

.empty-my-events {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-xl;
  
  .empty-text { font-size: $font-sm; color: $text-muted; }
  .create-btn-mini {
    margin-top: $spacing-sm;
    background: $primary;
    color: #fff;
    border: none;
    border-radius: 30rpx;
    font-size: $font-sm;
    padding: 8rpx 24rpx;
  }
}

.menu-section {
  margin: $spacing-md;
  background: $bg-card;
  border-radius: $radius-md;
  overflow: hidden;
  
  .menu-item {
    display: flex;
    align-items: center;
    padding: $spacing-md;
    border-bottom: 1rpx solid rgba(255,255,255,0.05);
    
    &:last-child { border-bottom: none; }
    &:active { background: $bg-card-hover; }
    
    .menu-icon { font-size: $font-lg; margin-right: $spacing-md; }
    .menu-text { flex: 1; font-size: $font-md; }
    .menu-arrow { font-size: $font-lg; color: $text-muted; }
  }
}

.logout-section {
  padding: $spacing-xl $spacing-md;
  
  .logout-btn {
    width: 100%;
    height: 88rpx;
    background: transparent;
    color: $danger;
    border: 1rpx solid $danger;
    border-radius: $radius-md;
    font-size: $font-md;
  }
}
</style>
