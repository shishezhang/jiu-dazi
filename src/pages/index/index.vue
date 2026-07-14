<template>
  <view class="index-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <view class="nav-left">
        <text class="location-text" @click="selectCity">
          📍 {{ currentCity }}
          <text class="arrow">▾</text>
        </text>
      </view>
      <view class="nav-title">
        <text class="title-icon">🍻</text>
        <text class="title-text">酒搭子</text>
      </view>
      <view class="nav-right">
        <text class="filter-btn" @click="showFilter = true">
          🔍 筛选
        </text>
      </view>
    </view>

    <!-- 分类标签 -->
    <scroll-view scroll-x class="category-bar">
      <view class="category-list">
        <view class="category-item" v-for="(cat, i) in categories" :key="i"
              :class="{ active: activeCategory === cat.value }"
              @click="activeCategory = cat.value">
          <text class="cat-icon">{{ cat.icon }}</text>
          <text class="cat-name">{{ cat.name }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 酒局列表 -->
    <scroll-view scroll-y class="event-list" @scrolltolower="loadMore" refresher-enabled
                 :refresher-triggered="refreshing" @refresherrefresh="onRefresh">
      <view class="list-header">
        <text class="section-title">🔥 热门酒局</text>
        <text class="event-count">共 {{ events.length }} 场</text>
      </view>

      <view class="event-card card-glass fade-in-up" v-for="event in events" :key="event.id"
            @click="goDetail(event.id)">
        <!-- 头部：发起人信息 -->
        <view class="card-header">
          <view class="host-info">
            <image :src="event.host.avatar" class="host-avatar" mode="aspectFill" />
            <view class="host-meta">
              <text class="host-name">{{ event.host.nickname }}</text>
              <view class="host-rating">
                <text class="star">⭐</text>
                <text>{{ event.host.rating }}</text>
              </view>
            </view>
          </view>
          <view class="drink-type-badge" :style="{ background: drinkColors[event.type] }">
            {{ event.drinkType }}
          </view>
        </view>

        <!-- 标题 -->
        <text class="event-title">{{ event.title }}</text>
        
        <!-- 描述 -->
        <text class="event-desc">{{ event.description }}</text>

        <!-- 信息行 -->
        <view class="event-info">
          <view class="info-item">
            <text class="info-icon">📅</text>
            <text class="info-text">{{ event.date }} {{ event.time }}</text>
          </view>
          <view class="info-item">
            <text class="info-icon">📍</text>
            <text class="info-text">{{ event.location }}</text>
          </view>
          <view class="info-item">
            <text class="info-icon">💰</text>
            <text class="info-text">{{ event.fee }}</text>
          </view>
        </view>

        <!-- 标签 + 人数 -->
        <view class="card-footer">
          <view class="tags">
            <text class="tag" v-for="tag in event.tags" :key="tag">{{ tag }}</text>
          </view>
          <view class="people-info">
            <view class="avatar-stack">
              <image v-for="n in Math.min(event.currentPeople, 3)" :key="n" 
                     :src="`https://picsum.photos/100/100?random=${n + parseInt(event.id.slice(2))}`"
                     class="mini-avatar" mode="aspectFill" />
            </view>
            <text class="people-count">{{ event.currentPeople }}/{{ event.maxPeople }}</text>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="card-actions">
          <button class="join-btn" @click.stop="handleJoin(event)">
            {{ event.currentPeople >= event.maxPeople ? '已满员' : '🎉 我要报名' }}
          </button>
        </view>
      </view>

      <view class="loading-more" v-if="loading">
        <u-loading-icon />
        <text>加载中...</text>
      </view>
      <view class="no-more" v-if="noMore && events.length > 0">
        <text>— 已经到底了 —</text>
      </view>
    </scroll-view>

    <!-- 发起按钮 -->
    <view class="create-btn" @click="goCreate">
      <text class="create-icon">＋</text>
      <text class="create-text">发起酒局</text>
    </view>

    <!-- 筛选弹窗 -->
    <u-popup :show="showFilter" mode="bottom" round="24" @close="showFilter = false">
      <view class="filter-popup">
        <text class="filter-title">筛选酒局</text>
        <view class="filter-section">
          <text class="filter-label">酒类</text>
          <view class="filter-tags">
            <text class="filter-tag" v-for="d in drinkTypes" :key="d.value"
                  :class="{ active: filterDrink === d.value }"
                  @click="filterDrink = d.value">{{ d.name }}</text>
          </view>
        </view>
        <view class="filter-section">
          <text class="filter-label">日期</text>
          <view class="filter-tags">
            <text class="filter-tag" v-for="d in dateFilters" :key="d.value"
                  :class="{ active: filterDate === d.value }"
                  @click="filterDate = d.value">{{ d.name }}</text>
          </view>
        </view>
        <u-button type="primary" text="确定" @click="applyFilter" />
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useEventStore } from '@/stores/event'

