export function ensureKeyframes() {
  if (!document.getElementById('luminedge-annotation-keyframes')) {
    const style = document.createElement('style')
    style.id = 'luminedge-annotation-keyframes'
    style.textContent = `@keyframes rough-notation-dash { to { stroke-dashoffset: 0; } }`
    document.head.appendChild(style)
  }
}
