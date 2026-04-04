<template>
  <view class="onboarding-page">
    <view class="page-top-safe" />

    <view class="progress-strip">
      <view
        v-for="i in 3"
        :key="i"
        class="progress-dot"
        :class="{ active: step >= i }"
      />
    </view>

    <scroll-view scroll-y class="page-scroll" :style="scrollStyle">
      <view class="page-inner">
        <view class="hero-card">
          <view class="brand-row">
            <view class="brand-badge">
              <text class="brand-badge-text">澜</text>
            </view>
            <view class="brand-texts">
              <text class="brand-title">微澜 PulseRead</text>
              <text class="brand-sub">面向微信小程序的轻量资讯阅读助手</text>
            </view>
          </view>

          <view class="step-head">
            <text class="step-index">步骤 {{ step }}/3</text>
            <text class="step-title">{{ stepMeta.title }}</text>
            <text class="step-sub">{{ stepMeta.sub }}</text>
          </view>
        </view>

        <view v-if="step === 1" class="step-panel">
          <view class="intro-card">
            <text class="intro-title">先用 3 个小步骤完成偏好初始化</text>
            <text class="intro-desc">首次配置后，你会获得更贴合阅读兴趣的推荐流与雷达词追踪体验。</text>
          </view>

          <view class="feature-list">
            <view v-for="f in FEATURES" :key="f.title" class="feature-card">
              <view class="feature-mark">
                <text class="feature-mark-text">{{ f.mark }}</text>
              </view>
              <view class="feature-body">
                <text class="feature-title">{{ f.title }}</text>
                <text class="feature-desc">{{ f.desc }}</text>
              </view>
            </view>
          </view>
        </view>

        <view v-if="step === 2" class="step-panel">
          <view class="section-tip">
            <text class="section-tip-title">选择你最关注的领域</text>
            <text class="section-tip-desc">至少选择 1 个，后续可以在偏好设置里继续增删。</text>
          </view>

          <view class="domain-grid">
            <view
              v-for="domain in DOMAIN_CONFIGS"
              :key="domain.key"
              class="domain-card"
              :class="{ active: selectedDomains.includes(domain.key) }"
              :style="selectedDomains.includes(domain.key)
                ? { borderColor: domain.color, background: domain.bgColor }
                : {}"
              @tap="toggleDomain(domain.key)"
            >
              <view class="domain-top">
                <view class="domain-icon-wrap">
                  <text class="domain-icon">{{ domain.icon }}</text>
                </view>
                <view v-if="selectedDomains.includes(domain.key)" class="domain-check">
                  <text class="domain-check-text">已选</text>
                </view>
              </view>
              <text
                class="domain-label"
                :style="selectedDomains.includes(domain.key) ? { color: domain.color } : {}"
              >{{ domain.label }}</text>
              <text class="domain-desc">{{ domain.description }}</text>
            </view>
          </view>
        </view>

        <view v-if="step === 3" class="step-panel">
          <view class="section-tip">
            <text class="section-tip-title">选择你的阅读密度</text>
            <text class="section-tip-desc">不同档位会影响首页推荐流的资讯数量与筛选力度。</text>
          </view>

          <view class="noise-list">
            <view
              v-for="level in NOISE_LEVEL_CONFIGS"
              :key="level.key"
              class="noise-card"
              :class="{ active: selectedLevel === level.key }"
              @tap="selectedLevel = level.key"
            >
              <view class="noise-main">
                <view class="noise-icon-wrap">
                  <text class="noise-icon">{{ level.icon }}</text>
                </view>
                <view class="noise-copy">
                  <view class="noise-title-row">
                    <text class="noise-title">{{ level.label }}</text>
                    <view v-if="level.recommended" class="recommend-chip">
                      <text class="recommend-chip-text">推荐</text>
                    </view>
                  </view>
                  <text class="noise-desc">{{ level.description }}</text>
                  <text class="noise-count">{{ level.dailyCount }}</text>
                </view>
              </view>
              <view class="noise-radio" :class="{ active: selectedLevel === level.key }">
                <view v-if="selectedLevel === level.key" class="noise-radio-dot" />
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="bottom-bar">
      <view v-if="step > 1" class="secondary-btn" @tap="step--">
        <text class="secondary-btn-text">上一步</text>
      </view>
      <view
        class="primary-btn"
        :class="{ disabled: !canNext, full: step === 1 }"
        @tap="handleNext"
      >
        <text class="primary-btn-text">{{ step === 3 ? '开始使用' : '下一步' }}</text>
      </view>
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
  { mark: 'AI', title: '智能筛选', desc: '自动压缩噪音资讯，把更值得读的内容优先排到前面。' },
  { mark: '雷达', title: '雷达词追踪', desc: '围绕公司、产品或主题建立持续监测，不错过关键动态。' },
  { mark: '双语', title: '双语阅读', desc: '重要资讯支持中英对照查看，便于快速理解海外内容。' },
]

