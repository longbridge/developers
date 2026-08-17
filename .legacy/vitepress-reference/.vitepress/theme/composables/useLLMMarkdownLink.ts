import { computed } from 'vue'
import { useRoute } from 'vitepress'

export function useLLMMarkdownLink() {
  const router = useRoute()

  const llmMarkdownLink = computed(() => {
    const path = router.path
    // 用正则 匹配 /zh-CN 后面的路径，例如 /zh-CN/docs/llm/index.md，返回 /docs/llm/index.md
    const match = path.match(/^(?:\/zh-CN|\/zh-HK)?(.*)$/)
    if (match) {
      return match[1] + '.md'
    }
    return null
  })

  return {
    llmMarkdownLink,
  }
}
