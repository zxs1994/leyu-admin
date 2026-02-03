<script setup>
import { useRouter } from 'vue-router'
import { updateAlgorithm } from '@/utils/antStyle'
import { ref } from 'vue'
import SunIcon from '@/icons/sun.svg'
import MoonIcon from '@/icons/moon.svg'

const mql = window.matchMedia('(prefers-color-scheme: dark)')
const isDark = ref(mql.matches)

const toggleDark = () => {
	isDark.value = !isDark.value
	updateAlgorithm(isDark.value)
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
					v-if="isDark"
					class="w-6 h-6" />
				<MoonIcon
					v-else
					class="w-6 h-6" />
			</a-button>
		</template>
	</a-page-header>
</template>
