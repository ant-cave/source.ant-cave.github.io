<template>
  <div class="auto-page">
    <!-- 未登录提示 -->
    <n-card v-if="!authUser && !authLoading" class="mb-12 login-gate">
      <div class="login-gate-body">
        <div class="login-gate-icon"><i class="ri-lock-line"></i></div>
        <div class="login-gate-title">登录后使用智能分类</div>
        <div class="login-gate-desc">
          登录后可享受每日 1GB 上传额度与 5 次分类算力。<br>
          您的图片数据仅用于分类处理，72 小时后自动清除，不会被用于其他用途。
        </div>
        <n-button type="primary" size="large" @click="doLogin" style="margin-top:12px">
          <i class="ri-login-box-line" style="margin-right:4px"></i> 登录 / 注册
        </n-button>
      </div>
    </n-card>

    <!-- 主卡片：上传 + 分类 -->
    <n-card v-if="authUser && !running && !currentRunId" :title="cardTitle" class="mb-12">
      <!-- 模式提示条 -->
      <div v-if="appendMode" class="mode-banner mode-banner-append">
        <i class="ri-add-circle-line"></i>
        <span>追加模式 — 将新图片合并到已有运行 <strong>{{ appendTargetId }}</strong></span>
        <n-button size="tiny" quaternary @click="cancelAppend" style="margin-left:auto">取消追加</n-button>
      </div>
      <div v-else class="mode-banner mode-banner-new">
        <i class="ri-file-add-line"></i>
        <span>新建分类 — 上传图片后开始全新的一键识别分组</span>
      </div>

      <div class="quota-bar">
        <span><i class="ri-upload-cloud-line"></i> 上传额度 {{ (quota.upload_limit_mb - quota.upload_used_mb).toFixed(0) }}MB / {{ quota.upload_limit_mb }}MB</span>
        <span><i class="ri-play-circle-line"></i> 分类次数 {{ quota.pipeline_limit - quota.pipeline_runs }}/{{ quota.pipeline_limit }}次</span>
        <span class="quota-refresh"><i class="ri-time-line"></i> {{ quotaRefreshIn }}</span>
        <n-tooltip trigger="hover" placement="bottom">
          <template #trigger>
            <i class="ri-information-line quota-info"></i>
          </template>
          本服务为自搭服务器，算力有限，设置每日配额以保证所有用户都能正常使用。<br>配额每日 0:00 自动重置。
        </n-tooltip>
      </div>

      <div class="step-desc" v-if="!appendMode">上传毛装角色照片，系统自动检测、提取特征、聚类分组。完成后可直接下载分类好的 ZIP 压缩包。</div>
      <div class="step-desc" v-else>将新图片追加至已有运行，系统会合并检测并重新聚类。</div>

      <div
        class="dropzone"
        @dragover.prevent="dragOver = true"
        @dragleave="dragOver = false"
        @drop.prevent="onDrop"
        :class="{ 'dropzone-active': dragOver }"
        @click="fileInput?.click()"
      >
        <input ref="fileInput" type="file" multiple accept="image/*" style="display:none" @change="onFileChange" />
        <div class="upload-area" v-if="!uploading">
          <p class="upload-title">拖拽或点击上传待分类的图片</p>
          <p class="upload-hint">JPG / PNG / WebP · 支持批量上传</p>
        </div>
        <div class="upload-area" v-else>
          <n-progress type="line" :percentage="uploadPct" indicator-placement="inside" style="max-width:300px;margin:0 auto" />
          <div class="upload-phase" v-if="uploadPhase === 'upload'">
            <i class="ri-upload-2-line"></i> 正在上传到服务器…
          </div>
          <div class="upload-phase" v-else-if="uploadPhase === 'server'">
            <n-spin :size="14" />
            服务器处理中…
          </div>
          <p class="upload-hint" style="margin-top:4px">{{ uploadPct }}%</p>
        </div>
      </div>

      <div v-if="uploadCount && !running" class="upload-summary">
        <i class="ri-image-line"></i> 已准备 <strong>{{ uploadCount }}</strong> 张图片待分类
        <span v-if="appendMode && appendTargetId" class="append-hint">→ 将追加至 {{ appendTargetId }}</span>
      </div>

      <div v-if="!uploadCount && !running" class="upload-hint-static">
        <i class="ri-image-add-line"></i> 尚未上传图片，请拖拽或点击上方区域上传
      </div>

      <div v-if="uploadCount && !running" class="action-bar">
        <n-button v-if="appendMode" type="warning" size="large" @click="startAuto" block style="height:44px;font-size:16px">
          <i class="ri-add-circle-line" style="margin-right:4px"></i> 确认追加识别
        </n-button>
        <n-button v-else type="primary" size="large" @click="startAuto" block style="height:44px;font-size:16px">
          <i class="ri-play-line" style="margin-right:4px"></i> 开始一键分类
        </n-button>
        <n-collapse style="margin-top:8px">
          <n-collapse-item title="高级参数（可选）" name="p">
            <div class="param-row">
              <div class="param-item"><label class="param-label">置信度</label><n-slider v-model:value="conf" :min="0.1" :max="0.9" :step="0.05" /><span class="slider-val">{{ conf.toFixed(2) }}</span></div>
              <div class="param-item"><label class="param-label">IoU 阈值</label><n-slider v-model:value="iou" :min="0.1" :max="0.9" :step="0.05" /><span class="slider-val">{{ iou.toFixed(2) }}</span></div>
            </div>
            <div class="param-row">
              <div class="param-item"><label class="param-label">EPS 起始</label><n-input-number v-model:value="epsStart" :min="0.5" :max="3" :step="0.1" style="width:100%" /></div>
              <div class="param-item"><label class="param-label">EPS 结束</label><n-input-number v-model:value="epsStop" :min="0.5" :max="3" :step="0.1" style="width:100%" /></div>
              <div class="param-item"><label class="param-label">EPS 步长</label><n-input-number v-model:value="epsStep" :min="0.01" :max="0.5" :step="0.01" style="width:100%" /></div>
            </div>
          </n-collapse-item>
        </n-collapse>
      </div>
    </n-card>

    <n-card v-if="running" :title="`运行进度 ${currentStage}`" class="mb-12">
      <n-progress v-if="progress.total" type="line" :percentage="progressPct" indicator-placement="inside" style="margin-bottom:12px" />
      <div class="log-box" ref="logBoxRef">
        <div v-for="(log, i) in logs" :key="i" class="log-line">{{ log }}</div>
      </div>
    </n-card>

    <n-card ref="historySectionRef" title="历史记录" class="mb-12" id="history-section">
      <template v-if="historyLoading">
        <div class="history-loading">
          <n-spin :size="18" />
          <span>加载历史记录…</span>
        </div>
      </template>
      <template v-else-if="historyRuns.length">
        <n-collapse v-model:expanded-names="expandedHistoryRunId">
          <n-collapse-item v-for="run in historyRuns" :key="run.run_id" :title="`${run.run_id} · ${run.total || '?'} 张图片`" :name="run.run_id" display-directive="show">
            <div class="result-toolbar" style="margin-bottom:8px">
              <n-button size="tiny" @click="downloadZip(run.run_id)" :loading="zipping"><i class="ri-download-line" style="margin-right:2px"></i> 下载全部 (ZIP)</n-button>
              <n-button size="tiny" @click="startAppend(run.run_id)" :disabled="running" style="margin-left:6px"><i class="ri-add-line" style="margin-right:2px"></i> 追加图片</n-button>
              <div style="flex:1" />
              <n-button size="tiny" type="error" quaternary @click="confirmDeleteRun(run.run_id)"><i class="ri-delete-bin-line" style="margin-right:2px"></i> 删除</n-button>
            </div>
            <div v-for="entry in run.entries" :key="entry.name" style="margin-top:8px">
              <div class="result-title">{{ entry.name }}</div>
              <div class="result-grid">
                <div v-for="img in entry.images" :key="img" class="result-img-wrap">
                  <img loading="lazy" :src="`${IMG_BASE}/results/auto/run/${run.run_id}/image/${entry.name}/${encodeURIComponent(img)}?thumb=1`" :alt="img" class="result-img" />
                  <div class="result-label">{{ img }}</div>
                </div>
              </div>
            </div>
          </n-collapse-item>
        </n-collapse>
      </template>
      <n-empty v-else description="暂无历史记录，上传图片后即可开始分类" style="margin:20px 0" />
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import {
  NCard, NButton, NProgress, NCollapse, NCollapseItem, NEmpty, NSpin,
  NSlider, NInputNumber, NSelect, NTooltip, useMessage, useDialog,
} from 'naive-ui'
import { useApi } from '@/composables/useApi'
import { useWs } from '@/composables/useWs'
import { useAuth } from '@/composables/useAuth'

