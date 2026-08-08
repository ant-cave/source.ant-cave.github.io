import axios from 'axios'
import { compressToJpegBlob } from './useImageCompress'

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

const CHUNK_SIZE = 1 * 1024 * 1024

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
    const arr = Array.from(files).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f.name))
    if (!arr.length) return { uploaded: [], count: 0, localFiles: [] }

    // 第 1 步：浏览器端压缩（JPEG q50，与原后端一致），逐个串行避免内存峰值
    const compressed = []
    for (let fi = 0; fi < arr.length; fi++) {
      const file = arr[fi]
      const origSizeMB = (file.size / 1024 / 1024).toFixed(2)
      const cStart = Date.now()
      const blob = await compressToJpegBlob(file)
      const cElapsed = ((Date.now() - cStart) / 1000).toFixed(2)
      const newSizeMB = (blob.size / 1024 / 1024).toFixed(2)
      console.log(`[压缩] ${file.name}: ${origSizeMB}MB → ${newSizeMB}MB (${cElapsed}s)`)
      compressed.push({ blob, origName: file.name })
      if (onProgress) onProgress(Math.round(((fi + 1) / arr.length) * 20), 'compress')
    }

    const totalSize = compressed.reduce((s, c) => s + c.blob.size, 0)
    const totalChunks = compressed.reduce((s, c) => s + Math.ceil(c.blob.size / CHUNK_SIZE), 0)
    const uploadId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)

    console.log(`[上传] 压缩完成：${compressed.length} 个文件，总大小 ${(totalSize / 1024 / 1024).toFixed(2)}MB，共 ${totalChunks} 片（每片 1MB）`)

    let uploadedChunks = 0
    const localFiles = []

    for (let fi = 0; fi < compressed.length; fi++) {
      const { blob, origName } = compressed[fi]
      const fileChunks = Math.ceil(blob.size / CHUNK_SIZE)
      console.log(`[上传] 文件 ${fi + 1}/${compressed.length}: ${origName} (${(blob.size / 1024 / 1024).toFixed(2)}MB, ${fileChunks} 片)`)

      let serverName = origName
      for (let ci = 0; ci < fileChunks; ci++) {
        const start = ci * CHUNK_SIZE
        const end = Math.min(start + CHUNK_SIZE, blob.size)
        const chunk = blob.slice(start, end)

        const startTime = Date.now()
        const resp = await api.post(`/images/${category}/chunk`, chunk, {
          headers: {
            'Content-Type': 'application/octet-stream',
            'X-Upload-Id': uploadId,
            'X-Filename': origName,
            'X-Chunk-Index': String(ci),
            'X-Chunk-Total': String(fileChunks),
          },
        })

        // 以服务端返回的 safe filename 为准，保证与上游 entries 的文件名一致
        if (resp.data?.filename) serverName = resp.data.filename

        uploadedChunks++
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)
        const pct = Math.round(20 + (uploadedChunks / totalChunks) * 60)
        const speed = ((end - start) / 1024 / 1024 / parseFloat(elapsed || '0.01')).toFixed(1)
        console.log(`[上传] ✅ ${origName} 分片 ${ci + 1}/${fileChunks} 完成 (${elapsed}s, ${speed}MB/s) → 总进度 ${uploadedChunks}/${totalChunks} (${pct}%)`)
        if (onProgress) onProgress(pct, 'upload')
      }

      localFiles.push({
        serverName,
        origName,
        blob,
        url: URL.createObjectURL(blob),
      })
    }

    console.log(`[上传] 所有分片上传完毕，开始终结处理（转发上游）...`)
    if (onProgress) onProgress(85, 'server')

    const { data } = await api.post(`/images/${category}/finalize`, null, {
      timeout: 300000,
    })

    console.log(`[上传] ✅ 终结处理完成`)
    if (onProgress) onProgress(100, 'done')

    return { ...data, localFiles }
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
    resetPipeline,
  }
}
