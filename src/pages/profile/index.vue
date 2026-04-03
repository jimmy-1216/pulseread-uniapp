<template>
  <view class="profile-page">
    <!-- 绿色渐变头部（用户信息 + 统计） -->
    <view class="green-header">
      <!-- 用户信息行 -->
      <view class="user-row">
        <view class="avatar-wrap">
          <text class="avatar-emoji">🌊</text>
        </view>
        <view class="user-info">
          <view class="name-row">
            <text class="user-name">{{ store.userInfo.nickname }}</text>
            <view class="member-badge">
              <text class="member-text">{{ memberLabel }}</text>
            </view>
          </view>
          <text class="user-id">ID: {{ store.userInfo.id }}</text>
        </view>
        <view class="edit-btn" @tap="showEditDrawer = true">
          <text class="edit-btn-text">编辑资料</text>
        </view>
      </view>

      <!-- 统计数据行 -->
      <view class="stats-row">
        <view class="stat-item" @tap="showReadDrawer = true">
          <text class="stat-num">{{ store.userInfo.readCount }}</text>
          <text class="stat-label">已阅读</text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item" @tap="showCollectedDrawer = true">
          <text class="stat-num">{{ store.collectedArticles.length }}</text>
          <text class="stat-label">已收藏</text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item" @tap="showLikedDrawer = true">
          <text class="stat-num">{{ store.likedArticles.length }}</text>
          <text class="stat-label">已点赞</text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item" @tap="showRadarDrawer = true">
          <text class="stat-num">{{ store.preference.radarWords.length }}</text>
          <text class="stat-label">雷达词</text>
        </view>
      </view>
    </view>

    <!-- 升级 Pro 卡片 -->
    <view v-if="store.userInfo.memberLevel === 'free'" class="upgrade-card" @tap="showDrawer('upgrade')">
      <view class="upgrade-left">
        <text class="upgrade-crown">👑</text>
        <view>
          <text class="upgrade-title">升级 Pro，解锁全部功能</text>
          <text class="upgrade-desc">无限雷达词 · 企业情报 · 数据报告</text>
        </view>
      </view>
      <view class="upgrade-btn">
        <text class="upgrade-btn-text">升级</text>
      </view>
    </view>

    <!-- 功能菜单 -->
    <scroll-view scroll-y class="menu-scroll">
      <!-- 我的内容 -->
      <view class="menu-group">
        <text class="menu-group-title">我的内容</text>
        <view class="menu-card">
          <view class="menu-item" @tap="showCollectedDrawer = true">
            <text class="menu-icon">⭐</text>
            <view class="menu-label-wrap">
              <text class="menu-label">我的收藏</text>
              <text class="menu-sub">已收藏 {{ store.collectedArticles.length }} 篇资讯</text>
            </view>
            <text class="menu-arrow">›</text>
          </view>
          <view class="menu-divider" />
          <view class="menu-item" @tap="showDrawer('history')">
            <text class="menu-icon">📖</text>
            <view class="menu-label-wrap">
              <text class="menu-label">阅读历史</text>
              <text class="menu-sub">最近浏览记录</text>
            </view>
            <text class="menu-arrow">›</text>
          </view>
          <view class="menu-divider" />
          <view class="menu-item" @tap="showDrawer('notification')">
            <text class="menu-icon">🔔</text>
            <view class="menu-label-wrap">
              <text class="menu-label">消息通知</text>
              <text class="menu-sub">雷达词触发提醒</text>
            </view>
            <text class="menu-arrow">›</text>
          </view>
          <view class="menu-divider" />
          <view class="menu-item" @tap="showDrawer('report')">
            <text class="menu-icon">📊</text>
            <view class="menu-label-wrap">
              <text class="menu-label">数据报告</text>
              <text class="menu-sub">每周阅读分析</text>
            </view>
            <text class="menu-arrow">›</text>
          </view>
        </view>
      </view>

      <!-- 设置 -->
      <view class="menu-group">
        <text class="menu-group-title">设置</text>
        <view class="menu-card">
          <view class="menu-item" @tap="goPreference">
            <text class="menu-icon">🎯</text>
            <view class="menu-label-wrap">
              <text class="menu-label">偏好设置</text>
              <text class="menu-sub">领域、降噪、雷达词</text>
            </view>
            <text class="menu-arrow">›</text>
          </view>
          <view class="menu-divider" />
          <view class="menu-item" @tap="showDrawer('privacy')">
            <text class="menu-icon">🔒</text>
            <view class="menu-label-wrap">
              <text class="menu-label">隐私设置</text>
            </view>
            <text class="menu-arrow">›</text>
          </view>
          <view class="menu-divider" />
          <view class="menu-item" @tap="showDrawer('feedback')">
            <text class="menu-icon">💬</text>
            <view class="menu-label-wrap">
              <text class="menu-label">意见反馈</text>
            </view>
            <text class="menu-arrow">›</text>
          </view>
          <view class="menu-divider" />
          <view class="menu-item" @tap="showDrawer('help')">
            <text class="menu-icon">❓</text>
            <view class="menu-label-wrap">
              <text class="menu-label">帮助中心</text>
            </view>
            <text class="menu-arrow">›</text>
          </view>
        </view>
      </view>

      <!-- 重置引导 -->
      <view class="menu-group">
        <view class="menu-card">
          <view class="menu-item" @tap="confirmReset">
            <text class="menu-icon">🔄</text>
            <view class="menu-label-wrap">
              <text class="menu-label danger-label">重新引导设置</text>
            </view>
            <text class="menu-arrow">›</text>
          </view>
        </view>
      </view>

      <view class="bottom-pad" />
    </scroll-view>

    <!-- 收藏文章抽屉 -->
    <view v-if="showCollectedDrawer" class="overlay" @tap="showCollectedDrawer = false">
      <view class="drawer" @tap.stop>
        <view class="drawer-handle" />
        <view class="drawer-header">
          <text class="drawer-title">⭐ 我的收藏</text>
          <view class="drawer-close" @tap="showCollectedDrawer = false"><text>✕</text></view>
        </view>
        <scroll-view scroll-y class="drawer-scroll">
          <view v-if="store.collectedArticles.length === 0" class="drawer-empty">
            <text class="drawer-empty-icon">⭐</text>
            <text class="drawer-empty-text">还没有收藏任何文章</text>
          </view>
          <view v-else>
            <view
              v-for="a in store.collectedArticles"
              :key="a.id"
              class="drawer-article-item"
              @tap="openArticle(a.id)"
            >
              <text class="drawer-article-title">{{ a.title }}</text>
              <text class="drawer-article-meta">{{ a.source }} · {{ a.publishTime }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 点赞文章抽屉 -->
    <view v-if="showLikedDrawer" class="overlay" @tap="showLikedDrawer = false">
      <view class="drawer" @tap.stop>
        <view class="drawer-handle" />
        <view class="drawer-header">
          <text class="drawer-title">👍 我的点赞</text>
          <view class="drawer-close" @tap="showLikedDrawer = false"><text>✕</text></view>
        </view>
        <scroll-view scroll-y class="drawer-scroll">
          <view v-if="store.likedArticles.length === 0" class="drawer-empty">
            <text class="drawer-empty-icon">👍</text>
            <text class="drawer-empty-text">还没有点赞任何文章</text>
          </view>
          <view v-else>
            <view
              v-for="a in store.likedArticles"
              :key="a.id"
              class="drawer-article-item"
              @tap="openArticle(a.id)"
            >
              <text class="drawer-article-title">{{ a.title }}</text>
              <text class="drawer-article-meta">{{ a.source }} · {{ a.publishTime }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 雷达词抽屉 -->
    <view v-if="showRadarDrawer" class="overlay" @tap="showRadarDrawer = false">
      <view class="drawer" @tap.stop>
        <view class="drawer-handle" />
        <view class="drawer-header">
          <text class="drawer-title">📡 我的雷达词</text>
          <view class="drawer-close" @tap="showRadarDrawer = false"><text>✕</text></view>
        </view>
        <scroll-view scroll-y class="drawer-scroll">
          <view v-if="store.preference.radarWords.length === 0" class="drawer-empty">
            <text class="drawer-empty-icon">📡</text>
            <text class="drawer-empty-text">还没有设置雷达词</text>
            <view class="drawer-action-btn" @tap="goPreference"><text>前往设置</text></view>
          </view>
          <view v-else class="radar-content">
            <view class="radar-card">
              <text class="radar-card-title">当前雷达词</text>
              <view class="radar-chips">
                <view v-for="word in store.preference.radarWords" :key="word" class="radar-chip">
                  <text>📡 {{ word }}</text>
                </view>
              </view>
            </view>
            <view class="drawer-action-btn" @tap="goPreference"><text>管理雷达词</text></view>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 通用信息抽屉 -->
    <view v-if="activeInfoDrawer" class="overlay" @tap="activeInfoDrawer = ''">
      <view class="drawer" @tap.stop>
        <view class="drawer-handle" />
        <view class="drawer-header">
          <text class="drawer-title">{{ infoDrawerConfig.title }}</text>
          <view class="drawer-close" @tap="activeInfoDrawer = ''"><text>✕</text></view>
        </view>
        <view class="info-drawer-content">
          <text class="info-drawer-icon">{{ infoDrawerConfig.icon }}</text>
          <text class="info-drawer-text">{{ infoDrawerConfig.text }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '../../store/useAppStore'

const store = useAppStore()
const showCollectedDrawer = ref(false)
const showLikedDrawer = ref(false)
const showRadarDrawer = ref(false)
const showReadDrawer = ref(false)
const showEditDrawer = ref(false)
const activeInfoDrawer = ref('')

const MEMBER_CONFIGS = {
  free: { label: '免费版', color: '#1DB954', bg: 'rgba(255,255,255,0.9)' },
  pro: { label: 'Pro 会员', color: '#FA8C16', bg: 'rgba(255,255,255,0.9)' },
  enterprise: { label: '企业版', color: '#1677FF', bg: 'rgba(255,255,255,0.9)' },
}

const memberLabel = computed(() => MEMBER_CONFIGS[store.userInfo.memberLevel]?.label ?? '免费版')

const INFO_DRAWERS: Record<string, { title: string; icon: string; text: string }> = {
  upgrade: {
    title: '升级 Pro',
    icon: '👑',
    text: 'Pro 版本提供无限雷达词追踪、企业情报分析、每周数据报告等高级功能。升级后立即解锁全部权益。',
  },
  history: {
    title: '阅读历史',
    icon: '📖',
    text: '您最近浏览的资讯将在这里显示。阅读历史仅保存在本地，不会上传到服务器。',
  },
  notification: {
    title: '消息通知',
    icon: '🔔',
    text: '当您设置的雷达词出现在最新资讯中，系统将自动为您推送通知。请在设置中开启通知权限。',
  },
  report: {
    title: '数据报告',
    icon: '📊',
    text: '每周为您生成个性化阅读分析报告，包括阅读时长、领域分布、热点追踪等维度。Pro 版本专属功能。',
  },
  privacy: {
    title: '隐私设置',
    icon: '🔒',
    text: '您的数据完全本地存储，不上传任何个人信息。微澜严格遵守隐私保护原则，不会将您的阅读记录和偏好设置分享给第三方。',
  },
  feedback: {
    title: '意见反馈',
    icon: '💬',
    text: '感谢您的使用！如有建议或问题，请联系我们的产品团队。您的反馈将帮助我们持续改进产品体验。',
  },
  help: {
    title: '帮助中心',
    icon: '❓',
    text: '遇到问题？请查阅使用文档或联系在线客服获取帮助。我们的客服团队将在工作日 9:00-18:00 为您提供支持。',
  },
}

const infoDrawerConfig = computed(() => INFO_DRAWERS[activeInfoDrawer.value] ?? { title: '', icon: '', text: '' })

function showDrawer(key: string) {
  activeInfoDrawer.value = key
}

function goPreference() {
  showRadarDrawer.value = false
  uni.switchTab({ url: '/pages/preference/index' })
}

function openArticle(id: number) {
  store.setCurrentArticle(id)
  showCollectedDrawer.value = false
  showLikedDrawer.value = false
  uni.navigateTo({ url: '/pages/article/index' })
}

function confirmReset() {
  uni.showModal({
    title: '重置引导',
    content: '确定要重新进行引导设置吗？',
    success(res) {
      if (res.confirm) {
        store.resetOnboarding()
        uni.reLaunch({ url: '/pages/onboarding/index' })
      }
    },
  })
}
</script>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #F5F5F5;
}

/* 绿色渐变头部 */
.green-header {
  background: linear-gradient(160deg, #1DB954 0%, #17A348 100%);
  padding: 40rpx 32rpx 32rpx;
}

/* 用户信息行 */
.user-row {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 40rpx;
}

.avatar-wrap {
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-emoji {
  font-size: 56rpx;
}

.user-info {
  flex: 1;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 8rpx;
}

.user-name {
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
}

.member-badge {
  display: inline-flex;
  align-items: center;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.9);
}

.member-text {
  font-size: 22rpx;
  font-weight: 600;
  color: #1DB954;
}

.user-id {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.75);
}

.edit-btn {
  padding: 12rpx 28rpx;
  border-radius: 40rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
}

.edit-btn-text {
  font-size: 26rpx;
  color: #fff;
  font-weight: 500;
}

/* 统计数据行 */
.stats-row {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20rpx;
  padding: 24rpx 0;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
}

.stat-num {
  font-size: 44rpx;
  font-weight: 700;
  color: #fff;
}

.stat-label {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
}

.stat-divider {
  width: 1rpx;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.3);
}

/* 升级 Pro 卡片 */
.upgrade-card {
  margin: 20rpx 24rpx 0;
  background: #FFFBE6;
  border-radius: 20rpx;
  padding: 24rpx 28rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1rpx solid #FFE58F;
}

.upgrade-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex: 1;
}

