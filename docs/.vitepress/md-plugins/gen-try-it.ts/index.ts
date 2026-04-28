import MarkdownIt from 'markdown-it'
import * as cheerio from 'cheerio'
import type { ParametersTable, ParameterRow, HttpInfo } from '../../types'

interface MarkdownItCoreState {
  tokens: any[]
  src: string
  env: Record<string, any>
  inlineMode: boolean
  md: MarkdownIt
}

/**
 * 从 HTML 中解析 Parameters 表格
 * @param html - HTML 字符串
 * @returns 解析出的参数表格数据
 */
function parseParametersTable(html: string): ParametersTable | null {
  const $ = cheerio.load(html)

  // 查找 "Parameters" 标题（支持多语言：英文、简体中文、繁体中文）
  const parametersHeading = $('h3').filter((_, el) => {
    const text = $(el).text().trim()
    return (
      text.includes('Parameters') ||
      text === 'Parameters' ||
      text.includes('请求参数') ||
      text === '请求参数' ||
      text.includes('請求參數') ||
      text === '請求參數'
    )
  })

  if (parametersHeading.length === 0) {
    return null
  }

  // 查找该标题后的第一个表格
  const table = parametersHeading.nextAll('table').first()

  if (table.length === 0) {
    return null
  }

  const parameters: ParameterRow[] = []

  // 解析表格行（跳过表头）
  table.find('tbody tr').each((_, row) => {
    const cells = $(row).find('td')

    if (cells.length >= 4) {
      const parameter: ParameterRow = {
        name: $(cells[0]).text().trim(),
        type: $(cells[1]).text().trim() as ParameterRow['type'],
        required: $(cells[2]).text().trim(),
        description: $(cells[3]).html()?.trim(),
      }

      if (parameter.name && parameter.type && parameter.required && parameter.description) {
        parameters.push(parameter)
      }
    }
  })

  return {
    title: 'Parameters',
    parameters,
  }
}

/**
 * 从 HTML 中解析 Request 表格中的 HTTP 信息
 * @param html - HTML 字符串
 * @returns 解析出的 HTTP 信息
 */
function parseRequestTable(html: string): HttpInfo | null {
  const $ = cheerio.load(html)

  // 查找 "Request" 标题（支持多语言：英文、简体中文、繁体中文）
  const requestHeading = $('h2').filter((_, el) => {
    const text = $(el).text().trim()
    return (
      text.includes('Request') ||
      text === 'Request' ||
      text.includes('请求') ||
      text === '请求' ||
      text.includes('請求') ||
      text === '請求'
    )
  })

  if (requestHeading.length === 0) {
    return null
  }

  // 查找该标题后的第一个表格
  const table = requestHeading.nextAll('table').first()

  if (table.length === 0) {
    return null
  }

  let httpMethod = ''
  let httpUrl = ''

  // 解析表格行，查找 HTTP Method 和 HTTP URL
  // 需要同时检查直接的 tr 和 tbody 中的 tr
  const rows = table.find('tr, tbody tr')
  rows.each((_, row) => {
    const cells = $(row).find('td')

    if (cells.length >= 2) {
      const key = $(cells[0]).text().trim()
      const value = $(cells[1]).text().trim()

      if (key === 'HTTP Method') {
        httpMethod = value
      } else if (key === 'HTTP URL') {
        httpUrl = value
      }
    }
  })

  if (httpMethod && httpUrl) {
    return {
      method: httpMethod,
      url: httpUrl,
    }
  }

  return null
}

/**
 * 在首个段落后添加 TryIt 组件
 * @param state - MarkdownIt 状态
 * @param httpInfo - HTTP 信息
 * @param parametersTable - 参数表格
 */
function addTryItComponent(state: MarkdownItCoreState) {
  // 查找第一个段落
  let firstParagraphIndex = -1
  for (let i = 0; i < state.tokens.length; i++) {
    if (state.tokens[i].type === 'paragraph_open') {
      firstParagraphIndex = i
      break
    }
  }

  if (firstParagraphIndex === -1) {
    return // 没有找到段落
  }

  // 查找对应的 inline token（通常是 paragraph_open 的下一个 token）
  const inlineTokenIndex = firstParagraphIndex + 1
  if (inlineTokenIndex >= state.tokens.length || state.tokens[inlineTokenIndex].type !== 'inline') {
    return
  }

  const inlineToken = state.tokens[inlineTokenIndex]

  // 创建 TryIt 组件的 HTML 内容
  const tryItHtml = '<TryIt/>'

  // 创建新的 html_inline token
  const htmlInlineToken = {
    type: 'html_inline',
    tag: '',
    attrs: null,
    map: null,
    nesting: 0,
    level: 0,
    children: null,
    content: tryItHtml,
    markup: '',
    info: '',
    meta: null,
    block: false,
    hidden: false,
  }

  // 将 html_inline token 添加到 inline token 的 children 数组末尾
  if (!inlineToken.children) {
    inlineToken.children = []
  }
  inlineToken.children.push(htmlInlineToken)

  // 更新 inline token 的 content
  inlineToken.content = inlineToken.content + tryItHtml

  return state
}

export const GenTryItPlugin = (md: MarkdownIt) => {
  md.core?.ruler.push('gen-try-it', (state: MarkdownItCoreState) => {
    // 检查 renderer 是否存在
    if (!md.renderer) {
      return
    }

    // 将 markdown 渲染为 HTML
    const html = md.renderer.render(state.tokens, md.options, state.env)

    // 解析 Parameters 表格
    const parametersResult = parseParametersTable(html)

    if (parametersResult) {
      // 将解析结果存储到环境变量中，供后续使用
      state.env.parametersTable = parametersResult
    }

    // 解析 Request 表格中的 HTTP 信息
    const httpResult = parseRequestTable(html)
    if (httpResult) {
      // 将 HTTP 信息存储到环境变量中，供后续使用
      state.env.httpInfo = httpResult
    }
    if (httpResult) {
      if (!state.env.frontmatter) {
        state.env.frontmatter = {}
      }

      state.env.frontmatter.httpInfo = httpResult
      state.env.frontmatter.parametersTable = parametersResult || {}
    }

    // 将解析结果写入 frontmatter 中供其他组件访问
    if (httpResult || parametersResult) {
      // 确保 frontmatter 存在
      if (!state.env.frontmatter) {
        state.env.frontmatter = {}
      }
    }
  })
}
