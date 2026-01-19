<script setup>
import { RouterView } from 'vue-router'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { useEnumsStore } from './stores/enums'
useEnumsStore().init()
</script>

<template>
	<a-config-provider :locale="zhCN">
		<a-watermark content="vu3-ant-admin">
			<RouterView />
		</a-watermark>
	</a-config-provider>
</template>

<style lang="less" scoped></style>
