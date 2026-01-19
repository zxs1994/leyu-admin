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
	const redirectPath = previousEmail !== currentEmail ? '/' : route.query.redirect || '/'

	router.replace(redirectPath)
}
</script>

<template>
	<div class="login-container">
		<div class="login-box">
			<h2>欢迎使用</h2>
			<a-form
				ref="loginFormRef"
				:model="form"
				:rules="rules"
				label-width="0"
				class="login-form">
				<a-form-item
					name="email"
					hasFeedback>
					<a-input
						v-model:value.trim="form.email"
						size="large"
						:placeholder="rules.email[0].message"
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
						size="large"
						:placeholder="rules.password[0].message"
						v-model:value.trim="form.password"
						@keyup.enter="onSubmit">
						<template #prefix>
							<LockOutlined />
						</template>
					</a-input-password>
				</a-form-item>
				<a-form-item>
					<a-button
						type="primary"
						size="large"
						:loading="loading"
						@click="onSubmit"
						class="login-btn">
						登录
					</a-button>
				</a-form-item>
			</a-form>
		</div>
	</div>
</template>

<style lang="less" scoped>
.login-container {
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	background: #f0f2f5;

	.login-box {
		width: 360px;
		padding: 40px 30px;
		background: #fff;
		border-radius: 12px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

		h2 {
			text-align: center;
			margin-bottom: 30px;
		}

		.login-form {
			.login-btn {
				width: 100%;
			}
		}
	}
}
</style>
