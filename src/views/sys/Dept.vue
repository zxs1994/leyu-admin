<script setup lang="jsx">
import { ref, watch, computed } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { deptApi as api, userApi } from '@/api'
import useCrudModal from '@/composables/useCrudModal'
import useCrudAction from '@/composables/useCrudAction'
import { UserOutlined, ApartmentOutlined, EllipsisOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { checkPermission } from '@/utils/permission'
import { useRouter } from 'vue-router'
import AddTenantModal from '@/components/AddTenantModal.vue'
import { Tag } from 'ant-design-vue'

const router = useRouter()

const title = '组织部门'
const baseCode = 'sys:dept'

const treeData = ref([])
const users = ref([])
const selectedDept = ref(null)
const showAddTenantModal = ref(false)

const modal = useCrudModal({
	api,
	initForm: () => ({
		id: null,
		parentId: null,
		name: '',
		code: '',
		sort: 0,
		leaderId: null,
		status: true,
	}),
	reload: loadTree,
})

const action = useCrudAction({
	api,
	title,
	reload: loadTree,
})

const handleDelete = (record) => action.delete(record)
const handleUpdate = (record) => {
	console.log('record', record)
	modal.openUpdate(record)
}
const handleAdd = (data) => {
	modal.openAdd()
	modal.state.formState.parentId = data.id
}

loadTree()

watch(
	() => modal.state.open,
	(val) => {
		if (val) {
			loadUsers()
		}
	},
)

// 加载部门树
async function loadTree() {
	const res = await api.tree()
	treeData.value = res.data || []
}

// 加载用户列表
async function loadUsers() {
	const res = await userApi.list()
	users.value = res.data || []
}

// 点击树节点
function onSelectDept(selectedKeys, info) {
	if (!info.node) return
	selectedDept.value = info.node
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
]

const gotoUser = (data) => {
	router.push({ name: 'User', query: { addDeptId: data.id } })
}

const actions = computed(() => {
	const list = []

	if (checkPermission(`sys:user:add`)) {
		list.push({
			key: 'addUser',
			label: '新建用户',
			onClick: gotoUser,
		})
	}

	if (checkPermission(`${baseCode}:add`)) {
		list.push({
			key: 'add',
			label: '新建子部门',
			onClick: handleAdd,
		})
	}

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
	<div class="h-full">
		<AddTenantModal
			v-if="showAddTenantModal"
			@close="showAddTenantModal = false"
			@submitEnd="loadTree" />
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
				layout="vertical">
				<a-form-item
					label="部门名称"
					name="name"
					required>
					<a-input v-model:value="modal.state.formState.name" />
				</a-form-item>
				<!-- <a-form-item
							label="部门编码"
							name="code">
							<a-input v-model:value="modal.state.formState.code" />
						</a-form-item> -->

				<a-form-item
					label="负责人"
					name="leaderId">
					<a-select
						v-model:value="modal.state.formState.leaderId"
						allow-clear
						placeholder="请选择负责人">
						<a-select-option
							v-for="u in users"
							:key="u.id"
							:value="u.id">
							{{ u.name }}
						</a-select-option>
					</a-select>
				</a-form-item>

				<a-form-item
					label="排序"
					name="sort">
					<a-input-number
						class="!w-full"
						v-model:value="modal.state.formState.sort" />
				</a-form-item>

				<!-- <a-form-item
							label="状态"
							name="status">
							<a-switch
								v-model:checked="modal.state.formState.status"
								checked-children="启用"
								un-checked-children="禁用" />
						</a-form-item> -->
			</a-form>
		</a-modal>
		<div class="flex h-full gap-4">
			<!-- 左侧部门树 -->
			<a-card
				:title="title"
				class="overflow-auto min-w-[280px] max-w-[320px] flex-shrink-0 h-full">
				<template #extra>
					<a-tooltip title="新建根部门（新租户）">
						<a-button
							size="small"
							v-permission="`platform:tenant:add`"
							@click="showAddTenantModal = true">
							<PlusOutlined />
						</a-button>
					</a-tooltip>
				</template>
				<a-tree
					:show-line="{ showLeafIcon: false }"
					blockNode
					defaultExpandAll
					v-if="treeData.length > 0"
					:tree-data="treeData"
					:field-names="{ key: 'id' }"
					@select="onSelectDept">
					<template #title="{ data }">
						<div class="flex justify-between items-center">
							<span>{{ data.name }}</span>
							<a-dropdown
								:trigger="['click']"
								v-if="actions.length > 0">
								<a-button
									@click.stop
									type="link"
									size="small">
									<EllipsisOutlined />
								</a-button>
								<template #overlay>
									<a-menu>
										<a-menu-item>
											<a-button
												type="link"
												block
												v-permission="`sys:user:add`"
												@click="gotoUser(data)"
												>新建用户</a-button
											>
										</a-menu-item>
										<a-menu-item>
											<a-button
												type="link"
												block
												v-permission="`${baseCode}:add`"
												@click="handleAdd(data)"
												>新建子部门</a-button
											>
										</a-menu-item>
										<a-menu-item>
											<a-button
												type="link"
												block
												v-permission="`${baseCode}:update`"
												@click="handleUpdate(data)"
												>编辑</a-button
											>
										</a-menu-item>

										<a-menu-divider />
										<a-menu-item>
											<a-button
												type="link"
												block
												danger
												v-permission="`${baseCode}:delete`"
												@click="handleDelete(data)"
												>删除</a-button
											>
										</a-menu-item>
									</a-menu>
								</template>
							</a-dropdown>
						</div>
					</template>
				</a-tree>
			</a-card>

			<!-- 右侧表格 -->
			<a-card class="flex-1 h-full overflow-auto">
				<!-- 标题区 -->
				<template #title>
					<div class="flex items-center gap-3">
						<ApartmentOutlined />
						<span class="font-medium">{{ selectedDept?.name || '请选择部门' }}</span>

						<!-- 状态 -->
						<!-- <a-tag
							v-if="selectedDept"
							:color="selectedDept.status ? 'green' : 'red'">
							{{ selectedDept.status ? '启用' : '停用' }}
						</a-tag> -->
					</div>
				</template>

				<!-- 右上角操作 -->
				<template #extra>
					<a-space
						:size="0"
						v-if="selectedDept">
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
								@click="action.onClick(selectedDept)">
								{{ action.label }}
							</a-button>
						</template>
					</a-space>
				</template>

				<!-- 部门信息 -->
				<div
					v-if="selectedDept"
					class="mb-3 text-sm text-gray-500">
					<span>负责人：</span>
					<span>{{ selectedDept.leaderName || '未设置' }}</span>
					<span class="mx-2">｜</span>
					<span>直属成员数：</span>
					<span>{{ selectedDept.users?.length || 0 }}</span>
				</div>

				<!-- 用户表格 -->
				<a-table
					bordered
					:dataSource="selectedDept?.users"
					:columns="columns"
					:pagination="false"
					row-key="id"
					size="small"
					:scroll="{ x: 'max-content' }" />
			</a-card>
		</div>
	</div>
</template>
