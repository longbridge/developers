import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parseSpec } from './openapi-loader'
import { load } from 'js-yaml'

const yamlPath = fileURLToPath(new URL('../../../openapi.yaml', import.meta.url))
const raw = readFileSync(yamlPath, 'utf8')
const parsed = load(raw) as any
const { groups } = parseSpec(raw)
const allEps = groups.flatMap((g) => g.endpoints)
const declaredTags: string[] = (parsed.tags ?? []).map((t: any) => t.name)

describe('openapi.yaml invariants', () => {
  it('every operationId is unique', () => {
    const ids = allEps.map((e) => e.operation.operationId)
    expect(new Set(ids).size).toBe(ids.length)
  })
  it('every operation has summary + x-summary-zh + x-summary-zh-hk', () => {
    const bad = allEps.filter(
      (e) => !e.operation.summary || !e.operation['x-summary-zh'] || !e.operation['x-summary-zh-hk'],
    )
    expect(bad.map((e) => e.operation.operationId)).toEqual([])
  })
  it('every operation tag is declared in top-level tags', () => {
    const bad = allEps.filter((e) => (e.operation.tags ?? []).some((t) => !declaredTags.includes(t)))
    expect(bad.map((e) => e.operation.operationId)).toEqual([])
  })
  it('every websocket op has x-codeSamples or a protobuf code block in description', () => {
    const ws = allEps.filter((e) => e.method === 'WEBSOCKET')
    const bad = ws.filter(
      (e) => !e.operation['x-codeSamples']?.length && !/```protobuf/.test(e.operation.description ?? ''),
    )
    expect(bad.map((e) => e.operation.operationId)).toEqual([])
  })
})
