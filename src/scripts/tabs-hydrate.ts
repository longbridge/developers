// tabs-hydrate.ts
// Vanilla-JS progressive enhancement for <Tabs>/<TabItem> in Astro SSR.
//
// Root cause: Astro renders each React component in its own isolated React
// root. MDX children (TabItems) are serialised to HTML before their <Tabs>
// parent is called. This means:
//   • React.Children.forEach in Tabs sees [] — no tab bar is built.
//   • TabsContext.Provider never wraps TabItem's render — !ctx always fires.
//
// Fix: TabItem's !ctx branch emits data-tab-value / data-tab-label /
// data-tab-default attrs. This script reads those attrs after DOMContentLoaded
// and creates the interactive tab bar + manages visibility.
//
// Naming convention preserved:
//   data-lbus-component="tabs"        (outer wrapper — rule 9)
//   data-lbus-component="tab-item"    (each item — rule 9)
//   data-tabs-group-id                (groupId for cross-instance sync)
//   data-tabs-variant                 ("line" | "pill")
//   data-tabs-bar                     (empty bar div — script populates)
//   data-tab-value / data-tab-label / data-tab-default  (on each TabItem)

// Force TS to treat this file as a module so `declare global` is legal.
export {}

declare global {
  interface Window {
    __LBTabsState: Record<string, string>
    __LBTabsListeners: Record<string, Set<(value: string) => void>>
  }
}

function initGlobal() {
  if (!window.__LBTabsState) window.__LBTabsState = {}
  if (!window.__LBTabsListeners) window.__LBTabsListeners = {}
}

type StyleMap = Record<string, string>

const LINE_ACTIVE: StyleMap = {
  padding: '0.3rem 0.75rem',
  fontSize: '0.875rem',
  fontWeight: '500',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  background: 'transparent',
  border: 'none',
  borderBottom: '2px solid var(--vp-c-text-1)',
  color: 'var(--vp-c-text-1)',
  transition: 'color 0.15s, border-color 0.15s',
}
const LINE_INACTIVE: StyleMap = {
  ...LINE_ACTIVE,
  borderBottom: '2px solid transparent',
  color: 'var(--vp-c-text-2)',
}
const PILL_ACTIVE: StyleMap = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  whiteSpace: 'nowrap',
  borderRadius: '0.125rem',
  padding: '0.375rem 0.75rem',
  fontSize: '0.875rem',
  fontWeight: '500',
  transition: 'all 0.15s',
  cursor: 'pointer',
  border: 'none',
  background: 'var(--vp-c-bg)',
  color: 'var(--vp-c-text-1)',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
}
const PILL_INACTIVE: StyleMap = {
  ...PILL_ACTIVE,
  background: 'transparent',
  color: 'var(--vp-c-text-2)',
  boxShadow: 'none',
}

function applyStyle(el: HTMLElement, styles: StyleMap) {
  Object.entries(styles).forEach(([prop, val]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(el.style as any)[prop] = val
  })
}

function hydrateTabs(wrapper: HTMLElement): void {
  const groupId = wrapper.dataset.tabsGroupId
  const variant = wrapper.dataset.tabsVariant ?? 'line'
  const bar = wrapper.querySelector<HTMLElement>('[data-tabs-bar]')
  if (!bar) return

  const itemsContainer = wrapper.querySelector<HTMLElement>(':scope > .relative')
  if (!itemsContainer) return

  const items = Array.from(
    itemsContainer.querySelectorAll<HTMLElement>(':scope > [data-lbus-component="tab-item"]'),
  )
  if (items.length === 0) return

  interface TabEntry {
    value: string
    label: string
    isDefault: boolean
    el: HTMLElement
  }

  const tabData: TabEntry[] = items
    .map(el => ({
      value: el.dataset.tabValue ?? '',
      label: el.dataset.tabLabel ?? '',
      isDefault: el.dataset.tabDefault === 'true',
      el,
    }))
    .filter(t => t.value)

  if (tabData.length === 0) return

  // Determine initial active tab: global state > localStorage > default attr > first
  let activeValue = tabData.find(t => t.isDefault)?.value ?? tabData[0].value

  if (groupId) {
    initGlobal()
    try {
      const saved = localStorage.getItem(`vitepress-tabs-${groupId}`)
      if (saved && tabData.some(t => t.value === saved)) activeValue = saved
    } catch {
      /* storage blocked */
    }
    const global = window.__LBTabsState[groupId]
    if (global && tabData.some(t => t.value === global)) activeValue = global
  }

  function getActiveStyle(isActive: boolean): StyleMap {
    return variant === 'pill'
      ? isActive ? PILL_ACTIVE : PILL_INACTIVE
      : isActive ? LINE_ACTIVE : LINE_INACTIVE
  }

  // Apply pill-variant bar background
  if (variant === 'pill') {
    bar.style.background = 'var(--vp-c-bg-soft)'
    bar.style.padding = '0.25rem'
  }

  // Set initial visibility (all visible before JS, then hide non-active)
  tabData.forEach(tab => {
    tab.el.style.display = tab.value === activeValue ? '' : 'none'
  })

  // Create tab buttons
  const buttons: HTMLButtonElement[] = tabData.map(tab => {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.textContent = tab.label
    btn.dataset.tabValue = tab.value
    applyStyle(btn, getActiveStyle(tab.value === activeValue))

    btn.addEventListener('click', () => {
      const newValue = tab.value
      if (newValue === activeValue) return
      activeValue = newValue

      // Update visibility
      tabData.forEach(t => {
        t.el.style.display = t.value === newValue ? '' : 'none'
      })
      // Update button states
      buttons.forEach((b, i) => applyStyle(b, getActiveStyle(tabData[i].value === newValue)))

      // Persist + sync groupId
      if (groupId) {
        initGlobal()
        try {
          localStorage.setItem(`vitepress-tabs-${groupId}`, newValue)
        } catch {
          /* storage blocked */
        }
        window.__LBTabsState[groupId] = newValue
        window.__LBTabsListeners[groupId]?.forEach(l => l(newValue))

        // Sync other Tabs instances on the page with the same groupId
        document
          .querySelectorAll<HTMLElement>(
            `[data-lbus-component="tabs"][data-tabs-group-id="${groupId}"]`,
          )
          .forEach(other => {
            if (other === wrapper) return
            const container = other.querySelector<HTMLElement>(':scope > .relative')
            if (!container) return
            container
              .querySelectorAll<HTMLElement>(':scope > [data-lbus-component="tab-item"]')
              .forEach(item => {
                item.style.display = item.dataset.tabValue === newValue ? '' : 'none'
              })
            const otherVariant = other.dataset.tabsVariant ?? 'line'
            other.querySelectorAll<HTMLButtonElement>('[data-tabs-bar] button').forEach(b => {
              const styles =
                otherVariant === 'pill'
                  ? b.dataset.tabValue === newValue ? PILL_ACTIVE : PILL_INACTIVE
                  : b.dataset.tabValue === newValue ? LINE_ACTIVE : LINE_INACTIVE
              applyStyle(b, styles)
            })
          })
      }
    })

    bar.appendChild(btn)
    return btn
  })
}

function initTabsOnPage() {
  document.querySelectorAll<HTMLElement>('[data-lbus-component="tabs"]').forEach(hydrateTabs)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTabsOnPage)
} else {
  // DOMContentLoaded already fired (e.g., view transitions)
  initTabsOnPage()
}
