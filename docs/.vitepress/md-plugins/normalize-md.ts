import MarkdownIt from 'markdown-it'

interface MarkdownItCoreState {
  tokens: any[]
  src: string
  env: Record<string, any>
  inlineMode: boolean
  md: MarkdownIt
}

/**
 * 检查文档是否已有 h1 标签
 * @param tokens - MarkdownIt tokens 数组
 * @returns 是否已有 h1 标签
 */
function hasH1Tag(tokens: any[]): boolean {
  return tokens.some((token) => token.type === 'heading_open' && token.tag === 'h1')
}

/**
 * 创建 h1 标签的 tokens
 * @param title - 标题文本
 * @returns h1 标签的 tokens 数组
 */
function createH1Tokens(title: string): any[] {
  return [
    {
      type: 'heading_open',
      tag: 'h1',
      attrs: null,
      map: null,
      nesting: 1,
      level: 0,
      children: null,
      content: '',
      markup: '#',
      info: '',
      meta: null,
      block: true,
      hidden: false,
    },
    {
      type: 'inline',
      tag: '',
      attrs: null,
      map: null,
      nesting: 0,
      level: 1,
      children: [
        {
          type: 'text',
          tag: '',
          attrs: null,
          map: null,
          nesting: 0,
          level: 0,
          children: null,
          content: title,
          markup: '',
          info: '',
          meta: null,
          block: false,
          hidden: false,
        },
      ],
      content: title,
      markup: '',
      info: '',
      meta: null,
      block: true,
      hidden: false,
    },
    {
      type: 'heading_close',
      tag: 'h1',
      attrs: null,
      map: null,
      nesting: -1,
      level: 0,
      children: null,
      content: '',
      markup: '#',
      info: '',
      meta: null,
      block: true,
      hidden: false,
    },
  ]
}

/**
 * 在文档开头添加 h1 标签
 * @param state - MarkdownIt 状态对象
 * @param title - 标题文本
 */
function addH1AtBeginning(state: MarkdownItCoreState, title: string): void {
  const h1Tokens = createH1Tokens(title)

  // 在文档开头插入 h1 tokens
  state.tokens.unshift(...h1Tokens)
}

/**
 * Normalize Markdown 插件
 * 如果文档没有 h1 标签，则使用 frontmatter 的 title 生成 h1 标签
 * 只对 layout 没有定义，或者 layout 为 'doc' 的文档生效
 */
export const NormalizeMdPlugin = (md: MarkdownIt) => {
  md.core?.ruler.push('normalize-md', (state: MarkdownItCoreState) => {
    // 获取 frontmatter 中的 layout
    const layout = state.env.frontmatter?.layout

    // 只对 layout 没有定义，或者 layout 为 'doc' 的文档生效
    // 注意：layout: false 是 falsy，需要单独判断
    if (layout === false || (layout && layout !== 'doc')) {
      return
    }

    // 检查是否已有 h1 标签
    const hasH1 = hasH1Tag(state.tokens)

    if (!hasH1) {
      // 从 frontmatter 获取 title
      const title = state.env.frontmatter?.title || state.env.title

      if (title && typeof title === 'string' && title.trim()) {
        // 添加 h1 标签到文档开头
        addH1AtBeginning(state, title.trim())
      }
    }
  })
}
