<template>
  <view class="article-page">
    <view class="article-nav">
      <view class="nav-left" @tap="goBack">
        <text class="nav-left-icon">‹</text>
      </view>
      <text class="nav-title">资讯详情</text>
      <view class="nav-right">
        <view
          class="nav-icon-btn"
          :class="{ active: article?.isCollected }"
          @tap="article && store.toggleCollect(article.id)"
        >
          <text class="nav-icon-text">{{ article?.isCollected ? '藏' : '收' }}</text>
        </view>
        <view class="nav-icon-btn" @tap="onShare">
          <text class="nav-icon-text">分享</text>
        </view>
      </view>
    </view>

    <view v-if="article" class="article-main">
      <scroll-view scroll-y class="article-scroll">
        <view class="article-inner">
          <view class="headline-card">
            <view class="headline-tags">
              <view class="tag-chip domain-chip" :style="{ color: domainInfo.color, background: domainInfo.bg }">
                <text>{{ domainInfo.label }}</text>
              </view>
              <view class="tag-chip" :style="{ color: sentimentInfo.color, background: sentimentInfo.bg }">
                <text>{{ sentimentInfo.label }}</text>
              </view>
              <view v-if="article.isAiTranslated" class="tag-chip plain-chip ai-chip">
                <text>AI 译文</text>
              </view>
              <view v-if="article.radarWords[0]" class="tag-chip plain-chip radar-chip">
                <text>{{ article.radarWords[0] }}</text>
              </view>
            </view>

            <text class="article-title">{{ article.title }}</text>

            <view class="meta-row">
              <text class="meta-text">{{ article.source }}</text>
              <text class="meta-dot">·</text>
              <text class="meta-text">{{ article.publishTime }}</text>
              <view class="score-chip" :style="{ color: scoreColor, background: `${scoreColor}14` }">
                <text>AI {{ article.aiScore }}</text>
              </view>
            </view>

            <view class="summary-box">
              <text class="summary-label">导读</text>
              <text class="summary-text">{{ article.aiSummary }}</text>
            </view>
          </view>

          <view class="tab-bar">
            <view
              v-for="(tab, i) in TABS"
              :key="tab"
              class="tab-item"
              :class="{ active: activeTab === i }"
              @tap="activeTab = i"
            >
              <text>{{ tab }}</text>
            </view>
          </view>

          <view v-if="activeTab === 0" class="tab-panel">
            <view class="section-card section-hero">
              <view class="section-head">
                <text class="section-title">AI 解读</text>
                <text class="section-sub">先用更短时间看清这条资讯的重要性</text>
              </view>
              <text class="section-body">{{ article.aiSummary }}</text>
            </view>

            <view class="section-card">
              <view class="section-head compact">
                <text class="section-title">核心要点</text>
              </view>
              <view
                v-for="(pt, i) in article.aiKeyPoints"
                :key="i"
                class="point-row"
              >
                <view class="point-index">
                  <text>{{ i + 1 }}</text>
                </view>
                <text class="point-text">{{ pt }}</text>
              </view>
            </view>

            <view v-if="article.tags.length > 0" class="section-card">
              <view class="section-head compact">
                <text class="section-title">相关标签</text>
              </view>
              <view class="tag-list-wrap">
                <view v-for="tag in article.tags" :key="tag" class="minor-tag">
                  <text>{{ tag }}</text>
                </view>
              </view>
            </view>

            <view class="section-card">
              <view class="section-head">
                <text class="section-title">你可能想继续问</text>
                <text class="section-sub">点一下即可直接向 AI 追问</text>
              </view>
              <view
                v-for="q in article.aiQuestions"
                :key="q"
                class="ask-row"
                @tap="openAiDrawer(q)"
              >
                <text class="ask-row-text">{{ q }}</text>
                <text class="ask-row-arrow">›</text>
              </view>
            </view>
          </view>

          <view v-if="activeTab === 1" class="tab-panel">
            <view class="section-card reading-card">
              <view class="section-head compact">
                <text class="section-title">原文内容</text>
              </view>
              <text class="article-content">{{ article.content }}</text>
            </view>
          </view>

          <view v-if="activeTab === 2" class="tab-panel">
            <view v-if="article.contentEn" class="bilingual-stack">
              <view class="section-card bilingual-card">
                <text class="lang-label">中文</text>
                <text class="article-content">{{ article.content }}</text>
              </view>
              <view class="section-card bilingual-card">
                <text class="lang-label english">English</text>
                <text class="article-content">{{ article.contentEn }}</text>
              </view>
            </view>
            <view v-else class="section-card empty-card">
              <text class="empty-title">暂无双语内容</text>
              <text class="empty-desc">当前文章还没有英文对照版本，你可以先查看 AI 解读或原文内容。</text>
            </view>
          </view>

          <view class="article-bottom-gap" />
        </view>
      </scroll-view>

      <view class="bottom-action-bar">
        <view
          class="bottom-action-btn"
          :class="{ active: article.isLiked }"
          @tap="store.toggleLike(article.id)"
        >
          <text class="bottom-action-icon">赞</text>
          <text class="bottom-action-text">{{ article.likeCount }}</text>
        </view>
        <view
          class="bottom-action-btn"
          :class="{ active: article.isCollected }"
          @tap="store.toggleCollect(article.id)"
        >
          <text class="bottom-action-icon">藏</text>
          <text class="bottom-action-text">{{ article.isCollected ? '已收藏' : '收藏' }}</text>
        </view>
        <view class="bottom-action-btn" @tap="onShare">
          <text class="bottom-action-icon">发</text>
          <text class="bottom-action-text">分享</text>
        </view>
        <view class="ask-ai-btn" @tap="openAiDrawer('')">
          <text class="ask-ai-btn-text">问 AI</text>
        </view>
      </view>
    </view>

    <view v-else class="empty-page">
      <text class="empty-page-title">文章不存在</text>
      <text class="empty-page-desc">当前没有可展示的资讯内容，请返回上一页重新选择。</text>
      <view class="empty-page-btn" @tap="goBack">
        <text>返回</text>
      </view>
    </view>

    <view v-if="aiDrawerOpen" class="drawer-mask" @tap="aiDrawerOpen = false">
      <view class="ai-drawer" @tap.stop>
        <view class="drawer-handle" />
        <view class="drawer-inner">
          <view class="drawer-header">
            <view class="drawer-title-block">
              <view class="drawer-badge">
                <text class="drawer-badge-text">AI</text>
              </view>
              <view class="drawer-title-copy">
                <text class="drawer-title">向 AI 提问</text>
                <text class="drawer-subtitle">基于当前文章内容回答</text>
              </view>
            </view>
            <view class="drawer-close" @tap="aiDrawerOpen = false">
              <text>×</text>
            </view>
          </view>

          <view v-if="currentQuestion" class="current-question-box">
            <text class="current-question-label">当前问题</text>
            <text class="current-question-text">{{ currentQuestion }}</text>
          </view>

          <view class="answer-panel">
            <view v-if="isAiLoading" class="answer-state">
              <text class="answer-state-text">AI 正在思考中…</text>
            </view>
            <view v-else-if="aiAnswer" class="answer-result">
              <text class="answer-result-text">{{ aiAnswer }}</text>
            </view>
            <view v-else class="answer-state">
              <text class="answer-state-text">选择下方问题，或输入你想继续追问的内容。</text>
            </view>
          </view>

          <view class="preset-area">
            <text class="preset-title">相关问题</text>
            <view
              v-for="q in article?.aiQuestions ?? []"
              :key="q"
              class="preset-btn"
              @tap="askQuestion(q)"
            >
              <text class="preset-btn-text">{{ q }}</text>
            </view>
          </view>

          <view class="drawer-input-row">
            <input
              v-model="inputQuestion"
              class="drawer-input"
              placeholder="输入你的问题"
              :adjust-position="true"
              @confirm="askQuestion(inputQuestion)"
            />
            <view class="drawer-send-btn" @tap="askQuestion(inputQuestion)">
              <text class="drawer-send-btn-text">发送</text>
            </view>
          </view>
          <view class="drawer-safe-gap" />
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
  tech: { label: '科技', color: '#1677FF', bg: '#EAF3FF' },
  finance: { label: '财经', color: '#D97706', bg: '#FFF5E8' },
  policy: { label: '政策', color: '#16A34A', bg: '#ECFDF3' },
  commerce: { label: '商情', color: '#BE185D', bg: '#FFF0F6' },
}

