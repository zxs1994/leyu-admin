import {
  useRouter
} from 'vue-router'

export default function useGoBack() {
  const router = useRouter()

  const goBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/') // 或其他默认路径
    }
  }

  return {
    goBack
  }
}
