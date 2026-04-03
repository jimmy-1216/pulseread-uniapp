<template>
  <view class="onboarding-container">
    <!-- 顶部进度条 -->
    <view class="progress-bar">
      <view
        v-for="i in 3"
        :key="i"
        class="progress-dot"
        :class="{ active: step >= i }"
      />
    </view>

    <!-- 内容区（可滚动） -->
    <scroll-view scroll-y class="content-scroll" :style="{ flex: 1 }">
      <!-- 步骤 1：欢迎 -->
      <view v-if="step === 1" class="step-content">
        <view class="logo-area">
          <view class="logo-icon-wrap">
            <text class="logo-icon">🌊</text>
          </view>
          <text class="logo-title">微澜 PulseRead</text>
          <text class="logo-sub">AI 驱动的跨领域资讯聚合</text>
        </view>
        <view class="features-list">
          <view v-for="f in FEATURES" :key="f.title" class="feature-item">
            <view class="feature-icon-wrap">
              <text class="feature-icon">{{ f.icon }}</text>
            </view>
            <view class="feature-text">
              <text class="feature-title">{{ f.title }}</text>
              <text class="feature-desc">{{ f.desc }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 步骤 2：选择领域 -->
      <view v-if="step === 2" class="step-content">
        <text class="step-title">选择你感兴趣的领域</text>
        <text class="step-sub">至少选择 1 个，后续可随时调整</text>
        <view class="domain-grid">
          <view
            v-for="domain in DOMAIN_CONFIGS"
            :key="domain.key"
            class="domain-card"
            :style="{
              borderColor: selectedDomains.includes(domain.key) ? domain.color : '#EBEBEB',
              background: selectedDomains.includes(domain.key) ? domain.bgColor : '#FAFAFA',
            }"
            @tap="toggleDomain(domain.key)"
          >
            <text class="domain-icon">{{ domain.icon }}</text>
            <text
              class="domain-label"
              :style="{ color: selectedDomains.includes(domain.key) ? domain.color : '#1A1A1A' }"
            >{{ domain.label }}</text>
            <text class="domain-desc">{{ domain.description }}</text>
            <view
              v-if="selectedDomains.includes(domain.key)"
              class="domain-check"
              :style="{ background: domain.color }"
            >
              <text class="check-text">✓</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 步骤 3：降噪档位 -->
      <view v-if="step === 3" class="step-content">
        <text class="step-title">设置你的降噪档位</text>
        <text class="step-sub">控制每日资讯密度，后续可随时调整</text>
        <view class="noise-list">
          <view
            v-for="level in NOISE_LEVEL_CONFIGS"
            :key="level.key"
            class="noise-item"
            :style="{
              borderColor: selectedLevel === level.key ? '#1DB954' : '#EBEBEB',
              background: selectedLevel === level.key ? '#E8F8EE' : '#FAFAFA',
            }"
            @tap="selectedLevel = level.key"
          >
            <text class="noise-icon">{{ level.icon }}</text>
            <view class="noise-text">
              <view class="noise-label-row">
                <text class="noise-label">{{ level.label }}</text>
                <view v-if="level.recommended" class="recommended-badge">
                  <text class="recommended-text">推荐</text>
                </view>
              </view>
              <text class="noise-desc">{{ level.description }}</text>
              <text class="noise-count" style="color: #1DB954;">{{ level.dailyCount }}</text>
            </view>
            <view
              class="noise-radio"
              :style="{ borderColor: selectedLevel === level.key ? '#1DB954' : '#D0D0D0' }"
            >
              <view
                v-if="selectedLevel === level.key"
                class="noise-radio-inner"
              />
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部按钮 -->
    <view class="bottom-actions">
      <button
        class="next-btn"
        :disabled="!canNext"
        :style="{
          background: canNext ? 'linear-gradient(135deg, #1DB954 0%, #17A348 100%)' : '#C8C8C8',
          boxShadow: canNext ? '0 6px 20rpx rgba(29,185,84,0.35)' : 'none',
        }"
        @tap="handleNext"
      >
        {{ step === 3 ? '开始使用 🚀' : '下一步' }}
      </button>
      <button v-if="step > 1" class="back-btn" @tap="step--">
        返回上一步
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '../../store/useAppStore'
import { DOMAIN_CONFIGS, NOISE_LEVEL_CONFIGS } from '../../data/constants'
import type { DomainType, NoiseLevelType } from '../../data/types'

const store = useAppStore()
const step = ref(1)
const selectedDomains = ref<DomainType[]>([])
const selectedLevel = ref<NoiseLevelType>('focus')

const FEATURES = [
  { icon: '🤖', title: 'AI 智能筛选', desc: '每篇资讯经 AI 评分，过滤噪音，只推送真正有价值的内容' },
  { icon: '📡', title: '雷达词追踪', desc: '设置关键词，实时追踪行业动态，第一时间获取相关资讯' },
  { icon: '🌐', title: '双语对照', desc: '重要国际资讯自动 AI 翻译，中英对照阅读，无语言障碍' },
  { icon: '🎯', title: '降噪控制', desc: '自定义资讯密度，从全量到精选，完全由你掌控' },
]

