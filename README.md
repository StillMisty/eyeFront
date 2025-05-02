# EyeFront - 眼部疾病识别与信息系统

## 项目介绍

EyeFront 是一个基于 Nuxt.js 开发的眼部疾病识别和信息管理系统的前端应用。该系统提供眼部疾病识别、信息查询、疾病介绍以及用户评论等功能，为用户提供便捷的眼部健康管理服务。

## 功能特性

- **用户认证**: 支持用户注册、登录和个人信息管理
- **眼部疾病识别**: 上传眼部图片进行疾病识别和诊断
- **Grad-CAM 可视化**: 提供疾病识别的热力图可视化分析
- **疾病介绍**: 详细的眼部疾病介绍和知识库
- **历史记录**: 查看用户历史识别记录
- **评论系统**: 用户可以进行评论和交流

## 技术栈

### 核心框架

- **[Nuxt 3](https://nuxt.com/)**: 基于Vue 3的全栈框架，提供SSR、文件系统路由和自动导入功能
- **[Vue 3](https://vuejs.org/)**: 采用Composition API的响应式框架
- **[TypeScript](https://www.typescriptlang.org/)**: 为JavaScript添加静态类型支持，增强代码可维护性

### UI组件与样式

- **[Shadcn Vue](https://shadcn-vue.com/)**: 高质量可定制组件库，由独立组件组成
- **[Tailwind CSS](https://tailwindcss.com/)**: 功能类优先的CSS框架，用于快速构建现代界面
- **[Lucide Vue](https://lucide.dev/)**: 美观简洁的SVG图标库
- **[tw-animate-css](https://github.com/bentzibentz/tw-animate)**: Tailwind动画扩展
- **[Vue Sonner](https://vue-sonner.vercel.app/)**: 优雅的Toast通知组件

### 状态管理与数据获取

- **[Pinia](https://pinia.vuejs.org/)**: Vue生态系统的状态管理库，支持TypeScript和Vue DevTools
- **[TanStack Query (Vue Query)](https://tanstack.com/query/latest/docs/framework/vue/overview)**: 强大的异步数据管理库，处理缓存、重试和数据同步

### 表格与数据展示

- **[Markdown-it](https://github.com/markdown-it/markdown-it)**: Markdown解析器，用于疾病介绍内容渲染

### 开发工具

- **[ESLint](https://eslint.org/)**: JavaScript和TypeScript代码质量工具
- **[Prettier](https://prettier.io/)**: 代码格式化工具，保持一致的编码风格
- **[Vue Router](https://router.vuejs.org/)**: Vue.js官方路由管理器
- **[VueUse](https://vueuse.org/)**: Vue组合式API实用工具集合，提供常用功能

### 构建与包管理

- **[pnpm](https://pnpm.io/)**: 高效的包管理器，版本10.10.0+
- **[Vite](https://vitejs.dev/)**: 现代前端构建工具，由Nuxt内部使用

## 安装指南

### 前置条件

- Node.js (推荐 v18+)
- pnpm (v10.10.0+)

### 安装步骤

1. 克隆项目

```bash
git clone https://github.com/StillMisty/eyeFront
cd eyeFront
```

2. 安装依赖

```bash
pnpm install
```

3. 开发环境运行

```bash
pnpm dev
```

4. 构建生产版本

```bash
pnpm build
pnpm preview
```

## 项目结构

```
├── api/                # API 调用相关函数
├── assets/             # 静态资源(CSS, 图片等)
├── components/         # Vue 组件
│   └── ui/             # Shadcn UI 组件
├── layouts/            # 应用布局
├── middleware/         # Nuxt 中间件
├── pages/              # 页面组件
├── plugins/            # Nuxt 插件
├── public/             # 公共文件
├── server/             # 服务端API
├── types/              # TypeScript 类型定义
└── utils/              # 工具函数
```

## 主要页面

- `/login` - 登录页面
- `/register` - 注册页面
- `/` - 首页
- `/introduce` - 疾病介绍页面
- `/grad-cam` - 识别热力图分析页面
- `/history` - 历史记录页面
- `/comment` - 评论页面

## 开发说明

- 使用 `eslint` 和 `prettier` 保持代码风格一致
- 组件采用 Shadcn Vue 设计系统
- 使用 Vue Query 进行服务端状态管理

## 许可证

本项目遵循 Apache 许可证。有关详细信息，请参阅 [LICENSE](LICENSE) 文件。