const SENTIMENT_MAP: Record<string, { label: string; color: string; bg: string }> = {
  positive: { label: '利好', color: '#16A34A', bg: '#ECFDF3' },
  negative: { label: '利空', color: '#DC2626', bg: '#FEF2F2' },
  neutral: { label: '中性', color: '#6B7280', bg: '#F3F4F6' },
}

const store = useAppStore()
const activeTab = ref(0)
const aiDrawerOpen = ref(false)
const currentQuestion = ref('')
const aiAnswer = ref('')
const isAiLoading = ref(false)
const inputQuestion = ref('')

const article = computed(() => store.currentArticle ?? store.articles[0] ?? null)

const domainInfo = computed(() =>
  article.value ? (DOMAIN_MAP[article.value.domain] ?? { label: '其他', color: '#666', bg: '#F5F5F5' }) : { label: '', color: '', bg: '' }
)

const sentimentInfo = computed(() =>
  article.value ? (SENTIMENT_MAP[article.value.sentiment] ?? SENTIMENT_MAP.neutral) : { label: '', color: '', bg: '' }
)

const scoreColor = computed(() => {
  const s = article.value?.aiScore ?? 0
  if (s >= 88) return '#DC2626'
  if (s >= 75) return '#D97706'
  return '#16A34A'
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
  aiAnswer.value = `关于「${q}」的 AI 分析：\n\n这是一个模拟的 AI 回答。在正式版本中，AI 会结合文章内容与上下文，为你给出更聚焦的解读与建议。\n\n你可以重点继续关注：\n1. 这条资讯对行业供需和竞争格局的影响；\n2. 是否存在后续政策、产品或资本层面的连锁变化；\n3. 是否值得纳入你的雷达词长期追踪。`
}

function onShare() {
  uni.showToast({ title: '分享功能即将上线', icon: 'none' })
}
</script>

<style scoped>
.article-page {
  height: 100%;
  min-height: 0;
  background: #F4F6F8;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.article-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  padding: 14rpx 24rpx;
  background: rgba(255, 255, 255, 0.96);
  border-bottom: 1rpx solid #E5EAF0;
  flex-shrink: 0;
}

.nav-left,
.nav-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F1F5F9;
  border-radius: 18rpx;
}

