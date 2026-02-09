// flapEffect.js
// 用于全局触发 flap 动画

const FLAP_COUNT = 10

function createFlapBox(isDark) {
  if (document.getElementById('global-flap-box')) return
  const box = document.createElement('div')
  box.className = 'flap-box'
  box.id = 'global-flap-box'
  box.style.setProperty('--flaps', FLAP_COUNT)
  for (let i = 0; i < FLAP_COUNT; i++) {
    const flap = document.createElement('div')
    flap.className = 'flap'
    flap.style.setProperty('--i', i)
    box.appendChild(flap)
  }
  document.body.appendChild(box)
}

function removeFlapBox() {
  const box = document.getElementById('global-flap-box')
  if (box) box.remove()
}

function injectFlapStyle(isDark, color, duration) {
  let style = document.getElementById('flap-style')
  if (!style) {
    style = document.createElement('style')
    style.id = 'flap-style'
    document.head.appendChild(style)
  }
  const gradient = `linear-gradient(35deg, ${color.colorBgLayout} 0%, ${color.colorBgContainer} 100%)`
  style.innerHTML = `
  .flap-box {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
  }
  .flap {
    width: 100vmax;
    height: 100vmax;
    position: absolute;
    bottom: 50%;
    right: 50%;
    will-change: transform;
    background: ${gradient};
    border: solid 2px ${color.colorBorder};
    --p: calc(var(--i) / var(--flaps));
    transform-origin: bottom right;
    transform: rotate(-0.5turn) rotate(calc(1turn * var(--p))) skewX(53.5deg) translateX(-100%) translateY(90%);
    animation: flap-effect ${duration / 1000}s cubic-bezier(0.5, 0, 0.5, 1) forwards;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  @keyframes flap-effect {
    48%, 52% {
      transform: rotate(-0.25turn) rotate(calc(1turn * var(--p))) skewX(53.5deg) translateX(0%) translateY(0%);
    }
  }
  `
}

export function playFlapEffect(isDark, color, duration) {
  injectFlapStyle(isDark, color, duration)
  createFlapBox(isDark)
  // 动画结束后移除
  setTimeout(removeFlapBox, duration + 300)
}