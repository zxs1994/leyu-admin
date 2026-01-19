<script setup>
import Chat from './Chat.vue'
import { ref } from 'vue'
const open = ref(false)
defineExpose({
	open,
})
</script>
<template>
	<a-drawer
		v-model:open="open"
		title="智能聊天"
		width="600"
		placement="right">
		<Chat />
	</a-drawer>
</template>
