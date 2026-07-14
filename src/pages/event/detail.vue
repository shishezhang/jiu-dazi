<template>
  <view class="detail-page">
    <!-- 酒局信息 -->
    <view class="event-hero">
      <view class="drink-type-hero" :style="{ background: drinkColor }">
        <text class="hero-icon">{{ drinkIcon }}</text>
      </view>
      <text class="hero-title">{{ event.title }}</text>
    </view>

    <view class="content">
      <!-- 发起人 -->
      <view class="host-card card-glass">
        <view class="host-row">
          <image :src="event.host?.avatar" class="host-avatar" mode="aspectFill" />
          <view class="host-meta">
            <text class="host-name">{{ event.host?.nickname }}</text>
            <text class="host-rating">⭐ {{ event.host?.rating }} · {{ event.host?.events || 0 }} 场酒局</text>
          </view>
          <button class="follow-btn">关注</button>
        </view>
      </view>

      <!-- 基本信息 -->
      <view class="info-card card-glass">
        <view class="info-row">
          <text class="info-icon">📅</text>
          <text class="info-value">{{ event.date }} · {{ event.time }}</text>
        </view>
        <view class="info-row">
          <text class="info-icon">📍</text>
          <view>
            <text class="info-value">{{ event.location }}</text>
            <text class="info-sub">{{ event.address }}</text>
          </view>
        </view>
        <view class="info-row">
          <text class="info-icon">💰</text>
          <text class="info-value">{{ event.fee }}</text>
        </view>
        <view class="info-row">
          <text class="info-icon">👥</text>
          <text class="info-value">{{ event.currentPeople }}/{{ event.maxPeople }} 人已报名</text>
        </view>
      </view>

      <!-- 描述 -->
      <view class="desc-card card-glass">
        <text class="desc-title">📝 酒局介绍</text>
        <text class="desc-text">{{ event.description }}</text>
      </view>

      <!-- 标签 -->
      <view class="tags-card" v-if="event.tags?.length">
        <text class="tag" v-for="tag in event.tags" :key="tag">{{ tag }}</text>
      </view>

      <!-- 报名列表 -->
      <view class="participants-card card-glass">
        <text class="part-title">已报名 ({{ event.currentPeople }})</text>
        <view class="part-list">
          <view class="part-item" v-for="n in event.currentPeople" :key="n">
            <image :src="`https://picsum.photos/100/100?random=${n + 50}`" 
                   class="part-avatar" mode="aspectFill" />
            <text class="part-name">酒友{{ n }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作 -->
    <view class="bottom-bar safe-area-bottom">
      <view class="bottom-actions">
        <view class="action-icon-btn" @click="share">
          <text>📤</text>
        </view>
        <view class="action-icon-btn" @click="likeEvent">
          <text>❤️</text>
        </view>
      </view>
      <button class="join-main-btn" @click="handleJoin" 
              :class="{ disabled: event.currentPeople >= event.maxPeople }">
        {{ event.currentPeople >= event.maxPeople ? '已满员' : '🎉 我要报名' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useEventStore } from '@/stores/event'

const eventStore = useEventStore()

const event = ref({
  id: 'demo',
  title: '加载中...',
  host: { nickname: '', avatar: '', rating: 0 },
  type: 'beer',
  date: '', time: '',
  location: '', address: '', fee: '',
  currentPeople: 0, maxPeople: 10,
  description: '',
  tags: []
})

const drinkColors = {
  beer: 'linear-gradient(135deg, #f9ca24, #f0932b)',
  wine: 'linear-gradient(135deg, #c0392b, #8e44ad)',
  spirit: 'linear-gradient(135deg, #e67e22, #d35400)',
  cocktail: 'linear-gradient(135deg, #e056a0, #9b59b6)',
  sake: 'linear-gradient(135deg, #74b9ff, #0984e3)'
}

const drinkIcons = { beer: '🍺', wine: '🍷', spirit: '🥃', cocktail: '🍸', sake: '🍶' }

const drinkColor = computed(() => drinkColors[event.value.type] || drinkColors.beer)
const drinkIcon = computed(() => drinkIcons[event.value.type] || '🍺')

onMounted(async () => {
  // 从 mock 数据加载
  await eventStore.fetchEvents()
  const events = eventStore.events
  if (events.length > 0) event.value = events[0]
})

function handleJoin() {
  if (event.value.currentPeople >= event.value.maxPeople) return
  eventStore.joinEvent(event.value.id)
  event.value.currentPeople++
}

function share() { uni.showToast({ title: '分享成功', icon: 'success' }) }
function likeEvent() { uni.showToast({ title: '已收藏', icon: 'success' }) }
</script>

<style lang="scss" scoped>
.detail-page {
  min-height: 100vh;
  background: $bg-dark;
  padding-bottom: 140rpx;
}

.event-hero {
  text-align: center;
  padding: $spacing-xl;
  padding-top: 60rpx;
  
  .drink-type-hero {
    width: 120rpx; height: 120rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto $spacing-md;
    .hero-icon { font-size: 60rpx; }
  }
  
  .hero-title {
    font-size: $font-xxl;
    font-weight: 800;
    display: block;
  }
}

.content { padding: 0 $spacing-md; }

.host-card {
  padding: $spacing-md;
  margin-bottom: $spacing-md;
  
  .host-row {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    
    .host-avatar { width: 80rpx; height: 80rpx; border-radius: 50%; }
    .host-meta { flex: 1; 
      .host-name { font-size: $font-md; font-weight: 600; display: block; }
      .host-rating { font-size: $font-xs; color: $text-muted; }
    }
    .follow-btn {
      background: $primary;
      color: #fff;
      border: none;
      border-radius: 30rpx;
      font-size: $font-sm;
      padding: 8rpx 24rpx;
    }
  }
}

.info-card {
  padding: $spacing-md;
  margin-bottom: $spacing-md;
  
  .info-row {
    display: flex;
    gap: $spacing-sm;
    margin-bottom: $spacing-sm;
    &:last-child { margin-bottom: 0; }
    
    .info-icon { font-size: $font-md; min-width: 48rpx; }
    .info-value { font-size: $font-md; }
    .info-sub { font-size: $font-xs; color: $text-muted; display: block; }
  }
}

.desc-card {
  padding: $spacing-md;
  margin-bottom: $spacing-md;
  
  .desc-title { font-size: $font-md; font-weight: 600; display: block; margin-bottom: $spacing-sm; }
  .desc-text { font-size: $font-sm; color: $text-secondary; line-height: 1.8; }
}

.tags-card {
  display: flex;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
  flex-wrap: wrap;
  
  .tag {
    font-size: $font-sm;
    color: $primary;
    background: rgba(233,69,96,0.1);
    padding: 6rpx 20rpx;
    border-radius: 20rpx;
  }
}

.participants-card {
  padding: $spacing-md;
  
  .part-title { font-size: $font-md; font-weight: 600; display: block; margin-bottom: $spacing-md; }
  
  .part-list {
    display: flex;
    gap: $spacing-md;
    
    .part-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $spacing-xs;
      
      .part-avatar { width: 72rpx; height: 72rpx; border-radius: 50%; }
      .part-name { font-size: $font-xs; color: $text-muted; }
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: $bg-card;
  padding: $spacing-md;
  display: flex;
  align-items: center;
  gap: $spacing-md;
  border-top: 1rpx solid rgba(255,255,255,0.05);
  
  .bottom-actions {
    display: flex;
    gap: $spacing-md;
    
    .action-icon-btn {
      width: 72rpx; height: 72rpx;
      background: $bg-input;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: $font-lg;
    }
  }
  
  .join-main-btn {
    flex: 1;
    height: 88rpx;
    background: linear-gradient(135deg, $primary, $primary-light);
    color: #fff;
    border: none;
    border-radius: $radius-lg;
    font-size: $font-lg;
    font-weight: 700;
    
    &.disabled { background: $bg-input; color: $text-muted; }
  }
}
</style>
