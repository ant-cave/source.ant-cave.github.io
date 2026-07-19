<script setup>
import PageNavButtons from "@/components/PageNavButtons.vue";

defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
});

const emit = defineEmits(["navigate"]);
</script>

<template>
  <div class="basic-page para-page light-page" id="page-1">
    <div class="container">
      <h1 class="page-title">关于我</h1>
      <div class="box mainPara">
        <div class="para">
          <h2>深圳高中生开发者</h2>
          <p>喜欢写一些实用的小工具，正在学习各种技术。热衷于开源项目和技术分享。</p>
        </div>
      </div>

      <div class="hr"></div>

      <h1 class="page-title">我的项目</h1>
      <div class="projects-grid">
        <div class="project-card">
          <h3>个人博客</h3>
          <p>基于 Jekyll 构建的静态博客，记录学习笔记和技术分享，支持自动部署。</p>
          <div class="project-tags">
            <span class="tag">Jekyll</span>
            <span class="tag">Ruby</span>
            <span class="tag">GitHub Actions</span>
          </div>
          <div class="project-links">
            <a href="/blog" class="project-link" target="_self">查看详情 →</a>
            <a href="https://github.com/ant-cave/blog/" target="_blank" class="project-link">查看仓库 →</a>
          </div>
        </div>
        <a href="https://github.com/HelixNow/deep-student" target="_blank" class="project-card">
          <h3>Deep Student</h3>
          <p>开源、本地优先的 AI 学习工作台，基于 Tauri 构建，支持全平台桌面端与移动端。</p>
          <div class="project-tags">
            <span class="tag">TypeScript</span>
            <span class="tag">Rust</span>
            <span class="tag">Tauri</span>
          </div>
          <span class="project-link">查看详情 →</span>
        </a>
        <a href="https://github.com/ant-cave/open-tauri-remote-webview" target="_blank" class="project-card">
          <h3>Open Tauri Remote WebView</h3>
          <p>为 Tauri 应用提供远程 WebView 能力的 Rust 库，支持移动端和桌面端灵活渲染。</p>
          <div class="project-tags">
            <span class="tag">Rust</span>
            <span class="tag">Tauri</span>
            <span class="tag">WebView</span>
          </div>
          <span class="project-link">查看详情 →</span>
        </a>
        <a href="https://github.com/ant-cave/llm_format_bridge" target="_blank" class="project-card">
          <h3>LLM Format Bridge</h3>
          <p>LLM 输出格式转换桥接工具，支持多种 AI 模型输出的格式标准化与互转。</p>
          <div class="project-tags">
            <span class="tag">JavaScript</span>
            <span class="tag">LLM</span>
            <span class="tag">API</span>
          </div>
          <span class="project-link">查看详情 →</span>
        </a>
        <a href="https://github.com/ant-cave/tencentComicDownloadTool" target="_blank" class="project-card">
          <h3>腾讯漫画下载工具</h3>
          <p>Python 开发的腾讯动漫下载器，支持批量下载、多线程加速和自动重试。</p>
          <div class="project-tags">
            <span class="tag">Python</span>
            <span class="tag">多线程</span>
            <span class="tag">下载器</span>
          </div>
          <span class="project-link">查看详情 →</span>
        </a>
        <a href="https://github.com/ant-cave/frp-controller" target="_blank" class="project-card">
          <h3>FRP Controller</h3>
          <p>FRP 内网穿透隧道管理工具，提供 Web 管理界面，轻松管理多个 frp 隧道配置。</p>
          <div class="project-tags">
            <span class="tag">Python</span>
            <span class="tag">frp</span>
            <span class="tag">内网穿透</span>
          </div>
          <span class="project-link">查看详情 →</span>
        </a>
        <a href="https://github.com/ant-cave/py-totp-new" target="_blank" class="project-card">
          <h3>TOTP 密码管理器</h3>
          <p>本地化的双因素验证码管理工具，AES 加密存储，支持自动刷新和主题切换。</p>
          <div class="project-tags">
            <span class="tag">Python</span>
            <span class="tag">PySide6</span>
            <span class="tag">加密</span>
          </div>
          <span class="project-link">查看详情 →</span>
        </a>
      </div>
    </div>

    <PageNavButtons
      :current-page="1"
      :total-pages="totalPages"
      theme="light"
      @navigate="emit('navigate', $event)"
    />
  </div>
</template>
