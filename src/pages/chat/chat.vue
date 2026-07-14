<template>
  <view class="chat-page">
    <!-- 导航栏 -->
    <view class="chat-nav">
      <view class="nav-back" @click="goBack">‹ 返回</view>
      <text class="nav-title">{{ chatName }}</text>
      <view class="nav-action" @click="moreActions">⋯</view>
    </view>

    <!-- 消息列表 -->
    <scroll-view scroll-y class="msg-list" :scroll-into-view="scrollToId" 
                 :scroll-with-animation="true">
      <view class="msg-date-divider">
        <text>2026年7月13日</text>
      </view>
      
      <view class="msg-item" v-for="msg in messages" :key="msg.id"
            :class="{ 'msg-mine': msg.isMine }" :id="'msg-' + msg.id">
        <!-- 对方头像 -->
        <image v-if="!msg.isMine" :src="chatAvatar" class="msg-avatar" mode="aspectFill" />
        
        <view class="msg-bubble" :class="{ 'mine': msg.isMine }">
          <text class="msg-text">{{ msg.text }}</text>
        </view>
        
        <!-- 自己头像 -->
        <image v-if="msg.isMine" :src="myAvatar" class="msg-avatar" mode="aspectFill" />
      </view>
      
      <view id="msg-bottom" style="height: 20rpx;"></view>
    </scroll-view>

    <!-- 输入栏 -->
    <view class="input-bar safe-area-bottom">
      <view class="input-actions">
        <text @click="addImage">🖼️</text>
      </view>
      <view class="input-wrap">
        <input v-model="inputText" placeholder="说点什么..." placeholder-style="color:#666"
               @confirm="sendMsg" confirm-type="send" />
      </view>
      <view class="send-btn" :class="{ active: inputText.trim() }" @click="sendMsg">
        <text v-if="inputText.trim()">发送</text>
        <text v-else>😊</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const chatName = ref('')
const chatAvatar = ref('')
const myAvatar = 'https://picsum.photos/200/200?random=1'
const inputText = ref('')
const scrollToId = ref('')

const messages = ref([
  { id: 1, text: '嗨！你也喜欢喝精酿吗？🍺', isMine: false, time: '15:30' },
  { id: 2, text: '对啊！我超爱的，特别是IPA', isMine: true, time: '15:31' },
  { id: 3, text: '太好了！我知道南山有一家超棒的精酿酒吧，要不要周末一起去？', isMine: false, time: '15:32' },
  { id: 4, text: '可以可以！周末我刚好有空 👍', isMine: true, time: '15:33' },
  { id: 5, text: '那周六晚上8点？我把地址发你', isMine: false, time: '15:34' },
  { id: 6, text: '👌 OK，不见不散！', isMine: true, time: '15:35' }
])

onMounted(() => {
  const pages = getCurrentPages()
  const options = pages[pages.length - 1].$page?.options || pages[pages.length - 1].options || {}
  chatName.value = options.name || '酒友'
  chatAvatar.value = 'https://picsum.photos/200/200?random=60'
  scrollToBottom()
})

function sendMsg() {
  if (!inputText.value.trim()) return
  
  messages.value.push({
    id: Date.now(),
    text: inputText.value,
    isMine: true,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  })
  
  inputText.value = ''
  scrollToBottom()
  
  // 模拟回复
  setTimeout(() => {
    const replies = ['好的！', '哈哈', '收到～', '没错！', '约起来 🍻', '我也觉得！']
    messages.value.push({
      id: Date.now(),
      text: replies[Math.floor(Math.random() * replies.length)],
      isMine: false,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    })
    scrollToBottom()
  }, 1000 + Math.random() * 1500)
}

function scrollToBottom() {
  nextTick(() => {
    scrollToId.value = 'msg-bottom'
  })
}

function goBack() { uni.navigateBack() }
function moreActions() { uni.showToast({ title: '更多操作', icon: 'none' }) }
function addImage() { uni.showToast({ title: '发送图片（开发中）', icon: 'none' }) }
</script>

<style lang="scss" scoped>
.chat-page {
  min-height: 100vh;
  background: $bg-dark;
  display: flex;
  flex-direction: column;
}

.chat-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(var(--status-bar-height) + 10rpx) $spacing-md $spacing-sm;
  background: $bg-card;
  border-bottom: 1rpx solid rgba(255,255,255,0.05);
  
  .nav-back { font-size: $font-md; color: $primary; }
  .nav-title { font-size: $font-lg; font-weight: 600; }
  .nav-action { font-size: $font-xl; color: $text-secondary; }
}

.msg-list {
  flex: 1;
  padding: $spacing-md;
  overflow-y: auto;
}

.msg-date-divider {
  text-align: center;
  margin: $spacing-md 0;
  text { font-size: $font-xs; color: $text-muted; background: $bg-card; padding: 4rpx 16rpx; border-radius: 20rpx; }
}

.msg-item {
  display: flex;
  align-items: flex-start;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
  
  &.msg-mine { flex-direction: row-reverse; }
  
  .msg-avatar {
    width: 64rpx; height: 64rpx; border-radius: 50%;
    flex-shrink: 0;
  }
  
  .msg-bubble {
    max-width: 480rpx;
    padding: $spacing-sm $spacing-md;
    border-radius: $radius-md;
    background: $bg-card;
    
    &.mine {
      background: linear-gradient(135deg, $primary, $primary-light);
    }
    
    .msg-text { font-size: $font-md; line-height: 1.6; color: #fff; }
  }
}

.input-bar {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-md;
  background: $bg-card;
  border-top: 1rpx solid rgba(255,255,255,0.05);
  
  .input-actions {
    font-size: $font-xl;
  }
  
  .input-wrap {
    flex: 1;
    
    input {
      width: 100%;
      height: 72rpx;
      background: $bg-input;
      border-radius: 40rpx;
      padding: 0 $spacing-md;
      font-size: $font-md;
      color: $text-primary;
    }
  }
  
  .send-btn {
    padding: 10rpx 24rpx;
    background: $bg-input;
    border-radius: 30rpx;
    font-size: $font-sm;
    color: $text-muted;
    
    &.active { background: $primary; color: #fff; }
  }
}
</style>
