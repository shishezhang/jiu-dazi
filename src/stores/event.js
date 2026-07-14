import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useEventStore = defineStore('event', () => {
  const events = ref([])
  const myEvents = ref([])
  const loading = ref(false)

  // Mock 酒局数据
  const mockEvents = [
    {
      id: 'e_001',
      title: '周五微醺之夜 🍺',
      host: {
        id: 'u_101',
        nickname: '啤酒达人',
        avatar: 'https://picsum.photos/200/200?random=10',
        rating: 4.9
      },
      type: 'beer',
      drinkType: '精酿啤酒',
      location: '蛇口海上世界·XX精酿酒吧',
      address: '深圳市南山区望海路1128号',
      latitude: 22.4867,
      longitude: 113.913,
      date: '2026-07-18',
      time: '19:30',
      maxPeople: 8,
      currentPeople: 5,
      fee: 'AA制 · 人均约80-120',
      description: '周末来啦！一起喝精酿聊聊人生，酒吧有20+种精酿可选，气氛超好！新人友好～',
      tags: ['精酿', '轻松', '新人友好'],
      status: 'open',
      createdAt: '2026-07-12'
    },
    {
      id: 'e_002',
      title: '威士忌品鉴局 🥃',
      host: {
        id: 'u_102',
        nickname: '威士忌老炮',
        avatar: 'https://picsum.photos/200/200?random=11',
        rating: 4.7
      },
      type: 'spirit',
      drinkType: '威士忌',
      location: '福田CBD·XX威士忌吧',
      address: '深圳市福田区福华三路88号',
      latitude: 22.538,
      longitude: 114.058,
      date: '2026-07-19',
      time: '20:00',
      maxPeople: 6,
      currentPeople: 3,
      fee: 'AA制 · 人均约200-300',
      description: '带来一支麦卡伦12年，大家一起品！每人带一支自己喜欢的威士忌来分享，以酒会友。',
      tags: ['威士忌', '品鉴', '高端'],
      status: 'open',
      createdAt: '2026-07-11'
    },
    {
      id: 'e_003',
      title: '露天烧烤+冰啤 🍖🍻',
      host: {
        id: 'u_103',
        nickname: '烧烤小王子',
        avatar: 'https://picsum.photos/200/200?random=12',
        rating: 4.6
      },
      type: 'beer',
      drinkType: '啤酒',
      location: '宝安西乡·XX天台烧烤',
      address: '深圳市宝安区西乡街道XX号',
      latitude: 22.57,
      longitude: 113.87,
      date: '2026-07-20',
      time: '18:00',
      maxPeople: 10,
      currentPeople: 7,
      fee: 'AA制 · 人均约60-100',
      description: '夏天就该撸串喝冰啤！天台烧烤，食材已备好，就差你了！酒量不限，开心最重要。',
      tags: ['烧烤', '啤酒', '户外'],
      status: 'open',
      createdAt: '2026-07-10'
    },
    {
      id: 'e_004',
      title: '日式居酒屋体验 🏮',
      host: {
        id: 'u_104',
        nickname: '深夜食堂',
        avatar: 'https://picsum.photos/200/200?random=13',
        rating: 5.0
      },
      type: 'sake',
      drinkType: '清酒',
      location: '罗湖国贸·XX居酒屋',
      address: '深圳市罗湖区人民南路2002号',
      latitude: 22.539,
      longitude: 114.118,
      date: '2026-07-21',
      time: '19:00',
      maxPeople: 4,
      currentPeople: 2,
      fee: 'AA制 · 人均约150-200',
      description: '推荐一家宝藏居酒屋，清酒种类超全！适合三四人小聚，边喝清酒边聊工作生活。',
      tags: ['日料', '清酒', '小聚'],
      status: 'open',
      createdAt: '2026-07-13'
    }
  ]

  const mockMyEvents = [
    {
      id: 'me_001',
      title: '周六南山小酌',
      date: '2026-07-18',
      time: '20:00',
      status: 'upcoming',
      role: 'host',
      currentPeople: 4,
      maxPeople: 6
    }
  ]

  function fetchEvents() {
    loading.value = true
    return new Promise((resolve) => {
      setTimeout(() => {
        events.value = [...mockEvents]
        loading.value = false
        resolve(events.value)
      }, 800)
    })
  }

  function fetchMyEvents() {
    return new Promise((resolve) => {
      setTimeout(() => {
        myEvents.value = [...mockMyEvents]
        resolve(myEvents.value)
      }, 500)
    })
  }

  function createEvent(data) {
    const newEvent = {
      id: 'e_' + Date.now(),
      ...data,
      host: {
        id: 'u_001',
        nickname: '酒中仙',
        avatar: '/static/default-avatar.png',
        rating: 4.8
      },
      currentPeople: 1,
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0]
    }
    events.value.unshift(newEvent)
    myEvents.value.unshift({
      id: 'me_' + Date.now(),
      title: data.title,
      date: data.date,
      time: data.time,
      status: 'upcoming',
      role: 'host',
      currentPeople: 1,
      maxPeople: data.maxPeople
    })
    uni.showToast({ title: '酒局创建成功！', icon: 'success' })
    return newEvent
  }

  function joinEvent(eventId) {
    const event = events.value.find(e => e.id === eventId)
    if (event && event.currentPeople < event.maxPeople) {
      event.currentPeople++
      uni.showToast({ title: '报名成功！🎉', icon: 'success' })
    } else {
      uni.showToast({ title: '人数已满', icon: 'none' })
    }
  }

  return { events, myEvents, loading, fetchEvents, fetchMyEvents, createEvent, joinEvent }
})
