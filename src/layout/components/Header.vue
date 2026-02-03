<script setup>
import { useRouter } from 'vue-router'
import { currentIsDark } from '@/utils/antStyle'
import SunIcon from '@/icons/sun.svg'
import MoonIcon from '@/icons/moon.svg'

const toggleDark = () => {
	currentIsDark.value = !currentIsDark.value
}

const router = useRouter()
</script>

<template>
	<a-page-header
		class="border-(--ui-border)! border-b bg-(--ui-bg-container)! px-4! py-2.5! shadow-(--ui-box-shadow)!"
		:title="router.currentRoute.value.meta?.title"
		@back="() => router.go(-1)">
		<template #extra>
			<!-- 图标按钮切换暗黑模式 -->
			<a-button
				class="h-7! w-7 flex! items-center justify-center p-0!"
				type="text"
				@click="toggleDark">
				<SunIcon
					v-if="currentIsDark"
					class="w-6 h-6" />
				<MoonIcon
					v-else
					class="w-6 h-6" />
			</a-button>
		</template>
	</a-page-header>
</template>