const eventStore = useEventStore()
const events = computed(() => eventStore.events)
const loading = ref(false)
const refreshing = ref(false)
const noMore = ref(false)
const currentCity = ref('深圳')
const activeCategory = ref('all')
const showFilter = ref(false)
const filterDrink = ref('all')
const filterDate = ref('all')

const categories = [
  { icon: '🍺', name: '全部', value: 'all' },
  { icon: '🍻', name: '啤酒', value: 'beer' },
  { icon: '🥃', name: '烈酒', value: 'spirit' },
  { icon: '🍷', name: '红酒', value: 'wine' },
  { icon: '🍸', name: '鸡尾酒', value: 'cocktail' },
  { icon: '🍶', name: '清酒', value: 'sake' }
]

const drinkColors = {
  beer: 'linear-gradient(135deg, #f9ca24, #f0932b)',
  wine: 'linear-gradient(135deg, #c0392b, #8e44ad)',
  spirit: 'linear-gradient(135deg, #e67e22, #d35400)',
  cocktail: 'linear-gradient(135deg, #e056a0, #9b59b6)',
  sake: 'linear-gradient(135deg, #74b9ff, #0984e3)'
}

const drinkTypes = [
  { name: '全部', value: 'all' },
  { name: '啤酒', value: 'beer' },
  { name: '红酒', value: 'wine' },
  { name: '威士忌', value: 'spirit' },
  { name: '鸡尾酒', value: 'cocktail' },
  { name: '清酒', value: 'sake' }
]

const dateFilters = [
  { name: '全部', value: 'all' },
  { name: '今天', value: 'today' },
  { name: '明天', value: 'tomorrow' },
  { name: '本周', value: 'week' },
  { name: '周末', value: 'weekend' }
]

onMounted(() => {
  loadEvents()
})

async function loadEvents() {
  loading.value = true
  await eventStore.fetchEvents()
  loading.value = false
}

function onRefresh() {
  refreshing.value = true
  setTimeout(() => {
    refreshing.value = false
    uni.showToast({ title: '已刷新', icon: 'success' })
  }, 1000)
}

function loadMore() {
  if (noMore.value) return
  noMore.value = true
  uni.showToast({ title: '没有更多了', icon: 'none' })
}

function handleJoin(event) {
  if (event.currentPeople >= event.maxPeople) return
  eventStore.joinEvent(event.id)
}

function goDetail(id) {
  uni.navigateTo({ url: `/pages/event/detail?id=${id}` })
}

function goCreate() {
  uni.navigateTo({ url: '/pages/event/create' })
}

function selectCity() {
  uni.showToast({ title: '城市选择（开发中）', icon: 'none' })
}

function applyFilter() {
  showFilter.value = false
  uni.showToast({ title: '筛选已应用', icon: 'success' })
}
</script>

<style lang="scss" scoped>
.index-page {
  min-height: 100vh;
  background: $bg-dark;
  padding-bottom: 120rpx;
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(var(--status-bar-height) + 20rpx) $spacing-md $spacing-sm;
  background: $bg-dark;
  
  .nav-left, .nav-right {
    width: 160rpx;
  }
  
  .location-text {
    font-size: $font-sm;
    color: $text-secondary;
    .arrow { font-size: 20rpx; margin-left: 4rpx; }
  }
  
  .nav-title {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    .title-icon { font-size: 36rpx; }
    .title-text { font-size: $font-lg; font-weight: 700; }
  }
  
  .filter-btn {
    font-size: $font-sm;
    color: $primary;
    text-align: right;
  }
}

