# vue3-ant-admin

一个基于 Vue 3 + Vite + Ant Design Vue 的现代化后台管理系统模板。

## 项目简介

本项目旨在为中小型企业和个人开发者提供一个开箱即用、易于扩展的后台管理系统脚手架，集成了主流技术栈和丰富的功能模块。

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

- 用户登录与权限管理
- 富文本编辑器（TinyMCE）
- 聊天对话（AI/机器人接口可扩展）
- 权限、角色、用户管理

## 目录结构

```
├── public/                # 静态资源（含 TinyMCE）
├── scripts/               # 部署、工具脚本
├── src/
│   ├── api/               # 接口封装
│   ├── assets/            # 样式、图片等
│   ├── components/        # 通用组件
│   ├── composables/       # 组合式 API 封装
│   ├── directives/        # 自定义指令
│   ├── layout/            # 布局相关
│   ├── router/            # 路由配置
│   ├── stores/            # 状态管理（Pinia）
│   ├── utils/             # 工具函数
│   ├── views/             # 页面视图
│   └── main.js            # 入口文件
├── package.json           # 项目依赖
├── vite.config.js         # Vite 配置
└── README.md              # 项目说明
```

## 安装与启动

1. 安装依赖：
   ```bash
   npm install
   ```
2. 启动开发环境：
   ```bash
   npm run dev
   ```
3. 构建生产环境：
   ```bash
   npm run build
   ```
4. 预览生产环境：
   ```bash
   npm run preview
   ```

## 部署

可参考 `scripts/deploy.js` 实现自动化部署。

## 说明

- 富文本编辑器相关资源在 `public/tinymce/` 目录下，支持本地化和插件扩展。
- 详细功能和用法请参考各模块源码及注释。

## License

MIT
