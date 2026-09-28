import type { APIRoute } from 'astro'
import { endpointList, endpointMarkdownById } from '@longbridge/openapi-api-reference/markdown'
import rawYaml from '../../../../openapi.yaml?raw'

export function getStaticPaths() {
  return endpointList(rawYaml).map((e) => ({ params: { op: e.operationId } }))
}

export const GET: APIRoute = ({ params }) => {
  const md = endpointMarkdownById(rawYaml, String(params.op), 'en')
  return md
    ? new Response(md, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } })
    : new Response('Not found', { status: 404 })
}
