import { execSync } from 'node:child_process'

/**
 * Per-file "last updated" dates for docs, sourced from git.
 *
 * One `git log` over the whole docs tree (memoised at module scope, so the
 * build pays for it once) gives the latest commit date of every file. Used by
 * the "Last Updated" line (DocMeta.astro) and the sitemap `<lastmod>`
 * (src/lib/sitemap-lastmod.ts).
 *
 * Files are `.mdx` today; the pre-migration `.md` paths are still looked up as
 * a fallback, and when both exist the newer date wins.
 *
 * Bulk mechanical commits listed in IGNORED_COMMITS are skipped, so a page
 * untouched since then keeps the date of its last real edit. Today that is
 * only the 2026-08-17 `.md` → `.mdx` migration (279e2df1, 884 files renamed,
 * a few autolink/brace escapes): counting it would stamp ~150 pages per
 * locale with 2026-08-17. With it skipped, those pages fall back to their
 * pre-migration `.md` history via lookupLastUpdated.
 *
 * Everything degrades gracefully: on a shallow clone (CI `fetch-depth: 1`),
 * or when git errors, the map is empty and callers omit the date rather than
 * show a wrong one. A shallow clone is treated as "unknown" on purpose: its
 * boundary commit looks like a root commit that adds every file, which would
 * stamp every page with the build-day commit date.
 */

let cache: Map<string, string> | null = null

/**
 * Commits that touched many docs files without changing what they say. Their
 * dates are not "last updated" dates for any page. Full SHAs, so a short-hash
 * collision can never hide a real edit.
 */
export const IGNORED_COMMITS: ReadonlySet<string> = new Set([
  // chore(migrate): convert docs/*.md to *.mdx with autolink/brace escapes (2026-08-17)
  '279e2df1474bee09e4999b6c96931a1f13fe967e',
])

const HEADER = /^(?:([0-9a-f]{40}) )?(\d{4}-\d\d-\d\dT\S+)$/

/**
 * Parse `git log --format='%H %cI' --name-only` output (newest first) into
 * `{ "docs/en/docs/getting-started.mdx" → ISO date }`. The first time a path
 * appears is its latest commit. Files listed under a commit in `ignored` are
 * skipped, so they fall through to their next older commit.
 */
export function parseGitLog(out: string, ignored: ReadonlySet<string> = IGNORED_COMMITS): Map<string, string> {
  const map = new Map<string, string>()
  let currentDate = ''
  for (const raw of out.split('\n')) {
    const line = raw.trim()
    const header = HEADER.exec(line)
    if (header) {
      currentDate = header[1] && ignored.has(header[1]) ? '' : header[2]
    } else if (line.startsWith('docs/') && currentDate && !map.has(line)) {
      map.set(line, currentDate)
    }
  }
  return map
}

function git(args: string): string {
  return execSync(`git ${args}`, {
    encoding: 'utf8',
    cwd: process.cwd(),
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'ignore'],
  })
}

function buildMap(): Map<string, string> {
  try {
    if (git('rev-parse --is-shallow-repository').trim() !== 'false') return new Map()
    // HEAD = the commit being built (main on release, the branch on canary).
    // --no-renames: list paths as-is, and avoid rename detection fetching
    // blobs on partial (blob:none) clones.
    return parseGitLog(git("log --no-merges --no-renames --format='%H %cI' --name-only HEAD -- docs"))
  } catch {
    return new Map() // not a git checkout / git unavailable → feature hides
  }
}

function getMap(): Map<string, string> {
  if (!cache) cache = buildMap()
  return cache
}

/** Newer of two ISO dates (either may be missing). */
function newer(a: string | undefined, b: string | undefined): string | undefined {
  if (!a) return b
  if (!b) return a
  return Date.parse(b) > Date.parse(a) ? b : a
}

/**
 * Look up `id` (collection entry id = file path without extension, e.g.
 * `en/docs/getting-started` or `en/docs/cli/index`) in a path → date map.
 */
export function lookupLastUpdated(map: ReadonlyMap<string, string>, id: string): string | null {
  let best = map.get(`docs/${id}.mdx`)
  best = newer(best, map.get(`docs/${id}.md`))
  // Pages migrated from `foo.md` → `foo/index.mdx`.
  if (id.endsWith('/index')) best = newer(best, map.get(`docs/${id.replace(/\/index$/, '')}.md`))
  return best ?? null
}

/** Latest commit date (ISO string) for a docs entry, or null if unknown. */
export function getLastUpdated(id: string): string | null {
  return lookupLastUpdated(getMap(), id)
}
