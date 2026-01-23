<script setup>
import { ref, reactive } from 'vue'
import Rules from '@/utils/rules'
import { tenantApi as api } from '@/api'
import { message } from 'ant-design-vue'

const emit = defineEmits(['submitEnd', 'close'])

const formState = reactive({
	name: undefined,
	adminUser: {
		email: undefined,
		name: undefined,
		password: undefined,
	},
})

const open = ref(true)
const modalLoading = ref(false)
const modalTitle = '新建根部门（新租户）'
const formRules = {
	name: Rules.name,
	adminUser: {
		name: Rules.name,
		email: Rules.email,
		password: Rules.password,
	},
}
const formRef = ref()
// 模态框取消
const handleModalCancel = () => {
	formRef.value.resetFields()
	open.value = false
	emit('close')
}

// 模态框确认
const handleModalOk = async () => {
	await formRef.value.validateFields()
	modalLoading.value = true
	const res = await api.add(formState)
	modalLoading.value = false
	if (!res.success) {
		return
	}
	open.value = false
	res.success && message.success('创建成功')
	emit('submitEnd')
}
</script>
<template>
	<a-modal
		v-model:open="open"
		:title="modalTitle"
		@ok="handleModalOk"
		@cancel="handleModalCancel"
		:confirm-loading="modalLoading"
		@afterClose="handleModalCancel"
		centered
		:width="500">
		<a-form
			ref="formRef"
			style="margin-top: 20px"
			:model="formState"
			:rules="formRules"
			layout="vertical">
			<a-form-item
				label="新租户名称"
				name="name"
				hasFeedback>
				<a-input
					v-focus="open"
					v-model:value="formState.name"
					placeholder="请输入租户名称" />
			</a-form-item>
			<a-form-item
				label="管理员邮箱"
				:name="['adminUser', 'email']"
				hasFeedback>
				<a-input
					v-model:value="formState.adminUser.email"
					placeholder="请输入管理员邮箱" />
			</a-form-item>
			<a-form-item
				:label="`管理员名称`"
				:name="['adminUser', 'name']"
				hasFeedback>
				<a-input
					v-model:value="formState.adminUser.name"
					:placeholder="`请输入管理员名称`" />
			</a-form-item>
			<a-form-item
				label="管理员密码"
				:name="['adminUser', 'password']"
				hasFeedback>
				<a-input
					v-model:value="formState.adminUser.password"
					placeholder="请输入管理员密码" />
			</a-form-item>
		</a-form>
	</a-modal>
</template>
