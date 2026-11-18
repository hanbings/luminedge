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

TypeScript 包使用基于 Rsbuild 的 Rslib 构建，输出 ESM 和类型声明。样式包由 Tailwind 编译成独立 CSS，展示站由 Astro 构建。目前包名为开发时约定，发布名称与 npm 命名空间尚未确定。

## 开发

需要 Node.js 24 或 26（LTS）。

```sh
npm ci
npm run dev
```

`npm run dev` 先构建各个包，再启动 Astro 开发服务器。修改交互包源码后，运行 `npm run build:packages`。Astro 开发模式直接读取样式源码，生产构建使用样式包的编译产物。

```sh
npm run build                       # 构建各包与 Astro 展示站
npm test                            # 构建各包并验证交互行为
npm run check -w @luminedge/docs    # 检查 Astro 类型
```

Astro 的检查工具目前要求 TypeScript 5 或 6，因此展示站单独使用兼容的 TypeScript 6；其他包使用最新版 TypeScript 7。

## GitHub Pages

`.github/workflows/pages.yml` 在 `main` 更新时构建并部署展示站，也可以从 Actions 手动运行。首次使用时，需要在仓库 **Settings → Pages** 中将发布来源设置为 **GitHub Actions**。工作流根据 Pages 配置自动设置站点地址和路径，默认地址为 `https://hanbings.github.io/luminedge/`。如果 Pages 尚不可用，工作流会完成构建、显示警告并跳过部署。

