import axios from 'axios'

const DEV = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
const API_BASE = DEV ? '/fursee/api' : 'https://backend.api.011420.xyz/fursee/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000,
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    let fp = localStorage.getItem('fursee_fp')
    if (!fp) {
      fp = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 18)
      localStorage.setItem('fursee_fp', fp)
    }
    config.headers['X-Fingerprint'] = fp
    return config
  },
  (err) => Promise.reject(err),
)

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.error || err.message || 'Request failed'
    return Promise.reject(new Error(msg))
  },
)

export function useApi() {
  async function getStats() {
    const { data } = await api.get('/stats')
    return data
  }

  async function listImages(category) {
    const { data } = await api.get(`/images/${category}`)
    return data
  }

  async function uploadImages(category, files, onProgress) {
    const totalSize = files.reduce((s, f) => s + f.size, 0)
    const fileNames = files.map(f => f.name).join(', ')
    console.log(`[上传] 开始上传 ${files.length} 张图片，分类=${category}，总大小=${(totalSize / 1024 / 1024).toFixed(2)}MB，文件=[${fileNames}]`)
    const form = new FormData()
    files.forEach((f) => form.append('files', f))
    const startTime = Date.now()
    try {
      const uploadPromise = api.post(`/images/${category}/upload`, form, {
        onUploadProgress: (e) => {
          if (e.total) {
            const rawPct = Math.round((e.loaded / e.total) * 100)
            const pct = Math.round(rawPct * 0.5)
            const speed = e.total > 0 ? ((e.loaded / 1024 / 1024) / ((Date.now() - startTime) / 1000)).toFixed(1) : '?'
            if (rawPct % 10 === 0 || rawPct >= 100) {
              console.log(`[上传] 浏览器→服务器 ${rawPct}% — ${(e.loaded / 1024 / 1024).toFixed(2)}/${(e.total / 1024 / 1024).toFixed(2)}MB，${speed}MB/s`)
            }
            if (onProgress) onProgress(pct, 'upload')
          }
        },
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (onProgress) onProgress(50, 'server')

      const { data } = await uploadPromise
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
      console.log(`[上传] 全部完成，耗时 ${elapsed}s`)
      return data
    } catch (e) {
      console.error(`[上传] 上传失败: ${e.message}`)
      throw e
    }
  }

  async function deleteImage(category, filename) {
    const { data } = await api.delete(`/images/${category}/${encodeURIComponent(filename)}`)
    return data
  }

  async function startPipeline(type, params) {
    const { data } = await api.post(`/pipeline/${type}`, params)
    return data
  }

  async function getTask(taskId) {
    const { data } = await api.get(`/pipeline/tasks/${taskId}`)
    return data
  }

  async function listTasks() {
    const { data } = await api.get('/pipeline/tasks')
    return data.tasks || []
  }

  async function listResults(resultType) {
    const { data } = await api.get(`/results/${resultType}`)
    return data
  }

  function getResultImageUrl(resultType, path, thumb = false) {
    return `/fursee/api/results/${resultType}/image/${path}${thumb ? '?thumb=1' : ''}`
  }

  async function getAutoHistory() {
    const { data } = await api.get('/results/auto')
    return data
  }

  async function deleteRun(runId) {
    const { data } = await api.delete(`/results/auto/run/${runId}`)
    return data
  }

  async function resetPipeline() {
    const { data } = await api.post('/pipeline/reset')
    return data
  }

  return {
    getStats,
    listImages,
    uploadImages,
    deleteImage,
    startPipeline,
    getTask,
    listTasks,
    listResults,
    getResultImageUrl,
    getAutoHistory,
    deleteRun,
    resetPipeline,
  }
}
