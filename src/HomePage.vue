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
import "@/assets/HomePage.css"
import axios from "axios";
import { onMounted, ref } from "vue";

// 存储背景图片信息的响应式变量
const bgInfo = ref({
    copyright: '',
    copyright_link: ''
});

onMounted(() => {
    getBackgroundImage()
})

// 缓存图片方法
const preloadImage = (src: string): Promise<HTMLImageElement> =>//str: 图片路径
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });


/**
 * 获取必应每日背景图片并设置到页面中
 * 
 * 该函数首先检查本地缓存中是否存在今日的背景图片信息，
 * 如果存在且未过期，则直接使用缓存数据；
 * 否则向必应接口发起请求获取最新背景图，并将结果缓存至 localStorage。
 * 同时更新版权信息和添加图片加载完成后的渐入动画效果。
 */
const getBackgroundImage = () => {
    // 检查是否有缓存的背景图URL和时间戳
    const cachedData = localStorage.getItem('bingBackgroundImage');
    const cachedTime = localStorage.getItem('bingBackgroundImageTime');
    const cachedCopyright = localStorage.getItem('bingBackgroundCopyright');
    const cachedCopyrightLink = localStorage.getItem('bingBackgroundCopyrightLink');

    if (cachedData && cachedTime && cachedCopyright && cachedCopyrightLink) {
        const today = new Date().toDateString(); // 获取今天的日期字符串（忽略时间）
        const cacheDate = new Date(cachedTime).toDateString();

        // 如果缓存日期是今天，使用缓存的URL和信息
        if (today === cacheDate) {
            console.log('使用缓存的背景图');
            const el = document.getElementsByClassName("hero")[0];
            if (el && el instanceof HTMLElement) {
                el.style.backgroundImage = `url(${cachedData})`;
                // 图片已经缓存，添加渐入效果
                setTimeout(() => {
                    el.classList.add('image-loaded');
                }, 100);
            }
            // 设置缓存的图片信息
            bgInfo.value = {
                copyright: cachedCopyright,
                copyright_link: cachedCopyrightLink
            };
            return; // 直接返回，不需要发送请求
        }
    }

    // 如果没有缓存或缓存过期，发送请求
    console.log('请求新的背景图');
    axios({
        method: 'get',
        url: 'https://bing.biturl.top'
    }).then(res => {
        const obj: string = res.data.url;
        const copyright: string = res.data.copyright;
        const copyright_link: string = res.data.copyright_link;
        console.log('图片信息:', { obj, copyright, copyright_link });

        const el = document.getElementsByClassName("hero")[0]; // 设置背景图片
        if (el && el instanceof HTMLElement) {
            el.style.backgroundImage = `url(${obj})`;
            // 图片加载完成后添加渐入效果
            setTimeout(() => {
                el.classList.add('image-loaded');
            }, 100);
        }

        // 缓存URL、版权信息和当前时间
        localStorage.setItem('bingBackgroundImage', obj);
        localStorage.setItem('bingBackgroundImageTime', new Date().toISOString());
        localStorage.setItem('bingBackgroundCopyright', copyright);
        localStorage.setItem('bingBackgroundCopyrightLink', copyright_link);

        // 设置图片信息
        bgInfo.value = {
            copyright: copyright,
            copyright_link: copyright_link
        };
    }).catch(err => {
        console.error('获取背景图片失败:', err);
    })
}


const topage2 = () => {
    // 滚动到page-2元素
    const page2 = document.getElementById('page-2');
    if (page2) {
        page2.scrollIntoView({
            behavior: 'smooth', // 平滑滚动
            block: 'start'      // 对齐到元素顶部
        });
    }
}
</script>

<template>
    <div class="hero basic-page">

        <!-- 右上角信息区域 -->
        <div class="top-right-info">
            <!-- 背景图片信息 -->
            <div class="bg-image-info" v-show="bgInfo.copyright">
                <div class="bg-info-text">
                    <span class="info-label">背景: </span>
                    <span class="info-content">{{ bgInfo.copyright }}</span>
                </div>
                <a :href="bgInfo.copyright_link" class="source-link" target="_blank" title="查看图片来源">
                    原图来源
                </a>
            </div>
            <!-- GitHub图标 -->
            <a href="https://github.com/ant-cave" class="github-link" target="_blank" title="访问GitHub仓库">
                <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
            </a>


        </div>

        <!-- 标题部分-->
        <div class="hero-content">
            <h1 class="hero-title">
                Ant Cave
            </h1>
            <p class="hero-subtitle">
                探索未知 创造可能
            </p>
            <div class="hero-buttons">
                <button @click="topage2()">▼</button>
            </div>
        </div>


    </div>
    <div class="basic-page" id="page-2">
        <h1 style="color: black;">hidden，允许滚动查看hello文本</h1>
    </div>
</template>


<style scoped></style>
