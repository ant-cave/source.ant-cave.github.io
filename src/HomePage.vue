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

<script setup lang="ts">
import "@/assets/HomePage.css";
import axios from "axios";
import { onMounted, ref } from "vue";

// 存储背景图片信息的响应式变量
const bgInfo = ref({
    copyright: "",
    copyright_link: "",
});

onMounted(() => {
    getBackgroundImage();
});
// 预加载图片 → 确保 background-image 设置时图片已进内存缓存（避免白屏闪动）
const preloadImage = (src: string): Promise<void> =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(); // 图片下载+解码完成 → 可安全用于 CSS
        img.onerror = reject;
        img.src = src; // 触发加载（若已缓存，onload 瞬间触发）
    });

// 异步获取背景图：优先用今日缓存，否则请求新图 + 预加载后生效
const getBackgroundImage = async () => {
    // 从 localStorage 读取缓存数据（含 URL/时间/版权信息）
    const cachedData = localStorage.getItem("bingBackgroundImage");
    const cachedTime = localStorage.getItem("bingBackgroundImageTime");
    const cachedCopyright = localStorage.getItem("bingBackgroundCopyright");
    const cachedCopyrightLink = localStorage.getItem(
        "bingBackgroundCopyrightLink"
    );

    // 检查缓存是否为今日（忽略时分秒）
    if (cachedData && cachedTime && cachedCopyright && cachedCopyrightLink) {
        const today = new Date().toDateString();
        const cacheDate = new Date(cachedTime).toDateString();
        if (today === cacheDate) {
            console.log("使用今日缓存背景图");
            await preloadImage(cachedData); // 必须等图加载完再设背景
            const el = document.querySelector<HTMLElement>(".background-image");
            const frontEl = document.querySelector<HTMLElement>(
                ".background-image-front"
            );
            if (el) {
                el.style.backgroundImage = `url(${cachedData})`;
                el.classList.add("image-loaded");
                // 添加这一行来触发front元素的透明度过渡
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

    // 缓存失效 → 请求新图
    try {
        console.log("请求新背景图");
        const res = await axios.get("https://bing.biturl.top");
        const { url, copyright, copyright_link } = res.data;

        await preloadImage(url); //同上：保证图加载完成
        const el = document.querySelector<HTMLElement>(".background-image");
        const frontEl = document.querySelector<HTMLElement>(
            ".background-image-front"
        );
        if (el) {
            el.style.backgroundImage = `url(${url})`;
            el.classList.add("image-loaded");
            if (frontEl) {
                frontEl.classList.add("fade-out");
            }
        }

        // 更新缓存（ISO 时间用于精确过期判断）
        localStorage.setItem("bingBackgroundImage", url);
        localStorage.setItem(
            "bingBackgroundImageTime",
            new Date().toISOString()
        );
        localStorage.setItem("bingBackgroundCopyright", copyright);
        localStorage.setItem("bingBackgroundCopyrightLink", copyright_link);
        bgInfo.value = { copyright, copyright_link };
    } catch (err) {
        console.error("背景图加载失败", err);
    }
};
const topage2 = () => {
    // 滚动到page-2元素
    const page2 = document.getElementById("page-2");
    if (page2) {
        page2.scrollIntoView({
            behavior: "smooth", // 平滑滚动
            block: "start", // 对齐到元素顶部
        });
    }
};

const getImageUrl = () => {
    const el = document.querySelector<HTMLElement>(".background-image"); //获取元素
    if (el) {
        const bgImage: string = getComputedStyle(el).backgroundImage;
        if (bgImage) {
            const urlMatch = bgImage.match(/url\("?(.+?)"?\)/);
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
    <div class="hero basic-page">
        <!-- 右上角信息区域 -->
        <div class="top-right-info">
            <!-- 背景图片信息 -->
            <div class="bg-image-info" v-show="bgInfo.copyright">
                <div class="bg-info-text">
                    <span class="info-label">背景<br /></span>
                    <span class="info-content">{{ bgInfo.copyright }}</span>
                </div>
                <a
                    :href="bgInfo.copyright_link"
                    class="source-link"
                    target="_blank"
                    title="查看图片来源"
                >
                    原图来源
                </a>
                <a
                    :href="getImageUrl()"
                    class="source-link"
                    target="_blank"
                    title="查看图片来源"
                >
                    原图链接
                </a>
            </div>
            <!-- GitHub图标 -->
            <a
                href="https://github.com/ant-cave"
                class="github-link"
                target="_blank"
                title="访问GitHub仓库"
            >
                <svg
                    class="github-icon"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path
                        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                    />
                </svg>
            </a>
        </div>

        <!-- 标题部分-->

        <div class="hero-content">
            <h1 class="hero-title">Ant Cave</h1>
            <p class="hero-subtitle">探索未知 创造可能</p>
            <div class="hero-buttons">
                <button @click="topage2()">▼</button>
            </div>
            <div class="shadow"></div>
        </div>
    </div>
    <div class="basic-page para-page" id="page-2">
        <div class="header">
            <div class="container">
                <h1>这是什么</h1>
                <div class="box mainPara">
                    <div class="para">
                        <h2>ant-cave的个人主页</h2>
                        <p>
                            这是一个个人主页，在这里你可以找到一些关于我的信息，
                            比如我的个人简介，我的技能，我的项目等等。
                        </p>
                    </div>
                </div>
            </div>
            <div class="hr"></div>

            <div class="container">
                <h1>我的项目</h1>
                <div class="box mainPara">
                    <div class="para"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
