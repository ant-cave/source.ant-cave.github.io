import { ref } from "vue";
import axios from "axios";

export function useBingBackground() {
  const bgInfo = ref({ copyright: "", copyright_link: "" });

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
    const cachedCopyrightLink = localStorage.getItem("bingBackgroundCopyrightLink");

    if (cachedData && cachedTime && cachedCopyright && cachedCopyrightLink) {
      const today = new Date().toDateString();
      const cacheDate = new Date(cachedTime).toDateString();
      if (today === cacheDate) {
        await preloadImage(cachedData);
        applyBackground(cachedData);
        bgInfo.value = { copyright: cachedCopyright, copyright_link: cachedCopyrightLink };
        return;
      }
    }

    try {
      const res = await axios.get("https://bing.biturl.top");
      const { url, copyright, copyright_link } = res.data;
      await preloadImage(url);
      applyBackground(url);
      localStorage.setItem("bingBackgroundImage", url);
      localStorage.setItem("bingBackgroundImageTime", new Date().toISOString());
      localStorage.setItem("bingBackgroundCopyright", copyright);
      localStorage.setItem("bingBackgroundCopyrightLink", copyright_link);
      bgInfo.value = { copyright, copyright_link };
    } catch (err) {
      console.error("背景图加载失败", err);
    }
  };

  const applyBackground = (url) => {
    const el = document.querySelector(".background-image");
    const frontEl = document.querySelector(".background-image-front");
    if (el) {
      el.style.backgroundImage = `url(${url})`;
      el.classList.add("image-loaded");
      if (frontEl) {
        frontEl.classList.add("fade-out");
      }
    }
  };

  const getImageUrl = () => {
    const el = document.querySelector(".background-image");
    if (el) {
      const bgImage = getComputedStyle(el).backgroundImage;
      if (bgImage) {
        const urlMatch = bgImage.match(/url\("?(.+?)"?\)/);
        if (urlMatch && urlMatch[1]) {
          return urlMatch[1];
        }
      }
    }
  };

  return { bgInfo, getBackgroundImage, getImageUrl };
}
