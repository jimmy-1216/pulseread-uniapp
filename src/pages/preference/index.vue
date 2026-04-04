<template>
  <view class="pref-page">
    <view class="top-shell">
      <view class="nav-bar">
        <view>
          <text class="nav-title">阅读偏好</text>
          <text class="nav-subtitle">管理关注领域、阅读密度与雷达词</text>
        </view>
      </view>

      <view class="preference-summary">
        <view class="summary-item">
          <text class="summary-num">{{ localDomains.length }}</text>
          <text class="summary-label">已关注领域</text>
        </view>
        <view class="summary-divider" />
        <view class="summary-item">
          <text class="summary-num">{{ localRadarWords.length }}</text>
          <text class="summary-label">雷达词</text>
        </view>
        <view class="summary-divider" />
        <view class="summary-item">
          <text class="summary-num summary-text">{{ currentNoiseLabel }}</text>
          <text class="summary-label">阅读密度</text>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="content-scroll">
      <view class="section-card">
        <view class="section-header">
          <view>
            <text class="section-title">阅读密度</text>
            <text class="section-sub">决定你每天看到的资讯量与筛选强度</text>
          </view>
        </view>
        <view class="noise-list">
          <view
            v-for="level in NOISE_LEVEL_CONFIGS"
            :key="level.key"
            class="noise-item"
            :class="{ active: localNoiseLevel === level.key }"
            @tap="localNoiseLevel = level.key"
          >
            <view class="noise-main">
              <view class="noise-label-row">
                <text class="noise-label">{{ level.label }}</text>
                <view v-if="level.recommended" class="rec-badge">
                  <text class="rec-text">推荐</text>
                </view>
              </view>
              <text class="noise-desc">{{ level.description }}</text>
              <text class="noise-count">{{ level.dailyCount }}</text>
            </view>
            <view class="noise-radio">
              <view v-if="localNoiseLevel === level.key" class="noise-radio-inner" />
            </view>
          </view>
        </view>
      </view>

      <view class="section-card">
        <view class="section-header">
          <view>
            <text class="section-title">关注领域</text>
            <text class="section-sub">至少保留一个领域，首页会按你的选择推荐内容</text>
          </view>
        </view>
        <view class="domain-grid">
          <view
            v-for="domain in DOMAIN_CONFIGS"
            :key="domain.key"
            class="domain-card"
            :class="{ active: localDomains.includes(domain.key) }"
            :style="localDomains.includes(domain.key) ? { borderColor: domain.color, background: domain.bgColor } : {}"
            @tap="toggleDomain(domain.key)"
          >
            <view class="domain-card-top">
              <view class="domain-pill" :style="{ color: domain.color, background: domain.bgColor }">
                <text>{{ domain.label }}</text>
              </view>
              <view
                v-if="localDomains.includes(domain.key)"
                class="domain-check"
                :style="{ background: domain.color }"
              >
                <text class="check-text">✓</text>
              </view>
            </view>
            <text
              class="domain-label"
              :style="{ color: localDomains.includes(domain.key) ? domain.color : '#0F172A' }"
            >{{ domain.label }}</text>
            <text class="domain-desc">{{ domain.description }}</text>
          </view>
        </view>
      </view>

      <view class="section-card">
        <view class="section-header">
          <view>
            <text class="section-title">雷达词</text>
            <text class="section-sub">追踪公司、产品、政策或赛道关键词</text>
          </view>
          <text class="section-side">最多 20 个</text>
        </view>

        <view class="radar-wrap">
          <view
            v-for="word in localRadarWords"
            :key="word"
            class="radar-chip"
          >
            <text class="radar-chip-text">{{ word }}</text>
            <view class="radar-chip-del" @tap="removeRadarWord(word)">
              <text>×</text>
            </view>
          </view>
          <view v-if="localRadarWords.length === 0" class="radar-empty">
            <text>还没有添加雷达词，试试从下面的推荐词开始</text>
          </view>
        </view>

        <view class="add-radar-row">
          <input
            v-model="newRadarWord"
            class="radar-input"
            placeholder="输入关键词，例如 OpenAI、A股、机器人"
            :maxlength="20"
            @confirm="addRadarWord"
          />
          <view class="add-radar-btn" @tap="addRadarWord">
            <text>添加</text>
          </view>
        </view>

        <view class="suggested-section">
          <text class="suggested-title">推荐词</text>
          <view class="tag-wrap">
            <view
              v-for="kw in SUGGESTED_RADAR_WORDS"
              :key="kw"
              class="suggested-tag"
              :class="{ added: localRadarWords.includes(kw) }"
              @tap="toggleSuggestedWord(kw)"
            >
              <text>{{ localRadarWords.includes(kw) ? '已添加 · ' : '+ ' }}{{ kw }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="bottom-pad" />
    </scroll-view>

    <view class="save-bar">
      <view class="save-hint">
        <text>{{ hasChanged ? '你有未保存的偏好修改' : '当前设置已同步' }}</text>
      </view>
      <view class="save-btn" :class="{ changed: hasChanged }" @tap="savePreference">
        <text>{{ hasChanged ? '保存偏好' : '已保存' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '../../store/useAppStore'
import { DOMAIN_CONFIGS, NOISE_LEVEL_CONFIGS, SUGGESTED_RADAR_WORDS } from '../../data/constants'
import type { DomainType, NoiseLevelType } from '../../data/types'

const store = useAppStore()

const localDomains = ref<DomainType[]>([...store.preference.domains])
const localNoiseLevel = ref<NoiseLevelType>(store.preference.noiseLevel)
const localRadarWords = ref<string[]>([...store.preference.radarWords])
const newRadarWord = ref('')

const hasChanged = computed(() => {
  const origDomains = JSON.stringify([...store.preference.domains].sort())
  const localD = JSON.stringify([...localDomains.value].sort())
  return (
    origDomains !== localD ||
    localNoiseLevel.value !== store.preference.noiseLevel ||
    JSON.stringify(localRadarWords.value) !== JSON.stringify(store.preference.radarWords)
  )
})

const currentNoiseLabel = computed(() => {
  return NOISE_LEVEL_CONFIGS.find(item => item.key === localNoiseLevel.value)?.label ?? '默认'
})

function toggleDomain(key: DomainType) {
  const idx = localDomains.value.indexOf(key)
  if (idx >= 0) {
    if (localDomains.value.length === 1) {
      uni.showToast({ title: '至少保留一个领域', icon: 'none' })
      return
    }
    localDomains.value.splice(idx, 1)
  } else {
    localDomains.value.push(key)
  }
}

function addRadarWord() {
  const word = newRadarWord.value.trim()
  if (!word) return
  if (localRadarWords.value.includes(word)) {
    uni.showToast({ title: '已存在该雷达词', icon: 'none' })
    return
  }
  if (localRadarWords.value.length >= 20) {
    uni.showToast({ title: '最多添加 20 个雷达词', icon: 'none' })
    return
  }
  localRadarWords.value.push(word)
  newRadarWord.value = ''
}

function removeRadarWord(word: string) {
  localRadarWords.value = localRadarWords.value.filter(w => w !== word)
}

function toggleSuggestedWord(kw: string) {
  if (localRadarWords.value.includes(kw)) {
    removeRadarWord(kw)
  } else {
    if (localRadarWords.value.length >= 20) {
      uni.showToast({ title: '最多添加 20 个雷达词', icon: 'none' })
      return
    }
    localRadarWords.value.push(kw)
  }
}

function savePreference() {
  if (!hasChanged.value) return
  store.updatePreference({
    domains: [...localDomains.value],
    noiseLevel: localNoiseLevel.value,
    radarWords: [...localRadarWords.value],
  })
  uni.showToast({ title: '设置已保存', icon: 'success' })
}
</script>

<style scoped>
.pref-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #F4F6F8;
}

.top-shell {
  background: #F8FBF9;
  border-bottom-left-radius: 26rpx;
  border-bottom-right-radius: 26rpx;
  border-bottom: 1rpx solid #E7EDF2;
}

.nav-bar {
  padding: 24rpx 24rpx 12rpx;
}

.nav-title {
  display: block;
  font-size: 34rpx;
  font-weight: 700;
  color: #0F172A;
}

.nav-subtitle {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #94A3B8;
  line-height: 1.6;
}

.preference-summary {
  margin: 0 24rpx 18rpx;
  padding: 20rpx 24rpx;
  background: #FFFFFF;
  border: 1rpx solid #E5EAF0;
  border-radius: 22rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.summary-item {
  flex: 1;
  text-align: center;
}

.summary-num {
  display: block;
  font-size: 30rpx;
  line-height: 1.2;
  font-weight: 700;
  color: #16A34A;
}

.summary-text {
  font-size: 24rpx;
}

.summary-label {
  display: block;
  margin-top: 8rpx;
  font-size: 21rpx;
  color: #94A3B8;
}

.summary-divider {
  width: 1rpx;
  height: 56rpx;
  background: #E5EAF0;
}

.content-scroll {
  flex: 1;
  overflow: hidden;
}

.section-card {
  margin: 20rpx 24rpx 0;
  padding: 24rpx;
  background: #FFFFFF;
  border-radius: 22rpx;
  border: 1rpx solid #E5EAF0;
}

.section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
  margin-bottom: 20rpx;
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
  line-height: 1.6;
}

.section-side {
  font-size: 21rpx;
  color: #94A3B8;
}

.noise-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.noise-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  padding: 22rpx 20rpx;
  border-radius: 20rpx;
  background: #F8FAFC;
  border: 1rpx solid transparent;
}

.noise-item.active {
  background: #F0FDF4;
  border-color: #BBF7D0;
}

.noise-main {
  flex: 1;
  min-width: 0;
}

.noise-label-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.noise-label {
  font-size: 27rpx;
  font-weight: 700;
  color: #0F172A;
}

.rec-badge {
  height: 34rpx;
  padding: 0 12rpx;
  border-radius: 999rpx;
  background: #DCFCE7;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.rec-text {
  font-size: 19rpx;
  font-weight: 700;
  color: #15803D;
}

.noise-desc,
.noise-count {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #94A3B8;
}

.noise-radio {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 2rpx solid #CBD5E1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.noise-item.active .noise-radio {
  border-color: #16A34A;
}

.noise-radio-inner {
  width: 18rpx;
  height: 18rpx;
  border-radius: 50%;
  background: #16A34A;
}

.domain-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14rpx;
}

