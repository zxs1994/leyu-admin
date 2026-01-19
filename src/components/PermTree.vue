<script setup>
import { useEnumsStore } from '@/stores/enums'
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons-vue'
import { watchEffect, computed } from 'vue'
const enums = useEnumsStore()
const props = defineProps({
	tree: {
		type: Array,
		required: true,
	},
	modelValue: {
		type: Array,
		required: true,
	},
})

const emit = defineEmits(['update:modelValue'])

// 本地代理
const modelValueLocal = computed({
	get: () => props.modelValue,
	set: (val) => emit('update:modelValue', val),
})

watchEffect(() => {
	props.tree.forEach((i) => {
		// console.log(props.modelValue)
		i.checked = props.modelValue?.includes(i.id)
	})
})

// 切换折叠状态
const toggleCollapse = (item) => {
	if (item.children && item.children.length) {
		item.collapsed = !item.collapsed
	}
}

const onChildChange = (item) => {
	const next = [...props.modelValue]
	const index = next.findIndex((i) => i === item.id)

	// 勾选或取消当前节点
	if (item.checked && index === -1) next.push(item.id)
	if (!item.checked && index !== -1) next.splice(index, 1)

	// ⭐ 补齐 page 权限
	const pageMatch =
		item.code?.endsWith(':save') || item.code?.endsWith(':updateById') || item.code?.endsWith(':removeById')

	if (item.checked && pageMatch) {
		const pageCode = item.code.replace(/:(save|updateById|removeById)$/, ':page')
		console.log(pageCode)
		const page = props.tree.find((i) => i.code === pageCode)
		if (page) {
			if (!next.includes(page.id)) next.push(page.id)
		}
	}

	emit('update:modelValue', next)
}
</script>

<template>
	<ul class="perm-tree flex flex-wrap gap-x-4 px-3 py-2 border-l border-gray-300 bg-gray-50">
		<li
			v-for="item in tree"
			:key="item.id"
			class="perm-node px-3 py-2"
			:class="item.children && item.children.length ? 'basis-full' : ''">
			<div class="flex items-center">
				<!-- 折叠图标，仅有子节点显示 -->
				<span
					v-if="item.children && item.children.length"
					class="cursor-pointer"
					style="transform: translateX(-50%)"
					@click="toggleCollapse(item)">
					<CaretDownOutlined v-if="!item.collapsed" />
					<CaretRightOutlined v-else />
				</span>
				<!-- 权限信息 Tooltip -->
				<a-tooltip
					placement="top"
					overlay-class-name="perm-tooltip">
					<template #title>
						<div class="text-xs leading-5 space-y-0.5 max-w-xs">
							<div><span class="text-gray-400">编码：</span>{{ item.code }}</div>
							<div>
								<span class="text-gray-400">级别：</span
								>{{ enums.all.authLevel?.find((i) => i.code == item.authLevel)?.desc }}
							</div>
							<div><span class="text-gray-400">请求：</span>{{ item.method }} {{ item.path }}</div>
							<div><span class="text-gray-400">状态：</span>{{ item.del ? '失效' : '有效' }}</div>
						</div>
					</template>

					<!-- 节点标签 -->
					<div class="flex items-center gap-2 text-sm">
						<label class="flex items-center cursor-pointer select-none">
							<input
								type="checkbox"
								v-model="item.checked"
								@change="onChildChange(item)"
								class="mr-1 cursor-pointer" />
							<a-badge :dot="item.del">
								<span class="font-medium">{{ item.name }}</span>
							</a-badge>
						</label>

						<!-- 接口信息 -->
						<span
							class="text-xs text-gray-500 truncate"
							v-if="item.children && item.children.length">
							{{ item.method }} {{ item.path }}
						</span>
					</div>
				</a-tooltip>
			</div>

			<!-- 子节点 -->
			<PermTree
				v-model="modelValueLocal"
				v-if="item.children && item.children.length && !item.collapsed"
				:tree="item.children" />
		</li>
	</ul>
</template>
