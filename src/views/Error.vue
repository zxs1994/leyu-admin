<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const backHome = () => {
	router.push('/')
}
</script>

<template>
	<div
		class="h-screen flex flex-col items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 dark:from-[#141414] dark:to-[#141414]">
		<h1 class="text-5xl font-bold text-red-600 dark:text-red-400 mb-4">出错了</h1>
		<p class="text-lg text-gray-600 dark:text-gray-400 mb-6">很抱歉，系统发生了一些错误，请稍后再试。</p>
		<a-button
			@click="backHome"
			type="primary"
			>返回首页</a-button
		>
	</div>
</template>
