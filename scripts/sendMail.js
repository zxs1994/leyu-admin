// sendMail.js
import nodemailer from 'nodemailer'
import {
  readFile
} from 'fs/promises'
import path from 'path'
import {
  fileURLToPath
} from 'url'
import emailConfig from './email.config.js'
// import dotenv from 'dotenv'

// 获取 __dirname
const __filename = fileURLToPath(
  import.meta.url)
const __dirname = path.dirname(__filename)

// dotenv.config({
//   path: path.join(__dirname, '../.env.production')
// })

// 读取 package.json
const pkgPath = path.join(__dirname, '../package.json')
const pkgData = JSON.parse(await readFile(pkgPath, 'utf-8'))
const version = pkgData.version

// 配置 邮箱 SMTP
const transporter = nodemailer.createTransport(emailConfig)

export default async function sendMail(commitMsg = '') {
  // 邮件内容
  const mailText = `
📢 前端发布通知
版本号: ${version}
${commitMsg ? `提交信息: ${commitMsg}` : ''}
`
  try {
    const info = await transporter.sendMail({
      from: `"前端部署" <${emailConfig.auth.user}>`, // 发件人地址
      to: emailConfig.toUsers.join(','), // 多个同事用逗号隔开
      subject: `前端发布通知 v${version}`,
      text: mailText,
    })
    console.log('📨 邮件已发送: %s', info.messageId)
  } catch (err) {
    console.error('❌ 邮件发送失败: ', err)
  }
}