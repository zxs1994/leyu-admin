<script setup>
import { ref, watchEffect } from 'vue'
import Menu from './components/Menu.vue'
import Content from './components/Content.vue'
import Header from './components/Header.vue'
</script>
<template>
	<a-layout class="layout">
		<Menu />
		<a-layout style="height: 100vh; overflow: auto">
			<Header />
			<Content style="overflow: auto" />
			<!-- <a-layout-footer style="text-align: center"> Ant Design ©2018 Created by Ant UED </a-layout-footer> -->
		</a-layout>
	</a-layout>
</template>
<style lang="less" scoped>
.layout {
	min-height: 100vh;
	background: transparent;
	// height: 100vh;
	// 	width: 100vw;
}
</style>