.nav-left {
  width: 64rpx;
  height: 64rpx;
  flex-shrink: 0;
}

.nav-left-icon {
  font-size: 46rpx;
  font-weight: 300;
  color: #334155;
}

.nav-title {
  flex: 1;
  min-width: 0;
  text-align: center;
  font-size: 31rpx;
  font-weight: 700;
  color: #0F172A;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.nav-icon-btn {
  min-width: 64rpx;
  height: 64rpx;
  padding: 0 16rpx;
}

.nav-icon-btn.active {
  background: #FFF7ED;
}

.nav-icon-text {
  font-size: 22rpx;
  font-weight: 700;
  color: #475569;
}

.article-main {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.article-scroll {
  flex: 1;
  min-height: 0;
}

.article-inner {
  padding: 18rpx 24rpx calc(168rpx + env(safe-area-inset-bottom));
}

.headline-card,
.section-card {
  background: #FFFFFF;
  border: 1rpx solid #E5EAF0;
  border-radius: 24rpx;
}

.headline-card {
  padding: 24rpx;
}

.headline-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.tag-chip,
.score-chip,
.minor-tag {
  height: 48rpx;
  padding: 0 16rpx;
  border-radius: 999rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tag-chip text,
.score-chip text,
.minor-tag text {
  font-size: 22rpx;
  font-weight: 700;
}

.plain-chip {
  color: #475569;
  background: #F1F5F9;
}

.ai-chip {
  color: #0F766E;
  background: #ECFEFF;
}

.radar-chip {
  color: #7C3AED;
  background: #F5F3FF;
}

.article-title {
  display: block;
  margin-top: 18rpx;
  font-size: 38rpx;
  font-weight: 700;
  color: #0F172A;
  line-height: 1.45;
}

.meta-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-top: 18rpx;
}

.meta-text,
.meta-dot {
  font-size: 23rpx;
  color: #94A3B8;
}

.score-chip {
  margin-left: auto;
}

.summary-box {
  margin-top: 20rpx;
  padding: 20rpx;
  border-radius: 20rpx;
  background: #F8FAFC;
}

.summary-label {
  display: block;
  font-size: 22rpx;
  font-weight: 700;
  color: #16A34A;
}

.summary-text {
  display: block;
  margin-top: 10rpx;
  font-size: 26rpx;
  line-height: 1.8;
  color: #334155;
}

.tab-bar {
  display: flex;
  gap: 12rpx;
  margin: 18rpx 0;
}

.tab-item {
  flex: 1;
  height: 68rpx;
  border-radius: 999rpx;
  background: #EDF2F7;
  color: #64748B;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-item text {
  font-size: 25rpx;
  font-weight: 600;
}

.tab-item.active {
  background: #E8F8EE;
  color: #16A34A;
}

.tab-panel,
.bilingual-stack {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.section-card {
  padding: 24rpx;
}

.section-hero {
  background: linear-gradient(180deg, #FFFFFF 0%, #F8FBF9 100%);
}

.section-head {
  margin-bottom: 18rpx;
}

.section-head.compact {
  margin-bottom: 16rpx;
}

.section-title {
  display: block;
  font-size: 29rpx;
  font-weight: 700;
  color: #0F172A;
}

.section-sub {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #94A3B8;
  line-height: 1.6;
}

.section-body,
.article-content,
.answer-result-text {
  font-size: 28rpx;
  color: #334155;
  line-height: 1.95;
  white-space: pre-wrap;
}

.point-row {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
}

.point-row + .point-row {
  margin-top: 18rpx;
}

.point-index {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #ECFDF3;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.point-index text {
  font-size: 22rpx;
  font-weight: 700;
  color: #16A34A;
}

.point-text {
  flex: 1;
  font-size: 27rpx;
  color: #334155;
  line-height: 1.8;
}

.tag-list-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.minor-tag {
  background: #F1F5F9;
}

.minor-tag text {
  color: #475569;
}

.ask-row {
  min-height: 88rpx;
  padding: 0 22rpx;
  border-radius: 20rpx;
  background: #F8FAFC;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.ask-row + .ask-row {
  margin-top: 14rpx;
}

.ask-row-text {
  flex: 1;
  font-size: 26rpx;
  color: #334155;
  line-height: 1.6;
}

.ask-row-arrow {
  font-size: 28rpx;
  color: #CBD5E1;
}

.lang-label {
  display: block;
  margin-bottom: 14rpx;
  font-size: 23rpx;
  font-weight: 700;
  color: #16A34A;
}

.lang-label.english {
  color: #2563EB;
}

.empty-card {
  text-align: center;
}

.empty-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #334155;
}

.empty-desc {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #94A3B8;
  line-height: 1.7;
}

.article-bottom-gap {
  height: calc(132rpx + env(safe-area-inset-bottom));
}

.bottom-action-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx 24rpx calc(16rpx + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.98);
  border-top: 1rpx solid #E5EAF0;
  box-shadow: 0 -8rpx 24rpx rgba(15, 23, 42, 0.06);
  box-sizing: border-box;
}

.bottom-action-btn {
  flex: 1;
  height: 72rpx;
  border-radius: 999rpx;
  background: #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  color: #64748B;
}

.bottom-action-btn.active {
  background: #ECFDF3;
  color: #16A34A;
}

.bottom-action-icon,
.bottom-action-text {
  font-size: 23rpx;
  font-weight: 700;
}

.ask-ai-btn {
  min-width: 150rpx;
  height: 72rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
  box-shadow: 0 12rpx 24rpx rgba(34, 197, 94, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ask-ai-btn-text {
  font-size: 25rpx;
  font-weight: 700;
  color: #FFFFFF;
}

.empty-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 56rpx;
}

.empty-page-title {
  display: block;
  font-size: 34rpx;
  font-weight: 700;
  color: #334155;
}

.empty-page-desc {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #94A3B8;
  line-height: 1.7;
}

.empty-page-btn {
  margin-top: 30rpx;
  min-width: 180rpx;
  height: 76rpx;
  border-radius: 999rpx;
  background: #16A34A;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-page-btn text {
  font-size: 26rpx;
  font-weight: 700;
  color: #FFFFFF;
}

.drawer-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.38);
  z-index: 100;
  display: flex;
  align-items: flex-end;
}

