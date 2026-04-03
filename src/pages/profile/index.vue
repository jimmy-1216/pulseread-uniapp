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
          <view class="user-id-row">
            <text class="user-id">ID: {{ store.userInfo.id }}</text>
          </view>
        </view>
        <!-- 编辑资料移出 flex 布局，使用绝对定位 -->
        <view class="edit-btn-absolute" @tap="showDrawer('upgrade')">
          <text class="edit-btn-text">编辑资料</text>
        </view>
      </view>

      <!-- 统计数据行 -->
      <view class="stats-row">
        <view class="stat-item" @tap="openDrawer('history')">
          <text class="stat-num">{{ store.userInfo.readCount }}</text>
          <text class="stat-label">已阅读</text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item" @tap="openDrawer('collect')">
          <text class="stat-num">{{ store.collectedArticles.length }}</text>
          <text class="stat-label">已收藏</text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item" @tap="openDrawer('liked')">
          <text class="stat-num">{{ store.likedArticles.length }}</text>
          <text class="stat-label">已点赞</text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item" @tap="openDrawer('radar')">
          <text class="stat-num">{{ store.preference.radarWords.length }}</text>
          <text class="stat-label">雷达词</text>
        </view>
      </view>
    </view>

    <!-- 升级 Pro 卡片 -->
    <view v-if="store.userInfo.memberLevel === 'free'" class="upgrade-card" @tap="openDrawer('upgrade')">
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
          <view class="menu-item" @tap="openDrawer('collect')">
            <text class="menu-icon">⭐</text>
            <view class="menu-label-wrap">
              <text class="menu-label">我的收藏</text>
              <text class="menu-sub">已收藏 {{ store.collectedArticles.length }} 篇资讯</text>
            </view>
            <text class="menu-arrow">›</text>
          </view>
          <view class="menu-divider" />
          <view class="menu-item" @tap="openDrawer('history')">
            <text class="menu-icon">📖</text>
            <view class="menu-label-wrap">
              <text class="menu-label">阅读历史</text>
              <text class="menu-sub">最近浏览记录</text>
            </view>
            <text class="menu-arrow">›</text>
          </view>
          <view class="menu-divider" />
          <view class="menu-item" @tap="openDrawer('notification')">
            <text class="menu-icon">🔔</text>
            <view class="menu-label-wrap">
              <text class="menu-label">消息通知</text>
              <text class="menu-sub">雷达词触发提醒</text>
            </view>
            <text class="menu-arrow">›</text>
          </view>
          <view class="menu-divider" />
          <view class="menu-item" @tap="openDrawer('report')">
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
          <view class="menu-item" @tap="openDrawer('privacy')">
            <text class="menu-icon">🔒</text>
            <view class="menu-label-wrap">
              <text class="menu-label">隐私设置</text>
            </view>
            <text class="menu-arrow">›</text>
          </view>
          <view class="menu-divider" />
          <view class="menu-item" @tap="openDrawer('feedback')">
            <text class="menu-icon">💬</text>
            <view class="menu-label-wrap">
              <text class="menu-label">意见反馈</text>
            </view>
            <text class="menu-arrow">›</text>
          </view>
          <view class="menu-divider" />
          <view class="menu-item" @tap="openDrawer('help')">
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

    <!-- ═══════════════════════════════════════════════════════
         统一抽屉容器（所有抽屉共用遮罩 + 动画）
    ═══════════════════════════════════════════════════════ -->
    <view
      v-show="activeDrawer !== ''"
      class="overlay"
      :class="{ 'overlay-visible': drawerVisible }"
      @tap="closeDrawer"
    >
      <!-- ── 我的收藏 ── -->
      <view
        v-show="activeDrawer === 'collect'"
        class="drawer"
        :class="{ 'drawer-open': drawerVisible && activeDrawer === 'collect' }"
        @tap.stop
      >
        <view class="drawer-handle" />
        <view class="drawer-header">
          <text class="drawer-title">我的收藏</text>
          <view class="drawer-close-btn" @tap="closeDrawer">
            <svg-close />
          </view>
        </view>
        <scroll-view scroll-y class="drawer-scroll">
          <view class="drawer-body">
            <view v-if="store.collectedArticles.length === 0" class="drawer-empty">
              <text class="drawer-empty-icon">⭐</text>
              <text class="drawer-empty-title">还没有收藏的资讯</text>
              <text class="drawer-empty-sub">在文章详情页点击收藏星标</text>
            </view>
            <view v-else class="article-card-list">
              <view
                v-for="a in store.collectedArticles"
                :key="a.id"
                class="article-card"
                @tap="openArticle(a.id, 'collect')"
              >
                <text class="article-card-title">{{ a.title }}</text>
                <view class="article-card-meta">
                  <text class="meta-source">{{ a.source }}</text>
                  <text class="meta-dot">·</text>
                  <text class="meta-time">{{ a.publishTime }}</text>
                  <text class="meta-tag collected">⭐ 已收藏</text>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- ── 阅读历史 ── -->
      <view
        v-show="activeDrawer === 'history'"
        class="drawer"
        :class="{ 'drawer-open': drawerVisible && activeDrawer === 'history' }"
        @tap.stop
      >
        <view class="drawer-handle" />
        <view class="drawer-header">
          <text class="drawer-title">阅读历史</text>
          <view class="drawer-close-btn" @tap="closeDrawer">
            <svg-close />
          </view>
        </view>
        <scroll-view scroll-y class="drawer-scroll">
          <view class="drawer-body">
            <view v-if="historyArticles.length === 0" class="drawer-empty">
              <text class="drawer-empty-icon">📖</text>
              <text class="drawer-empty-title">暂无阅读记录</text>
              <text class="drawer-empty-sub">点击资讯卡片开始阅读</text>
            </view>
            <view v-else class="article-card-list">
              <view
                v-for="(a, i) in historyArticles"
                :key="`${a.id}-${i}`"
                class="article-card"
                @tap="openArticle(a.id, 'history')"
              >
                <text class="article-card-title">{{ a.title }}</text>
                <view class="article-card-meta">
                  <text class="meta-source">{{ a.source }}</text>
                  <text class="meta-dot">·</text>
                  <text class="meta-time">{{ a.publishTime }}</text>
                  <text class="meta-tag read">📖 已读</text>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- ── 我的点赞 ── -->
      <view
        v-show="activeDrawer === 'liked'"
        class="drawer"
        :class="{ 'drawer-open': drawerVisible && activeDrawer === 'liked' }"
        @tap.stop
      >
        <view class="drawer-handle" />
        <view class="drawer-header">
          <text class="drawer-title">我的点赞</text>
          <view class="drawer-close-btn" @tap="closeDrawer">
            <svg-close />
          </view>
        </view>
        <scroll-view scroll-y class="drawer-scroll">
          <view class="drawer-body">
            <view v-if="store.likedArticles.length === 0" class="drawer-empty">
              <text class="drawer-empty-icon">👍</text>
              <text class="drawer-empty-title">还没有点赞任何文章</text>
              <text class="drawer-empty-sub">在文章详情页点击点赞</text>
            </view>
            <view v-else class="article-card-list">
              <view
                v-for="a in store.likedArticles"
                :key="a.id"
                class="article-card"
                @tap="openArticle(a.id, 'liked')"
              >
                <text class="article-card-title">{{ a.title }}</text>
                <view class="article-card-meta">
                  <text class="meta-source">{{ a.source }}</text>
                  <text class="meta-dot">·</text>
                  <text class="meta-time">{{ a.publishTime }}</text>
                  <text class="meta-tag liked">👍 已赞</text>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- ── 我的雷达词 ── -->
      <view
        v-show="activeDrawer === 'radar'"
        class="drawer"
        :class="{ 'drawer-open': drawerVisible && activeDrawer === 'radar' }"
        @tap.stop
      >
        <view class="drawer-handle" />
        <view class="drawer-header">
          <text class="drawer-title">我的雷达词</text>
          <view class="drawer-close-btn" @tap="closeDrawer">
            <svg-close />
          </view>
        </view>
        <scroll-view scroll-y class="drawer-scroll">
          <view class="drawer-body">
            <view v-if="store.preference.radarWords.length === 0" class="drawer-empty">
              <text class="drawer-empty-icon">📡</text>
              <text class="drawer-empty-title">还没有设置雷达词</text>
              <text class="drawer-empty-sub">去偏好设置添加关注的关键词</text>
              <view class="drawer-action-btn" @tap="goPreference"><text>前往设置</text></view>
            </view>
            <view v-else class="radar-content">
              <view class="info-card">
                <text class="info-card-label">当前雷达词</text>
                <view class="radar-chips">
                  <view v-for="word in store.preference.radarWords" :key="word" class="radar-chip">
                    <text>📡 {{ word }}</text>
                  </view>
                </view>
              </view>
              <view class="info-card">
                <text class="info-card-label">触发统计</text>
                <text class="info-card-text">本周共触发 <text class="highlight-text">12 次</text>雷达词推送，为您精准捕获关键资讯。</text>
              </view>
              <view class="drawer-action-btn" @tap="goPreference"><text>管理雷达词</text></view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- ── 消息通知 ── -->
      <view
        v-show="activeDrawer === 'notification'"
        class="drawer"
        :class="{ 'drawer-open': drawerVisible && activeDrawer === 'notification' }"
        @tap.stop
      >
        <view class="drawer-handle" />
        <view class="drawer-header">
          <text class="drawer-title">消息通知</text>
          <view class="drawer-close-btn" @tap="closeDrawer">
            <svg-close />
          </view>
        </view>
        <scroll-view scroll-y class="drawer-scroll">
          <view class="drawer-body">
            <view v-if="store.preference.radarWords.length === 0" class="drawer-empty">
              <text class="drawer-empty-icon">🔔</text>
              <text class="drawer-empty-title">暂无通知</text>
              <text class="drawer-empty-sub">设置雷达词后，系统将自动推送相关资讯</text>
            </view>
            <view v-else class="article-card-list">
              <view
                v-for="(word, i) in store.preference.radarWords"
                :key="word"
                class="article-card"
              >
                <view class="notify-tag-row">
                  <view class="notify-tag"><text>📡 {{ word }}</text></view>
                </view>
                <text class="article-card-title">「{{ word }}」相关资讯已更新 {{ 3 + i }} 条</text>
                <view class="article-card-meta">
                  <text class="meta-time">{{ i === 0 ? '刚刚' : i + '小时前' }}</text>
                  <text class="meta-tag read">🔔 雷达推送</text>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- ── 数据报告 ── -->
      <view
        v-show="activeDrawer === 'report'"
        class="drawer"
        :class="{ 'drawer-open': drawerVisible && activeDrawer === 'report' }"
        @tap.stop
      >
        <view class="drawer-handle" />
        <view class="drawer-header">
          <text class="drawer-title">本周数据报告</text>
          <view class="drawer-close-btn" @tap="closeDrawer">
            <svg-close />
          </view>
        </view>
        <scroll-view scroll-y class="drawer-scroll">
          <view class="drawer-body">
            <view class="report-grid">
              <view class="report-stat-card" style="background:#F0FDF4;">
                <text class="report-stat-icon">📰</text>
                <text class="report-stat-num">{{ store.userInfo.readCount }}</text>
                <text class="report-stat-label">阅读资讯</text>
              </view>
              <view class="report-stat-card" style="background:#FFF7E6;">
                <text class="report-stat-icon">⭐</text>
                <text class="report-stat-num">{{ store.collectedArticles.length }}</text>
                <text class="report-stat-label">收藏资讯</text>
              </view>
              <view class="report-stat-card" style="background:#E6F4FF;">
                <text class="report-stat-icon">👍</text>
                <text class="report-stat-num">{{ store.likedArticles.length }}</text>
                <text class="report-stat-label">点赞资讯</text>
              </view>
              <view class="report-stat-card" style="background:#FFF0F6;">
                <text class="report-stat-icon">📡</text>
                <text class="report-stat-num">{{ store.preference.radarWords.length }}</text>
                <text class="report-stat-label">雷达词</text>
              </view>
            </view>
            <view class="info-card" style="margin-top:0;">
              <text class="info-card-label">最活跃领域</text>
              <view class="domain-tags">
                <view
                  v-for="d in store.preference.domains.slice(0,2)"
                  :key="d"
                  class="domain-tag-item"
                >
                  <text>{{ d === 'tech' ? '科技' : d === 'finance' ? '财经' : d === 'policy' ? '政策' : '商情' }}</text>
                </view>
              </view>
            </view>
            <view v-if="store.userInfo.memberLevel === 'free'" class="pro-hint-card">
              <text class="pro-hint-text">📊 升级 Pro 解锁完整数据报告</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- ── 通用信息抽屉（升级/隐私/反馈/帮助） ── -->
      <view
        v-show="['upgrade','privacy','feedback','help'].includes(activeDrawer)"
        class="drawer"
        :class="{ 'drawer-open': drawerVisible && ['upgrade','privacy','feedback','help'].includes(activeDrawer) }"
        @tap.stop
      >
        <view class="drawer-handle" />
        <view class="drawer-header">
          <text class="drawer-title">{{ infoDrawerConfig.title }}</text>
          <view class="drawer-close-btn" @tap="closeDrawer">
            <svg-close />
          </view>
        </view>
        <view class="info-drawer-content">
          <text class="info-drawer-icon">{{ infoDrawerConfig.icon }}</text>
          <text class="info-drawer-text">{{ infoDrawerConfig.text }}</text>
          <view v-if="activeDrawer === 'upgrade'" class="drawer-action-btn upgrade-action-btn">
            <text>立即升级 Pro</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<!-- SVG 关闭按钮组件 -->
