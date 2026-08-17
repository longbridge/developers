import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
import tailwind from '@tailwindcss/vite'

const REGION = process.env.VITE_REGION ?? 'global'
const SITE = process.env.VITE_SITE_HOSTNAME ?? 'https://open.longportapp.com'

export default defineConfig({
  site: SITE,
  build: { format: 'file' },
  integrations: [
    react(),
    mdx(),
    icon(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { 'en': 'en', 'zh-CN': 'zh-CN', 'zh-HK': 'zh-HK' },
      },
    }),
  ],
  vite: {
    plugins: [tailwind()],
    define: {
      'import.meta.env.PUBLIC_REGION': JSON.stringify(REGION),
    },
  },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
})
