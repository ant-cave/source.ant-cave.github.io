<template>
  <div class="callback-page">
    <p v-if="status === 'processing'">正在登录...</p>
    <p v-else-if="status === 'error'">登录失败，请重试</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { handleCallback } = useAuth()
const status = ref('processing')

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  const codeVerifier = sessionStorage.getItem('pkce_code_verifier')

  if (!code || !codeVerifier) {
    status.value = 'error'
    return
  }

  sessionStorage.removeItem('pkce_code_verifier')

  try {
    const data = await handleCallback(code, codeVerifier)
    router.replace(data.redirect || '/fursee/auto')
  } catch {
    status.value = 'error'
  }
})
</script>

<style scoped>
.callback-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.2rem;
  color: #666;
}
</style>