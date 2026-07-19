<script setup>
import "@/assets/HomePage.css";
import { onMounted } from "vue";
import { useScrollNavigation } from "@/composables/useScrollNavigation";
import { useBingBackground } from "@/composables/useBingBackground";
import HeroSection from "@/sections/HeroSection.vue";
import AboutSection from "@/sections/AboutSection.vue";
import TechStackSection from "@/sections/TechStackSection.vue";
import TimelineSection from "@/sections/TimelineSection.vue";
import ContactSection from "@/sections/ContactSection.vue";
import FooterSection from "@/sections/FooterSection.vue";

const totalPages = 6;
const { currentPage, scrollToPage } = useScrollNavigation(totalPages);
const { bgInfo, getBackgroundImage, getImageUrl } = useBingBackground();

onMounted(() => {
  getBackgroundImage();
});
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

  <HeroSection :bg-info="bgInfo" :get-image-url="getImageUrl" @navigate="scrollToPage" />
  <AboutSection :current-page="1" :total-pages="totalPages" @navigate="scrollToPage" />
  <TechStackSection :current-page="2" :total-pages="totalPages" @navigate="scrollToPage" />
  <TimelineSection :current-page="3" :total-pages="totalPages" @navigate="scrollToPage" />
  <ContactSection :current-page="4" :total-pages="totalPages" @navigate="scrollToPage" />
  <FooterSection :current-page="5" :total-pages="totalPages" @navigate="scrollToPage" />
</template>
