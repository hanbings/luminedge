---
title: 阴影
description: 用阴影区分表面和临时浮层。
group: 设计规范
order: 70
showcase:
  anchor: shadows
  order: 50
  preview: after
---

## 表面层级

`--le-shadow-none` 对应无阴影，`--le-shadow-sm` 用于工具提示和菜单，`--le-shadow-md` 用于气泡浮层，`--le-shadow-lg` 用于对话框等需要与页面拉开距离的表面。为卡片加阴影时，可以用 `--le-shadow-card`，它默认指向 `--le-shadow-md`。

阴影的颜色会随深浅模式变化。调整浮层时，也要检查表面色与背景的区分，以及键盘焦点在边缘处是否可见。
