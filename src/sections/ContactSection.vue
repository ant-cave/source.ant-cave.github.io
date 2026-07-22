<script setup>
import PageNavButtons from "@/components/PageNavButtons.vue";

defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
});

const emit = defineEmits(["navigate"]);
</script>

<template>
  <div class="basic-page tech-page" id="page-5">
    <div class="container">
      <h1 class="page-title tech-title">联系</h1>
      <div class="contact-grid">
        <a href="mailto:ANTmmmmm@outlook.com" class="contact-card">
          <i class="contact-icon ri-mail-line"></i>
          <h3>邮箱</h3>
          <p>ANTmmmmm@outlook.com</p>
        </a>
        <a href="https://github.com/ant-cave" target="_blank" class="contact-card">
          <i class="contact-icon ri-github-line"></i>
          <h3>GitHub</h3>
          <p>@ant-cave（主号）</p>
          <small style="color: var(--dark-text-secondary); font-size: 0.75rem;">小号：ANT-mmmmm、redirect-to</small>
        </a>
      </div>
    </div>

    <PageNavButtons
      :current-page="5"
      :total-pages="totalPages"
      theme="dark"
      @navigate="emit('navigate', $event)"
    />
  </div>
</template>
