<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSysSetingStore } from '@/stores/sysSeting'
import { MenuUnfoldOutlined, MenuFoldOutlined, SwapOutlined, UserOutlined, LogoutOutlined, CaretDownOutlined } from '@ant-design/icons-vue'
import SunIcon from '@/icons/sun.svg'
import MoonIcon from '@/icons/moon.svg'
import RobotIcon from '@/icons/robot.svg'
import { checkPermission } from '@/utils/permission'
import { useUserStore } from '@/stores/user'
import UserModal from '@/components/UserModal.vue'
import ChatModal from '@/components/ChatModal.vue'
import SwichTenantModal from '@/components/SwichTenantModal.vue'
import { authApi } from '@/api'
import { gotoLogin } from '@/utils'

const userStore = useUserStore()
const showUserModal = ref(false)
const showSwichTenantModal = ref(false)
const chatModalRef = ref()
const logoutLoading = ref(false)

const sysSetingStore = useSysSetingStore()
const { currentIsDark, collapsed } = storeToRefs(sysSetingStore)

const route = useRoute()

const pageTitle = computed(() => route.meta?.title || '乐羽')
const themeButtonTitle = computed(() => (currentIsDark.value ? '切换浅色模式' : '切换暗黑模式'))
const avatarText = computed(() => {
	const name = (userStore.userInfo.name || '').toUpperCase()
	if (!name) {
		return '?'
	}
	const font = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	const text = Array.from(name).slice(0, 1).join('')
	if (font.includes(text)) {
		return font[font.indexOf(text)]
	}
	return text
})

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
</script>

<template>
	<div
		class="flex h-15.25 shrink-0 items-center justify-between border-b border-(--ui-border-secondary) bg-(--ui-bg-container) px-4 py-2.5 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.35)]">
		<div class="flex min-w-0 items-center gap-3">
			<a-button
				class="h-10! w-10! px-0! flex! items-center justify-center text-[24px]!"
				type="text"
				@click="sysSetingStore.collapseChange(!collapsed)">
				<MenuUnfoldOutlined v-if="collapsed" />
				<MenuFoldOutlined v-else />
			</a-button>

			<div class="min-w-0">
				<h1 class="truncate text-base font-semibold leading-6 text-(--ui-text)">{{ pageTitle }}</h1>
			</div>
		</div>

		<div class="flex items-center">
			<a-button
				type="text"
				class="h-10! w-10! px-0! flex! items-center justify-center"
				@click="chatModalRef.open = true">
				<RobotIcon class="h-6 w-6" />
			</a-button>
			<a-button
				class="h-10! w-10! px-0! flex! items-center justify-center"
				type="text"
				@click="sysSetingStore.toggleDark">
				<SunIcon
					v-if="currentIsDark"
					class="h-6 w-6" />
				<MoonIcon
					v-else
					class="h-6 w-6" />
			</a-button>
			<a-dropdown :trigger="['click']">
				<div class="ml-2 flex cursor-pointer items-center gap-2 hover:opacity-90 active:opacity-100">
					<a-avatar
						:style="{ 'background-color': userStore.userInfo.color, cursor: 'pointer' }"
						:size="35">
						{{ avatarText }}
					</a-avatar>
					<span class="font-medium">{{ userStore.userInfo.name }} <CaretDownOutlined /></span>
				</div>

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
		</div>
		<!-- 只有点击后才渲染 -->
		<UserModal
			v-if="showUserModal"
			@close="showUserModal = false" />
		<SwichTenantModal
			v-if="showSwichTenantModal"
			@close="showSwichTenantModal = false" />
		<ChatModal ref="chatModalRef" />
	</div>
</template>