.ai-drawer {
  width: 100%;
  max-height: 82vh;
  background: #FFFFFF;
  border-radius: 36rpx 36rpx 0 0;
}

.drawer-handle {
  width: 72rpx;
  height: 8rpx;
  border-radius: 999rpx;
  background: #D5DCE3;
  margin: 22rpx auto 0;
}

.drawer-inner {
  padding: 18rpx 24rpx 0;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.drawer-title-block {
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.drawer-badge {
  width: 64rpx;
  height: 64rpx;
  border-radius: 20rpx;
  background: #E8F8EE;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drawer-badge-text {
  font-size: 24rpx;
  font-weight: 800;
  color: #16A34A;
}

.drawer-title-copy {
  min-width: 0;
}

.drawer-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #0F172A;
}

.drawer-subtitle {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  color: #94A3B8;
}

.drawer-close {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drawer-close text {
  font-size: 28rpx;
  color: #64748B;
}

.current-question-box,
.answer-panel,
.preset-area {
  margin-top: 18rpx;
}

.current-question-box {
  padding: 20rpx;
  border-radius: 20rpx;
  background: #F8FAFC;
}

.current-question-label {
  display: block;
  margin-bottom: 10rpx;
  font-size: 22rpx;
  font-weight: 700;
  color: #16A34A;
}

.current-question-text {
  display: block;
  font-size: 26rpx;
  color: #334155;
  line-height: 1.7;
}

.answer-panel {
  min-height: 180rpx;
  padding: 22rpx;
  border-radius: 20rpx;
  background: #F8FAFC;
}

.answer-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 136rpx;
}

.answer-state-text {
  font-size: 25rpx;
  color: #94A3B8;
  line-height: 1.7;
}

.preset-title {
  display: block;
  margin-bottom: 14rpx;
  font-size: 24rpx;
  font-weight: 700;
  color: #334155;
}

.preset-btn {
  min-height: 72rpx;
  padding: 18rpx 20rpx;
  border-radius: 18rpx;
  background: #F1F5F9;
}

.preset-btn + .preset-btn {
  margin-top: 12rpx;
}

.preset-btn-text {
  font-size: 25rpx;
  color: #334155;
  line-height: 1.6;
}

.drawer-input-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-top: 18rpx;
}

.drawer-input {
  flex: 1;
  height: 76rpx;
  padding: 0 24rpx;
  border-radius: 999rpx;
  background: #F8FAFC;
  font-size: 26rpx;
  color: #111827;
}

.drawer-send-btn {
  min-width: 112rpx;
  height: 76rpx;
  border-radius: 999rpx;
  background: #16A34A;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drawer-send-btn-text {
  font-size: 25rpx;
  font-weight: 700;
  color: #FFFFFF;
}

.drawer-safe-gap {
  height: 28rpx;
}
</style>
