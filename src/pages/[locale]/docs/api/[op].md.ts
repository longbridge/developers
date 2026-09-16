import type { APIRoute } from 'astro'
import type { Locale } from '@longbridge/openapi-utils'
import { endpointList, endpointMarkdownById } from '@longbridge/openapi-api-reference/markdown'
import rawYaml from '../../../../../openapi.yaml?raw'

export function getStaticPaths() {
  const ops = endpointList(rawYaml)
  return (['zh-CN', 'zh-HK'] as const).flatMap((locale) =>
    ops.map((e) => ({ params: { locale, op: e.operationId } }))
  )
}

export const GET: APIRoute = ({ params }) => {
  const md = endpointMarkdownById(rawYaml, String(params.op), params.locale as Locale)
  return md
    ? new Response(md, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } })
    : new Response('Not found', { status: 404 })
}
