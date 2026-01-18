<script setup>
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const keepAliveInclude = ref([])
watchEffect(route, () => {
	if (route.meta?.keepAlive) {
		keepAliveInclude.value.push(route.name)
		keepAliveInclude.value = Array.from(new Set(keepAliveInclude.value))
		console.log(keepAliveInclude.value)
	}
})
</script>
<template>
	<a-layout-content class="layout-content">
		<RouterView v-slot="{ Component, route }">
			<KeepAlive :include="keepAliveInclude">
				<component
					:is="Component"
					:key="$route.fullPath"
					class="CONTENT" />
			</KeepAlive>
		</RouterView>
		<!-- <RouterView /> -->
	</a-layout-content>
</template>
<style lang="less" scoped>
.layout-content {
	padding: 20px;
	background: #fff;
}
</style>
