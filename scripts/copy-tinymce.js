import fs from 'fs'

import path from 'path'

const targetDir = path.resolve('public/tinymce')
const langFile = path.resolve('public/tinymce/langs/zh_CN.js')

// 判断是否需要复制（如果 tinymce.min.js 和 zh_CN.js 都存在，就跳过）
const shouldCopy = !fs.existsSync(path.join(targetDir, 'tinymce.min.js')) ||
  !fs.existsSync(langFile)

if (shouldCopy) {
  console.log('📦 Copying TinyMCE to public/tinymce...')
  fs.mkdirSync(path.join(targetDir, 'langs'), {
    recursive: true
  })

  fs.cpSync('node_modules/tinymce', targetDir, {
    recursive: true
  })
  fs.cpSync('node_modules/tinymce-i18n/langs7/zh_CN.js', langFile)

  console.log('✅ TinyMCE copied.')
} else {
  console.log('🚫 TinyMCE already exists in public/, skipping copy.')
}
