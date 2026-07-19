<script setup>
import { useRouter, useRoute } from "vue-router";
import { computed } from "vue";

const router = useRouter();
const route = useRoute();

const projects = [
  {
    id: "blog",
    title: "个人博客",
    description: "基于 Jekyll 构建的静态博客，记录学习笔记和技术分享，支持自动部署。",
    tags: ["Jekyll", "Ruby", "GitHub Actions"],
    lang: "Ruby",
    links: [
      { label: "查看详情", url: "/blog" },
      { label: "查看仓库", url: "https://github.com/ant-cave/blog/" },
    ],
  },
  {
    id: "deep-student",
    title: "Deep Student",
    description: "开源、本地优先的 AI 学习工作台，基于 Tauri + React 构建，支持全平台桌面端与移动端。",
    tags: ["TypeScript", "Rust", "Tauri"],
    lang: "TypeScript",
    links: [
      { label: "查看仓库", url: "https://github.com/HelixNow/deep-student" },
    ],
  },
  {
    id: "open-tauri-remote-webview",
    title: "Open Tauri Remote WebView",
    description: "为 Tauri 应用提供远程 WebView 能力的 Rust 库，支持移动端和桌面端灵活渲染。",
    tags: ["Rust", "Tauri", "WebView"],
    lang: "Rust",
    links: [
      { label: "查看仓库", url: "https://github.com/ant-cave/open-tauri-remote-webview" },
    ],
  },
  {
    id: "llm-format-bridge",
    title: "LLM Format Bridge",
    description: "LLM 输出格式转换桥接工具，支持多种 AI 模型输出的格式标准化与互转。",
    tags: ["JavaScript", "LLM", "API"],
    lang: "JavaScript",
    links: [
      { label: "查看仓库", url: "https://github.com/ant-cave/llm_format_bridge" },
    ],
  },
  {
    id: "tencent-comic-downloader",
    title: "腾讯漫画下载工具",
    description: "Python 开发的腾讯动漫下载器，支持批量下载、多线程加速和自动重试。",
    tags: ["Python", "多线程", "下载器"],
    lang: "Python",
    links: [
      { label: "查看仓库", url: "https://github.com/ant-cave/tencentComicDownloadTool" },
    ],
  },
  {
    id: "frp-controller",
    title: "FRP Controller",
    description: "FRP 内网穿透隧道管理工具，提供 Web 管理界面，轻松管理多个 frp 隧道配置。",
    tags: ["Python", "frp", "内网穿透"],
    lang: "Python",
    links: [
      { label: "查看仓库", url: "https://github.com/ant-cave/frp-controller" },
    ],
  },
  {
    id: "totp-manager",
    title: "TOTP 密码管理器",
    description: "本地化的双因素验证码管理工具，AES 加密存储，支持自动刷新和主题切换。",
    tags: ["Python", "PySide6", "加密"],
    lang: "Python",
    links: [
      { label: "查看仓库", url: "https://github.com/ant-cave/py-totp-new" },
    ],
  },
  {
    id: "ant-cave-backend",
    title: "Ant Cave Backend",
    description: "自建网站访客追踪分析系统，基于 FastAPI + SQLite，轻量级、自托管。",
    tags: ["FastAPI", "SQLite", "Analytics"],
    lang: "Python",
    links: [
      { label: "查看仓库", url: "https://github.com/ant-cave/ant-cave-backend" },
    ],
  },
  {
    id: "ai-api-service",
    title: "AI API Service",
    description: "AI API 请求路由与优先级调度服务，聚合多个模型为单一 OpenAI 兼容端点。",
    tags: ["Python", "AI", "API"],
    lang: "Python",
    links: [
      { label: "查看仓库", url: "https://github.com/ant-cave/ai-api-service" },
    ],
  },
  {
    id: "sleep-or-alive",
    title: "SleepOrAlive",
    description: "基于 FastAPI 的轻量级服务管理系统，支持服务的上下线控制和异步命令执行，带有美观的 Web UI 界面。",
    tags: ["FastAPI", "服务管理", "Web UI"],
    lang: "Python",
    links: [
      { label: "查看仓库", url: "https://github.com/ant-cave/sleepOrAlive" },
    ],
  },
  {
    id: "keep-contact",
    title: "Keep Contact",
    description: "基于 Rust 开发的去中心化 P2P 聊天应用，使用端到端加密保护通信隐私。",
    tags: ["Rust", "P2P", "端到端加密"],
    lang: "Rust",
    links: [
      { label: "查看仓库", url: "https://github.com/ant-cave/keep_contact" },
    ],
  },
  {
    id: "cloud-ai-presentation-clicker",
    title: "云AI智能翻页笔",
    description: "AI 多功能演示翻页笔，支持响应式翻页控制、语音交互、一键保存笔记等功能。",
    tags: ["AI", "演示"],
    lang: "",
    links: [
      { label: "查看仓库", url: "https://github.com/ant-cave/Cloud-AI-Multi-functionalPresentationClicker" },
    ],
  },
  {
    id: "ai-tunnel",
    title: "AI Tunnel",
    description: "高性能 AI API 代理隧道服务，提供统一接口访问多个 AI 模型提供商，支持智能路由、故障转移和健康检查。",
    tags: ["Python", "AI", "代理"],
    lang: "Python",
    links: [
      { label: "查看仓库", url: "https://github.com/ant-cave/ai_tunnel" },
    ],
  },
  {
    id: "token-go",
    title: "TokenGo",
    description: "基于 Tauri + Vue 3 的本地 TOTP 密码管理器，加密存储密钥、实时生成动态验证码，支持密钥导入。",
    tags: ["Vue", "Tauri", "TOTP"],
    lang: "Vue",
    links: [
      { label: "查看仓库", url: "https://github.com/ant-cave/TokenGo" },
    ],
  },
  {
    id: "time-lens",
    title: "Time Lens",
    description: "基于 Tauri + Vue 3 的时间管理应用，追踪和分析时间分配。",
    tags: ["Vue", "Tauri", "时间管理"],
    lang: "Vue",
    links: [
      { label: "查看仓库", url: "https://github.com/ant-cave/time-lens" },
    ],
  },
  {
    id: "ehdownloader-next",
    title: "EH Downloader Next",
    description: "快速的多线程 E-Hentai 画廊下载器，带有美观的终端界面，支持自动分页和跨平台。",
    tags: ["Python", "下载器", "多线程"],
    lang: "Python",
    links: [
      { label: "查看仓库", url: "https://github.com/ant-cave/ehdownloader-next" },
    ],
  },
  {
    id: "math-agent",
    title: "Math Agent",
    description: "基于 AI 的 K12 数学解题智能体，通过 LLM 分步推理 + SymPy 等真实数学工具库执行，避免计算幻觉。",
    tags: ["Python", "FastAPI", "AI", "数学"],
    lang: "Python",
    links: [
      { label: "查看仓库", url: "https://github.com/ant-cave/math-agent" },
    ],
  },
  {
    id: "qwenlm-to-api",
    title: "QwenLM to API",
    description: "通义千问模型转 OpenAI 兼容 API 接口，基于 Selenium 自动化驱动。",
    tags: ["Python", "AI", "API"],
    lang: "Python",
    links: [
      { label: "查看仓库", url: "https://github.com/ant-cave/qwenlmToApi" },
    ],
  },
  {
    id: "poetry-fill-blank",
    title: "诗词默写生成器",
    description: "通过 AI 生成诗词理解性默写题目，并输出为可打印的 HTML 试卷。",
    tags: ["Python", "AI", "教育"],
    lang: "Python",
    links: [
      { label: "查看仓库", url: "https://github.com/ant-cave/poetry-fill-blank" },
    ],
  },
  {
    id: "ddns-controller",
    title: "DDNS Controller",
    description: "基于 Flask 的动态域名解析控制器，提供 Web 管理界面，支持多种 DNS 服务商。",
    tags: ["Python", "Flask", "DDNS"],
    lang: "Python",
    links: [
      { label: "查看仓库", url: "https://github.com/ant-cave/ddns_controller" },
    ],
  },
  {
    id: "eco-wake-sleep-sub",
    title: "Eco Wake Sleep Sub",
    description: "Minecraft 服务器插件（Paper/BungeeCord），监控主服务器状态并通过 Wake-on-LAN 自动唤醒休眠的服务器。",
    tags: ["Java", "Minecraft", "Bukkit"],
    lang: "Java",
    links: [
      { label: "查看仓库", url: "https://github.com/ant-cave/eco_wake_sleep_sub" },
    ],
  },
  {
    id: "time-manager-py",
    title: "Time Manager",
    description: "基于 pywebview 的时间管理桌面应用，支持任务规划、日志记录和 Vue 前端界面。",
    tags: ["Python", "pywebview", "时间管理"],
    lang: "Python",
    links: [
      { label: "查看仓库", url: "https://github.com/ant-cave/timeManagerPy" },
    ],
  },
  {
    id: "api",
    title: "API",
    description: "统一 API 服务入口。",
    tags: ["API", "HTML"],
    lang: "HTML",
    links: [
      { label: "查看仓库", url: "https://github.com/ant-cave/api" },
    ],
  },
];