.upgrade-crown {
  font-size: 44rpx;
  flex-shrink: 0;
}

.upgrade-title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: #7C4A00;
  margin-bottom: 6rpx;
}

.upgrade-desc {
  font-size: 22rpx;
  color: #B07800;
}

.upgrade-btn {
  background: #FA8C16;
  border-radius: 40rpx;
  padding: 14rpx 36rpx;
  flex-shrink: 0;
}

.upgrade-btn-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #fff;
}

/* 菜单 */
.menu-scroll {
  flex: 1;
  overflow: hidden;
  margin-top: 20rpx;
}

.menu-group {
  margin-bottom: 20rpx;
  padding: 0 24rpx;
}

.menu-group-title {
  font-size: 24rpx;
  color: #AAAAAA;
  display: block;
  margin-bottom: 12rpx;
  padding-left: 4rpx;
}

.menu-card {
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx 28rpx;
}

.menu-icon {
  font-size: 36rpx;
  width: 44rpx;
  text-align: center;
  flex-shrink: 0;
}

.menu-label-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.menu-label {
  font-size: 28rpx;
  color: #1A1A1A;
}

.menu-sub {
  font-size: 22rpx;
  color: #AAAAAA;
}

.menu-arrow {
  font-size: 36rpx;
  color: #D0D0D0;
  flex-shrink: 0;
}

