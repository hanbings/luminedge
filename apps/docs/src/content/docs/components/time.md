---
title: 时间选择
description: 用分钟精度的时间面板增强原生时间字段。
group: 组件
order: 95
showcase:
  anchor: component-example-time
  preview: before
---

## 标记与初始化

用有标签的 `<input type="time" name="time">` 提供原生表单字段，并准备一个初始隐藏的 `<details class="le-time-picker">`。其中需要以下元素。

| 元素 | 必需的标记 |
| --- | --- |
| `summary` 内的时间文本 | `data-le-time-value` |
| 小时与分钟的 `select` | `data-le-time-hour`、`data-le-time-minute`，选项值分别为 `00`–`23` 和 `00`–`59` |
| 确定按钮 | `type="button"`、`data-le-time-confirm` |
| 错误信息 | `data-le-time-error` |

可另加标记 `data-le-time-clear` 的清除按钮，必填字段会隐藏该按钮。用 `aria-labelledby` 将 `summary` 与字段名称及当前时间关联。

```js
import { createTimePicker } from '@luminedge/ui';

const picker = document.querySelector('details.le-time-picker');
const time = document.querySelector('input[name="time"]');
const controller = createTimePicker(picker, time);
```

## 表单行为

确定后将 `HH:mm` 写入原生字段，表单使用字段的 `name` 提交，并遵循 `required`、`min`、`max` 和 `step`。当值变化时，控制器在原生字段上发出 `input` 和 `change`。应用直接设置 `time.value` 后，可调用 `controller.refresh()` 同步面板。