<script lang="ts">
import { defineComponent, h } from 'vue'
const SvgClose = defineComponent({
  name: 'SvgClose',
  render() {
    return h('view', {
      style: 'width:28px;height:28px;display:flex;align-items:center;justify-content:center;'
    }, [
      h('svg', {
        width: '12', height: '12', viewBox: '0 0 12 12', fill: 'none',
        stroke: '#666', 'stroke-width': '1.8', 'stroke-linecap': 'round'
      }, [
        h('path', { d: 'M2 2l8 8M10 2l-8 8' })
      ])
    ])
  }
})
export { SvgClose }
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '../../store/useAppStore'

const store = useAppStore()
const activeDrawer = ref('')
const drawerVisible = ref(false)
let closeTimer: ReturnType<typeof setTimeout> | null = null

const MEMBER_CONFIGS = {
  free: { label: '免费版', color: '#1DB954', bg: 'rgba(255,255,255,0.9)' },
  pro: { label: 'Pro 会员', color: '#FA8C16', bg: 'rgba(255,255,255,0.9)' },
  enterprise: { label: '企业版', color: '#1677FF', bg: 'rgba(255,255,255,0.9)' },
}

const memberLabel = computed(() => MEMBER_CONFIGS[store.userInfo.memberLevel]?.label ?? '免费版')

