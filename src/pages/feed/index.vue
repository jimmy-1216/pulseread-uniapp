<template>
  <view class="feed-page">
    <view class="top-shell">
      <view class="nav-bar">
        <view class="brand-block">
          <view class="nav-logo-icon">
            <text class="nav-logo">澜</text>
          </view>
          <view class="brand-text">
            <text class="nav-title">微澜</text>
          </view>
        </view>
        <view class="nav-search-btn" @tap="goSearch">
          <text class="nav-search-mark">⌕</text>
          <text class="nav-search-text">搜索</text>
        </view>
      </view>

      <view class="control-panel">
        <view class="region-tabs">
          <view
            v-for="r in REGION_CONFIGS"
            :key="r.key"
            class="region-tab"
            :class="{ active: selectedRegion === r.key }"
            @tap="selectedRegion = r.key"
          >
            <text>{{ r.label }}</text>
          </view>
        </view>

        <view class="control-row">
          <scroll-view scroll-x class="domain-scroll" :show-scrollbar="false">
            <view class="domain-tab-list">
              <view
                class="domain-tab"
                :class="{ active: selectedDomain === 'all' }"
                @tap="selectedDomain = 'all'"
              >
                <text>全部</text>
              </view>
              <view
                v-for="d in subscribedDomains"
                :key="d.key"
                class="domain-tab"
                :class="{ active: selectedDomain === d.key }"
                :style="selectedDomain === d.key ? { background: d.color, color: '#FFFFFF', borderColor: d.color } : {}"
                @tap="selectedDomain = d.key"
              >
                <text>{{ d.label }}</text>
              </view>
            </view>
          </scroll-view>

          <view class="noise-entry" @tap="showNoisePicker = true">
            <text class="noise-entry-label">{{ currentNoiseLevelConfig?.label }}</text>
            <text class="noise-entry-arrow">▾</text>
          </view>
        </view>
      </view>

    </view>

    <scroll-view
      scroll-y
      class="article-list"
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
    >
      <view v-if="filteredArticles.length === 0" class="empty-state">
        <text class="empty-title">
          {{ selectedDomain !== 'all'
            ? `当前没有「${subscribedDomains.find(d => d.key === selectedDomain)?.label ?? ''}」相关内容`
            : '当前筛选下暂无资讯' }}
        </text>
        <text class="empty-desc">
          你可以调整阅读密度、切换地区，或补充更多关注领域后再回来查看。
        </text>
        <view class="empty-actions">
          <view class="empty-btn-outline" @tap="showNoisePicker = true">
            <text>调整阅读密度</text>
          </view>
          <view v-if="selectedDomain !== 'all'" class="empty-btn-primary" @tap="goPreference">
            <text>管理偏好</text>
          </view>
        </view>
      </view>

      <view v-else class="list-content">
        <view class="list-top-pad" />

        <ArticleCard
          v-for="article in filteredArticles"
          :key="article.id"
          :article="article"
          @click="openArticle"
          @like="store.toggleLike"
          @collect="store.toggleCollect"
        />

        <view class="list-footer">
          <text>已经到底了，去看看别的筛选结果吧</text>
        </view>
      </view>
    </scroll-view>

    <view v-if="showNoisePicker" class="overlay" @tap="showNoisePicker = false">
      <view class="noise-sheet" @tap.stop>
        <view class="sheet-handle" />
        <view class="sheet-content">
          <view class="sheet-header">
            <text class="sheet-title">调整阅读密度</text>
            <text class="sheet-subtitle">控制每天接收的信息量与筛选强度</text>
          </view>
          <view
            v-for="level in NOISE_LEVEL_CONFIGS"
            :key="level.key"
            class="noise-option"
            :class="{ active: store.preference.noiseLevel === level.key }"
            @tap="selectNoise(level.key)"
          >
            <view class="noise-option-main">
              <view class="noise-label-row">
                <text class="noise-opt-label">{{ level.label }}</text>
                <view v-if="level.recommended" class="rec-badge">
                  <text class="rec-text">推荐</text>
                </view>
              </view>
              <text class="noise-opt-desc">{{ level.description }}</text>
              <text class="noise-opt-count">{{ level.dailyCount }}</text>
            </view>
            <view class="noise-check-wrap">
              <view v-if="store.preference.noiseLevel === level.key" class="noise-check-dot" />
            </view>
          </view>
          <view class="sheet-bottom-pad" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '../../store/useAppStore'
import { DOMAIN_CONFIGS, NOISE_LEVEL_CONFIGS } from '../../data/constants'
import type { DomainType, NoiseLevelType } from '../../data/types'
import ArticleCard from '../../components/ArticleCard.vue'
import type { Article } from '../../data/types'

const REGION_CONFIGS = [
  { key: 'all', label: '全部' },
  { key: 'domestic', label: '国内' },
  { key: 'international', label: '国际' },
]

const store = useAppStore()
const selectedDomain = ref<DomainType | 'all'>('all')
const selectedRegion = ref<string>('all')
const showNoisePicker = ref(false)
const isRefreshing = ref(false)

