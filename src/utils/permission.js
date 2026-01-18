import {
  useUserStore
} from "@/stores/user"

const getUserPermissions = () => {
  const userStore = useUserStore()
  return userStore.userInfo.permissionCodes || []
}

export const checkPermission = (required) => {
  const perms = getUserPermissions()
  if (!required) return true // 没有权限要求直接通过

  if (typeof required === 'string') return perms.includes(required)
  if (Array.isArray(required)) return required.some(p => perms.includes(p))

  return false
}

function hasPermission(route) {
  return !route.meta?.perm || checkPermission(route.meta.perm)
}

export function filterRoutesByUserPerm(routes) {
  return routes
    .map((route) => {
      const routeCopy = {
        ...route
      } // 浅拷贝一份，避免修改原数据

      // 递归过滤子路由
      if (route.children) {
        routeCopy.children = filterRoutesByUserPerm(route.children)
      }

      const hasChild = routeCopy.children && routeCopy.children.length > 0
      const hasOwnPerm = hasPermission(routeCopy)

      // 当前路由自己有权限或者子路由有权限才保留
      if (hasOwnPerm || hasChild) {
        return routeCopy
      }

      return null
    })
    .filter(Boolean)
}