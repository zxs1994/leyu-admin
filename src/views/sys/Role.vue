<script setup>
import { ref, computed, watch } from 'vue'
import Rules from '@/utils/rules'
import { roleApi as api } from '@/api'
import useCrudList from '@/composables/useCrudList'
import useCrudModal from '@/composables/useCrudModal'
import useCrudAction from '@/composables/useCrudAction'
import PermTree from '@/components/PermTree.vue'
import { checkPermission } from '@/utils/permission'
import { routes } from '@/router'

const flattenRoutes = (routes) => {
	return routes.flatMap((r) => [r, ...(r.children ? flattenRoutes(r.children) : [])])
}

const allRoutes = flattenRoutes(routes)

const title = '角色'
const baseCode = 'sys:role'

const list = useCrudList({ api })
const modal = useCrudModal({
	api,
	initForm: () => ({ name: '', permissionIds: [] }),
	reload: list.reload,
})
const action = useCrudAction({
	api,
	title,
	reload: list.reload,
})

const handleDelete = (record) => action.delete(record)
const handleUpdate = (record) => {
	modal.openUpdate(record)
}
const handleAdd = () => {
	modal.openAdd()
}

watch(
	() => modal.state.open,
	(val) => {
		if (val) {
			getPermissionTree()
		}
	},
)

const columns = [
	{
		title: '#',
		key: 'index',
		align: 'center',
		width: 60,
		customRender: ({ index }) => list.getIndex(index),
	},
	{
		title: '名称',
		dataIndex: 'name',
	},
	{
		title: '编码',
		dataIndex: 'code',
	},
	{
		title: '权限',
		dataIndex: 'permissions',
	},
	// {
	// 	title: '来源',
	// 	dataIndex: 'source',
	// 	align: 'center',
	// },
	{
		title: '创建时间',
		dataIndex: 'createdAt',
		align: 'center',
	},
	{
		title: '修改时间',
		dataIndex: 'updatedAt',
		align: 'center',
	},
	{
		title: '操作',
		dataIndex: 'action',
		align: 'center',
		fixed: 'right',
	},
]

const rules = {
	name: Rules.name,
	permissionIds: [
		{
			required: true,
			message: '请选择权限',
			trigger: ['blur'],
		},
	],
}

const tree = ref([])
const getPermissionTree = () => {
	api.getPermissionTree().then((res) => {
		if (res.success) {
			tree.value = res.data
		}
	})
}

const actions = computed(() => {
	const list = []

	if (checkPermission(`${baseCode}:update`)) {
		list.push({
			key: 'update',
			label: '编辑',
			onClick: handleUpdate,
		})
	}

	if (checkPermission(`${baseCode}:delete`)) {
		list.push({
			key: 'delete',
			label: '删除',
			danger: true,
			onClick: handleDelete,
		})
	}

	return list
})
</script>
<template>
	<div>
		<a-drawer
			v-model:open="modal.state.open"
			:title="modal.state.updateId ? `编辑${title}` : `新建${title}`"
			placement="right"
			:width="800">
			<a-form
				:ref="modal.formRef"
				:model="modal.state.formState"
				:rules="rules"
				layout="vertical">
				<a-form-item
					label="名称"
					name="name"
					hasFeedback>
					<a-input
						v-model:value.trim="modal.state.formState.name"
						placeholder="请输入名称" />
				</a-form-item>
				<a-form-item
					label="权限"
					name="permissionIds"
					hasFeedback>
					<div class="max-h-150 overflow-auto border border-(--ui-border) p-2 rounded-md">
						<PermTree
							v-model="modal.state.formState.permissionIds"
							:tree="tree"
							:allRoutes="allRoutes" />
					</div>

				</a-form-item>
			</a-form>
			<template #extra>
				<a-button
					style="margin-right: 8px"
					@click="modal.close"
					>取消</a-button
				>
				<a-button
					type="primary"
					:loading="modal.state.loading"
					@click="modal.submit"
					>确定</a-button
				>
			</template>
		</a-drawer>
		<a-table
			bordered
			:dataSource="list.state.dataSource"
			:columns="columns"
			:loading="list.state.loading"
			:pagination="list.state.pagination"
			:scroll="{ x: 'max-content' }"
			@change="list.handleTableChange">
			<template #title
				><a-space>
					<a-button
						type="primary"
						@click="handleAdd"
						v-permission="`${baseCode}:add`">
						{{ `新建${title}` }}
					</a-button>
					<a-input
						v-model:value.trim="list.state.query.name"
						:placeholder="`搜索${title}名称`"
						style="width: 185px"
						allowClear
						@keydown.enter="list.search" />
					<a-button
						type="primary"
						@click="list.search">
						查询
					</a-button>
				</a-space></template
			>
			<template #bodyCell="{ column, record }">
				<template v-if="column.dataIndex === 'permissions'">
					<a-tag
						v-for="p in record.permissions.slice(0, 3)"
						:bordered="false"
						:color="p.status ? 'processing' : 'error'"
						:key="p.id">
						{{ p.name }}
					</a-tag>

					<a-tooltip placement="top">
						<template #title>
							<div class="flex gap-y-2 flex-wrap">
								<a-tag
									v-for="p in record.permissions.slice(3)"
									:key="p.id"
									:bordered="false"
									:color="p.status ? 'processing' : 'error'"">
									{{ p.name }}
								</a-tag>
							</div>
						</template>
						<a-tag
							class="cursor-pointer"
							v-if="record.permissions.length > 3"
							:bordered="false">
							+{{ record.permissions.length - 3 }}
						</a-tag>
					</a-tooltip>
				</template>
				<template v-if="column.dataIndex === 'action'">
					<a-space :size="0">
						<template #split>
							<a-divider type="vertical" />
						</template>

						<template
							v-for="action in actions"
							:key="action.key">
							<a-button
								size="small"
								type="link"
								:danger="action.danger"
								@click="action.onClick(record)">
								{{ action.label }}
							</a-button>
						</template>
					</a-space>
				</template>
			</template>
		</a-table>
	</div>
</template>
