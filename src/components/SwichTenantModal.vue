<script setup>
import { ref, reactive } from 'vue'
import { tenantApi as api } from '@/api'
import { message } from 'ant-design-vue'
import { setToken } from '@/utils'

const emit = defineEmits(['submitEnd', 'close'])

const open = ref(true)
const loading = ref(false)
const modalTitle = '选择目标租户, 以目标身份操作(退出后可切换回平台身份)'
const selectedTenantId = ref(null)

const list = ref([])

const getList = () => {
	api.list().then((res) => {
		if (res.success) {
			list.value = res.data
		}
	})
}

getList()

// 模态框取消
const handleModalCancel = () => {
	open.value = false
	emit('close')
}

// 选中后切换租户
const onSelect = async () => {
	console.log(selectedTenantId.value)
	loading.value = true
	const res = await api.switchTenant(selectedTenantId.value)
	loading.value = false
	if (!res.success) {
		return
	}
	setToken(res.data)

	handleModalCancel()
	message.success('切换成功, 2秒后将自动刷新页面', 2)
	setTimeout(() => {
		window.location.reload()
	}, 2000)
	emit('submitEnd')
}
</script>
<template>
	<a-modal
		v-model:open="open"
		:title="modalTitle"
		@afterClose="handleModalCancel"
		:footer="null"
		centered
		:width="500"
		:bodyStyle="{ padding: '20px 0px' }">
		<a-spin :spinning="loading">
			<div class="h-150 overflow-auto">
				<a-radio-group
					v-model:value="selectedTenantId"
					@change="onSelect"
					:options="list.map((i) => ({ label: i.name, value: i.id }))" />
			</div>
		</a-spin>
	</a-modal>
</template>
