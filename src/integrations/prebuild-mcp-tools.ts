/**
 * Astro integration: prebuild-mcp-tools
 *
 * Fetches the MCP tools manifest from https://mcp.longbridge.com/mcp/tools.json
 * and writes it to .data/mcp-tools.json so pages can `import` it as a static
 * asset. `.data/` is gitignored, so on a fresh checkout the file does not exist.
 *
 * The build script runs `astro check && astro build`. `astro check` resolves the
 * static import in McpTools.tsx, so the file MUST exist before check — i.e. at
 * `astro:config:setup` (which runs for both check and build), not only at
 * `astro:build:start`. We therefore:
 *   - astro:config:setup — guarantee the file holds a usable manifest (fetch when
 *     missing, empty or unparseable; on failure write an empty stub so the import
 *     never breaks the type-check — that stub is not treated as a cache hit).
 *   - astro:build:start  — always refetch so production ships the latest data,
 *     falling back to the cached/stub file on network failure.
 */

import type { AstroIntegration } from 'astro'
import fs from 'fs'
import path from 'path'

const MCP_TOOLS_URL = 'https://mcp.longbridge.com/mcp/tools.json'
const DATA_DIR = path.resolve('.data')
const OUTPUT_FILE = path.join(DATA_DIR, 'mcp-tools.json')

async function fetchAndWrite(): Promise<void> {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  const response = await fetch(MCP_TOOLS_URL, { signal: AbortSignal.timeout(15_000) })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`)
  }
  const json = await response.json()
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(json, null, 2) + '\n', 'utf-8')
  console.log(`[prebuild-mcp-tools] written → ${OUTPUT_FILE}`)
}

/** Is the cached file a real manifest, rather than the empty stub written when
 *  an earlier fetch failed? Treating "file exists" as "cache is good" lets one
 *  failed fetch (e.g. offline laptop) poison local dev forever: the stub keeps
 *  the type-check happy, `astro:config:setup` never refetches, and `<McpTools />`
 *  silently renders nothing until someone deletes the file by hand. */
function hasUsableManifest(): boolean {
  if (!fs.existsSync(OUTPUT_FILE)) return false
  try {
    const cached = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'))
    return Array.isArray(cached?.tools) && cached.tools.length > 0
  } catch {
    return false // unparseable cache is no cache
  }
}

/** Guarantee OUTPUT_FILE holds a usable manifest before type-check; only touches
 *  the network when it doesn't (keeps local dev / check fast). */
async function ensureManifest(): Promise<void> {
  if (hasUsableManifest()) return
  console.log('[prebuild-mcp-tools] no usable cached manifest — fetching…')
  try {
    await fetchAndWrite()
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    fs.mkdirSync(DATA_DIR, { recursive: true })
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ tools: [] }, null, 2) + '\n', 'utf-8')
    console.warn(`[prebuild-mcp-tools] fetch failed (${message}); wrote empty stub so the build can proceed`)
  }
}

export function prebuildMcpTools(): AstroIntegration {
  return {
    name: 'prebuild-mcp-tools',
    hooks: {
      'astro:config:setup': async () => {
        await ensureManifest()
      },
      'astro:build:start': async () => {
        console.log('[prebuild-mcp-tools] fetching MCP tools manifest…')
        try {
          await fetchAndWrite()
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          if (fs.existsSync(OUTPUT_FILE)) {
            console.warn(`[prebuild-mcp-tools] fetch failed (${message}); using cached ${OUTPUT_FILE}`)
          } else {
            // No cache and config:setup somehow didn't run — write a stub.
            fs.mkdirSync(DATA_DIR, { recursive: true })
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ tools: [] }, null, 2) + '\n', 'utf-8')
            console.warn(`[prebuild-mcp-tools] fetch failed (${message}); wrote empty stub`)
          }
        }
      },
    },
  }
}
