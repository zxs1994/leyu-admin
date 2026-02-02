export const title = __APP_NAME__

const isPWA = window.matchMedia('(display-mode: minimal-ui)').matches
// console.log(isPWA)
export function getPageTitle(pageTitle) {
  if (isPWA) {
    return pageTitle || ''
  }
  return pageTitle ? `${pageTitle} - ${title}` : title
}

const TOKEN_KEY = 'token'
const REFRESH_TOKEN_KEY = 'refreshToken'
export function setToken(data) {
  localStorage.setItem(TOKEN_KEY, data.token)
  if (data.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken)
  }
}

export function getToken(key = TOKEN_KEY) {
  return localStorage.getItem(key)
}
export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}
export function removeToken() {
  return localStorage.removeItem(TOKEN_KEY)
}
export function removeRefreshToken() {
  return localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export const gotoLogin = (immediatelyow = false) => {
  removeToken()
  removeRefreshToken()

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