/**
 * Astro integration: prebuild-mcp-tools
 *
 * Runs at astro:build:start hook. Fetches the MCP tools manifest from
 * https://mcp.longbridge.com/mcp/tools.json and writes it to .data/mcp-tools.json
 * so that Astro pages can import it as a static asset during the build.
 *
 * On network failure, logs a warning and continues — using the existing
 * .data/mcp-tools.json if present (stale-cache fallback).
 */

import type { AstroIntegration } from 'astro'
import fs from 'fs'
import path from 'path'

const MCP_TOOLS_URL = 'https://mcp.longbridge.com/mcp/tools.json'
const DATA_DIR = path.resolve('.data')
const OUTPUT_FILE = path.join(DATA_DIR, 'mcp-tools.json')

export function prebuildMcpTools(): AstroIntegration {
  return {
    name: 'prebuild-mcp-tools',
    hooks: {
      'astro:build:start': async () => {
        console.log('[prebuild-mcp-tools] fetching MCP tools manifest…')

        // Ensure .data/ directory exists
        fs.mkdirSync(DATA_DIR, { recursive: true })

        try {
          const response = await fetch(MCP_TOOLS_URL, {
            signal: AbortSignal.timeout(15_000),
          })

          if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`)
          }

          const json = await response.json()
          fs.writeFileSync(OUTPUT_FILE, JSON.stringify(json, null, 2) + '\n', 'utf-8')
          console.log(`[prebuild-mcp-tools] written → ${OUTPUT_FILE}`)
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          if (fs.existsSync(OUTPUT_FILE)) {
            console.warn(`[prebuild-mcp-tools] fetch failed (${message}); using cached ${OUTPUT_FILE}`)
          } else {
            console.warn(`[prebuild-mcp-tools] fetch failed (${message}); no cache available, continuing without data`)
          }
        }
      },
    },
  }
}
