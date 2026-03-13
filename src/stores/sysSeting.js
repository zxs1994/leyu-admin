import {
  ref
} from 'vue'
import {
  playFlapEffect
} from '@/utils/flapEffect'
import {
  defineStore
} from 'pinia'
import {
  theme
} from 'ant-design-vue'

const {
  defaultAlgorithm,
  darkAlgorithm,
  defaultSeed
} = theme

const applyAntdTokenVars = (isDark, token) => {
  const colorKeys = [
    'colorBgLayout',
    'colorBgContainer',
    'colorBgElevated',
    'colorBgSpotlight',

    'colorText',
    'colorTextSecondary',
    'colorTextTertiary',
    'colorTextQuaternary',

    'colorBorder',
    'colorBorderSecondary',

    'colorPrimary',
    'colorSuccess',
    'colorWarning',
    'colorError',
    'colorInfo',

    'colorPrimaryHover',
    'colorPrimaryActive',
  ]

  const root = document.documentElement
  colorKeys.forEach(item => {
    const cssVarName = '--ui' + item
      .replace(/^color/, '')
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
    root.style.setProperty(cssVarName, token[item])
  })

  root.style.setProperty('--ui-scrollbar-thumb', isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.25)')
  root.style.setProperty('--ui-scrollbar-thumb-hover', isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.35)')
  root.style.setProperty('--ui-scrollbar-track', token.colorBgContainer)
}

export const useSysSetingStore = defineStore('sysSeting', () => {
  const currentAlgorithm = ref(defaultAlgorithm)
  const currentIsDark = ref(false)
  let firstRun = true

  const updateAlgorithm = (isDark) => {
    const nextIsDark = !!isDark
    const algorithm = nextIsDark ? darkAlgorithm : defaultAlgorithm
    const token = algorithm(defaultSeed)
    const duration = 1500
    if (!firstRun) {
      playFlapEffect(nextIsDark, token, duration)
    }
    setTimeout(() => {
      const root = document.documentElement
      root.classList.toggle('dark', nextIsDark)
      currentAlgorithm.value = algorithm
      applyAntdTokenVars(nextIsDark, token)
      currentIsDark.value = nextIsDark
      firstRun = false

      // 同步 DevTools 主题
      if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
        localStorage.setItem('__vue-devtools-theme__', nextIsDark ? 'dark' : 'light')
      }

    }, firstRun ? 0 : duration * 0.52) // 首次无延迟，后续有动画延迟
  }

  const toggleDark = () => {
    updateAlgorithm(!currentIsDark.value)
  }

  return {
    currentAlgorithm,
    currentIsDark,
    updateAlgorithm,
    toggleDark
  }
})