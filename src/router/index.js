import {
  createRouter,
  createWebHistory
} from 'vue-router'
import nProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
  useUserStore
} from '@/stores/user'
import {
  getPageTitle,
  getToken,
  gotoLogin
} from '@/utils'
import {
  filterRoutesByUserPerm
} from '../utils/permission'
import sysRouter from './sysRouter'

const Layout = () => import('@/layout/Layout.vue')
import {
  HomeOutlined,
} from '@ant-design/icons-vue'

const keepAlive = true
const whiteList = true
const isShowMenu = true

const Home = {
  path: '/',
  component: Layout,
  redirect: '/home',
  meta: {
    isShowMenu,
    icon: HomeOutlined,
  },
  children: [{
    path: 'home',
    name: 'Home',
    meta: {
      title: '主页',
      keepAlive,
      isShowMenu
    },
    component: () => import('@/views/Home.vue'),
  }, ],
}
const routes = [
  sysRouter,
]

const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL),
  routes: [
    Home, {
      path: '/login',
      name: 'Login',
      meta: {
        title: '登录',
        whiteList
      },
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/test',
      name: 'Test',
      meta: {
        title: '测试',
        whiteList
      },
      component: () => import('@/views/Test.vue'),
    },
    {
      path: '/404',
      name: 'NotFound',
      meta: {
        title: '404',
        whiteList
      },
      component: () => import('@/views/NotFound.vue'),
    },
    {
      path: '/error',
      name: 'Error',
      meta: {
        title: '500',
        whiteList
      },
      component: () => import('@/views/Error.vue'),
    },
  ]
})

let filterRoutes = []
let isDynamicRouteAdded = false

router.beforeEach(async (to, from, next) => {
  nProgress.start()
  const hasToken = getToken()

  // 白名单页面
  if (to.meta?.whiteList) {
    if (to.name === 'Login' && hasToken) return next('/')
    return next()
  }

  if (!hasToken) return next(`/login?redirect=${to.fullPath}`)

  const userStore = useUserStore()

  if (!isDynamicRouteAdded) {
    try {
      await userStore.getOrFetchUserInfo()
      if (!userStore.response.success) {
        throw new Error('用户信息获取失败')
      }
      filterRoutes = filterRoutesByUserPerm(routes)
      filterRoutes.forEach(route => router.addRoute(route))

      // 兜底路由，只添加一次
      if (!router.hasRoute('not-found')) {
        router.addRoute({
          path: '/:pathMatch(.*)*',
          name: 'not-found',
          redirect: '/404',
        })
      }

      isDynamicRouteAdded = true // ✅ 成功添加路由后再置 true

      // 重新导航到当前页面，确保新路由生效
      return next({
        ...to,
        replace: true
      })
    } catch (err) {
      console.error('加载用户信息失败：', err)
      gotoLogin(true)
      return
    }
  }

  return next()
})

router.afterEach((to) => {
  // finish progress bar
  document.title = getPageTitle(to.meta?.title)
  nProgress.done()
})

if (process.env.NODE_ENV !== 'development') {
  router.onError((err, to) => {
    console.log('router err: ', err)
    const msg = err?.message || ''
    const isModuleLoadError =
      msg.includes('Failed to fetch dynamically imported module') ||
      msg.includes('Loading module') ||
      msg.includes('network error') ||
      msg.includes('Module script failed to load')

    if (isModuleLoadError) {
      console.warn(`📢 动态模块加载失败，刷新跳转到 ${to.fullPath}`)
      window.location.href = to.fullPath
    }
  })
}

// console.log('filterRoutes:', filterRoutes)
export default router
export {
  routes,
  filterRoutes,
  Home as HomeRouter,
}