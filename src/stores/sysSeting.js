import {
  ref
} from 'vue'
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

const applyAntdTokenVars = (isDark) => {
  const algorithm = isDark ? darkAlgorithm : defaultAlgorithm
  const token = algorithm(defaultSeed)
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

  const updateAlgorithm = (isDark) => {
    const nextIsDark = !!isDark
    currentAlgorithm.value = nextIsDark ? darkAlgorithm : defaultAlgorithm
    applyAntdTokenVars(nextIsDark)
    currentIsDark.value = isDark
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