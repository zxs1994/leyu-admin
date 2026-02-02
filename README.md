# leyu-admin

一个基于 Vue 3 + Vite + Ant Design Vue 的现代化后台管理系统模板。

## 项目简介

面向中小型企业与个人开发者的开箱即用后台模板，内置常见后台模块与可扩展能力，便于二次开发与快速落地。

## 技术栈

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Ant Design Vue](https://www.antdv.com/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Axios](https://axios-http.com/)
- [TinyMCE 富文本编辑器](https://www.tiny.cloud/)
- [TailwindCSS](https://tailwindcss.com/)
- [Less](https://lesscss.org/)

## 主要功能

- 登录与权限控制
- 角色 / 用户 / 部门 / 权限管理
- 富文本编辑器（TinyMCE，本地化资源）
- 聊天对话能力（可对接 AI/机器人接口）
- 常用 CRUD 列表与弹窗组合式封装
- 多租户切换（组件级支持）
- PWA 相关配置（manifest / sw）

## 预览地址

- http://8.159.136.15

## 目录结构

```
├── public/                # 静态资源（含 TinyMCE / PWA）
│   ├── icons/
│   ├── manifest.json
│   └── sw.js
├── py/                    # Python 工具脚本（如周报生成）
├── scripts/               # 部署、邮件与工具脚本
├── src/
│   ├── api/               # 接口封装与配置
│   ├── assets/            # 样式、图片等
│   ├── components/        # 通用组件
│   ├── composables/       # 组合式 API 封装
│   ├── directives/        # 自定义指令（权限 / 聚焦）
│   ├── icons/             # 图标资源
│   ├── layout/            # 布局与导航
│   ├── router/            # 路由配置
│   ├── stores/            # 状态管理（Pinia）
│   ├── utils/             # 工具函数
│   ├── views/             # 页面视图
│   └── main.js            # 入口文件
├── package.json           # 项目依赖与脚本
├── vite.config.js         # Vite 配置
└── README.md              # 项目说明
```

## 快速开始

### 1. 安装依赖

```bash
yarn
```

### 2. 启动开发环境

```bash
yarn dev
```

### 3. 构建生产环境

```bash
yarn build
```

### 4. 预览生产环境

```bash
yarn preview
```

## 常用脚本

- `yarn dev`：启动本地开发
- `yarn build`：生产构建
- `yarn buildTest`：测试环境构建（`--mode=test`）
- `yarn preview`：本地预览构建产物
- `yarn dp`：执行部署脚本
- `yarn dpTest`：测试环境部署脚本

## 运行与配置说明

- 接口配置：见 [src/api/axios.config.js](src/api/axios.config.js)
- 路由与权限：见 [src/router/index.js](src/router/index.js) 与 [src/directives/permission.js](src/directives/permission.js)
- 用户状态：见 [src/stores/user.js](src/stores/user.js)
- 富文本编辑器：本地资源位于 public/tinymce/，组件封装在 [src/components/TinyEditor.vue](src/components/TinyEditor.vue)
- 聊天组件：见 [src/components/Chat.vue](src/components/Chat.vue) 与 [src/components/ChatModal.vue](src/components/ChatModal.vue)

## 部署

部署脚本位于 scripts/ 目录，默认提供环境区分与示例配置：

- 脚本入口：scripts/deploy.js
- 邮件配置：scripts/email.config.js（可参考 scripts/example-email.config.js）

可按需修改脚本逻辑与目标服务器信息。

## 其他工具

- Python 周报脚本：py/generate_weekly_report.py

## License

MIT