const subscribedDomains = computed(() =>
  DOMAIN_CONFIGS.filter(d => store.preference.domains.includes(d.key))
)

const currentNoiseLevelConfig = computed(() =>
  NOISE_LEVEL_CONFIGS.find(n => n.key === store.preference.noiseLevel)
)

const filteredArticles = computed(() => {
  const threshold = currentNoiseLevelConfig.value?.scoreThreshold ?? 0
  return store.articles.filter(a => {
    if (selectedDomain.value !== 'all' && a.domain !== selectedDomain.value) return false
    if (!store.preference.domains.includes(a.domain)) return false
    if (selectedRegion.value !== 'all' && a.region !== selectedRegion.value) return false
    if (a.aiScore < threshold) return false
    return true
  })
})

function openArticle(article: Article) {
  store.setCurrentArticle(article.id)
  uni.navigateTo({ url: '/pages/article/index' })
}

function goPreference() {
  uni.switchTab({ url: '/pages/preference/index' })
}

function goSearch() {
  uni.switchTab({ url: '/pages/search/index' })
}

function selectNoise(key: NoiseLevelType) {
  store.updatePreference({ noiseLevel: key })
  showNoisePicker.value = false
}

function loadMore() {
  // Mock：无更多数据
}

async function onRefresh() {
  isRefreshing.value = true
  await new Promise(r => setTimeout(r, 800))
  isRefreshing.value = false
}
</script>

<style scoped>
.feed-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #F4F6F8;
}

.top-shell {
  padding-bottom: 4rpx;
  background: linear-gradient(180deg, #F7FBF8 0%, #F3F7F5 100%);
  border-bottom-left-radius: 20rpx;
  border-bottom-right-radius: 20rpx;
  border-bottom: 1rpx solid #E7EDF2;
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
  padding: 14rpx 24rpx 6rpx;
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 10rpx;
  min-width: 0;
}

.nav-logo-icon {
  width: 46rpx;
  height: 46rpx;
  border-radius: 14rpx;
  background: linear-gradient(135deg, #16A34A 0%, #22C55E 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 8rpx 20rpx rgba(34, 197, 94, 0.18);
}

.nav-logo {
  color: #FFFFFF;
  font-size: 24rpx;
  font-weight: 700;
  line-height: 1;
}

.brand-text {
  min-width: 0;
}

.nav-title {
  display: block;
  font-size: 29rpx;
  font-weight: 700;
  color: #0F172A;
  line-height: 1.2;
}

.nav-search-btn {
  height: 56rpx;
  padding: 0 18rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.92);
  border: 1rpx solid #E5EAF0;
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex-shrink: 0;
}

.nav-search-mark {
  font-size: 22rpx;
  color: #94A3B8;
  line-height: 1;
}

.nav-search-text {
  font-size: 22rpx;
  color: #475569;
  font-weight: 600;
}

.control-panel {
  padding: 2rpx 24rpx 0;
}

.region-tabs {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  padding: 4rpx;
  border-radius: 999rpx;
  background: #EAF0F3;
}

.region-tab {
  min-width: 88rpx;
  height: 48rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748B;
}

.region-tab text {
  font-size: 21rpx;
  font-weight: 600;
}

.region-tab.active {
  background: #FFFFFF;
  color: #0F172A;
  box-shadow: 0 2rpx 8rpx rgba(15, 23, 42, 0.04);
}

.control-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-top: 8rpx;
}

.domain-scroll {
  flex: 1;
  white-space: nowrap;
}

.domain-tab-list {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  padding-right: 6rpx;
}

.domain-tab {
  height: 48rpx;
  padding: 0 18rpx;
  border-radius: 999rpx;
  border: 1rpx solid #E5EAF0;
  background: rgba(255, 255, 255, 0.92);
  color: #475569;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.domain-tab text {
  font-size: 21rpx;
  font-weight: 600;
  line-height: 1;
}

.domain-tab.active {
  color: #16A34A;
  border-color: #BFE3C7;
  background: #ECFDF3;
}

.noise-entry {
  flex-shrink: 0;
  height: 48rpx;
  padding: 0 16rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.92);
  border: 1rpx solid #E5EAF0;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.noise-entry-label {
  font-size: 20rpx;
  color: #475569;
  font-weight: 600;
}

.noise-entry-arrow {
  font-size: 18rpx;
  color: #94A3B8;
}

.hero-card {
  margin: 18rpx 24rpx 0;
  padding: 24rpx;
  border-radius: 26rpx;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, #F8FBF9 100%);
  border: 1rpx solid #E3EBE7;
  box-shadow: 0 10rpx 28rpx rgba(15, 23, 42, 0.05);
}

.hero-top-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20rpx;
}

.hero-title-wrap {
  flex: 1;
  min-width: 0;
}

.hero-kicker {
  display: inline-flex;
  align-items: center;
  height: 40rpx;
  padding: 0 14rpx;
  border-radius: 999rpx;
  background: #ECFDF3;
  color: #15803D;
  font-size: 20rpx;
  font-weight: 700;
}

