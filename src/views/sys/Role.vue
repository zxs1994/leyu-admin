<script setup>
import { ref, computed } from 'vue'
import Rules from '@/utils/rules'
import { roleApi as api, permissionApi } from '@/api'
import useCrudList from '@/composables/useCrudList'
import useCrudModal from '@/composables/useCrudModal'
import useCrudAction from '@/composables/useCrudAction'
import PermTree from '@/components/PermTree.vue'
import { checkPermission } from '@/utils/permission'

const title = '角色'
const baseCode = 'sys:role'

const list = useCrudList({ api })
const modal = useCrudModal({
	api,
	initForm: () => ({ name: '', permissionIds: [] }),
	getById: api.getById,
})
const action = useCrudAction({
	api,
	title,
	reload: list.reload,
})

const handleDelete = (record) => action.removeById(record)
const handleEdit = (record) => {
	if (tree.value.length == 0) {
		getPermissionTree()
	}
	modal.openEdit(record)
}
const handleCreate = () => modal.openCreate()

const columns = [
	{
		title: 'ID',
		dataIndex: 'id',
		align: 'center',
		width: 80,
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
	{
		title: '来源',
		dataIndex: 'source',
		align: 'center',
	},
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
	permissionApi.getPermissionTree().then((res) => {
		if (res.success) {
			tree.value = res.data
		}
	})
}

const actions = computed(() => {
	const list = []

	if (checkPermission(`${baseCode}:updateById`)) {
		list.push({
			key: 'edit',
			label: '编辑',
			onClick: handleEdit,
		})
	}

	if (checkPermission(`${baseCode}:removeById`)) {
		list.push({
			key: 'delete',
			label: '删除',
			danger: true,
			onClick: handleEdit,
		})
	}

	return list
})
</script>
<template>
	<div>
		<a-drawer
			v-model:open="modal.state.open"
			:title="modal.state.editingId ? `编辑${title}` : `新建${title}`"
			placement="right"
			:width="800">
			<a-form
				:ref="modal.formRef"
				:model="modal.state.formState"
				:rules="rules"
				layout="vertical">
				<a-form-item
					label="名称"
					name="name">
					<a-input
						v-model:value="modal.state.formState.name"
						placeholder="请输入名称" />
				</a-form-item>
				<a-form-item
					label="权限"
					name="permissionIds">
					<PermTree
						v-model="modal.state.formState.permissionIds"
						:tree="tree" />
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
					@click="modal.submit().then((ok) => ok && list.reload())"
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
						@click="handleCreate"
						v-permission="`${baseCode}:save`">
						{{ `新建${title}` }}
					</a-button>
					<a-input
						v-model:value="list.state.query.name"
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
						:color="p.del ? 'error' : 'processing'"
						:key="p.id">
						{{ p.name }}
					</a-tag>

					<a-tooltip placement="top">
						<template #title>
							<div class="flex gap-y-2 flex-wrap">
								<a-tag
									v-for="p in record.permissions.slice(3)"
									:key="p.id"
									:color="p.del ? 'error' : 'processing'">
									{{ p.name }}
								</a-tag>
							</div>
						</template>
						<a-tag v-if="record.permissions.length > 3"> +{{ record.permissions.length - 3 }} </a-tag>
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
