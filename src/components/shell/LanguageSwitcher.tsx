import { type ChangeEvent } from 'react'
import type { Locale } from '../../lib/i18n'

interface Props {
  currentLocale: Locale
  currentPath: string
}

const LOCALES: { value: Locale; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'zh-CN', label: '简体中文' },
  { value: 'zh-HK', label: '繁體中文' },
]

function buildUrl(currentLocale: Locale, targetLocale: Locale, currentPath: string): string {
  // Strip current locale prefix to get bare path
  let barePath = currentPath
  if (currentLocale !== 'en') {
    const prefix = `/${currentLocale}`
    if (barePath.startsWith(prefix + '/')) {
      barePath = barePath.slice(prefix.length)
    } else if (barePath === prefix || barePath === prefix + '/') {
      barePath = '/'
    }
  }
  if (!barePath) barePath = '/'

  // For English, use bare path (no prefix)
  if (targetLocale === 'en') {
    return barePath
  }

  // For zh-CN or zh-HK, prepend locale
  if (barePath === '/') {
    return `/${targetLocale}`
  }
  return `/${targetLocale}${barePath}`
}

export default function LanguageSwitcher({ currentLocale, currentPath }: Props) {
  function handleChange(e: ChangeEvent<HTMLSelectElement>): void {
    const target = e.target.value as Locale
    if (target === currentLocale) return
    window.location.href = buildUrl(currentLocale, target, currentPath)
  }

  return (
    <div data-lbus-component="lang-switcher" className="relative inline-flex">
      <select
        value={currentLocale}
        onChange={handleChange}
        aria-label="Select language"
        className="appearance-none bg-transparent border-0 text-sm text-[color:var(--lb-fg-2)] cursor-pointer outline-none py-1 pl-1 pr-5 hover:text-[color:var(--lbus-c-text)]"
      >
        {LOCALES.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
