---
title: 按钮
description: 为主要操作、次要操作和表单提交选择按钮样式。
group: 组件
order: 94
showcase:
  anchor: component-example-button
  preview: before
---

## 主要与次要操作

`le-button` 使用控件底色和文字色。`le-button--secondary` 使用透明底，适合取消等次要操作。按钮在表单内提交时用 `type="submit"`，其余动作显式设为 `type="button"`。

```html
<button class="le-button" type="submit">保存</button>
<button class="le-button le-button--secondary" type="button">取消</button>
```

## 自定义

成对设置 `--le-color-control` 和 `--le-color-control-text` 可调整底色与文字，`--le-color-control-hover` 控制悬停底色。保留原生 `disabled` 和键盘焦点轮廓。只有图标的按钮需要通过 `aria-label` 提供动作名称。
