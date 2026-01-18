<script setup>
import { watch, ref, reactive } from 'vue'
import Rules from '@/utils/rules'
import { userApi } from '@/api'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
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
	{ immediate: true, deep: true }
)

const visible = ref(false)
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
	visible.value = false
}

// 模态框确认
const handleModalOk = async () => {
	modalLoading.value = true
	if (props.isAddMode) {
	} else {
		const res = await userApi.updateUserInfo({
			id: formState.id,
			name: formState.name,
			password: formState.password,
		})
		modalLoading.value = false
		if (!res.success) {
			return
		}
		visible.value = false
		res.success && message.success(res.msg)
		userStore.setUserInfo()
	}
}

defineExpose({ visible })
</script>
<template>
	<a-modal
		v-model:open="visible"
		:title="modalTitle"
		@ok="handleModalOk"
		@cancel="handleModalCancel"
		:confirm-loading="modalLoading"
		centered
		:width="500">
		<a-form
			ref="formRef"
			style="margin-top: 20px"
			:model="formState"
			:rules="formRules"
			:label-col="{ span: 6 }"
			:wrapper-col="{ span: 16 }">
			<a-form-item
				label="邮箱"
				name="email">
				<a-input
					v-model:value="formState.email"
					disabled
					placeholder="请输入邮箱" />
			</a-form-item>
			<a-form-item
				:label="`名称`"
				name="name">
				<a-input
					v-focus="visible"
					v-model:value="formState.name"
					:placeholder="`请输入用户名称`" />
			</a-form-item>
			<a-form-item
				label="密码"
				name="password"
				v-if="props.isAddMode">
				<a-input
					v-model:value="formState.password"
					placeholder="请输入密码" />
			</a-form-item>
		</a-form>
	</a-modal>
</template>
