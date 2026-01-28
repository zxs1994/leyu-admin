import {
  theme
} from 'ant-design-vue'
import {
  ref
} from 'vue'

const {
  defaultAlgorithm,
  darkAlgorithm,
  defaultSeed
} = theme

const applyAntdTokenVars = (isDark) => {
  const algorithm = isDark ? darkAlgorithm : defaultAlgorithm
  const token = algorithm(defaultSeed)
  console.log(token)
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
    // 把驼峰转短横线，并去掉 color 前缀
    const cssVarName = '--ui' + item
      .replace(/^color/, '') // 去掉 color 前缀
      .replace(/([A-Z])/g, '-$1') // 驼峰转短横线
      .toLowerCase()
    root.style.setProperty(cssVarName, token[item])
  })
}


// 响应式算法
export const currentAlgorithm = ref(defaultAlgorithm)

// 切换算法函数
export const updateAlgorithm = (isDark) => {
  currentAlgorithm.value = isDark ? darkAlgorithm : defaultAlgorithm
  applyAntdTokenVars(isDark)
}

// 初始化：根据系统偏好
const mql = window.matchMedia('(prefers-color-scheme: dark)')
updateAlgorithm(mql.matches)

// 监听系统偏好变化
mql.addEventListener('change', (e) => {
  updateAlgorithm(e.matches)
})