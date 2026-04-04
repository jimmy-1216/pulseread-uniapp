<template>
  <view class="profile-page" :class="{ 'drawer-active-page': activeDrawer !== '' }">
    <view class="profile-header">
      <view class="user-row">
        <view class="avatar-wrap">
          <text class="avatar-text">澜</text>
        </view>
        <view class="user-info">
          <view class="name-row">
            <text class="user-name">{{ store.userInfo.nickname }}</text>
            <view class="member-badge" :style="{ background: memberMeta.bg, color: memberMeta.color }">
              <text class="member-text">{{ memberMeta.label }}</text>
            </view>
          </view>
          <text class="user-id">账号 ID：{{ store.userInfo.id }}</text>
          <text class="user-note">你的阅读记录、收藏与雷达词都在这里集中管理</text>
        </view>
        <view class="benefit-btn" @tap="openDrawer('upgrade')">
          <text class="benefit-btn-text">会员权益</text>
        </view>
      </view>

      <view class="stats-row">
        <view class="stat-item" @tap="openDrawer('history')">
          <text class="stat-num">{{ store.userInfo.readCount }}</text>
          <text class="stat-label">阅读</text>
        </view>
        <view class="stat-item" @tap="openDrawer('collect')">
          <text class="stat-num">{{ store.collectedArticles.length }}</text>
          <text class="stat-label">收藏</text>
        </view>
        <view class="stat-item" @tap="openDrawer('liked')">
          <text class="stat-num">{{ store.likedArticles.length }}</text>
          <text class="stat-label">点赞</text>
        </view>
        <view class="stat-item" @tap="openDrawer('radar')">
          <text class="stat-num">{{ store.preference.radarWords.length }}</text>
          <text class="stat-label">雷达词</text>
        </view>
      </view>
    </view>

    <view v-if="store.userInfo.memberLevel === 'free'" class="upgrade-card" @tap="openDrawer('upgrade')">
      <view class="upgrade-copy">
        <text class="upgrade-title">升级会员，获得更完整的行业跟踪能力</text>
        <text class="upgrade-desc">支持更多雷达词、企业情报与阅读周报等高级能力</text>
      </view>
      <view class="upgrade-cta">
        <text>查看</text>
      </view>
    </view>

    <scroll-view scroll-y class="menu-scroll" :class="{ 'menu-scroll-muted': activeDrawer !== '' }">
      <view class="menu-group">
        <text class="menu-group-title">常用内容</text>
        <view class="menu-card">
          <view class="menu-item" @tap="openDrawer('collect')">
            <view class="menu-icon-wrap blue"><text class="menu-icon-text">藏</text></view>
            <view class="menu-label-wrap">
              <text class="menu-label">我的收藏</text>
              <text class="menu-sub">已收藏 {{ store.collectedArticles.length }} 篇资讯</text>
            </view>
            <text class="menu-arrow">›</text>
          </view>
          <view class="menu-divider" />
          <view class="menu-item" @tap="openDrawer('history')">
            <view class="menu-icon-wrap green"><text class="menu-icon-text">读</text></view>
            <view class="menu-label-wrap">
              <text class="menu-label">阅读历史</text>
              <text class="menu-sub">最近浏览记录</text>
            </view>
            <text class="menu-arrow">›</text>
          </view>
          <view class="menu-divider" />
          <view class="menu-item" @tap="openDrawer('notification')">
            <view class="menu-icon-wrap orange"><text class="menu-icon-text">铃</text></view>
            <view class="menu-label-wrap">
              <text class="menu-label">消息通知</text>
              <text class="menu-sub">雷达词触发提醒</text>
            </view>
            <text class="menu-arrow">›</text>
          </view>
          <view class="menu-divider" />
          <view class="menu-item" @tap="openDrawer('report')">
            <view class="menu-icon-wrap purple"><text class="menu-icon-text">报</text></view>
            <view class="menu-label-wrap">
              <text class="menu-label">数据报告</text>
              <text class="menu-sub">每周阅读分析</text>
            </view>
            <text class="menu-arrow">›</text>
          </view>
        </view>
      </view>

      <view class="menu-group">
        <text class="menu-group-title">偏好与支持</text>
        <view class="menu-card">
          <view class="menu-item" @tap="goPreference()">
            <view class="menu-icon-wrap emerald"><text class="menu-icon-text">偏</text></view>
            <view class="menu-label-wrap">
              <text class="menu-label">偏好设置</text>
              <text class="menu-sub">领域、降噪、雷达词</text>
            </view>
            <text class="menu-arrow">›</text>
          </view>
          <view class="menu-divider" />
          <view class="menu-item" @tap="openDrawer('privacy')">
            <view class="menu-icon-wrap gray"><text class="menu-icon-text">隐</text></view>
            <view class="menu-label-wrap">
              <text class="menu-label">隐私设置</text>
            </view>
            <text class="menu-arrow">›</text>
          </view>
          <view class="menu-divider" />
          <view class="menu-item" @tap="openDrawer('feedback')">
            <view class="menu-icon-wrap blue"><text class="menu-icon-text">反</text></view>
            <view class="menu-label-wrap">
              <text class="menu-label">意见反馈</text>
            </view>
            <text class="menu-arrow">›</text>
          </view>
          <view class="menu-divider" />
          <view class="menu-item" @tap="openDrawer('help')">
            <view class="menu-icon-wrap gray"><text class="menu-icon-text">帮</text></view>
            <view class="menu-label-wrap">
              <text class="menu-label">帮助中心</text>
            </view>
            <text class="menu-arrow">›</text>
          </view>
        </view>
      </view>

      <view class="menu-group">
        <text class="menu-group-title">其他</text>
        <view class="menu-card">
          <view class="menu-item" @tap="confirmReset">
            <view class="menu-icon-wrap red"><text class="menu-icon-text">重</text></view>
            <view class="menu-label-wrap">
              <text class="menu-label danger-label">重新引导设置</text>
            </view>
            <text class="menu-arrow">›</text>
          </view>
        </view>
      </view>

      <view class="bottom-pad" />
    </scroll-view>

    <view
      v-show="activeDrawer !== ''"
      class="overlay"
      :class="{ 'overlay-visible': drawerVisible }"
      @tap="closeDrawer"
    >
      <view
        v-if="['collect','history','liked','radar','notification','report'].includes(activeDrawer)"
        class="drawer list-drawer"
        :class="{ 'drawer-open': drawerVisible }"
        @tap.stop
      >
        <view class="drawer-handle" />
        <view class="drawer-header">
          <text class="drawer-title">{{ drawerTitle }}</text>
          <view class="drawer-close-btn" @tap="closeDrawer">
            <text>×</text>
          </view>
        </view>

        <scroll-view scroll-y class="drawer-scroll">
          <view class="drawer-body">
            <template v-if="activeDrawer === 'collect'">
              <view v-if="store.collectedArticles.length === 0" class="drawer-empty">
                <text class="drawer-empty-title">还没有收藏的资讯</text>
                <text class="drawer-empty-sub">在文章详情页点击收藏即可稍后回看</text>
              </view>
              <view v-else class="article-card-list">
                <view
                  v-for="a in store.collectedArticles"
                  :key="a.id"
                  class="mini-article-card"
                  @tap="openArticle(a.id)"
                >
                  <text class="mini-article-title">{{ a.title }}</text>
                  <view class="mini-article-meta">
                    <text class="meta-source">{{ a.source }}</text>
                    <text class="meta-dot">·</text>
                    <text class="meta-time">{{ a.publishTime }}</text>
                    <text class="meta-tag orange">已收藏</text>
                  </view>
                </view>
              </view>
            </template>

            <template v-else-if="activeDrawer === 'history'">
              <view v-if="historyArticles.length === 0" class="drawer-empty">
                <text class="drawer-empty-title">暂无阅读记录</text>
                <text class="drawer-empty-sub">点击资讯卡片开始阅读</text>
              </view>
              <view v-else class="article-card-list">
                <view
                  v-for="(a, i) in historyArticles"
                  :key="`${a.id}-${i}`"
                  class="mini-article-card"
                  @tap="openArticle(a.id)"
                >
                  <text class="mini-article-title">{{ a.title }}</text>
                  <view class="mini-article-meta">
                    <text class="meta-source">{{ a.source }}</text>
                    <text class="meta-dot">·</text>
                    <text class="meta-time">{{ a.publishTime }}</text>
                    <text class="meta-tag green">已读</text>
                  </view>
                </view>
              </view>
            </template>

            <template v-else-if="activeDrawer === 'liked'">
              <view v-if="store.likedArticles.length === 0" class="drawer-empty">
                <text class="drawer-empty-title">还没有点赞任何文章</text>
                <text class="drawer-empty-sub">在文章详情页点击点赞即可加入这里</text>
              </view>
              <view v-else class="article-card-list">
                <view
                  v-for="a in store.likedArticles"
                  :key="a.id"
                  class="mini-article-card"
                  @tap="openArticle(a.id)"
                >
                  <text class="mini-article-title">{{ a.title }}</text>
                  <view class="mini-article-meta">
                    <text class="meta-source">{{ a.source }}</text>
                    <text class="meta-dot">·</text>
                    <text class="meta-time">{{ a.publishTime }}</text>
                    <text class="meta-tag pink">已赞</text>
                  </view>
                </view>
              </view>
            </template>

            <template v-else-if="activeDrawer === 'radar'">
              <view v-if="store.preference.radarWords.length === 0" class="drawer-empty">
                <text class="drawer-empty-title">还没有设置雷达词</text>
                <text class="drawer-empty-sub">去偏好设置添加关注的公司、产品或赛道关键词</text>
                <view class="drawer-action-btn" @tap="goPreference()"><text>前往设置</text></view>
              </view>
              <view v-else class="drawer-stack">
                <view class="info-card">
                  <text class="info-card-label">当前雷达词</text>
                  <view class="radar-chips">
                    <view v-for="word in store.preference.radarWords" :key="word" class="radar-chip">
                      <text>{{ word }}</text>
                    </view>
                  </view>
                </view>
                <view class="info-card">
                  <text class="info-card-label">触发统计</text>
                  <text class="info-card-text">本周共触发 <text class="highlight-text">12 次</text> 雷达词推送，为你精准捕获关键资讯。</text>
                </view>
                <view class="drawer-action-btn" @tap="goPreference()"><text>管理雷达词</text></view>
              </view>
            </template>

            <template v-else-if="activeDrawer === 'notification'">
              <view v-if="store.preference.radarWords.length === 0" class="drawer-empty">
                <text class="drawer-empty-title">暂无通知</text>
                <text class="drawer-empty-sub">设置雷达词后，系统会自动推送相关资讯</text>
              </view>
              <view v-else class="article-card-list">
                <view
                  v-for="(word, i) in store.preference.radarWords"
                  :key="word"
                  class="mini-article-card"
                >
                  <view class="notify-tag-row">
                    <view class="notify-tag"><text>{{ word }}</text></view>
                  </view>
                  <text class="mini-article-title">“{{ word }}” 相关资讯已更新 {{ 3 + i }} 条</text>
                  <view class="mini-article-meta">
                    <text class="meta-time">{{ i === 0 ? '刚刚' : i + '小时前' }}</text>
                    <text class="meta-tag blue">雷达推送</text>
                  </view>
                </view>
              </view>
            </template>

            <template v-else-if="activeDrawer === 'report'">
              <view class="report-grid">
                <view class="report-stat-card green-soft">
                  <text class="report-stat-num">{{ store.userInfo.readCount }}</text>
                  <text class="report-stat-label">阅读资讯</text>
                </view>
                <view class="report-stat-card orange-soft">
                  <text class="report-stat-num">{{ store.collectedArticles.length }}</text>
                  <text class="report-stat-label">收藏资讯</text>
                </view>
                <view class="report-stat-card blue-soft">
                  <text class="report-stat-num">{{ store.likedArticles.length }}</text>
                  <text class="report-stat-label">点赞资讯</text>
                </view>
                <view class="report-stat-card purple-soft">
                  <text class="report-stat-num">{{ store.preference.radarWords.length }}</text>
                  <text class="report-stat-label">雷达词</text>
                </view>
              </view>
              <view class="drawer-stack">
                <view class="info-card">
                  <text class="info-card-label">最活跃领域</text>
                  <view class="domain-tags">
                    <view
                      v-for="d in store.preference.domains.slice(0, 2)"
                      :key="d"
                      class="domain-tag-item"
                    >
                      <text>{{ d === 'tech' ? '科技' : d === 'finance' ? '财经' : d === 'policy' ? '政策' : '商情' }}</text>
                    </view>
                  </view>
                </view>
                <view v-if="store.userInfo.memberLevel === 'free'" class="pro-hint-card">
                  <text class="pro-hint-text">升级会员可解锁完整数据报告与更长时间跨度分析</text>
                </view>
              </view>
            </template>
          </view>
        </scroll-view>
      </view>

      <view
        v-else-if="['upgrade','privacy','feedback','help'].includes(activeDrawer)"
        class="drawer info-drawer"
        :class="{ 'drawer-open': drawerVisible }"
        @tap.stop
      >
        <view class="drawer-handle" />
        <view class="drawer-header">
          <text class="drawer-title">{{ infoDrawerConfig.title }}</text>
          <view class="drawer-close-btn" @tap="closeDrawer">
            <text>×</text>
          </view>
        </view>
        <view class="info-drawer-content">
          <view class="info-drawer-badge"><text>{{ infoDrawerConfig.mark }}</text></view>
          <text class="info-drawer-text">{{ infoDrawerConfig.text }}</text>
          <view v-if="activeDrawer === 'upgrade'" class="drawer-action-btn wide-btn">
            <text>立即升级 Pro</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '../../store/useAppStore'

