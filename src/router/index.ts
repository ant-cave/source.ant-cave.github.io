import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../HomePage.vue'

// 创建路由实例
const router = createRouter({
  // 使用HTML5 history模式
  history: createWebHistory(import.meta.env.BASE_URL),
  // 定义路由
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage
    }
  ]
})

export default router
