<template>
  <view class="search-page">
    <view class="search-shell">
      <view class="search-bar">
        <view class="search-input-wrap">
          <text class="search-icon-left">⌕</text>
          <input
            v-model="query"
            class="search-input"
            placeholder="搜索资讯、来源、关键词"
            :focus="inputFocused"
            @focus="inputFocused = true"
            @blur="inputFocused = false"
            @confirm="handleSearch(query)"
          />
          <view v-if="query" class="clear-btn" @tap="clearQuery">
            <text class="clear-icon">×</text>
          </view>
        </view>
        <view v-if="inputFocused || query" class="cancel-btn" @tap="handleCancel">
          <text>取消</text>
        </view>
      </view>

      <view v-if="!submitted" class="search-helper">
        <text class="helper-title">快速找到你关心的行业变化</text>
        <text class="helper-desc">支持搜索公司、政策、产品名、赛道关键词和资讯来源</text>
      </view>
    </view>

    <scroll-view scroll-y class="content-scroll">
      <view v-if="submitted" class="result-area">
        <view class="result-header">
          <view class="result-text-wrap">
            <text class="result-title">“{{ submitted }}” 的结果</text>
            <text class="result-desc">共找到 {{ results.length }} 条相关资讯</text>
          </view>
          <view class="result-chip">
            <text>{{ results.length }} 条</text>
          </view>
        </view>

        <view v-if="results.length === 0" class="empty-state">
          <text class="empty-title">没有找到匹配内容</text>
          <text class="empty-desc">试试更短的关键词，或换成公司名、行业词重新搜索。</text>
        </view>

        <view v-else class="result-list">
          <ArticleCard
            v-for="a in results"
            :key="a.id"
            :article="a"
            @click="openArticle"
            @like="store.toggleLike"
            @collect="store.toggleCollect"
          />
        </view>
      </view>

      <view v-else class="discover-area">
        <view v-if="store.searchHistory.length > 0" class="section-card">
          <view class="section-header simple-header">
            <text class="section-title">最近搜索</text>
            <view class="clear-history-btn" @tap="store.clearSearchHistory()">
              <text>清空</text>
            </view>
          </view>
          <view class="tag-wrap compact-gap">
            <view
              v-for="kw in store.searchHistory"
              :key="kw"
              class="history-tag"
              @tap="handleSearch(kw)"
            >
              <text>{{ kw }}</text>
            </view>
          </view>
        </view>

        <view class="section-card hot-card">
          <view class="section-header">
            <view>
              <text class="section-title">热搜话题</text>
              <text class="section-sub">看看大家都在关注什么</text>
            </view>
            <text class="section-badge">实时</text>
          </view>
          <view class="hot-list">
            <view
              v-for="(kw, i) in HOT_SEARCHES"
              :key="kw"
              class="hot-item"
              :style="{ borderBottom: i < HOT_SEARCHES.length - 1 ? '1rpx solid #EEF2F7' : 'none' }"
              @tap="handleSearch(kw)"
            >
              <view class="hot-left">
                <view class="hot-rank" :class="{ top: i < 3 }">
                  <text>{{ i + 1 }}</text>
                </view>
                <text class="hot-kw">{{ kw }}</text>
              </view>
              <text class="hot-arrow">›</text>
            </view>
          </view>
        </view>

        <view class="section-card">
          <view class="section-header">
            <view>
              <text class="section-title">推荐雷达词</text>
              <text class="section-sub">适合快速建立行业跟踪习惯</text>
            </view>
          </view>
          <view class="tag-wrap">
            <view
              v-for="kw in SUGGESTED_RADAR_WORDS.slice(0, 8)"
              :key="kw"
              class="radar-tag"
              @tap="handleSearch(kw)"
            >
              <text>{{ kw }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '../../store/useAppStore'
import { HOT_SEARCHES, SUGGESTED_RADAR_WORDS } from '../../data/constants'
import ArticleCard from '../../components/ArticleCard.vue'
import type { Article } from '../../data/types'

const store = useAppStore()
const query = ref('')
const submitted = ref('')
const inputFocused = ref(false)

const results = computed(() => {
  if (!submitted.value) return []
  const kw = submitted.value.toLowerCase()
  return store.articles.filter(a =>
    a.title.toLowerCase().includes(kw) ||
    a.summary.toLowerCase().includes(kw) ||
    a.tags.some(t => t.toLowerCase().includes(kw)) ||
    a.radarWords.some(r => r.toLowerCase().includes(kw)) ||
    a.source.toLowerCase().includes(kw)
  )
})

function handleSearch(kw: string) {
  if (!kw.trim()) return
  query.value = kw
  submitted.value = kw
  inputFocused.value = false
  store.addSearchHistory(kw)
}

function clearQuery() {
  query.value = ''
  submitted.value = ''
}

function handleCancel() {
  query.value = ''
  submitted.value = ''
  inputFocused.value = false
}

function openArticle(article: Article) {
  store.setCurrentArticle(article.id)
  uni.navigateTo({ url: '/pages/article/index' })
}
</script>

<style scoped>
.search-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #F4F6F8;
}