const store = useAppStore()
const activeDrawer = ref('')
const drawerVisible = ref(false)
let closeTimer: ReturnType<typeof setTimeout> | null = null

const MEMBER_CONFIGS = {
  free: { label: '免费版', color: '#15803D', bg: '#ECFDF3' },
  pro: { label: 'Pro 会员', color: '#C2410C', bg: '#FFF7ED' },
  enterprise: { label: '企业版', color: '#1D4ED8', bg: '#DBEAFE' },
}

const memberMeta = computed(() => MEMBER_CONFIGS[store.userInfo.memberLevel] ?? MEMBER_CONFIGS.free)

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

const DRAWER_TITLES: Record<string, string> = {
  collect: '我的收藏',
  history: '阅读历史',
  liked: '我的点赞',
  radar: '我的雷达词',
  notification: '消息通知',
  report: '本周数据报告',
}

const INFO_DRAWERS: Record<string, { title: string; mark: string; text: string }> = {
  upgrade: {
    title: '升级 Pro',
    mark: 'PRO',
    text: 'Pro 版本提供更多雷达词追踪、企业情报分析、每周数据报告等高级功能，升级后即可解锁全部权益。',
  },
  privacy: {
    title: '隐私设置',
    mark: '隐',
    text: '你的数据默认仅用于当前体验，不会公开分享。阅读记录和偏好设置将按产品规则妥善保存与保护。',
  },
  feedback: {
    title: '意见反馈',
    mark: '反',
    text: '感谢你的使用。若你对内容质量、推送策略或界面体验有建议，可以随时反馈，我们会持续迭代优化。',
  },
  help: {
    title: '帮助中心',
    mark: '帮',
    text: '如在使用过程中遇到问题，可先查看常见问题说明，或联系支持入口获取帮助。',
  },
}