const activeId = computed(() => route.params.id);
const activeProject = computed(() => projects.find((p) => p.id === activeId.value));
</script>

<template>
  <div class="projects-page">
    <button class="back-home" @click="router.push('/')">← 返回首页</button>

    <div class="projects-layout">
      <aside class="projects-sidebar">
        <div
          v-for="project in projects"
          :key="project.id"
          class="sidebar-item"
          :class="{ active: project.id === activeId }"
          @click="router.push({ name: 'Project', params: { id: project.id } })"
        >
          <div class="sidebar-item-title">{{ project.title }}</div>
          <div class="sidebar-item-meta">
            <span class="lang-tag" v-if="project.lang">{{ project.lang }}</span>
          </div>
        </div>
      </aside>

      <main class="projects-main">
        <div v-if="activeProject" class="project-detail">
          <h1 class="detail-title">{{ activeProject.title }}</h1>
          <p class="detail-description">{{ activeProject.description }}</p>
          <div class="project-tags">
            <span v-for="tag in activeProject.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <div class="detail-links">
            <a
              v-for="(link, index) in activeProject.links"
              :key="index"
              :href="link.url"
              target="_blank"
              class="detail-link-btn"
            >
              {{ link.label }} →
            </a>
          </div>
        </div>
        <div v-else class="project-detail-placeholder">
          <p>请选择项目查看详情</p>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.projects-page {
  position: fixed;
  inset: 0;
  background: var(--dark-bg);
  z-index: 3000;
  display: flex;
  flex-direction: column;
  color: var(--dark-text);
}

