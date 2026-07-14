<template>
  <view class="match-page">
    <!-- 顶部：匹配模式提示 -->
    <view class="match-header">
      <text class="match-title">找到你的酒搭子</text>
      <text class="match-subtitle">左滑跳过，右滑约酒！</text>
    </view>

    <!-- 卡片堆叠区域 -->
    <view class="card-stack" v-if="currentUser">
      <view class="match-card" 
            :class="{ 'swiping-left': swiping === 'left', 'swiping-right': swiping === 'right' }"
            @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd"
            :style="cardStyle">
        <!-- 用户照片 -->
        <swiper class="photo-swiper" indicator-dots autoplay circular>
          <swiper-item v-for="(photo, i) in currentUser.photos" :key="i">
            <image :src="photo" class="user-photo" mode="aspectFill" />
          </swiper-item>
        </swiper>

        <!-- 用户信息层 -->
        <view class="user-info-layer">
          <view class="user-basic">
            <text class="user-name">{{ currentUser.nickname }}</text>
            <text class="user-age">{{ currentUser.age }}</text>
            <view class="verified-badge" v-if="currentUser.verified">✓ 已认证</view>
          </view>
          
          <text class="user-bio">{{ currentUser.bio }}</text>

          <!-- 饮酒偏好 -->
          <view class="user-preferences">
            <view class="pref-item">
              <text class="pref-label">🍺 最爱</text>
              <view class="pref-tags">
                <text class="pref-tag" v-for="d in currentUser.drinkPrefs" :key="d">{{ d }}</text>
              </view>
            </view>
            <view class="pref-item">
              <text class="pref-label">🍷 酒量</text>
              <view class="pref-level">
                <text v-for="n in 5" :key="n" :class="{ filled: n <= currentUser.drinkLevel }">🍺</text>
              </view>
            </view>
            <view class="pref-item">
              <text class="pref-label">📍 距离</text>
              <text class="pref-value">{{ currentUser.distance }}</text>
            </view>
          </view>

          <!-- 标签 -->
          <view class="user-tags">
            <text class="tag" v-for="tag in currentUser.tags" :key="tag">{{ tag }}</text>
          </view>
        </view>

        <!-- 滑动提示覆盖层 -->
        <view class="swipe-overlay like-overlay" v-if="swiping === 'right'">
          <text class="overlay-text">🍻 约酒！</text>
        </view>
        <view class="swipe-overlay nope-overlay" v-if="swiping === 'left'">
          <text class="overlay-text">👋 下一个</text>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-state" v-if="users.length === 0">
        <text class="empty-emoji">🍻</text>
        <text class="empty-text">今天的搭子都刷完啦～</text>
        <text class="empty-sub">明天再来看看吧！</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <view class="action-btn skip-btn" @click="swipeLeft">
        <text class="action-icon">👈</text>
      </view>
      <view class="action-btn super-btn" @click="superLike">
        <text class="action-icon">⚡</text>
        <text class="action-label">Super</text>
      </view>
      <view class="action-btn like-btn" @click="swipeRight">
        <text class="action-icon">👉</text>
      </view>
    </view>

    <!-- 匹配成功弹窗 -->
    <u-popup :show="showMatch" mode="center" round="24">
      <view class="match-popup">
        <view class="match-anim">
          <text class="match-emoji">🎉</text>
          <text class="match-title-pop">匹配成功！</text>
        </view>
        <view class="match-users">
          <image :src="myAvatar" class="match-avatar" mode="aspectFill" />
          <text class="match-heart">❤️</text>
          <image :src="matchedUser?.avatar" class="match-avatar" mode="aspectFill" />
        </view>
        <text class="match-desc">你们都喜欢{{ matchedUser?.drinkPrefs?.[0] || '喝酒' }}，快去聊聊吧！</text>
        <view class="match-actions">
          <button class="chat-btn" @click="goChat">💬 去聊天</button>
          <button class="continue-btn" @click="showMatch = false">继续匹配</button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const users = ref([
  { id: 'm1', nickname: '居酒屋小王子', age: 27, bio: '周末最爱做的事情就是找一家有格调的酒吧坐坐，聊聊天。清酒和威士忌是最爱。', photos: ['https://picsum.photos/600/800?random=40', 'https://picsum.photos/600/800?random=41'], drinkPrefs: ['清酒', '威士忌'], drinkLevel: 4, distance: '1.5km', tags: ['日料', '威士忌', '摄影'], verified: true },
  { id: 'm2', nickname: '啤酒小辣椒', age: 24, bio: '啤酒配烧烤，快乐没烦恼！寻一起撸串喝啤酒的搭子，最好是南山附近的～', photos: ['https://picsum.photos/600/800?random=42', 'https://picsum.photos/600/800?random=43'], drinkPrefs: ['啤酒', '精酿'], drinkLevel: 2, distance: '2.1km', tags: ['烧烤', '夜宵', 'K歌'], verified: false },
  { id: 'm3', nickname: '红酒佳人', age: 29, bio: '红酒爱好者，WSET 2级。希望找到能一起品酒聊生活的朋友，周末酒局约起！', photos: ['https://picsum.photos/600/800?random=44', 'https://picsum.photos/600/800?random=45'], drinkPrefs: ['红酒', '香槟'], drinkLevel: 3, distance: '0.8km', tags: ['红酒', '品鉴', '旅行'], verified: true },
  { id: 'm4', nickname: '鸡尾酒魔术师', age: 26, bio: '爱喝也爱调！家里有个小吧台，偶尔自己调酒，欢迎来品鉴～', photos: ['https://picsum.photos/600/800?random=46', 'https://picsum.photos/600/800?random=47'], drinkPrefs: ['鸡尾酒', '精酿'], drinkLevel: 3, distance: '3.2km', tags: ['调酒', '音乐', '派对'], verified: true },
  { id: 'm5', nickname: '白酒老司机', age: 35, bio: '白酒行业十年，懂酒更懂人。不拼酒，只品酒。', photos: ['https://picsum.photos/600/800?random=48', 'https://picsum.photos/600/800?random=49'], drinkPrefs: ['白酒', '威士忌'], drinkLevel: 5, distance: '4.5km', tags: ['白酒', '商务', '豪爽'], verified: true }
])

