<script setup>
import { ref, computed } from 'vue'
import Rules from '@/utils/rules'
import { userApi as api, roleApi } from '@/api'
import useCrudList from '@/composables/useCrudList'
import useCrudModal from '@/composables/useCrudModal'
import useCrudAction from '@/composables/useCrudAction'
import { checkPermission } from '@/utils/permission'

const title = '用户'
const baseCode = 'sys:user'

const list = useCrudList({ api })
const modal = useCrudModal({
	api,
	initForm: () => ({ name: '', roleIds: [] }),
	getById: api.getById,
})
const action = useCrudAction({
	api,
	title,
	reload: list.reload,
})

const handleDelete = (record) => action.removeById(record)
const handleEdit = (record) => {
	roleList.value.length == 0 && getRoleList()
	modal.openEdit(record)
}
const handleCreate = () => modal.openCreate()
const roleList = ref([])

const getRoleList = () => {
	roleApi.list().then((res) => {
		if (res.success) {
			roleList.value = res.data
		}
	})
}

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
		title: '邮箱',
		dataIndex: 'email',
	},
	{
		title: '权限',
		dataIndex: 'roles',
		customRender: ({ text }) => text.map((i) => i.name).join(', '),
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
	email: Rules.email,
	name: Rules.name,
	password: Rules.password,
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
	<div class="user">
		<a-modal
			v-model:open="modal.state.open"
			:title="modal.state.editingId ? `编辑${title}` : `新建${title}`"
			:confirm-loading="modal.state.loading"
			width="500px"
			centered
			@ok="modal.submit().then((ok) => ok && list.reload())"
			@cancel="modal.close">
			<a-form
				:ref="modal.formRef"
				:model="modal.state.formState"
				:rules="rules"
				layout="vertical">
				<a-form-item
					v-if="!modal.state.editingId"
					label="邮箱"
					name="email">
					<a-input
						v-model:value="modal.state.formState.email"
						placeholder="请输入邮箱" />
				</a-form-item>
				<a-form-item
					label="名称"
					name="name">
					<a-input
						v-model:value="modal.state.formState.name"
						placeholder="请输入名称" />
				</a-form-item>
				<a-form-item
					label="密码"
					:rules="modal.state.editingId ? Rules.password.slice(1) : undefined"
					name="password">
					<a-input
						v-model:value="modal.state.formState.password"
						:placeholder="modal.state.editingId ? '需要修改时填入密码, 不需要修改不要填' : '请输入密码'" />
				</a-form-item>
				<a-form-item label="角色">
					<a-select
						v-model:value="modal.state.formState.roleIds"
						mode="multiple"
						@focus="getRoleList"
						placeholder="请选择角色（可选）">
						<a-select-option
							v-for="role in roleList"
							:key="role.id"
							:value="role.id">
							{{ role.name }}
						</a-select-option>
					</a-select>
				</a-form-item>
			</a-form>
		</a-modal>
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
