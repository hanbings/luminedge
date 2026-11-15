<p align="center">
  <img src="https://picture.hanbings.com/2022/08/01/9b6cb90a8d591.png" alt="Luminedge 吉祥物与品牌标志" width="880">
</p>

<h1 align="center">🍀 Luminedge</h1>

Luminedge 是一套自然、友好、优雅的界面设计语言。仓库将设计变量与样式、交互组件和展示站组织在同一个工作区。

## 工作区

| 路径 | 职责 |
| --- | --- |
| `packages/styles` | 独立使用的设计变量和组件 CSS |
| `packages/components` | 框架无关的交互组件，基于原生浏览器能力 |
| `packages/tools` | 各包共享的通用工具 |
| `packages/ui` | 汇总样式和组件的入口 |
| `apps/docs` | 使用 Astro 构建的设计与组件展示站 |

TypeScript 包使用基于 Rsbuild 的 Rslib 构建，输出 ESM 和类型声明；样式包提供独立 CSS，展示站由 Astro 构建。目前包名为开发时约定，发布名称与 npm 命名空间尚未确定。

## 开发

需要 Node.js 24 或 26（LTS）。

```sh
npm ci
npm run dev
```

`npm run dev` 先构建各个包，再启动 Astro 开发服务器。修改交互包源码后，需要重新运行 `npm run build:packages`；样式包的改动会由展示站直接读取。

```sh
npm run build                       # 构建各包与 Astro 展示站
npm run check -w @luminedge/docs    # 检查 Astro 类型
```

Astro 的检查工具目前要求 TypeScript 5 或 6，因此展示站单独使用兼容的 TypeScript 6；其他包使用最新版 TypeScript 7。

## GitHub Pages

`.github/workflows/pages.yml` 在 `main` 更新时构建并部署展示站，也可以从 Actions 手动运行。首次使用时，需要在仓库 **Settings → Pages** 中将发布来源设置为 **GitHub Actions**。工作流根据 Pages 配置自动设置站点地址和路径，默认地址为 `https://hanbings.github.io/luminedge/`。如果 Pages 尚不可用，工作流会完成构建、显示警告并跳过部署。

私有仓库的 Pages 需要 GitHub Pro、Team 或 Enterprise 等支持该功能的方案；个人仓库发布的站点可以被互联网上的任何人访问。[GitHub Pages 文档](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## 使用方式

只使用 CSS 时，引入样式包并使用对应的类名：

```js
import '@luminedge/styles/index.css';
```

```html
<button class="le-button" type="button">确认</button>
```

样式包提供色彩、字体、布局、间距、圆角和阴影变量，例如 `--le-font-size-base`、`--le-space-4` 和 `--le-radius-md`。这些变量可以通过普通 CSS 按页面或组件覆盖。布局容器也是可选的：

```html
<main class="le-container le-container--reading">
  页面内容
</main>
```

`le-container` 会居中并保留自适应的两侧边距；叠加 `le-container--reading` 可使用较窄的阅读宽度。

也可以使用统一入口，引入 CSS 并按需使用交互封装：

```html
<button id="open-dialog" type="button">打开</button>
<dialog id="example-dialog" class="le-dialog" aria-labelledby="dialog-title">
  <h2 id="dialog-title">你好</h2>
  <button id="close-dialog" class="le-button" type="button">关闭</button>
</dialog>
```

```js
import '@luminedge/ui/styles.css';
import { createDialog } from '@luminedge/ui';

const dialog = document.querySelector('#example-dialog');
const openButton = document.querySelector('#open-dialog');
const closeButton = document.querySelector('#close-dialog');

const controller = createDialog(dialog, {
  openTriggers: [openButton],
  closeTriggers: [closeButton],
});

// 不再需要时，移除由封装注册的事件监听器。
// controller.destroy();
```

弹窗应使用原生 `<dialog>`，并提供可访问的标题和关闭方式。样式不会自动注入页面，以便应用控制引入位置和覆盖顺序。

手绘标注可以用于强调页面上的元素，使用完毕后可移除标注及其监听器：

```js
import { annotate } from '@luminedge/ui';

const note = annotate(document.querySelector('#example'), {
  type: 'underline',
  color: '#7a95bd',
});

await note.show();
// 不再需要时：note.remove();
```

标注支持下划线、方框、圆圈、高亮、删除线、交叉和括号，并遵循系统的减少动态效果设置。可使用 `annotationGroup` 将多个标注按顺序播放；标注实例也提供 `hide()`、`isShowing()` 和颜色、线宽等配置。

底层绘图工具也可单独使用：

```js
import rough from '@luminedge/tools/rough';

const svg = document.querySelector('svg');
svg.append(rough.svg(svg).rectangle(10, 10, 120, 60));
```

## 项目状态

当前已打通设计变量、按钮、卡片、头像、原生弹窗和手绘标注的示例；其他组件仍需逐步设计和实现。原有原型可以在 Git 历史中查看。npm 包的发布方式将在包名确定后配置。