.category-bar {
  white-space: nowrap;
  padding: $spacing-sm 0;
  
  .category-list {
    display: inline-flex;
    padding: 0 $spacing-md;
    gap: $spacing-sm;
  }
  
  .category-item {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 4rpx;
    padding: $spacing-sm $spacing-md;
    border-radius: $radius-md;
    background: $bg-card;
    transition: all 0.3s;
    
    .cat-icon { font-size: 32rpx; }
    .cat-name { font-size: $font-xs; color: $text-secondary; }
    
    &.active {
      background: linear-gradient(135deg, $primary, $primary-light);
      .cat-name { color: #fff; }
    }
  }
}

.event-list {
  height: calc(100vh - 280rpx - var(--status-bar-height));
  padding: 0 $spacing-md;
  
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-md 0;
    
    .section-title {
      font-size: $font-lg;
      font-weight: 700;
    }
    .event-count {
      font-size: $font-xs;
      color: $text-muted;
    }
  }
}

.event-card {
  margin-bottom: $spacing-md;
  padding: $spacing-md;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-sm;
    
    .host-info {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      
      .host-avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        border: 2rpx solid $primary;
      }
      
      .host-meta {
        .host-name { font-size: $font-md; font-weight: 600; }
        .host-rating { font-size: $font-xs; color: $text-secondary; }
      }
    }
    
    .drink-type-badge {
      padding: 6rpx 16rpx;
      border-radius: 20rpx;
      font-size: $font-xs;
      color: #fff;
    }
  }
  
  .event-title {
    font-size: $font-lg;
    font-weight: 700;
    margin-bottom: $spacing-sm;
    display: block;
  }
  
  .event-desc {
    font-size: $font-sm;
    color: $text-secondary;
    line-height: 1.6;
    margin-bottom: $spacing-sm;
    display: block;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .event-info {
    margin-bottom: $spacing-sm;
    
    .info-item {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      margin-bottom: 6rpx;
      
      .info-icon { font-size: $font-sm; }
      .info-text { font-size: $font-sm; color: $text-secondary; }
    }
  }
  
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;
    
    .tags {
      display: flex;
      gap: $spacing-xs;
      
      .tag {
        font-size: $font-xs;
        color: $primary;
        background: rgba(233, 69, 96, 0.1);
        padding: 4rpx 16rpx;
        border-radius: 20rpx;
      }
    }
    
    .people-info {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      
      .avatar-stack {
        display: flex;
        .mini-avatar {
          width: 44rpx;
          height: 44rpx;
          border-radius: 50%;
          border: 2rpx solid $bg-card;
          margin-left: -12rpx;
          &:first-child { margin-left: 0; }
        }
      }
      
      .people-count {
        font-size: $font-xs;
        color: $text-secondary;
      }
    }
  }
  
  .card-actions {
    .join-btn {
      width: 100%;
      height: 72rpx;
      background: linear-gradient(135deg, $primary, $primary-light);
      color: #fff;
      border-radius: $radius-md;
      font-size: $font-md;
      font-weight: 600;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:active {
        opacity: 0.85;
      }
    }
  }
}

.create-btn {
  position: fixed;
  bottom: 120rpx;
  right: $spacing-lg;
  background: linear-gradient(135deg, $primary, $primary-light);
  border-radius: 50rpx;
  padding: $spacing-sm $spacing-lg;
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  box-shadow: 0 8rpx 24rpx rgba(233, 69, 96, 0.4);
  z-index: 100;
  
  .create-icon {
    font-size: $font-xl;
    font-weight: 300;
    color: #fff;
  }
  .create-text {
    font-size: $font-sm;
    font-weight: 600;
    color: #fff;
  }
}

.filter-popup {
  background: $bg-card;
  padding: $spacing-xl $spacing-lg;
  padding-bottom: 60rpx;
  
  .filter-title {
    font-size: $font-xl;
    font-weight: 700;
    text-align: center;
    display: block;
    margin-bottom: $spacing-xl;
  }
  
  .filter-section {
    margin-bottom: $spacing-lg;
    
    .filter-label {
      font-size: $font-md;
      color: $text-secondary;
      margin-bottom: $spacing-sm;
      display: block;
    }
    
    .filter-tags {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-sm;
      
      .filter-tag {
        padding: $spacing-xs $spacing-md;
        border-radius: 40rpx;
        background: $bg-input;
        font-size: $font-sm;
        color: $text-secondary;
        
        &.active {
          background: $primary;
          color: #fff;
        }
      }
    }
  }
}

.loading-more, .no-more {
  text-align: center;
  padding: $spacing-lg;
  font-size: $font-sm;
  color: $text-muted;
}
</style>
