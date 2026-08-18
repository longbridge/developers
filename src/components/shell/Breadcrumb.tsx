import { t } from '@longbridge/openapi-utils'
import type { Locale } from '@longbridge/openapi-utils'

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
      <ol className="flex flex-wrap items-center gap-2 p-0 m-0 list-none text-sm text-[color:var(--lb-fg-2)]" role="list">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1
          return (
            <li
              key={`${item.href ?? item.text}-${index}`}
              className="inline-flex items-center gap-2"
            >
              {item.href && !isLast ? (
                <a href={item.href} className="text-inherit no-underline hover:text-[color:var(--lbus-c-text)]">{item.text}</a>
              ) : (
                <span aria-current={isLast ? 'page' : undefined}>{item.text}</span>
              )}
              {!isLast && (
                <span aria-hidden="true" className="text-[color:var(--lb-fg-3)]">/</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
