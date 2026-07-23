import { ref, onUnmounted } from 'vue'

export function useWs() {
  const connected = ref(false)
  let ws = null
  let taskId = null
  let onMessage = null
  let reconnectTimer = null

  function connect(id, handler) {
    disconnect()
    taskId = id
    onMessage = handler
    _connect()
  }

  function _connect() {
    if (!taskId) return
    const proto = location.protocol === 'https:' ? 'wss:' : 'ws:'
    const url = `${proto}//${location.host}/fursee/api/ws/${taskId}`

    ws = new WebSocket(url)

    ws.onopen = () => {
      connected.value = true
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (onMessage) onMessage(data)
        if (data.event === 'complete' || data.event === 'error') {
          setTimeout(() => disconnect(), 500)
        }
      } catch { /* ignore */ }
    }

    ws.onclose = () => {
      connected.value = false
    }

    ws.onerror = () => {
      connected.value = false
    }
  }

  function disconnect() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    if (ws) {
      ws.onclose = null
      ws.close()
      ws = null
    }
    connected.value = false
    taskId = null
    onMessage = null
  }

  onUnmounted(() => disconnect())

  return { connected, connect, disconnect }
}
