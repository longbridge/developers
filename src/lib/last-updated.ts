import { execSync } from 'node:child_process'

/**
 * Per-file "last updated" dates for docs, sourced from git.
 *
 * This branch's migration commit bulk-rewrote every `.md` → `.mdx`, so the
 * .mdx files on HEAD all share that one commit date — useless for a "Last
 * Updated" line. The REAL per-page dates live in the pre-migration `.md`
 * files' history on `origin/main`. We read those once (a single `git log`
 * for the whole docs tree, memoised at module scope so the whole build/dev
 * process pays for it exactly once) and map them back to `.mdx` entry ids.
 *
 * Everything degrades gracefully: if `origin/main` isn't available (e.g. a
 * shallow CI checkout) or git errors, the map is empty and callers simply
 * omit the Last Updated line rather than showing a wrong date.
 */

let cache: Map<string, string> | null = null

/** Build `{ "docs/en/docs/getting-started.md" → ISO date }` from origin/main. */
function buildMap(): Map<string, string> {
  const map = new Map<string, string>()
  let out = ''
  try {
    // Newest-first commit log with the files each touched. `%cI` on its own
    // line marks a commit; `docs/…` lines are the files. The FIRST time a
    // file appears (walking newest→oldest) is its latest commit.
    out = execSync('git log --no-merges --format=%cI --name-only origin/main -- docs', {
      encoding: 'utf8',
      cwd: process.cwd(),
      maxBuffer: 64 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
  } catch {
    return map // origin/main missing or git unavailable → empty (feature hides)
  }
  let currentDate = ''
  for (const line of out.split('\n')) {
    if (/^\d{4}-\d\d-\d\dT/.test(line)) {
      currentDate = line.trim()
    } else if (line.startsWith('docs/') && currentDate && !map.has(line)) {
      map.set(line, currentDate)
    }
  }
  return map
}

function getMap(): Map<string, string> {
  if (!cache) cache = buildMap()
  return cache
}

/**
 * Latest commit date (ISO string) for a docs entry, or null if unknown.
 * `id` is the collection entry id (file path without extension), e.g.
 * `en/docs/getting-started` or `en/docs/cli/index`.
 */
export function getLastUpdated(id: string): string | null {
  const map = getMap()
  // Direct `.md` twin of the current `.mdx` path…
  const direct = `docs/${id}.md`
  if (map.has(direct)) return map.get(direct)!
  // …and the flattened form for pages migrated from `foo.md` → `foo/index.mdx`.
  if (id.endsWith('/index')) {
    const flat = `docs/${id.replace(/\/index$/, '')}.md`
    if (map.has(flat)) return map.get(flat)!
  }
  return null
}
