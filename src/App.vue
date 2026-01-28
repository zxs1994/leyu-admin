<script setup>
import { RouterView } from 'vue-router'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { useEnumsStore } from './stores/enums'
import { currentAlgorithm } from '@/utils/antStyle'

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
