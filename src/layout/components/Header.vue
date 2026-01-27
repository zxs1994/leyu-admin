<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
<template>
	<a-page-header
		class="border-gray-200! dark:border-[#fdfdfd1f]! border-b"
		:title="router.currentRoute.value.meta?.title"
		sub-title=""
		@back="() => router.go(-1)" />
</template>