const canNext = computed(() => {
  if (step.value === 2) return selectedDomains.value.length > 0
  return true
})

const scrollStyle = computed(() => ({
  height: 'calc(100vh - var(--status-bar-height) - 48rpx - 132rpx - env(safe-area-inset-bottom))',
}))

const stepMeta = computed(() => {
  if (step.value === 1) {
    return {
      title: '先了解应用能力',
      sub: '用更轻的方式完成首次设置，后续可随时调整。',
    }
  }
  if (step.value === 2) {
    return {
      title: '设置你的关注方向',
      sub: '让推荐流优先围绕你最常阅读的领域展开。',
    }
  }
  return {
    title: '设定阅读降噪档位',
    sub: '控制信息密度，建立更适合你的浏览节奏。',
  }
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
.onboarding-page {
  min-height: 100vh;
  background: #F4F6F8;
  display: flex;
  flex-direction: column;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
}

.page-top-safe {
  height: calc(var(--status-bar-height) + 8px);
  flex-shrink: 0;
}

.progress-strip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  padding: 12rpx 0 20rpx;
}

.progress-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 999rpx;
  background: #D7DEE6;
  transition: all 0.2s ease;
}

.progress-dot.active {
  width: 42rpx;
  background: #16A34A;
}

.page-scroll {
  flex: none;
  min-height: 0;
}

.page-inner {
  padding: 0 24rpx calc(156rpx + env(safe-area-inset-bottom));
}

.hero-card {
  padding: 28rpx 24rpx 26rpx;
  background: #FFFFFF;
  border: 1rpx solid #E5EAF0;
  border-radius: 28rpx;
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 18rpx;
}

.brand-badge {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, #1DB954 0%, #16A34A 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10rpx 24rpx rgba(34, 197, 94, 0.18);
  flex-shrink: 0;
}

.brand-badge-text {
  font-size: 32rpx;
  font-weight: 800;
  color: #FFFFFF;
}

.brand-texts {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #0F172A;
}

.brand-sub {
  margin-top: 6rpx;
  font-size: 23rpx;
  color: #94A3B8;
  line-height: 1.5;
}

.step-head {
  margin-top: 28rpx;
}

.step-index {
  display: inline-flex;
  height: 42rpx;
  padding: 0 16rpx;
  align-items: center;
  border-radius: 999rpx;
  background: #EEF6F0;
  color: #15803D;
  font-size: 22rpx;
  font-weight: 700;
}

.step-title {
  display: block;
  margin-top: 18rpx;
  font-size: 38rpx;
  font-weight: 700;
  color: #0F172A;
  line-height: 1.35;
}

.step-sub {
  display: block;
  margin-top: 10rpx;
  font-size: 25rpx;
  color: #64748B;
  line-height: 1.7;
}

.step-panel {
  margin-top: 18rpx;
}

.intro-card,
.feature-card,
.domain-card,
.noise-card,
.section-tip {
  background: #FFFFFF;
  border: 1rpx solid #E5EAF0;
  border-radius: 24rpx;
}

.intro-card,
.section-tip {
  padding: 24rpx;
}

.intro-title,
.section-tip-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #0F172A;
}

