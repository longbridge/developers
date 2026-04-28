export interface RegionSectionExclusion {
  /** Glob pattern matching page paths */
  page: string
  /** Heading texts to exclude — removes heading + content until next same-level heading */
  headings: string[]
}

export interface RegionConfig {
  /** API base URL for this region */
  apiBaseUrl: string
  /** Portal gateway base URL for this region */
  portalGatewayBaseUrl: string
  /** Site hostname for canonical URLs, sitemap, etc. */
  siteHostname: string
  /**
   * Page whitelist — only pages matching these glob patterns are included.
   * Uses `**` prefix to match across all locale directories (en, zh-CN, zh-HK).
   * Pages not matching any pattern are excluded from the build.
   */
  includePages: string[]
  /** Nav items to exclude — matches against the link path (e.g. '/', '/docs/api', '/sdk') */
  excludeNavLinks: string[]
  /** In-page section exclusions (applied within whitelisted pages) */
  excludeSections: RegionSectionExclusion[]
}

export const regionConfig: Record<string, RegionConfig> = {
  cn: {
    apiBaseUrl: 'https://openapi.longbridge.cn',
    portalGatewayBaseUrl: 'https://m.lbkrs.com',
    siteHostname: 'https://open.longbridge.cn',

    excludeNavLinks: ['/', '/docs/api', '/sdk'],

    includePages: [
      // Only CLI under /docs/
      '**/docs/cli.md',
      '**/docs/cli/index.md',
      '**/docs/cli/install.md',
      '**/docs/cli/release-notes.md',

      // AI Skills
      '**/skill/**',
    ],

    excludeSections: [
      // Example: remove US stock trading sections from getting-started
      // {
      //   page: '**/docs/getting-started.md',
      //   headings: ['US Stock Trading', '美股交易', '美股交易'],
      // },
    ],
  },
}
