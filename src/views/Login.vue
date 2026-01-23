<script setup>
import { onMounted, reactive, ref, toRaw } from 'vue'
import Rules from '@/utils/rules'
import { message } from 'ant-design-vue'
import { MailOutlined, LockOutlined } from '@ant-design/icons-vue'
import { authApi } from '@/api'
import { setToken } from '@/utils'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const loginFormRef = ref()

const form = reactive({
	email: 'admin@qq.com',
	password: 'admin123',
})

const rules = {
	email: Rules.email,
	password: Rules.password,
}

const loading = ref(false)

const onSubmit = async () => {
	// 校验表单
	await loginFormRef.value.validate()

	// 调用登录接口
	const res = await authApi.login({
		email: form.email,
		password: form.password,
	})

	console.log('login res', res)

	if (!res.success) {
		// message.error(res.message || '登录失败')
		return
	}

	// 保存 token
	setToken(res.data)

	const previousEmail = localStorage.getItem('email')
	const currentEmail = form.email

	// 更新本地缓存
	localStorage.setItem('email', currentEmail)

	// 判断是否换账号
	let redirectPath = previousEmail !== currentEmail ? '/' : route.query.redirect || '/'

	if (redirectPath === '/404') redirectPath = '/'

	router.replace(redirectPath)
}
</script>

<template>
	<div class="h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-slate-200">
		<!-- 白色登录容器 -->
		<div class="w-90 rounded-2xl bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] px-8 py-10">
			<!-- 顶部 Logo / 图标 -->
			<div class="flex justify-center items-center space-x-2">
				<img
					class="w-12 h-12"
					src="/icons/icon-192.png"
					alt="logo" />
				<span class="text-xl font-semibold">vue3-ant-admin</span>
			</div>

			<!-- 标题 -->
			<div class="text-center m-6">
				<div class="text-gray-400">请登录你的账号</div>
			</div>

			<!-- 表单 -->
			<a-form
				ref="loginFormRef"
				:model="form"
				:rules="rules"
				label-width="0"
				class="mt-8 space-y-4">
				<a-form-item
					name="email"
					hasFeedback>
					<a-input
						v-model:value.trim="form.email"
						size="large"
						placeholder="邮箱"
						v-focus>
						<template #prefix>
							<MailOutlined />
						</template>
					</a-input>
				</a-form-item>

				<a-form-item
					name="password"
					hasFeedback>
					<a-input-password
						v-model:value.trim="form.password"
						size="large"
						placeholder="密码"
						@keyup.enter="onSubmit">
						<template #prefix>
							<LockOutlined />
						</template>
					</a-input-password>
				</a-form-item>
			</a-form>

			<!-- 登录按钮 -->
			<a-button
				type="primary"
				size="large"
				block
				class="h-11 text-base mt-6"
				:loading="loading"
				@click="onSubmit">
				登录
			</a-button>
		</div>
	</div>
</template>
