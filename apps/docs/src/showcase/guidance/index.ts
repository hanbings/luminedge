import { dataContentLayoutGuidance } from './data-content-layout';
import { formGuidance } from './forms';
import { navigationFeedbackGuidance } from './navigation-feedback';

export const principles = {
  forms: { label: 'W3C 表单标签指南', href: 'https://www.w3.org/WAI/tutorials/forms/labels/' },
  keyboard: { label: 'ARIA 键盘交互指南', href: 'https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/' },
  focus: { label: 'WCAG 2.4.7 焦点可见', href: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html' },
  contrast: { label: 'WCAG 1.4.3 最低对比度', href: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html' },
  color: { label: 'WCAG 1.4.1 颜色的使用', href: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html' },
  targets: { label: 'WCAG 2.5.8 最小点击目标', href: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html' },
  status: { label: 'WCAG 4.1.3 状态消息', href: 'https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html' },
  dialog: { label: 'ARIA 模态对话框模式', href: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/' },
};

interface Guidance {
  rationale: string;
  customization: string;
  basis?: keyof typeof principles;
}

export const guidance: Record<string, Guidance> = {
  ...formGuidance,
  ...navigationFeedbackGuidance,
  ...dataContentLayoutGuidance,
  button: {
    rationale: '主要按钮靠底色突出，次要按钮用透明底保持层级。默认高度至少 2.25rem（36px），圆角用 --le-radius-sm（0.5rem，8px），和输入框并排时能对齐。',
    customization: '用 --le-color-control 和 --le-color-control-text 成对调底色与文字，悬停色用 --le-color-control-hover。调整尺寸后保留足够的点击区域和清晰的键盘焦点。',
    basis: 'targets',
  },
  card: {
    rationale: '卡片用浅主色 --le-color-primary-soft 把相关内容收在一起，留白和 --le-radius-lg（1.25rem，20px）共同让它和较紧凑的控件区分开。',
    customization: '同组卡片使用统一圆角和内边距。替换背景时一起检查正文和次要文字的对比度，保留标题与正文的层级。',
    basis: 'contrast',
  },
  avatar: {
    rationale: '头像默认占 2.25rem（36px）的方形空间，50% 圆角能让图片和文字占位保持相同轮廓。浅主色底与深主色字也让无照片时仍能识别。',
    customization: '同步缩放宽高以保持圆形。承载身份信息时提供姓名或等效标签，旁边已有姓名时可以将重复的头像设为装饰。',
    basis: 'contrast',
  },
  dialog: {
    rationale: '遮罩压低背景层级，原生模态对话框把操作集中到前景。默认宽度上限为 28rem，--le-radius-lg（1.25rem，20px）对应独立于页面的表面。',
    customization: '宽度随内容和屏幕变化。保留可见关闭入口与 Esc 行为，并在关闭后把焦点送回触发按钮。需要确认不可撤销的操作时，清楚写出后果。',
    basis: 'dialog',
  },
  annotation: {
    rationale: '手绘下划线复用主色，把注意力引到几个词，同时保留文本原本的字号和行距。',
    customization: '优先标注短语，给线条留出与字形的间距。重要信息也用文字表达，保证读者在跳过动画或分辨不出颜色时仍能理解。',
    basis: 'color',
  },
};
