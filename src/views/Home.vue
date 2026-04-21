<script setup>
import { computed, onMounted, ref } from 'vue'
import dayjs from 'dayjs'

const repoStates = ref([
	createRepoState({
		key: 'java',
		label: 'java',
		title: 'leyu',
		description: 'Spring Boot + MyBatis-Plus',
		repo: 'zxs1994/leyu',
		accentColor: 'var(--ui-info)',
	}),
	createRepoState({
		key: 'vue',
		label: 'vue',
		title: 'leyu-admin',
		description: 'Vue 3 + Vite + Ant Design Vue',
		repo: 'zxs1994/leyu-admin',
		accentColor: 'var(--ui-warning)',
	}),
])

const totalCommits = computed(() => repoStates.value.reduce((count, repo) => count + repo.commits.length, 0))
const loadingCount = computed(() => repoStates.value.filter((repo) => repo.loading).length)

const pageStyle = {
	backgroundColor: 'var(--ui-bg-layout)',
	color: 'var(--ui-text)',
}

const heroStyle = {
	backgroundColor: 'var(--ui-bg-container)',
	borderColor: 'var(--ui-border-secondary)',
}

const heroGlowStyle = {
	background: [
		'radial-gradient(circle at top left, var(--ui-primary), transparent 30%)',
		'radial-gradient(circle at 85% 20%, var(--ui-warning), transparent 26%)',
		'linear-gradient(180deg, transparent, transparent)',
	].join(','),
	opacity: 0.16,
}

const cardStyle = {
	backgroundColor: 'var(--ui-bg-container)',
	borderColor: 'var(--ui-border-secondary)',
}

const sectionStyle = {
	backgroundColor: 'var(--ui-bg-elevated)',
	borderColor: 'var(--ui-border-secondary)',
}

const commitItemStyle = {
	backgroundColor: 'var(--ui-bg-layout)',
	borderColor: 'var(--ui-border-secondary)',
}

const textSecondaryStyle = {
	color: 'var(--ui-text-secondary)',
}

const textTertiaryStyle = {
	color: 'var(--ui-text-tertiary)',
}

const linkStyle = {
	color: 'var(--ui-primary)',
}

function getRepoAccentStyle(repoState) {
	return {
		background: `linear-gradient(90deg, ${repoState.accentColor}, transparent)`,
		opacity: 0.22,
	}
}

function getRepoTagStyle(repoState) {
	return {
		color: repoState.accentColor,
		borderColor: repoState.accentColor,
		backgroundColor: 'transparent',
	}
}

function createRepoState(config) {
	return {
		...config,
		loading: false,
		errorMessage: '',
		commits: [],
		apiBase: `https://api.github.com/repos/${config.repo}`,
		repoUrl: `https://github.com/${config.repo}`,
		commitsUrl: `https://github.com/${config.repo}/commits`,
	}
}

function formatDateTime(dateTime) {
	if (!dateTime) {
		return '--'
	}
	return dayjs(dateTime).format('YYYY-MM-DD HH:mm')
}

function normalizeCommit(item, fallbackUrl) {
	const message = item?.commit?.message?.split('\n')[0]?.trim() || '未提供提交说明'
	return {
		sha: item.sha,
		shortSha: item.sha?.slice(0, 7) || 'unknown',
		message,
		author: item?.commit?.author?.name || item?.author?.login || 'unknown',
		date: item?.commit?.author?.date || '',
		htmlUrl: item?.html_url || fallbackUrl,
	}
}

async function requestGithubJson(repoState, path) {
	const response = await fetch(`${repoState.apiBase}${path}`, {
		headers: {
			Accept: 'application/vnd.github+json',
		},
	})

	if (!response.ok) {
		if (response.status === 403) {
			throw new Error('GitHub API 访问频率受限，请稍后刷新重试。')
		}
		throw new Error(`${repoState.label} 提交记录加载失败。`)
	}

	return response.json()
}

async function loadRepoActivity(repoState) {
	repoState.loading = true
	repoState.errorMessage = ''

	try {
		const commitList = await requestGithubJson(repoState, '/commits?per_page=5')
		repoState.commits = Array.isArray(commitList) ? commitList.map((item) => normalizeCommit(item, repoState.commitsUrl)) : []
	} catch (error) {
		repoState.errorMessage = error instanceof Error ? error.message : `${repoState.label} 提交记录加载失败。`
		repoState.commits = []
	} finally {
		repoState.loading = false
	}
}

async function loadAllGithubActivity() {
	await Promise.all(repoStates.value.map((repoState) => loadRepoActivity(repoState)))
}

onMounted(() => {
	loadAllGithubActivity()
})
</script>

