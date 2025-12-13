
<script setup lang="ts">
    import "@/assets/HomePage.css"
    import axios from "axios";
    import { onMounted } from "vue";
    
    onMounted(() => {
        getBackgroundImage()
    })
    
    const getBackgroundImage = () => {
        // 檢查是否有緩存的背景圖URL和時間戳
        const cachedData = localStorage.getItem('bingBackgroundImage');
        const cachedTime = localStorage.getItem('bingBackgroundImageTime');
        
        if (cachedData && cachedTime) {
            const today = new Date().toDateString(); // 獲取今天的日期字符串（忽略時間）
            const cacheDate = new Date(cachedTime).toDateString();
            
            // 如果緩存日期是今天，使用緩存的URL
            if (today === cacheDate) {
                console.log('使用緩存的背景圖');
                const el = document.getElementsByClassName("hero")[0];
                if (el && el instanceof HTMLElement) {
                    el.style.backgroundImage = `url(${cachedData})`;
                }
                return; // 直接返回，不需要發送請求
            }
        }
        
        // 如果沒有緩存或緩存過期，發送請求
        console.log('請求新的背景圖');
        axios({
            method: 'get',
            url: 'https://bing.biturl.top'
        }).then(res => {
            const obj: string = res.data.url;
            console.log(obj);

            const el = document.getElementsByClassName("hero")[0];//設置背景圖片
            if (el && el instanceof HTMLElement) {
                el.style.backgroundImage = `url(${obj})`;
            }
            
            // 緩存URL和當前時間
            localStorage.setItem('bingBackgroundImage', obj);
            localStorage.setItem('bingBackgroundImageTime', new Date().toISOString());
        })
    }


    const topage2 = () => {
        // 滾動到page-2元素
        const page2 = document.getElementById('page-2');
        if (page2) {
            page2.scrollIntoView({ 
                behavior: 'smooth', // 平滑滾動
                block: 'start'      // 對齊到元素頂部
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
