import {
  useSysSetingStore
} from '@/stores/sysSeting'

export const initAntStyle = (pinia) => {
  const sysSetingStore = useSysSetingStore(pinia)

  // 初始化：根据系统偏好
  const mql = window.matchMedia('(prefers-color-scheme: dark)')
  sysSetingStore.updateAlgorithm(mql.matches)

  // 监听系统偏好变化
  mql.addEventListener('change', (e) => {
    sysSetingStore.updateAlgorithm(e.matches)
  })
}