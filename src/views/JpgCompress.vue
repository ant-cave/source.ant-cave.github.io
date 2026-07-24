<template>
  <div class="compress-root">
    <div class="compress-header">
      <h1>JPG 压缩</h1>
      <button class="back-btn" @click="goHome">← 返回首页</button>
    </div>

    <div class="compress-body">
      <div
        class="upload-zone"
        :class="{ dragover: isDragover, 'has-file': files.length > 0 }"
        @dragover.prevent="isDragover = true"
        @dragleave="isDragover = false"
        @drop.prevent="onDrop"
        @click="fileInput.click()"
      >
        <input
          ref="fileInput"
          type="file"
          accept="image/jpeg,image/jpg"
          multiple
          style="display: none"
          @change="onFileChange"
        />
        <template v-if="files.length === 0">
          <i class="ri-image-add-line upload-icon"></i>
          <p>拖拽 JPG 图片到此处，或点击选择</p>
          <p class="upload-hint">支持批量压缩</p>
        </template>
        <template v-else>
          <p class="file-count">已选择 {{ files.length }} 个文件</p>
        </template>
      </div>

      <div class="quality-control" v-if="files.length > 0">
        <label>压缩质量</label>
        <div class="quality-row">
          <input
            type="range"
            v-model.number="quality"
            min="1"
            max="100"
            class="quality-slider"
          />
          <span class="quality-value">{{ quality }}%</span>
        </div>
      </div>

      <button
        v-if="files.length > 0"
        class="compress-btn"
        :disabled="compressing"
        @click="compress"
      >
        {{ compressing ? '压缩中...' : '开始压缩' }}
      </button>

      <div v-if="results.length > 0" class="results">
        <div class="results-header">
          <h3>压缩结果</h3>
          <button class="download-all-btn" @click="downloadAll" v-if="results.length > 1">
            <i class="ri-download-2-line"></i> 全部下载
          </button>
        </div>
        <div class="result-list">
          <div v-for="(r, i) in results" :key="i" class="result-item">
            <div class="result-preview">
              <img :src="r.url" :alt="r.name" />
            </div>
            <div class="result-info">
              <div class="result-name" :title="r.name">{{ r.name }}</div>
              <div class="result-sizes">
                <span class="size-before">{{ formatSize(r.originalSize) }}</span>
                <i class="ri-arrow-right-line"></i>
                <span class="size-after">{{ formatSize(r.compressedSize) }}</span>
              </div>
              <div class="result-ratio" :class="r.ratio > 0 ? 'saved' : 'larger'">
                {{ r.ratio > 0 ? '节省 ' + r.ratio + '%' : '增大 ' + Math.abs(r.ratio) + '%' }}
              </div>
            </div>
            <button class="download-btn" @click="downloadSingle(r)">
              <i class="ri-download-line"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const fileInput = ref(null)
const isDragover = ref(false)
const files = ref([])
const quality = ref(75)
const compressing = ref(false)
const results = ref([])

function goHome() {
  router.push('/')
}

function onDrop(e) {
  isDragover.value = false
  const dropped = [...e.dataTransfer.files].filter(f => f.type === 'image/jpeg')
  if (dropped.length) files.value = [...files.value, ...dropped]
}

function onFileChange(e) {
  const selected = [...e.target.files]
  if (selected.length) files.value = [...files.value, ...selected]
  e.target.value = ''
}

async function compress() {
  if (!files.value.length) return
  compressing.value = true
  results.value = []

  for (const file of files.value) {
    try {
      const compressed = await compressImage(file, quality.value / 100)
      const ratio = ((1 - compressed.size / file.size) * 100).toFixed(1)
      results.value.push({
        name: file.name,
        url: URL.createObjectURL(compressed),
        blob: compressed,
        originalSize: file.size,
        compressedSize: compressed.size,
        ratio: Number(ratio),
      })
    } catch {
      // skip failed files
    }
  }

  compressing.value = false
}

function compressImage(file, q) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('压缩失败'))),
        'image/jpeg',
        q
      )
      URL.revokeObjectURL(img.src)
    }
    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = URL.createObjectURL(file)
  })
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(2) + ' MB'
}

function downloadSingle(r) {
  const a = document.createElement('a')
  a.href = r.url
  a.download = r.name.replace(/\.jpe?g$/i, '') + '_compressed.jpg'
  a.click()
}

function downloadAll() {
  results.value.forEach((r, i) => {
    setTimeout(() => downloadSingle(r), i * 200)
  })
}
</script>

<style scoped>
.compress-root {
  min-height: 100vh;
  background: #0d1117;
  color: #e6edf3;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.compress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #21262d;
}

.compress-header h1 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.back-btn {
  background: none;
  border: 1px solid #30363d;
  color: #8b949e;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.back-btn:hover {
  color: #e6edf3;
  border-color: #8b949e;
}

.compress-body {
  max-width: 680px;
  margin: 0 auto;
  padding: 32px 24px;
}

.upload-zone {
  border: 2px dashed #30363d;
  border-radius: 12px;
  padding: 48px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-zone:hover,
.upload-zone.dragover {
  border-color: #58a6ff;
  background: rgba(56, 139, 253, 0.04);
}

.upload-zone.has-file {
  border-color: #238636;
  background: rgba(35, 134, 54, 0.06);
  padding: 24px;
}

.upload-icon {
  font-size: 48px;
  color: #484f58;
  display: block;
  margin-bottom: 12px;
}

.upload-zone p {
  margin: 4px 0;
  color: #8b949e;
  font-size: 14px;
}

.upload-hint {
  font-size: 12px !important;
  color: #484f58 !important;
}

.file-count {
  color: #3fb950 !important;
  font-weight: 500;
}

.quality-control {
  margin-top: 24px;
}

.quality-control label {
  display: block;
  font-size: 13px;
  color: #8b949e;
  margin-bottom: 8px;
}

.quality-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.quality-slider {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  background: #21262d;
  border-radius: 3px;
  outline: none;
}

.quality-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #58a6ff;
  border-radius: 50%;
  cursor: pointer;
}

.quality-value {
  min-width: 42px;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: #58a6ff;
}

.compress-btn {
  display: block;
  width: 100%;
  margin-top: 20px;
  padding: 12px;
  background: #238636;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.compress-btn:hover:not(:disabled) {
  background: #2ea043;
}

.compress-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.results {
  margin-top: 32px;
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.results-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

.download-all-btn {
  background: none;
  border: 1px solid #30363d;
  color: #58a6ff;
  padding: 5px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
}

.download-all-btn:hover {
  background: rgba(56, 139, 253, 0.1);
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #161b22;
  border: 1px solid #21262d;
  border-radius: 8px;
  padding: 12px;
}

.result-preview {
  width: 56px;
  height: 56px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  background: #0d1117;
}

.result-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-name {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.result-sizes {
  font-size: 12px;
  color: #8b949e;
  display: flex;
  align-items: center;
  gap: 6px;
}

.result-sizes i {
  font-size: 11px;
  color: #484f58;
}

.size-after {
  color: #3fb950;
  font-weight: 500;
}

.result-ratio {
  font-size: 12px;
  font-weight: 600;
  margin-top: 2px;
}

.result-ratio.saved {
  color: #3fb950;
}

.result-ratio.larger {
  color: #f85149;
}

.download-btn {
  background: none;
  border: 1px solid #30363d;
  color: #8b949e;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}

.download-btn:hover {
  color: #58a6ff;
  border-color: #58a6ff;
}
</style>
