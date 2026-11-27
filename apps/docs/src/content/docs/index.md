---
title: 使用
description: 了解如何在项目中引入 Luminedge 的样式与交互。
group: 指南
order: 10
showcase:
  anchor: usage
  order: 90
---

## 本地运行

在仓库根目录使用 Node.js 24 或 26。当前的 `@luminedge/*` 包名用于工作区开发，npm 发布方式仍待确定。

```sh
npm ci
npm run dev
```

## 引入样式

只使用组件 CSS 时，从样式包引入编译好的样式，再给原生 HTML 添加对应类名。

```js
import '@luminedge/styles/index.css';
```

```html
<button class="le-button" type="button">保存</button>
```

## 增强交互

需要弹窗或其他交互时，使用总包的独立 CSS 入口，并按需引入控制器。控制器接受已有的 DOM 元素，详见[组件](./components/)。

```html
<button class="le-button" id="open-preferences" type="button">打开偏好设置</button>
<dialog class="le-dialog" id="preferences" aria-labelledby="preferences-title">
  <h2 id="preferences-title">偏好设置</h2>
  <button class="le-button" id="close-preferences" type="button">关闭</button>
</dialog>
```

```js
import '@luminedge/ui/styles.css';
import { createDialog } from '@luminedge/ui';

const dialog = document.querySelector('#preferences');
const openButton = document.querySelector('#open-preferences');
const closeButton = document.querySelector('#close-preferences');

const controller = createDialog(dialog, {
  openTriggers: [openButton],
  closeTriggers: [closeButton],
});

// 界面卸载时调用 controller.destroy()。
```
