import {
  execSync
} from 'child_process'
import readline from 'readline'
import sendMail from './sendMail.js'

const mode = process.argv[2] || 'production'

const host = 'root@8.159.136.15'
const target = '/var/www/leyu-admin'

// 1️⃣ 检查 Git 工作区是否干净
// 用于保存交互式获取的 commitMsg
let commitMsg = ''

// 封装为 Promise 以便异步等待
function askCommitMsg() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    rl.question('请输入 commit 信息（回车只部署）: ', (answer) => {
      rl.close()
      resolve(answer && answer.trim() ? answer.trim() :
        '')
    })
  })
}

// 用自执行异步函数包裹主流程
(async () => {
  try {
    const status = execSync('git status --porcelain').toString().trim()
    if (status) {
      console.log('📌 检测到未提交改动，自动提交...')
      commitMsg = await askCommitMsg()
      if (commitMsg) {
        execSync('git add .')
        execSync(`git commit -m "${commitMsg}"`)
        console.log('✅ 已提交改动（等待版本号 commit 一并推送）')
      } else {
        console.log('⚠️ 未输入 commit 信息，跳过提交')
      }
    }
  } catch (err) {
    console.error('❌ Git 检查失败', err)
  }

  // 2️⃣ 升级版本号
  if (commitMsg) {
    try {
      // 使用规范化 commit 信息升级版本号
      const newVersion = execSync('npm version patch').toString().trim()

      // 推送版本号 commit 和 tag
      execSync('git push')
      execSync('git push --tags')

      console.log(`✅ 已升级版本号到 ${newVersion}`)
    } catch (err) {
      console.error('❌ 版本升级失败', err)
      process.exit(1)
    }
  }


  // 3️⃣ 打包项目
  try {
    console.log(`🚀 Building with mode: ${mode}`)
    execSync(`vite build --mode ${mode}`, {
      stdio: 'inherit',
    })
  } catch (err) {
    console.error('❌ 打包失败', err)
    process.exit(1)
  }

  function hasCommand(cmd) {
    try {
      execSync(`${cmd} --version`, {
        stdio: 'ignore'
      })
      return true
    } catch {
      return false
    }
  }

  let deployFlag = false

  try {
    if (hasCommand('rsync')) {
      console.log('🚀 使用 rsync 部署（增量 + 删除旧文件）')
      execSync(
        `rsync -avz --delete --exclude='tinymce' dist/ ${host}:${target}`, {
          stdio: 'inherit'
        }
      )
    } else {
      console.log('⚠️ 未检测到 rsync，降级使用 scp（全量覆盖）')

      // ⚠️ scp 不支持 --delete，所以需要手动清空目录
      console.log('🧹 清空远端目录...')
      execSync(
        `ssh ${host} "mkdir -p ${target} && rm -rf ${target}/*"`, {
          stdio: 'inherit'
        }
      )

      console.log('📦 使用 scp 上传文件...')
      execSync(
        `scp -r dist/* ${host}:${target}`, {
          stdio: 'inherit'
        }
      )
    }

    deployFlag = true
  } catch (e) {
    console.error('❌ 部署失败', e)
    process.exit(1)
  }

  // 5️⃣ 发送邮件
  if (deployFlag && commitMsg) {
    sendMail(commitMsg)
  }

})()