.hero-title {
  display: block;
  margin-top: 14rpx;
  font-size: 31rpx;
  font-weight: 700;
  color: #0F172A;
  line-height: 1.5;
}

.hero-count-badge {
  width: 108rpx;
  min-height: 108rpx;
  border-radius: 24rpx;
  background: #F1F8F3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hero-count-num {
  font-size: 34rpx;
  font-weight: 700;
  color: #16A34A;
  line-height: 1;
}

.hero-count-unit {
  margin-top: 6rpx;
  font-size: 20rpx;
  color: #94A3B8;
  line-height: 1;
}

.hero-summary {
  display: block;
  margin-top: 16rpx;
  font-size: 23rpx;
  color: #64748B;
  line-height: 1.7;
}

.hero-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-top: 18rpx;
}

.meta-pill {
  min-height: 44rpx;
  padding: 0 16rpx;
  border-radius: 999rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.meta-pill text {
  font-size: 20rpx;
  font-weight: 600;
}

.meta-pill.soft {
  background: #F1F5F9;
}

.meta-pill.soft text {
  color: #475569;
}

.meta-pill.highlight {
  background: #ECFDF3;
}

.meta-pill.highlight text {
  color: #15803D;
}

.meta-pill.accent {
  background: #FFF7ED;
}

.meta-pill.accent text {
  color: #C2410C;
}

.hero-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12rpx;
  margin-top: 20rpx;
}

.hero-stat-card {
  min-height: 106rpx;
  padding: 18rpx 16rpx;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8rpx;
}

.hero-stat-card.mint {
  background: #F0FDF4;
}

.hero-stat-card.amber {
  background: #FFF7ED;
}

.hero-stat-card.blue {
  background: #EFF6FF;
}

.hero-stat-num {
  font-size: 30rpx;
  font-weight: 700;
  color: #0F172A;
}

.hero-stat-label {
  font-size: 21rpx;
  color: #64748B;
}

.article-list {
  flex: 1;
  overflow: hidden;
}

.list-content {
  padding-bottom: 28rpx;
}

.list-top-pad {
  height: 2rpx;
}

.list-footer {
  padding: 20rpx 24rpx 12rpx;
  text-align: center;
}

.list-footer text {
  font-size: 22rpx;
  color: #94A3B8;
}

.empty-state {
  margin: 24rpx;
  padding: 84rpx 40rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  border: 1rpx solid #E5EAF0;
  text-align: center;
}

.empty-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #334155;
  line-height: 1.5;
}

.empty-desc {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #94A3B8;
  line-height: 1.7;
}

.empty-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14rpx;
  margin-top: 28rpx;
}

.empty-btn-outline,
.empty-btn-primary {
  min-width: 180rpx;
  height: 68rpx;
  padding: 0 20rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-btn-outline {
  background: #F8FAFC;
  border: 1rpx solid #E5EAF0;
}

.empty-btn-outline text {
  font-size: 24rpx;
  color: #475569;
  font-weight: 600;
}

.empty-btn-primary {
  background: #16A34A;
}

.empty-btn-primary text {
  font-size: 24rpx;
  color: #FFFFFF;
  font-weight: 700;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.34);
  display: flex;
  align-items: flex-end;
  z-index: 100;
}

.noise-sheet {
  width: 100%;
  background: #FFFFFF;
  border-radius: 34rpx 34rpx 0 0;
}

.sheet-handle {
  width: 72rpx;
  height: 8rpx;
  border-radius: 999rpx;
  background: #D5DCE3;
  margin: 18rpx auto 0;
}

.sheet-content {
  padding: 18rpx 24rpx 0;
}

.sheet-header {
  margin-bottom: 16rpx;
}

.sheet-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #0F172A;
}

.sheet-subtitle {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #94A3B8;
  line-height: 1.6;
}

.noise-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  padding: 22rpx 20rpx;
  border-radius: 22rpx;
  background: #F8FAFC;
  border: 1rpx solid transparent;
}

.noise-option + .noise-option {
  margin-top: 12rpx;
}

.noise-option.active {
  background: #F0FDF4;
  border-color: #BBF7D0;
}

.noise-option-main {
  flex: 1;
  min-width: 0;
}

.noise-label-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.noise-opt-label {
  font-size: 27rpx;
  font-weight: 700;
  color: #0F172A;
}

.rec-badge {
  height: 36rpx;
  padding: 0 12rpx;
  border-radius: 999rpx;
  background: #DCFCE7;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.rec-text {
  font-size: 19rpx;
  color: #15803D;
  font-weight: 700;
}

.noise-opt-desc,
.noise-opt-count {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #94A3B8;
}

.noise-check-wrap {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 2rpx solid #CBD5E1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.noise-option.active .noise-check-wrap {
  border-color: #16A34A;
}

.noise-check-dot {
  width: 18rpx;
  height: 18rpx;
  border-radius: 50%;
  background: #16A34A;
}

.sheet-bottom-pad {
  height: 28rpx;
}
</style>
