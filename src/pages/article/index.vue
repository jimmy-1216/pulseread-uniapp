<template>
  <view class="article-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <view class="nav-back" @tap="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="nav-title">资讯详情</text>
      <view class="nav-actions">
        <view
          class="nav-action-btn"
          :style="{ color: article?.isCollected ? '#FA8C16' : '#666' }"
          @tap="article && store.toggleCollect(article.id)"
        >
          <text class="nav-action-icon">{{ article?.isCollected ? '★' : '☆' }}</text>
        </view>
        <view class="nav-action-btn" @tap="onShare">
          <text class="nav-action-icon">↗</text>
        </view>
      </view>
    </view>

    <view v-if="article">
      <!-- 内容滚动区 -->
      <scroll-view scroll-y class="content-scroll">
        <view class="content-inner">
          <!-- 标签行 -->
          <view class="tags-row">
            <view class="tag" :style="{ color: domainInfo.color, background: domainInfo.bg }">
              <text>{{ domainInfo.label }}</text>
            </view>
            <view class="tag" :style="{ color: sentimentInfo.color, background: sentimentInfo.bg }">
              <text>{{ sentimentInfo.label }}</text>
            </view>
            <view v-if="article.isAiTranslated" class="tag ai-translated-tag">
              <text>🌐 AI译</text>
            </view>
            <view v-for="rw in article.radarWords" :key="rw" class="tag radar-tag">
              <text>📡 {{ rw }}</text>
            </view>
            <view class="score-badge" :style="{ background: scoreColor }">
              <text class="score-num">{{ article.aiScore }}</text>
              <text class="score-unit">分</text>
            </view>
          </view>

          <!-- 标题 -->
          <text class="article-title">{{ article.title }}</text>

          <!-- 元信息 -->
          <view class="meta-row">
            <text class="meta-text">{{ article.source }}</text>
            <text class="meta-sep">·</text>
            <text class="meta-text">{{ article.publishTime }}</text>
          </view>

          <!-- 内容 Tab -->
          <view class="content-tabs">
            <view
              v-for="(tab, i) in TABS"
              :key="i"
              class="content-tab"
              :class="{ active: activeTab === i }"
              @tap="activeTab = i"
            >
              <text>{{ tab }}</text>
            </view>
          </view>

          <!-- Tab 内容 -->
          <!-- AI 解读 -->
          <view v-if="activeTab === 0" class="tab-content">
            <!-- AI 摘要 -->
            <view class="ai-card ai-summary-card">
              <view class="ai-card-header">
                <text class="ai-card-icon">🤖</text>
                <text class="ai-card-title ai-title-green">AI 总结</text>
              </view>
              <text class="ai-summary-text">{{ article.aiSummary }}</text>
            </view>

            <!-- AI 要点 -->
            <view class="ai-card">
              <view class="ai-card-header">
                <text class="ai-card-icon">📌</text>
                <text class="ai-card-title">核心要点</text>
              </view>
              <view
                v-for="(pt, i) in article.aiKeyPoints"
                :key="i"
                class="key-point-item"
              >
                <view class="key-point-num">
                  <text>{{ i + 1 }}</text>
                </view>
                <text class="key-point-text">{{ pt }}</text>
              </view>
            </view>

            <!-- 标签 -->
            <view v-if="article.tags.length > 0" class="ai-card">
              <view class="ai-card-header">
                <text class="ai-card-icon">🏷️</text>
                <text class="ai-card-title">相关标签</text>
              </view>
              <view class="tags-wrap">
                <view v-for="tag in article.tags" :key="tag" class="tag-chip">
                  <text>{{ tag }}</text>
                </view>
              </view>
            </view>

            <!-- AI 问题 -->
            <view class="ai-card">
              <view class="ai-card-header">
                <text class="ai-card-icon">💬</text>
                <text class="ai-card-title">你可能想问</text>
              </view>
              <view
                v-for="q in article.aiQuestions"
                :key="q"
                class="ai-question-btn"
                @tap="openAiDrawer(q)"
              >
                <text class="ai-q-text">{{ q }}</text>
                <text class="ai-q-arrow">›</text>
              </view>
            </view>
          </view>

          <!-- 原文 -->
          <view v-if="activeTab === 1" class="tab-content">
            <text class="article-content">{{ article.content }}</text>
          </view>

          <!-- 双语对照 -->
          <view v-if="activeTab === 2" class="tab-content">
            <view v-if="article.contentEn">
              <view class="bilingual-block cn-block">
                <text class="bilingual-lang">🇨🇳 中文</text>
                <text class="bilingual-text">{{ article.content }}</text>
              </view>
              <view class="bilingual-block en-block">
                <text class="bilingual-lang">🇺🇸 English</text>
                <text class="bilingual-text">{{ article.contentEn }}</text>
              </view>
            </view>
            <view v-else class="no-content">
              <text class="no-content-icon">🌐</text>
              <text class="no-content-text">暂无英文版本</text>
            </view>
          </view>

          <view class="bottom-pad" />
        </view>
      </scroll-view>

      <!-- 底部操作栏 -->
      <view class="action-bar">
        <view
          class="action-btn"
          :style="{ background: article.isLiked ? '#E8F8EE' : '#F5F5F5', color: article.isLiked ? '#1DB954' : '#666' }"
          @tap="store.toggleLike(article.id)"
        >
          <text class="action-icon">👍</text>
          <text class="action-label">{{ article.likeCount }}</text>
        </view>
        <view
          class="action-btn"
          :style="{ background: article.isCollected ? '#FFF7E6' : '#F5F5F5', color: article.isCollected ? '#FA8C16' : '#666' }"
          @tap="store.toggleCollect(article.id)"
        >
          <text class="action-icon">⭐</text>
          <text class="action-label">{{ article.isCollected ? '已收藏' : '收藏' }}</text>
        </view>
        <view class="action-btn" style="background: #F5F5F5; color: #666;" @tap="onShare">
          <text class="action-icon">↗</text>
          <text class="action-label">分享</text>
        </view>
        <view class="ai-btn" @tap="openAiDrawer('')">
          <text class="ai-btn-icon">🤖</text>
          <text class="ai-btn-label">问 AI</text>
        </view>
      </view>
    </view>

    <!-- 文章不存在 -->
    <view v-else class="no-article">
      <text class="no-article-icon">📄</text>
      <text class="no-article-text">文章不存在</text>
      <view class="no-article-btn" @tap="goBack">
        <text>返回</text>
      </view>
    </view>

    <!-- AI 问答抽屉 -->
    <view v-if="aiDrawerOpen" class="overlay" @tap="aiDrawerOpen = false">
      <view class="ai-drawer" @tap.stop>
        <view class="drawer-handle" />
        <view class="drawer-content">
          <view class="drawer-header">
            <view class="drawer-header-left">
              <view class="drawer-ai-avatar">
                <text class="drawer-ai-icon">🤖</text>
              </view>
              <view class="drawer-header-info">
                <text class="drawer-title">向 AI 提问</text>
                <text class="drawer-subtitle">基于当前文章内容回答</text>
              </view>
            </view>
            <view class="drawer-close" @tap="aiDrawerOpen = false">
              <text>✕</text>
            </view>
          </view>

          <!-- 当前问题 -->
          <view v-if="currentQuestion" class="current-question">
            <text class="current-q-label">当前问题：</text>
            <text class="current-q-text">{{ currentQuestion }}</text>
          </view>

          <!-- AI 回答 -->
          <view class="ai-answer-area">
            <view v-if="isAiLoading" class="ai-loading">
              <text class="loading-dots">AI 正在思考中</text>
            </view>
            <view v-else-if="aiAnswer" class="ai-answer">
              <text class="ai-answer-text">{{ aiAnswer }}</text>
            </view>
            <view v-else class="ai-placeholder">
              <text class="ai-placeholder-text">选择下方问题或输入你的问题</text>
            </view>
          </view>

          <!-- 预设问题 -->
          <view class="preset-questions">
            <text class="preset-title">相关问题</text>
            <view
              v-for="q in article?.aiQuestions ?? []"
              :key="q"
              class="preset-q-btn"
              @tap="askQuestion(q)"
            >
              <text class="preset-q-text">{{ q }}</text>
            </view>
          </view>

          <!-- 输入框 -->
          <view class="ai-input-row">
            <input
              v-model="inputQuestion"
              class="ai-input"
              placeholder="输入你的问题..."
              :adjust-position="true"
              @confirm="askQuestion(inputQuestion)"
            />
            <view class="ai-send-btn" @tap="askQuestion(inputQuestion)">
              <text>发送</text>
            </view>
          </view>
          <view class="drawer-bottom-pad" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '../../store/useAppStore'

