<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const backHome = () => {
	router.push('/')
}
</script>
<template>
	<div class="not-found">
		<div
			class="h-screen flex flex-col items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 dark:from-[#141414] dark:to-[#141414]">
			<h1 class="text-6xl font-bold text-blue-600 dark:text-blue-500">404</h1>

			<p class="text-xl mt-4 text-gray-700 dark:text-[rgba(255,255,255,0.85)]">页面未找到</p>

			<p class="mb-6 text-gray-500 dark:text-[rgba(255,255,255,0.45)]">你访问的页面不存在或已被移除。</p>

			<a-button
				@click="backHome"
				type="primary"
				>返回首页</a-button
			>
		</div>
	</div>
</template>
