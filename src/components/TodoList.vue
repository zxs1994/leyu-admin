<script setup>
import { ref, onMounted, watch } from 'vue'
import { useTodoListStore } from '@/stores/todoList'
import { useRouter } from 'vue-router'
const router = useRouter()
const todoListStore = useTodoListStore()
const visible = ref(false)
const sentinel = ref()
const itemClick = (i) => {
  let name = ''
  switch (i.type) {
    case 0:
    case 2:
    case 4:
      name = 'DemandDetail'
      break
    case 1:
      name = 'TaskDetail'
      break
    case 3:
      name = 'DefectDetail'
      break
  }
  router.push({
    name,
    params: {
      projectId: i.projectId,
      id: i.contentId,
    },
  })
  if (i.status === 0) {
    todoListStore.updateStatus(i.id)
  }
  setTimeout(() => {
    visible.value = false
  }, 500)
}

const markAsRead = async (i) => {
  todoListStore.updateStatus(i.id)
}

defineExpose({
  visible,
})

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      todoListStore.changePage()
    }
  })

  watch(
    () => sentinel.value,
    (el, _, onCleanup) => {
      if (el) {
        observer.observe(el)
        onCleanup(() => observer.unobserve(el))
      }
    },
    { immediate: true },
  )
})
</script>
<template>
  <a-drawer v-model:open="visible" title="代办事项" width="500" placement="right">
    <div
      v-for="i in todoListStore.list"
      :key="i.id"
      class="cursor-pointer transition transform hover:shadow-sm active:bg-gray-100 p-2 rounded flex justify-between items-center"
      @click="itemClick(i)"
    >
      <!-- 左侧内容区域 -->
      <div>
        <a-badge :status="i.status ? 'default' : 'error'" />
        <a-typography-text type="secondary">{{ i.title }}</a-typography-text>
        <div>
          <a-typography-text strong>{{ i.content }}</a-typography-text>
        </div>
      </div>

      <!-- 右侧按钮 -->
      <a-button
        class="shrink-0"
        size="small"
        type="link"
        @click.stop="markAsRead(i)"
        v-if="i.status === 0"
        :loading="todoListStore.updateLoading"
      >
        已读
      </a-button>
    </div>
    <div class="flex justify-center items-center" v-if="todoListStore.hasMore">
      <div v-if="todoListStore.loading">加载中...</div>
      <div v-else ref="sentinel">
        <a-button
          type="link"
          @click="todoListStore.changePage()"
          :disabled="todoListStore.loading"
          >{{ todoListStore.loading ? '' : '加载更多' }}</a-button
        >
      </div>
    </div>
  </a-drawer>
</template>