const TABS = ['AI 解读', '原文', '双语对照']

const DOMAIN_MAP: Record<string, { label: string; color: string; bg: string }> = {
  tech: { label: '科技', color: '#1677FF', bg: '#E6F4FF' },
  finance: { label: '财经', color: '#FA8C16', bg: '#FFF7E6' },
  policy: { label: '政策', color: '#52C41A', bg: '#F6FFED' },
  commerce: { label: '商情', color: '#EB2F96', bg: '#FFF0F6' },
}

const SENTIMENT_MAP: Record<string, { label: string; color: string; bg: string }> = {
  positive: { label: '利好', color: '#52C41A', bg: '#F6FFED' },
  negative: { label: '利空', color: '#FF4D4F', bg: '#FFF1F0' },
  neutral: { label: '中性', color: '#8C8C8C', bg: '#F5F5F5' },
}

const store = useAppStore()
const activeTab = ref(0)
const aiDrawerOpen = ref(false)
const currentQuestion = ref('')
const aiAnswer = ref('')
const isAiLoading = ref(false)
const inputQuestion = ref('')

const article = computed(() => store.currentArticle)

const domainInfo = computed(() =>
  article.value ? (DOMAIN_MAP[article.value.domain] ?? { label: '其他', color: '#666', bg: '#F5F5F5' }) : { label: '', color: '', bg: '' }
)

