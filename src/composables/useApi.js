import axios from 'axios'

const DEV = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
const API_BASE = DEV ? `http://${location.hostname}:15898/fursee/api` : 'https://backend.api.011420.xyz/fursee/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
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
    const form = new FormData()
    files.forEach((f) => form.append('files', f))
    const { data } = await api.post(`/images/${category}/upload`, form, {
      onUploadProgress: (e) => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100))
      },
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
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
