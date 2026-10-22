import type { APIRoute } from 'astro'
import type { Locale } from '@longbridge/openapi-utils'
import { endpointList, endpointMarkdownById, wsCommandList, wsCommandMarkdownById } from '@longbridge/openapi-api-reference/markdown'
import rawYaml from '../../../../../openapi.yaml?raw'

export function getStaticPaths() {
  const ops = endpointList(rawYaml)
  const ws = wsCommandList(rawYaml)
  return (['zh-CN', 'zh-HK'] as const).flatMap((locale) => [
    ...ops.map((e) => ({ params: { locale, op: e.operationId } })),
    ...ws.map((w) => ({ params: { locale, op: w.id } })),
  ])
}

export const GET: APIRoute = ({ params }) => {
  const op = String(params.op)
  const locale = params.locale as Locale
  const md = endpointMarkdownById(rawYaml, op, locale) ?? wsCommandMarkdownById(rawYaml, op, locale)
  return md
    ? new Response(md, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } })
    : new Response('Not found', { status: 404 })
}
