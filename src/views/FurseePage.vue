<template>
  <div class="fursee-page">
    <div class="fp-header">
      <button class="fp-back" @click="$router.push('/')">← 返回首页</button>
      <h1 class="fp-title">傻瓜模式 — 一键分类</h1>
    </div>

    <div class="fp-body">
      <div
        class="dropzone"
        @dragover.prevent="dragOver = true"
        @dragleave="dragOver = false"
        @drop.prevent="onDrop"
        :class="{ 'dropzone-active': dragOver }"
        @click="fileInput?.click()"
        v-if="!running && !results.length"
      >
        <input ref="fileInput" type="file" multiple accept="image/*" style="display:none" @change="onFileChange" />
        <div class="upload-area" v-if="!uploading">
          <p class="upload-title">拖拽或点击上传待分类的图片</p>
          <p class="upload-hint">JPG / PNG / WebP</p>
        </div>
        <div class="upload-area" v-else>
          <div class="fp-progress-wrap">
            <div class="fp-progress-bar" :style="{ width: uploadPct + '%' }"></div>
          </div>
          <p class="upload-hint" style="margin-top:4px">{{ uploadPct }}%</p>
        </div>
      </div>

      <div v-if="uploadCount && !running && !results.length" class="upload-summary">
        已上传 {{ uploadCount }} 张图片
      </div>

      <div v-if="!running && !results.length" class="action-bar">
        <button class="fp-btn fp-btn-primary" @click="startAuto" :disabled="!uploadCount">
          🚀 开始一键分类
        </button>
        <details class="fp-params">
          <summary class="fp-params-summary">高级参数（可选）</summary>
          <div class="param-row">
            <div class="param-item">
              <label class="param-label">置信度</label>
              <input type="range" v-model.number="conf" :min="0.1" :max="0.9" :step="0.05" class="fp-slider" />
              <span class="slider-val">{{ conf.toFixed(2) }}</span>
            </div>
            <div class="param-item">
              <label class="param-label">IoU 阈值</label>
              <input type="range" v-model.number="iou" :min="0.1" :max="0.9" :step="0.05" class="fp-slider" />
              <span class="slider-val">{{ iou.toFixed(2) }}</span>
            </div>
          </div>
          <div class="param-row">
            <div class="param-item">
              <label class="param-label">EPS 起始</label>
              <input type="number" v-model.number="epsStart" :min="0.5" :max="3" :step="0.1" class="fp-input" />
            </div>
            <div class="param-item">
              <label class="param-label">EPS 结束</label>
              <input type="number" v-model.number="epsStop" :min="0.5" :max="3" :step="0.1" class="fp-input" />
            </div>
            <div class="param-item">
              <label class="param-label">EPS 步长</label>
              <input type="number" v-model.number="epsStep" :min="0.01" :max="0.5" :step="0.01" class="fp-input" />
            </div>
          </div>
        </details>
      </div>

      <div v-if="running" class="fp-card">
        <h3>运行进度 {{ currentStage }}</h3>
        <div v-if="progress.total" class="fp-progress-wrap" style="margin-bottom:12px">
          <div class="fp-progress-bar" :style="{ width: progressPct + '%' }"></div>
        </div>
        <div v-for="(log, i) in logs" :key="i" class="log-line">{{ log }}</div>
      </div>

      <template v-if="results.length">
        <div class="fp-card">
          <div class="result-toolbar">
            <button class="fp-btn fp-btn-primary" @click="downloadZip" :disabled="zipping">📦 下载全部 (ZIP)</button>
            <button class="fp-btn" @click="resetAll">重新开始</button>
            <span class="result-summary">{{ totalClassified }} 张图片 · {{ results.length }} 个分类</span>
          </div>
          <div class="fp-notice">
            分类结果存储在服务器，每个分类一个文件夹。点击上方按钮打包下载。
          </div>
        </div>

        <div class="fp-card" v-for="entry in results" :key="entry.name">
          <h3>{{ entry.name }}（{{ entry.image_count }} 张）</h3>
          <div class="result-grid">
            <div v-for="img in entry.images" :key="img" class="result-img-wrap">
              <img :src="`https://fursee.api.011420.xyz/api/results/auto/image/${entry.name}/${encodeURIComponent(img)}`" :alt="img" class="result-img" />
              <div class="result-label">{{ img }}</div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMessage, useDialog } from 'naive-ui'

