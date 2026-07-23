<template>
  <n-modal v-model:show="visible" :mask-closable="false" preset="card" style="max-width:560px" title="使用须知" closable>
    <div class="disclaimer-body">
      <p><strong>隐私与数据</strong></p>
      <ul>
        <li>上传的图片仅用于本次分类处理，不会用于训练模型或任何其他目的</li>
        <li>处理结果（包括原图及分组）将在 72 小时后自动从服务器彻底删除</li>
        <li>您也可以随时手动删除任意历史记录，对应文件会立即清除</li>
        <li>您的图片数据不会出售、分享或传播给任何第三方</li>
      </ul>
      <p><strong>版权与许可</strong></p>
      <p>Fursee &copy; Jundi Wu &middot; GUI Shell by ant-cave &middot; AGPL-3.0</p>
      <p class="disclaimer-footer">点击「我已了解」即表示接受上述条款</p>
    </div>
    <template #footer>
      <n-button type="primary" @click="accept">我已了解</n-button>
    </template>
  </n-modal>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { NModal, NButton } from 'naive-ui'

const visible = ref(false)

function accept() {
  visible.value = false
  localStorage.setItem('fursee_disclaimer', '1')
}

onMounted(() => {
  if (!localStorage.getItem('fursee_disclaimer')) {
    visible.value = true
  }
})
</script>

<style scoped>
.disclaimer-body { font-size: 13px; line-height: 1.7; color: #333; }
.disclaimer-body ul { padding-left: 18px; margin: 8px 0; }
.disclaimer-body li { margin-bottom: 6px; }
.disclaimer-footer { margin-top: 12px; font-size: 12px; color: #999; }
</style>