const DEV = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
const API_BASE = DEV ? '/fursee/api' : 'https://backend.api.011420.xyz/fursee/api'
const IMG_BASE = API_BASE

const api = useApi()
const msg = useMessage()
const dialog = useDialog()
const { connect } = useWs()
const { user: authUser, loading: authLoading, login: doLogin } = useAuth()

const fileInput = ref(null)
const dragOver = ref(false)
const uploading = ref(false)
const uploadPct = ref(0)
const uploadCount = ref(0)
const uploadPhase = ref('')

const conf = ref(0.5)
const iou = ref(0.45)
const epsStart = ref(1.0)
const epsStop = ref(2.0)
const epsStep = ref(0.01)

const running = ref(false)
const currentStage = ref('')
const logs = ref([])
const progress = ref({ current: 0, total: 0 })
const zipping = ref(false)

const currentRunId = ref('')
const currentRun = ref(null)
const historyRuns = ref([])
const historyLoading = ref(true)
const expandedHistoryRunId = ref('')
const historySectionRef = ref(null)
const appendMode = ref(false)
const appendTargetId = ref('')
const logBoxRef = ref(null)

const cardTitle = computed(() => appendMode.value ? '追加分类' : '智能分类 — 一键识别分组')

watch(logs, async () => {
  await nextTick()
  if (logBoxRef.value) {
    logBoxRef.value.scrollTop = logBoxRef.value.scrollHeight
  }
}, { deep: true })

