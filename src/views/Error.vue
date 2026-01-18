<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const backHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
    <h1 class="text-5xl font-bold text-red-500 mb-4">出错了</h1>
    <p class="text-lg text-gray-600 mb-6">很抱歉，系统发生了一些错误，请稍后再试。</p>
    <button
      class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      @click="backHome"
    >
      返回首页
    </button>
  </div>
</template>
