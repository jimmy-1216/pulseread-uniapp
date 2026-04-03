<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app"
import { useAppStore } from "./store/useAppStore"

onLaunch(() => {
  const store = useAppStore()
  store.init()
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
