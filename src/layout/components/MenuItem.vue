<script setup>
import { computed } from 'vue'
import MenuItem from './MenuItem.vue'

const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
})

// 判断是否有多个子路由
const hasChildren = computed(() => {
	return props.item.children && props.item.children.length > 1
})

// 如果只有一个子路由，也可以直接拿出来显示
const singleChild = computed(() => {
	if (props.item.children && props.item.children.length === 1) {
		return props.item.children[0]
	}
	return null
})
</script>

<template>
	<!-- 只有一个子路由 -->
	<a-menu-item
		v-if="singleChild"
		:key="singleChild.name">
		<template #icon>
			<component
				v-if="item.meta?.icon || singleChild.meta?.icon"
				:is="item.meta?.icon || singleChild.meta.icon" />
		</template>
		{{ singleChild.meta?.title }}
	</a-menu-item>

	<!-- 多个子路由：SubMenu -->
	<a-sub-menu
		v-else-if="hasChildren"
		:key="item.name">
		<template #icon>
			<component
				v-if="item.meta?.icon"
				:is="item.meta.icon" />
		</template>
		<template #title>
			{{ item.meta?.title }}
		</template>

		<MenuItem
			v-for="child in item.children"
			:key="child.name"
			:item="child" />
	</a-sub-menu>

	<!-- 无子路由 -->
	<a-menu-item
		v-else
		:key="item.name || item.link">
		<template #icon>
			<component
				v-if="item.meta?.icon"
				:is="item.meta.icon" />
		</template>
		{{ item.meta?.title }}
	</a-menu-item>
</template>
