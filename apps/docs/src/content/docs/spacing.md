---
title: 间距
description: 用间距变量统一内边距、内容分组和布局间隔。
group: 设计规范
order: 50
showcase:
  anchor: spacing
  order: 30
  preview: after
---

## 间距尺度

间距以 `rem` 为单位。可用的 `--le-space-*` 档位为 0、1、2、3、4、6、8、12、16，数字表示以 0.25rem 为单位的长度。

## 组织内容

用 2 档（0.5rem）将标签和输入框放在一起，用 4 档（1rem）拉开表单字段，用 8 档（2rem）分开内容组。为同级元素选择相同的间距。

```css
.form-fields {
  display: grid;
  gap: var(--le-space-4);
  padding: var(--le-space-6);
}
```
