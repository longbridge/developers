import { useState } from 'react'
import type { Locale } from '@longbridge/openapi-utils'
import type { SidebarNode } from '@longbridge/openapi-utils'
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
    <div className="sticky top-14 z-10 flex items-center gap-3 border-b border-[color:var(--lb-stroke)] px-4 h-11 bg-[var(--lbus-c-bg)] lg:hidden" data-lbus-component="local-nav">
      {/* Mobile toggle */}
      <button
        type="button"
        className="bg-transparent border-0 cursor-pointer text-[color:var(--lbus-c-text)] text-sm py-1 px-2"
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
