<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const backHome = () => {
	router.push('/')
}
</script>

<template>
	<div class="h-screen flex flex-col items-center justify-center bg-(--ui-bg-layout) border-none px-4 text-center">
		<!-- 错误标题 -->
		<h1 class="text-5xl font-bold text-(--ui-error) mb-4">出错了</h1>

		<!-- 描述 -->
		<p class="text-lg text-(--ui-text-secondary) mb-6">很抱歉，系统发生了一些错误，请稍后再试。</p>

		<!-- 返回首页按钮 -->
		<a-button
			@click="backHome"
			type="primary">
			返回首页
		</a-button>
	</div>
</template>
