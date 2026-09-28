import type { APIRoute } from 'astro'
import { referenceMarkdown } from '@longbridge/openapi-api-reference/markdown'
import rawYaml from '../../../openapi.yaml?raw'

export const GET: APIRoute = () =>
  new Response(referenceMarkdown(rawYaml, 'en'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
