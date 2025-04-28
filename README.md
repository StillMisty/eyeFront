# 眼部识别系统前端 (eyeFront)

## 项目介绍

本项目是一个基于Nuxt.js开发的眼部识别系统的前端应用。主要功能包括用户认证、眼部图像识别、识别历史查询及个人信息管理等功能。

## 技术栈

- **框架**: Nuxt.js
- **UI组件库**: 自定义UI组件库，基于Tailwind CSS实现
- **状态管理**: Vue Query
- **样式**: Tailwind CSS
- **API通信**: 基于Nuxt的fetch系统

## 项目结构

```
├── api/ - API调用相关功能
├── assets/ - 静态资源文件
├── components/ - 组件文件
│   ├── ui/ - UI组件库
├── layouts/ - 页面布局模板
├── middleware/ - 中间件（包含认证中间件）
├── pages/ - 页面文件
├── plugins/ - 插件配置
├── public/ - 公共资源
├── server/ - 服务端相关配置
├── types/ - TypeScript类型定义
└── utils/ - 工具函数
```

## 主要功能

1. **用户认证**：登录、注册功能
2. **眼部识别**：上传眼部图像进行识别
3. **识别历史**：查询历史识别记录
4. **个人信息管理**：查看和更新个人信息

## 开始使用

### 环境要求

- Node.js (推荐 v18+)
- PNPM 包管理器

### 安装依赖

```bash
pnpm install
```

### 开发环境运行

```bash
pnpm dev
```

### 构建生产环境

```bash
pnpm build
```

### 启动生产环境服务

```bash
pnpm start
```

## 目录说明

### 页面 (`pages/`)

- `index.vue` - 主页面/眼部识别页面
- `login.vue` - 登录页面
- `register.vue` - 注册页面
- `history.vue` - 识别历史记录页面

### API调用 (`api/`)

- `useAuth.ts` - 处理认证相关API
- `useIdentify.ts` - 处理眼部识别相关API
- `useMe.ts` - 处理用户个人信息相关API

### 组件 (`components/`)

- `AppSidebar.vue` - 应用侧边栏组件
- `IdentifyDetailsDialog.vue` - 识别详情对话框
- `MeInfoUpdateDialog.vue` - 个人信息更新对话框
- `ui/` - 自定义UI组件库
