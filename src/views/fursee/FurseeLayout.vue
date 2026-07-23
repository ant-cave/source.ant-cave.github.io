<template>
  <n-config-provider :theme-overrides="themeOverrides" :locale="zhCN">
    <n-dialog-provider>
      <n-message-provider>
        <Disclaimer />
        <div class="fursee-root">
          <n-layout style="height: 100vh">
            <n-layout-header bordered style="height:50px;display:flex;align-items:center;padding:0 12px;background:#1a1a1a;gap:8px">
              <div style="font-size:15px;font-weight:700;color:#fff;letter-spacing:1px">Fursee</div>
              <div style="flex:1" />
              <n-button quaternary style="color:#888;padding:4px 8px;font-size:12px" @click="goHome">← 返回首页</n-button>
              <n-tag v-if="showWs" :type="wsConnected ? 'success' : 'error'" size="tiny" round>
                {{ wsConnected ? '已连接' : '未连接' }}
              </n-tag>
            </n-layout-header>
            <n-layout content-style="padding:16px;overflow-y:auto;height:calc(100vh - 50px);background:#f5f5f5">
              <slot />
            </n-layout>
          </n-layout>
        </div>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  NConfigProvider, NDialogProvider, NMessageProvider,
  NLayout, NLayoutHeader, NLayoutContent, NButton, NTag,
  zhCN,
} from 'naive-ui'
import Disclaimer from './Disclaimer.vue'
import { useWs } from '@/composables/useWs'
import { useFingerprint } from '@/composables/useFingerprint'

const router = useRouter()
const { connected: wsConnected } = useWs()
const { init: initFp } = useFingerprint()

const themeOverrides = {
  common: {
    primaryColor: '#333333', primaryColorHover: '#555555', primaryColorPressed: '#222222',
    baseColor: '#ffffff', textColor1: '#1a1a1a', textColor2: '#555555', textColor3: '#999999',
    borderColor: '#e0e0e0', bodyColor: '#f5f5f5', cardColor: '#ffffff',
    inputColor: '#fafafa', successColor: '#52c41a', errorColor: '#f5222d',
    borderRadius: '6px', fontSize: '14px',
  },
  Card: { color: '#ffffff', borderColor: '#e8e8e8', borderRadius: '8px', paddingMedium: '20px' },
  Button: {
    color: '#333333', colorHover: '#555555',
    textColor: '#ffffff', textColorHover: '#ffffff',
    border: '1px solid #333333', borderRadius: '6px',
  },
}

const showWs = ref(false)
let wsTimer = null
watch(wsConnected, (v) => {
  if (wsTimer) clearTimeout(wsTimer)
  if (v) showWs.value = true
  else wsTimer = setTimeout(() => { showWs.value = false }, 5000)
})
onUnmounted(() => { if (wsTimer) clearTimeout(wsTimer) })
onMounted(() => { initFp() })

function goHome() {
  router.push('/')
}
</script>

<style>
.fursee-root { font-size: 16px; }
.n-menu .n-menu-item-content { color: #aaa !important; }
.n-menu .n-menu-item-content--selected { color: #fff !important; background: #333 !important; }
.n-menu .n-menu-item-content:hover { color: #ddd !important; background: #2a2a2a !important; }
</style>
