// 模拟 API 请求
const BASE_URL = 'https://api.jiudazi.com'

const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// 通用请求函数
async function request(url, options = {}) {
  await mockDelay()
  
  const token = uni.getStorageSync('token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  }

  // 这里在实际项目中替换为真实 API 调用
  // const res = await uni.request({
  //   url: BASE_URL + url,
  //   method: options.method || 'GET',
  //   data: options.data,
  //   header: headers
  // })
  // return res.data

  return { code: 0, message: 'success', data: null }
}

// 用户相关
export const userApi = {
  login: (data) => request('/user/login', { method: 'POST', data }),
  updateProfile: (data) => request('/user/profile', { method: 'PUT', data }),
  getUserInfo: () => request('/user/info')
}

// 酒局相关
export const eventApi = {
  getList: (params) => request('/events', { method: 'GET', data: params }),
  getDetail: (id) => request(`/events/${id}`),
  create: (data) => request('/events', { method: 'POST', data }),
  join: (id) => request(`/events/${id}/join`, { method: 'POST' }),
  cancel: (id) => request(`/events/${id}/cancel`, { method: 'POST' })
}

// 匹配相关
export const matchApi = {
  getRecommend: (params) => request('/match/recommend', { method: 'GET', data: params }),
  like: (userId) => request('/match/like', { method: 'POST', data: { userId } }),
  dislike: (userId) => request('/match/dislike', { method: 'POST', data: { userId } })
}

// 聊天相关
export const chatApi = {
  getConversations: () => request('/chat/conversations'),
  getMessages: (conversationId) => request(`/chat/${conversationId}/messages`),
  sendMessage: (conversationId, content) => request(`/chat/${conversationId}`, { method: 'POST', data: { content } })
}

export default { userApi, eventApi, matchApi, chatApi }
