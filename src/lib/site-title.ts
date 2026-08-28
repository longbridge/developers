/**
 * Document `<title>` composition — 1:1 with the legacy VitePress `createTitle`.
 *
 * Legacy behaviour (observed on open.longbridge.com), driven by the global
 * `title: 'Longbridge Developers'` in config.mts plus per-page frontmatter:
 *   - Content page (frontmatter `title`, no `titleTemplate`):
 *       `<title>{title} | Longbridge Developers</title>`   (brand as suffix)
 *   - Homepage (frontmatter `titleTemplate` tagline, no `title`):
 *       `<title>Longbridge Developers | {tagline}</title>` (brand as prefix)
 *   - `titleTemplate` containing `:title` is treated as a template.
 *   - Neither present → the brand alone.
 *
 * This is the single source of truth for the SEO title; the composed string is
 * passed to BaseLayout and reused verbatim for `og:title` / `twitter:title`.
 */

export const SITE_TITLE = 'Longbridge Developers'

export function composeTitle(title?: string, titleTemplate?: string): string {
  const pageTitle = title || SITE_TITLE
  if (titleTemplate) {
    return titleTemplate.includes(':title')
      ? titleTemplate.replace(/:title/g, pageTitle)
      : `${pageTitle} | ${titleTemplate}`
  }
  return pageTitle === SITE_TITLE ? SITE_TITLE : `${pageTitle} | ${SITE_TITLE}`
}