.intro-desc,
.section-tip-desc {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #64748B;
  line-height: 1.7;
}

.feature-list,
.noise-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 16rpx;
}

.feature-card {
  display: flex;
  align-items: flex-start;
  gap: 18rpx;
  padding: 24rpx;
}

.feature-mark {
  min-width: 72rpx;
  height: 48rpx;
  padding: 0 14rpx;
  border-radius: 14rpx;
  background: #EEF6F0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-mark-text {
  font-size: 22rpx;
  font-weight: 700;
  color: #15803D;
}

.feature-body {
  flex: 1;
  min-width: 0;
}

.feature-title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: #0F172A;
}

.feature-desc {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #64748B;
  line-height: 1.7;
}

.domain-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
  margin-top: 16rpx;
}

.domain-card {
  padding: 22rpx;
}

.domain-card.active {
  box-shadow: 0 8rpx 22rpx rgba(15, 23, 42, 0.04);
}

.domain-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.domain-icon-wrap {
  width: 64rpx;
  height: 64rpx;
  border-radius: 18rpx;
  background: #F8FAFC;
  display: flex;
  align-items: center;
  justify-content: center;
}

.domain-icon {
  font-size: 34rpx;
}

.domain-check {
  height: 40rpx;
  padding: 0 14rpx;
  border-radius: 999rpx;
  background: rgba(34, 197, 94, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.domain-check-text {
  font-size: 20rpx;
  font-weight: 700;
  color: #15803D;
}

.domain-label {
  display: block;
  margin-top: 18rpx;
  font-size: 28rpx;
  font-weight: 700;
  color: #0F172A;
}

.domain-desc {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #64748B;
  line-height: 1.6;
}

.noise-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  padding: 24rpx;
}

.noise-card.active {
  border-color: #B9E7C7;
  background: #F8FCF9;
}

.noise-main {
  display: flex;
  align-items: center;
  gap: 18rpx;
  flex: 1;
  min-width: 0;
}

.noise-icon-wrap {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  background: #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.noise-icon {
  font-size: 34rpx;
}

.noise-copy {
  flex: 1;
  min-width: 0;
}

.noise-title-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
  flex-wrap: wrap;
}

.noise-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #0F172A;
}

.recommend-chip {
  height: 38rpx;
  padding: 0 12rpx;
  border-radius: 999rpx;
  background: #E8F8EE;
  display: flex;
  align-items: center;
}

.recommend-chip-text {
  font-size: 20rpx;
  font-weight: 700;
  color: #15803D;
}

.noise-desc {
  display: block;
  margin-top: 8rpx;
  font-size: 23rpx;
  color: #64748B;
  line-height: 1.6;
}

.noise-count {
  display: block;
  margin-top: 8rpx;
  font-size: 23rpx;
  color: #16A34A;
  font-weight: 700;
}

.noise-radio {
  width: 38rpx;
  height: 38rpx;
  border-radius: 50%;
  border: 2rpx solid #CBD5E1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.noise-radio.active {
  border-color: #16A34A;
}

.noise-radio-dot {
  width: 18rpx;
  height: 18rpx;
  border-radius: 50%;
  background: #16A34A;
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 18rpx 24rpx calc(18rpx + env(safe-area-inset-bottom));
  background: rgba(244, 246, 248, 0.98);
  backdrop-filter: blur(12px);
  border-top: 1rpx solid rgba(229, 234, 240, 0.9);
  box-sizing: border-box;
}

.secondary-btn,
.primary-btn {
  height: 88rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.secondary-btn {
  width: 196rpx;
  background: #FFFFFF;
  border: 1rpx solid #E5EAF0;
}

.secondary-btn-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #475569;
}

.primary-btn {
  flex: 1;
  background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
  box-shadow: 0 12rpx 24rpx rgba(34, 197, 94, 0.18);
}

.primary-btn.full {
  width: 100%;
}

.primary-btn.disabled {
  background: #CBD5E1;
  box-shadow: none;
}

.primary-btn-text {
  font-size: 30rpx;
  font-weight: 700;
  color: #FFFFFF;
}
</style>
