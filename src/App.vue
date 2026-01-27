<script setup>
import { RouterView } from 'vue-router'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { useEnumsStore } from './stores/enums'
import { theme } from 'ant-design-vue'
import { ref } from 'vue'

// 根据系统偏好初始化
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const currentAlgorithm = ref(prefersDark ? theme.darkAlgorithm : theme.defaultAlgorithm)

// 监听系统偏好变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
	currentAlgorithm.value = e.matches ? theme.darkAlgorithm : theme.defaultAlgorithm
})

useEnumsStore().init()
</script>

<template>
	<a-config-provider
		:locale="zhCN"
		:theme="{ algorithm: currentAlgorithm }">
		<a-watermark :content="$appName">
			<RouterView />
		</a-watermark>
	</a-config-provider>
</template>

<style lang="less" scoped></style>
