/**
 * Mermaid diagram rendering — replaces the legacy vitepress-plugin-mermaid.
 * Astro/shiki renders ```mermaid fences as `<pre data-language="mermaid">` with
 * the raw source in textContent. This finds those blocks, lazily loads mermaid
 * (only on pages that actually have a diagram), renders them to SVG, and
 * re-renders on theme change so the diagram theme follows light/dark.
 */
type MermaidApi = {
  initialize: (cfg: Record<string, unknown>) => void
  render: (id: string, src: string) => Promise<{ svg: string }>
}

let mermaid: MermaidApi | null = null
let seq = 0
let themeWatched = false

async function ensureMermaid(): Promise<MermaidApi> {
  if (!mermaid) {
    mermaid = (await import('mermaid')).default as unknown as MermaidApi
  }
  return mermaid
}

async function draw(el: HTMLElement, src: string): Promise<void> {
  try {
    const api = await ensureMermaid()
    const { svg } = await api.render(`mmd-${++seq}`, src)
    el.innerHTML = svg
  } catch {
    /* leave the source visible if rendering fails */
  }
}

/** Render newly-added `<pre data-language="mermaid">` blocks (and, when
 *  `rerender` is true, re-draw already-rendered diagrams after a theme change). */
export async function renderMermaid(rerender = false): Promise<void> {
  const fences = Array.from(
    document.querySelectorAll<HTMLElement>('pre[data-language="mermaid"]'),
  )
  const existing = rerender
    ? Array.from(document.querySelectorAll<HTMLElement>('[data-mermaid-src]'))
    : []
  if (!fences.length && !existing.length) return

  const api = await ensureMermaid()
  const dark = document.documentElement.dataset.mode === 'dark'
  api.initialize({ startOnLoad: false, theme: dark ? 'dark' : 'default', securityLevel: 'loose' })

  for (const pre of fences) {
    const src = (pre.textContent ?? '').trim()
    if (!src) continue
    const container = document.createElement('div')
    container.className = 'mermaid-diagram'
    container.setAttribute('data-mermaid-src', src)
    pre.replaceWith(container)
    await draw(container, src)
  }
  for (const el of existing) {
    const src = el.getAttribute('data-mermaid-src') ?? ''
    if (src) await draw(el, src)
  }

  if (!themeWatched) {
    themeWatched = true
    const obs = new MutationObserver(() => void renderMermaid(true))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] })
  }
}
