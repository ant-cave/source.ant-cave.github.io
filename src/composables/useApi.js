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
    const BATCH_LIMIT = 40 * 1024 * 1024
    const totalSize = files.reduce((s, f) => s + f.size, 0)
    const fileNames = files.map(f => f.name).join(', ')
    console.log(`[上传] 开始上传 ${files.length} 张图片，分类=${category}，总大小=${(totalSize / 1024 / 1024).toFixed(2)}MB，文件=[${fileNames}]`)

    const batches = []
    let batch = []
    let batchSize = 0
    for (const f of files) {
      if (batchSize + f.size > BATCH_LIMIT && batch.length > 0) {
        batches.push(batch)
        batch = []
        batchSize = 0
      }
      batch.push(f)
      batchSize += f.size
    }
    if (batch.length) batches.push(batch)
    console.log(`[上传] 分为 ${batches.length} 批，每批限制 ${BATCH_LIMIT / 1024 / 1024}MB`)

    const startTime = Date.now()
    let uploadedBytes = 0
    const allUploaded = []

    for (let i = 0; i < batches.length; i++) {
      const b = batches[i]
      const bSize = b.reduce((s, f) => s + f.size, 0)
      console.log(`[上传] 第 ${i + 1}/${batches.length} 批：${b.length} 张，${(bSize / 1024 / 1024).toFixed(2)}MB`)

      const form = new FormData()
      b.forEach((f) => form.append('files', f))

      try {
        const { data } = await api.post(`/images/${category}/upload`, form, {
          onUploadProgress: (e) => {
            if (e.total) {
              const batchPct = e.loaded / e.total
              const overallLoaded = uploadedBytes + e.loaded
              const pct = Math.round((overallLoaded / totalSize) * 50)
              const speed = e.total > 0 ? ((e.loaded / 1024 / 1024) / ((Date.now() - startTime) / 1000)).toFixed(1) : '?'
              if (Math.round(batchPct * 100) % 10 === 0 || batchPct >= 1) {
                console.log(`[上传] 批${i + 1} ${Math.round(batchPct * 100)}% — 总进度 ${(overallLoaded / 1024 / 1024).toFixed(1)}/${(totalSize / 1024 / 1024).toFixed(1)}MB，${speed}MB/s`)
              }
              if (onProgress) onProgress(pct, 'upload')
            }
          },
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        if (data.uploaded) allUploaded.push(...data.uploaded)
        uploadedBytes += bSize
      } catch (e) {
        console.error(`[上传] 第 ${i + 1} 批失败: ${e.message}`)
        throw e
      }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
    console.log(`[上传] 全部 ${batches.length} 批上传完成，共 ${allUploaded.length} 张，总耗时 ${elapsed}s`)

    if (onProgress) onProgress(50, 'server')
    return { uploaded: allUploaded, count: allUploaded.length }
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
