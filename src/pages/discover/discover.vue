<template>
  <view class="discover-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input card-glass">
        <text class="search-icon">🔍</text>
        <input placeholder="搜索搭子（昵称、标签）" placeholder-style="color:#666" 
               v-model="keyword" @confirm="search" />
      </view>
    </view>

    <!-- 附近的人 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">👥 附近的酒友</text>
        <text class="section-more" @click="viewAll">更多 ›</text>
      </view>
      
      <scroll-view scroll-x class="nearby-scroll">
        <view class="nearby-list">
          <view class="nearby-card card-glass" v-for="user in nearbyUsers" :key="user.id"
                @click="goProfile(user.id)">
            <image :src="user.avatar" class="nearby-avatar" mode="aspectFill" />
            <text class="nearby-name">{{ user.nickname }}</text>
            <view class="nearby-drinks">
              <text class="drink-tag" v-for="d in user.drinkPrefs.slice(0, 2)" :key="d">{{ d }}</text>
            </view>
            <text class="nearby-dist">{{ user.distance }}</text>
            <view class="online-dot" v-if="user.online"></view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 推荐搭子 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">✨ 为你推荐</text>
        <text class="section-more" @click="refreshRecommend">换一批</text>
      </view>
      
      <view class="recommend-list">
        <view class="recommend-card card-glass fade-in-up" v-for="user in recommendUsers" :key="user.id">
          <view class="rec-header">
            <image :src="user.avatar" class="rec-avatar" mode="aspectFill" @click="goProfile(user.id)" />
            <view class="rec-info" @click="goProfile(user.id)">
              <view class="rec-name-row">
                <text class="rec-name">{{ user.nickname }}</text>
                <text class="rec-gender">{{ user.gender === 1 ? '♂' : '♀' }}</text>
                <text class="rec-age">{{ user.age }}</text>
              </view>
              <view class="rec-level">
                <text class="level-label">酒量</text>
                <view class="level-dots">
                  <text v-for="n in 5" :key="n" 
                        :class="{ active: n <= user.drinkLevel }">🍺</text>
                </view>
              </view>
            </view>
            <view class="rec-action">
              <button class="invite-btn" @click="inviteUser(user)">约酒</button>
            </view>
          </view>
          
          <text class="rec-bio">{{ user.bio }}</text>
          
          <view class="rec-tags">
            <text class="tag" v-for="tag in user.tags" :key="tag">{{ tag }}</text>
          </view>
          
          <view class="rec-footer">
            <text class="rec-city">📍 {{ user.city }} · {{ user.district }}</text>
            <text class="rec-match">匹配度 {{ user.matchRate }}%</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 热门话题 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">💬 热门话题</text>
      </view>
      <view class="topic-list">
        <view class="topic-card card-glass" v-for="topic in topics" :key="topic.id">
          <text class="topic-title">{{ topic.title }}</text>
          <text class="topic-count">{{ topic.count }} 人参与</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const keyword = ref('')

const nearbyUsers = ref([
  { id: 'n1', nickname: '威士忌控', avatar: 'https://picsum.photos/200/200?random=20', drinkPrefs: ['威士忌', '红酒'], distance: '1.2km', online: true },
  { id: 'n2', nickname: '精酿迷', avatar: 'https://picsum.photos/200/200?random=21', drinkPrefs: ['精酿', '啤酒'], distance: '2.5km', online: true },
  { id: 'n3', nickname: '酒仙女', avatar: 'https://picsum.photos/200/200?random=22', drinkPrefs: ['鸡尾酒', '红酒'], distance: '0.8km', online: true },
  { id: 'n4', nickname: '白酒老哥', avatar: 'https://picsum.photos/200/200?random=23', drinkPrefs: ['白酒', '啤酒'], distance: '3.1km', online: false },
  { id: 'n5', nickname: '日料控', avatar: 'https://picsum.photos/200/200?random=24', drinkPrefs: ['清酒', '梅酒'], distance: '1.8km', online: true }
])

const recommendUsers = ref([
  { id: 'r1', nickname: '深圳小酒仙', avatar: 'https://picsum.photos/300/300?random=30', gender: 2, age: 25, drinkLevel: 4, bio: '喜欢探索深圳每一个角落的小酒吧，精酿和鸡尾酒是最爱✨', tags: ['精酿', '探店', '摄影'], city: '深圳', district: '南山区', matchRate: 95, drinkPrefs: ['精酿', '鸡尾酒'] },
  { id: 'r2', nickname: '南山威士忌', avatar: 'https://picsum.photos/300/300?random=31', gender: 1, age: 30, drinkLevel: 5, bio: '威士忌收藏爱好者，周末必去酒吧，期待找到志同道合的酒友', tags: ['威士忌', '收藏', '雪茄'], city: '深圳', district: '南山区', matchRate: 88, drinkPrefs: ['威士忌', '白酒'] },
  { id: 'r3', nickname: '啤酒少女', avatar: 'https://picsum.photos/300/300?random=32', gender: 2, age: 23, drinkLevel: 2, bio: '刚来深圳工作，想认识一些可以一起喝酒的朋友～微醺最好', tags: ['啤酒', '夜宵', 'K歌'], city: '深圳', district: '福田区', matchRate: 82, drinkPrefs: ['啤酒', '鸡尾酒'] }
])