私有仓库的 Pages 需要 GitHub Pro、Team 或 Enterprise 等支持该功能的方案；个人仓库发布的站点可以被互联网上的任何人访问。[GitHub Pages 文档](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## 使用

只使用 CSS 时，引入样式包并使用对应的类名：

```js
import '@luminedge/styles/index.css';
```

```html
<button class="le-button" type="button">确认</button>
```

### Tailwind CSS

样式包和 Astro 展示站通过 `@apply` 复用布局、间距、圆角、文字和状态色工具类。`tokens.css` 定义设计变量，`tailwind.css` 将变量映射为工具类。浏览器控件的伪元素、渐变、动画和动态尺寸仍直接用 CSS 表达。样式包构建时展开 `@apply`，生成可直接引入的 CSS。

Astro 展示站使用 Tailwind CSS 4。使用 Tailwind 的项目可以在样式入口引入 Luminedge 主题，把设计变量用于工具类。

```css
@layer theme, luminedge, utilities;

@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/utilities.css' layer(utilities);
@import '@luminedge/styles/index.css';
@import '@luminedge/styles/tailwind.css';
```

```html
<p class="rounded-le-md bg-le-primary-soft p-le-4 text-le-primary-text">
  内容已保存。
</p>
```

主题映射支持色彩、字体、间距、容器宽度、圆角和阴影。完整包也提供 `@luminedge/ui/styles.css` 和 `@luminedge/ui/tailwind.css`。上面的入口省略 Preflight，保留浏览器的基础样式。

### 设计变量

样式包提供色彩、字体、布局、间距、圆角和阴影变量，例如 `--le-font-size-base`、`--le-font-weight-semibold`、`--le-space-4` 和 `--le-radius-md`。这些变量可以通过普通 CSS 按页面或组件覆盖。字体字重提供 regular（400）、medium（500）、semibold（600）和 bold（700）。

主色、辅色、成功、警告、危险和中性色各有从 `50`（浅）到 `900`（深）的色阶，例如 `--le-color-primary-50`、`--le-color-primary-500` 和 `--le-color-primary-900`。组件也可以使用按用途命名的语义变量，例如 `--le-color-primary-soft`、`--le-color-primary-indicator`、`--le-color-secondary-indicator`、`--le-color-primary-text`、`--le-color-danger` 和 `--le-color-on-danger`。链接文字可使用辅色系的 `--le-color-link` 和 `--le-color-link-hover`；深色背景可搭配 `--le-color-surface-inverse` 和白色的 `--le-color-text-inverse`。覆盖对应语义变量即可单独调整组件用色。

```css
.notice {
  background: var(--le-color-primary-soft);
  color: var(--le-color-primary-text);
}
```

色阶与语义色的组织参考了 [Material 3 色彩系统](https://developer.android.com/develop/ui/compose/designsystems/material3#color-scheme)和 [Apple 色彩指南](https://developer.apple.com/design/human-interface-guidelines/color)。

布局容器也是可选的：

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

### 表单、反馈与数据展示

[组件演示](https://hanbings.github.io/luminedge/#components)按通用、布局、输入、导航、反馈、数据和内容组织。

样式包还提供以下框架无关的类名，可直接配合原生 HTML 使用：

| 类别 | 类名与用法 |
| --- | --- |
| 表单 | `le-field`、`le-label`、`le-input`、`le-textarea`、`le-select`、`le-field-hint`、`le-field-error` |
| 选择 | `le-fieldset`、`le-choice`，以及用于复选框的 `le-switch` |
| 反馈 | `le-alert`、`le-tag`、`le-badge`、`le-toast`、`le-progress`、`le-meter`、`le-spinner` |
| 导航 | `le-tablist`、`le-tab`、`le-tab-panel`、`le-menu`、`le-tooltip`、`le-popover`、`le-pagination` |
| 数据 | `le-table-wrap`、`le-table`、`le-steps`、`le-timeline`、`le-calendar` |
| 输入补充 | `le-input-group` 组合输入框与附加内容；`le-slider`、`le-file` 分别用于原生范围和文件输入；`le-token-input` 用于简单标签输入 |
| 导航补充 | `le-breadcrumb` 用于路径列表；`le-accordion` 容纳一组 `details`，相同的 `name` 可让它们互斥展开；在 `le-dialog` 上加 `le-drawer` 可显示为抽屉 |
| 内容与状态 | `le-descriptions` 用于 `dl`；`le-code-block` 与 `le-kbd` 用于代码与快捷键；`le-empty` 与 `le-skeleton` 用于空状态与加载占位 |

例如，表单项使用关联的标签和说明；错误时可设置 `aria-invalid="true"` 并将错误说明加入 `aria-describedby`：

```html
<div class="le-field">
  <label class="le-label" for="name">名称</label>
  <input class="le-input" id="name" name="name" aria-describedby="name-hint">
  <p class="le-field-hint" id="name-hint">填写一个容易辨认的名称。</p>
</div>
```

复选框、单选框和选择框沿用浏览器原生交互；开关使用 `<input type="checkbox" role="switch" class="le-switch">`。支持自定义原生选择框的浏览器会使用辅色标记和轮廓，不支持的浏览器保留系统选项列表。提示、标签和徽标支持 `--secondary`、`--success`、`--warning`、`--danger` 变体。进度条和计量条分别使用原生 `<progress>` 与 `<meter>`；旋转加载图形应配合可访问的状态文字。

标签输入将 `le-token-list` 与输入行 `le-token-input` 放在同一个容器中；输入行使用 `le-token-editor` 和添加按钮。完整示例见[输入组件](apps/docs/src/showcase/advanced-form-examples.astro)。

需要状态管理的组件提供可选的交互封装，调用 `destroy()` 可移除封装注册的事件监听器：

| 封装 | 约定与事件 |
| --- | --- |
| `createTabs(root)` | 传入含 `tablist`、`tab` 和 `tabpanel` 的容器；选项卡通过 `id` 和 `aria-controls` 关联面板。支持方向键、Home 和 End，变化时触发 `le:tabchange`，`detail.id` 为选中的选项卡 ID。 |
| `createPagination(root)` | 使用带 `data-le-page` 的按钮，值为页码、`previous` 或 `next`；变化时触发 `le:pagechange`，`detail.page` 为当前页码。 |
| `createMenu(root)` | 增强原生 `<details>` 菜单，支持点击外部或按 Escape 关闭；操作项可使用 `data-le-menu-close`。 |
| `createTooltip(trigger, tooltip)` | 两者放在同一容器内，提示元素需有 `id`；悬停、聚焦时显示，可按 Escape 关闭。 |
| `createCalendar(root, options)` | 使用日期为 `YYYY-MM-DD` 的 `value`、`min`、`max` 和可选 `locale`；选择变化时触发 `le:datechange`，`detail.value` 为日期字符串或 `null`。 |
| `createCombobox(root)` | 输入框用 `data-le-combobox-input`；隐藏的 `data-le-combobox-popup` 内放带唯一 `id` 的 `data-le-combobox-list`。每项用 `data-le-option` 提供值，标签是项的文字，可加 `data-le-keywords`。方向键浏览，Enter 选择，Escape 收起。选择时冒泡触发 `le:optionselect`，包含 `detail.value` 和 `detail.label`。输入仍可自由编辑。 |
| `createCommandPalette(dialog, options)` | 在原生对话框内用 `data-le-command-list` 包住同样的输入和选项。传入打开、关闭触发器及可选的 `shortcut: 'k'` 以绑定 Ctrl / ⌘ + K。选项确认后关闭面板，应用可监听 `le:optionselect` 执行对应命令。 |
| `createDataTable(table, { filter, empty })` | 增强原生表格第一个 `tbody` 的现有行。简单列标题用 `data-le-sort="text"` 或 `"number"`，内含标有 `data-le-sort-button` 的按钮。排序可读取单元格的 `data-le-sort-value`。筛选可连接输入框，零结果时显示 `empty`。 |
| `createCopyButton(button, source)` | 复制源元素的文字，触发 `le:copy`，用 `detail.copied` 和 `detail.selected` 告知结果。剪贴板不可写时，保留选中文本以便手动复制。 |
| `createSlider(input)` | 同步原生范围输入框的轨道填充；在代码中更改数值或范围后调用 `refresh()`。 |
| `createNumberInput(root)` | 用原生数字输入的步进规则驱动上下按钮。输入框用 `data-le-number-value`，两个 `type="button"` 按钮放进初始隐藏的 `data-le-number-controls` 容器，分别标记 `data-le-number-increment` 和 `data-le-number-decrement`。 |
| `createOtpInput(root)` | 每个 `data-le-otp-cell` 文本输入框接收一位数字，格数由标记决定。支持自动前进、粘贴和在空白格按退格时回到前一格。可用带 `data-le-otp-value` 和 `name` 的隐藏输入提交完整验证码。变化时触发 `le:otpchange`，包含 `detail.value` 和 `detail.complete`。 |
| `createPasswordInput(input, toggle, options)` | 切换原生密码输入的可见状态；可通过 `toggleLabel`、`showText` 和 `hideText` 设置显示文案。 |
| `createTokenInput(root, options)` | 为文本输入添加和移除简单标签，按 Enter 或点击按钮添加；`values` 设置初始标签，`name` 为每个标签生成表单值。变化时触发 `le:tokenschange`，包含 `detail.values`。 |

`createCalendar` 使用周一作为每周起点；方向键、Home、End 和 Page Up / Page Down 可移动日期，按住 Shift 可按年切换。完整的标记结构和用法见展示站的[表单](apps/docs/src/showcase/form-examples.astro)、[导航](apps/docs/src/showcase/navigation-examples.astro)、[表格与日期](apps/docs/src/showcase/data-examples.astro)和[代码块](apps/docs/src/showcase/content-examples.astro)。气泡示例优先使用浏览器原生 Popover API，不支持时需提供替代交互。

| 类别 | 交互入口和示例 |
| --- | --- |
| 布局 | `createSplitter` 使用 `data-le-split-handle`，支持拖动与方向键。普通栅格、间距、粘滞区域、分隔线与滚动区域可直接应用 CSS。见[布局](apps/docs/src/showcase/layout-examples.astro)。 |
| 输入 | `createCascader` 按层填充原生选择框，`createSelect` 和 `createTreeSelect` 使用可折叠的选项列表，`createMentions` 在光标处插入提及。`createTransfer` 移动两列的选项，`createUpload` 提供文件队列，接收业务方提供的上传函数、进度和取消信号。见[输入组件](apps/docs/src/showcase/advanced-form-examples.astro)。 |
| 导航与浮层 | `createMenubar`、`createContextMenu` 支持键盘操作，`createHoverCard` 在悬停或聚焦时显示预览。侧栏和折叠项可以使用原生 `details`。见[导航组件](apps/docs/src/showcase/advanced-navigation-examples.astro)。 |
| 数据 | `createCarousel` 增强可滚动的幻灯列表，`createVirtualList` 用于固定行高的展示列表，`createBarChart` 绘制非负数值的柱状图，`createQrCode` 在本地生成二维码。见[数据组件](apps/docs/src/showcase/advanced-data-examples.astro)。 |
| 内容与状态 | `createQuestionnaire` 验证步骤并通过 `le:questionnaire-submit` 提供 `FormData`，`createMessageScroller` 跟随新消息。`createTour` 提供分步指导，`createWatermark` 生成重复水印。`createApp` 使用指定的通知区域，`configureUi` 为 DOM 子树配置语言、方向和设计变量。见[内容](apps/docs/src/showcase/rich-content-examples.astro)与[反馈组件](apps/docs/src/showcase/status-examples.astro)。 |

通知使用预先放入页面的 `aria-live` 容器，默认会保留到用户关闭；传入 `duration`（毫秒）可设置自动关闭：

```js
import { showToast } from '@luminedge/ui';

const region = document.querySelector('[aria-live]');
const toast = showToast(region, { message: '内容已保存。', variant: 'success' });
// 也可以在不再需要时调用 toast.dismiss()。
```

手绘标注可以用于强调页面上的元素，使用完毕后可移除标注及其监听器：

```js
import { annotate } from '@luminedge/ui';

const note = annotate(document.querySelector('#example'), {
  type: 'underline',
  color: 'var(--le-color-primary)',
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

## 许可与署名

- 项目原创代码、样式和代码示例采用 [MIT 许可](LICENSE)。
- 项目原创文档和非 Logo 素材采用 [CC BY 4.0](LICENSES/CC-BY-4.0.txt)，允许商业使用和修改，使用时请署名、链接许可并注明修改。署名：hanbings / Luminedge（<hanbings@hanbings.io>）。
- Logo 和吉祥物图像保留所有权利；二次开发、分发或部署时请移除该图像及展示它的引用，详见 [Logo 使用约定](BRANDING.md)。
- 手绘功能包含 [Rough.js](https://github.com/rough-stuff/rough) 和 [slidevjs/rough-notation](https://github.com/slidevjs/rough-notation) 的源码改编，保留 Preet Shihn 和上游贡献者的署名及 MIT 许可；完整来源见 [第三方声明](THIRD_PARTY_NOTICES.md)。

许可适用范围和历史版本说明见[许可说明](LICENSES/README.md)。

## 项目状态

当前已提供设计变量、基础组件、表单、反馈、导航和数据展示组件，以及原生弹窗和手绘标注示例。原有原型可以在 Git 历史中查看。npm 包的发布方式将在包名确定后配置。
