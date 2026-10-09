import type { APIRoute } from 'astro'
import { endpointList, endpointMarkdownById, wsCommandList, wsCommandMarkdownById } from '@longbridge/openapi-api-reference/markdown'
import rawYaml from '../../../../openapi.yaml?raw'

export function getStaticPaths() {
  return [
    ...endpointList(rawYaml).map((e) => ({ params: { op: e.operationId } })),
    ...wsCommandList(rawYaml).map((w) => ({ params: { op: w.id } })),
  ]
}

export const GET: APIRoute = ({ params }) => {
  const op = String(params.op)
  const md = endpointMarkdownById(rawYaml, op, 'en') ?? wsCommandMarkdownById(rawYaml, op, 'en')
  return md
    ? new Response(md, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } })
    : new Response('Not found', { status: 404 })
}
