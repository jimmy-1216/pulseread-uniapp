import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Article, Preference, UserInfo } from '../data/types'
import { MOCK_ARTICLES } from '../data/constants'

const DEFAULT_USER: UserInfo = {
  id: 'demo-user',
  nickname: '微澜用户',
  avatar: '',
  memberLevel: 'free',
  readCount: 128,
  collectCount: 23,
  radarWords: ['GPT-5', 'OpenAI', 'A股'],
}

const DEFAULT_PREFERENCE: Preference = {
  domains: ['tech', 'finance'],
  noiseLevel: 'focus',
  radarWords: ['GPT-5', 'OpenAI', 'A股'],
}

export const useAppStore = defineStore('app', () => {
  // 状态
  const hasOnboarded = ref<boolean>(false)
  const userInfo = ref<UserInfo>({ ...DEFAULT_USER })
  const preference = ref<Preference>({ ...DEFAULT_PREFERENCE })
  const articles = ref<Article[]>(MOCK_ARTICLES.map(a => ({ ...a })))
  const currentArticleId = ref<number | null>(null)
  const searchHistory = ref<string[]>(['OpenAI', 'A股', '新能源'])

  // 计算属性
  const currentArticle = computed(() =>
    currentArticleId.value !== null
      ? articles.value.find(a => a.id === currentArticleId.value) ?? null
      : null
  )

  // 初始化：从本地存储恢复
  function init() {
    try {
      const onboarded = uni.getStorageSync('has_onboarded')
      if (onboarded === 'true') hasOnboarded.value = true

      const prefStr = uni.getStorageSync('user_preference')
      if (prefStr) preference.value = JSON.parse(prefStr)

      const histStr = uni.getStorageSync('search_history')
      if (histStr) searchHistory.value = JSON.parse(histStr)
    } catch (e) {
      console.warn('init store error:', e)
    }
  }

  // 完成引导
  function completeOnboarding(pref: Preference) {
    preference.value = { ...pref }
    hasOnboarded.value = true
    uni.setStorageSync('has_onboarded', 'true')
    uni.setStorageSync('user_preference', JSON.stringify(pref))
  }

  // 更新偏好
  function updatePreference(pref: Partial<Preference>) {
    preference.value = { ...preference.value, ...pref }
    uni.setStorageSync('user_preference', JSON.stringify(preference.value))
  }

  // 重置引导
  function resetOnboarding() {
    hasOnboarded.value = false
    uni.removeStorageSync('has_onboarded')
  }

  // 点赞
  function toggleLike(id: number) {
    const article = articles.value.find(a => a.id === id)
    if (article) {
      article.isLiked = !article.isLiked
      article.likeCount += article.isLiked ? 1 : -1
    }
  }

  // 收藏
  function toggleCollect(id: number) {
    const article = articles.value.find(a => a.id === id)
    if (article) {
      article.isCollected = !article.isCollected
      article.collectCount += article.isCollected ? 1 : -1
    }
  }

  // 设置当前文章
  function setCurrentArticle(id: number | null) {
    currentArticleId.value = id
  }

  // 搜索历史
  function addSearchHistory(kw: string) {
    const next = [kw, ...searchHistory.value.filter(k => k !== kw)].slice(0, 10)
    searchHistory.value = next
    uni.setStorageSync('search_history', JSON.stringify(next))
  }

  function clearSearchHistory() {
    searchHistory.value = []
    uni.removeStorageSync('search_history')
  }

  // 收藏的文章
  const collectedArticles = computed(() => articles.value.filter(a => a.isCollected))

  // 点赞的文章
  const likedArticles = computed(() => articles.value.filter(a => a.isLiked))

  return {
    hasOnboarded,
    userInfo,
    preference,
    articles,
    currentArticle,
    currentArticleId,
    searchHistory,
    collectedArticles,
    likedArticles,
    init,
    completeOnboarding,
    updatePreference,
    resetOnboarding,
    toggleLike,
    toggleCollect,
    setCurrentArticle,
    addSearchHistory,
    clearSearchHistory,
  }
})