const BASE = 'https://fursee.api.011420.xyz'
const msg = useMessage()
const dialog = useDialog()

onMounted(async () => {
  try {
    const res = await fetch(`${BASE}/api/stats`, { method: 'HEAD' })
    if (!res.ok) throw new Error('not ok')
  } catch {
    dialog.warning({
      title: '无法连接到后端',
      content: 'Fursee 后端服务当前不可用，请稍后再试。',
      positiveText: '知道了',
      maskClosable: true,
    })
  }
})

const fileInput = ref(null)
const dragOver = ref(false)
const uploading = ref(false)
const uploadPct = ref(0)
const uploadCount = ref(0)

const conf = ref(0.5)
const iou = ref(0.45)
const epsStart = ref(1.0)
const epsStop = ref(2.0)
const epsStep = ref(0.01)

const running = ref(false)
const currentStage = ref('')
const logs = ref([])
const progress = ref({ current: 0, total: 0 })
const results = ref([])
const zipping = ref(false)

const progressPct = computed(() => progress.value.total ? Math.round((progress.value.current / progress.value.total) * 100) : 0)
const totalClassified = computed(() => results.value.reduce((s, e) => s + (e.image_count || 0), 0))

async function request(path, options = {}) {
  const url = `${BASE}${path}`
  const res = await fetch(url, options)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || err.detail || `HTTP ${res.status}`)
  }
  return res
}

async function doUpload(files) {
  const arr = Array.from(files).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f.name))
  if (!arr.length) return
  uploading.value = true; uploadPct.value = 0
  try {
    const form = new FormData()
    arr.forEach(f => form.append('files', f))
    const xhr = new XMLHttpRequest()
    await new Promise((resolve, reject) => {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) uploadPct.value = Math.round((e.loaded / e.total) * 100)
      }
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve()
        else reject(new Error(`Upload failed: ${xhr.status}`))
      }
      xhr.onerror = () => reject(new Error('Network error'))
      xhr.open('POST', `${BASE}/api/images/auto_uploads/upload`)
      xhr.send(form)
    })
    uploadCount.value += arr.length
  } catch (e) {
    msg.error(e.message)
  } finally {
    uploading.value = false
    uploadPct.value = 0
  }
}
function onDrop(e) { dragOver.value = false; if (e.dataTransfer?.files) doUpload(e.dataTransfer.files) }
function onFileChange(e) { const t = e.target; if (t.files) doUpload(t.files); t.value = '' }

async function startAuto() {
  if (!uploadCount.value) return
  running.value = true; logs.value = []; progress.value = { current: 0, total: 0 }; results.value = []
  currentStage.value = '📷 检测中'
  try {
    const res = await request('/api/pipeline/auto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conf: conf.value, iou: iou.value,
        eps_start: epsStart.value, eps_stop: epsStop.value, eps_step: epsStep.value,
        use_augmentation: true, augmentation_count: 4,
      }),
    })
    const { task_id } = await res.json()
    connectWs(task_id)
  } catch (e) {
    msg.error(e.message)
    running.value = false
  }
}

let ws = null
function connectWs(taskId) {
  const proto = 'wss:'
  const url = `${proto}//fursee.api.011420.xyz/api/ws/${taskId}`
  ws = new WebSocket(url)
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      if (data.event === 'progress') {
        progress.value = { current: data.current ?? 0, total: data.total ?? 0 }
        if (data.stage?.includes('Step 1')) currentStage.value = '📷 检测中'
        else if (data.stage?.includes('Step 2')) currentStage.value = '🧠 提取特征中'
        else if (data.stage?.includes('Step 3')) currentStage.value = '🔗 聚类中'
        logs.value.push(`${data.stage}: ${data.current}/${data.total}`)
      } else if (data.event === 'log') {
        logs.value.push(data.message ?? '')
      } else if (data.event === 'complete') {
        currentStage.value = '✅ 完成'
        progress.value = { current: 1, total: 1 }
        logs.value.push('✅ 全流程完成！')
        msg.success('全流程完成！')
        running.value = false
        ws?.close(); ws = null
        loadResults()
      } else if (data.event === 'error') {
        logs.value.push(`❌ ${data.message}`)
        msg.error(data.message ?? '失败')
        running.value = false
        ws?.close(); ws = null
      }
    } catch { /* ignore */ }
  }
  ws.onerror = () => { msg.error('WebSocket 连接失败'); running.value = false }
}

