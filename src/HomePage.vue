<!--
  index.html — Main entry point
  Copyright (C) 2025 ANTmmmmm <ANTmmmmm@outlook.com>

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->

<script setup>
import "@/assets/HomePage.css";
import PageNavButtons from "@/components/PageNavButtons.vue";
import axios from "axios";
import { onMounted, ref, onUnmounted } from "vue";

const currentPage = ref(0);
const isScrolling = ref(false);
const totalPages = 6;

const bgInfo = ref({
    copyright: "",
    copyright_link: "",
});

let touchStartY = 0;

onMounted(() => {
    getBackgroundImage();
    initScrollSnap();
});

onUnmounted(() => {
    removeScrollListeners();
});

const initScrollSnap = () => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
};

const removeScrollListeners = () => {
    window.removeEventListener('wheel', handleWheel);
    window.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('touchend', handleTouchEnd);
};

let wheelAccumulate = 0;
const WHEEL_THRESHOLD = 120;

const handleWheel = (e) => {
    e.preventDefault();
    if (isScrolling.value) {
        wheelAccumulate = 0;
        return;
    }

    wheelAccumulate += e.deltaY;

    if (wheelAccumulate > WHEEL_THRESHOLD && currentPage.value < totalPages - 1) {
        wheelAccumulate = 0;
        scrollToPage(currentPage.value + 1);
    } else if (wheelAccumulate < -WHEEL_THRESHOLD && currentPage.value > 0) {
        wheelAccumulate = 0;
        scrollToPage(currentPage.value - 1);
    }

    clearTimeout(window.wheelTimer);
    window.wheelTimer = setTimeout(() => {
        wheelAccumulate = 0;
    }, 300);
};

const handleKeydown = (e) => {
    if (isScrolling.value) return;

    if ((e.key === 'ArrowDown' || e.key === 'PageDown') && currentPage.value < totalPages - 1) {
        e.preventDefault();
        scrollToPage(currentPage.value + 1);
    } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && currentPage.value > 0) {
        e.preventDefault();
        scrollToPage(currentPage.value - 1);
    }
};

const handleTouchStart = (e) => {
    touchStartY = e.touches[0].clientY;
};

const handleTouchEnd = (e) => {
    if (isScrolling.value) return;

    const touchEndY = e.changedTouches[0].clientY;
    const delta = touchStartY - touchEndY;
    const TOUCH_THRESHOLD = 80;

    if (delta > TOUCH_THRESHOLD && currentPage.value < totalPages - 1) {
        scrollToPage(currentPage.value + 1);
    } else if (delta < -TOUCH_THRESHOLD && currentPage.value > 0) {
        scrollToPage(currentPage.value - 1);
    }
};

const scrollToPage = (pageIndex) => {
    if (pageIndex < 0 || pageIndex >= totalPages) return;

    isScrolling.value = true;
    currentPage.value = pageIndex;

    const targetPage = document.getElementById(`page-${pageIndex}`);
    if (targetPage) {
        targetPage.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }

    setTimeout(() => {
        isScrolling.value = false;
    }, 800);
};

const preloadImage = (src) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = src;
    });

