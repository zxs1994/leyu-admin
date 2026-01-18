import {
  theme
} from 'ant-design-vue'

const {
  defaultAlgorithm,
  defaultSeed
} = theme

const mapToken = defaultAlgorithm(defaultSeed)
// console.log(mapToken)

window.addEventListener('load', () => {
  // 运行时设置 CSS 变量
  document.documentElement.style.setProperty('--red', mapToken.colorErrorText)
  document.documentElement.style.setProperty('--red-hover', mapToken.colorErrorTextHover)
  document.documentElement.style.setProperty('--red-active', mapToken.colorErrorTextActive)
})

// 获取常用颜色
export const AntdColors = mapToken
