<script setup>
import { ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BellOutlined, MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons-vue'
import MenuItem from './MenuItem.vue'
import robot from '@/icons/robot.svg'
import { authApi } from '@/api'
import { removeToken } from '@/utils'
import { useUserStore } from '@/stores/user'
import { useTodoListStore } from '@/stores/todoList'
import UserModal from '@/components/UserModal.vue'
import TodoList from '@/components/TodoList.vue'
import ChatModal from '@/components/ChatModal.vue'
import { HomeRouter, filterRoutes } from '@/router'

const userStore = useUserStore()
const todoListStore = useTodoListStore()
const route = useRoute()
const router = useRouter()
const userModalRef = ref()
const todoListRef = ref()
const chatModalRef = ref()

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

const routers = filterVisibleMenu([HomeRouter, ...filterRoutes]).filter((i) => i.children)

// console.log(routers)

todoListStore.setList(1, undefined, false)

const getSelectedKeys = () => {
	return route.matched.map((i) => i.meta?.activeName || i.name)
}

const selectedKeys = ref([])
const openKeys = ref([])

const handleClick = (e) => {
	router.push({ name: e.key })
}
const logout = async () => {
	console.log(route.fullPath)
	try {
		await authApi.logout()
	} catch (e) {
		console.log(e)
	}
	// 清除token
	removeToken()
	// 跳转到登录页
	window.location.href = '/login?redirect=' + encodeURIComponent(location.pathname + location.search)
}

const collapsed = ref(localStorage.getItem('collapsed') ? JSON.parse(localStorage.getItem('collapsed')) : false)
const collapseChange = (val) => {
	localStorage.setItem('collapsed', val)
	collapsed.value = val
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
</script>
<template>
	<a-layout-sider
		theme="light"
		v-model:collapsed="collapsed"
		:collapsed-width="60">
		<UserModal ref="userModalRef" />
		<TodoList ref="todoListRef" />
		<ChatModal ref="chatModalRef" />
		<div
			class="toggleMenu"
			@click="collapseChange(!collapsed)">
			<a-button
				type="dashed"
				shape="circle">
				<component :is="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined" />
			</a-button>
		</div>
		<div class="logo-box">
			<img
				src="/vite.svg"
				style="width: 40px; height: 40px" />
			<span
				class="text whitespace-nowrap overflow-hidden text-ellipsis"
				style="font-weight: 600"
				v-if="!collapsed"
				>Vue3AntAdmin</span
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
				:key="item.name"
				:item="item" />
		</a-menu>
		<div
			class="foot !flex-nowrap overflow-hidden"
			:style="{
				flexDirection: collapsed ? 'column-reverse' : 'row',
			}">
			<a-dropdown :trigger="['click']">
				<!-- <a-button type="text" class="but"><SettingOutlined /></a-button> -->
				<!-- <a-avatar
					:size="32"
					
					class="shrink-0">
					
				</a-avatar> -->
				<a-avatar style="background-color: #f56a00; cursor: pointer">
					{{ userStore.userInfo.name }}
				</a-avatar>
				<template #overlay>
					<a-menu>
						<a-menu-item>
							<div @click="userModalRef.visible = true">个人信息</div>
						</a-menu-item>
						<a-menu-item>
							<div @click="logout">退出登录</div>
						</a-menu-item>
					</a-menu>
				</template>
			</a-dropdown>
			<div
				class="flex"
				:style="{
					flexDirection: collapsed ? 'column-reverse' : 'row',
				}">
				<a-button
					type="text"
					class="but"
					@click="chatModalRef.open = true">
					<robot />
				</a-button>

				<a-badge :dot="todoListStore.badge">
					<a-button
						type="text"
						class="but"
						@click="todoListRef.visible = true"
						><BellOutlined
					/></a-button>
				</a-badge>
			</div>
		</div>
	</a-layout-sider>
</template>
<style lang="less" scoped>
:deep(.ant-layout-sider-children) {
	display: flex;
	flex-direction: column;
	height: 100vh;
	justify-content: space-between;
	&:hover {
		.toggleMenu {
			display: flex;
		}
	}
	.toggleMenu {
		height: 32px;
		background: rgba(255, 255, 255, 0.2);
		display: none;
		align-items: center;
		justify-content: center;
		border-radius: 6px;
		position: absolute;
		top: 50%;
		right: 0;
		transform: translate(50%, -50%);
		z-index: 1;
	}
	.logo-box {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		font-size: 16px;
		padding: 15px;
		border-inline-end: 1px solid rgba(5, 5, 5, 0.06);
	}
	.menu {
		flex: 1;
		overflow: auto;
	}
	.foot {
		border-inline-end: 1px solid rgba(5, 5, 5, 0.06);
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