const topics = ref([
  { id: 't1', title: '深圳精酿酒吧地图 🗺️', count: 328 },
  { id: 't2', title: '周末微醺计划 🍷', count: 256 },
  { id: 't3', title: '你喝醉后干过最搞笑的事 🤣', count: 892 },
  { id: 't4', title: '深圳喝酒性价比推荐 💰', count: 445 }
])

function search() { uni.showToast({ title: '搜索: ' + keyword.value, icon: 'none' }) }
function viewAll() { uni.showToast({ title: '查看全部', icon: 'none' }) }
function refreshRecommend() { uni.showToast({ title: '已刷新', icon: 'success' }) }
function goProfile(id) { uni.showToast({ title: '查看用户主页', icon: 'none' }) }
function inviteUser(user) { uni.showToast({ title: `已向${user.nickname}发出约酒邀请`, icon: 'success' }) }
</script>

<style lang="scss" scoped>
.discover-page {
  min-height: 100vh;
  background: $bg-dark;
  padding-bottom: 120rpx;
}

.search-bar {
  padding: $spacing-md;
  
  .search-input {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-sm $spacing-md;
    
    .search-icon { font-size: $font-lg; }
    input {
      flex: 1;
      font-size: $font-md;
      color: $text-primary;
    }
  }
}

.section {
  padding: $spacing-md;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;
    
    .section-title { font-size: $font-lg; font-weight: 700; }
    .section-more { font-size: $font-sm; color: $primary; }
  }
}

.nearby-scroll {
  white-space: nowrap;
  
  .nearby-list {
    display: inline-flex;
    gap: $spacing-md;
  }
  
  .nearby-card {
    width: 160rpx;
    padding: $spacing-md;
    text-align: center;
    position: relative;
    display: inline-block;
    white-space: normal;
    
    .nearby-avatar {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      margin-bottom: $spacing-sm;
    }
    .nearby-name { font-size: $font-sm; font-weight: 600; display: block; }
    .nearby-drinks {
      margin: $spacing-xs 0;
      .drink-tag { font-size: 18rpx; color: $primary; background: rgba(233,69,96,0.1); padding: 2rpx 8rpx; border-radius: 10rpx; margin: 0 2rpx; }
    }
    .nearby-dist { font-size: $font-xs; color: $text-muted; }
    .online-dot {
      width: 16rpx; height: 16rpx; background: $success; border-radius: 50%;
      position: absolute; top: 30rpx; right: 30rpx; border: 2rpx solid $bg-card;
    }
  }
}

.recommend-list {
  .recommend-card {
    padding: $spacing-md;
    margin-bottom: $spacing-md;
    
    .rec-header {
      display: flex;
      align-items: center;
      gap: $spacing-md;
      margin-bottom: $spacing-sm;
      
      .rec-avatar {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        border: 2rpx solid $primary;
      }
      
      .rec-info {
        flex: 1;
        
        .rec-name-row {
          display: flex;
          align-items: center;
          gap: $spacing-xs;
          margin-bottom: 6rpx;
          
          .rec-name { font-size: $font-md; font-weight: 700; }
          .rec-gender { font-size: $font-sm; }
          .rec-age { font-size: $font-sm; color: $text-secondary; }
        }
        
        .rec-level {
          display: flex;
          align-items: center;
          gap: $spacing-xs;
          .level-label { font-size: $font-xs; color: $text-muted; }
          .level-dots text { font-size: 20rpx; opacity: 0.3; &.active { opacity: 1; } }
        }
      }
      
      .rec-action {
        .invite-btn {
          background: linear-gradient(135deg, $primary, $primary-light);
          color: #fff;
          border: none;
          border-radius: 30rpx;
          font-size: $font-sm;
          padding: 8rpx 24rpx;
        }
      }
    }
    
    .rec-bio {
      font-size: $font-sm;
      color: $text-secondary;
      line-height: 1.6;
      margin-bottom: $spacing-sm;
      display: block;
    }
    
    .rec-tags {
      display: flex;
      gap: $spacing-xs;
      margin-bottom: $spacing-sm;
      flex-wrap: wrap;
      
      .tag {
        font-size: $font-xs;
        color: $cocktail;
        background: rgba(224, 86, 160, 0.1);
        padding: 4rpx 16rpx;
        border-radius: 20rpx;
      }
    }
    
    .rec-footer {
      display: flex;
      justify-content: space-between;
      
      .rec-city { font-size: $font-xs; color: $text-muted; }
      .rec-match { font-size: $font-xs; color: $success; font-weight: 600; }
    }
  }
}

.topic-list {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  
  .topic-card {
    padding: $spacing-sm $spacing-md;
    border-radius: $radius-md;
    flex: 1;
    min-width: 45%;
    
    .topic-title { font-size: $font-sm; display: block; margin-bottom: 4rpx; }
    .topic-count { font-size: $font-xs; color: $text-muted; }
  }
}
</style>
