import { computed } from 'vue'
import { useRoute, useData } from 'vitepress'

export function useTryItMode() {
  const route = useRoute()

  const { frontmatter } = useData()

  // 当 route.path 或 route.query 变化时会自动重新计算
  const showTryIt = computed(() => {
    // 在客户端环境下检查 URL 查询参数
    const urlParams = new URLSearchParams(route.query)
    return urlParams.get('mode') === 'try-it' && frontmatter.value.httpInfo
  })

  return {
    showTryIt,
  }
}
