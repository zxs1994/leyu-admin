import {
  ref,
  computed,
} from 'vue'
import {
  defineStore
} from 'pinia'
import {
  todoListApi
} from '@/api'

export const useTodoListStore = defineStore('todoList', () => {
  const list = ref([])
  const currentPage = ref(1)
  const pageSize = ref(20)
  const total = ref(0)
  const badge = computed(() => list.value.some(i => i.status === 0))
  const hasMore = computed(() => currentPage.value < Math.ceil(total.value / pageSize.value))
  const loading = ref(false)
  const updateLoading = ref(false)

  async function setList(page = currentPage.value, size = pageSize.value, push = true) {
    loading.value = true
    const res = await todoListApi.page({
      currentPage: page,
      pageSize: size,
    })
    // console.log(res)
    if (res && res.success) {
      if (push) {
        list.value.push(...res.data.dataList)
      } else {
        list.value = res.data.dataList
      }

      total.value = res.data.total
    }
    loading.value = false
    return list.value
  }
  async function reloadList() {
    return await setList(1, currentPage.value * pageSize.value, false)
  }

  async function updateStatus(id) {
    updateLoading.value = true
    await todoListApi.updateStatus({
      id,
    })
    await reloadList()
    updateLoading.value = false
  }

  function changePage(page = currentPage.value + 1) {
    currentPage.value = page
    return setList()
  }

  return {
    list,
    total,
    pageSize,
    currentPage,
    loading,
    hasMore,
    setList,
    reloadList,
    badge,
    updateStatus,
    changePage,
    updateLoading,
  }
})