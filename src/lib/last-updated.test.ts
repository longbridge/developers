import { describe, expect, it } from 'vitest'
import { lookupLastUpdated, parseGitLog } from './last-updated'

// `git log --no-merges --no-renames --format=%cI --name-only HEAD -- docs`，新提交在前。
const LOG = `2026-11-09T10:00:00+08:00

docs/en/docs/cli/orders/exchange-rate.mdx
docs/zh-CN/docs/cli/orders/exchange-rate.mdx

2026-10-22T09:30:00+08:00

docs/en/docs/socket/protocol/how-to-parse-push.mdx
docs/en/docs/cli/orders/exchange-rate.mdx

2026-08-17T12:00:00+08:00

docs/en/docs/getting-started.mdx
docs/en/docs/cli/index.mdx

2026-03-01T12:00:00+08:00

docs/en/docs/getting-started.md
docs/en/docs/cli.md
docs/en/docs/legacy-only.md
`

describe('parseGitLog', () => {
  const map = parseGitLog(LOG)

  it('每个文件取第一次出现（最近一次提交）的日期', () => {
    expect(map.get('docs/en/docs/cli/orders/exchange-rate.mdx')).toBe('2026-11-09T10:00:00+08:00')
    expect(map.get('docs/en/docs/socket/protocol/how-to-parse-push.mdx')).toBe('2026-10-22T09:30:00+08:00')
  })

  it('只收 docs/ 下的路径', () => {
    expect([...map.keys()].every((k) => k.startsWith('docs/'))).toBe(true)
  })

  it('空输出得到空表', () => {
    expect(parseGitLog('').size).toBe(0)
  })
})

describe('lookupLastUpdated', () => {
  const map = parseGitLog(LOG)

  it('认 .mdx 文件', () => {
    expect(lookupLastUpdated(map, 'en/docs/cli/orders/exchange-rate')).toBe('2026-11-09T10:00:00+08:00')
    expect(lookupLastUpdated(map, 'zh-CN/docs/cli/orders/exchange-rate')).toBe('2026-11-09T10:00:00+08:00')
  })

  it('.mdx 和迁移前的 .md 都有时取较新的', () => {
    expect(lookupLastUpdated(map, 'en/docs/getting-started')).toBe('2026-08-17T12:00:00+08:00')
  })

  it('foo/index.mdx 兜底找迁移前的 foo.md，仍取较新的', () => {
    expect(lookupLastUpdated(map, 'en/docs/cli/index')).toBe('2026-08-17T12:00:00+08:00')
  })

  it('只有旧 .md 的记录时用它', () => {
    expect(lookupLastUpdated(map, 'en/docs/legacy-only')).toBe('2026-03-01T12:00:00+08:00')
  })

  it('查不到返回 null，不编日期', () => {
    expect(lookupLastUpdated(map, 'en/docs/not-in-git')).toBeNull()
    expect(lookupLastUpdated(new Map(), 'en/docs/getting-started')).toBeNull()
  })
})