const currentIndex = ref(0)
const swiping = ref(null)
const showMatch = ref(false)
const matchedUser = ref(null)
const myAvatar = 'https://picsum.photos/200/200?random=1'

const currentUser = computed(() => users.value[currentIndex.value] || null)

// 手势相关
const startX = ref(0)
const startY = ref(0)
const moveX = ref(0)
const moveY = ref(0)

const cardStyle = computed(() => ({
  transform: `translateX(${moveX.value}px) translateY(${moveY.value}px) rotate(${moveX.value * 0.05}deg)`,
  transition: swiping.value ? 'none' : 'transform 0.3s ease'
}))

function onTouchStart(e) {
  startX.value = e.touches[0].clientX
  startY.value = e.touches[0].clientY
}

function onTouchMove(e) {
  moveX.value = e.touches[0].clientX - startX.value
  moveY.value = e.touches[0].clientY - startY.value
}

function onTouchEnd() {
  const threshold = 100
  if (moveX.value > threshold) {
    swipeRight()
  } else if (moveX.value < -threshold) {
    swipeLeft()
  } else {
    resetCard()
  }
}

function resetCard() {
  moveX.value = 0
  moveY.value = 0
  swiping.value = null
}

function swipeRight() {
  swiping.value = 'right'
  moveX.value = 500
  setTimeout(() => {
    // 随机匹配
    if (Math.random() > 0.5) {
      matchedUser.value = currentUser.value
      showMatch.value = true
    }
    nextCard()
  }, 300)
}

function swipeLeft() {
  swiping.value = 'left'
  moveX.value = -500
  setTimeout(() => nextCard(), 300)
}

function superLike() {
  swiping.value = 'right'
  moveX.value = 500
  setTimeout(() => {
    matchedUser.value = currentUser.value
    showMatch.value = true
    nextCard()
  }, 300)
}

function nextCard() {
  if (currentIndex.value < users.value.length - 1) {
    currentIndex.value++
  } else {
    users.value = []
  }
  resetCard()
}

function goChat() {
  showMatch.value = false
  uni.navigateTo({ url: '/pages/chat/chat?id=' + (matchedUser.value?.id || '') })
}
</script>

<style lang="scss" scoped>
.match-page {
  min-height: 100vh;
  background: $bg-dark;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: calc(var(--status-bar-height) + 40rpx) 0 0;
}

.match-header {
  text-align: center;
  margin-bottom: $spacing-lg;
  
  .match-title { font-size: $font-xl; font-weight: 700; display: block; }
  .match-subtitle { font-size: $font-sm; color: $text-muted; margin-top: 4rpx; display: block; }
}

