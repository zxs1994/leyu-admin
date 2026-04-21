<script setup></script>
<template>
	<a-layout-content class="layout-content">
		<RouterView v-slot="{ Component, route }">
			<KeepAlive>
				<component
					v-if="route.meta?.keepAlive"
					:is="Component"
					:key="route.name || route.path"
					class="CONTENT" />
			</KeepAlive>
			<component
				v-if="!route.meta?.keepAlive"
				:is="Component"
				:key="route.fullPath"
				class="CONTENT" />
		</RouterView>
	</a-layout-content>
</template>
<style lang="less">
.layout-content > .CONTENT {
	padding: 20px;
}
</style>
