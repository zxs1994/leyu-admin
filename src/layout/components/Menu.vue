<script setup>
import { ref, watchEffect, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SwapOutlined, MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import MenuItem from './MenuItem.vue'
import robot from '@/icons/robot.svg'
import { authApi } from '@/api'
import { gotoLogin } from '@/utils'
import { useUserStore } from '@/stores/user'
import UserModal from '@/components/UserModal.vue'
import ChatModal from '@/components/ChatModal.vue'
import SwichTenantModal from '@/components/SwichTenantModal.vue'
import { filterRoutes } from '@/router'
import { checkPermission } from '@/utils/permission'
import { title } from '@/utils'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const showUserModal = ref(false)
const showSwichTenantModal = ref(false)
const chatModalRef = ref()
const logoutLoading = ref(false)

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
const logout = async () => {
	const timeoutMs = 400
	logoutLoading.value = true
	try {
		await Promise.race([authApi.logout(), new Promise((resolve) => setTimeout(resolve, timeoutMs))])
	} catch (e) {
		console.log(e)
	} finally {
		logoutLoading.value = false
		// 跳转到登录页
		gotoLogin(true)
	}
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
		<!-- 只有点击后才渲染 -->
		<UserModal
			v-if="showUserModal"
			@close="showUserModal = false" />
		<SwichTenantModal
			v-if="showSwichTenantModal"
			@close="showSwichTenantModal = false" />
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
		<div
			class="foot flex-nowrap! overflow-hidden 1px solid border-(--ui-border-secondary) border-e"
			:style="{
				flexDirection: collapsed ? 'column-reverse' : 'row',
			}">
			<a-dropdown :trigger="['click']">
				<a-avatar :style="{ 'background-color': userStore.userInfo.color, cursor: 'pointer' }">
					{{ userStore.userInfo.name }}
				</a-avatar>

				<template #overlay>
					<a-menu>
						<a-menu-item v-if="checkPermission('platform:tenant:list')">
							<div
								class="flex items-center gap-2"
								@click="showSwichTenantModal = true">
								<SwapOutlined /> 切换租户
							</div>
						</a-menu-item>

						<a-menu-item>
							<div
								class="flex items-center gap-2"
								@click="showUserModal = true">
								<UserOutlined /> 个人信息
							</div>
						</a-menu-item>

						<a-menu-divider />

						<a-menu-item>
							<a-spin :spinning="logoutLoading">
								<div
									class="flex items-center gap-2"
									@click="logout">
									<LogoutOutlined /> 退出登录
								</div>
							</a-spin>
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
		display: none;
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