<template>
	<div
		class="min-h-full"
		:style="pageStyle">
		<div class="mx-auto flex flex-col gap-6">
			<section
				class="overflow-hidden rounded-[10px] border shadow-[0_24px_70px_-28px_rgba(15,23,42,0.28)] backdrop-blur-xl"
				:style="heroStyle">
				<div class="relative">
					<div
						class="absolute inset-0"
						:style="heroGlowStyle"></div>
					<div class="relative flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-start lg:justify-between lg:p-10">
						<div class="max-w-3xl">
							<p
								class="mb-3 text-xs font-semibold uppercase tracking-[0.26em]"
								:style="linkStyle">
								Project Activity
							</p>
							<h1 class="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
								{{ $appName }}
								<span
									class="ml-3 inline-block text-lg font-semibold sm:text-xl"
									:style="textSecondaryStyle"
									>v{{ $appVersion }}</span
								>
							</h1>
							<p
								class="mt-4 max-w-2xl text-sm leading-7 sm:text-base"
								:style="textSecondaryStyle">
								乐羽, 不断演进
							</p>
						</div>

						<div class="flex flex-wrap items-center gap-3 lg:max-w-xs lg:justify-end">
							<a-button
								type="primary"
								@click="loadAllGithubActivity"
								>刷新全部</a-button
							>
						</div>
					</div>
				</div>
			</section>

			<section class="grid grid-cols-1 gap-6 xl:grid-cols-2">
				<article
					v-for="repoState in repoStates"
					:key="repoState.key"
					class="overflow-hidden rounded-[10px] border shadow-[0_20px_60px_-32px_rgba(15,23,42,0.28)]"
					:style="cardStyle">
					<div
						class="relative border-b px-6 py-5 sm:px-7"
						:style="{ borderColor: 'var(--ui-border-secondary)' }">
						<div
							class="absolute inset-x-0 top-0 h-full"
							:style="getRepoAccentStyle(repoState)"></div>
						<div class="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
							<div class="space-y-3">
								<div class="flex flex-wrap items-center gap-3">
									<div
										class="inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]"
										:style="getRepoTagStyle(repoState)">
										{{ repoState.label }}
									</div>
									<span
										class="text-xs font-medium"
										:style="textTertiaryStyle">
										{{ repoState.repo }}
									</span>
								</div>
								<div class="space-y-1.5">
									<h2 class="text-2xl font-bold tracking-tight">{{ repoState.title }}</h2>
									<p
										class="max-w-xl text-sm leading-6"
										:style="textSecondaryStyle">
										{{ repoState.description }}
									</p>
								</div>
							</div>
							<div class="relative flex flex-wrap gap-2 sm:justify-end">
								<a-button
									size="small"
									@click="loadRepoActivity(repoState)"
									>刷新</a-button
								>
							</div>
						</div>
					</div>

					<div class="p-6 sm:p-7">
						<section
							class="rounded-[10px] border p-5"
							:style="sectionStyle">
							<div class="mb-4 flex items-center justify-between gap-3">
								<div>
									<h3 class="text-base font-semibold">最近提交</h3>
									<p
										class="mt-1 text-xs"
										:style="textTertiaryStyle">
										展示最近 5 次提交，便于快速浏览当前迭代轨迹。
									</p>
								</div>
								<a
									:href="repoState.commitsUrl"
									target="_blank"
									rel="noreferrer"
									class="text-sm font-medium transition hover:opacity-80"
									:style="linkStyle"
									>GitHub</a
								>
							</div>

							<a-skeleton
								v-if="repoState.loading"
								active
								:paragraph="{ rows: 6 }" />

							<template v-else>
								<a-alert
									v-if="repoState.errorMessage"
									type="warning"
									show-icon
									:message="repoState.errorMessage" />

								<a-empty
									v-else-if="!repoState.commits.length"
									description="暂无提交记录"
									class="[&_.ant-empty-description]:text-(--ui-text-tertiary)" />

								<div
									v-else
									class="space-y-3">
									<a
										v-for="item in repoState.commits"
										:key="item.sha"
										:href="item.htmlUrl"
										target="_blank"
										rel="noreferrer"
										class="group block rounded-[10px] border p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-22px_rgba(15,23,42,0.2)]"
										:style="commitItemStyle">
										<div class="flex items-start justify-between gap-3">
											<p class="text-sm font-semibold leading-6">
												{{ item.message }}
											</p>
											<a-tag color="blue">{{ item.shortSha }}</a-tag>
										</div>
										<div
											class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs"
											:style="textTertiaryStyle">
											<span>{{ item.author }}</span>
											<span>{{ formatDateTime(item.date) }}</span>
										</div>
									</a>
								</div>
							</template>
						</section>
					</div>
				</article>
			</section>
		</div>
	</div>
</template>
