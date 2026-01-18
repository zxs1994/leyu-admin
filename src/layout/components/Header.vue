<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
<template>
	<a-page-header
		style="background: #fff; border-bottom: var(--border)"
		:title="router.currentRoute.value.meta?.title"
		sub-title=""
		@back="() => router.go(-1)" />
</template>
