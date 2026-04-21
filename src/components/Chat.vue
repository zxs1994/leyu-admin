<script setup>
import { SSE } from 'sse.js'
import { getToken } from '@/utils'
import { ref, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import { userApi } from '@/api'
import { gotoLogin } from '@/utils'
import sendIcon from '@/icons/send.svg'
import stopIcon from '@/icons/stop.svg'
import '@/components/markdown-view'

const input = ref('')
const list = ref([])
const chatBox = ref(null)
let source = null
const isReceiving = ref(false)

const introMarkdown = `
# Leyu

Leyu 是一个面向后台管理系统的轻量级基础模板，后端基于 Spring Boot + MyBatis-Plus，前端基于 Vue 3 + Vite + Ant Design Vue。

## 这个项目适合做什么

- 作为公司内部后台项目的起步模板
- 作为权限模型、数据权限、多租户设计的参考实现
- 作为表驱动代码生成和前后端协作规范的实践样例

## 核心特点

- JWT 登录鉴权
- RBAC 权限模型
- 数据权限控制
- 多租户支持
- Swagger / OpenAPI 文档集成
- 统一响应结构与前端枚举返回
- 表驱动代码生成

## 仓库结构

- \`leyu\`：Java 后端仓库
- \`leyu-admin\`：Vue 管理后台前端仓库

## 当前聊天面板可以做什么

- 展示 AI 的流式回答
- 渲染 Markdown 内容
- 支持亮色 / 暗黑模式切换
`

const scrollToBottom = () => {
	nextTick(() => {
		if (chatBox.value) {
			chatBox.value.scrollTop = chatBox.value.scrollHeight
		}
	})
}

const enter = () => {
	const prompt = input.value.trim()
	if (!prompt) return message.info('请输入内容!')

	if (isReceiving.value) return message.info('正在回答中...')
	isReceiving.value = true
	// 用户消息
	list.value.push({ role: 'user', value: prompt })

	// AI 占位
	const aiMessage = { role: 'ai', value: '', type: '' }
	list.value.push(aiMessage)
	console.log(isReceiving.value)
	newSSE(prompt)
	input.value = ''
	scrollToBottom()
}

const newSSE = (prompt) => {
	// 关闭旧 SSE
	if (source) {
		source.close()
		source = null
	}
	// 建立 SSE
	source = new SSE(`${import.meta.env.VITE_BASE_API}/sse地址`, {
		headers: { Authorization: getToken() },
	})
	source.close = ((originalClose) => {
		return function () {
			isReceiving.value = false
			originalClose.call(this)
		}
	})(source.close)
	source.addEventListener('open', () => {
		isReceiving.value = true
	})
	// 流式接收
	source.addEventListener('message', (event) => {
		isReceiving.value = true
		// console.log(event)
		if (event.data === '[DONE]') {
			source.close()
			console.log(list.value[list.value.length - 1].value)
		} else {
			console.log('[' + event.data + ']')

			let item = list.value[list.value.length - 1]

			// 追加原始 Markdown
			item.value += event.data

			scrollToBottom()
		}
	})
	source.addEventListener('end', (e) => {
		console.log('SSE 已结束', e.data)
		source.close()
	})
	// 错误处理
	source.addEventListener('error', async (err) => {
		console.error('SSE 错误:', err)
		// console.log(JSON.parse(err))
		source.close()
		let data
		try {
			data = JSON.parse(err.data)
		} catch (e) {
			console.warn('不是合法 JSON:', err.data)
			data = {
				msg: err.data || 'sse错误',
			}
		}
		if (data.code === '401') {
			message.error(data.msg)
			gotoLogin()
		}
		if (data.code === '10009') {
			await userApi.refresh()
			newSSE(prompt)
		} else {
			list.value[list.value.length - 1].type = 'error'
			list.value[list.value.length - 1].value = data.msg || JSON.stringify(data)
			scrollToBottom()
		}
	})
}

// 处理 Enter / Shift+Enter
const handleKeyUp = (e) => {
	if (e.shiftKey) {
		// Shift+Enter 换行
		return
	}
	e.preventDefault() // 阻止换行
	enter()
}

const butClick = () => {
	if (isReceiving.value) {
		source.close()
	} else {
		enter()
	}
}
</script>

<template>
	<div class="chat h-full flex flex-col">
		<div
			ref="chatBox"
			class="mes flex-1 overflow-auto pb-6">
			<markdown-view :markdown="introMarkdown"></markdown-view>
			<div
				v-for="(v, index) in list"
				:key="index"
				class="item"
				:class="v.role">
				<div class="item-main">
					<template v-if="v.value">
						<a-alert
							v-if="v.type === 'error'"
							:message="v.value"
							type="error"
							show-icon />
						<template v-else>
							<div
								v-if="v.role === 'user'"
								class="user-message"
								v-html="v.value"></div>
							<markdown-view
								v-else
								:markdown="v.value"></markdown-view>
						</template>
					</template>
					<template v-else>
						<a-spin v-if="index === list.length - 1 && isReceiving" />
					</template>
				</div>
			</div>
		</div>
		<div class="input-box relative border border-(--ui-border)">
			<a-textarea
				class="chat-textarea"
				v-model:value="input"
				placeholder="Enter发送, Shift + Enter换行"
				:auto-size="{ minRows: 5, maxRows: 5 }"
				@keyup.enter="handleKeyUp"
				style="border: none; box-shadow: none; border-radius: 6px 6px 0 0; padding: 10px" />
			<div
				style="border-radius: 0 0 6px 6px"
				class="border-t border-(--ui-border) flex justify-end w-full p-1.25">
				<a-button
					class="send-button"
					@click="butClick">
					<sendIcon v-if="!isReceiving" />
					<stopIcon v-else />
				</a-button>
			</div>
		</div>
	</div>
</template>
<style scoped>
.chat {
	color: var(--ui-text);
	/* background: var(--ui-bg-container); */
}

.item {
	padding: 4px 0;
	display: flex;
	.item-main {
		width: 100%;
	}
}
.item.user {
	color: var(--ui-primary);
	.item-main {
		justify-items: flex-end;
	}
}
.item.ai {
	color: var(--ui-text);
}

.user-message {
	white-space: pre-wrap;
	color: var(--ui-primary);
	background: color-mix(in srgb, var(--ui-primary) 10%, var(--ui-bg-elevated));
	border: 1px solid color-mix(in srgb, var(--ui-primary) 22%, transparent);
	border-radius: 10px;
	padding: 10px 12px;
	max-width: min(100%, 720px);
}

.input-box {
	border-radius: 6px;
	overflow: hidden;
	background: var(--ui-bg-container);
	transition:
		border-color 0.2s ease,
		box-shadow 0.2s ease;
	&:hover {
		border-color: var(--ui-primary);
	}
	&:focus-within {
		border-color: var(--ui-primary);
		border-inline-end-width: 1px;
		box-shadow: 0 0 0 2px color-mix(in srgb, var(--ui-primary) 18%, transparent);
	}
}

.chat-textarea :deep(textarea) {
	background: var(--ui-bg-container);
	color: var(--ui-text);
	caret-color: var(--ui-primary);
}

.chat-textarea :deep(textarea::placeholder) {
	color: var(--ui-text-tertiary);
}

.send-button {
	border-color: var(--ui-border-secondary);
	background: var(--ui-bg-elevated);
	color: var(--ui-text);
}

.send-button:hover,
.send-button:focus {
	border-color: var(--ui-primary);
	color: var(--ui-primary);
}
</style>
