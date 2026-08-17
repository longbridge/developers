import { useState } from 'react'
import type { Locale } from '../../lib/i18n'
import type { SidebarNode } from '../../lib/navigation'
import Sidebar from './Sidebar'
import Backdrop from './Backdrop'

interface Props {
  locale: Locale
  pathname?: string
  nodes: SidebarNode[]
}

export default function LocalNav({ locale: _locale, pathname = '/', nodes }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const close = () => setSidebarOpen(false)

  return (
    <div className="local-nav" data-lbus-component="local-nav">
      {/* Mobile toggle */}
      <button
        type="button"
        className="local-nav-toggle"
        aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={sidebarOpen}
        onClick={() => setSidebarOpen((v) => !v)}
      >
        <span aria-hidden="true">☰</span>
      </button>

      <Backdrop visible={sidebarOpen} onClick={close} />

      <Sidebar nodes={nodes} pathname={pathname} open={sidebarOpen} onClose={close} />
    </div>
  )
}
