<script setup>
import { RouterView } from 'vue-router'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { useEnumsStore } from './stores/enums'
useEnumsStore().init()
const appName = __APP_NAME__
</script>

<template>
	<a-config-provider :locale="zhCN">
		<a-watermark :content="appName">
			<RouterView />
		</a-watermark>
	</a-config-provider>
</template>

<style lang="less" scoped></style>
