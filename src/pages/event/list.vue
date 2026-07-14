<template>
  <view class="event-list-page">
    <view class="page-header">
      <text class="header-title">📍 附近酒局</text>
      <text class="header-sub">找到离你最近的酒局</text>
    </view>

    <scroll-view scroll-y class="event-scroll">
      <view class="event-card card-glass" v-for="event in events" :key="event.id"
            @click="goDetail(event.id)">
        <view class="ec-top">
          <view class="ec-type-badge">{{ event.drinkType }}</view>
          <text class="ec-distance">{{ event.distance || '1.5km' }}</text>
        </view>
        <text class="ec-title">{{ event.title }}</text>
        <view class="ec-info">
          <text>📅 {{ event.date }} {{ event.time }}</text>
        </view>
        <view class="ec-info">
          <text>📍 {{ event.location }}</text>
        </view>
        <view class="ec-footer">
          <view class="ec-host">
            <image :src="event.host.avatar" class="ec-host-avatar" mode="aspectFill" />
            <text>{{ event.host.nickname }}</text>
          </view>
          <text class="ec-people">{{ event.currentPeople }}/{{ event.maxPeople }}人</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useEventStore } from '@/stores/event'

const eventStore = useEventStore()
const events = ref([])

onMounted(async () => {
  await eventStore.fetchEvents()
  events.value = eventStore.events
})

function goDetail(id) {
  uni.navigateTo({ url: `/pages/event/detail?id=${id}` })
}
</script>

<style lang="scss" scoped>
.event-list-page {
  min-height: 100vh;
  background: $bg-dark;
}

.page-header {
  padding: $spacing-lg $spacing-md $spacing-md;
  .header-title { font-size: $font-xxl; font-weight: 800; display: block; }
  .header-sub { font-size: $font-sm; color: $text-muted; margin-top: $spacing-xs; display: block; }
}

.event-scroll {
  height: calc(100vh - 160rpx);
  padding: 0 $spacing-md;
}

.event-card {
  padding: $spacing-md;
  margin-bottom: $spacing-md;
  
  .ec-top { display: flex; justify-content: space-between; margin-bottom: $spacing-sm; }
  .ec-type-badge { background: $primary; color: #fff; font-size: $font-xs; padding: 4rpx 16rpx; border-radius: 12rpx; }
  .ec-distance { font-size: $font-xs; color: $text-muted; }
  
  .ec-title { font-size: $font-lg; font-weight: 700; display: block; margin-bottom: $spacing-sm; }
  
  .ec-info { font-size: $font-sm; color: $text-secondary; margin-bottom: 4rpx; }
  
  .ec-footer {
    display: flex; justify-content: space-between; align-items: center;
    margin-top: $spacing-sm; padding-top: $spacing-sm; border-top: 1rpx solid rgba(255,255,255,0.05);
    
    .ec-host { display: flex; align-items: center; gap: $spacing-xs; font-size: $font-sm; color: $text-secondary; }
    .ec-host-avatar { width: 40rpx; height: 40rpx; border-radius: 50%; }
    .ec-people { font-size: $font-sm; color: $primary; font-weight: 600; }
  }
}
</style>
