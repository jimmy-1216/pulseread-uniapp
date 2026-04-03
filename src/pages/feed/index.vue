<template>
  <view class="feed-page">
    <!-- 导航栏： Logo + 地区 Tab（左对齐），右侧留空给胶囊按钮 -->
    <view class="nav-bar">
      <view class="nav-logo-icon">
        <text class="nav-logo">🌊</text>
      </view>
      <text class="nav-title">微澜</text>
      <!-- 地区 Tab 在 Logo 右侧，用分隔线隔开 -->
      <view class="nav-divider"></view>
      <view class="region-tabs-inline">
        <view
          v-for="r in REGION_CONFIGS"
          :key="r.key"
          class="region-tab-inline"
          :class="{ active: selectedRegion === r.key }"
          @tap="selectedRegion = r.key"
        >
          <text class="region-tab-inline-text">{{ r.label }}</text>
        </view>
      </view>
    </view>

    <!-- 第二行：降噪档位 + 领域胶囊 -->
    <view class="filter-bar">
      <view class="noise-badge" @tap="showNoisePicker = true">
        <text class="noise-badge-icon">{{ currentNoiseLevelConfig?.icon }}</text>
        <text class="noise-badge-label">{{ currentNoiseLevelConfig?.label }}</text>
        <text class="noise-badge-arrow">▾</text>
      </view>
      <scroll-view scroll-x class="domain-tabs-inline" :show-scrollbar="false">
        <view class="domain-tab-list-inline">
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
            :style="selectedDomain === d.key ? { background: d.color, color: '#fff' } : {}"
            @tap="selectedDomain = d.key"
          >
            <text>{{ d.icon ? d.icon + ' ' + d.label : d.label }}</text>
          </view>
        </view>
      </scroll-view>
    </view>



    <!-- 文章列表 -->
    <scroll-view
      scroll-y
      class="article-list"
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
    >
      <!-- 空状态 -->
      <view v-if="filteredArticles.length === 0" class="empty-state">
        <text class="empty-icon">🔍</text>
        <text class="empty-title">
          {{ selectedDomain !== 'all'
            ? `暂无「${subscribedDomains.find(d => d.key === selectedDomain)?.label ?? ''}」领域资讯`
            : '暂无符合条件的资讯' }}
        </text>
        <text class="empty-desc">
          {{ selectedDomain !== 'all'
            ? '可以降低降噪档位，或前往偏好设置订阅更多领域'
            : '尝试调整降噪档位或切换地区筛选' }}
        </text>
        <view class="empty-actions">
          <view class="empty-btn-outline" @tap="showNoisePicker = true">
            <text>调整降噪档位</text>
          </view>
          <view
            v-if="selectedDomain !== 'all'"
            class="empty-btn-primary"
            @tap="goPreference"
          >
            <text>去偏好设置</text>
          </view>
        </view>
      </view>

      <!-- 文章卡片 -->
      <view v-else>
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
          <text>— 已加载全部内容 —</text>
        </view>
      </view>
    </scroll-view>

    <!-- 降噪选择器弹窗 -->
    <view v-if="showNoisePicker" class="overlay" @tap="showNoisePicker = false">
      <view class="noise-sheet" @tap.stop>
        <view class="sheet-handle" />
        <view class="sheet-content">
          <text class="sheet-title">选择降噪档位</text>
          <view
            v-for="level in NOISE_LEVEL_CONFIGS"
            :key="level.key"
            class="noise-option"
            :style="{
              background: store.preference.noiseLevel === level.key ? '#E8F8EE' : '#F9F9F9',
              border: `3rpx solid ${store.preference.noiseLevel === level.key ? '#1DB954' : 'transparent'}`,
            }"
            @tap="selectNoise(level.key)"
          >
            <text class="noise-opt-icon">{{ level.icon }}</text>
            <view class="noise-opt-text">
              <view class="noise-opt-label-row">
                <text class="noise-opt-label">{{ level.label }}</text>
                <view v-if="level.recommended" class="rec-badge">
                  <text class="rec-text">推荐</text>
                </view>
              </view>
              <text class="noise-opt-desc">{{ level.description }} · {{ level.dailyCount }}</text>
            </view>
            <text v-if="store.preference.noiseLevel === level.key" class="noise-check">✓</text>
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
  background: #F5F5F5;
}

/* 导航栏 */
.nav-bar {
  display: flex;
  align-items: center;
  padding: 18rpx 32rpx 18rpx 32rpx;
  background: #fff;
  border-bottom: 1rpx solid #F0F0F0;
  gap: 16rpx;
}

/* 分隔线 */
.nav-divider {
  width: 1.5rpx;
  height: 32rpx;
  background: #E0E0E0;
  flex-shrink: 0;
  margin: 0 4rpx;
}

