<script setup>
import PageNavButtons from "@/components/PageNavButtons.vue";

defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
});

const emit = defineEmits(["navigate"]);
</script>

<template>
  <div class="basic-page tech-page" id="page-3">
    <div class="container">
      <h1 class="page-title tech-title">技术栈</h1>
      <div class="tech-grid">
        <div class="tech-card">
          <img src="@/assets/icons/python.svg" class="tech-icon" alt="Python">
          <h3>Python</h3>
          <p>主要开发语言，用于工具和桌面应用开发</p>
        </div>
        <div class="tech-card">
          <i class="tech-icon ri-code-line"></i>
          <h3>前端</h3>
          <p>Vue 3 / TypeScript</p>
        </div>
        <div class="tech-card">
          <i class="tech-icon ri-terminal-box-line"></i>
          <h3>Rust</h3>
          <p>Tauri 桌面应用开发</p>
        </div>
        <div class="tech-card">
          <i class="tech-icon ri-robot-line"></i>
          <h3>Java</h3>
          <p>Minecraft 插件开发</p>
        </div>
      </div>
    </div>

    <PageNavButtons
      :current-page="3"
      :total-pages="totalPages"
      theme="dark"
      @navigate="emit('navigate', $event)"
    />
  </div>
</template>
