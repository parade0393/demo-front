/**
 * 启动加载插件，用于控制应用启动时的loading效果
 */

// 隐藏加载效果
export function hideLoading(): void {
  const loadingEl = document.getElementById('app-loading')
  if (loadingEl) {
    // 先设置透明度为0，产生渐隐效果
    loadingEl.style.opacity = '0'

    // 300ms后彻底移除元素
    setTimeout(() => {
      loadingEl.remove()
    }, 300)
  }
}

// 显示启动进度
export function updateLoadingTip(tip: string): void {
  const tipEl = document.querySelector('#app-loading .loading-tip')
  if (tipEl) {
    tipEl.textContent = tip
  }
}

// 测量启动时间
let startTime = Date.now()

export function getStartupTime(): number {
  return Date.now() - startTime
}

// 重置启动时间
export function resetStartupTime(): void {
  startTime = Date.now()
}
