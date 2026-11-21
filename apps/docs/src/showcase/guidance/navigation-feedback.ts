export const navigationFeedbackGuidance: Record<string, {
  rationale: string;
  customization: string;
  basis?: 'forms' | 'keyboard' | 'contrast' | 'targets' | 'color' | 'status' | 'focus';
}> = {
  tabs: {
    rationale: '选项卡切换同一位置的内容。当前项用主色文字和 3px 下划线标记，独立的描边表示键盘焦点，让人能区分正在浏览和即将操作的选项。',
    customization: '可以调整下划线长度和间距。保留选项与面板的关联、方向键切换和可见的焦点样式。',
    basis: 'keyboard',
  },
  dropdown: {
    rationale: '「更多操作」收起低频动作，给常用动作留出位置。菜单外框用 0.5rem 圆角，菜单项的内圆角扣除 0.25rem 内边距和 1px 边框，让内外弧线对齐。',
    customization: '调整菜单圆角或内边距时同步调整内圆角。保留描述性操作名与 Esc 关闭行为，把高频操作放在页面上。',
    basis: 'keyboard',
  },
  tooltip: {
    rationale: '工具提示用柔和主色背景与 0.5rem 圆角承载一句补充说明。把说明贴近触发器，便于在操作前就地阅读。',
    customization: '用 aria-describedby 把说明与触发器关联，支持悬停、聚焦与 Esc 关闭。有按钮或关键说明时用可点击打开的气泡或直接展示。',
    basis: 'keyboard',
  },
  popover: {
    rationale: '气泡面板由点击明确打开，可以容纳较长说明和操作。中性色表面、小面板的 0.875rem 圆角和阴影帮助读者辨认浮层范围。',
    customization: '根据内容调整默认最大宽度 20rem，并保留窄屏边距。交互面板要有可达的关闭入口，打开后能用键盘访问其中的操作。',
    basis: 'keyboard',
  },
  pagination: {
    rationale: '高亮当前页并禁用超出范围的前后翻页操作，方便用户判断位置。每个页码至少 2rem 见方，使用 0.5rem 圆角。',
    customization: '页数很多时只显示首尾和当前页附近的页码，保留 aria-current="page"。缩小字号时也要保留足够的点击区域。',
    basis: 'targets',
  },
  breadcrumb: {
    rationale: '面包屑按上级到当前页排列。上级用带下划线的链接，当前页用普通文字标记，斜线只负责视觉分隔。',
    customization: '层级更新时同步调整链接和当前位置。路径过长可以换行，装饰性分隔符保留 aria-hidden。',
  },
  accordion: {
    rationale: '折叠面板用原生展开标记显示状态。标题使用低对比度表面和 0.5rem 圆角，面板内容在触发器下方就地展开。',
    customization: '调整标题颜色时保留展开标记和键盘焦点。只有用户不需要比较多个面板时，才通过相同的 name 让同组面板互斥。',
    basis: 'keyboard',
  },
  drawer: {
    rationale: '抽屉从页面边缘展开，适合展示当前页面上的对象详情。面板贴边使用直角，默认宽度上限为 32rem，窄屏给遮罩留出可见区域。',
    customization: '按内容调整局部的 --le-drawer-width，保留窄屏限宽、面板内部滚动、明确的关闭入口和关闭后的焦点恢复。',
    basis: 'focus',
  },
  command: {
    rationale: '命令面板把焦点直接放到搜索框，结果沿下方排列。结果列表位于对话框的常规文档流中，避免在同一层再叠一重阴影。',
    customization: '改快捷键时同步更新按钮上的提示和 aria-keyshortcuts。保留可点击的入口，以及方向键浏览、回车确认和 Esc 关闭。',
    basis: 'keyboard',
  },
  anchor: {
    rationale: '锚点用原生链接跳到同页目标。带下划线的链接提示可以点击，长列表会换行。',
    customization: '标题改名时尽量保留原 ID，链接使用能说明目标的名称。有固定页头时给跳转目标预留滚动间距，确保标题可见。',
  },
  sidebar: {
    rationale: '示例侧栏沿行首打开，默认宽度 18rem。柔和主色底搭配主色文字标记当前位置，悬停与聚焦各有独立样式。',
    customization: '侧栏可按导航标签的长度加宽。保留导航名称、当前位置和关闭入口，也要确认窄屏能看到长标签。',
    basis: 'focus',
  },
  'navigation-menu': {
    rationale: '站点导航用可展开的标题组织链接，展开后的项目保留链接语义，用户可以直接访问目标或用浏览器在新标签页打开。',
    customization: '入口过多时优先缩短分组名称并允许换行。保持原生链接和可聚焦的展开标题，同时保留方向键导航。',
    basis: 'keyboard',
  },
  collapsible: {
    rationale: '单项折叠用原生详情元素承载可选阅读内容，展开后仍停留在原位置。原生三角标记随状态变化。',
    customization: '触发标题要说明展开后能看到什么。任务的必填信息或关键错误应直接展示，辅助说明可按需展开。',
  },
  menubar: {
    rationale: '菜单栏把相关操作放进「文件」「编辑」等常驻标题。左右方向键在组间移动，上下方向键浏览组内项目。',
    customization: '调整组序时让视觉顺序和键盘顺序一致。菜单项保持按行排列，留出足够点击范围与清晰的焦点样式。',
    basis: 'keyboard',
  },
  'context-menu': {
    rationale: '快捷菜单出现在操作点附近，减少鼠标移动。可见触发按钮也让触屏与键盘用户能找到这些操作。',
    customization: '保留点击、右键与 Shift+F10 等打开方式，并让菜单定位受视口限制。关闭后把焦点交还触发按钮。',
    basis: 'keyboard',
  },
  'hover-card': {
    rationale: '预览靠近触发链接，使用独立表面、0.5rem 圆角和阴影。宽度取 16rem 与 70vw 的较小值，给窄屏留出余量。',
    customization: '保持悬停和聚焦都能显示，鼠标移入卡片时仍可阅读，Esc 可以关闭。预览承载补充信息，主要内容放在目标页。',
    basis: 'keyboard',
  },
  sheet: {
    rationale: '面板从视口底部承载短任务，靠边的一侧使用直角，顶部沿用对话框的 1.25rem 圆角。默认最多占 85vh，必要时内部滚动。',
    customization: '调整高度时确认软键盘弹出后仍能看到输入框和关闭操作。为更长的流程提供页面空间，保留 Esc 和关闭后的焦点返回。',
    basis: 'focus',
  },
  'float-button': {
    rationale: '把「返回顶部」放在滚动区末端附近，长列表滚动时也能访问。通用悬浮定位默认距行末和底部各 1rem。',
    customization: '在有底部导航或安全区的页面调整偏移，避免遮住内容。箭头图标要有可读的操作名称，并留出足够点击面积。',
    basis: 'targets',
  },
  alert: {
    rationale: '提示条用 0.5rem 圆角和柔和背景托住文本。一般提示沿用主色色阶，成功、警告和危险分别使用各自的语义色配对。',
    customization: '同时调整前景、背景和边框，检查浅色与深色主题的文字对比。用文案说明是什么状态，以及是否需要行动。',
    basis: 'color',
  },
  tag: {
    rationale: '用紧贴文字的全圆角标出类别或状态，形状与矩形按钮有所区分。浅底配同一色系的文字，既能分组又留出正文的视觉层次。',
    customization: '长标签可增加横向留白。颜色成对调整，状态也要写在标签上，例如「待处理」。触发筛选或移除时使用有明确名称的交互控件。',
    basis: 'color',
  },
  badge: {
    rationale: '徽标用全圆角和 1.5rem 的最小宽度承载计数，单个数字与多位数字都能保持紧凑。默认填充采用主色的选中色阶以突出计数。',
    customization: '增加位数时允许徽标横向伸展。给计数加上可读的对象名，例如「3 条未读消息」，调整背景色时复查数字对比度。',
    basis: 'contrast',
  },
  progress: {
    rationale: '进度条沿用 0.375rem 高的全圆角轨道，主色填充的长度表示完成比例，并以文本展示具体数值。',
    customization: '通过 --le-track-height 调整粗细，并保留进度的名称与数值。总量未知时省略 value，为减少动态效果的用户保留可读的加载状态。',
    basis: 'status',
  },
  spinner: {
    rationale: '加载指示器用直径 1.25rem、线宽 2px 的圆环表示任务正在进行，较深的主色弧段沿较浅的圆环移动。',
    customization: '调整尺寸时保持圆形，在旁边写明正在加载什么。启用减少动态效果时停掉旋转，继续显示状态文字。',
    basis: 'status',
  },
  meter: {
    rationale: '计量条表示某个范围内的量值，例如空间已用 6 GB，容量共 10 GB。它沿用进度条的 0.375rem 轨道，让长度都对应占比。',
    customization: '调整 min、max、value 时同步标注范围和单位。如果需要阈值提醒，加上明确的文字或标记来说明阈值含义。',
    basis: 'color',
  },
  toast: {
    rationale: '通知用小阴影和 0.875rem 圆角区分浮层与正文。状态区域播报结果，触发操作后的键盘焦点留在原处。',
    customization: '默认等用户关闭。设置自动消失前应给足阅读时间，并保持重要结果可在页面中查到。保留关闭按钮的可读名称。',
    basis: 'status',
  },
  empty: {
    rationale: '空状态用短标题说明缺少什么，说明文字交代内容出现的条件。留白和标题字重形成层次，关闭装饰线后仍可阅读。',
    customization: '按场景区分尚未添加和筛选无结果，在有直接解决方式时加入对应操作，例如添加记录或清空筛选。',
  },
  skeleton: {
    rationale: '骨架沿用 0.5rem 圆角和中性控件色，三条不同长度的静态占位模拟内容轮廓，避免加载前后布局突然移动。',
    customization: '根据实物高度和行数调整 --le-skeleton-width 与 --le-skeleton-height。让占位块对辅助技术隐藏，并在内容就绪后清除繁忙状态。',
    basis: 'status',
  },
  'alert-dialog': {
    rationale: '确认对话框把高影响操作及后果集中展示，默认焦点放在「取消」，减少误触。较大的 1.25rem 圆角与遮罩帮助辨认弹层边界。',
    customization: '确认按钮写出具体行为，说明会影响哪条记录。改变配色时继续清楚地区分取消和确认，并保留安全的初始焦点。',
    basis: 'focus',
  },
  popconfirm: {
    rationale: '气泡确认适合能在原地说明的短操作。面板用 0.875rem 圆角和轻阴影，布局中明确提供取消和执行两个操作。',
    customization: '保持问题和按键文案简短，给键盘用户可达的取消路径。复杂或不可逆的后果使用能完整展示说明的确认对话框。',
    basis: 'keyboard',
  },
  result: {
    rationale: '结果依次呈现标题、实际变化与后续去向，例如先说明整理完成，再说明归档了几条草图，最后提供查看链接。',
    customization: '按真实操作结果更新文案。异步更新时按需用状态区域播报，失败时给出可恢复的下一步。',
    basis: 'status',
  },
  tour: {
    rationale: '每次只解释一个目标，用 2px 主色描边指出对应元素，并显示当前步和总步数，帮助用户判断剩余长度。',
    customization: '让每步说明对应一个具体动作。保留上一步、退出和最后一步的完成文案，确保放大页面后仍能查看目标与控件。',
    basis: 'focus',
  },
  watermark: {
    rationale: '水印以 16% 不透明度作为独立覆盖层，指示文档状态，同时允许指针操作和选取正文。',
    customization: '配合正文对比度调整水印密度和透明度。草稿等关键状态也要写在正文中，确保水印隐藏时依然可读。',
    basis: 'contrast',
  },
  'border-beam': {
    rationale: '1px 主色渐变沿现有圆角运动，把注意力引到当前预览的边缘。用户启用减少动态效果时，渐变保持静止。',
    customization: '沿用容器圆角，按需调整渐变色或 2.5 秒周期。选中和焦点等状态仍要有独立的静态标记。',
    basis: 'focus',
  },
};
