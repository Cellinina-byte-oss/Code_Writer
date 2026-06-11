# 在线代码编辑运行工具

一个基于 Web 的在线代码编辑和执行平台，支持多种编程语言，提供语法高亮、自动纠错、实时终端等功能。

## 功能特性

- 多语言支持：Python、C++、C、Java
- Monaco Editor 代码编辑器，语法高亮与自动补全
- 代码自动纠错与格式化
- WebSocket 实时终端
- 项目管理与用户认证
- 主题切换（深色/浅色）

## 技术栈

**前端**
- React 18 + TypeScript
- Monaco Editor
- React Router
- Vite

**后端**
- Express.js
- WebSocket (ws)
- node-pty (终端模拟)

## 项目结构

```
Code_Writer/
├── backend/                    # 后端服务
│   ├── routes/                 # API 路由
│   │   ├── auth.js             # 用户认证
│   │   ├── projects.js         # 项目管理
│   │   └── execution.js        # 代码执行
│   ├── temp/                   # 临时文件目录
│   ├── users/                  # 用户数据
│   ├── projects/               # 项目数据
│   ├── server.js               # 主服务器
│   └── package.json
│
├── frontend/                   # 前端应用
│   ├── src/
│   │   ├── components/         # React 组件
│   │   │   ├── CodeEditor.tsx  # 代码编辑器
│   │   │   ├── OutputPanel.tsx  # 输出面板
│   │   │   └── ProblemPanel.tsx # 题目面板
│   │   ├── pages/              # 页面组件
│   │   │   ├── Auth.tsx         # 认证页面
│   │   │   ├── Home.tsx         # 首页
│   │   │   └── Practice.tsx     # 练习页面
│   │   ├── contexts/           # React Context
│   │   ├── hooks/              # 自定义 Hooks
│   │   ├── constants/          # 常量配置
│   │   └── types/              # TypeScript 类型
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml          # Docker 编排配置
├── backend.tar.gz              # 后端 Docker 镜像备份
└── README.md
```

## 快速开始

### 方式一：Docker Compose（推荐）

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

访问 `http://localhost` 即可使用。

### 方式二：本地开发

**后端**

```bash
cd backend
npm install
npm run dev
```

**前端**

```bash
cd frontend
npm install
npm run dev
```

访问 `http://localhost:5173`。

## 环境要求

- Node.js >= 16
- Python >= 3.x
- g++ / gcc (C/C++ 编译)
- Java (JDK >= 8)
- Windows 平台（代码中使用了 Windows 特定路径）

## API 端口

- 前端：`http://localhost:80`
- 后端 API：`http://localhost:3001`
- WebSocket：`ws://localhost:3001`

## 主要依赖

**后端**
- `express` - Web 框架
- `ws` - WebSocket 服务
- `node-pty` - 终端模拟
- `jsonwebtoken` - JWT 认证
- `bcryptjs` - 密码加密

**前端**
- `@monaco-editor/react` - Monaco Editor React 封装
- `xterm` - 终端组件
- `axios` - HTTP 客户端
- `react-router-dom` - 路由管理
# Code_Writer
# Code_Writer