// 阅读历史 = 收藏 + 点赞，去重，最多 10 条
const historyArticles = computed(() => {
  const seen = new Set<number>()
  const result: typeof store.articles = []
  for (const a of [...store.collectedArticles, ...store.likedArticles]) {
    if (!seen.has(a.id)) {
      seen.add(a.id)
      result.push(a)
    }
    if (result.length >= 10) break
  }
  return result
})

const INFO_DRAWERS: Record<string, { title: string; icon: string; text: string }> = {
  upgrade: {
    title: '升级 Pro',
    icon: '👑',
    text: 'Pro 版本提供无限雷达词追踪、企业情报分析、每周数据报告等高级功能。升级后立即解锁全部权益。',
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

const infoDrawerConfig = computed(() => INFO_DRAWERS[activeDrawer.value] ?? { title: '', icon: '', text: '' })

function openDrawer(key: string) {
  if (closeTimer) clearTimeout(closeTimer)
  activeDrawer.value = key
  // 下一帧触发动画
  setTimeout(() => { drawerVisible.value = true }, 16)
}

function showDrawer(key: string) {
  openDrawer(key)
}

function closeDrawer() {
  drawerVisible.value = false
  closeTimer = setTimeout(() => {
    activeDrawer.value = ''
  }, 360)
}

function goPreference() {
  closeDrawer()
  setTimeout(() => {
    uni.switchTab({ url: '/pages/preference/index' })
  }, 360)
}

function openArticle(id: number, from: string) {
  store.setCurrentArticle(id)
  closeDrawer()
  setTimeout(() => {
    uni.navigateTo({ url: '/pages/article/index' })
  }, 300)
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
  height: 100%;
  background: #F5F5F5;
  position: relative;
  overflow: hidden;
}

/* ── 绿色渐变头部 ── */
.green-header {
  background: linear-gradient(160deg, #1DB954 0%, #17A348 100%);
  padding: 40rpx 32rpx 32rpx 32rpx;
  position: relative;
}

.user-row {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 40rpx;
  position: relative;
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

.avatar-emoji { font-size: 56rpx; }

.user-info { flex: 1; min-width: 0; }

.name-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 8rpx;
  flex-wrap: nowrap;
}

.user-name {
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;
  min-width: 0;
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

.user-id-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.user-id {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.75);
}

.edit-btn-absolute {
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 8rpx 20rpx;
  border-radius: 40rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
}

.edit-btn-text {
  font-size: 24rpx;
  color: #fff;
  font-weight: 500;
}

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

/* ── 升级 Pro 卡片 ── */
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

/* ── 菜单 ── */
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

.danger-label { color: #FF4D4F; }

.bottom-pad { height: 60rpx; }

/* ═══════════════════════════════════════════════════════
   抽屉系统（统一动效）
═══════════════════════════════════════════════════════ */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: flex-end;
  background: rgba(0, 0, 0, 0);
  transition: background 0.35s ease;
  pointer-events: none;
}

.overlay-visible {
  background: rgba(0, 0, 0, 0.45);
  pointer-events: auto;
}

/* 抽屉面板 */
.drawer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #F5F7FA;
  border-radius: 40rpx 40rpx 0 0;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  transform: translateY(100%);
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
  box-shadow: 0 -8rpx 48rpx rgba(0, 0, 0, 0.12);
}

.drawer-open {
  transform: translateY(0);
}

/* 抽屉拖动条 */
.drawer-handle {
  width: 72rpx;
  height: 8rpx;
  background: #E0E0E0;
  border-radius: 4rpx;
  margin: 20rpx auto 0;
  flex-shrink: 0;
}

/* 抽屉头部 */
.drawer-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx 20rpx;
  background: #fff;
  border-radius: 40rpx 40rpx 0 0;
  border-bottom: 1rpx solid #F0F0F0;
}

.drawer-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #1A1A1A;
}

