# Vue3 Renderer

Vue3 Renderer 是一个基于 Node.js 的服务，用于将 Vue3 单文件组件（.vue）渲染为 HTML 或生成高分辨率截图。它支持服务端渲染（SSR）和浏览器截图功能，非常适合需要将 Vue 组件转换为静态内容的场景。

## 功能特点

- **Vue3 SFC 渲染**: 支持将 Vue3 单文件组件渲染为 HTML
- **高分辨率截图**: 可将 Vue 组件渲染为 PNG/JPEG 格式的高分辨率截图
- **服务端渲染**: 利用 Vue 的服务端渲染能力，提高首屏加载速度
- **浏览器实例复用**: 通过浏览器实例池优化性能，减少资源消耗
- **API 接口**: 提供 RESTful API 接口，方便集成到其他系统
- **响应式设计**: 支持响应式组件设计，适配不同屏幕尺寸

## 技术栈

- Node.js
- TypeScript
- Vue3 (服务端渲染)
- Express.js (Web 服务框架)
- Playwright (浏览器自动化)
- @vue/compiler-sfc (Vue SFC 编译器)

## 安装与启动

### 环境要求

- Node.js >= 16.0.0
- Chrome/Chromium 浏览器 (用于截图功能)

### 安装依赖

```bash
npm install
```

### 配置

在 `src/config/host.config.ts` 文件中配置端口和浏览器路径：

```typescript
export const hostConfig = {
    port: 30000, // 服务端口
    chromePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Windows 浏览器路径
    // chromePath: '/usr/bin/chromium-browser', // Linux 浏览器路径
}
```

### 启动服务

```bash
npm start
```

服务将在配置的端口上启动，默认为 `http://localhost:30000`

## 使用方法

### API 接口

#### 1. 渲染 Vue 组件为 HTML

**POST** `/api/render-html`

请求体:
```json
{
  "filename": "/niu-info.vue", // 模板文件名（相对于 templates 目录）
  "props": {                   // 组件 props 数据
    "userInfo": {
      "userId": 123456789,
      "nickname": "测试用户",
      "rank": 1,
      "percent": 99.5,
      // ... 其他属性
    }
  }
}
```

响应: 渲染后的 HTML 内容

#### 2. 生成 Vue 组件截图

**POST** `/api/screenshot`

请求体:
```json
{
  "filename": "/niu-info.vue",
  "props": { /* 组件 props 数据 */ },
  "width": 1000,     // 截图宽度
  "height": 900,     // 截图高度
  "scale": 3,        // 缩放比例
  "type": "png",     // 图片格式 (png/jpeg)
  "fullPage": true   // 是否完整页面截图
}
```

响应: 截图图片的二进制数据

#### 3. 获取模板列表

**GET** `/api/templates`

响应:
```json
{
  "templates": [
    "niu-info.vue",
    "niu-rank.vue"
  ]
}
```

#### 4. 健康检查

**GET** `/api/health`

响应:
```json
{
  "status": "ok",
  "poolSize": 2
}
```

### 模板文件

Vue 组件模板应放置在 `src/templates/` 目录中。项目中包含了两个示例模板：

1. [niu-info.vue](src/templates/niu-info.vue) - 用户信息展示组件
2. [niu-rank.vue](src/templates/niu-rank.vue) - 排行榜展示组件

### 测试示例

项目提供了测试脚本用于验证功能：

```bash
# 测试排行榜组件
npm run test

# 测试用户信息组件
npm run test2
```

## 项目结构

```
src/
├── config/                 # 配置文件
│   └── host.config.ts      # 服务配置
├── outputs/                # 输出文件目录
├── templates/              # Vue 模板文件
│   ├── niu-info.vue        # 用户信息模板
│   └── niu-rank.vue        # 排行榜模板
├── Vue3Render.ts           # 核心渲染类
├── app.ts                  # Express 应用入口
├── test-niu-info.ts        # 用户信息组件测试
└── test-niu-rank.ts        # 排行榜组件测试
```

## 核心类说明

### Vue3Renderer

核心渲染类，提供以下主要方法：

- [renderToHTML(filePath, props)](src/Vue3Render.ts#L215-L237): 将 Vue 组件渲染为 HTML
- `captureScreenshot(vueFilePath, options, props)`: 生成组件截图并返回缓冲区
- `screenshotFromVue(vueFilePath, outputPath, options, props)`: 生成组件截图并保存到文件
- [getBrowser()](src/Vue3Render.ts#L80-L128): 获取浏览器实例（支持复用）
- [closeBrowser()](src/Vue3Render.ts#L133-L143): 关闭浏览器实例

## 性能优化

1. **浏览器实例池**: 通过复用浏览器实例减少启动开销
2. **内存处理**: 所有处理都在内存中进行，无需临时文件
3. **连接复用**: 避免重复创建浏览器连接

## 注意事项

1. 确保配置了正确的浏览器路径
2. 模板文件必须使用 Vue3 Composition API (script setup)
3. 截图功能需要网络访问权限以加载外部资源
4. 服务启动后需要几秒钟时间初始化浏览器实例

## 许可证

MIT