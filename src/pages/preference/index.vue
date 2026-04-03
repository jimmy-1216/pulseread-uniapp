<template>
  <view class="pref-page">
    <!-- 导航栏 -->
    <view class="nav-bar">
      <text class="nav-title">偏好设置</text>
    </view>

    <scroll-view scroll-y class="content-scroll">
      <!-- 降噪档位 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">降噪档位</text>
          <text class="section-sub">控制每日资讯密度</text>
        </view>
        <view class="noise-list">
          <view
            v-for="level in NOISE_LEVEL_CONFIGS"
            :key="level.key"
            class="noise-item"
            :style="{
              borderColor: localNoiseLevel === level.key ? '#1DB954' : '#EBEBEB',
              background: localNoiseLevel === level.key ? '#E8F8EE' : '#FAFAFA',
            }"
            @tap="localNoiseLevel = level.key"
          >
            <text class="noise-icon">{{ level.icon }}</text>
            <view class="noise-text">
              <view class="noise-label-row">
                <text class="noise-label">{{ level.label }}</text>
                <view v-if="level.recommended" class="rec-badge">
                  <text class="rec-text">推荐</text>
                </view>
              </view>
              <text class="noise-desc">{{ level.description }}</text>
              <text class="noise-count" style="color: #1DB954;">{{ level.dailyCount }}</text>
            </view>
            <view
              class="noise-radio"
              :style="{ borderColor: localNoiseLevel === level.key ? '#1DB954' : '#D0D0D0' }"
            >
              <view v-if="localNoiseLevel === level.key" class="noise-radio-inner" />
            </view>
          </view>
        </view>
      </view>

      <!-- 订阅领域 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">订阅领域</text>
          <text class="section-sub">至少选择 1 个</text>
        </view>
        <view class="domain-grid">
          <view
            v-for="domain in DOMAIN_CONFIGS"
            :key="domain.key"
            class="domain-card"
            :style="{
              borderColor: localDomains.includes(domain.key) ? domain.color : '#EBEBEB',
              background: localDomains.includes(domain.key) ? domain.bgColor : '#FAFAFA',
            }"
            @tap="toggleDomain(domain.key)"
          >
            <text class="domain-icon">{{ domain.icon }}</text>
            <text
              class="domain-label"
              :style="{ color: localDomains.includes(domain.key) ? domain.color : '#1A1A1A' }"
            >{{ domain.label }}</text>
            <text class="domain-desc">{{ domain.description }}</text>
            <view
              v-if="localDomains.includes(domain.key)"
              class="domain-check"
              :style="{ background: domain.color }"
            >
              <text class="check-text">✓</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 雷达词管理 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">雷达词</text>
          <text class="section-sub">实时追踪关键词</text>
        </view>

        <!-- 当前雷达词 -->
        <view class="radar-wrap">
          <view
            v-for="word in localRadarWords"
            :key="word"
            class="radar-chip"
          >
            <text class="radar-chip-text">📡 {{ word }}</text>
            <view class="radar-chip-del" @tap="removeRadarWord(word)">
              <text>✕</text>
            </view>
          </view>
          <view v-if="localRadarWords.length === 0" class="radar-empty">
            <text>暂无雷达词，从下方添加</text>
          </view>
        </view>

        <!-- 添加雷达词 -->
        <view class="add-radar-row">
          <input
            v-model="newRadarWord"
            class="radar-input"
            placeholder="输入关键词..."
            :maxlength="20"
            @confirm="addRadarWord"
          />
          <view class="add-radar-btn" @tap="addRadarWord">
            <text>添加</text>
          </view>
        </view>

        <!-- 推荐雷达词 -->
        <view class="suggested-section">
          <text class="suggested-title">推荐关键词</text>
          <view class="tag-wrap">
            <view
              v-for="kw in SUGGESTED_RADAR_WORDS"
              :key="kw"
              class="suggested-tag"
              :class="{ added: localRadarWords.includes(kw) }"
              @tap="toggleSuggestedWord(kw)"
            >
              <text>{{ localRadarWords.includes(kw) ? '✓ ' : '+ ' }}{{ kw }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="bottom-pad" />
    </scroll-view>

    <!-- 保存按钮 -->
    <view class="save-bar">
      <view
        class="save-btn"
        :class="{ changed: hasChanged }"
        @tap="savePreference"
      >
        <text>{{ hasChanged ? '保存设置' : '已是最新' }}</text>
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
  background: #F5F5F5;
}