const progressPct = computed(() => progress.value.total ? Math.round((progress.value.current / progress.value.total) * 100) : 0)

const quota = ref({ upload_used_mb: 0, upload_limit_mb: 2048, pipeline_runs: 0, pipeline_limit: 8 })
const quotaRefreshIn = ref('')

async function loadQuota() {
  try {
    const quotaUrl = DEV ? '/fursee/api/quota' : `${IMG_BASE}/quota`
    const res = await fetch(quotaUrl, { credentials: 'include' })
    if (res.ok) {
      const data = await res.json()
      quota.value = data
      updateRefreshCountdown()
    }
  } catch {}
}

function updateRefreshCountdown() {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  const diff = tomorrow - now
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  quotaRefreshIn.value = `${h}小时${m}分后刷新`
}

let refreshTimer = null

const appendOptions = computed(() =>
  historyRuns.value.map(r => ({ label: `${r.run_id}（${r.total || '?'}张）`, value: r.run_id }))
)

async function doUpload(files) {
  const arr = Array.from(files).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f.name))
  const rejected = Array.from(files).filter(f => !/\.(jpg|jpeg|png|webp)$/i.test(f.name))
  if (rejected.length) console.warn(`[上传] 跳过 ${rejected.length} 个不支持的文件: ${rejected.map(f => f.name).join(', ')}`)
  if (!arr.length) return
  console.log(`[上传] 开始上传流程，有效文件 ${arr.length} 张`)
  uploading.value = true; uploadPct.value = 0; uploadPhase.value = 'upload'
  const startTime = Date.now()
  try {
    const uploadTask = api.uploadImages('auto_uploads', arr, (p, phase) => {
      if (phase === 'upload') {
        uploadPhase.value = 'upload'
        uploadPct.value = p
      } else if (phase === 'server') {
        uploadPhase.value = 'server'
        uploadPct.value = p
      } else if (phase === 'done') {
        uploadPct.value = 100
      }
    })
    await uploadTask
    uploadCount.value += arr.length
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
    console.log(`[上传] 上传流程完成，累计 ${uploadCount.value} 张，总耗时 ${elapsed}s`)
    loadQuota()
  } catch (e) {
    console.error(`[上传] 上传流程失败: ${e.message}`)
    msg.error(e.message)
  }
  finally {
    uploading.value = false; uploadPct.value = 0; uploadPhase.value = ''
    console.log(`[上传] 上传状态已重置`)
  }
}
function onDrop(e) { dragOver.value = false; if (e.dataTransfer?.files) doUpload(e.dataTransfer.files) }
function onFileChange(e) { const t = e.target; if (t.files) doUpload(t.files); t.value = '' }

async function startAuto() {
  if (!uploadCount.value) return
  console.log(`[流水线] 启动一键分类，图片数=${uploadCount.value}，追加模式=${appendMode.value}`)
  running.value = true; logs.value = []; progress.value = { current: 0, total: 0 }
  currentRunId.value = ''; currentRun.value = null
  expandedHistoryRunId.value = ''
  currentStage.value = '检测中'
  try {
    const existingId = appendMode.value ? appendTargetId.value : ''
    const params = {
      conf: conf.value, iou: iou.value,
      eps_start: epsStart.value, eps_stop: epsStop.value, eps_step: epsStep.value,
      use_augmentation: true, augmentation_count: 4,
      existing_run_id: existingId,
    }
    console.log(`[流水线] 参数: 置信度=${params.conf}，IoU=${params.iou}，EPS=${params.eps_start}/${params.eps_stop}/${params.eps_step}，增强=${params.augmentation_count}次`)
    const res = await api.startPipeline('auto', params)
    console.log(`[流水线] 服务端返回 task_id=${res.task_id}`)
    appendMode.value = false
    appendTargetId.value = ''
    connect(res.task_id, handleProgress)
  } catch (e) {
    console.error(`[流水线] 启动失败: ${e.message}`)
    msg.error(e.message); running.value = false
  }
}

