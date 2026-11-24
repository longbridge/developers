import { resolveSdkLinks } from './sdk-links'

export interface SDKLinksProps {
  module?: 'quote' | 'trade' | 'grid'
  klass?: 'QuoteContext' | 'TradeContext' | 'GridContext'
  method: string
  go?: string
  java?: string
  level?: number
  title?: string | boolean
  hideGo?: boolean
}

// ──────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────
export function SDKLinks({
  module = 'quote',
  klass,
  method,
  go,
  java,
  level = 2,
  title = 'SDK Links',
  hideGo = false,
}: SDKLinksProps) {
  const links = resolveSdkLinks({ module, klass, method, go, java, hideGo })

  const titleStr = title === true ? 'SDK Links' : title === false ? '' : (title as string)

  return (
    <div data-lbus-component="sdk-links">
      {titleStr && level === 2 && <h2>{titleStr}</h2>}
      {titleStr && level === 3 && <h3>{titleStr}</h3>}
      {titleStr && level === 4 && <h4>{titleStr}</h4>}
      {titleStr && level === 5 && <h5>{titleStr}</h5>}

      <table style={{ display: 'block' }}>
        <tbody>
          {links.map((link) => (
            <tr key={link.title}>
              <td
                style={{
                  width: '6rem',
                  background: 'var(--vp-c-bg-soft)',
                  border: '1px solid var(--vp-c-divider)',
                  padding: '0.4rem 0.6rem',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--vp-c-text-1)' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '0.5rem',
                      height: '0.5rem',
                      borderRadius: '0.125rem',
                      backgroundColor: link.color,
                    }}
                  />
                  {link.title}
                </div>
              </td>
              <td
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  background: 'var(--vp-c-bg)',
                  border: '1px solid var(--vp-c-divider)',
                  padding: '0.4rem 0.6rem',
                }}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--vp-c-brand-1)', textDecoration: 'none' }}>
                  {link.label}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
