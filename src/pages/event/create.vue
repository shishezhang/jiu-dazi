<template>
  <view class="create-page">
    <view class="form-container">
      <!-- 酒局标题 -->
      <view class="form-group">
        <text class="form-label">🍻 酒局标题</text>
        <input class="input-dark" v-model="form.title" placeholder="给你的酒局起个响亮的名字" 
               placeholder-style="color:#666" maxlength="30" />
      </view>

      <!-- 酒类选择 -->
      <view class="form-group">
        <text class="form-label">🥂 酒类</text>
        <view class="drink-type-selector">
          <view class="drink-option" v-for="d in drinkTypes" :key="d.value"
                :class="{ active: form.type === d.value }" @click="form.type = d.value">
            <text class="do-icon">{{ d.icon }}</text>
            <text class="do-name">{{ d.name }}</text>
          </view>
        </view>
      </view>

      <!-- 日期时间 -->
      <view class="form-group">
        <text class="form-label">📅 日期时间</text>
        <view class="datetime-row">
          <picker mode="date" :value="form.date" @change="onDateChange">
            <view class="picker-box">
              <text>{{ form.date || '选择日期' }}</text>
            </view>
          </picker>
          <picker mode="time" :value="form.time" @change="onTimeChange">
            <view class="picker-box">
              <text>{{ form.time || '选择时间' }}</text>
            </view>
          </picker>
        </view>
      </view>

      <!-- 地点 -->
      <view class="form-group">
        <text class="form-label">📍 地点</text>
        <input class="input-dark" v-model="form.location" placeholder="酒吧/餐厅名称" 
               placeholder-style="color:#666" />
        <input class="input-dark address-input" v-model="form.address" placeholder="详细地址" 
               placeholder-style="color:#666" />
        <button class="locate-btn" @click="chooseLocation">🗺️ 地图选点</button>
      </view>

      <!-- 人数 -->
      <view class="form-group">
        <text class="form-label">👥 人数上限</text>
        <view class="people-selector">
          <view class="people-option" v-for="n in [2,3,4,6,8,10]" :key="n"
                :class="{ active: form.maxPeople === n }" @click="form.maxPeople = n">
            {{ n }}人
          </view>
        </view>
      </view>

      <!-- 费用 -->
      <view class="form-group">
        <text class="form-label">💰 费用说明</text>
        <input class="input-dark" v-model="form.fee" placeholder="如：AA制 · 人均约100元" 
               placeholder-style="color:#666" />
      </view>

      <!-- 描述 -->
      <view class="form-group">
        <text class="form-label">📝 酒局描述</text>
        <textarea class="textarea-dark" v-model="form.description" 
                  placeholder="描述一下酒局，让大家更了解（如：氛围、特色等）"
                  placeholder-style="color:#666" maxlength="500" />
      </view>

      <!-- 标签 -->
      <view class="form-group">
        <text class="form-label">🏷️ 标签</text>
        <view class="tag-selector">
          <text class="tag-option" v-for="t in presetTags" :key="t"
                :class="{ active: form.tags.includes(t) }" 
                @click="toggleTag(t)">{{ t }}</text>
        </view>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-bar safe-area-bottom">
      <button class="submit-btn" @click="handleSubmit">🎉 发起酒局</button>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useEventStore } from '@/stores/event'

const eventStore = useEventStore()

const form = reactive({
  title: '',
  type: 'beer',
  date: '',
  time: '',
  location: '',
  address: '',
  maxPeople: 4,
  fee: 'AA制',
  description: '',
  tags: [],
  drinkType: ''
})

const drinkTypes = [
  { icon: '🍺', name: '啤酒', value: 'beer' },
  { icon: '🥃', name: '威士忌', value: 'spirit' },
  { icon: '🍷', name: '红酒', value: 'wine' },
  { icon: '🍸', name: '鸡尾酒', value: 'cocktail' },
  { icon: '🍶', name: '清酒', value: 'sake' },
  { icon: '🍾', name: '香槟', value: 'champagne' }
]

const presetTags = ['轻松', '品鉴', '新人友好', '高端', '户外', '烧烤', 'K歌', '商务', '纯喝', '小聚']

function onDateChange(e) { form.date = e.detail.value }
function onTimeChange(e) { form.time = e.detail.value }

function chooseLocation() {
  // #ifdef APP-PLUS || MP-WEIXIN
  uni.chooseLocation({
    success: (res) => {
      form.location = res.name
      form.address = res.address
      form.latitude = res.latitude
      form.longitude = res.longitude
    }
  })
  // #endif
  // #ifdef H5
  uni.showToast({ title: 'H5暂不支持地图选点', icon: 'none' })
  // #endif
}

