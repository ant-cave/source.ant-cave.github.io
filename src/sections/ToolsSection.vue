<script setup>
import PageNavButtons from "@/components/PageNavButtons.vue";
import { useRouter } from "vue-router";

defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
});

const emit = defineEmits(["navigate"]);
const router = useRouter();

const tools = [
  { id: "fursee", title: "Fursee", desc: "毛装角色一键分类", icon: "ri-search-eye-line", link: "/fursee" },
  { id: "placeholder-2", title: "工具 2", desc: "开发中……", icon: "ri-tools-line" },
  { id: "placeholder-3", title: "工具 3", desc: "开发中……", icon: "ri-tools-line" },
];

function goTo(tool) {
  if (tool.link) router.push(tool.link);
}
</script>

<template>
  <div class="basic-page tech-page" id="page-2">
    <div class="container">
      <h1 class="page-title tech-title">在线小工具</h1>
      <div class="tools-grid">
        <div
          v-for="tool in tools"
          :key="tool.id"
          class="tools-card"
          :class="{ 'tools-card-link': tool.link }"
          @click="goTo(tool)"
        >
          <i :class="['tool-icon', tool.icon]"></i>
          <h3>{{ tool.title }}</h3>
          <p>{{ tool.desc }}</p>
        </div>
      </div>
    </div>

    <PageNavButtons
      :current-page="2"
      :total-pages="totalPages"
      theme="dark"
      @navigate="emit('navigate', $event)"
    />
  </div>
</template>

<style scoped>
.tools-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.tools-card {
  background: var(--dark-card);
  border: 1px solid var(--dark-border);
  border-radius: 12px;
  padding: 2rem 1.5rem;
  text-align: center;
  transition: all var(--transition-normal);
}

.tools-card-link {
  cursor: pointer;
}

.tools-card-link:hover {
  border-color: var(--accent-green);
  box-shadow: 0 0 20px var(--tech-glow);
  transform: translateY(-2px);
}

.tool-icon {
  font-size: 2.5rem;
  color: var(--accent-green);
  margin-bottom: 1rem;
  display: block;
}

.tools-card h3 {
  color: var(--dark-text);
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.tools-card p {
  color: var(--dark-text-secondary);
  margin: 0;
  font-size: 0.85rem;
}

@media (max-width: 820px) {
  .tools-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .tools-card {
    padding: 1rem 0.75rem;
  }

  .tool-icon {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
  }

  .tools-card h3 {
    font-size: 0.9rem;
  }

  .tools-card p {
    font-size: 0.75rem;
  }
}

@media (max-width: 430px) {
  .tools-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.4rem;
    margin-top: 0.5rem;
  }

  .tools-card {
    padding: 0.6rem 0.4rem;
    border-radius: 8px;
  }

  .tool-icon {
    font-size: 1.4rem;
    margin-bottom: 0.3rem;
  }

  .tools-card h3 {
    font-size: 0.75rem;
  }

  .tools-card p {
    font-size: 0.65rem;
  }
}
</style>