function handleProgress(e) {
  if (e.event === 'progress') {
    const pct = progress.value.total ? Math.round((e.current / e.total) * 100) : 0
    console.log(`[流水线] 进度: ${e.stage} → ${e.current}/${e.total} (${pct}%)`)
    progress.value = { current: e.current ?? 0, total: e.total ?? 0 }
    if (e.stage?.includes('Step 1')) currentStage.value = '检测中'
    else if (e.stage?.includes('Step 2')) currentStage.value = '提取特征中'
    else if (e.stage?.includes('Step 3')) currentStage.value = '聚类中'
    logs.value.push(`${e.stage}: ${e.current}/${e.total}`)
  } else if (e.event === 'log') {
    console.log(`[流水线] 日志: ${e.message}`)
    logs.value.push(e.message ?? '')
  } else if (e.event === 'complete') {
    console.log(`[流水线] ✅ 全流程完成`)
    currentStage.value = '完成'
    progress.value = { current: 1, total: 1 }
    logs.value.push('全流程完成！')
    msg.success('全流程完成！')
    uploadCount.value = 0
    running.value = false
    refreshAfterRun()
    loadQuota()
  } else if (e.event === 'error') {
    console.error(`[流水线] ❌ 错误: ${e.message}`)
    logs.value.push(`错误: ${e.message}`)
    msg.error(e.message ?? '失败'); running.value = false
  }
}

async function refreshAfterRun() {
  uploadCount.value = 0
  await loadHistory()
  if (historyRuns.value.length) {
    const latest = historyRuns.value.reduce((a, b) => (a.timestamp > b.timestamp ? a : b))
    expandedHistoryRunId.value = latest.run_id
    currentRunId.value = ''
    currentRun.value = null
    await nextTick()
    const el = document.getElementById('history-section')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

async function loadHistory() {
  historyLoading.value = true
  try {
    console.log('[历史] 开始加载历史记录...')
    const data = await api.getAutoHistory()
    console.log('[历史] API返回数据:', JSON.stringify(data).slice(0, 500))
    console.log('[历史] data.runs类型:', typeof data.runs, '长度:', data.runs?.length)
    historyRuns.value = data.runs || []
    console.log('[历史] historyRuns设置完成，长度:', historyRuns.value.length)
  } catch (e) {
    console.error('[历史] 加载失败:', e.message || e)
  } finally {
    historyLoading.value = false
  }
}

function confirmDeleteRun(runId) {
  dialog.warning({
    title: '确认删除',
    content: `确定要删除运行 ${runId} 吗？对应文件将一并清除。`,
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await api.deleteRun(runId)
        msg.success('已删除')
        await loadHistory()
      } catch (e) { msg.error(e.message) }
    },
  })
}

async function downloadZip(runId) {
  zipping.value = true
  try {
    const a = document.createElement('a')
    a.href = `${API_BASE}/classified/${runId}/zip`
    a.download = `auto_${runId}.zip`
    a.click()
  } catch (e) { msg.error(e.message) }
  finally { zipping.value = false }
}

