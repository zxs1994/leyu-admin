import {
  ref,
} from 'vue'
import {
  defineStore
} from 'pinia'
import {
  commonApi
} from '@/api'

export const useEnumsStore = defineStore('enums', () => {
  const all = ref({})

  function init() {
    commonApi.enums().then(res => {
      all.value = res.data
    })
  }

  return {
    all,
    init
  }
})