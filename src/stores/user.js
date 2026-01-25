import {
  ref,
  // computed
} from 'vue'
import {
  defineStore
} from 'pinia'
import {
  userApi
} from '@/api'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref({})
  const response = ref({})
  // const doubleCount = computed(() => count.value * 2)
  let setUserInfoFlag = false
  async function setUserInfo(callback) {
    const res = await userApi.getUserInfo()
    response.value = res
    if (res.data) setUserInfoFlag = true
    userInfo.value = res.data || {}
    callback && callback()
    return res.data
  }

  async function getOrFetchUserInfo(callback) {
    if (!setUserInfoFlag) {
      await setUserInfo(callback)
    }
    return userInfo.value
  }

  function reset() {
    userInfo.value = {}
    response.value = {}
    setUserInfoFlag = false
  }

  return {
    response,
    userInfo,
    setUserInfo,
    getOrFetchUserInfo,
    reset
  }
})