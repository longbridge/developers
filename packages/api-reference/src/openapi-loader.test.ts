import { describe, it, expect } from 'vitest'
import { pickLocale, parseSpec } from './openapi-loader'

describe('pickLocale', () => {
  it('en returns english', () => {
    expect(pickLocale('E', 'C', 'H', 'en')).toBe('E')
  })
  it('zh-CN returns simplified, falls back to en', () => {
    expect(pickLocale('E', 'C', 'H', 'zh-CN')).toBe('C')
    expect(pickLocale('E', undefined, 'H', 'zh-CN')).toBe('E')
  })
  it('zh-HK prefers traditional, falls back to simplified then en', () => {
    expect(pickLocale('E', 'C', 'H', 'zh-HK')).toBe('H')
    expect(pickLocale('E', 'C', undefined, 'zh-HK')).toBe('C')
    expect(pickLocale('E', undefined, undefined, 'zh-HK')).toBe('E')
  })
})

describe('parseSpec zh-HK tag/page fields', () => {
  const yaml = `
openapi: 3.0.3
info: { title: t, version: '1' }
tags:
  - name: Quote
    x-name-zh: 行情
    x-name-zh-hk: 行情（繁）
x-pages:
  - id: intro
    title: Intro
    x-title-zh: 介绍
    x-title-zh-hk: 介紹
    content: hi
    x-content-zh: 你好
    x-content-zh-hk: 你好（繁）
paths:
  /v1/x:
    get:
      operationId: get_x
      summary: Get X
      tags: [Quote]
`
  it('exposes nameZhHk on groups', () => {
    const { groups } = parseSpec(yaml)
    expect(groups.find((g) => g.name === 'Quote')?.nameZhHk).toBe('行情（繁）')
  })
  it('exposes titleZhHk / contentZhHk on pages', () => {
    const { pages } = parseSpec(yaml)
    expect(pages[0].titleZhHk).toBe('介紹')
    expect(pages[0].contentZhHk).toBe('你好（繁）')
  })
})

describe('parseSpec websocket', () => {
  const yaml = `
openapi: 3.0.3
info: { title: t, version: '1' }
tags:
  - name: Realtime (WebSocket)
paths:
  quote/subscribe:
    websocket:
      operationId: quote_subscribe
      summary: Subscribe Quote
      tags: [Realtime (WebSocket)]
`
  it('parses websocket op with WEBSOCKET method', () => {
    const { groups } = parseSpec(yaml)
    const g = groups.find((x) => x.name === 'Realtime (WebSocket)')
    expect(g?.endpoints[0].method).toBe('WEBSOCKET')
    expect(g?.endpoints[0].operation.operationId).toBe('quote_subscribe')
  })
})
