<script setup lang="jsx">
import { ref, h } from 'vue'
import Rules from '@/utils/rules'
import { permissionApi as api } from '@/api'
import useCrudList from '@/composables/useCrudList'
import useCrudModal from '@/composables/useCrudModal'
import useCrudAction from '@/composables/useCrudAction'
import { useEnumsStore } from '@/stores/enums'
import { Badge } from 'ant-design-vue'
import { Tag } from 'ant-design-vue'

const enums = useEnumsStore()

const title = '权限'

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
const handleUpdate = (record) => modal.openUpdate(record)
const handleAdd = () => modal.openAdd()

const columns = [
	{
		title: 'ID',
		dataIndex: 'id',
		align: 'center',
		width: 80,
	},
	{
		title: '父ID',
		dataIndex: 'parentId',
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
		customRender: ({ text, record }) => {
			return h(Badge, {
				status: record.status ? 'processing' : 'error',
				text,
			})
		},
	},
	{
		title: '请求方式',
		dataIndex: 'method',
	},
	{
		title: '路径',
		dataIndex: 'path',
	},
	{
		title: '模块名称',
		dataIndex: 'moduleName',
	},
	{
		title: '访问级别',
		dataIndex: 'authLevel',
		customRender: ({ text }) => {
			const level = enums.all.authLevel?.find((i) => i.code == text)
			return level ? (
				<Tag
					bordered={false}
					color={level.color}>
					{level.desc}
				</Tag>
			) : null
		},
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
	// {
	// 	title: '操作',
	// 	dataIndex: 'action',
	// 	align: 'center',
	// 	fixed: 'right',
	// },
]

const rules = {
	name: Rules.name,
}
</script>
<template>
	<div>
		<a-modal
			v-model:open="modal.state.open"
			:title="modal.state.updateId ? `编辑${title}` : `新建${title}`"
			:confirm-loading="modal.state.loading"
			width="500px"
			centered
			@ok="modal.submit().then((ok) => ok && list.reload())"
			@cancel="modal.close">
			<a-form
				:ref="modal.formRef"
				:model="modal.state.formState"
				:rules="[]"
				layout="vertical">
				<a-form-item
					label="名称"
					name="name">
					<a-input
						v-model:value="modal.state.formState.name"
						placeholder="请输入名称" />
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
						<a-button
							size="small"
							type="link"
							@click="handleUpdate(record)"
							v-permission="'sys:user:update'">
							编辑
						</a-button>
					</a-space>
				</template>
			</template>
		</a-table>
	</div>
</template>
