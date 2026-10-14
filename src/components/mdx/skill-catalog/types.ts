export type SkillTagType = 'hot' | 'risk'
export type SkillCat = 'meta' | 'quote' | 'research' | 'derivative' | 'discovery' | 'trade' | 'portfolio'

export interface SkillEntry {
  id: string
  pkg: string
  cat: SkillCat
  tools: number
  tagType?: SkillTagType
  name: string
  desc: string
  prompt: string
}

export interface CatalogLocaleUI {
  catLabels: Record<string, string>
  title: string
  subtitle: string
  searchPlaceholder: string
  noResults: (q: string) => string
  clear: string
  showMore: (n: number) => string
  collapse: string
  installTitle: string
  installHint: string
  copy: string
  copied: string
  modalPromptLabel: string
  modalInstallLabel: string
  tagLabels: Record<SkillTagType, string>
}

export interface CatalogLocale {
  skills: SkillEntry[]
  ui: CatalogLocaleUI
}
