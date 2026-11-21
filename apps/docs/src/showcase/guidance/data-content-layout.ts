export const dataContentLayoutGuidance = {
  table: {
    rationale: '表头和同行单元格对齐，便于横向比较。状态同时写成文字，排序箭头标出顺序。',
    customization: '单元格默认纵向留 0.5rem、横向留 0.75rem。提高密度时保留排序按钮的可点击区域、表头语义和窄屏横向滚动。',
    basis: 'color',
  },
  steps: {
    rationale: '有序列表让流程顺序清晰。当前步骤通过主色选中底色和 aria-current 标出。',
    customization: '序号圆点默认直径 1.75rem。可调整间距与步名，步骤过多时允许换行，并让当前步骤的视觉和语义状态同步。',
  },
  timeline: {
    rationale: '连续竖线串起事件，日期用等宽数字，当前事件用实心圆点和外圈强调。',
    customization: '标记默认直径 0.75rem，可用 --le-timeline-marker-size 调整。时间和标记仍应与事件标题对齐，当前事件保持明确标识。',
  },
  calendar: {
    rationale: '日期输入和七列日历读写同一个日期，分别支持直接输入与浏览选择。选中日用主色底，焦点环标出键盘操作位置。',
    customization: '面板用 0.875rem 圆角，日期格默认约 2rem。扩大日期格时一并调整面板宽度，更换日期格式时保留双向同步和键盘换日。',
    basis: 'keyboard',
  },
  descriptions: {
    rationale: '用描述列表把名称与值配对。名称弱化，值获得约六成列宽，方便扫读。',
    customization: '根据名称长度调整默认 2∶3 的列宽。窄屏或内容很长时可改成上下排列，保留每项名称和值的对应关系。',
  },
  carousel: {
    rationale: '每次展示一整张内容，滚动对齐帮助用户确认位置。页码和前后按钮说明当前进度与边界。',
    customization: '更换卡片内容时保留横向滚动与键盘切换，图文应随容器缩放。让用户自行决定切换时机。',
    basis: 'keyboard',
  },
  image: {
    rationale: '缩略图保持原比例，点击后在弹窗中查看细节。放大入口和关闭操作都有清晰的名称。',
    customization: '缩略图默认圆角 0.5rem。更换图片时保留有意义的替代文字，限制预览宽度，让用户可按 Esc 关闭并回到触发按钮。',
    basis: 'focus',
  },
  chart: {
    rationale: '单色条用长度表达大小，旁边的分类和数值保留准确读数。轨道沿用进度类组件的样式。',
    customization: '默认轨道高 0.375rem，填充取主题主色。比较多组数据时使用同一量程，并保留单位或实际数值。',
    basis: 'color',
  },
  statistic: {
    rationale: '2rem 的等宽数字突出读数，较弱的标签说明含义。相同位数的读数更新时宽度稳定。',
    customization: '调整字号时统一同排指标的基线。不同量纲应明确写出单位，数字按使用者的语言环境格式化。',
  },
  item: {
    rationale: '链接和补充描述基线对齐。条目用纵向留白和可选分隔线区分。',
    customization: '默认上下各留 0.5rem。加长文字时允许换行，日期或状态等辅助信息保持可辨，完整链接文字可由键盘访问。',
  },
  'virtual-list': {
    rationale: '只渲染视口附近的记录，数据量大时仍能在固定高度内滚动。示例每行 32px。',
    customization: '更改行高时同步设置 rowHeight 与样式。多行内容需要实际测量行高或采用普通列表。',
  },
  tree: {
    rationale: '缩进与分支线一起表示嵌套关系，原生展开控件汇报分支是否打开。',
    customization: '默认每层内边距 1rem、外边距 0.5rem。深层场景可减少缩进或改用分级页面，保留展开控件的名称和状态。',
    basis: 'keyboard',
  },
  'qr-code': {
    rationale: '黑色模块、白色底和四模块宽的留白提升扫描辨识度，主题色切换时也能保持。',
    customization: '用 --le-qr-size 调整默认 9rem 的显示尺寸，保留四周留白和方形比例。对外发布前用预期设备实测扫描，并提供可访问的等效操作。',
  },
  'code-block': {
    rationale: '等宽字保留缩进，柔和主色底与正文分开。工具栏显示语言、复制按钮，结果通过状态消息反馈。',
    customization: '外框默认圆角 0.875rem。改背景时同时检查代码对比度，保留原有换行、文本选择及可获焦的横向滚动区域。',
    basis: 'contrast',
  },
  typography: {
    rationale: '正文行高 1.8 给连续阅读留出空间，标题行高 1.25 保持短标题紧凑。正文宽度限制为 65ch。',
    customization: '根据字体与语言微调行宽和正文行高，保留标题层级。替换引文颜色时检查文字与背景的对比度。',
    basis: 'contrast',
  },
  icon: {
    rationale: '图标放在 1em 的方形区域里，随字号缩放，与旁边的操作文字形成一个整体。',
    customization: '纯装饰图标保持 aria-hidden。仅用图标的交互控件要提供可访问名称，并单独留出足够的点按区域。',
    basis: 'targets',
  },
  util: {
    rationale: '用独立的按钮控制事件监听，按下状态和计数分别说明当前配置与结果。',
    customization: '在替换监听器或销毁组件时调用 listen 返回的清理函数。更新状态文字的同时保留原有键盘操作。',
  },
  direction: {
    rationale: '使用起点和终点表达方向。切换书写方向后，排列随容器的 dir 自动调整。',
    customization: '用逻辑属性设置边距、对齐和位置，并验证 LTR 与 RTL 下的顺序。只翻转表示前进、后退等方向的图标。',
  },
  attachment: {
    rationale: '文件名和移除按钮放在同一组内。外轮廓的圆角由按钮圆角、内边距和 1px 线宽相加而成。',
    customization: '按钮圆角默认 0.5rem，--le-attachment-inset 默认 0.375rem。改留白时保留圆角关系和可读文件名，移除后给键盘焦点一个明确的去处。',
    basis: 'focus',
  },
  message: {
    rationale: '发送者姓名、对齐和底色一起区分来信与发信。保留「跳到最新」，方便用户从较早的消息返回。',
    customization: '气泡默认圆角 0.5rem，宽度上限是容器宽度与 42ch 中的较小值。变更配色时保留作者信息及长文本换行。',
    basis: 'color',
  },
  marker: {
    rationale: '小字号和弱化文字让时间标记退居辅助位置，横线把不同批次分开。',
    customization: '非交互标记沿用 0.75rem 的辅助字号。更换图标或线色时，用文字保留完成、更新等具体语义。',
    basis: 'color',
  },
  trace: {
    rationale: '按实际顺序列出步骤，摘要可展开查看详情，让主列表容易扫读。',
    customization: '每条摘要用简短的动作和对象命名。更换展开图标时保留原生摘要的键盘操作和展开状态。',
    basis: 'keyboard',
  },
  questionnaire: {
    rationale: '一次展示一组相关问题，进度、返回和完成入口帮助用户理解所在位置。',
    customization: '增加步骤时按任务拆分，每步保留题目组标题和当前进度。回退后保留答案，验证失败时让对应内容可见。',
    basis: 'forms',
  },
  'layout-container': {
    rationale: '标准容器最大宽 68.75rem，阅读容器为 52rem。两侧留白随屏幕从 1.5rem 增至 3.5rem。',
    customization: '通过 --le-layout-max-width、--le-layout-reading-width 和 --le-layout-gutter 调整。根据正文与数据内容选择宽度，并检查小屏时的可用空间。',
  },
  layout: {
    rationale: '页眉和页脚横跨容器，侧栏与正文默认按 1∶3 分配剩余宽度，正文优先获得空间。',
    customization: '随侧栏内容调整比例，窄屏可改为单列。保持文档的阅读与焦点顺序和视觉排列一致。',
    basis: 'keyboard',
  },
  grid: {
    rationale: '默认两列等宽，统一的 0.75rem 缝隙维持行列对齐，适合并列比较。',
    customization: '用 --le-columns 和 --le-gap 改列数与缝隙，小屏减少列数，确保内容有空间换行。',
  },
  flex: {
    rationale: '一维排列让一组项目沿同一轴对齐，空间不足时自然换行。',
    customization: '默认缝隙 0.5rem，通过 --le-gap 调整，按实际内容选择分布方式。交互项目的阅读和焦点顺序应一致。',
    basis: 'keyboard',
  },
  space: {
    rationale: '间距变量给一组相关操作统一留白。示例用 1rem 留白，容器默认值为 0.5rem。',
    customization: '用 --le-gap 修改组内间距，或用 le-space--vertical 改成纵向。有关联的操作应比组与组之间更靠近。',
  },
  masonry: {
    rationale: '多栏布局让高低不同的卡片各自保持完整，适合可以独立阅读的短内容。',
    customization: '默认最多两列，目标栏宽 7rem。用 --le-columns 改数量，阅读有严格顺序时用单列或让顺序与文档一致。',
  },
  'aspect-ratio': {
    rationale: '固定比例给媒体预留位置，默认 16∶9，等比铺满可让并排预览更一致。',
    customization: '用 --le-aspect-ratio 切换比例。需要完整展示图中文字或细节时，将 object-fit 改为 contain。',
  },
  separator: {
    rationale: '1px 的线划分相邻的内容主题，线上下各留 0.75rem，让段落边界清楚。',
    customization: '密集内容可调整上下间距与边线色。分隔涉及章节结构时，配合能表达内容范围的标题。',
  },
  'scroll-area': {
    rationale: '内容可在有限高度内浏览，固定的标题在滚动时提供上下文。外框默认圆角为 0.5rem。',
    customization: '用 --le-scroll-height 改默认的 12rem 上限，用 --le-affix-offset 让固定标题避开其他工具栏，并保留滚动区的键盘入口。',
    basis: 'keyboard',
  },
  splitter: {
    rationale: '用户可以在目录和正文之间重新分配空间，同时保留两边的上下文。',
    customization: '控制器默认允许 15% 到 85%，示例从 35% 开始。按内容最小宽度设置上下限，并支持方向键、Home 和 End。',
    basis: 'keyboard',
  },
} as const;
