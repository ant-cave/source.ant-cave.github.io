<template>
    <div class="hero">
        <div class="hero-content">
            <h1 class="hero-title">
                Ant Cave
            </h1>
            <p class="hero-subtitle">
                探索未知，创造可能
            </p>
            <div class="hero-buttons">
                <button class="hero-button primary">开始探索</button>
                <button class="hero-button secondary">了解更多</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Hero section 组件
</script>

<style scoped>
/* 全局样式重置，消除白边 */
:global(body),
:global(html) {
    margin: 0;
    padding: 0;
    /* 不设置overflow: hidden，允许滚动查看hello文本 */
}

.hero {
    width: 100%;
    min-height: 100vh;
    /* 使用min-height而不是height，允许内容扩展 */
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    /* 渐变背景替代图片 */
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    text-align: center;
    padding: 20px;
    /* 恢复一些内边距 */
    box-sizing: border-box;
    margin: 0;
}

.hero-content {
    max-width: 800px;
    padding: 40px;
    background: rgba(0, 0, 0, 0.3);
    /* 半透明背景增强可读性 */
    border-radius: 20px;
    backdrop-filter: blur(10px);
    /* 毛玻璃效果 */
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 20px;
    line-height: 1.2;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.hero-subtitle {
    font-size: 1.5rem;
    margin-bottom: 40px;
    opacity: 0.9;
    line-height: 1.6;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.hero-buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-wrap: wrap;
}

.hero-button {
    padding: 15px 30px;
    font-size: 1.1rem;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    min-width: 180px;
}

.hero-button.primary {
    background: white;
    color: #667eea;
}

.hero-button.primary:hover {
    background: #f8f9fa;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.hero-button.secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.hero-button.secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .hero-title {
        font-size: 2.5rem;
    }

    .hero-subtitle {
        font-size: 1.2rem;
    }

    .hero-buttons {
        flex-direction: column;
        align-items: center;
    }

    .hero-button {
        width: 100%;
        max-width: 300px;
    }
}
</style>
