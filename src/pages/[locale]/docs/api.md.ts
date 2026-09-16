import type { APIRoute } from 'astro'
import type { Locale } from '@longbridge/openapi-utils'
import { referenceMarkdown } from '@longbridge/openapi-api-reference/markdown'
import rawYaml from '../../../../openapi.yaml?raw'

export function getStaticPaths() {
  return [{ params: { locale: 'zh-CN' } }, { params: { locale: 'zh-HK' } }]
}

export const GET: APIRoute = ({ params }) =>
  new Response(referenceMarkdown(rawYaml, params.locale as Locale), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
