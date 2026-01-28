<script setup>
import { useRouter } from 'vue-router'
import { updateAlgorithm } from '@/utils/antStyle'
import { ref, h } from 'vue'
import { BulbOutlined, BulbFilled } from '@ant-design/icons-vue'

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
		class="border-(--ui-border)! border-b bg-(--ui-bg-container)! p-4!"
		:title="router.currentRoute.value.meta?.title"
		@back="() => router.go(-1)">
		<template #extra>
			<!-- 图标按钮切换暗黑模式 -->
			<a-button
				type="text"
				:icon="isDark ? h(BulbFilled) : h(BulbOutlined)"
				@click="toggleDark" />
		</template>
	</a-page-header>
</template>
