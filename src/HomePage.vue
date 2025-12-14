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
    import { onMounted } from "vue";
    
    onMounted(() => {
        getBackgroundImage()
    })
    
    const getBackgroundImage = () => {
        // 检查是否有缓存的背景图URL和时间戳
        const cachedData = localStorage.getItem('bingBackgroundImage');
        const cachedTime = localStorage.getItem('bingBackgroundImageTime');
        
        if (cachedData && cachedTime) {
            const today = new Date().toDateString(); // 获取今天的日期字符串（忽略时间）
            const cacheDate = new Date(cachedTime).toDateString();
            
            // 如果缓存日期是今天，使用缓存的URL
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
            console.log(obj);

            const el = document.getElementsByClassName("hero")[0]; // 设置背景图片
            if (el && el instanceof HTMLElement) {
                el.style.backgroundImage = `url(${obj})`;
                // 图片加载完成后添加渐入效果
                setTimeout(() => {
                    el.classList.add('image-loaded');
                }, 100);
            }
            
            // 缓存URL和当前时间
            localStorage.setItem('bingBackgroundImage', obj);
            localStorage.setItem('bingBackgroundImageTime', new Date().toISOString());
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
        <div class="hero-content">
            <h1 class="hero-title">
                Ant Cave
            </h1>
            <p class="hero-subtitle">
                探索未知，创造可能
            </p>
            <div class="hero-buttons">
                <button @click="topage2()">press me</button>
            </div>
        </div>
    </div>
    <div class="basic-page" id="page-2">
        <h1 style="color: black;">hidden，允许滚动查看hello文本</h1>
    </div>
</template>


<style scoped></style>
