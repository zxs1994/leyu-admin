<script setup>
import { ref, watchEffect, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MenuItem from './MenuItem.vue'
import { filterRoutes } from '@/router'
import { title } from '@/utils'
import { storeToRefs } from 'pinia'
import { useSysSetingStore } from '@/stores/sysSeting'

const sysSetingStore = useSysSetingStore()
const { collapsed } = storeToRefs(sysSetingStore)

const route = useRoute()
const router = useRouter()

function filterVisibleMenu(routes) {
	return routes
		.filter((route) => route.meta?.isShowMenu)
		.map((route) => {
			const newRoute = { ...route }

			if (newRoute.children) {
				newRoute.children = filterVisibleMenu(newRoute.children)
			}

			// 如果有 children 字段但过滤后为空，去掉 children
			if (newRoute.children?.length === 0) {
				delete newRoute.children
			}

			return newRoute
		})
}

// 递归查找父菜单路径
function findOpenKeys(name, menuList) {
	// console.log(name, menuList)
	for (const item of menuList) {
		if (item.children) {
			if (item.children.some((c) => c.name === name)) {
				return [item.name] // 找到父级
			} else {
				const childOpen = findOpenKeys(name, item.children)
				if (childOpen.length) {
					return [item.name, ...childOpen]
				}
			}
		}
	}
	return []
}

const routers = filterVisibleMenu(filterRoutes).filter((i) => i)

console.log(routers)

const getSelectedKeys = () => {
	return route.matched.map((i) => i.meta?.activeName || i.name)
}

const selectedKeys = ref([])
const openKeys = ref([])

const handleClick = (e) => {
	if (e.key.startsWith(import.meta.env.VITE_BASE_API)) {
		open(e.key)
	} else {
		router.push({ name: e.key })
	}
}

// 刷新页面时计算选中和展开
// watchEffect 会首次立即执行，也会在依赖变化时执行
watchEffect(() => {
	const name = route.name
	selectedKeys.value = getSelectedKeys()
	if (!collapsed.value) {
		openKeys.value = findOpenKeys(name, routers)
	}
})

// 浏览器切换 tab 时也执行 selectedKeys.value = getSelectedKeys()
// 目的是不让link的菜单处于选中状态
onMounted(() => {
	const handleVisibility = () => {
		if (document.visibilityState === 'visible') {
			selectedKeys.value = getSelectedKeys()
		}
	}
	document.addEventListener('visibilitychange', handleVisibility)

	onUnmounted(() => {
		document.removeEventListener('visibilitychange', handleVisibility)
	})
})
</script>
<template>
	<a-layout-sider
		theme="light"
		v-model:collapsed="collapsed"
		:collapsed-width="60">
		<div
			class="logo-box border-(--ui-border-secondary) border-e border-b"
			:class="collapsed ? 'py-2.5' : 'p-2.5'">
			<img
				src="/icons/icon-192.png"
				class="w-10" />
			<span
				class="text whitespace-nowrap overflow-hidden text-ellipsis"
				style="font-weight: 600"
				v-if="!collapsed"
				>{{ title }}</span
			>
		</div>
		<a-menu
			v-model:openKeys="openKeys"
			v-model:selectedKeys="selectedKeys"
			mode="inline"
			class="menu"
			@click="handleClick">
			<MenuItem
				v-for="item in routers"
				:key="item.name || item.link"
				:item="item" />
		</a-menu>
		<!-- <div
			class="foot flex-nowrap! overflow-hidden 1px solid border-(--ui-border-secondary) border-e"
			:style="{
				flexDirection: collapsed ? 'column-reverse' : 'row',
			}">
			<div
				class="flex"
				:style="{
					flexDirection: collapsed ? 'column-reverse' : 'row',
				}"></div>
		</div> -->
	</a-layout-sider>
</template>
<style lang="less" scoped>
:deep(.ant-layout-sider-children) {
	display: flex;
	flex-direction: column;
	height: 100vh;
	justify-content: space-between;
	.logo-box {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
	}
	.menu {
		flex: 1;
		overflow: auto;
	}
	.foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px;
		flex-wrap: wrap;
		gap: 10px;
		.but {
			font-size: 20px;
			line-height: 1;
			padding: 5px;
		}
	}
}
</style>
