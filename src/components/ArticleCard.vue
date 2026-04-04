<template>
  <view class="article-card" @tap="$emit('click', article)">
    <view class="card-head">
      <view class="tag-row">
        <view class="tag domain-tag" :style="{ color: domainInfo.color, background: domainInfo.bg }">
          <text>{{ domainInfo.label }}</text>
        </view>
        <view class="tag sentiment-tag" :style="{ color: sentimentInfo.color, background: sentimentInfo.bg }">
          <text>{{ sentimentInfo.label }}</text>
        </view>
        <view v-if="article.radarWords[0]" class="tag radar-tag">
          <text>{{ article.radarWords[0] }}</text>
        </view>
      </view>

      <view class="score-badge">
        <text class="score-value">{{ article.aiScore }}</text>
        <text class="score-unit">分</text>
      </view>
    </view>

    <text class="article-title">{{ article.title }}</text>
    <text class="article-summary">{{ article.aiSummary }}</text>

    <view v-if="displayPoints.length" class="points-panel">
      <view v-for="(point, index) in displayPoints" :key="`${article.id}-${index}`" class="point-item">
        <text class="point-arrow">▸</text>
        <text class="point-text">{{ point }}</text>
      </view>
    </view>

    <view class="card-footer">
      <view class="meta-line">
        <text class="meta-text">{{ article.source }}</text>
        <text class="meta-separator">·</text>
        <text class="meta-text">{{ article.publishTime }}</text>
        <template v-if="article.isAiTranslated">
          <text class="meta-separator">·</text>
          <text class="translate-text">AI译</text>
        </template>
      </view>

      <view class="action-row">
        <view class="action-item" :class="{ active: article.isLiked }" @tap.stop="$emit('like', article.id)">
          <text class="action-icon">🔥</text>
          <text class="action-count">{{ article.likeCount }}</text>
        </view>
        <view class="action-item" :class="{ collected: article.isCollected }" @tap.stop="$emit('collect', article.id)">
          <text class="action-icon">⭐</text>
          <text class="action-count">{{ article.collectCount }}</text>
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
  tech: { label: '科技', color: '#2B6DE5', bg: '#EDF4FF' },
  finance: { label: '财经', color: '#C97A0A', bg: '#FFF5E7' },
  policy: { label: '政策', color: '#198754', bg: '#EAF8F0' },
  commerce: { label: '商情', color: '#B5478A', bg: '#FFF1F8' },
}

const SENTIMENT_MAP: Record<string, { label: string; color: string; bg: string }> = {
  positive: { label: '利好', color: '#4FAF5C', bg: '#F1FAEE' },
  negative: { label: '利空', color: '#D65B5B', bg: '#FFF1F1' },
  neutral: { label: '中性', color: '#8A95A5', bg: '#F3F5F8' },
}

const domainInfo = computed(() => DOMAIN_MAP[props.article.domain] ?? { label: '其他', color: '#666666', bg: '#F5F5F5' })
const sentimentInfo = computed(() => SENTIMENT_MAP[props.article.sentiment] ?? SENTIMENT_MAP.neutral)
const displayPoints = computed(() => (props.article.aiKeyPoints ?? []).filter(Boolean).slice(0, 2))
</script>

<style scoped>
.article-card {
  margin: 0 24rpx 18rpx;
  padding: 22rpx 22rpx 18rpx;
  background: linear-gradient(180deg, #FFFFFF 0%, #FEFEFE 100%);
  border-radius: 24rpx;
  border: 1rpx solid #EEF1F5;
  box-shadow: 0 6rpx 20rpx rgba(31, 41, 55, 0.05);
}

.card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
  margin-bottom: 14rpx;
}

.tag-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
  flex-wrap: wrap;
  min-width: 0;
}

.tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38rpx;
  padding: 0 14rpx;
  border-radius: 10rpx;
  font-size: 21rpx;
  font-weight: 600;
  line-height: 1.2;
}

.radar-tag {
  color: #7A5CE6;
  background: #F4EEFF;
}

.score-badge {
  width: 68rpx;
  height: 68rpx;
  border-radius: 50%;
  background: linear-gradient(180deg, #FF7171 0%, #FF4D4F 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 6rpx 16rpx rgba(255, 77, 79, 0.24);
}

.score-value {
  font-size: 26rpx;
  line-height: 1;
  color: #FFFFFF;
  font-weight: 700;
}

.score-unit {
  margin-top: 2rpx;
  font-size: 17rpx;
  line-height: 1;
  color: rgba(255, 255, 255, 0.92);
}

.article-title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 39rpx;
  line-height: 1.42;
  font-weight: 700;
  color: #20242C;
  margin-bottom: 12rpx;
}

.article-summary {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 29rpx;
  line-height: 1.62;
  color: #707785;
  margin-bottom: 16rpx;
}

.points-panel {
  margin-bottom: 16rpx;
  padding: 16rpx 18rpx;
  border-radius: 16rpx;
  background: linear-gradient(180deg, #F2FCF5 0%, #ECFAF1 100%);
}

.point-item {
  display: flex;
  align-items: flex-start;
  gap: 10rpx;
}

.point-item + .point-item {
  margin-top: 10rpx;
}

.point-arrow {
  margin-top: 2rpx;
  font-size: 18rpx;
  line-height: 1.6;
  color: #47B96B;
  flex-shrink: 0;
}

.point-text {
  flex: 1;
  font-size: 28rpx;
  line-height: 1.62;
  color: #4C5B51;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}

.meta-line {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8rpx;
  overflow: hidden;
  white-space: nowrap;
}

.meta-text,
.meta-separator,
.translate-text {
  font-size: 24rpx;
}

.meta-text {
  color: #A0A6B2;
}

.meta-separator {
  color: #D6DAE1;
}

.translate-text {
  color: #4A8DF2;
}

.action-row {
  display: flex;
  align-items: center;
  gap: 18rpx;
  flex-shrink: 0;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 6rpx;
  color: #C0A07A;
}

.action-item.active {
  color: #F2994A;
}

.action-item.collected {
  color: #E0B640;
}

.action-icon {
  font-size: 24rpx;
  line-height: 1;
}

.action-count {
  font-size: 25rpx;
  line-height: 1;
  font-weight: 600;
}
</style>
