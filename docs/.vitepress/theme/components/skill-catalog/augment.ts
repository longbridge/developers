import type { CatalogLocale, SkillEntry, SkillCat } from './types'
import skillsData from '../../../../../skills.json'

type SkillJsonEntry = (typeof skillsData)['skills'][0]

function inferCat(slug: string): SkillCat {
  if (slug === 'longbridge') return 'meta'
  if (/-(order|trade|dca)$/.test(slug) || /-order$/.test(slug)) return 'trade'
  if (/-(position|portfolio|statement|profit|pnl|asset-allocation)$/.test(slug)) return 'portfolio'
  if (/-(alert)$/.test(slug)) return 'trade'
  if (/-(quote|depth|kline|capital-flow|fx|brokers|intraday|market-temp|candlestick|adr-premium|ah-premium|technical|chanlun|correlation)/.test(slug)) return 'quote'
  if (/-(fundamental|valuation|financial|earnings|analyst|corporate|dividend|peer|consensus|coverage|dcf|buffett|moat|tearsheet|basicinfo|company|competitive|catalyst|coverage-initiation|quant|ml-strategy|behavioral|asset-allocation|risk|macro|sector|options-volatility|ark|sharelist|portfolio-analytics|benchmark|concentration|drawdown)/.test(slug)) return 'research'
  if (/-(option|warrant|derivative|defi)/.test(slug)) return 'derivative'
  if (/-(market|calendar|anomaly|constituent|security|watchlist|screener|discovery|search|filter|news|content|topic|business-query|insider|flows|short|institutional|ownership)/.test(slug)) return 'discovery'
  return 'discovery'
}

function humanizeName(slug: string): string {
  const base = slug.replace(/^longbridge-?/, '')
  if (!base) return 'Longbridge'
  return base
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function extractDesc(description: string): string {
  const text = description.trim()
  const beforeTriggers = text.split(/\s+Triggers:/)[0].trim()
  const firstSentence = beforeTriggers.split(/\.\s+/)[0].trim()
  return firstSentence.endsWith('.') ? firstSentence : firstSentence + '.'
}

function makeEntry(s: SkillJsonEntry): SkillEntry {
  return {
    id: s.slug.replace(/^longbridge-?/, '') || 'longbridge',
    pkg: s.slug,
    cat: inferCat(s.slug),
    tools: 1,
    name: humanizeName(s.slug),
    desc: extractDesc(s.description),
    prompt: '',
  }
}

/**
 * Returns a new CatalogLocale that includes all skills from skills.json,
 * appending auto-generated entries for any skill not already in the catalog.
 */
export function augmentLocale(base: CatalogLocale): CatalogLocale {
  const existing = new Set(base.skills.map((s) => s.pkg))
  const added: SkillEntry[] = skillsData.skills
    .filter((s) => !existing.has(s.slug))
    .map(makeEntry)

  if (added.length === 0) return base

  const total = base.skills.length + added.length
  return {
    ...base,
    skills: [...base.skills, ...added],
    ui: {
      ...base.ui,
      title: base.ui.title.replace(/\d+\s+Skills?/, `${total} Skills`),
    },
  }
}
