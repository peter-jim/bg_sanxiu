# 素材库 · AI 动态背景素材

> 🎬 开放 AI 动态背景素材，让视频自带科技感

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpeter-jim%2Fbg_sanxiu)

## ✨ 简介

**素材库**是一个 AI 动态背景素材网站，提供 15 套精心设计的 Canvas 实时渲染动态模板，覆盖粒子网络、神经网络、矩阵雨、电路板、蜂窝网格、雷达扫描等多种科技风格。

所有素材支持自定义画幅与分辨率，下载即用，完美适配剪映、达芬奇、Premiere 等主流剪辑软件。

## 🎯 功能特性

- 🎨 **15 套动态模板** — 涵盖粒子、神经网络、矩阵雨、电路板等科技风动效
- 📐 **多画幅支持** — 16:9 / 9:16 / 1:1 / 4:3 / 3:4 / 21:9，覆盖全平台
- 🖥️ **多分辨率** — SD 720p / HD 1080p / UHD 4K
- ⏱️ **自定义时长** — 5s / 10s / 15s / 30s / 60s 自由选择
- 🔍 **搜索与筛选** — 支持关键词搜索，分类标签快速过滤
- 📥 **一键下载** — MP4 格式直接导出，拖入剪辑软件即可使用
- 🖼️ **实时预览** — Canvas 渲染即时预览动效，所见即所得
- 📜 **CC0 协议** — 完全免费，无需署名，商用无忧

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 前端 | HTML5 + CSS3 + Vanilla JavaScript |
| 动画渲染 | Canvas 2D API |
| 字体 | Plus Jakarta Sans · JetBrains Mono (Google Fonts) |
| 部署 | Vercel (静态站点) |

## 🚀 部署

### 一键部署到 Vercel

点击下方按钮即可将项目部署到 Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpeter-jim%2Fbg_sanxiu)

### 手动部署

1. **安装 Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **克隆项目**

   ```bash
   git clone https://github.com/peter-jim/bg_sanxiu.git
   cd bg_sanxiu
   ```

3. **部署**

   ```bash
   vercel
   ```

   生产环境部署：

   ```bash
   vercel --prod
   ```

### 本地开发

项目为纯静态站点，无需构建步骤。使用任意静态服务器即可启动：

```bash
# 方式一：使用 Python
python3 -m http.server 8080

# 方式二：使用 Node.js
npx serve .

# 方式三：使用 VS Code Live Server 插件
# 直接右键 index.html → Open with Live Server
```

然后在浏览器中访问 `http://localhost:8080`

## 📁 项目结构

```
bg_sanxiu/
├── index.html        # 主页面
├── styles.css        # 全局样式
├── animations.js     # 14 套 Canvas 动画模板引擎
├── app.js            # 应用逻辑（搜索、筛选、下载、侧边栏）
├── vercel.json       # Vercel 部署配置
├── screenshots/      # 项目截图
└── uploads/          # 用户上传资源
```

## 📄 License

CC0 — 无版权限制，免费使用，无需署名。
