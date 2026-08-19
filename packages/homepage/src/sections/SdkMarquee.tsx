import React, { useState, useEffect, useRef } from 'react'

export interface InstallOption {
  runtime: string
  cmd: string
}

export interface SdkItem {
  id: string
  label: string
  installs: InstallOption[]
  code: string
  version: string
  lang: string
}

const logos: Record<string, string> = {
  python: 'https://assets.lbctrl.com/uploads/50244d9f-f886-4dc5-8ee5-4983d0ecb169/python.svg',
  nodejs: 'https://assets.lbctrl.com/uploads/1729711f-90d8-4b4d-9047-63a8adabdf20/nodejs.svg',
  rust: 'https://assets.lbctrl.com/uploads/f777c482-71bb-45a4-a2fe-5e639bd510cb/rust.svg',
  go: 'https://assets.lbctrl.com/uploads/37a78e80-f177-4931-a7b3-a12692c478ad/go.svg',
  java: 'https://assets.lbctrl.com/uploads/f5d96da9-8cba-43e4-8eed-f704e52cb413/java.svg',
  cpp: 'https://assets.lbctrl.com/uploads/14e521de-8f43-4042-aa4d-659d7b645da4/cplusplus.svg',
}

const SDK_MARQUEE_CSS = `
.sdk-marquee-wrap { max-width: 64rem; margin: 0 auto; padding: 0 1.5rem; }

.sdk-mq-row { overflow-x: hidden; }
.sdk-mq-row.sdk-mq-paused { overflow-x: auto; scrollbar-width: none; }
.sdk-mq-row.sdk-mq-paused::-webkit-scrollbar { display: none; }
.sdk-mq-row.sdk-mq-paused .animate-marquee { animation-play-state: paused !important; }

.sdk-marquee-inner {
  display: flex;
  gap: 0.75rem;
  overflow: hidden;
}

.animate-marquee {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
  animation: sdkMarqueeScroll 30s linear infinite;
}

@keyframes sdkMarqueeScroll {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}

.sdk-mq-card {
  width: 14rem;
  flex-shrink: 0;
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  border: 1.5px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  cursor: pointer;
  transition: all 0.25s;
  overflow: hidden;
}
.sdk-mq-card:hover {
  border-color: var(--brand-color);
  box-shadow: 0 4px 16px color-mix(in srgb, var(--brand-color) 8%, transparent);
  transform: translateY(-2px);
}
.sdk-mq-card.active {
  border-color: var(--brand-color);
  background: color-mix(in srgb, var(--brand-color) 4%, var(--vp-c-bg));
}
.sdk-mq-top { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.375rem; }
.sdk-mq-logo { width: 1.25rem; height: 1.25rem; flex-shrink: 0; object-fit: contain; }
.sdk-mq-name { font-size: 0.95rem; font-weight: 700; color: var(--vp-c-text-1); }
.sdk-mq-ver { font-size: 0.7rem; font-weight: 500; color: var(--vp-c-text-3); margin-left: auto; }
.sdk-mq-install {
  display: block; font-size: 0.7rem; font-family: var(--vp-font-family-mono);
  color: var(--brand-color); margin-bottom: 0.5rem;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.sdk-mq-preview {
  margin: 0; padding: 0.5rem; border-radius: 0.375rem; background: var(--vp-c-bg-soft);
  font-size: 0.65rem; font-family: var(--vp-font-family-mono); line-height: 1.5;
  color: var(--vp-c-text-2); overflow: hidden; max-height: 3.5rem;
}
.sdk-mq-preview code { font-family: inherit; }

/* Panel */
.mq-panel {
  margin-top: 1rem; border-radius: 0.75rem; border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg); overflow: hidden;
  animation: mqPanelIn 0.3s ease;
}
@keyframes mqPanelIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

.mq-panel-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.75rem 1rem; border-bottom: 1px solid var(--vp-c-divider);
}
.mq-panel-title { display: flex; align-items: center; gap: 0.5rem; }
.mq-panel-logo { width: 1.5rem; height: 1.5rem; flex-shrink: 0; object-fit: contain; }
.mq-panel-name { font-size: 1rem; font-weight: 700; color: var(--vp-c-text-1); }
.mq-panel-ver { font-size: 0.75rem; font-weight: 500; color: var(--vp-c-text-3); }
.mq-panel-nav { display: flex; align-items: center; gap: 0.375rem; }
.mq-nav-btn {
  display: flex; align-items: center; justify-content: center;
  width: 1.75rem; height: 1.75rem; border-radius: 50%;
  border: 1px solid var(--vp-c-divider); background: transparent;
  color: var(--vp-c-text-2); cursor: pointer; transition: all 0.2s;
}
.mq-nav-btn:hover { border-color: var(--brand-color); color: var(--brand-color); }
.mq-nav-counter {
  font-size: 0.7rem; font-weight: 600; color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono); min-width: 2.5rem; text-align: center;
}

/* Install section */
.mq-install-section {
  padding: 0.5rem 1rem; border-bottom: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft);
}
.mq-install-tabs { display: flex; gap: 0.25rem; margin-bottom: 0.375rem; }
.mq-install-tab {
  padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-size: 0.7rem; font-weight: 600;
  color: var(--vp-c-text-3); background: transparent; border: 1px solid transparent; cursor: pointer; transition: all 0.2s;
}
.mq-install-tab:hover { color: var(--vp-c-text-2); }
.mq-install-tab.active { color: var(--brand-color); background: var(--vp-c-bg); border-color: var(--vp-c-divider); }
.mq-install-cmd {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.375rem 0.625rem; border-radius: 0.375rem; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider);
}
.mq-install-cmd code { font-size: 0.8rem; font-family: var(--vp-font-family-mono); color: var(--vp-c-text-1); }

/* Copy button */
.mq-copy-sm {
  display: inline-flex; align-items: center; justify-content: center;
  width: 1.75rem; height: 1.75rem; border-radius: 0.375rem;
  color: var(--vp-c-text-3); background: transparent; border: none; cursor: pointer;
  transition: all 0.2s; flex-shrink: 0;
}
.mq-copy-sm:hover { color: var(--brand-color); background: color-mix(in srgb, var(--brand-color) 8%, transparent); }
.mq-copy-sm:active { transform: scale(0.8); }
.mq-copy-sm.copied { color: var(--brand-color); }

/* Code section */
.mq-code-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.375rem 1rem; border-bottom: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft);
}
.mq-code-label { font-size: 0.75rem; font-weight: 600; color: var(--vp-c-text-3); }
.mq-code pre {
  margin: 0; padding: 1rem; font-size: 0.825rem; line-height: 1.7; overflow-x: auto; background: transparent !important;
}
.mq-code code { font-family: var(--vp-font-family-mono); }
.mq-code .shiki { background: transparent !important; }
html.dark .mq-code .shiki,
html.dark .mq-code .shiki span { color: var(--shiki-dark) !important; }
.mq-code-fallback {
  margin: 0; padding: 1rem; font-size: 0.825rem; line-height: 1.7;
  color: var(--vp-c-text-1); overflow-x: auto; font-family: var(--vp-font-family-mono);
}
`

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