const canNext = computed(() => {
  if (step.value === 2) return selectedDomains.value.length > 0
  return true
})

function toggleDomain(key: DomainType) {
  const idx = selectedDomains.value.indexOf(key)
  if (idx >= 0) {
    selectedDomains.value.splice(idx, 1)
  } else {
    selectedDomains.value.push(key)
  }
}

function handleNext() {
  if (!canNext.value) return
  if (step.value < 3) {
    step.value++
  } else {
    store.completeOnboarding({
      domains: selectedDomains.value,
      noiseLevel: selectedLevel.value,
      radarWords: ['GPT-5', 'OpenAI', 'A股'],
    })
    uni.switchTab({ url: '/pages/feed/index' })
  }
}
</script>

<style scoped>
.onboarding-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #FFFFFF;
  padding-bottom: env(safe-area-inset-bottom);
}

.progress-bar {
  display: flex;
  justify-content: center;
  gap: 8rpx;
  padding: 40rpx 0 20rpx;
}

.progress-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 6rpx;
  background: #E0E0E0;
  transition: all 0.3s;
}

.progress-dot.active {
  background: #1DB954;
  width: 40rpx;
}

.content-scroll {
  flex: 1;
  overflow: hidden;
}

.step-content {
  padding: 20rpx 40rpx 40rpx;
}

/* 步骤 1 */
.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0 50rpx;
}

.logo-icon-wrap {
  width: 160rpx;
  height: 160rpx;
  border-radius: 44rpx;
  background: linear-gradient(135deg, #1DB954 0%, #17A348 100%);
  box-shadow: 0 20rpx 60rpx rgba(29, 185, 84, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40rpx;
}

.logo-icon {
  font-size: 80rpx;
}

.logo-title {
  font-size: 44rpx;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 12rpx;
}

.logo-sub {
  font-size: 26rpx;
  color: #888;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 24rpx;
  padding: 28rpx;
  background: #F8FFF8;
  border-radius: 20rpx;
  border: 1rpx solid #E8F8EE;
}

.feature-icon-wrap {
  width: 72rpx;
  height: 72rpx;
  border-radius: 16rpx;
  background: #E8F8EE;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-icon {
  font-size: 36rpx;
}

.feature-text {
  flex: 1;
}

.feature-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1A1A1A;
  display: block;
  margin-bottom: 8rpx;
}

.feature-desc {
  font-size: 24rpx;
  color: #888;
  line-height: 1.6;
  display: block;
}

/* 步骤 2 */
.step-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #1A1A1A;
  display: block;
  margin-bottom: 12rpx;
}

.step-sub {
  font-size: 24rpx;
  color: #888;
  display: block;
  margin-bottom: 40rpx;
}

.domain-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.domain-card {
  position: relative;
  padding: 32rpx 24rpx;
  border-radius: 24rpx;
  border: 3rpx solid #EBEBEB;
  background: #FAFAFA;
  transition: all 0.2s;
}

.domain-icon {
  font-size: 44rpx;
  display: block;
  margin-bottom: 16rpx;
}

.domain-label {
  font-size: 28rpx;
  font-weight: 600;
  display: block;
  margin-bottom: 8rpx;
}

.domain-desc {
  font-size: 22rpx;
  color: #888;
  line-height: 1.4;
  display: block;
}

.domain-check {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-text {
  color: #fff;
  font-size: 20rpx;
  font-weight: 700;
}

/* 步骤 3 */
.noise-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.noise-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 28rpx;
  border-radius: 24rpx;
  border: 3rpx solid #EBEBEB;
  background: #FAFAFA;
  transition: all 0.2s;
}

.noise-icon {
  font-size: 44rpx;
  width: 56rpx;
  text-align: center;
  flex-shrink: 0;
}

.noise-text {
  flex: 1;
}

.noise-label-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 8rpx;
}

.noise-label {
  font-size: 28rpx;
  font-weight: 600;
  color: #1A1A1A;
}

.recommended-badge {
  background: #1DB954;
  border-radius: 8rpx;
  padding: 2rpx 10rpx;
}

.recommended-text {
  color: #fff;
  font-size: 20rpx;
  font-weight: 600;
}

.noise-desc {
  font-size: 24rpx;
  color: #888;
  display: block;
  margin-bottom: 6rpx;
}

.noise-count {
  font-size: 24rpx;
  font-weight: 500;
  display: block;
}

.noise-radio {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 3rpx solid #D0D0D0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.noise-radio-inner {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background: #1DB954;
}

/* 底部按钮 */
.bottom-actions {
  padding: 24rpx 40rpx 40rpx;
  flex-shrink: 0;
}

.next-btn {
  width: 100%;
  height: 96rpx;
  border-radius: 24rpx;
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  border: none;
  line-height: 96rpx;
}

.next-btn[disabled] {
  opacity: 1;
}

.back-btn {
  width: 100%;
  height: 72rpx;
  background: transparent;
  border: none;
  color: #AAAAAA;
  font-size: 26rpx;
  line-height: 72rpx;
  margin-top: 4rpx;
}
</style>
