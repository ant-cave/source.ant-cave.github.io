const fingerprint = ref('')
let initialized = false

import { ref } from 'vue'

export function useFingerprint() {
  async function init() {
    if (initialized) return fingerprint.value
    initialized = true
    try {
      const fp = localStorage.getItem('fursee_fp')
      if (fp) {
        fingerprint.value = fp
      } else {
        const uuid = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 18)
        localStorage.setItem('fursee_fp', uuid)
        fingerprint.value = uuid
      }
    } catch {
      fingerprint.value = localStorage.getItem('fursee_fp') || 'unknown'
    }
    return fingerprint.value
  }

  return { fingerprint, init }
}