.menu-divider {
  height: 1rpx;
  background: #F5F5F5;
  margin: 0 28rpx;
}

.danger-label {
  color: #FF4D4F;
}

.bottom-pad {
  height: 60rpx;
}

/* 抽屉 */
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

.drawer {
  background: #fff;
  border-radius: 40rpx 40rpx 0 0;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.drawer-handle {
  width: 72rpx;
  height: 8rpx;
  background: #E0E0E0;
  border-radius: 4rpx;
  margin: 20rpx auto 0;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx 20rpx;
  border-bottom: 1rpx solid #F5F5F5;
}

.drawer-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #1A1A1A;
}

.drawer-close {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #888;
}

.drawer-scroll {
  flex: 1;
  overflow: hidden;
}

.drawer-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0;
  gap: 16rpx;
}

.drawer-empty-icon {
  font-size: 64rpx;
}

.drawer-empty-text {
  font-size: 28rpx;
  color: #AAAAAA;
}

.drawer-article-item {
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #F5F5F5;
}

.drawer-article-title {
  font-size: 28rpx;
  color: #1A1A1A;
  display: block;
  margin-bottom: 8rpx;
  line-height: 1.5;
}

.drawer-article-meta {
  font-size: 22rpx;
  color: #AAAAAA;
}

.drawer-action-btn {
  margin: 24rpx 32rpx;
  background: #1DB954;
  border-radius: 40rpx;
  padding: 20rpx;
  text-align: center;
  font-size: 28rpx;
  color: #fff;
  font-weight: 600;
}

.radar-content {
  padding: 16rpx 0;
}

.radar-card {
  margin: 0 32rpx 24rpx;
  background: #F9F9F9;
  border-radius: 16rpx;
  padding: 24rpx;
}

.radar-card-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #666;
  display: block;
  margin-bottom: 16rpx;
}

.radar-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.radar-chip {
  background: #F0FDF4;
  border: 1rpx solid #BBF7D0;
  border-radius: 40rpx;
  padding: 8rpx 20rpx;
  font-size: 24rpx;
  color: #16a34a;
}

/* 通用信息抽屉 */
.info-drawer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48rpx 48rpx 64rpx;
  gap: 24rpx;
}

.info-drawer-icon {
  font-size: 80rpx;
}

.info-drawer-text {
  font-size: 28rpx;
  color: #555;
  line-height: 1.8;
  text-align: center;
}
</style>
