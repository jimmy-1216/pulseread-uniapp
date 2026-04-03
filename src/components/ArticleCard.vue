<template>
  <view class="article-card" @tap="$emit('click', article)">
    <view class="card-inner">
      <!-- 顶部：标签行 + AI 评分 -->
      <view class="tags-row">
        <view class="tag" :style="{ color: domainInfo.color, background: domainInfo.bg }">
          <text>{{ domainInfo.label }}</text>
        </view>
        <view class="tag" :style="{ color: sentimentInfo.color, background: sentimentInfo.bg }">
          <text>{{ sentimentInfo.label }}</text>
        </view>
        <view v-if="article.radarWords[0]" class="tag radar-tag">
          <text>📡 {{ article.radarWords[0] }}</text>
        </view>
        <!-- AI 评分徽章 -->
        <view class="score-badge" :style="{ background: scoreColor, boxShadow: `0 4rpx 16rpx ${scoreColor}55` }">
          <text class="score-num">{{ article.aiScore }}</text>
          <text class="score-unit">分</text>
        </view>
      </view>

      <!-- 标题 -->
      <text class="article-title">{{ article.title }}</text>

      <!-- AI 摘要 -->
      <text class="article-summary">{{ article.aiSummary }}</text>

      <!-- AI 要点 -->
      <view v-if="article.aiKeyPoints.length > 0" class="key-points">
        <view
          v-for="(pt, i) in article.aiKeyPoints.slice(0, 2)"
          :key="i"
          class="key-point-item"
        >
          <text class="key-point-dot">▸</text>
          <text class="key-point-text">{{ pt }}</text>
        </view>
      </view>

      <!-- 底部：来源 + 时间 + 操作 -->
      <view class="card-footer">
        <view class="source-info">
          <text class="source-text">{{ article.source }}</text>
          <text class="separator">·</text>
          <text class="time-text">{{ article.publishTime }}</text>
          <text v-if="article.isAiTranslated" class="separator">·</text>
          <text v-if="article.isAiTranslated" class="translated-tag">🌐 AI译</text>
        </view>
        <view class="action-row">
          <view
            class="action-btn"
            :style="{ color: article.isLiked ? '#1DB954' : '#C0C0C0' }"
            @tap.stop="$emit('like', article.id)"
          >
            <text class="action-icon">{{ article.isLiked ? '👍' : '👍' }}</text>
            <text class="action-count">{{ article.likeCount }}</text>
          </view>
          <view
            class="action-btn"
            :style="{ color: article.isCollected ? '#FA8C16' : '#C0C0C0' }"
            @tap.stop="$emit('collect', article.id)"
          >
            <text class="action-icon">⭐</text>
            <text class="action-count">{{ article.collectCount }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Article } from '../data/types'

const props = defineProps<{ article: Article }>()
defineEmits<{
  click: [article: Article]
  like: [id: number]
  collect: [id: number]
}>()

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

const domainInfo = computed(() => DOMAIN_MAP[props.article.domain] ?? { label: '其他', color: '#666', bg: '#F5F5F5' })
const sentimentInfo = computed(() => SENTIMENT_MAP[props.article.sentiment] ?? SENTIMENT_MAP.neutral)

const scoreColor = computed(() => {
  const s = props.article.aiScore
  if (s >= 88) return '#FF4D4F'
  if (s >= 75) return '#FA8C16'
  return '#1DB954'
})
</script>

<style scoped>
.article-card {
  background: #fff;
  margin: 0 24rpx 20rpx;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.06);
  border: 1rpx solid rgba(0, 0, 0, 0.04);
}

.card-inner {
  padding: 28rpx;
}

.tags-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
  flex-wrap: wrap;
}

.tag {
  font-size: 22rpx;
  padding: 4rpx 16rpx;
  border-radius: 10rpx;
  font-weight: 500;
}

.radar-tag {
  color: #7C3AED;
  background: #F5F0FF;
}

.score-badge {
  margin-left: auto;
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.score-num {
  color: #fff;
  font-weight: 700;
  font-size: 22rpx;
  line-height: 1;
}

.score-unit {
  color: #fff;
  font-size: 16rpx;
  opacity: 0.85;
  line-height: 1;
}

.article-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1A1A1A;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 16rpx;
  display: block;
}

.article-summary {
  font-size: 26rpx;
  color: #888;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 20rpx;
  display: block;
}

.key-points {
  background: #F0FDF4;
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
  margin-bottom: 20rpx;
}

.key-point-item {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  margin-bottom: 8rpx;
}

.key-point-item:last-child {
  margin-bottom: 0;
}

.key-point-dot {
  color: #1DB954;
  font-size: 24rpx;
  flex-shrink: 0;
  margin-top: 2rpx;
}

.key-point-text {
  font-size: 24rpx;
  color: #444;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.source-info {
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex: 1;
  overflow: hidden;
}

.source-text,
.time-text {
  font-size: 22rpx;
  color: #AAAAAA;
}

.separator {
  font-size: 22rpx;
  color: #CCCCCC;
}

.translated-tag {
  font-size: 22rpx;
  color: #1677FF;
}

.action-row {
  display: flex;
  align-items: center;
  gap: 32rpx;
  flex-shrink: 0;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.action-icon {
  font-size: 24rpx;
}

.action-count {
  font-size: 24rpx;
  font-weight: 500;
}
</style>
