export const formGuidance = {
  input: {
    rationale: '单行输入框最小高度为 2.25rem，圆角用 --le-radius-sm（0.5rem）。静止时用表面色承载正文，聚焦时用主色边线标出正在编辑的位置。标签始终可见，输入后也能辨认字段用途。',
    customization: '调整尺寸时，让同一行的输入框与按钮共享高度。换色时一起检查正文、占位符和焦点轮廓在浅色、深色及无线条风格下的可辨识度。',
    basis: 'focus',
  },
  textarea: {
    rationale: '多行输入复用单行字段的 0.5rem 圆角和表面色，最小高度为 5rem。只允许纵向拉伸，长内容可展开阅读，字段宽度与周围表单保持对齐。',
    customization: '按预期内容调整初始行数与最小高度，保留纵向拉伸或充分的滚动空间。添加字数限制时，让剩余字数和超限提示在字段附近可读。',
    basis: 'forms',
  },
  form: {
    rationale: '标签、字段、提示沿阅读顺序排列，同一字段的内容用 --le-space-2（0.5rem）分隔。提交错误时，字段旁显示可执行的修正提示，并将焦点移到需要修正的位置。',
    customization: '用 label 关联输入控件，用 aria-describedby 关联帮助和错误文案。校验失败时设置 aria-invalid，并告诉用户要补填或更正的内容。增加字段间距时保留标签与对应输入的邻近关系。',
    basis: 'forms',
  },
  choices: {
    rationale: '复选框用带勾的 1rem 方框表示可独立选择的事项，圆角为 0.25rem。主色勾和横杠分别表示已选和部分选中，文字标签也属于点击区域。',
    customization: '保留 label 的点击范围和 fieldset 的组名。可以扩大行高与内边距，并让勾和横杠在浅色与深色背景中保持清晰。',
    basis: 'targets',
  },
  radio: {
    rationale: '单选框用 1rem 圆形图案和居中的主色圆点表示组内互斥选择。标签让选项含义一直可见，整组共享一个名称。',
    customization: '同一组保留同名原生单选框，保留方向键切换。扩大可点击区域时同时扩大标签范围，并检查焦点与选中状态能分别辨认。',
    basis: 'keyboard',
  },
  'native-select': {
    rationale: '选择框采用原生 select，适合从一组明确选项中选一项。支持自定义弹层的浏览器以浅主色标记当前选项，并延续输入框 0.5rem 的外圆角。',
    customization: '给选择框配上可见标签，保持当前值与展开标记清楚可读。自定义下拉样式时同时检查系统选择器和高对比度模式。',
    basis: 'forms',
  },
  switch: {
    rationale: '开关为 2.5 × 1.5rem 的胶囊，关闭用中性色，开启用主色指示色，圆点位置同时传达开关状态。适用于切换后立即生效的设置。',
    customization: '保留稳定的动作标签和开关语义。调整轨道大小时同步计算圆点直径和滑动距离，并保留键盘焦点提示。',
    basis: 'color',
  },
  'input-group': {
    rationale: '路径前缀与正文共用一个 0.5rem 圆角容器，前缀用次要文字色。焦点落在输入时整组高亮，明确前缀属于当前字段。',
    customization: '用 --le-input-group-radius 调整外圆角。把影响提交结果的固定前缀纳入字段值或关联说明，并为组合内的独立按钮保留各自的焦点提示。',
    basis: 'focus',
  },
  combobox: {
    rationale: '可搜索选择把建议紧贴输入位置，用表面色与阴影承载选项，以主色底和焦点轮廓标记当前建议。长列表限制高度并可滚动。',
    customization: '调整弹层边距、圆角或高度时，保持当前选项能滚入视野。保留方向键浏览、Enter 确认、Escape 收起，以及无匹配时的可见说明。',
    basis: 'keyboard',
  },
  slider: {
    rationale: '滑块用主色填充表示相对位置，旁边的数值提供精确读数。轨道默认 0.375rem 高，输入控件高 1.5rem，把视觉细线和可操作区域分开。',
    customization: '用 --le-track-height 调整轨道，保留可命中的拖动范围。按任务设置 min、max 和 step，并让当前值及单位随操作更新。',
    basis: 'targets',
  },
  file: {
    rationale: '文件选择保留系统文件对话框。入口沿用按钮的中性底色和 0.5rem 圆角，旁边显示选取结果，文件状态和操作入口清楚分开。',
    customization: '在字段旁写明可选格式与数量，用 accept 提示系统筛选。若接入上传，分别呈现已选、上传中和上传结果。',
    basis: 'forms',
  },
  number: {
    rationale: '数字输入同时支持直接填写和按步长增减。步进按钮放在同一输入容器内，简短箭头配合各自的可访问名称标明方向。',
    customization: '用 min、max 和 step 表达真实取值范围，把单位放进标签或提示。频繁触屏操作时可放大步进按钮及间距，并保留直接输入。',
    basis: 'targets',
  },
  time: {
    rationale: '时间输入沿用普通输入框的圆角和高度，时钟图标让入口可辨。实际选择由浏览器提供，可沿用平台的时间格式和交互习惯。',
    customization: '用标签说明时间用途。限制时段时配置 min、max 和 step，并在字段旁写明范围。涉及不同地区时明确时区。',
    basis: 'forms',
  },
  'color-picker': {
    rationale: '颜色选择同时给出色样和十六进制值。3 × 2.25rem 的色样沿用字段圆角，旁边的文本便于精确确认和转述颜色。',
    customization: '底色与色样接近时，保留清晰的边界和焦点。允许手动录入色值时，给文本输入配上格式说明，并让两处显示随选择同步更新。',
    basis: 'color',
  },
  otp: {
    rationale: '等宽数字让验证码容易逐位核对。单框用字距分隔数字，分格样式默认每格宽 2.125rem，并按位置提供可访问名称。',
    customization: '通过 --le-otp-cell-size 调整格宽。改变验证码长度时同步更新标签与约束，保留整段粘贴、逐位删除、键盘顺序和系统自动填充。',
    basis: 'forms',
  },
  password: {
    rationale: '密码默认遮盖，显示按钮放在输入旁边以便核对。输入组合用 --le-radius-md（0.875rem），内侧按钮的圆角扣除留白和边线，保持嵌套边缘协调。',
    customization: '按照用途选择 current-password 或 new-password，并允许系统填充和粘贴。调整按钮文字时，让显示状态在视觉和辅助技术中都能识别。',
    basis: 'forms',
  },
  'token-input': {
    rationale: '已加入的词条用胶囊和辅色区分，编辑区沿用标准输入框。词条可换行，长内容不会迫使整个字段变宽。',
    customization: '换色时同时调整辅色底与辅色文字，保留足够对比。移除按钮的名称应包含目标词条，并向用户反馈添加、移除和重复输入。',
    basis: 'status',
  },
  toggle: {
    rationale: '加粗、斜体和下划线能独立启用。每个按钮以 aria-pressed 表达开关状态，按下时用选中底色与对应文字色突出。',
    customization: '保持选中前后的按钮名称稳定。若把文字换成图标，补充可访问名称。把同组按钮放在同一个可命名的容器中。',
    basis: 'keyboard',
  },
  segmented: {
    rationale: '短选项全部可见，便于比较同一查看范围中的互斥选项。0.5rem 圆角与其他控件一致，选中底和边线使用主色。',
    customization: '保留同名原生单选、可见组名和焦点轮廓。为较长的选项留出换行空间，检查选中外观在不同配色下仍能辨认。',
    basis: 'keyboard',
  },
  mentions: {
    rationale: '输入 @ 后在当前输入下方显示匹配候选。使用与可搜索选择相同的选项和焦点样式，让补全动作可预测。',
    customization: '给字段说明触发字符与可搜索的内容。更换候选源或提示文案时，保留方向键选择、确认和取消，并检查插入范围。',
    basis: 'keyboard',
  },
  cascader: {
    rationale: '每一级使用独立的原生选择框。上一级决定下一级可选范围，未具备前置条件的控件显示禁用，窄屏从上往下排列。',
    customization: '为每一级取清楚的名字，解释下一步何时可用。切换上级时清除失效的下级值，并为窄屏的纵向顺序保留层次。',
    basis: 'forms',
  },
  'tree-select': {
    rationale: '目录层级通过缩进和可展开的分支呈现。选择后把名称带回入口并收起列表，保留当前路径的上下文。',
    customization: '为分支和可选项分别提供可读文本。调整缩进或边线后，仍要能辨认父子关系，并保留展开、选择与返回入口的键盘操作。',
    basis: 'keyboard',
  },
  select: {
    rationale: '有限的平面选项通过折叠区展开，选定后在入口保留所选文字。当前项配合浅主色底与文字色，便于重新打开时识别。',
    customization: '保持选项名称简短且具体。用于提交时提供带 name 的隐藏字段承接选中值，并保留方向键、Escape 和焦点回到入口的行为。',
    basis: 'keyboard',
  },
  transfer: {
    rationale: '可选与已选两份具名列表同时呈现，批量移动有明确的添加与移除操作。选中色使用主题的主色选中底与配套文字色。',
    customization: '窄屏可顺序排两份列表，保留各自标签和清晰的移动方向。接入保存时读取已选集合，并在移动后让键盘操作继续可用。',
    basis: 'keyboard',
  },
  upload: {
    rationale: '虚线边界与 0.5rem 圆角标出拖放区域，拖入时以浅主色提示落点。原生文件选择提供另一条入口，队列逐项显示状态及移除操作。',
    customization: '保留可用键盘打开的选择入口。接入实际上传后，为进度、完成和失败提供清楚的状态文本，并确保文件移除会取消对应的上传任务。',
    basis: 'status',
  },
} satisfies Record<string, {
  rationale: string;
  customization: string;
  basis?: 'forms' | 'keyboard' | 'contrast' | 'targets' | 'color' | 'status' | 'focus';
}>;
