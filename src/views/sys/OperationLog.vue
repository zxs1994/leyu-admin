<script setup lang="jsx">
import { ref, computed, watch } from 'vue'
import { operationLogApi as api } from '@/api'
import useCrudList from '@/composables/useCrudList'
import useCrudAction from '@/composables/useCrudAction'

const title = '操作日志'
const baseCode = 'sys:operation-log'

const list = useCrudList({ api })
const action = useCrudAction({
	api,
	title,
	reload: list.reload,
})

const columns = [
	{
		title: '#',
		key: 'index',
		align: 'center',
		width: 60,
		customRender: ({ index }) => list.getIndex(index),
	},
	{
		title: '用户ID',
		dataIndex: 'userId',
	},
	{
		title: '用户名',
		dataIndex: 'username',
	},
	{
		title: 'IP地址',
		dataIndex: 'ip',
	},
	{
		title: '数据ID',
		dataIndex: 'dataId',
	},
	{
		title: '模块',
		dataIndex: 'module',
	},
	{
		title: '操作',
		dataIndex: 'action',
	},
	{
		title: '方法',
		dataIndex: 'method',
	},
	{
		title: '请求路径',
		dataIndex: 'path',
	},
	{
		title: '状态',
		dataIndex: 'status',
		customRender: ({ text }) => (
			<a-tag
				color={text ? 'success' : 'error'}
				bordered={false}>
				{text ? '成功' : '失败'}
			</a-tag>
		),
	},
	{
		title: '失败原因',
		dataIndex: 'errorMsg',
	},
	{
		title: '用户代理',
		dataIndex: 'userAgent',
	},
	{
		title: '创建时间',
		dataIndex: 'createdAt',
		align: 'center',
		fixed: 'right',
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
		<template #title>
			<a-space>
				<a-input
					v-model:value.trim="list.state.query.userId"
					:placeholder="`搜索用户ID`"
					style="width: 220px"
					allowClear
					@keydown.enter="list.search" />
				<a-select
					v-model:value="list.state.query.status"
					placeholder="状态"
					allowClear
					style="width: 100px"
					@change="list.search">
					<a-select-option :value="1">成功</a-select-option>
					<a-select-option :value="0">失败</a-select-option>
				</a-select>
				<a-button
					type="primary"
					@click="list.search">
					查询
				</a-button>
			</a-space></template
		>
	</a-table>
</template>
