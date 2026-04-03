<template>
  <view class="search-page">
    <!-- 顶部搜索栏 -->
    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon-left">🔍</text>
        <input
          v-model="query"
          class="search-input"
          placeholder="搜索资讯、关键词..."
          :focus="inputFocused"
          @focus="inputFocused = true"
          @blur="inputFocused = false"
          @confirm="handleSearch(query)"
        />
        <view v-if="query" class="clear-btn" @tap="clearQuery">
          <text class="clear-icon">✕</text>
        </view>
      </view>
      <view v-if="inputFocused || query" class="cancel-btn" @tap="handleCancel">
        <text>取消</text>
      </view>
    </view>

    <!-- 内容区 -->
    <scroll-view scroll-y class="content-scroll">
      <!-- 搜索结果 -->
      <view v-if="submitted">
        <view class="result-header">
          <text class="result-count">
            共找到 <text class="result-num">{{ results.length }}</text> 条结果
          </text>
        </view>
        <view v-if="results.length === 0" class="empty-state">
          <text class="empty-icon">🔍</text>
          <text class="empty-title">未找到相关资讯</text>
          <text class="empty-desc">换个关键词试试</text>
        </view>
        <view v-else>
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

      <!-- 未搜索时：历史 + 热搜 + 雷达词 -->
      <view v-else class="discover-area">
        <!-- 搜索历史 -->
        <view v-if="store.searchHistory.length > 0" class="section">
          <view class="section-header">
            <text class="section-title">搜索历史</text>
            <view class="clear-history-btn" @tap="store.clearSearchHistory()">
              <text>清空</text>
            </view>
          </view>
          <view class="tag-wrap">
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

        <!-- 热搜榜 -->
        <view class="section">
          <view class="section-header">
            <text class="section-title">热搜榜</text>
            <text class="section-badge">🔥 实时更新</text>
          </view>
          <view class="hot-list">
            <view
              v-for="(kw, i) in HOT_SEARCHES"
              :key="kw"
              class="hot-item"
              :style="{ borderBottom: i < HOT_SEARCHES.length - 1 ? '1rpx solid #F5F5F5' : 'none' }"
              @tap="handleSearch(kw)"
            >
              <text
                class="hot-rank"
                :style="{ color: i < 3 ? '#FF4D4F' : '#BDBDBD' }"
              >{{ i + 1 }}</text>
              <text class="hot-kw">{{ kw }}</text>
              <text class="hot-arrow">›</text>
            </view>
          </view>
        </view>

        <!-- 推荐雷达词 -->
        <view class="section">
          <view class="section-header">
            <text class="section-title">推荐雷达词</text>
            <text class="section-badge">📡 添加后实时追踪</text>
          </view>
          <view class="tag-wrap">
            <view
              v-for="kw in SUGGESTED_RADAR_WORDS.slice(0, 8)"
              :key="kw"
              class="radar-tag"
              @tap="handleSearch(kw)"
            >
              <text>📡 {{ kw }}</text>
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
  background: #F5F5F5;
}

/* 搜索栏 */
.search-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 28rpx;
  background: #fff;
  border-bottom: 1rpx solid #F0F0F0;
  flex-shrink: 0;
}

.search-input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  background: #F3F4F6;
  border-radius: 40rpx;
  padding: 0 24rpx;
  height: 68rpx;
  gap: 12rpx;
}

.search-icon-left {
  font-size: 28rpx;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  height: 68rpx;
}

.clear-btn {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #D0D0D0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.clear-icon {
  font-size: 20rpx;
  color: #fff;
}

.cancel-btn {
  flex-shrink: 0;
  font-size: 28rpx;
  color: #1DB954;
  font-weight: 500;
  padding: 8rpx 0;
}

/* 内容区 */
.content-scroll {
  flex: 1;
  overflow: hidden;
}

/* 搜索结果 */
.result-header {
  padding: 24rpx 32rpx 16rpx;
}

.result-count {
  font-size: 26rpx;
  color: #888;
}

.result-num {
  color: #1DB954;
  font-weight: 600;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.empty-title {
  font-size: 28rpx;
  color: #888;
  margin-bottom: 12rpx;
  display: block;
}

.empty-desc {
  font-size: 24rpx;
  color: #CCCCCC;
  display: block;
}

/* 发现区 */
.discover-area {
  padding: 0 32rpx;
}

.section {
  margin-top: 40rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1A1A1A;
}

.section-badge {
  font-size: 22rpx;
  color: #FA8C16;
}

.clear-history-btn {
  font-size: 24rpx;
  color: #AAAAAA;
}

/* 标签 */
.tag-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.history-tag {
  padding: 12rpx 28rpx;
  border-radius: 40rpx;
  background: #F0F0F0;
  font-size: 26rpx;
  color: #444;
}

.radar-tag {
  padding: 12rpx 28rpx;
  border-radius: 40rpx;
  background: #F5F0FF;
  font-size: 24rpx;
  color: #7C3AED;
  border: 1rpx solid #DDD6FE;
}

/* 热搜榜 */
.hot-list {
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.05);
}

.hot-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 28rpx 32rpx;
}

.hot-rank {
  width: 36rpx;
  text-align: center;
  font-size: 26rpx;
  font-weight: 700;
  flex-shrink: 0;
}

.hot-kw {
  flex: 1;
  font-size: 28rpx;
  color: #1A1A1A;
}

.hot-arrow {
  font-size: 28rpx;
  color: #D0D0D0;
  flex-shrink: 0;
}
</style>
