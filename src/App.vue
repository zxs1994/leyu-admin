<script setup>
import { RouterView } from 'vue-router'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { storeToRefs } from 'pinia'
import { useEnumsStore } from './stores/enums'
import { useSysSetingStore } from '@/stores/sysSeting'

useEnumsStore().init()

const sysSetingStore = useSysSetingStore()
const { currentAlgorithm } = storeToRefs(sysSetingStore)
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
