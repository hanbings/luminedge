---
title: 字体
description: 使用一致的字号、字重、行高与字体族。
group: 设计规范
order: 40
showcase:
  anchor: typography
  order: 20
  preview: after
---

## 字号和行高

正文默认用 `--le-font-size-base`（1rem）和 `--le-line-height-normal`（1.6）。标题可用 `--le-font-size-lg`（1.5rem）或 `--le-font-size-xl`（2rem），搭配 `--le-line-height-tight`（1.25）。次要文字可用 `--le-font-size-sm`（0.875rem）和 `--le-font-size-xs`（0.75rem）。

字重变量包括 `regular`、`medium`、`semibold` 和 `bold`，对应 400、500、600 和 700。

## 字体族

`--le-font-sans` 优先使用系统无衬线字体，`--le-font-mono` 用于代码与需要等宽对齐的值。在项目中加载自定义字体后，可在整页或相应内容区域覆盖这两个变量。