.domain-card {
  padding: 20rpx;
  border-radius: 20rpx;
  background: #FFFFFF;
  border: 1rpx solid #E5EAF0;
}

.domain-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.domain-pill {
  min-width: 88rpx;
  height: 40rpx;
  padding: 0 14rpx;
  border-radius: 999rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.domain-pill text {
  font-size: 21rpx;
  font-weight: 700;
}

.domain-check {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-text {
  font-size: 21rpx;
  color: #FFFFFF;
  font-weight: 700;
}

.domain-label {
  display: block;
  font-size: 27rpx;
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

.radar-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.radar-chip {
  min-height: 56rpx;
  padding: 0 14rpx 0 18rpx;
  border-radius: 999rpx;
  background: #F1F5F9;
  display: inline-flex;
  align-items: center;
  gap: 10rpx;
}

.radar-chip-text {
  font-size: 23rpx;
  color: #334155;
  font-weight: 600;
}

.radar-chip-del {
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  background: #CBD5E1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radar-chip-del text {
  font-size: 18rpx;
  color: #FFFFFF;
  line-height: 1;
}

.radar-empty {
  width: 100%;
  padding: 24rpx 20rpx;
  border-radius: 18rpx;
  background: #F8FAFC;
}

.radar-empty text {
  font-size: 22rpx;
  color: #94A3B8;
  line-height: 1.6;
}

.add-radar-row {
  display: flex;
  gap: 12rpx;
  margin-top: 18rpx;
}

.radar-input {
  flex: 1;
  height: 74rpx;
  padding: 0 22rpx;
  background: #F8FAFC;
  border: 1rpx solid #E5EAF0;
  border-radius: 18rpx;
  font-size: 26rpx;
  color: #0F172A;
}

.add-radar-btn {
  min-width: 128rpx;
  height: 74rpx;
  border-radius: 18rpx;
  background: #16A34A;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-radar-btn text {
  font-size: 25rpx;
  color: #FFFFFF;
  font-weight: 700;
}

.suggested-section {
  margin-top: 20rpx;
}

.suggested-title {
  display: block;
  margin-bottom: 12rpx;
  font-size: 23rpx;
  color: #64748B;
}

.tag-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.suggested-tag {
  min-height: 54rpx;
  padding: 0 18rpx;
  border-radius: 999rpx;
  background: #F8FAFC;
  border: 1rpx solid #E5EAF0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.suggested-tag.added {
  background: #ECFDF3;
  border-color: #BBF7D0;
}

.suggested-tag text {
  font-size: 22rpx;
  color: #475569;
  font-weight: 600;
}

.suggested-tag.added text {
  color: #15803D;
}

.bottom-pad {
  height: 144rpx;
}

.save-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 18rpx 24rpx calc(env(safe-area-inset-bottom) + 18rpx);
  background: rgba(255, 255, 255, 0.96);
  border-top: 1rpx solid #E5EAF0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.save-hint {
  flex: 1;
  min-width: 0;
}

.save-hint text {
  font-size: 22rpx;
  color: #94A3B8;
}

.save-btn {
  min-width: 180rpx;
  height: 72rpx;
  border-radius: 999rpx;
  background: #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.save-btn.changed {
  background: #16A34A;
}

.save-btn text {
  font-size: 25rpx;
  color: #FFFFFF;
  font-weight: 700;
}
</style>
