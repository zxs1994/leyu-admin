<template>
	<Editor
		v-model="content"
		:tinymce-script-src="'/tinymce/tinymce.min.js'"
		:init="initOptions"
		:disabled="props.readonly"
		initial-value="Welcome to TinyMCE!"
		:class="{ 'editor-readonly': props.readonly }" />
</template>
<script setup>
import { ref, watch } from 'vue'
import Editor from '@tinymce/tinymce-vue'
// import { uploadFile } from '@/utils/cos'
const props = defineProps({
	modelValue: String,
	readonly: { type: Boolean, default: false },
	height: { type: [Number, String], default: 'calc(100vh - 65px - 24px - 40px - 16px - 24px)' },
	placeholder: String,
})
const emit = defineEmits(['update:modelValue'])

const content = ref(props.modelValue)

watch(
	() => props.modelValue,
	(val) => {
		if (val !== content.value) content.value = val
	}
)
watch(content, (val) => {
	emit('update:modelValue', val)
})

function applyImageStyle(img) {
	img.style.maxWidth = '100%'
	// img.style.maxHeight = '400px'
	img.style.height = 'auto'
	img.style.display = 'block'
	// img.style.margin = '0 auto'
}

const initOptions = {
	license_key: 'gpl', // 👈 避免授权提示
	promotion: false, // 👈 隐藏右上角 “Get all features”
	branding: false, // 👈 隐藏 “Build with TinyMCE”
	language: 'zh_CN',
	// language_url: '/tinymce/langs/zh_CN.js',
	// skin_url: '/tinymce/skins/ui/oxide',
	// content_css: '/tinymce/skins/content/default/content.css',
	height: props.height,
	menubar: true,
	plugins: [
		// 基本功能
		'advlist', // 高级列表样式（如编号、圆点等）
		'autolink', // 自动识别链接
		'lists', // 有序/无序列表支持
		'link', // 插入/编辑链接
		'image', // 插入/编辑图片
		'media', // 插入视频/音频
		'charmap', // 特殊字符插入（©®♥等）
		'anchor', // 锚点，页面内跳转
		'searchreplace', // 查找和替换文本
		'visualblocks', // 显示块级元素边框（用于查看结构）
		'code', // HTML源码编辑视图
		'fullscreen', // 全屏编辑模式
		'insertdatetime', // 插入当前日期和时间
		'table', // 插入和编辑表格
		'preview', // 预览效果
		'wordcount', // 字数、词数、段落统计
		'help', // 帮助菜单
		'codesample', // 插入代码块（语法高亮）

		// 增强功能
		'emoticons', // 插入表情符号
		// 'emojis', // 插入 emoji（更现代的表情支持）
		// 'spellchecker', // 拼写检查（需要后台支持）
		'quickbars', // 快速工具条（悬浮格式工具）
		// 'template', // 内容模板功能
		// 'toc', // 目录生成（基于标题结构）
		// 'directionality', // 设置文本方向（LTR 或 RTL）
		'pagebreak', // 插入分页符（适用于打印）
		// 'noneditable', // 设置不可编辑区域
		// 'textpattern', // 自动文本模式（如输入 `--` 自动变长破折号）
		// 'mentions', // @提及功能（需配合服务端支持）
	],
	toolbar: 'undo redo | styles | bold italic forecolor codesample image link preview fullscreen', // save
	// contextmenu: 'link',
	placeholder: props.readonly ? '' : props.placeholder || '请输入内容...',
	// images_upload_handler: (blobInfo, progress) => {
	// 	// oxlint-disable-next-line
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			const file = blobInfo.blob()
	// 			const onProgress = (data) => {
	// 				const percent = Math.floor(data.percent || 0) * 100
	// 				progress(percent)
	// 			}

	// 			const res = await uploadFile({ file, onProgress })

	// 			if (!res || !res.tempUrl) {
	// 				reject({ message: '上传失败：返回 URL 无效', remove: true })
	// 				return
	// 			}
	// 			resolve(res.tempUrl)
	// 		} catch (err) {
	// 			console.error('图片上传失败:', err)
	// 			reject({
	// 				message: '图片上传失败，请重试',
	// 				remove: true,
	// 			})
	// 		}
	// 	})
	// },
}
</script>
