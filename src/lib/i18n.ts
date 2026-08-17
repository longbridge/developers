import { locale as en } from '../data/locale.en'
import { locale as zhCN } from '../data/locale.zh-CN'
import { locale as zhHK } from '../data/locale.zh-HK'

export type Locale = 'en' | 'zh-CN' | 'zh-HK'
export type LocaleKey = keyof typeof en

type LocaleMap = Record<string, string>

const locales: Record<Locale, LocaleMap> = {
  en: en as unknown as LocaleMap,
  'zh-CN': zhCN as unknown as LocaleMap,
  'zh-HK': zhHK as unknown as LocaleMap,
}

/**
 * Translate a locale key to the appropriate string for the given locale.
 * Falls back to English if a key is missing in the target locale.
 * Supports simple variable substitution via {varName} placeholders.
 */
export function t(
  locale: Locale,
  key: LocaleKey,
  vars?: Record<string, string | number>,
): string {
  const dict = locales[locale]
  let str: string = dict[key] ?? locales.en[key] ?? (key as string)
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(`{${k}}`, String(v))
    }
  }
  return str
}
