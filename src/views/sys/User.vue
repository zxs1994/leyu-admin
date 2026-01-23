<script setup lang="jsx">
import { ref, computed, watch } from 'vue'
import Rules from '@/utils/rules'
import { userApi as api, roleApi, deptApi } from '@/api'
import useCrudList from '@/composables/useCrudList'
import useCrudModal from '@/composables/useCrudModal'
import useCrudAction from '@/composables/useCrudAction'
import { checkPermission } from '@/utils/permission'
import { Tag, Space } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const title = '用户'
const baseCode = 'sys:user'

const list = useCrudList({ api })
const modal = useCrudModal({
	api,
	initForm: () => ({ email: '', name: '', deptId: list.route.query.addDeptId, roleIds: [], status: true }),
	reload: list.reload,
})
const action = useCrudAction({
	api,
	title,
	reload: list.reload,
})

const handleDelete = (record) => action.delete(record)
const handleUpdate = (record) => modal.openUpdate(record)
const handleAdd = () => modal.openAdd()

watch(
	() => modal.state.open,
	(val) => {
		if (val) {
			getRoleList()
			getDeptList()
		}
	},
)

if (list.route.query.addDeptId) {
	handleAdd()
}

const roleList = ref([])

const getRoleList = () => {
	roleApi.list().then((res) => {
		if (res.success) {
			roleList.value = res.data
		}
	})
}

const deptTree = ref([])
const getDeptList = () => {
	deptApi.tree().then((res) => {
		if (res.success) {
			deptTree.value = res.data
			// 新建时默认选择第一个部门（非平台用户）
			if (!modal.state.updateId && !userStore.userInfo.platformUser) {
				modal.state.formState.deptId = modal.state.formState.deptId || res.data[0]?.id
			}
		}
	})
}

const columns = [
	// {
	// 	title: 'ID',
	// 	dataIndex: 'id',
	// 	align: 'center',
	// 	width: 80,
	// },
	{
		title: '#',
		key: 'index',
		align: 'center',
		width: 60,
		customRender: ({ index }) => index + 1,
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
		title: '组织部门',
		dataIndex: 'deptName',
		customRender: ({ text }) => (
			<Tag
				bordered={false}
				color={text ? 'default' : 'red'}>
				{text || '平台'}
			</Tag>
		),
	},
	{
		title: '角色',
		dataIndex: 'roles',
		customRender: ({ text = [] }) => (
			<Space
				size={4}
				wrap>
				{text.length
					? text.map((item) => (
							<Tag
								bordered={false}
								key={item.id}>
								{item.name}
							</Tag>
						))
					: ''}
			</Space>
		),
	},
	{
		title: '状态',
		dataIndex: 'status',
		align: 'center',
		customRender: ({ text }) => (
			<Tag
				color={text ? 'success' : 'error'}
				bordered={false}>
				{text ? '启用' : '禁用'}
			</Tag>
		),
	},
	{
		title: '登录登出',
		dataIndex: 'tokenVersion',
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
	<div class="user">
		<a-modal
			v-model:open="modal.state.open"
			:title="modal.state.updateId ? `编辑${title}` : `新建${title}`"
			:confirm-loading="modal.state.loading"
			width="500px"
			centered
			@ok="modal.submit"
			@cancel="modal.close">
			<a-form
				:ref="modal.formRef"
				:model="modal.state.formState"
				:rules="rules"
				layout="vertical">
				<a-form-item
					label="邮箱"
					name="email"
					hasFeedback>
					<a-input
						:disabled="!!modal.state.updateId"
						v-model:value.trim="modal.state.formState.email"
						placeholder="请输入邮箱" />
				</a-form-item>
				<a-form-item
					label="名称"
					name="name"
					hasFeedback>
					<a-input
						v-model:value.trim="modal.state.formState.name"
						placeholder="请输入名称" />
				</a-form-item>
				<a-form-item
					label="密码"
					:rules="modal.state.updateId ? Rules.password.slice(1) : undefined"
					name="password"
					hasFeedback>
					<a-input
						v-model:value="modal.state.formState.password"
						:placeholder="modal.state.updateId ? '需要修改时填入密码, 不需要修改不要填' : '请输入密码'" />
				</a-form-item>
				<a-form-item
					label="组织部门"
					name="deptId"
					:rules="!userStore.userInfo.platformUser ? [{ required: true, message: '请选择组织部门' }] : undefined"
					hasFeedback>
					<a-tree-select
						v-model:value="modal.state.formState.deptId"
						:fieldNames="{ label: 'name', value: 'id', children: 'children' }"
						placeholder="请选择组织部门"
						:tree-line="{ showLeafIcon: false }"
						:tree-data="deptTree"
						treeDefaultExpandAll>
					</a-tree-select>
				</a-form-item>

				<a-form-item
					label="角色"
					hasFeedback>
					<a-select
						:disabled="modal.state.record.source == 'SYSTEM'"
						v-model:value="modal.state.formState.roleIds"
						mode="multiple"
						placeholder="请选择角色（可选）">
						<a-select-option
							v-for="i in roleList"
							:key="i.id"
							:value="i.id">
							{{ i.name }}
						</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item
					label="状态"
					name="status"
					hasFeedback>
					<a-switch
						:disabled="modal.state.record.source == 'SYSTEM'"
						checked-children="启用"
						un-checked-children="禁用"
						v-model:checked="modal.state.formState.status" />
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