.card-stack {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.match-card {
  width: 640rpx;
  height: 880rpx;
  border-radius: $radius-lg;
  overflow: hidden;
  background: $bg-card;
  position: relative;
  box-shadow: $shadow-lg;
  
  .photo-swiper {
    width: 100%;
    height: 520rpx;
    
    .user-photo {
      width: 100%;
      height: 100%;
    }
  }
  
  .user-info-layer {
    padding: $spacing-md;
    
    .user-basic {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      margin-bottom: $spacing-sm;
      
      .user-name { font-size: 36rpx; font-weight: 700; }
      .user-age { font-size: $font-md; color: $text-secondary; }
      .verified-badge { font-size: $font-xs; color: $success; background: rgba(46,213,115,0.1); padding: 2rpx 12rpx; border-radius: 20rpx; }
    }
    
    .user-bio {
      font-size: $font-sm;
      color: $text-secondary;
      line-height: 1.6;
      display: block;
      margin-bottom: $spacing-md;
    }
    
    .user-preferences {
      display: flex;
      gap: $spacing-md;
      margin-bottom: $spacing-md;
      
      .pref-item {
        .pref-label { font-size: $font-xs; color: $text-muted; display: block; margin-bottom: 4rpx; }
        .pref-value { font-size: $font-sm; color: $text-primary; }
        
        .pref-tags {
          display: flex;
          gap: 4rpx;
          .pref-tag { font-size: 20rpx; color: $primary; background: rgba(233,69,96,0.1); padding: 2rpx 8rpx; border-radius: 10rpx; }
        }
        
        .pref-level text { font-size: 20rpx; opacity: 0.3; &.filled { opacity: 1; } }
      }
    }
    
    .user-tags {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-xs;
      
      .tag {
        font-size: $font-xs;
        color: $text-secondary;
        background: $bg-input;
        padding: 6rpx 16rpx;
        border-radius: 20rpx;
        border: 1rpx solid rgba(255,255,255,0.08);
      }
    }
  }
  
  .swipe-overlay {
    position: absolute;
    top: 40rpx;
    padding: $spacing-sm $spacing-lg;
    border-radius: $spacing-xs;
    border-width: 4rpx;
    border-style: solid;
    transform: rotate(-15deg);
    
    &.like-overlay { right: 40rpx; border-color: $success; .overlay-text { color: $success; } }
    &.nope-overlay { left: 40rpx; border-color: $danger; transform: rotate(15deg); .overlay-text { color: $danger; } }
    
    .overlay-text { font-size: 48rpx; font-weight: 900; }
  }
}

.empty-state {
  text-align: center;
  .empty-emoji { font-size: 120rpx; display: block; }
  .empty-text { font-size: $font-lg; color: $text-secondary; display: block; margin-top: $spacing-md; }
  .empty-sub { font-size: $font-sm; color: $text-muted; margin-top: $spacing-sm; }
}

.action-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-xl;
  padding: $spacing-xl 0;
  padding-bottom: 60rpx;
  
  .action-btn {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: $shadow-md;
    transition: all 0.2s;
    
    &:active { transform: scale(0.9); }
    
    .action-icon { font-size: 48rpx; }
    .action-label { font-size: 18rpx; color: $text-muted; }
    
    &.skip-btn { background: $bg-card; border: 2rpx solid $danger; }
    &.super-btn { 
      width: 100rpx; height: 100rpx;
      background: linear-gradient(135deg, #f9ca24, #f0932b);
    }
    &.like-btn { background: linear-gradient(135deg, $primary, $primary-light); }
  }
}

.match-popup {
  background: $bg-card;
  padding: $spacing-xl $spacing-lg;
  text-align: center;
  width: 560rpx;
  
  .match-anim {
    margin-bottom: $spacing-lg;
    .match-emoji { font-size: 80rpx; display: block; }
    .match-title-pop { font-size: $font-xxl; font-weight: 900; color: $primary; display: block; margin-top: $spacing-sm; }
  }
  
  .match-users {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-md;
    margin-bottom: $spacing-lg;
    
    .match-avatar { width: 120rpx; height: 120rpx; border-radius: 50%; border: 3rpx solid $primary; }
    .match-heart { font-size: 48rpx; }
  }
  
  .match-desc {
    font-size: $font-md;
    color: $text-secondary;
    display: block;
    margin-bottom: $spacing-lg;
  }
  
  .match-actions {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    
    .chat-btn, .continue-btn {
      width: 100%;
      height: 88rpx;
      border-radius: $radius-md;
      font-size: $font-md;
      font-weight: 600;
      border: none;
    }
    .chat-btn {
      background: linear-gradient(135deg, $primary, $primary-light);
      color: #fff;
    }
    .continue-btn {
      background: $bg-input;
      color: $text-secondary;
    }
  }
}
</style>
