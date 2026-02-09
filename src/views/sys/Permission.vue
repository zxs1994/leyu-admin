<script setup lang="jsx">
import { permissionApi as api } from '@/api'
import useCrudList from '@/composables/useCrudList'
import { useEnumsStore } from '@/stores/enums'

const enums = useEnumsStore()

const title = '权限'

const list = useCrudList({ api })

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
		customRender: ({ text, record }) => (
			<a-badge
				status={record.status ? 'processing' : 'error'}
				text={text}
			/>
		),
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
				<a-tag
					bordered={false}
					color={level.color}>
					{level.desc}
				</a-tag>
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
]
</script>
<template>
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
	</a-table>
</template>
