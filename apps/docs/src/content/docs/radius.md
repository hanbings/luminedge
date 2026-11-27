---
title: 圆角
description: 为控件、浮层、卡片和胶囊形组件选择圆角。
group: 设计规范
order: 60
showcase:
  anchor: radius
  order: 40
  preview: after
---

## 圆角档位

| 变量 | 默认值 | 常见用途 |
| --- | --- | --- |
| `--le-radius-sm` | 0.5rem | 按钮、输入框 |
| `--le-radius-md` | 0.875rem | 日期组件、小型浮层 |
| `--le-radius-lg` | 1.25rem | 卡片、对话框 |
| `--le-radius-full` | 9999px | 标签、徽标、进度条 |

同一组控件采用相同圆角。需要更圆润的卡片时，可以在该区域覆盖 `--le-radius-lg`，并检查相邻的阴影和内边距。
