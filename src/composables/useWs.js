import { ref, onUnmounted } from 'vue'

const DEV = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
const WS_HOST = DEV ? location.host : 'backend.api.011420.xyz'

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
    console.log(`[WebSocket] 连接任务 id=${id}`)
    _connect()
  }

  function _connect() {
    if (!taskId) return
    const proto = location.protocol === 'https:' ? 'wss:' : 'ws:'
    const url = `${proto}//${WS_HOST}/fursee/api/ws/${taskId}`
    console.log(`[WebSocket] 正在连接 ${url}`)

    ws = new WebSocket(url)

    ws.onopen = () => {
      connected.value = true
      console.log(`[WebSocket] 连接已建立，任务 id=${taskId}`)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log(`[WebSocket] 收到消息: event=${data.event}${data.stage ? ` stage=${data.stage}` : ''}${data.current !== undefined ? ` progress=${data.current}/${data.total}` : ''}`)
        if (onMessage) onMessage(data)
        if (data.event === 'complete' || data.event === 'error') {
          console.log(`[WebSocket] 任务结束(${data.event})，500ms后断开`)
          setTimeout(() => disconnect(), 500)
        }
      } catch { /* ignore */ }
    }

    ws.onclose = (e) => {
      connected.value = false
      console.log(`[WebSocket] 连接关闭，code=${e.code}，reason=${e.reason || '无'}`)
    }

    ws.onerror = (e) => {
      connected.value = false
      console.error(`[WebSocket] 连接错误`, e)
    }
  }

  function disconnect() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    if (ws) {
      console.log(`[WebSocket] 断开连接，任务 id=${taskId}`)
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