async function loadResults() {
  try {
    const res = await request('/api/results/auto')
    const data = await res.json()
    results.value = data.entries || []
  } catch { /* ignore */ }
}

async function downloadZip() {
  zipping.value = true
  try {
    const a = document.createElement('a')
    a.href = `${BASE}/api/results/auto/zip`
    a.download = 'auto_classify.zip'
    a.click()
  } catch (e) {
    msg.error(e.message)
  } finally {
    zipping.value = false
  }
}

function resetAll() {
  uploadCount.value = 0; logs.value = []; results.value = []
  progress.value = { current: 0, total: 0 }; running.value = false
}
</script>

<style scoped>
.fursee-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px 80px;
  min-height: 100vh;
  background: #f5f5f5;
}
.fp-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}
.fp-back {
  background: none;
  border: none;
  color: #555;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
}
.fp-back:hover { background: #eee; color: #333; }
.fp-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}
.fp-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.dropzone {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  transition: all .2s;
  background: #fff;
}
.dropzone:hover, .dropzone-active { border-color: #333; background: #f8f8f8; }
.upload-area { padding: 32px; text-align: center; }
.upload-title { margin: 4px 0; font-size: 15px; color: #333; font-weight: 500; }
.upload-hint { margin: 4px 0; font-size: 12px; color: #999; }
.upload-summary { font-size: 13px; color: #666; }
.action-bar { margin-top: 4px; }
.fp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  height: 40px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #d9d9d9;
  background: #fff;
  color: #333;
  cursor: pointer;
  transition: all .2s;
  font-weight: 500;
}
.fp-btn:hover { border-color: #555; background: #f8f8f8; }
.fp-btn-primary {
  background: #333;
  border-color: #333;
  color: #fff;
}
.fp-btn-primary:hover { background: #555; border-color: #555; }
.fp-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.fp-params {
  margin-top: 8px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px 16px;
}
.fp-params-summary {
  font-size: 13px;
  color: #666;
  cursor: pointer;
  font-weight: 500;
}
.fp-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px 20px;
}
.fp-card h3 {
  margin: 0 0 12px 0;
  font-size: 15px;
  color: #1a1a1a;
}
.fp-progress-wrap {
  width: 100%;
  height: 8px;
  background: #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
}
.fp-progress-bar {
  height: 100%;
  background: #333;
  border-radius: 4px;
  transition: width .3s;
}
.fp-notice {
  font-size: 13px;
  color: #666;
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 10px 14px;
  line-height: 1.5;
}
.param-row { display: flex; gap: 12px; margin-bottom: 8px; }
.param-item { flex: 1; min-width: 0; }
.param-label { display: block; font-size: 12px; color: #666; margin-bottom: 4px; }
.slider-val { margin-left: 8px; color: #666; font-size: 12px; }
.fp-slider { width: 100%; }
.fp-input {
  width: 100%;
  box-sizing: border-box;
  padding: 6px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 13px;
  background: #fafafa;
  outline: none;
}
.fp-input:focus { border-color: #555; background: #fff; }
.log-line { font-size: 12px; color: #666; padding: 2px 0; font-family: monospace; }
.result-toolbar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 12px; }
.result-summary { font-size: 13px; color: #999; }
.result-grid { display: grid; grid-template-columns:repeat(auto-fill, minmax(110px,1fr)); gap: 8px; }
.result-img-wrap { border: 1px solid #eee; border-radius: 6px; overflow:hidden; background:#fff; }
.result-img { width:100%; height:110px; object-fit:cover; display:block; }
.result-label { padding:3px 5px; font-size:10px; color:#666; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
@media (max-width: 768px) {
  .param-row { flex-direction:column; gap:0; }
  .result-grid { grid-template-columns:repeat(3,1fr); }
  .upload-area { padding:20px; }
}
</style>
