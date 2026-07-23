import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../HomePage.vue'
import ProjectsPage from '../views/ProjectsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage,
    },
    {
      path: '/projects',
      name: 'Projects',
      component: ProjectsPage,
    },
    {
      path: '/project/:id',
      name: 'Project',
      component: ProjectsPage,
    },
    {
      path: '/fursee',
      redirect: '/fursee/auto',
    },
    {
      path: '/fursee/auto',
      name: 'FurseeAuto',
      component: () => import('../views/fursee/Auto.vue'),
    },
  ],
})

const originalPush = router.push
router.push = function push(location) {
  return originalPush.call(this, location).catch((err) => {
    if (err.type !== 10) throw err
  })
}

if (window.location.pathname.startsWith('/blog')) {
  window.location.reload()
}

export default router
