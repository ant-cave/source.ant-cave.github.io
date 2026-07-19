<script setup>
import PageNavButtons from "@/components/PageNavButtons.vue";

defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
});

const emit = defineEmits(["navigate"]);
</script>

<template>
  <div class="basic-page tech-page footer-page" id="page-5">
    <div class="footer-content">
      <h1 class="footer-title">Ant Cave</h1>
      <p class="footer-text">© 2025 Ant Cave. 使用 AGPL-3.0 许可证开源。</p>
      <p class="footer-text">探索未知 创造可能</p>
      <p class="footer-text" style="font-size: 0.75rem; opacity: 0.6;">Auto-deployed via GitHub Actions</p>
    </div>

    <PageNavButtons
      :current-page="5"
      :total-pages="totalPages"
      theme="dark"
      @navigate="emit('navigate', $event)"
    />
  </div>
</template>
