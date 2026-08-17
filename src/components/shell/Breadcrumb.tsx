import { t } from '../../lib/i18n'
import type { Locale } from '../../lib/i18n'

export interface BreadcrumbItem {
  text: string
  href?: string
}

interface Props {
  locale: Locale
  items?: BreadcrumbItem[]
}

export default function Breadcrumb({ locale, items = [] }: Props) {
  const homeHref = locale === 'en' ? '/' : `/${locale}/`
  const allItems: BreadcrumbItem[] = [
    { text: t(locale, 'breadcrumb.home'), href: homeHref },
    ...items,
  ]

  return (
    <nav aria-label="Breadcrumb" data-lbus-component="breadcrumb">
      <ol className="breadcrumb" role="list">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1
          return (
            <li
              key={`${item.href ?? item.text}-${index}`}
              className={isLast ? 'breadcrumb-item breadcrumb-current' : 'breadcrumb-item'}
            >
              {item.href && !isLast ? (
                <a href={item.href}>{item.text}</a>
              ) : (
                <span aria-current={isLast ? 'page' : undefined}>{item.text}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