const sentimentInfo = computed(() =>
  article.value ? (SENTIMENT_MAP[article.value.sentiment] ?? SENTIMENT_MAP.neutral) : { label: '', color: '', bg: '' }
)

const scoreColor = computed(() => {
  const s = article.value?.aiScore ?? 0
  if (s >= 88) return '#FF4D4F'
  if (s >= 75) return '#FA8C16'
  return '#1DB954'
})

function goBack() {
  uni.navigateBack()
}

function openAiDrawer(q: string) {
  currentQuestion.value = q
  aiAnswer.value = ''
  aiDrawerOpen.value = true
  if (q) askQuestion(q)
}

async function askQuestion(q: string) {
  if (!q.trim()) return
  currentQuestion.value = q
  inputQuestion.value = ''
  isAiLoading.value = true
  aiAnswer.value = ''
  await new Promise(r => setTimeout(r, 1200))
  isAiLoading.value = false
  aiAnswer.value = `关于「${q}」的 AI 分析：\n\n这是一个模拟的 AI 回答。在实际版本中，AI 将基于文章内容和实时数据，为您提供深度分析和专业解读。\n\n主要观点：\n1. 该事件对相关行业具有重要影响\n2. 建议关注后续政策动向\n3. 可结合雷达词追踪相关进展`
}

function onShare() {
  uni.showToast({ title: '分享功能即将上线', icon: 'none' })
}
</script>

<style scoped>
.article-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #fff;
}

/* 导航栏 */
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 32rpx 16rpx;
  background: #fff;
  border-bottom: 1rpx solid #F0F0F0;
  flex-shrink: 0;
}

.nav-back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 48rpx;
  color: #333;
  font-weight: 300;
}

.nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1A1A1A;
}

.nav-placeholder {
  width: 64rpx;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.nav-action-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-action-icon {
  font-size: 36rpx;
  color: #666;
}

/* 内容区 */
.content-scroll {
  flex: 1;
  overflow: hidden;
}

.content-inner {
  padding: 32rpx;
}

/* 标签行 */
.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 24rpx;
}

