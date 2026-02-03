<!--
  PageNavButtons.vue — 翻页按钮组件
  Copyright (C) 2025 ANTmmmmm <ANTmmmmm@outlook.com>

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
-->

<script setup>
const props = defineProps({
    // 当前页索引
    currentPage: {
        type: Number,
        required: true
    },
    // 总页数
    totalPages: {
        type: Number,
        required: true
    },
    // 主题：'light' 或 'dark'
    theme: {
        type: String,
        default: 'dark'
    }
});

const emit = defineEmits(['navigate']);

// 上一页
const goPrev = () => {
    if (props.currentPage > 0) {
        emit('navigate', props.currentPage - 1);
    }
};

// 下一页
const goNext = () => {
    if (props.currentPage < props.totalPages - 1) {
        emit('navigate', props.currentPage + 1);
    }
};
</script>

<template>
    <div class="page-nav-buttons">
        <button
            v-if="currentPage > 0"
            class="nav-btn"
            :class="theme"
            @click="goPrev"
            title="上一页"
        >
            ↑
        </button>
        <button
            v-if="currentPage < totalPages - 1"
            class="nav-btn"
            :class="theme"
            @click="goNext"
            title="下一页"
        >
            ↓
        </button>
    </div>
</template>

<style scoped>
.page-nav-buttons {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 16px;
    z-index: 100;
}

.nav-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid;
    font-size: 1.3rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
}

/* 亮色主题 */
.nav-btn.light {
    color: #636e72;
    border-color: #dfe6e9;
    background: rgba(255, 255, 255, 0.9);
}

.nav-btn.light:hover {
    color: #00b894;
    border-color: #00b894;
    background: white;
    box-shadow: 0 4px 12px rgba(0, 184, 148, 0.25);
}

/* 暗色主题 */
.nav-btn.dark {
    color: #a0a0a0;
    border-color: #2a2a2a;
    background: rgba(20, 20, 20, 0.9);
}

.nav-btn.dark:hover {
    color: #00b894;
    border-color: #00b894;
    background: #1a1a1a;
    box-shadow: 0 0 20px rgba(0, 184, 148, 0.4);
}

/* 响应式 */
@media (max-width: 768px) {
    .page-nav-buttons {
        bottom: 20px;
        gap: 12px;
    }

    .nav-btn {
        width: 42px;
        height: 42px;
        font-size: 1.1rem;
    }
}
</style>
