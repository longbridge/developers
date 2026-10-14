import React from 'react'

export interface CliCommandProps {
  /** Raw command block text (comments + commands, newline-separated), injected
   *  by the mdx preflight from `<CliCommand>…</CliCommand>`. */
  code?: string
  /** Page locale, bound at SSR via mdx-components, for locale-prefixed links. */
  locale?: string
  /** Command-specific "CLI Usage Docs" URL, resolved at SSR from the first
   *  command's subcommand. Falls back to the generic /docs/cli when absent. */
  docHref?: string
  /** Legacy fallback: pre-rendered children (unused once preflight is active). */
  children?: React.ReactNode
}

/** The CLI binaries whose first token is highlighted as the command keyword. */
const CLI_BINS = new Set(['longbridge', 'lb'])

const lp = (locale: string | undefined, path: string) =>
  !locale || locale === 'en' ? path : `/${locale}${path}`

/** Highlight one command line: binary (keyword) + subcommand + args. */
function CommandLine({ line }: { line: string }) {
  const parts = line.split(/(\s+)/) // keep whitespace tokens for exact spacing
  let sawBin = false
  let sawSub = false
  return (
    <div className="cli-line">
      {parts.map((tok, i) => {
        if (/^\s+$/.test(tok) || tok === '') return <React.Fragment key={i}>{tok}</React.Fragment>
        if (!sawBin && CLI_BINS.has(tok)) {
          sawBin = true
          return <span key={i} className="cli-tok-kw">{tok}</span>
        }
        if (sawBin && !sawSub && !tok.startsWith('-')) {
          sawSub = true
          return <span key={i} className="cli-tok-sub">{tok}</span>
        }
        return <React.Fragment key={i}>{tok}</React.Fragment>
      })}
    </div>
  )
}

export function CliCommand({ code, locale, docHref, children }: CliCommandProps) {
  // Legacy fallback: if no code prop was injected, render children untouched.
  if (!code) {
    return <div data-lbus-component="cli-command">{children}</div>
  }

  const lines = code.replace(/\n+$/, '').split('\n')

  return (
    <div data-lbus-component="cli-command" className="cli-command">
      <div className="cli-command__head">
        <span className="cli-command__title">
          <span className="cli-command__prompt">{'>_'}</span> CLI
        </span>
        <div className="cli-command__actions">
          <a
            className="cli-command__action"
            href={docHref ?? lp(locale, '/docs/cli')}
            aria-label="CLI Usage Docs"
            title="CLI Usage Docs"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 7v14" />
              <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
            </svg>
          </a>
          <a
            className="cli-command__action"
            href={lp(locale, '/docs/cli/install')}
            aria-label="Install CLI"
            title="Install CLI"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
          </a>
        </div>
      </div>
      <div className="cli-command__body">
        {lines.map((line, i) =>
          line.trim().startsWith('#') ? (
            <div key={i} className="cli-line cli-comment">
              {line}
            </div>
          ) : (
            <CommandLine key={i} line={line} />
          ),
        )}
      </div>
    </div>
  )
}
