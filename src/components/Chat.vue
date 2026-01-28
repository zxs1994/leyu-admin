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
	const aiMessage = { role: 'ai', value: '', value: '' }
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
	source = new SSE(
		`${import.meta.env.VITE_BASE_API}/aims/aiwork/stream/streamChatInRag?prompt=${encodeURIComponent(prompt)}`,
		{ headers: { Authorization: getToken() } },
	)
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
		isReceiving.vlaue = true
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
			<markdown-view :markdown="'## 正常渲染markdown格式'"></markdown-view>
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
								style="white-space: pre-wrap"
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
				v-model:value="input"
				placeholder="Enter发送, Shift + Enter换行"
				:auto-size="{ minRows: 5, maxRows: 5 }"
				@keyup.enter="handleKeyUp"
				style="border: none; box-shadow: none; border-radius: 6px 6px 0 0" />
			<div
				style="border-radius: 0 0 6px 6px"
				class="border border-(--ui-border) flex justify-end w-full p-1.25">
				<a-button @click="butClick">
					<sendIcon v-if="!isReceiving" />
					<stopIcon v-else />
				</a-button>
			</div>
		</div>
	</div>
</template>
<style scoped>
.item {
	padding: 4px 0;
	display: flex;
	.item-main {
		width: 100%;
	}
}
.item.user {
	color: #409eff;
	.item-main {
		justify-items: flex-end;
	}
}
.item.ai {
	color: #333;
}
.input-box {
	border-radius: 6px;
	overflow: hidden;
	&:hover {
		border-color: #4096ff;
	}
	&:focus-within {
		border-color: #4096ff;
		border-inline-end-width: 1px;
	}
}
</style>
