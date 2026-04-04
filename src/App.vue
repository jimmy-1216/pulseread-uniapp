<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app"
import { useAppStore } from "./store/useAppStore"

onLaunch(() => {
  const store = useAppStore()
  store.init()

  // H5 预览场景下，如果地址中已经带了具体页面路由，就不要在启动时强制改写路由。
  // 否则会出现明明打开的是个人页/偏好页链接，却被重新跳回欢迎页或首页的情况。
  // #/pages/feed/index、#/pages/profile/index 等都应直接保留。
  // 只有在根路径预览时，才根据引导状态决定进入欢迎页还是首页。
  // #/ 或空 hash 视为根路径。
  // #/pages/... 视为明确页面路径。
  // 非 H5 端维持原有行为。
  // eslint-disable-next-line no-undef
  const isH5 = typeof window !== 'undefined'
  const currentHash = isH5 ? (window.location.hash || '') : ''
  const hasExplicitRoute = /^#\/pages\//.test(currentHash)

  if (hasExplicitRoute) return

  if (!store.hasOnboarded) {
    uni.reLaunch({ url: "/pages/onboarding/index" })
  } else {
    uni.switchTab({ url: "/pages/feed/index" })
  }
})

onShow(() => {})
onHide(() => {})
</script>

<style lang="scss">
/* Global styles */

page {
  background-color: #F5F5F5;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", sans-serif;
}

/* H5 端全局容器适配 */
#app,
.uni-app--h5 {
  width: 100% !important;
  height: 100% !important;
  overflow: hidden;
}

/* H5 页面满屏适配 */
.uni-page-body,
.uni-page-wrapper {
  height: 100% !important;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
