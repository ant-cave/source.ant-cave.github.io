<script setup>
import { useRouter } from "vue-router";
import PageNavButtons from "@/components/PageNavButtons.vue";

defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
});

const emit = defineEmits(["navigate"]);
const router = useRouter();

const projects = [
  {
    id: "blog",
    title: "个人博客",
    tags: ["Jekyll", "Ruby"],
    links: [
      { label: "查看详情", url: "/blog" },
      { label: "查看仓库", url: "https://github.com/ant-cave/blog/" },
    ],
  },
  {
    id: "deep-student",
    title: "Deep Student",
    tags: ["TypeScript", "Rust", "Tauri"],
    links: [
      { label: "查看仓库", url: "https://github.com/HelixNow/deep-student" },
    ],
  },
  {
    id: "open-tauri-remote-webview",
    title: "Open Tauri Remote WebView",
    tags: ["Rust", "Tauri", "WebView"],
    links: [
      { label: "查看仓库", url: "https://github.com/ant-cave/open-tauri-remote-webview" },
    ],
  },
  {
    id: "llm-format-bridge",
    title: "LLM Format Bridge",
    tags: ["JavaScript", "LLM"],
    links: [
      { label: "查看仓库", url: "https://github.com/ant-cave/llm_format_bridge" },
    ],
  },
  {
    id: "tencent-comic-downloader",
    title: "腾讯漫画下载工具",
    tags: ["Python", "多线程"],
    links: [
      { label: "查看仓库", url: "https://github.com/ant-cave/tencentComicDownloadTool" },
    ],
  },
  {
    id: "frp-controller",
    title: "FRP Controller",
    tags: ["Python", "frp", "内网穿透"],
    links: [
      { label: "查看仓库", url: "https://github.com/ant-cave/frp-controller" },
    ],
  },
  {
    id: "totp-manager",
    title: "TOTP 密码管理器",
    tags: ["Python", "PySide6", "加密"],
    links: [
      { label: "查看仓库", url: "https://github.com/ant-cave/py-totp-new" },
    ],
  },
];

function goToProject(project) {
  router.push({ name: "Project", params: { id: project.id } });
}

function goToProjects() {
  router.push({ name: "Projects" });
}
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
      <div class="compact-grid">
        <div
          v-for="project in projects"
          :key="project.id"
          class="compact-card"
          @click="goToProject(project)"
        >
          <h3 class="compact-card-title">{{ project.title }}</h3>
          <div class="compact-card-tags">
            <span v-for="tag in project.tags" :key="tag" class="compact-tag">{{ tag }}</span>
          </div>
        </div>
      </div>
      <button class="more-btn" @click="goToProjects">更多项目 →</button>
    </div>

    <PageNavButtons
      :current-page="1"
      :total-pages="totalPages"
      theme="light"
      @navigate="emit('navigate', $event)"
    />
  </div>
</template>

<style scoped>
.compact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
}

.compact-card {
  background: var(--light-card);
  border: 1px solid var(--light-border);
  border-radius: 10px;
  padding: 0.85rem 1rem;
  cursor: pointer;
  transition: all var(--transition-normal);
  text-align: left;
}

.compact-card:hover {
  border-color: var(--accent-green);
  box-shadow: var(--shadow-hover);
  transform: translateY(-1px);
}

.compact-card-title {
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
  color: var(--light-text);
  font-weight: 600;
}

.compact-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.compact-tag {
  background: #f0f4f8;
  color: var(--primary-gray);
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  border: 1px solid var(--light-border);
}

.more-btn {
  margin-top: 1.2rem;
  background: transparent;
  border: 2px solid var(--accent-green);
  color: var(--accent-green);
  padding: 0.5rem 1.5rem;
  font-size: 0.9rem;
  border-radius: 24px;
  cursor: pointer;
  font-weight: 500;
  transition: all var(--transition-normal);
}

.more-btn:hover {
  background: var(--accent-green);
  color: white;
}

@media (max-width: 820px) {
  .compact-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .compact-card {
    padding: 0.6rem 0.75rem;
  }

  .compact-card-title {
    font-size: 0.85rem;
    margin-bottom: 0.35rem;
  }

  .compact-tag {
    font-size: 0.6rem;
    padding: 0.1rem 0.4rem;
  }

  .more-btn {
    margin-top: 0.8rem;
    padding: 0.4rem 1.2rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 430px) {
  .compact-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.35rem;
    margin-top: 0.35rem;
  }

  .compact-card {
    padding: 0.45rem 0.55rem;
    border-radius: 8px;
  }

  .compact-card-title {
    font-size: 0.75rem;
    margin-bottom: 0.25rem;
  }

  .compact-tag {
    font-size: 0.55rem;
    padding: 0.05rem 0.35rem;
  }

  .more-btn {
    margin-top: 0.5rem;
    padding: 0.3rem 1rem;
    font-size: 0.75rem;
  }
}
</style>
