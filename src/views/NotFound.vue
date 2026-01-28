<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const backHome = () => {
	router.push('/')
}
</script>
<template>
	<div class="h-screen flex flex-col items-center justify-center bg-linear-to-br bg-(--ui-bg-layout) px-4 text-center">
		<!-- 404 大标题 -->
		<h1 class="text-6xl font-bold text-(--ui-primary) mb-2">404</h1>

		<!-- 描述 -->
		<p class="text-xl mt-4 text-(--ui-text-secondary)">页面未找到</p>

		<p class="mb-6 text-(--ui-text-tertiary)">你访问的页面不存在或已被移除。</p>

		<!-- 返回首页按钮 -->
		<a-button
			@click="backHome"
			type="primary">
			返回首页
		</a-button>
	</div>
</template>