interface SdkMarqueeProps {
  sdks: SdkItem[]
}

export function SdkMarquee({ sdks }: SdkMarqueeProps) {
  const [activeSdkId, setActiveSdkId] = useState<string | null>(null)
  const [activeInstallIdx, setActiveInstallIdx] = useState(0)
  const [copied, setCopied] = useState<'code' | 'install' | null>(null)
  const [highlightedHtml, setHighlightedHtml] = useState('')
  const wrapRef = useRef<HTMLDivElement>(null)

  const expanded = sdks.find((s) => s.id === activeSdkId) ?? null
  const activeIndex = sdks.findIndex((s) => s.id === activeSdkId)
  const paused = activeSdkId !== null

  function scrollToActive(id: string) {
    setTimeout(() => {
      if (!wrapRef.current) return
      const card = wrapRef.current.querySelector(`[data-sdk="${id}"]`) as HTMLElement
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }, 0)
  }

  function select(id: string) {
    const next = activeSdkId === id ? null : id
    setActiveSdkId(next)
    setActiveInstallIdx(0)
    if (next) scrollToActive(next)
  }

  function goPrev() {
    const idx = activeIndex <= 0 ? sdks.length - 1 : activeIndex - 1
    setActiveSdkId(sdks[idx].id)
    setActiveInstallIdx(0)
    scrollToActive(sdks[idx].id)
  }

  function goNext() {
    const idx = activeIndex < 0 || activeIndex >= sdks.length - 1 ? 0 : activeIndex + 1
    setActiveSdkId(sdks[idx].id)
    setActiveInstallIdx(0)
    scrollToActive(sdks[idx].id)
  }

  function copyCode() {
    if (!expanded) return
    navigator.clipboard.writeText(expanded.code)
    setCopied('code')
    setTimeout(() => setCopied(null), 2000)
  }

  function copyInstall() {
    if (!expanded) return
    navigator.clipboard.writeText(expanded.installs[activeInstallIdx]?.cmd ?? '')
    setCopied('install')
    setTimeout(() => setCopied(null), 2000)
  }

  useEffect(() => {
    if (!expanded) { setHighlightedHtml(''); return }
    let cancelled = false
    import('shiki').then(({ createHighlighter }) =>
      createHighlighter({
        themes: ['github-light', 'github-dark'],
        langs: ['python', 'javascript', 'rust', 'go', 'java', 'cpp'],
      }).then((hl) => {
        if (cancelled) return
        const lang = expanded.lang in { python: 1, javascript: 1, rust: 1, go: 1, java: 1, cpp: 1 }
          ? expanded.lang
          : 'text'
        setHighlightedHtml(
          hl.codeToHtml(expanded.code, {
            lang,
            themes: { light: 'github-light', dark: 'github-dark' },
          }),
        )
      }),
    )
    return () => { cancelled = true }
  }, [expanded?.id])

  const doubledSdks = [...sdks, ...sdks]

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SDK_MARQUEE_CSS }} />
      <div data-lbus-component="sdk-marquee" className="sdk-marquee-wrap">
        <div ref={wrapRef} className={`sdk-mq-row${paused ? ' sdk-mq-paused' : ''}`}>
          <div className="sdk-marquee-inner">
            <div className="animate-marquee">
              {doubledSdks.map((sdk, i) => (
                <div
                  key={`${sdk.id}-${i}`}
                  data-sdk={sdk.id}
                  className={`sdk-mq-card${activeSdkId === sdk.id ? ' active' : ''}`}
                  onClick={() => select(sdk.id)}>
                  <div className="sdk-mq-top">
                    {logos[sdk.id] && <img className="sdk-mq-logo" src={logos[sdk.id]} alt={sdk.label} />}
                    <span className="sdk-mq-name">{sdk.label}</span>
                    <span className="sdk-mq-ver">{sdk.version}</span>
                  </div>
                  <code className="sdk-mq-install">{sdk.installs[0]?.cmd}</code>
                  <pre className="sdk-mq-preview">
                    <code>{sdk.code.split('\n').slice(0, 3).join('\n')}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>

        {expanded && (
          <div className="mq-panel">
            <div className="mq-panel-header">
              <div className="mq-panel-title">
                {logos[expanded.id] && (
                  <img className="mq-panel-logo" src={logos[expanded.id]} alt={expanded.label} />
                )}
                <span className="mq-panel-name">{expanded.label}</span>
                <span className="mq-panel-ver">{expanded.version}</span>
              </div>
              <div className="mq-panel-nav">
                <button className="mq-nav-btn" onClick={goPrev}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 12L6 8L10 4" />
                  </svg>
                </button>
                <span className="mq-nav-counter">{activeIndex + 1} / {sdks.length}</span>
                <button className="mq-nav-btn" onClick={goNext}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 4L10 8L6 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mq-install-section">
              <div className="mq-install-tabs">
                {expanded.installs.map((inst, i) => (
                  <button
                    key={inst.runtime}
                    className={`mq-install-tab${activeInstallIdx === i ? ' active' : ''}`}
                    onClick={() => setActiveInstallIdx(i)}>
                    {inst.runtime}
                  </button>
                ))}
              </div>
              <div className="mq-install-cmd">
                <code>{expanded.installs[activeInstallIdx]?.cmd}</code>
                <button className={`mq-copy-sm${copied === 'install' ? ' copied' : ''}`} onClick={copyInstall}>
                  {copied === 'install' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
            </div>

            <div className="mq-code-section">
              <div className="mq-code-header">
                <span className="mq-code-label">Example: Get Quote</span>
                <button className={`mq-copy-sm${copied === 'code' ? ' copied' : ''}`} onClick={copyCode}>
                  {copied === 'code' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
              {highlightedHtml
                ? <div className="mq-code" dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
                : <pre className="mq-code-fallback"><code>{expanded.code}</code></pre>
              }
            </div>
          </div>
        )}
      </div>
    </>
  )
}
