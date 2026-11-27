---
title: 布局
description: 设置内容宽度、栅格和滚动区域。
group: 设计规范
order: 80
showcase:
  anchor: layout
  order: 60
  preview: after
---

## 内容容器

`le-container` 将内容水平居中，并从可用宽度中扣除两侧留白。标准容器的默认上限为 68.75rem。加上 `le-container--reading` 可使用 52rem 的阅读宽度。

```html
<main class="le-container le-container--reading">
  页面正文
</main>
```

用 `--le-layout-max-width` 和 `--le-layout-reading-width` 调整宽度，用 `--le-layout-gutter` 调整留白。

## 栅格与滚动

`le-grid` 默认含两列，可以设置 `--le-columns` 和 `--le-gap` 改变列数和间距。`le-flex` 用于可折行的同行元素。`le-scroll-area` 用于需要独立滚动的区域，可通过 `--le-scroll-height` 设置最大高度。
