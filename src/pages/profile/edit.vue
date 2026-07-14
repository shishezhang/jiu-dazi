<template>
  <view class="edit-page">
    <!-- 头像 -->
    <view class="avatar-section">
      <image :src="form.avatar" class="edit-avatar" mode="aspectFill" @click="pickAvatar" />
      <text class="change-tip">点击更换头像</text>
    </view>

    <!-- 基础信息 -->
    <view class="form-section">
      <view class="form-item">
        <text class="fi-label">昵称</text>
        <input class="fi-input" v-model="form.nickname" placeholder="你的昵称" placeholder-style="color:#555" />
      </view>
      <view class="form-item">
        <text class="fi-label">性别</text>
        <view class="gender-selector">
          <text class="gender-opt" :class="{ active: form.gender === 1 }" @click="form.gender = 1">♂ 男</text>
          <text class="gender-opt" :class="{ active: form.gender === 2 }" @click="form.gender = 2">♀ 女</text>
        </view>
      </view>
      <view class="form-item">
        <text class="fi-label">年龄</text>
        <picker mode="selector" :range="ageRange" @change="onAgeChange">
          <view class="fi-picker">{{ form.age }} 岁</view>
        </picker>
      </view>
      <view class="form-item">
        <text class="fi-label">城市</text>
        <input class="fi-input" v-model="form.city" placeholder="所在城市" placeholder-style="color:#555" />
      </view>
      <view class="form-item">
        <text class="fi-label">职业</text>
        <input class="fi-input" v-model="form.occupation" placeholder="你的职业" placeholder-style="color:#555" />
      </view>
      <view class="form-item">
        <text class="fi-label">个人简介</text>
        <textarea class="fi-textarea" v-model="form.bio" placeholder="介绍一下你的饮酒风格和爱好..." 
                  placeholder-style="color:#555" maxlength="200" />
      </view>
    </view>

    <!-- 饮酒偏好 -->
    <view class="form-section">
      <text class="section-label">🍻 饮酒偏好</text>
      
      <view class="form-item">
        <text class="fi-label">最爱的酒类</text>
        <view class="drink-prefs">
          <text class="dp-opt" v-for="d in drinkOptions" :key="d"
                :class="{ active: form.drinkPrefs.includes(d) }"
                @click="toggleDrink(d)">{{ d }}</text>
        </view>
      </view>
      
      <view class="form-item">
        <text class="fi-label">酒量等级</text>
        <view class="level-picker">
          <text v-for="n in 5" :key="n" 
                :class="{ filled: n <= form.drinkLevel }"
                @click="form.drinkLevel = n">🍺</text>
        </view>
      </view>
    </view>

    <!-- 个性标签 -->
    <view class="form-section">
      <text class="section-label">🏷️ 个性标签（最多5个）</text>
      <view class="tag-grid">
        <text class="tag-opt" v-for="t in tagOptions" :key="t"
              :class="{ active: form.tags.includes(t) }"
              @click="toggleTag(t)">{{ t }}</text>
      </view>
    </view>

    <!-- 保存 -->
    <view class="save-bar safe-area-bottom">
      <button class="save-btn" @click="handleSave">💾 保存</button>
    </view>
  </view>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const ageRange = Array.from({ length: 50 }, (_, i) => i + 18)

const form = reactive({
  avatar: '/static/default-avatar.png',
  nickname: '',
  gender: 1,
  age: 25,
  city: '',
  occupation: '',
  bio: '',
  drinkPrefs: [],
  drinkLevel: 3,
  tags: []
})

const drinkOptions = ['啤酒', '精酿', '红酒', '威士忌', '白酒', '鸡尾酒', '清酒', '香槟', '梅酒', '黄酒']
const tagOptions = ['夜猫子', '烧烤达人', 'K歌之王', '探店达人', '旅行控', '摄影', '健身', '电影', '动漫', '美食家', '猫奴', '铲屎官', '程序员', '设计师', '创业者']

onMounted(() => {
  if (userStore.userInfo) {
    Object.assign(form, JSON.parse(JSON.stringify(userStore.userInfo)))
  }
})