const drawerTitle = computed(() => DRAWER_TITLES[activeDrawer.value] ?? '')
const infoDrawerConfig = computed(() => INFO_DRAWERS[activeDrawer.value] ?? { title: '', mark: '', text: '' })

function openDrawer(key: string) {
  if (closeTimer) clearTimeout(closeTimer)
  activeDrawer.value = key
  setTimeout(() => {
    drawerVisible.value = true
  }, 16)
}

function closeDrawer() {
  drawerVisible.value = false
  closeTimer = setTimeout(() => {
    activeDrawer.value = ''
  }, 280)
}

function goPreference() {
  closeDrawer()
  setTimeout(() => {
    uni.switchTab({ url: '/pages/preference/index' })
  }, 280)
}

function openArticle(id: number) {
  store.setCurrentArticle(id)
  closeDrawer()
  setTimeout(() => {
    uni.navigateTo({ url: '/pages/article/index' })
  }, 260)
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
  background: #F4F6F8;
  overflow: hidden;
}

.profile-header {
  margin: 34rpx 24rpx 0;
  padding: 36rpx 24rpx 24rpx;
  background: #FFFFFF;
  border: 1rpx solid #E5EAF0;
  border-radius: 24rpx;
}

.user-row {
  display: grid;
  grid-template-columns: 92rpx minmax(0, 1fr);
  grid-template-areas:
    'avatar info'
    'avatar action';
  align-items: flex-start;
  column-gap: 18rpx;
  row-gap: 14rpx;
}

