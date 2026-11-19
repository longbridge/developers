import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { apiPageMeta, endpointList, wsCommandList } from './openapi-markdown'

const raw = readFileSync(fileURLToPath(new URL('../../../openapi.yaml', import.meta.url)), 'utf8')
const LOCALES = ['en', 'zh-CN', 'zh-HK'] as const
const eps = new Map(endpointList(raw).map((e) => [e.operationId, e]))
const ws = new Map(wsCommandList(raw).map((c) => [c.id, c]))

describe('apiPageMeta', () => {
  it.each(LOCALES)('%s：REST 页标题和描述带方法与路径，WS 页带 WebSocket cmd', (locale) => {
    for (const m of apiPageMeta(raw, locale)) {
      const ep = eps.get(m.id)
      const label = ep ? `${ep.method} ${ep.path}` : `WebSocket cmd ${ws.get(m.id)!.cmd}`
      expect(m.title.endsWith(` (${label})`), m.id).toBe(true)
      expect(m.description.startsWith(`${label} — `), m.id).toBe(true)
    }
  })

  it.each(LOCALES)('%s：描述不超过 160 字符，超出时以省略号收尾', (locale) => {
    for (const m of apiPageMeta(raw, locale)) {
      expect(m.description.length, m.id).toBeLessThanOrEqual(160)
      if (m.description.length === 160) expect(m.description.endsWith('…'), m.id).toBe(true)
    }
  })

  it.each(LOCALES)('%s：同语言 API 页之间标题、描述都不重复', (locale) => {
    const meta = apiPageMeta(raw, locale)
    expect(new Set(meta.map((m) => m.title)).size).toBe(meta.length)
    expect(new Set(meta.map((m) => m.description)).size).toBe(meta.length)
  })

  it('样例：Top Movers 和 Intraday', () => {
    const en = new Map(apiPageMeta(raw, 'en').map((m) => [m.id, m]))
    const topMovers = eps.get('top_movers')!
    expect(en.get('top_movers')!.title).toBe(`Top Movers (${topMovers.method} ${topMovers.path})`)
    expect(en.get('ws-intraday')!.title).toBe(`Intraday (WebSocket cmd ${ws.get('ws-intraday')!.cmd})`)
  })
})
