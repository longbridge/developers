import { describe, expect, it } from 'vitest'
import { IGNORED_COMMITS, lookupLastUpdated, parseGitLog } from './last-updated'

// `git log --no-merges --no-renames --format='%H %cI' --name-only HEAD -- docs`，新提交在前。
const LOG = `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa 2026-11-09T10:00:00+08:00

docs/en/docs/cli/orders/exchange-rate.mdx
docs/zh-CN/docs/cli/orders/exchange-rate.mdx

bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb 2026-10-22T09:30:00+08:00

docs/en/docs/socket/protocol/how-to-parse-push.mdx
docs/en/docs/cli/orders/exchange-rate.mdx

cccccccccccccccccccccccccccccccccccccccc 2026-08-17T12:00:00+08:00

docs/en/docs/getting-started.mdx
docs/en/docs/cli/index.mdx

dddddddddddddddddddddddddddddddddddddddd 2026-03-01T12:00:00+08:00

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

// 2026-08-17 .md → .mdx 迁移提交（279e2df1）：--no-renames 下同一提交里列出新 .mdx（新增）和旧 .md（删除）。
const MIGRATION = '279e2df1474bee09e4999b6c96931a1f13fe967e'
const MIGRATION_LOG = `${'e'.repeat(40)} 2026-11-09T10:00:00+08:00

docs/en/docs/cli/orders/exchange-rate.mdx

${MIGRATION} 2026-08-17T16:54:26+08:00

docs/en/docs/cli/orders/exchange-rate.mdx
docs/en/docs/cli/orders/exchange-rate.md
docs/en/docs/quote/pull/static.mdx
docs/en/docs/quote/pull/static.md

${'f'.repeat(40)} 2026-05-17T19:15:58+08:00

docs/en/docs/quote/pull/static.md
docs/en/docs/cli/orders/exchange-rate.md
`

describe('跳过 .md → .mdx 迁移提交', () => {
  const map = parseGitLog(MIGRATION_LOG)

  it('迁移提交在忽略名单里', () => {
    expect(IGNORED_COMMITS.has(MIGRATION)).toBe(true)
  })

  it('迁移后没改过的页面不拿迁移日期，退回迁移前 .md 的日期', () => {
    expect(map.has('docs/en/docs/quote/pull/static.mdx')).toBe(false)
    expect(lookupLastUpdated(map, 'en/docs/quote/pull/static')).toBe('2026-05-17T19:15:58+08:00')
  })

  it('迁移后改过的页面仍取迁移后的日期', () => {
    expect(lookupLastUpdated(map, 'en/docs/cli/orders/exchange-rate')).toBe('2026-11-09T10:00:00+08:00')
  })

  it('不传忽略名单时迁移提交照常计入（对照）', () => {
    expect(lookupLastUpdated(parseGitLog(MIGRATION_LOG, new Set()), 'en/docs/quote/pull/static')).toBe(
      '2026-08-17T16:54:26+08:00'
    )
  })

  it('兼容不带提交号的旧格式', () => {
    expect(parseGitLog('2026-03-01T12:00:00+08:00\n\ndocs/en/docs/a.mdx\n').get('docs/en/docs/a.mdx')).toBe(
      '2026-03-01T12:00:00+08:00'
    )
  })
})