.avatar-wrap {
  grid-area: avatar;
  width: 92rpx;
  height: 92rpx;
  border-radius: 28rpx;
  background: #16A34A;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  font-size: 34rpx;
  color: #FFFFFF;
  font-weight: 700;
  line-height: 1;
}

.user-info {
  grid-area: info;
  min-width: 0;
  padding-right: 96rpx;
}

.name-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10rpx;
}

.user-name {
  font-size: 34rpx;
  font-weight: 700;
  color: #0F172A;
}

.member-badge {
  min-height: 36rpx;
  padding: 0 14rpx;
  border-radius: 999rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.member-text {
  font-size: 20rpx;
  font-weight: 700;
}

.user-id {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #64748B;
}

.user-note {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #94A3B8;
  line-height: 1.6;
}

.benefit-btn {
  grid-area: action;
  justify-self: start;
  position: static;
  margin-top: 2rpx;
  min-width: 132rpx;
  height: 56rpx;
  padding: 0 18rpx;
  border-radius: 999rpx;
  background: #F8FAFC;
  border: 1rpx solid #E5EAF0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.benefit-btn-text {
  font-size: 22rpx;
  color: #475569;
  font-weight: 600;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
  margin-top: 20rpx;
}

.stat-item {
  min-height: 94rpx;
  padding: 16rpx;
  border-radius: 18rpx;
  background: #F8FAFC;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8rpx;
}

.stat-num {
  font-size: 32rpx;
  font-weight: 700;
  color: #0F172A;
}

.stat-label {
  font-size: 21rpx;
  color: #94A3B8;
}

.upgrade-card {
  margin: 16rpx 24rpx 0;
  padding: 22rpx 24rpx;
  background: #FFF7ED;
  border: 1rpx solid #FED7AA;
  border-radius: 22rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.upgrade-copy {
  flex: 1;
  min-width: 0;
}

.upgrade-title {
  display: block;
  font-size: 27rpx;
  font-weight: 700;
  color: #9A3412;
}

.upgrade-desc {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #C2410C;
  line-height: 1.6;
}

.upgrade-cta {
  min-width: 108rpx;
  height: 58rpx;
  border-radius: 999rpx;
  background: #EA580C;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.upgrade-cta text {
  font-size: 23rpx;
  font-weight: 700;
  color: #FFFFFF;
}

  .menu-scroll {
  flex: 1;
  overflow: hidden;
  transition: opacity 0.2s ease;
}

.menu-scroll-muted {
  opacity: 0;
  pointer-events: none;
}


.menu-group {
  margin: 18rpx 24rpx 0;
}

.menu-group-title {
  display: block;
  margin-bottom: 12rpx;
  font-size: 23rpx;
  color: #64748B;
}

.menu-card {
  background: #FFFFFF;
  border: 1rpx solid #E5EAF0;
  border-radius: 22rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx;
}

.menu-icon-wrap {
  width: 56rpx;
  height: 56rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.menu-icon-text {
  font-size: 24rpx;
  font-weight: 700;
}

.blue { background: #EAF3FF; color: #1D4ED8; }
.green { background: #ECFDF3; color: #15803D; }
.orange { background: #FFF7ED; color: #C2410C; }
.purple { background: #F5F3FF; color: #7C3AED; }
.emerald { background: #ECFDF3; color: #16A34A; }
.gray { background: #F1F5F9; color: #475569; }
.red { background: #FEF2F2; color: #DC2626; }

.menu-label-wrap {
  flex: 1;
  min-width: 0;
}

.menu-label {
  display: block;
  font-size: 27rpx;
  font-weight: 700;
  color: #0F172A;
}

.menu-sub {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  color: #94A3B8;
}

.danger-label {
  color: #DC2626;
}

.menu-arrow {
  font-size: 30rpx;
  color: #CBD5E1;
  flex-shrink: 0;
}

.menu-divider {
  height: 1rpx;
  background: #EEF2F7;
  margin-left: 96rpx;
}

.bottom-pad {
  height: 32rpx;
}

  .overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0);
  display: flex;
  align-items: flex-end;
  transition: background 0.28s ease;
  z-index: 1200;
}


.overlay-visible {
  background: rgba(15, 23, 42, 0.34);
}

  .drawer {
  width: 100%;
  max-height: 86vh;
  background: #FFFFFF;
  border-radius: 30rpx 30rpx 0 0;
  transform: translateY(100%);
  transition: transform 0.28s ease;
  box-shadow: 0 -18rpx 48rpx rgba(15, 23, 42, 0.14);
  position: relative;
  z-index: 1;
}

.list-drawer {
  min-height: 56vh;
  display: flex;
  flex-direction: column;
}

.info-drawer {
  min-height: 34vh;
}


.drawer-open {
  transform: translateY(0);
}

.drawer-handle {
  width: 72rpx;
  height: 8rpx;
  border-radius: 999rpx;
  background: #D5DCE3;
  margin: 18rpx auto 0;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18rpx 24rpx 14rpx;
}

.drawer-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #0F172A;
}

.drawer-close-btn {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drawer-close-btn text {
  font-size: 34rpx;
  color: #64748B;
  line-height: 1;
}

  .drawer-scroll {
  flex: 1;
  min-height: 0;
  max-height: calc(86vh - 100rpx);
}


.drawer-body,
.info-drawer-content {
  padding: 0 24rpx 28rpx;
}

.drawer-empty {
  padding: 96rpx 20rpx;
  text-align: center;
}

.drawer-empty-title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: #334155;
}

.drawer-empty-sub {
  display: block;
  margin-top: 10rpx;
  font-size: 22rpx;
  color: #94A3B8;
  line-height: 1.7;
}

.article-card-list,
.drawer-stack {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.mini-article-card,
.info-card,
.pro-hint-card {
  padding: 22rpx;
  border-radius: 20rpx;
  background: #F8FAFC;
  border: 1rpx solid #E5EAF0;
}

.mini-article-title {
  display: block;
  font-size: 27rpx;
  font-weight: 700;
  color: #0F172A;
  line-height: 1.55;
}

.mini-article-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-top: 12rpx;
}

.meta-source,
.meta-time,
.meta-dot {
  font-size: 21rpx;
  color: #94A3B8;
}

.meta-tag {
  height: 38rpx;
  padding: 0 12rpx;
  border-radius: 999rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 19rpx;
  font-weight: 700;
}

.meta-tag.orange { background: #FFF7ED; color: #C2410C; }
.meta-tag.green { background: #ECFDF3; color: #15803D; }
.meta-tag.pink { background: #FDF2F8; color: #BE185D; }
.meta-tag.blue { background: #EAF3FF; color: #1D4ED8; }

.notify-tag-row {
  margin-bottom: 12rpx;
}

.notify-tag {
  height: 40rpx;
  padding: 0 14rpx;
  border-radius: 999rpx;
  background: #ECFDF3;
  color: #15803D;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.notify-tag text {
  font-size: 20rpx;
  font-weight: 700;
}

.info-card-label {
  display: block;
  font-size: 24rpx;
  font-weight: 700;
  color: #0F172A;
}

.info-card-text {
  display: block;
  margin-top: 10rpx;
  font-size: 23rpx;
  color: #64748B;
  line-height: 1.7;
}

.highlight-text {
  color: #16A34A;
  font-weight: 700;
}

.radar-chips,
.domain-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 14rpx;
}

.radar-chip,
.domain-tag-item {
  min-height: 52rpx;
  padding: 0 18rpx;
  border-radius: 999rpx;
  background: #FFFFFF;
  border: 1rpx solid #E5EAF0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.radar-chip text,
.domain-tag-item text {
  font-size: 22rpx;
  color: #475569;
  font-weight: 600;
}

.drawer-action-btn {
  margin-top: 4rpx;
  height: 72rpx;
  border-radius: 999rpx;
  background: #16A34A;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drawer-action-btn text {
  font-size: 25rpx;
  color: #FFFFFF;
  font-weight: 700;
}

.report-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14rpx;
  margin-bottom: 14rpx;
}

.report-stat-card {
  padding: 24rpx 20rpx;
  border-radius: 20rpx;
}

.report-stat-num {
  display: block;
  font-size: 34rpx;
  font-weight: 700;
  color: #0F172A;
}

.report-stat-label {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #64748B;
}

.green-soft { background: #F0FDF4; }
.orange-soft { background: #FFF7ED; }
.blue-soft { background: #EAF3FF; }
.purple-soft { background: #F5F3FF; }

.pro-hint-text {
  font-size: 22rpx;
  color: #94A3B8;
  line-height: 1.7;
}

.info-drawer-content {
  padding-top: 10rpx;
  padding-bottom: 36rpx;
}

.info-drawer-badge {
  width: 92rpx;
  height: 92rpx;
  border-radius: 28rpx;
  background: #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4rpx auto 20rpx;
}

.info-drawer-badge text {
  font-size: 28rpx;
  font-weight: 700;
  color: #475569;
}

.info-drawer-text {
  display: block;
  font-size: 24rpx;
  color: #64748B;
  line-height: 1.8;
  text-align: center;
}

.wide-btn {
  margin-top: 24rpx;
}
</style>