.nav-logo-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 14rpx;
  background: linear-gradient(135deg, #1DB954, #17A348);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-logo {
  font-size: 28rpx;
}

.nav-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #111;
}

/* 降噪档位标签 */
.noise-badge {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 6rpx 16rpx;
  border-radius: 40rpx;
  background: #F0FDF4;
  border: 1rpx solid #BBF7D0;
  flex-shrink: 0;
}

.noise-badge-icon {
  font-size: 24rpx;
}

.noise-badge-label {
  font-size: 22rpx;
  font-weight: 600;
  color: #1DB954;
}

.noise-badge-arrow {
  font-size: 18rpx;
  color: #1DB954;
  margin-left: 2rpx;
}

/* 地区 Tab（内联在导航栏右侧） */
.region-tabs-inline {
  display: flex;
  align-items: center;
  gap: 4rpx;
  flex-shrink: 0;
}

.region-tab-inline {
  padding: 10rpx 20rpx;
  border-radius: 32rpx;
  transition: all 0.2s ease;
}

.region-tab-inline.active {
  background: #F0FDF4;
}

.region-tab-inline-text {
  font-size: 26rpx;
  color: #AAAAAA;
  font-weight: 500;
  transition: all 0.2s ease;
}

.region-tab-inline.active .region-tab-inline-text {
  color: #1DB954;
  font-weight: 700;
}

/* 第二行过滤栏：降噪档位 + 领域胶囊 */
.filter-bar {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx 16rpx 32rpx;
  background: #fff;
  border-bottom: 1rpx solid #EEEEEE;
  gap: 16rpx;
}

.domain-tabs-inline {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
}

.domain-tab-list-inline {
  display: flex;
  gap: 16rpx;
  padding-right: 16rpx;
}

.domain-tab {
  padding: 14rpx 28rpx;
  border-radius: 40rpx;
  font-size: 26rpx;
  color: #888;
  background: #F5F5F5;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1.5rpx solid transparent;
}

.domain-tab.active {
  background: #E8F8EE;
  color: #1DB954;
  font-weight: 600;
  border: 1.5rpx solid #A8E6C0;
}

/* 文章列表 */
.article-list {
  flex: 1;
  overflow: hidden;
}

.list-top-pad {
  height: 24rpx;
}

.list-footer {
  text-align: center;
  padding: 40rpx 0;
  font-size: 22rpx;
  color: #CCCCCC;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 64rpx;
  text-align: center;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 24rpx;
}

.empty-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #444;
  margin-bottom: 12rpx;
  display: block;
}

.empty-desc {
  font-size: 26rpx;
  color: #AAAAAA;
  line-height: 1.6;
  margin-bottom: 40rpx;
  display: block;
}

.empty-actions {
  display: flex;
  gap: 16rpx;
}

.empty-btn-outline {
  padding: 16rpx 32rpx;
  border-radius: 40rpx;
  background: #F0FDF4;
  color: #1DB954;
  border: 1rpx solid #BBF7D0;
  font-size: 26rpx;
  font-weight: 500;
}

.empty-btn-primary {
  padding: 16rpx 32rpx;
  border-radius: 40rpx;
  background: #1DB954;
  color: #fff;
  font-size: 26rpx;
  font-weight: 500;
}

/* 降噪选择器 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
  display: flex;
  align-items: flex-end;
}

.noise-sheet {
  background: #fff;
  border-radius: 40rpx 40rpx 0 0;
  width: 100%;
  max-height: 80vh;
}

.sheet-handle {
  width: 72rpx;
  height: 8rpx;
  background: #E0E0E0;
  border-radius: 4rpx;
  margin: 24rpx auto 0;
}

.sheet-content {
  padding: 24rpx 32rpx 0;
}

.sheet-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #1A1A1A;
  display: block;
  margin-bottom: 24rpx;
}

.noise-option {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 24rpx;
  border-radius: 20rpx;
  margin-bottom: 16rpx;
}

.noise-opt-icon {
  font-size: 40rpx;
  width: 48rpx;
  text-align: center;
  flex-shrink: 0;
}

.noise-opt-text {
  flex: 1;
}

.noise-opt-label-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 8rpx;
}

.noise-opt-label {
  font-size: 28rpx;
  font-weight: 600;
  color: #1A1A1A;
}

.rec-badge {
  background: #1DB954;
  border-radius: 8rpx;
  padding: 2rpx 10rpx;
}

.rec-text {
  color: #fff;
  font-size: 20rpx;
  font-weight: 600;
}

.noise-opt-desc {
  font-size: 24rpx;
  color: #888;
  display: block;
}

.noise-check {
  font-size: 28rpx;
  color: #1DB954;
  font-weight: 700;
  flex-shrink: 0;
}

.sheet-bottom-pad {
  height: 40rpx;
}
</style>