function startAppend(runId) {
  appendMode.value = true
  appendTargetId.value = runId
  uploadCount.value = 0
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelAppend() {
  appendMode.value = false
  appendTargetId.value = ''
}

function resetCurrent() {
  currentRunId.value = ''
  currentRun.value = null
  uploadCount.value = 0
  logs.value = []
  progress.value = { current: 0, total: 0 }
  expandedHistoryRunId.value = ''
  cancelAppend()
}

onMounted(() => {
  loadHistory()
  loadQuota()
  refreshTimer = setInterval(updateRefreshCountdown, 60000)
})

watch(authUser, (newUser, oldUser) => {
  if (newUser && !oldUser) {
    loadHistory()
    loadQuota()
  }
})
</script>

<style scoped>
.auto-page { max-width: 900px; margin:0 auto; }
.mb-12 { margin-bottom:12px; }
.step-desc { font-size:13px; color:#666; margin-bottom:16px; line-height:1.6; }
.dropzone { border:2px dashed #d9d9d9; border-radius:8px; cursor:pointer; transition:all .2s; }
.dropzone:hover, .dropzone-active { border-color:#333; background:#f8f8f8; }
.upload-area { padding:32px; text-align:center; }
.upload-title { margin:4px 0; font-size:15px; color:#333; font-weight:500; }
.upload-hint { margin:4px 0; font-size:12px; color:#999; }
.upload-phase { display:flex; align-items:center; justify-content:center; gap:6px; margin-top:6px; font-size:13px; color:#666; }
.upload-phase i { font-size:16px; }
.quota-bar { display:flex; gap:16px; font-size:12px; color:#666; margin-bottom:12px; padding:8px 12px; background:#f7f8fa; border-radius:6px; flex-wrap:wrap; align-items:center; }
.quota-bar i { font-size:14px; vertical-align:-1px; }
.quota-refresh { color:#999; margin-left:auto; }
.quota-info { cursor:pointer; color:#999; margin-left:4px; font-size:13px; }
.history-loading { display:flex; align-items:center; justify-content:center; gap:8px; padding:20px; color:#999; font-size:13px; }
.upload-summary { margin:12px 0; font-size:14px; color:#333; display:flex; align-items:center; gap:6px; }
.upload-summary i { color:#52c41a; font-size:16px; }
.append-hint { color:#f0a020; font-size:12px; margin-left:4px; }
.upload-hint-static { margin:12px 0; font-size:13px; color:#999; text-align:center; padding:8px; background:#fafafa; border-radius:6px; }
.upload-hint-static i { margin-right:4px; }
.action-bar { margin-top:16px; }
.param-row { display:flex; gap:12px; margin-bottom:8px; }
.param-item { flex:1; min-width:0; }
.param-label { display:block; font-size:12px; color:#666; margin-bottom:4px; }
.slider-val { margin-left:8px; color:#666; font-size:12px; }
.log-line { font-size:12px; color:#666; padding:2px 0; font-family:monospace; }
.log-box { max-height:240px; overflow-y:auto; background:#f7f8fa; border-radius:6px; padding:8px 12px; border:1px solid #eee; }
.result-toolbar { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
.result-title { font-weight:600; font-size:13px; margin-bottom:4px; color:#333; }
.result-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(100px,1fr)); gap:6px; }
.result-img-wrap { border:1px solid #eee; border-radius:6px; overflow:hidden; background:#fff; content-visibility:auto; contain-intrinsic-size:100px; }
.result-img { width:100%; height:100px; object-fit:cover; display:block; }
.result-label { padding:2px 4px; font-size:10px; color:#666; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

/* 登录提示 */
.login-gate { border:2px dashed #d9d9d9; }
.login-gate-body { text-align:center; padding:24px 16px; }
.login-gate-icon { font-size:48px; color:#ccc; margin-bottom:12px; }
.login-gate-title { font-size:18px; font-weight:600; color:#333; margin-bottom:8px; }
.login-gate-desc { font-size:13px; color:#888; line-height:1.8; }

/* 模式提示条 */
.mode-banner { display:flex; align-items:center; gap:8px; padding:10px 14px; border-radius:6px; margin-bottom:12px; font-size:13px; }
.mode-banner i { font-size:16px; }
.mode-banner-new { background:#e6f7ff; color:#1677ff; border:1px solid #91d5ff; }
.mode-banner-append { background:#fff7e6; color:#d46b08; border:1px solid #ffd591; }

@media (max-width:768px) {
  .param-row { flex-direction:column; gap:0; }
  .result-grid { grid-template-columns:repeat(3,1fr); gap:4px; }
  .upload-area { padding:20px 12px; }
  .upload-title { font-size:14px; }
  .quota-bar { flex-direction:column; gap:6px; font-size:11px; padding:6px 10px; }
  .quota-refresh { margin-left:0; }
  .mode-banner { flex-wrap:wrap; font-size:12px; padding:8px 10px; }
  .mode-banner span { flex:1; min-width:0; }
  .login-gate-body { padding:16px 8px; }
  .login-gate-icon { font-size:36px; }
  .login-gate-title { font-size:16px; }
  .login-gate-desc { font-size:12px; }
  .action-bar .n-button { height:40px !important; font-size:15px !important; }
  .current-run-header { flex-direction:column; gap:8px; align-items:flex-start !important; }
  .result-toolbar { gap:6px; }
  .result-toolbar .n-button { font-size:12px; }
}
@media (max-width:400px) {
  .result-grid { grid-template-columns:repeat(2,1fr); }
}
</style>