.tag {
  font-size: 22rpx;
  padding: 6rpx 18rpx;
  border-radius: 10rpx;
  font-weight: 500;
}

.radar-tag {
  color: #7C3AED;
  background: #F5F0FF;
}

/* 标题 */
.article-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #1A1A1A;
  line-height: 1.5;
  display: block;
  margin-bottom: 20rpx;
}

/* 元信息 */
.meta-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 32rpx;
  flex-wrap: wrap;
}

.meta-text {
  font-size: 24rpx;
  color: #AAAAAA;
}

.meta-sep {
  font-size: 24rpx;
  color: #CCCCCC;
}

.meta-translated {
  font-size: 24rpx;
  color: #1677FF;
}

.ai-translated-tag {
  color: #1677FF;
  background: #E6F4FF;
}

.score-badge {
  margin-left: auto;
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.score-num {
  color: #fff;
  font-size: 24rpx;
  font-weight: 700;
  line-height: 1;
}

.score-unit {
  color: #fff;
  font-size: 18rpx;
  opacity: 0.85;
  line-height: 1;
}

/* 内容 Tab */
.content-tabs {
  display: flex;
  border-bottom: 1rpx solid #F0F0F0;
  margin-bottom: 32rpx;
}

.content-tab {
  padding: 16rpx 32rpx;
  font-size: 28rpx;
  color: #888;
  border-bottom: 4rpx solid transparent;
  margin-bottom: -1rpx;
}

.content-tab.active {
  color: #1DB954;
  border-bottom-color: #1DB954;
  font-weight: 600;
}

/* AI 卡片 */
.tab-content {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.ai-card {
  background: #F9F9F9;
  border-radius: 20rpx;
  padding: 28rpx;
}

.ai-summary-card {
  background: linear-gradient(135deg, #E8F8EE 0%, #F0FDF4 100%);
  border: 1rpx solid #BBF7D0;
}

.ai-title-green {
  color: #1DB954 !important;
}

.ai-card-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.ai-card-icon {
  font-size: 32rpx;
}

.ai-card-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1A1A1A;
}

.ai-summary-text {
  font-size: 28rpx;
  color: #444;
  line-height: 1.8;
  display: block;
}

.key-point-item {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.key-point-item:last-child {
  margin-bottom: 0;
}

.key-point-num {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background: #1DB954;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.key-point-num text {
  color: #fff;
  font-size: 22rpx;
  font-weight: 700;
}

.key-point-text {
  font-size: 26rpx;
  color: #444;
  line-height: 1.6;
  flex: 1;
  display: block;
}

.tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.tag-chip {
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  background: #E8F8EE;
  font-size: 24rpx;
  color: #1DB954;
}

.ai-question-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 12rpx;
  border: 1rpx solid #E8F8EE;
}

.ai-question-btn:last-child {
  margin-bottom: 0;
}

.ai-q-text {
  font-size: 26rpx;
  color: #444;
  flex: 1;
}

.ai-q-arrow {
  font-size: 28rpx;
  color: #1DB954;
  flex-shrink: 0;
}

/* 原文 */
.article-content {
  font-size: 30rpx;
  color: #333;
  line-height: 1.9;
  white-space: pre-wrap;
  display: block;
}

/* 双语 */
.bilingual-block {
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.cn-block {
  background: #EFF6FF;
  border: 1rpx solid #DBEAFE;
}

.en-block {
  background: #F9F9F9;
  border: 1rpx solid #E5E7EB;
}

.bilingual-lang {
  font-size: 22rpx;
  font-weight: 600;
  color: #888;
  display: block;
  margin-bottom: 16rpx;
}

.bilingual-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.8;
  white-space: pre-wrap;
  display: block;
}

/* 无内容 */
.no-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0;
}

.no-content-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.no-content-text {
  font-size: 28rpx;
  color: #AAAAAA;
}

.bottom-pad {
  height: 160rpx;
}

/* 底部操作栏 */
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1rpx solid #F0F0F0;
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 24rpx calc(16rpx + env(safe-area-inset-bottom));
  flex-shrink: 0;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex: 1;
  justify-content: center;
  padding: 16rpx 0;
  border-radius: 20rpx;
}

