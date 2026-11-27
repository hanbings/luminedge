---
title: 色彩
description: 选择语义颜色、主题色和深浅模式。
group: 设计规范
order: 30
showcase:
  anchor: colors
  order: 10
  preview: after
---

## 色阶与语义

主色、辅色、成功、警告、危险和中性色都按 `50` 到 `900` 排列，数值越大颜色越深。写组件样式时，可以用 `--le-color-primary-soft` 与 `--le-color-primary-text` 搭配背景和正文，用 `--le-color-focus` 标记键盘焦点。

```css
.notice {
  background: var(--le-color-primary-soft);
  color: var(--le-color-primary-text);
}
```

## 主题与线条

未指定 `data-le-theme` 时，页面跟随系统配色。可在整页或局部用 `data-le-theme="light"` 或 `data-le-theme="dark"` 固定模式，语义色随模式调整。

主色选项包括雾蓝 `blue`、薄荷青 `teal`、藤紫 `violet` 与玫瑰粉 `rose`。辅色根据雾蓝与杏橙的各阶配对计算，500 阶在 HSL 色轮上旋转约 176°，其余各阶使用各自的色相、饱和度与明度校准。

```html
<section data-le-accent="teal" data-le-lines="off">
  <button type="button" class="le-button">保存</button>
</section>
```

`data-le-lines="off"` 隐藏装饰边线，同时保留交互焦点与状态提示。子区域可以用 `data-le-lines="on"` 恢复线条。
