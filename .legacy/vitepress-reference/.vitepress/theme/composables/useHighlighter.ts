import { provide } from 'vue'
import { createHighlighter } from 'shiki/bundle/web'

// 单例：所有页面共享同一个 highlighter 实例
const highlighterPromise = createHighlighter({
  themes: ['vitesse-dark', 'vitesse-light'],
  langs: ['json'],
})

export function useHighlighter() {
  // 提供全局的代码高亮器
  provide('highlighter', highlighterPromise)

  return {
    highlighter: highlighterPromise,
  }
}
