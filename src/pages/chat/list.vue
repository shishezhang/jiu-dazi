<template>
  <view class="chat-list-page">
    <view class="page-title">💬 消息</view>

    <scroll-view scroll-y class="conversation-list">
      <view class="conv-item" v-for="conv in conversations" :key="conv.id" 
            @click="goChat(conv)">
        <!-- 头像 -->
        <view class="conv-avatar-wrap">
          <image :src="conv.avatar" class="conv-avatar" mode="aspectFill" />
          <view class="online-dot" v-if="conv.online"></view>
        </view>
        
        <!-- 内容 -->
        <view class="conv-content">
          <view class="conv-top">
            <text class="conv-name">{{ conv.name }}</text>
            <text class="conv-time">{{ conv.time }}</text>
          </view>
          <view class="conv-bottom">
            <text class="conv-last-msg">{{ conv.lastMsg }}</text>
            <view class="unread-badge" v-if="conv.unread > 0">
              <text>{{ conv.unread > 99 ? '99+' : conv.unread }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="empty-conv" v-if="conversations.length === 0">
        <text class="empty-icon">💬</text>
        <text class="empty-text">还没有消息</text>
        <text class="empty-sub">去匹配页找搭子聊天吧！</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const conversations = ref([
  { id: 'c1', name: '威士忌老炮', avatar: 'https://picsum.photos/200/200?random=60', lastMsg: '周六的品鉴局去不去？我带一瓶麦卡伦', time: '10:30', unread: 2, online: true },
  { id: 'c2', name: '啤酒小辣椒', avatar: 'https://picsum.photos/200/200?random=61', lastMsg: '哈哈哈说得对！那周六见', time: '昨天', unread: 0, online: true },
  { id: 'c3', name: '红酒佳人', avatar: 'https://picsum.photos/200/200?random=62', lastMsg: '推荐你南山那家wine bar，超赞', time: '昨天', unread: 1, online: false },
  { id: 'c4', name: '烧烤小王子', avatar: 'https://picsum.photos/200/200?random=63', lastMsg: 'OK，晚上8点老地方见', time: '周一', unread: 0, online: false },
  { id: 'c5', name: '鸡尾酒魔术师', avatar: 'https://picsum.photos/200/200?random=64', lastMsg: '这周末我调酒，来不来品尝？', time: '周日', unread: 0, online: true }
])

function goChat(conv) {
  uni.navigateTo({ url: `/pages/chat/chat?id=${conv.id}&name=${conv.name}` })
}
</script>

<style lang="scss" scoped>
.chat-list-page {
  min-height: 100vh;
  background: $bg-dark;
}

.page-title {
  font-size: $font-xl;
  font-weight: 700;
  padding: $spacing-md;
  padding-top: 60rpx;
}

.conversation-list {
  height: calc(100vh - 120rpx);
}

.conv-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  border-bottom: 1rpx solid rgba(255,255,255,0.04);
  
  &:active { background: $bg-card-hover; }
  
  .conv-avatar-wrap {
    position: relative;
    
    .conv-avatar { width: 96rpx; height: 96rpx; border-radius: 50%; }
    .online-dot {
      width: 18rpx; height: 18rpx; background: $success; border-radius: 50%;
      position: absolute; bottom: 2rpx; right: 2rpx; border: 2rpx solid $bg-dark;
    }
  }
  
  .conv-content {
    flex: 1;
    min-width: 0;
    
    .conv-top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8rpx;
      
      .conv-name { font-size: $font-md; font-weight: 600; }
      .conv-time { font-size: $font-xs; color: $text-muted; }
    }
    
    .conv-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .conv-last-msg {
        font-size: $font-sm;
        color: $text-muted;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 400rpx;
      }
      
      .unread-badge {
        background: $primary;
        border-radius: 20rpx;
        min-width: 36rpx;
        height: 36rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        
        text { font-size: 20rpx; color: #fff; padding: 0 8rpx; }
      }
    }
  }
}

.empty-conv {
  text-align: center;
  padding-top: 200rpx;
  .empty-icon { font-size: 80rpx; display: block; }
  .empty-text { font-size: $font-lg; color: $text-secondary; display: block; margin-top: $spacing-md; }
  .empty-sub { font-size: $font-sm; color: $text-muted; margin-top: $spacing-sm; }
}
</style>
