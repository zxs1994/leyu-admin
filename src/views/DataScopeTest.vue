<script setup lang="jsx">
import { ref, computed, watch } from 'vue'
import Rules from '@/utils/rules'
import { dataScopeTestApi as api } from '@/api'
import useCrudList from '@/composables/useCrudList'
import useCrudModal from '@/composables/useCrudModal'
import useCrudAction from '@/composables/useCrudAction'
import { checkPermission } from '@/utils/permission'

const title = '数据权限测试'
const baseCode = 'data-scope-test'

const list = useCrudList({ api })
const modal = useCrudModal({
	api,
	initForm: () => ({ name: '' }),
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
		title: '部门ID',
		dataIndex: 'deptId',
	},
	{
		title: '创建者ID',
		dataIndex: 'creatorId',
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
			<template #title>
				<a-space>
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