.action-icon {
  font-size: 28rpx;
}

.action-label {
  font-size: 24rpx;
  font-weight: 500;
}

.ai-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 32rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, #1DB954, #16a34a);
  flex-shrink: 0;
}

.ai-btn-icon {
  font-size: 28rpx;
}

.ai-btn-label {
  font-size: 24rpx;
  font-weight: 600;
  color: #fff;
}

/* 无文章 */
.no-article {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx;
}

.no-article-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.no-article-text {
  font-size: 28rpx;
  color: #AAAAAA;
  margin-bottom: 40rpx;
}

.no-article-btn {
  padding: 16rpx 48rpx;
  border-radius: 40rpx;
  background: #1DB954;
  color: #fff;
  font-size: 28rpx;
}

/* AI 抽屉 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 200;
  display: flex;
  align-items: flex-end;
}

.ai-drawer {
  background: #fff;
  border-radius: 40rpx 40rpx 0 0;
  width: 100%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}

.drawer-handle {
  width: 72rpx;
  height: 8rpx;
  background: #E0E0E0;
  border-radius: 4rpx;
  margin: 24rpx auto 0;
  flex-shrink: 0;
}

.drawer-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 24rpx 32rpx 0;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
  flex-shrink: 0;
}

.drawer-header-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.drawer-ai-avatar {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #1DB954, #0ea5e9);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.drawer-ai-icon {
  font-size: 28rpx;
}

.drawer-header-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.drawer-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #1A1A1A;
}

.drawer-subtitle {
  font-size: 22rpx;
  color: #AAAAAA;
}

.drawer-close {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #888;
}

.current-question {
  background: #F0FDF4;
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
  margin-bottom: 20rpx;
  flex-shrink: 0;
}

.current-q-label {
  font-size: 22rpx;
  color: #888;
  display: block;
  margin-bottom: 8rpx;
}

.current-q-text {
  font-size: 26rpx;
  color: #1A1A1A;
  font-weight: 500;
  display: block;
}

.ai-answer-area {
  flex: 1;
  overflow: hidden;
  margin-bottom: 20rpx;
}

.ai-loading {
  padding: 40rpx;
  text-align: center;
}

.loading-dots {
  font-size: 26rpx;
  color: #888;
}

.ai-answer {
  background: #F9F9F9;
  border-radius: 16rpx;
  padding: 24rpx;
}

.ai-answer-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.8;
  white-space: pre-wrap;
  display: block;
}

.ai-placeholder {
  padding: 40rpx;
  text-align: center;
}

.ai-placeholder-text {
  font-size: 26rpx;
  color: #CCCCCC;
}

.preset-questions {
  flex-shrink: 0;
  margin-bottom: 20rpx;
}

.preset-title {
  font-size: 24rpx;
  color: #888;
  display: block;
  margin-bottom: 12rpx;
}

.preset-q-btn {
  padding: 16rpx 20rpx;
  background: #F5F5F5;
  border-radius: 16rpx;
  margin-bottom: 10rpx;
}

.preset-q-text {
  font-size: 26rpx;
  color: #444;
}

.ai-input-row {
  display: flex;
  gap: 16rpx;
  align-items: center;
  flex-shrink: 0;
}

.ai-input {
  flex: 1;
  height: 72rpx;
  background: #F5F5F5;
  border-radius: 36rpx;
  padding: 0 24rpx;
  font-size: 26rpx;
  color: #333;
}

.ai-send-btn {
  padding: 16rpx 32rpx;
  background: #1DB954;
  border-radius: 36rpx;
  font-size: 26rpx;
  color: #fff;
  font-weight: 600;
  flex-shrink: 0;
}

.drawer-bottom-pad {
  height: 40rpx;
}
</style>
