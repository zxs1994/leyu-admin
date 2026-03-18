import {
  reactive,
  nextTick
} from 'vue'
import {
  useRoute,
  useRouter
} from 'vue-router'

export default function useCrudList({
  api,
  otherQuery = {},
  firstGet = true,
  pageSize = 12,
  scroller = '.layout-content',
}) {
  const route = useRoute()
  const router = useRouter()
  const page = route.query.page ? parseInt(route.query.page) || 1 : 1
  const size = route.query.size ? parseInt(route.query.size) || pageSize : pageSize
  const state = reactive({
    loading: false,
    dataSource: [],
    query: {
      ...route.query,
      ...otherQuery,
    },
    pagination: {
      current: page,
      pageSize: size,
      total: 0,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      showTotal: (total) => `共 ${total} 条数据`,
    },
  })

  const syncQueryToUrl = () => {
    const {
      current,
      pageSize
    } = state.pagination
    const filteredQuery = Object.fromEntries(Object.entries(state.query).filter(([, value]) => value !== undefined))
    const params = new URLSearchParams({
      ...filteredQuery,
      page: current.toString(),
      size: pageSize.toString(),
    }).toString()

    // console.log(params)

    const newUrl = `${window.location.pathname}?${params}`
    window.history.replaceState({}, '', newUrl) // ✅ 只替换 URL，不刷新页面
  }

  const scrollToTop = () => {
    nextTick(() => {
      if (scroller) {
        ;
        (document.querySelector(scroller) || {}).scrollTop = 0
      }
    })
  }

  const handleTableChange = (pag) => {
    state.pagination.current = pag.current
    state.pagination.pageSize = pag.pageSize
    getList()
  }

  const getList = async (page) => {
    // 重置页码
    if (typeof page == 'number') {
      state.pagination.current = 1
    }

    // 更新 URL
    syncQueryToUrl()

    state.loading = true
    const res = await api.page({
      ...state.query,
      page: state.pagination.current,
      size: state.pagination.pageSize,
    })

    state.dataSource = res.data?.records || []
    state.pagination.total = res.data?.total || 0
    state.loading = false

    // 请求完成后滚动到顶部
    scrollToTop()
  }
  const search = () => {
    getList(1)
  }
  const resetQuery = () => {
    state.query = {
      ...otherQuery,
    }
    search()
  }

  const reload = () => getList()

  firstGet && getList()

  const getIndex = (index) => {
    const pagination = state.pagination
    return (pagination.current - 1) * pagination.pageSize + index + 1
  }

  return {
    state,
    handleTableChange,
    getList,
    resetQuery,
    reload,
    search,
    router,
    route,
    getIndex,
  }
}