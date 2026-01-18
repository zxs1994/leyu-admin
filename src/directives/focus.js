import {
  nextTick
} from 'vue'

const canFocusElements = [
  'INPUT',
  'BUTTON',
]
const findFocusable = (el) => {
  if (!el) return null

  if (canFocusElements.includes(el.tagName)) {
    return el
  }

  for (let i = 0; i < el.children.length; i++) {
    const child = findFocusable(el.children[i])
    if (child) return child
  }

  return null
}

const elFocus = (el) => {
  nextTick(() => {
    const target = findFocusable(el)
    if (target) {
      target.focus()
    } else {
      console.warn('未找到可聚焦元素')
    }
  })
}

export default function setupFocusDirective(app) {
  app.directive('focus', {
    mounted(el, binding) {
      // console.log(el, binding)
      if (binding.value === true || binding.value === undefined) {
        elFocus(el)
      }
    },
    updated(el, binding) {
      // console.log(binding)
      if (binding.value === true && binding.oldValue === false) {
        elFocus(el)
      }
    }
  })
}