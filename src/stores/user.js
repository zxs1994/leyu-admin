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
  // const doubleCount = computed(() => count.value * 2)
  let setUserInfoFlag = false
  async function setUserInfo(callback) {
    const res = await userApi.getUserInfo()
    // console.log(res)
    userInfo.value = res.data || {}
    setUserInfoFlag = true
    callback && callback()
    return res.data
  }
  async function getOrFetchUserInfo(callback) {
    if (!setUserInfoFlag) {
      await setUserInfo(callback)
    }
    return userInfo.value
  }

  function setUserInfoFlagFasle() {
    setUserInfoFlag = false
  }
  return {
    userInfo,
    setUserInfo,
    getOrFetchUserInfo,
    setUserInfoFlagFasle,
  }
})