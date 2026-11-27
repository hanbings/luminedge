---
title: 架构
description: 各工作区的职责与构建产物。
group: 指南
order: 20
showcase:
  anchor: architecture
  order: 80
---

## 工作区

| 工作区 | 职责 |
| --- | --- |
| `packages/styles` | 设计变量、组件类名、Tailwind 主题映射 |
| `packages/components` | 绑定到现有 DOM 的交互控制器 |
| `packages/tools` | 事件监听等共享工具，以及手绘图形 |
| `packages/ui` | 交互控制器与样式的统一入口 |
| `apps/docs` | 静态文档与可操作示例 |

## 构建

TypeScript 包通过 Rslib 生成 ESM 与类型声明。样式包将 Tailwind 工具类展开为普通 CSS。文档站使用 Astro 生成静态页面。

```sh
npm run build:packages
npm test
npm run check -w @luminedge/docs
```

开发模式会直接读取样式源码。修改交互包源码后，重新执行 `npm run build:packages` 可让文档站读取新产物。
