import { describe, expect, it } from 'vitest'
import { hasH1, parseAttrs, renderMarkdownExport } from './markdown-export'

describe('renderMarkdownExport', () => {
  it('正文没有一级标题时，开头补 frontmatter title；命令行块里的 # 注释不算标题', () => {
    const body = '\nGet dividend history.\n\n<CliCommand>\n# Dividends of Tesla\nlongbridge dividend TSLA.US\n</CliCommand>\n\n## Parameters\n'
    const md = renderMarkdownExport({ title: 'Dividends', body, locale: 'en' })
    expect(md.split('\n')[0]).toBe('# Dividends')
    expect(md).toContain('Get dividend history.')
    // 命令行块原样保留
    expect(md).toContain('<CliCommand>\n# Dividends of Tesla')
  })

  it('已有一级标题（代码块外）时不重复补；代码块里的 # 不算', () => {
    const withH1 = '# Getting Started\n\nIntro.\n'
    expect(renderMarkdownExport({ title: 'Getting Started', body: withH1, locale: 'en' })).toBe(withH1)
    const onlyInCode = 'Intro.\n\n```bash\n# not a heading\nls\n```\n'
    expect(hasH1(onlyInCode)).toBe(false)
    expect(renderMarkdownExport({ title: 'Intro', body: onlyInCode, locale: 'en' }).startsWith('# Intro\n\n')).toBe(true)
  })

  it('SDKLinks 展开成方法名和各语言 SDK 参考链接，网址与网页组件同一套规则', () => {
    const body = 'Text.\n\n<SDKLinks module="quote" klass="QuoteContext" method="brokers" />\n\n## Parameters\n'
    const md = renderMarkdownExport({ title: 'Brokers', body, locale: 'zh-CN' })
    expect(md).not.toContain('<SDKLinks')
    expect(md).toContain('## SDK Links')
    expect(md).toContain('SDK 方法：`brokers`')
    expect(md).toContain(
      '- Python: [longbridge.openapi.QuoteContext.brokers](https://longbridge.github.io/openapi/python/reference_all/#longbridge.openapi.QuoteContext.brokers)'
    )
    expect(md).toContain('- Go: [QuoteContext.Brokers](https://pkg.go.dev/github.com/longbridge/openapi-go/quote#QuoteContext.Brokers)')
    // C++ 走锚点表
    expect(md).toContain('classlongbridge_1_1quote_1_1_quote_context.html#af818331256982c8132844bc0f38183fb')
  })

  it('SDKLinks 的 :title="false" 不出小标题，hideGo 去掉 Go 行', () => {
    const body = '<SDKLinks :title="false" module="trade" klass="TradeContext" method="set_on_grid_order_changed" java="setOnGridOrderChange" hideGo />\n'
    const md = renderMarkdownExport({ title: 'Trade Push', body, locale: 'en' })
    expect(md).not.toContain('## SDK Links')
    expect(md).toContain('SDK method: `set_on_grid_order_changed`')
    expect(md).not.toContain('- Go:')
    expect(md).toContain('TradeContext.setOnGridOrderChange')
  })

  it('QuotePermission 换成所需行情权限说明，文字取 quote-permissions.yaml，按页面语言', () => {
    const body = 'Push.\n\n<QuotePermission command="brokers" />\n\n<SDKLinks module="quote" klass="QuoteContext" method="set_on_brokers" />\n'
    const en = renderMarkdownExport({ title: 'Brokers', body, locale: 'en' })
    expect(en).not.toContain('<QuotePermission')
    expect(en).toMatch(/^> \*\*Quote Permission Required · .+\*\*$/m)
    expect(en).toContain('> _OpenAPI quote perms are separate from App/Web perms_')
    const hk = renderMarkdownExport({ title: '經紀隊列', body, locale: 'zh-HK' })
    expect(hk).toMatch(/^> \*\*行情權限要求 · .+\*\*$/m)
  })

  it('代码块和行内代码里的组件示例原样保留', () => {
    const body =
      '# Style\n\nUse the `<SDKLinks module="trade" method="x" />` tag:\n\n```markdown\n<SDKLinks module="trade" klass="TradeContext" method="submit_order" />\n```\n'
    expect(renderMarkdownExport({ title: 'Style', body, locale: 'en' })).toBe(body)
  })
})

describe('parseAttrs', () => {
  it('识别字符串、表达式、布尔和 Vue 绑定写法', () => {
    expect(parseAttrs(' module="quote" level={3} hideGo :title="false" go=\'X\'')).toEqual({
      module: 'quote',
      level: 3,
      hideGo: true,
      title: false,
      go: 'X',
    })
  })
})