.search-shell {
  padding: 18rpx 24rpx 16rpx;
  background: #F8FBF9;
  border-bottom-left-radius: 26rpx;
  border-bottom-right-radius: 26rpx;
  border-bottom: 1rpx solid #E7EDF2;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.search-input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
  height: 76rpx;
  padding: 0 24rpx;
  background: #FFFFFF;
  border: 1rpx solid #E5EAF0;
  border-radius: 999rpx;
}

.search-icon-left {
  font-size: 24rpx;
  color: #94A3B8;
  flex-shrink: 0;
  line-height: 1;
}

.search-input {
  flex: 1;
  height: 76rpx;
  font-size: 28rpx;
  color: #0F172A;
}

.clear-btn {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background: #CBD5E1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.clear-icon {
  font-size: 22rpx;
  color: #FFFFFF;
  line-height: 1;
}

.cancel-btn {
  flex-shrink: 0;
  padding: 10rpx 6rpx;
}

.cancel-btn text {
  font-size: 27rpx;
  color: #16A34A;
  font-weight: 600;
}

.search-helper {
  margin-top: 14rpx;
  padding: 6rpx 4rpx 2rpx;
}

.helper-title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: #0F172A;
}

.helper-desc {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #94A3B8;
  line-height: 1.6;
}

.content-scroll {
  flex: 1;
  overflow: hidden;
}

.result-area,
.discover-area {
  padding: 20rpx 0 36rpx;
}

.result-header,
.section-card {
  margin: 0 24rpx 16rpx;
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  background: #FFFFFF;
  border: 1rpx solid #E5EAF0;
  border-radius: 22rpx;
  padding: 22rpx 24rpx;
}

.result-text-wrap {
  flex: 1;
  min-width: 0;
}

.result-title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: #0F172A;
}

.result-desc {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #94A3B8;
}

.result-chip {
  min-width: 90rpx;
  height: 52rpx;
  padding: 0 16rpx;
  border-radius: 999rpx;
  background: #F0FDF4;
  color: #15803D;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.result-chip text {
  font-size: 22rpx;
  font-weight: 700;
}

.result-list {
  padding-top: 2rpx;
}

.empty-state {
  margin: 24rpx;
  padding: 88rpx 48rpx;
  background: #FFFFFF;
  border-radius: 22rpx;
  text-align: center;
  border: 1rpx solid #E5EAF0;
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

.section-card {
  background: #FFFFFF;
  border: 1rpx solid #E5EAF0;
  border-radius: 22rpx;
  padding: 24rpx;
}

.section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.simple-header {
  align-items: center;
}

.section-title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: #0F172A;
}

.section-sub {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #94A3B8;
}

.section-badge {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: #FFF7ED;
  color: #EA580C;
  font-size: 20rpx;
  font-weight: 700;
}

.clear-history-btn text {
  font-size: 23rpx;
  color: #94A3B8;
}

.tag-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
}

.compact-gap {
  gap: 12rpx;
}

.history-tag,
.radar-tag {
  min-height: 56rpx;
  padding: 0 22rpx;
  border-radius: 999rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.history-tag {
  background: #F1F5F9;
  color: #475569;
}

.radar-tag {
  background: #F5F3FF;
  color: #7C3AED;
}

.history-tag text,
.radar-tag text {
  font-size: 24rpx;
  font-weight: 600;
}

.hot-list {
  background: #FFFFFF;
  border-radius: 18rpx;
  overflow: hidden;
}

.hot-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  padding: 22rpx 0;
}

.hot-left {
  display: flex;
  align-items: center;
  gap: 18rpx;
  flex: 1;
  min-width: 0;
}

.hot-rank {
  width: 38rpx;
  height: 38rpx;
  border-radius: 50%;
  background: #F1F5F9;
  color: #94A3B8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hot-rank text {
  font-size: 22rpx;
  font-weight: 800;
}

.hot-rank.top {
  background: #FEE2E2;
  color: #EF4444;
}

.hot-kw {
  flex: 1;
  min-width: 0;
  font-size: 27rpx;
  color: #0F172A;
  line-height: 1.5;
}

.hot-arrow {
  font-size: 28rpx;
  color: #CBD5E1;
  flex-shrink: 0;
}
</style>
