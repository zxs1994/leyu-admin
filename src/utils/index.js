const title = 'vu3-ant-admin'

const isPWA = window.matchMedia('(display-mode: minimal-ui)').matches
// console.log(isPWA)
export function getPageTitle(pageTitle) {
  if (isPWA) {
    return pageTitle || ''
  }
  return pageTitle ? `${pageTitle} - ${title}` : title
}

const TOKEN_KEY = 'token'
export function setToken(data) {
  localStorage.setItem(TOKEN_KEY, data.token)
}

export function getToken(key = TOKEN_KEY) {
  return localStorage.getItem(key)
}
export function removeToken() {
  return localStorage.removeItem(TOKEN_KEY)
}

export const gotoLogin = (immediatelyow = false) => {
  removeToken()

  function toLogin() {
    if (location.pathname !== '/login') {
      window.location.href = '/login?redirect=' + encodeURIComponent(location.pathname + location.search)
    }
  }
  if (immediatelyow) {
    toLogin()
    return
  }
  setTimeout(toLogin, 1000)
}