.nav-bar {
  padding: 20rpx 32rpx 16rpx;
  background: #fff;
  border-bottom: 1rpx solid #F0F0F0;
  flex-shrink: 0;
}

.nav-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #1A1A1A;
}

.content-scroll {
  flex: 1;
  overflow: hidden;
}

.section {
  background: #fff;
  margin: 20rpx 0 0;
  padding: 32rpx;
}

.section-header {
  display: flex;
  align-items: baseline;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #1A1A1A;
}

.section-sub {
  font-size: 24rpx;
  color: #AAAAAA;
}

/* 领域 */
.domain-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.domain-card {
  position: relative;
  padding: 28rpx 24rpx;
  border-radius: 20rpx;
  border: 3rpx solid #EBEBEB;
  background: #FAFAFA;
}

.domain-icon {
  font-size: 40rpx;
  display: block;
  margin-bottom: 12rpx;
}

.domain-label {
  font-size: 26rpx;
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
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-text {
  color: #fff;
  font-size: 18rpx;
  font-weight: 700;
}

/* 降噪 */
.noise-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.noise-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx;
  border-radius: 20rpx;
  border: 3rpx solid #EBEBEB;
  background: #FAFAFA;
}

.noise-icon {
  font-size: 40rpx;
  width: 48rpx;
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
  margin-bottom: 6rpx;
}

.noise-label {
  font-size: 26rpx;
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
  font-size: 18rpx;
  font-weight: 600;
}

.noise-desc {
  font-size: 22rpx;
  color: #888;
  display: block;
  margin-bottom: 4rpx;
}

.noise-count {
  font-size: 22rpx;
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

/* 雷达词 */
.radar-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  min-height: 60rpx;
  margin-bottom: 24rpx;
}

.radar-chip {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 10rpx 20rpx;
  border-radius: 40rpx;
  background: #F0FDF4;
  border: 1rpx solid #BBF7D0;
}

.radar-chip-text {
  font-size: 24rpx;
  color: #1DB954;
}

.radar-chip-del {
  width: 28rpx;
  height: 28rpx;
  border-radius: 50%;
  background: #BBF7D0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18rpx;
  color: #1DB954;
}

.radar-empty {
  font-size: 24rpx;
  color: #CCCCCC;
  padding: 16rpx 0;
}

.add-radar-row {
  display: flex;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.radar-input {
  flex: 1;
  height: 72rpx;
  background: #F5F5F5;
  border-radius: 36rpx;
  padding: 0 24rpx;
  font-size: 26rpx;
  color: #333;
}

.add-radar-btn {
  padding: 0 32rpx;
  height: 72rpx;
  border-radius: 36rpx;
  background: #1DB954;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  color: #fff;
  font-weight: 600;
  flex-shrink: 0;
}

.suggested-section {
  border-top: 1rpx solid #F0F0F0;
  padding-top: 20rpx;
}

.suggested-title {
  font-size: 24rpx;
  color: #888;
  display: block;
  margin-bottom: 16rpx;
}

.tag-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.suggested-tag {
  padding: 10rpx 20rpx;
  border-radius: 40rpx;
  background: #F5F5F5;
  font-size: 24rpx;
  color: #666;
  border: 1rpx solid #E0E0E0;
}

.suggested-tag.added {
  background: #F0FDF4;
  color: #1DB954;
  border-color: #BBF7D0;
}

.bottom-pad {
  height: 160rpx;
}

/* 保存按钮 */
.save-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 32rpx calc(20rpx + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 1rpx solid #F0F0F0;
}

.save-btn {
  width: 100%;
  height: 96rpx;
  border-radius: 24rpx;
  background: #C8C8C8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  color: #fff;
  font-weight: 600;
}

.save-btn.changed {
  background: linear-gradient(135deg, #1DB954 0%, #17A348 100%);
  box-shadow: 0 8rpx 24rpx rgba(29, 185, 84, 0.35);
}
</style>