.back-home {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all var(--transition-normal);
}

.back-home:hover {
  background: var(--accent-green);
  border-color: var(--accent-green);
}

.projects-layout {
  display: flex;
  flex: 1;
  height: 100vh;
}

.projects-sidebar {
  width: 220px;
  background: var(--dark-card);
  border-right: 1px solid var(--dark-border);
  padding: 1rem;
  overflow-y: auto;
  flex-shrink: 0;
  padding-top: 80px;
}

.sidebar-item {
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 0.35rem;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}

.sidebar-item:hover {
  border-color: var(--dark-border);
  background: rgba(255, 255, 255, 0.03);
}

.sidebar-item.active {
  border-color: var(--accent-green);
  background: rgba(0, 184, 148, 0.1);
}

.sidebar-item-title {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: var(--dark-text);
}

.sidebar-item-meta {
  display: flex;
  gap: 0.3rem;
}

.lang-tag {
  font-size: 0.65rem;
  color: var(--dark-text-secondary);
  background: rgba(255, 255, 255, 0.05);
  padding: 0.1rem 0.4rem;
  border-radius: 8px;
}

.projects-main {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 80px;
}

.project-detail {
  max-width: 700px;
  width: 100%;
}

.detail-title {
  font-size: 2.5rem;
  margin: 0 0 1.5rem 0;
  color: var(--dark-text);
}

.detail-description {
  font-size: 1.15rem;
  line-height: 1.7;
  color: var(--dark-text-secondary);
  margin-bottom: 2rem;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.tag {
  background: rgba(0, 184, 148, 0.15);
  color: var(--accent-green);
  padding: 0.3rem 0.9rem;
  border-radius: 20px;
  font-size: 0.85rem;
  border: 1px solid rgba(0, 184, 148, 0.3);
}

.detail-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.detail-link-btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--accent-green);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: opacity var(--transition-fast);
}

.detail-link-btn:hover {
  opacity: 0.8;
}

.project-detail-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--dark-text-secondary);
  font-size: 1.1rem;
}

@media (max-width: 820px) {
  .projects-page {
    overflow: hidden;
  }

  .projects-layout {
    flex-direction: column;
    padding-top: 50px;
    height: 100vh;
    overflow: hidden;
  }

  .projects-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--dark-border);
    padding: 0.4rem;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 0.3rem;
    flex-shrink: 0;
    padding-top: 0.4rem;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .projects-sidebar::-webkit-scrollbar {
    display: none;
  }

  .sidebar-item {
    flex-shrink: 0;
    white-space: nowrap;
    margin-bottom: 0;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
  }

  .sidebar-item-title {
    font-size: 0.78rem;
  }

  .sidebar-item-meta {
    display: none;
  }

  .projects-main {
    padding: 0.75rem;
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-top: 0.75rem;
  }

  .detail-title {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }

  .detail-description {
    font-size: 0.9rem;
    margin-bottom: 1.2rem;
  }

  .tag {
    font-size: 0.75rem;
    padding: 0.2rem 0.7rem;
  }

  .detail-link-btn {
    padding: 0.55rem 1.2rem;
    font-size: 0.85rem;
  }

  .back-home {
    top: 8px;
    left: 8px;
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
  }
}

@media (max-width: 430px) {
  .projects-sidebar {
    padding: 0.3rem;
    gap: 0.2rem;
  }

  .sidebar-item {
    font-size: 0.7rem;
    padding: 0.2rem 0.4rem;
  }

  .sidebar-item-title {
    font-size: 0.72rem;
  }

  .projects-main {
    padding: 0.6rem;
    padding-top: 0.6rem;
  }

  .detail-title {
    font-size: 1.2rem;
    margin-bottom: 0.75rem;
  }

  .detail-description {
    font-size: 0.85rem;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .tag {
    font-size: 0.7rem;
    padding: 0.15rem 0.55rem;
  }

  .detail-link-btn {
    padding: 0.45rem 1rem;
    font-size: 0.8rem;
  }

  .back-home {
    top: 6px;
    left: 6px;
    font-size: 0.7rem;
    padding: 0.25rem 0.5rem;
  }
}
</style>
