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
	allRoutes: {
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

const ACTION_REG = /:(item|add|update|delete)$/

const onChildChange = (item) => {
	const next = [...props.modelValue]
	const index = next.findIndex((i) => i === item.id)

	// 勾选或取消当前节点
	if (item.checked && index === -1) next.push(item.id)
	if (!item.checked && index !== -1) next.splice(index, 1)

	// ⭐ 判断操作权限是否需要补齐页面权限
	const pageMatch = ACTION_REG.test(item.code ?? '')

	if (item.checked && pageMatch) {
		// 在路由里找 perm 前缀匹配的页面/树/其他权限
		const matchedRoute = props.allRoutes.find((r) => {
			const perm = r.meta?.perm
			if (!perm) return false
			// 操作权限前缀匹配页面权限
			const opPrefix = item.code.replace(ACTION_REG, '')
			return perm.startsWith(opPrefix)
		})
		console.log(matchedRoute)
		if (matchedRoute) {
			// 在树里找对应节点
			const node = props.tree.find((i) => i.code === matchedRoute.meta.perm)
			if (node && !next.includes(node.id)) {
				next.push(node.id)
			}
		}
	}

	emit('update:modelValue', next)
}
</script>

<template>
	<ul class="perm-tree flex flex-wrap gap-x-4 px-3 py-2 border-l border-(--ui-border) bg-(--ui-bg-layout)">
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
							<div><span class="text-gray-200">编码：</span>{{ item.code }}</div>
							<div><span class="text-gray-200">级别：</span>{{ enums.all.authLevel?.find((i) => i.code == item.authLevel)?.desc }}</div>
							<div><span class="text-gray-200">请求：</span>{{ item.method }} {{ item.path }}</div>
							<div><span class="text-gray-200">状态：</span>{{ item.status ? '启用' : '停用' }}</div>
						</div>
					</template>

					<!-- 节点标签 -->
					<div class="flex items-center gap-2 text-sm">
						<label class="flex items-center cursor-pointer select-none">
							<input
								type="checkbox"
								v-model="item.checked"
								:disabled="!item.parentId"
								@change="onChildChange(item)"
								class="mr-1 cursor-pointer" />
							<a-badge :dot="!item.status">
								<span>{{ item.name }}</span>
							</a-badge>
						</label>

						<!-- 接口信息 -->
						<span
							class="text-xs text-(--ui-text-tertiary) truncate"
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
				:allRoutes="props.allRoutes"
				:tree="item.children" />
		</li>
	</ul>
</template>
