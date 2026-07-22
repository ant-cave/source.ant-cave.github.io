<script setup>
import PageNavButtons from "@/components/PageNavButtons.vue";

defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
});

const emit = defineEmits(["navigate"]);
</script>

<template>
  <div class="basic-page tech-page" id="page-4">
    <div class="container">
      <h1 class="page-title tech-title">经历</h1>
      <div class="timeline">
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h3>未来</h3>
            <p>继续探索，持续学习新技术</p>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h3>2026 - 至今</h3>
            <p>参与 CloudAI 团队项目，学习 Rust 和 Tauri 开发</p>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h3>2025</h3>
            <p>开发 TOTP 密码管理器，开始接触开源</p>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h3>2024</h3>
            <p>Minecraft 插件开发，开始做实用工具</p>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h3>2022</h3>
            <p>开始学习 Java，深入了解编程</p>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h3>2020</h3>
            <p>第一次接触 Python，从此入坑编程</p>
          </div>
        </div>
      </div>
    </div>

    <PageNavButtons
      :current-page="4"
      :total-pages="totalPages"
      theme="dark"
      @navigate="emit('navigate', $event)"
    />
  </div>
</template>