.drawer-close-btn {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: #F0F0F0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 抽屉滚动区 */
.drawer-scroll {
  flex: 1;
  overflow: hidden;
}

.drawer-body {
  padding: 24rpx 24rpx 32rpx;
}

/* ── 空状态 ── */
.drawer-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0 60rpx;
  gap: 12rpx;
}

.drawer-empty-icon { font-size: 80rpx; }

.drawer-empty-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #555;
}

.drawer-empty-sub {
  font-size: 24rpx;
  color: #AAAAAA;
}

/* ── 文章卡片列表 ── */
.article-card-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.article-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 28rpx 28rpx 24rpx;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.05);
}

.article-card-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1A1A1A;
  line-height: 1.5;
  display: block;
  margin-bottom: 16rpx;
}

.article-card-meta {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.meta-source {
  font-size: 22rpx;
  color: #AAAAAA;
}

.meta-dot {
  font-size: 22rpx;
  color: #CCCCCC;
}

.meta-time {
  font-size: 22rpx;
  color: #AAAAAA;
}

.meta-tag {
  margin-left: auto;
  font-size: 22rpx;
  font-weight: 500;
}

.meta-tag.collected { color: #FA8C16; }
.meta-tag.read { color: #1677FF; }
.meta-tag.liked { color: #1DB954; }

/* ── 通用操作按钮 ── */
.drawer-action-btn {
  margin: 24rpx 0 0;
  background: linear-gradient(135deg, #1DB954, #16a34a);
  border-radius: 40rpx;
  padding: 24rpx;
  text-align: center;
  font-size: 28rpx;
  color: #fff;
  font-weight: 600;
}

.upgrade-action-btn {
  background: linear-gradient(135deg, #FA8C16, #d97706);
}

/* ── 信息卡片 ── */
.info-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.05);
}

.info-card-label {
  font-size: 24rpx;
  font-weight: 600;
  color: #888;
  display: block;
  margin-bottom: 16rpx;
}

.info-card-text {
  font-size: 26rpx;
  color: #555;
  line-height: 1.7;
}

.highlight-text {
  font-weight: 700;
  color: #1DB954;
}

/* ── 雷达词胶囊 ── */
.radar-content { padding-top: 4rpx; }

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

/* ── 消息通知 ── */
.notify-tag-row {
  margin-bottom: 12rpx;
}

.notify-tag {
  display: inline-flex;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  background: #F0FDF4;
  color: #1DB954;
  font-size: 22rpx;
}

/* ── 数据报告 ── */
.report-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.report-stat-card {
  border-radius: 20rpx;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.report-stat-icon { font-size: 40rpx; }

.report-stat-num {
  font-size: 44rpx;
  font-weight: 700;
  color: #1A1A1A;
}

.report-stat-label {
  font-size: 22rpx;
  color: #888;
}

.domain-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.domain-tag-item {
  padding: 8rpx 20rpx;
  border-radius: 40rpx;
  background: #F0FDF4;
  border: 1rpx solid #BBF7D0;
  font-size: 24rpx;
  color: #1DB954;
}

.pro-hint-card {
  background: linear-gradient(135deg, #FFF7E6, #FFFBE6);
  border-radius: 20rpx;
  padding: 24rpx;
  border: 1rpx solid #FFE58F;
  text-align: center;
}

.pro-hint-text {
  font-size: 26rpx;
  color: #B07800;
  font-weight: 500;
}

/* ── 通用信息抽屉 ── */
.info-drawer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48rpx 48rpx 64rpx;
  gap: 24rpx;
}

.info-drawer-icon { font-size: 80rpx; }

.info-drawer-text {
  font-size: 28rpx;
  color: #555;
  line-height: 1.8;
  text-align: center;
}
</style>
