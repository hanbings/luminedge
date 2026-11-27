---
title: 颜色选择
description: 用色盘、色相滑块和 HEX 输入编辑不透明的 sRGB 颜色。
group: 组件
order: 96
showcase:
  anchor: component-example-color-picker
  preview: before
---

## 标记与初始化

用有标签的 `<input type="color" name="highlight">` 保留原生表单字段。增强界面是一个初始隐藏的 `<details class="le-color-picker">`，包含以下元素。

| 元素 | 必需的标记 |
| --- | --- |
| `summary` 内的颜色文本 | `data-le-color-value` |
| 色盘 | `data-le-color-plane` |
| 色相滑块 | `type="range"`、`min="0"`、`max="359"`、`step="1"`、`data-le-color-hue` |
| HEX 文本输入框 | `type="text"`、`data-le-color-hex` |
| 错误信息 | `data-le-color-error` |
| 确定按钮 | `type="button"`、`data-le-color-confirm` |

为色相滑块和 HEX 输入框提供名称，让用户可用键盘直接输入颜色。

```js
import { createColorPicker } from '@luminedge/ui';

const picker = document.querySelector('details.le-color-picker');
const color = document.querySelector('input[name="highlight"]');
const controller = createColorPicker(picker, color);
```

## 表单行为

HEX 支持六位十六进制，开头的 `#` 可省略。确定后由原生字段提交 `#rrggbb`。当值变化时，控制器在原生字段上发出 `input` 和 `change`。设置 `alpha` 或将 `colorspace` 设为 `limited-srgb` 之外的值时，保留浏览器原生控件。应用直接设置 `color.value` 后，可调用 `controller.refresh()` 同步面板。