function toggleTag(tag) {
  const idx = form.tags.indexOf(tag)
  if (idx > -1) {
    form.tags.splice(idx, 1)
  } else if (form.tags.length < 5) {
    form.tags.push(tag)
  } else {
    uni.showToast({ title: '最多选5个标签', icon: 'none' })
  }
}

function handleSubmit() {
  if (!form.title) return uni.showToast({ title: '请输入标题', icon: 'none' })
  if (!form.date) return uni.showToast({ title: '请选择日期', icon: 'none' })
  if (!form.time) return uni.showToast({ title: '请选择时间', icon: 'none' })
  if (!form.location) return uni.showToast({ title: '请填写地点', icon: 'none' })
  
  const typeObj = drinkTypes.find(d => d.value === form.type)
  form.drinkType = typeObj ? typeObj.name : '其他'
  
  eventStore.createEvent({ ...form })
  
  setTimeout(() => {
    uni.switchTab({ url: '/pages/index/index' })
  }, 500)
}
</script>

<style lang="scss" scoped>
.create-page {
  min-height: 100vh;
  background: $bg-dark;
  padding-bottom: 120rpx;
}

.form-container {
  padding: $spacing-md;
}

.form-group {
  margin-bottom: $spacing-xl;
  
  .form-label {
    font-size: $font-md;
    font-weight: 600;
    display: block;
    margin-bottom: $spacing-sm;
  }
  
  .input-dark {
    width: 100%;
    height: 80rpx;
    background: $bg-input;
    border: 1rpx solid rgba(255,255,255,0.08);
    border-radius: $radius-md;
    padding: 0 $spacing-md;
    font-size: $font-md;
    color: $text-primary;
    box-sizing: border-box;
    
    &.address-input {
      margin-top: $spacing-sm;
    }
  }
  
  .textarea-dark {
    width: 100%;
    height: 200rpx;
    background: $bg-input;
    border: 1rpx solid rgba(255,255,255,0.08);
    border-radius: $radius-md;
    padding: $spacing-md;
    font-size: $font-md;
    color: $text-primary;
    box-sizing: border-box;
  }
}

.drink-type-selector {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  
  .drink-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6rpx;
    padding: $spacing-sm $spacing-md;
    background: $bg-card;
    border-radius: $radius-md;
    border: 2rpx solid transparent;
    
    &.active { border-color: $primary; background: rgba(233,69,96,0.1); }
    
    .do-icon { font-size: 36rpx; }
    .do-name { font-size: $font-xs; color: $text-secondary; }
  }
}

.datetime-row {
  display: flex;
  gap: $spacing-sm;
  
  .picker-box {
    flex: 1;
    height: 80rpx;
    background: $bg-input;
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    padding: 0 $spacing-md;
    border: 1rpx solid rgba(255,255,255,0.08);
    
    text { color: $text-secondary; font-size: $font-md; }
  }
}

.locate-btn {
  margin-top: $spacing-sm;
  width: 100%;
  height: 80rpx;
  background: $bg-card;
  color: $primary;
  border: 1rpx dashed $primary;
  border-radius: $radius-md;
  font-size: $font-md;
}

.people-selector {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  
  .people-option {
    padding: $spacing-sm $spacing-lg;
    background: $bg-card;
    border-radius: $radius-md;
    font-size: $font-sm;
    color: $text-secondary;
    border: 2rpx solid transparent;
    
    &.active { border-color: $primary; color: $primary; background: rgba(233,69,96,0.1); }
  }
}

.tag-selector {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  
  .tag-option {
    padding: $spacing-xs $spacing-md;
    background: $bg-card;
    border-radius: 40rpx;
    font-size: $font-sm;
    color: $text-secondary;
    border: 1rpx solid transparent;
    
    &.active { border-color: $primary; color: $primary; background: rgba(233,69,96,0.1); }
  }
}

.submit-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: $spacing-md;
  background: $bg-dark;
  
  .submit-btn {
    width: 100%;
    height: 96rpx;
    background: linear-gradient(135deg, $primary, $primary-light);
    color: #fff;
    border-radius: $radius-lg;
    font-size: $font-lg;
    font-weight: 700;
    border: none;
    box-shadow: 0 8rpx 24rpx rgba(233,69,96,0.3);
  }
}
</style>