const getBackgroundImage = async () => {
    const cachedData = localStorage.getItem("bingBackgroundImage");
    const cachedTime = localStorage.getItem("bingBackgroundImageTime");
    const cachedCopyright = localStorage.getItem("bingBackgroundCopyright");
    const cachedCopyrightLink = localStorage.getItem(
        "bingBackgroundCopyrightLink"
    );

    if (cachedData && cachedTime && cachedCopyright && cachedCopyrightLink) {
        const today = new Date().toDateString();
        const cacheDate = new Date(cachedTime).toDateString();
        if (today === cacheDate) {
            await preloadImage(cachedData);
            const el = document.querySelector(".background-image");
            const frontEl = document.querySelector(".background-image-front");
            if (el) {
                el.style.backgroundImage = `url(${cachedData})`;
                el.classList.add("image-loaded");
                if (frontEl) {
                    frontEl.classList.add("fade-out");
                }
            }
            bgInfo.value = {
                copyright: cachedCopyright,
                copyright_link: cachedCopyrightLink,
            };
            return;
        }
    }

    try {
        const res = await axios.get("https://bing.biturl.top");
        const { url, copyright, copyright_link } = res.data;

        await preloadImage(url);
        const el = document.querySelector(".background-image");
        const frontEl = document.querySelector(".background-image-front");
        if (el) {
            el.style.backgroundImage = `url(${url})`;
            el.classList.add("image-loaded");
            if (frontEl) {
                frontEl.classList.add("fade-out");
            }
        }

        localStorage.setItem("bingBackgroundImage", url);
        localStorage.setItem("bingBackgroundImageTime", new Date().toISOString());
        localStorage.setItem("bingBackgroundCopyright", copyright);
        localStorage.setItem("bingBackgroundCopyrightLink", copyright_link);
        bgInfo.value = { copyright, copyright_link };
    } catch (err) {
        console.error("背景图加载失败", err);
    }
};

const getImageUrl = () => {
    const el = document.querySelector(".background-image");
    if (el) {
        const bgImage = getComputedStyle(el).backgroundImage;
        if (bgImage) {
            const urlMatch = bgImage.match(/url("?(.+?)"?)/);
            if (urlMatch && urlMatch[1]) {
                return urlMatch[1];
            }
        }
    }
};
</script>

<template>
    <div class="background-image"></div>
    <div class="background-image-front"></div>
    <div
        class="background-overlay"
        :class="{
            'overlay-transparent': currentPage === 0,
            'overlay-light': currentPage === 1,
            'overlay-dark': currentPage >= 2
        }"
    ></div>

    <div class="page-indicator">
        <div
            v-for="i in totalPages"
            :key="i"
            class="dot"
            :class="{ active: currentPage === i - 1 }"
            @click="scrollToPage(i - 1)"
        ></div>
    </div>

    <div class="hero basic-page" id="page-0">
        <div class="top-right-info">
            <div class="bg-image-info" v-show="bgInfo.copyright">
                <div class="bg-info-text">
                    <span class="info-label">背景<br /></span>
                    <span class="info-content">{{ bgInfo.copyright }}</span>
                </div>
                <a :href="bgInfo.copyright_link" class="source-link" target="_blank">原图来源</a>
                <a :href="getImageUrl()" class="source-link" target="_blank">原图链接</a>
            </div>
        </div>

        <div class="top-links">
            <a href="/blog" class="blog-link" target="_blank" title="我的博客">
                <svg class="blog-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
            </a>
            <a href="https://github.com/ant-cave" class="github-link" target="_blank" title="GitHub: ant-cave（主号）">
                <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
            </a>
        </div>

        <div class="hero-content">
            <h1 class="hero-title">Ant Cave</h1>
            <p class="hero-subtitle">探索未知 创造可能</p>
            <div class="hero-buttons">
                <button @click="scrollToPage(1)">▼</button>
            </div>
        </div>
    </div>

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
            @navigate="scrollToPage"
        />
    </div>

    <div class="basic-page tech-page" id="page-2">
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
            :current-page="2"
            :total-pages="totalPages"
            theme="dark"
            @navigate="scrollToPage"
        />
    </div>

    <div class="basic-page tech-page" id="page-3">
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
            :current-page="3"
            :total-pages="totalPages"
            theme="dark"
            @navigate="scrollToPage"
        />
    </div>

    <div class="basic-page tech-page" id="page-4">
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
            :current-page="4"
            :total-pages="totalPages"
            theme="dark"
            @navigate="scrollToPage"
        />
    </div>

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
            @navigate="scrollToPage"
        />
    </div>
</template>

<style scoped></style>