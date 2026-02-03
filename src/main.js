import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "@/assets/root.css"
const app = createApp(App)

app.use(router)

app.mount('#app')
