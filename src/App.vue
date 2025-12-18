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
  import "@/assets/colors.css"
  import "@/assets/privateColors.css"
</script>

<template>
  <!-- 路由视图容器 -->
  <router-view id="full"></router-view>
  <span id="end">
    router-view end
  </span>
</template>

<style scoped>
  :global(body),
  :global(html) {
      margin: 0;
      padding: 0;
      /* 移除overflow: hidden，允许滚动查看hello文本 */
  }
  .full{
    height: 100px;
    width: 100px;
  }
  #end{
    background-color: white;
  }
</style>
