import { ref, onMounted } from 'vue'

const AUTH_BASE = '/api/auth'

const user = ref(null)
const loading = ref(true)

export function useAuth() {
  async function checkAuth() {
    try {
      const res = await fetch(`${AUTH_BASE}/me`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        user.value = data.authenticated ? data : null
      } else {
        user.value = null
      }
    } catch {
      user.value = null
    } finally {
      loading.value = false
    }
  }

  async function login() {
    try {
      const redirect = encodeURIComponent(window.location.pathname + window.location.search)
      const res = await fetch(`${AUTH_BASE}/login?redirect=${redirect}`, { credentials: 'include' })
      if (!res.ok) throw new Error('Login failed')
      const data = await res.json()
      if (data.authorize_url) {
        sessionStorage.setItem('pkce_code_verifier', data.code_verifier)
        window.location.href = data.authorize_url
      }
    } catch (e) {
      console.error('Login error:', e)
    }
  }

  async function handleCallback(code, codeVerifier) {
    const res = await fetch(`${AUTH_BASE}/token`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, code_verifier: codeVerifier }),
    })
    if (!res.ok) throw new Error('Token exchange failed')
    const data = await res.json()
    user.value = { authenticated: true }
    return data
  }

  async function logout() {
    try {
      await fetch(`${AUTH_BASE}/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch { /* ignore */ }
    user.value = null
  }

  onMounted(() => {
    if (loading.value) checkAuth()
  })

  return { user, loading, login, handleCallback, logout, checkAuth }
}
