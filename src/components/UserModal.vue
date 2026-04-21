<script setup>
import { watch, ref, reactive } from 'vue'
import Rules from '@/utils/rules'
import { userApi } from '@/api'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const emit = defineEmits(['close'])
const props = defineProps({
	isAddMode: {
		type: Boolean,
		default: false,
	},
})
const formState = reactive({})

watch(
	() => userStore.userInfo,
	(val) => {
		Object.assign(formState, JSON.parse(JSON.stringify(val)))
	},
	{ immediate: true, deep: true },
)

const open = ref(true)
const modalLoading = ref(false)
const modalTitle = '个人信息'
const formRules = {
	name: Rules.name,
	email: Rules.email,
	password: Rules.password,
}
const formRef = ref()
// 模态框取消
const handleModalCancel = () => {
	formRef.value.resetFields()
	// open.value = false
	emit('close')
}

// 模态框确认
const handleModalOk = async () => {
	modalLoading.value = true
	if (props.isAddMode) {
	} else {
		const res = await userApi.updateUserInfo({
			id: formState.id,
			name: formState.name,
			email: formState.email,
			password: formState.password,
		})
		modalLoading.value = false
		if (!res.success) {
			return
		}
		handleModalCancel()
		res.success && message.success('更新成功')
		userStore.setUserInfo()
	}
}
</script>
<template>
	<a-modal
		:open="open"
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
			:label-col="{ span: 4 }"
			:wrapper-col="{ span: 18 }">
			<a-form-item
				label="邮箱"
				name="email"
				hasFeedback>
				<a-input
					:disabled="userStore.userInfo.id === '1'"
					v-model:value="formState.email"
					placeholder="请输入邮箱" />
			</a-form-item>
			<a-form-item
				:label="`名称`"
				name="name"
				hasFeedback>
				<a-input
					v-focus="open"
					v-model:value="formState.name"
					:placeholder="`请输入用户名称`" />
			</a-form-item>
			<a-form-item
				label="密码"
				name="password"
				v-if="props.isAddMode"
				hasFeedback>
				<a-input
					v-model:value="formState.password"
					placeholder="请输入密码" />
			</a-form-item>
		</a-form>
	</a-modal>
</template>