function pickAvatar() {
  uni.chooseImage({
    count: 1,
    success: (res) => { form.avatar = res.tempFilePaths[0] }
  })
}

function onAgeChange(e) { form.age = ageRange[e.detail.value] }

function toggleDrink(d) {
  const idx = form.drinkPrefs.indexOf(d)
  if (idx > -1) form.drinkPrefs.splice(idx, 1)
  else form.drinkPrefs.push(d)
}

function toggleTag(t) {
  const idx = form.tags.indexOf(t)
  if (idx > -1) form.tags.splice(idx, 1)
  else if (form.tags.length < 5) form.tags.push(t)
  else uni.showToast({ title: '最多选5个', icon: 'none' })
}

function handleSave() {
  userStore.updateProfile({ ...form })
  setTimeout(() => uni.navigateBack(), 500)
}
</script>

<style lang="scss" scoped>
.edit-page {
  min-height: 100vh;
  background: $bg-dark;
  padding-bottom: 120rpx;
}

.avatar-section {
  text-align: center;
  padding: $spacing-xl 0;
  
  .edit-avatar {
    width: 160rpx; height: 160rpx;
    border-radius: 50%;
    border: 4rpx solid $primary;
  }
  .change-tip { font-size: $font-xs; color: $text-muted; margin-top: $spacing-sm; display: block; }
}

.form-section {
  margin: 0 $spacing-md $spacing-lg;
  padding: $spacing-md;
  background: $bg-card;
  border-radius: $radius-md;
  
  .section-label { font-size: $font-md; font-weight: 600; display: block; margin-bottom: $spacing-md; }
}

.form-item {
  margin-bottom: $spacing-md;
  &:last-child { margin-bottom: 0; }
  
  .fi-label {
    font-size: $font-sm; color: $text-muted; display: block; margin-bottom: 8rpx;
  }
  
  .fi-input {
    width: 100%; height: 72rpx;
    background: $bg-input; border-radius: $radius-sm;
    padding: 0 $spacing-md; font-size: $font-md; color: $text-primary;
  }
  
  .fi-textarea {
    width: 100%; height: 140rpx;
    background: $bg-input; border-radius: $radius-sm;
    padding: $spacing-sm $spacing-md; font-size: $font-md; color: $text-primary;
  }
  
  .fi-picker {
    height: 72rpx; background: $bg-input; border-radius: $radius-sm;
    padding: 0 $spacing-md; display: flex; align-items: center;
    font-size: $font-md; color: $text-primary;
  }
}

.gender-selector {
  display: flex; gap: $spacing-md;
  .gender-opt {
    flex: 1; height: 72rpx;
    background: $bg-input; border-radius: $radius-sm;
    display: flex; align-items: center; justify-content: center;
    font-size: $font-md; color: $text-secondary;
    &.active { background: $primary; color: #fff; }
  }
}

.drink-prefs {
  display: flex; flex-wrap: wrap; gap: $spacing-sm;
  .dp-opt {
    padding: $spacing-xs $spacing-md;
    background: $bg-input; border-radius: 30rpx;
    font-size: $font-sm; color: $text-secondary;
    &.active { background: $primary; color: #fff; }
  }
}

.level-picker {
  display: flex; gap: $spacing-sm;
  text { font-size: 44rpx; opacity: 0.3; &.filled { opacity: 1; } }
}

.tag-grid {
  display: flex; flex-wrap: wrap; gap: $spacing-sm;
  .tag-opt {
    padding: $spacing-xs $spacing-md;
    background: $bg-input; border-radius: 30rpx;
    font-size: $font-sm; color: $text-secondary;
    &.active { background: $primary; color: #fff; }
  }
}

.save-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  padding: $spacing-md; background: $bg-dark;
  
  .save-btn {
    width: 100%; height: 96rpx;
    background: linear-gradient(135deg, $primary, $primary-light);
    color: #fff; border: none; border-radius: $radius-lg;
    font-size: $font-lg; font-weight: 700;
    box-shadow: 0 8rpx 24rpx rgba(233,69,96,0.3);
  }
}
</style>
