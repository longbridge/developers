import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import './Skill.css'
import { locale as enLocale } from './skill-catalog/en'
import { locale as zhCNLocale } from './skill-catalog/zh-CN'
import { locale as zhHKLocale } from './skill-catalog/zh-HK'
import { augmentLocale } from './skill-catalog/augment'
import type { SkillEntry, CatalogLocale } from './skill-catalog/types'

// ─── locale detection ────────────────────────────────────────────────────────

function detectLocale(): CatalogLocale {
  if (typeof window === 'undefined') return augmentLocale(enLocale)
  const p = window.location.pathname
  if (p.startsWith('/zh-CN')) return augmentLocale(zhCNLocale)
  if (p.startsWith('/zh-HK')) return augmentLocale(zhHKLocale)
  return augmentLocale(enLocale)
}

// ─── constants ────────────────────────────────────────────────────────────────

const CATALOG_CAP = 12

type PluginTab = 'codex' | 'claude'

const PLUGIN_CMDS: Record<PluginTab, { kw: string; cmd1: string; cmd2: string }> = {
  codex: {
    kw: 'codex plugin',
    cmd1: 'marketplace add longbridge/skills',
    cmd2: 'add longbridge@longbridge-skills',
  },
  claude: {
    kw: '/plugin',
    cmd1: 'marketplace add longbridge/skills',
    cmd2: 'install longbridge@longbridge-skills',
  },
}

// ─── sub-components ──────────────────────────────────────────────────────────

interface ModalProps {
  skill: SkillEntry
  locale: CatalogLocale
  onClose: () => void
}

function SkillModal({ skill, locale, onClose }: ModalProps) {
  const { ui } = locale
  const [activeClient, setActiveClient] = useState<PluginTab>('codex')
  const [copied, setCopied] = useState(false)

  // close on backdrop click or Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    })
  }

  const cmds = PLUGIN_CMDS[activeClient]
  const installLine1 = `${cmds.kw} ${cmds.cmd1}`
  const installLine2 = `${cmds.kw} ${cmds.cmd2} ${skill.pkg}`

  return (
    <div
      className="sc-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}>
      <div className="sc-modal" role="dialog" aria-modal="true">
        <div className="sc-modal-head">
          <div className="sc-modal-deco" />
          <button className="sc-modal-close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="sc-modal-hero">
          <div className="sc-modal-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <div>
            <div className="sc-modal-title">{skill.name}</div>
            <div className="sc-modal-meta">
              <code>{skill.pkg}</code>
              <span className="sc-modal-dot" />
              <span>{skill.tools} tools</span>
            </div>
          </div>
        </div>

        <div className="sc-modal-desc">{skill.desc}</div>

        {skill.prompt && (
          <div className="sc-modal-actions">
            <div className="sc-modal-section-label">{ui.modalPromptLabel}</div>
            <div className="sc-modal-btn-outline">{skill.prompt}</div>
          </div>
        )}

        <div className="sc-modal-body">
          <div className="sc-modal-section">
            <div className="sc-modal-section-hd">
              <span className="sc-modal-section-label">{ui.modalInstallLabel}</span>
              <div className="sc-modal-client-tabs">
                <button
                  className={`sc-modal-client-tab${activeClient === 'codex' ? ' sc-modal-client-tab--active' : ''}`}
                  onClick={() => setActiveClient('codex')}>
                  Codex
                </button>
                <button
                  className={`sc-modal-client-tab${activeClient === 'claude' ? ' sc-modal-client-tab--active' : ''}`}
                  onClick={() => setActiveClient('claude')}>
                  Claude Code
                </button>
              </div>
            </div>

            <div className="sc-modal-cmd-block">
              <div className="sc-modal-labeled-cmd">
                <span className="sc-modal-cmd-label">1.</span>
                <code className="sc-modal-cmd-text">{installLine1}</code>
              </div>
              <div className="sc-modal-labeled-cmd">
                <span className="sc-modal-cmd-label">2.</span>
                <code className="sc-modal-cmd-text">{installLine2}</code>
              </div>
              <button
                className="sc-modal-cmd-copy"
                onClick={() => handleCopy(`${installLine1}\n${installLine2}`)}>
                {copied ? ui.copied : ui.copy}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

export function SkillCatalog() {
  const locale = useMemo(() => detectLocale(), [])
  const { skills, ui } = locale

  // category filter
  const cats = useMemo(() => {
    const keys = ['all', ...Array.from(new Set(skills.map((s) => s.cat)))] as string[]
    return keys.filter((k) => k in ui.catLabels || k === 'all')
  }, [skills, ui.catLabels])

  const [activeCat, setActiveCat] = useState('all')
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [openSkill, setOpenSkill] = useState<SkillEntry | null>(null)
  const [pluginTab, setPluginTab] = useState<PluginTab>('codex')
  const [copied, setCopied] = useState(false)

  // tabs indicator
  const tabsRef = useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({})

  function updateIndicator(tabEl: HTMLButtonElement) {
    const tabs = tabsRef.current
    if (!tabs) return
    const tabsRect = tabs.getBoundingClientRect()
    const btnRect = tabEl.getBoundingClientRect()
    setIndicatorStyle({
      left: btnRect.left - tabsRect.left + tabs.scrollLeft,
      width: btnRect.width,
    })
  }

  function handleTabClick(e: React.MouseEvent<HTMLButtonElement>, cat: string) {
    setActiveCat(cat)
    setExpanded(false)
    updateIndicator(e.currentTarget)
  }

  // set indicator on mount
  useEffect(() => {
    if (tabsRef.current) {
      const activeBtn = tabsRef.current.querySelector<HTMLButtonElement>('.sc-tab--active')
      if (activeBtn) updateIndicator(activeBtn)
    }
  }, [])

  // filtering
  const filteredSkills = useMemo(() => {
    let list = activeCat === 'all' ? skills : skills.filter((s) => s.cat === activeCat)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.desc.toLowerCase().includes(q) ||
          s.pkg.toLowerCase().includes(q),
      )
    }
    return list
  }, [skills, activeCat, query])

  const shownSkills = useMemo(
    () => (expanded ? filteredSkills : filteredSkills.slice(0, CATALOG_CAP)),
    [filteredSkills, expanded],
  )

  // counts per category
  const catCounts = useMemo(() => {
    const counts: Record<string, number> = { all: skills.length }
    skills.forEach((s) => {
      counts[s.cat] = (counts[s.cat] ?? 0) + 1
    })
    return counts
  }, [skills])

  // install-all copy
  function handleInstallCopy() {
    const cmds = PLUGIN_CMDS[pluginTab]
    const text = `${cmds.kw} ${cmds.cmd1}\n${cmds.kw} install longbridge/skills`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    })
  }

  // close modal on Escape (handled inside SkillModal, but guard here too)
  const handleCloseModal = useCallback(() => setOpenSkill(null), [])

  return (
    <div data-lbus-component="skill-catalog" className="skill-page-root">
      <section className="section">
        <div className="section-inner">
          {/* ── Header ── */}
          <div className="sc-header">
            <div className="sc-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1.5 L14 10 L22 12 L14 14 L12 22.5 L10 14 L2 12 L10 10 Z" />
              </svg>
              Skill Catalog
            </div>
            <h2 className="h-section" style={{ marginTop: 10 }}>{ui.title}</h2>
            <p className="t-meta" style={{ marginTop: 10, lineHeight: 1.55 }}>{ui.subtitle}</p>

            {/* ── Plugin bar (install-all) ── */}
            <div className="sc-plugin-bar">
              <div className="sc-plugin-left">
                <div className="sc-plugin-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgb(245,158,11)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                </div>
                <div>
                  <div className="sc-plugin-title">
                    {ui.installTitle}
                    <span className="sc-plugin-badge">PLUGIN</span>
                  </div>
                  <div className="sc-plugin-desc">{ui.installHint}</div>
                </div>
              </div>
              <div className="sc-plugin-right">
                <div className="sc-plugin-tabs">
                  <button
                    className={`sc-plugin-tab${pluginTab === 'codex' ? ' sc-plugin-tab--active' : ''}`}
                    onClick={() => setPluginTab('codex')}>
                    Codex
                  </button>
                  <button
                    className={`sc-plugin-tab${pluginTab === 'claude' ? ' sc-plugin-tab--active' : ''}`}
                    onClick={() => setPluginTab('claude')}>
                    Claude Code
                  </button>
                </div>
                <div className="sc-plugin-cmd-block">
                  <div className="sc-plugin-cmd-lines">
                    {pluginTab === 'codex' ? (
                      <>
                        <code>
                          <span className="sc-plugin-kw">codex plugin</span> marketplace add longbridge/skills
                        </code>
                        <code>
                          <span className="sc-plugin-kw">codex plugin</span> add longbridge@longbridge-skills
                        </code>
                      </>
                    ) : (
                      <>
                        <code>
                          <span className="sc-plugin-kw">/plugin</span> marketplace add longbridge/skills
                        </code>
                        <code>
                          <span className="sc-plugin-kw">/plugin</span> install longbridge@longbridge-skills
                        </code>
                      </>
                    )}
                  </div>
                  <button className="code-copy" onClick={handleInstallCopy}>
                    {copied ? ui.copied : ui.copy}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Toolbar: tabs + search ── */}
          <div className="sc-toolbar">
            <div className="sc-tabs-wrap">
              <div ref={tabsRef} className="sc-tabs" role="tablist">
                {cats.map((cat) => (
                  <button
                    key={cat}
                    role="tab"
                    aria-selected={activeCat === cat}
                    className={`sc-tab${activeCat === cat ? ' sc-tab--active' : ''}`}
                    onClick={(e) => handleTabClick(e, cat)}>
                    {ui.catLabels[cat] ?? cat}
                    <span className="sc-tab-count">{catCounts[cat] ?? 0}</span>
                  </button>
                ))}
                <span className="sc-tabs-indicator" style={indicatorStyle} />
              </div>
            </div>
            <div className="sc-search-wrap">
              <svg className="sc-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                className="sc-search-input"
                placeholder={ui.searchPlaceholder}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setExpanded(false)
                }}
              />
              {query && (
                <button className="sc-search-clear" onClick={() => setQuery('')}>×</button>
              )}
            </div>
          </div>

          {/* ── Skill grid ── */}
          <div className="sc-grid">
            {shownSkills.map((skill, i) => (
              <div
                key={skill.id}
                className="sc-card"
                style={{ '--sc-i': i } as React.CSSProperties}
                onClick={() => setOpenSkill(skill)}>
                <div className="sc-ripple" />
                <div className="sc-card-inner">
                  <div className="sc-card-header">
                    <div className="sc-card-title">
                      <span className="sc-card-name">{skill.name}</span>
                      {skill.tagType && (
                        <span className={`sc-card-tag sc-card-tag--${skill.tagType}`}>
                          {ui.tagLabels[skill.tagType]}
                        </span>
                      )}
                    </div>
                    <svg className="sc-card-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                  <span className="sc-card-pkg">{skill.pkg}</span>
                  <p className="sc-card-desc">{skill.desc}</p>
                  {skill.prompt && (
                    <div className="sc-card-prompt">
                      <svg width="12" height="12" viewBox="0 0 1024 1024" fill="#00B8B8" style={{ flex: '0 0 auto', marginTop: 2, opacity: 0.55 }}>
                        <path d="M470.9888 261.77536v98.54976c0 13.3632-10.83392 24.19712-24.19712 24.19712-47.68768 0-73.6256 48.90624-77.21984 145.43872h77.21984c13.3632 0 24.19712 10.84416 24.19712 24.19712v208.0768c0 13.3632-10.83392 24.19712-24.19712 24.19712H240.90624c-13.37344 0-24.19712-10.84416-24.19712-24.19712V554.15808c0-46.27456 4.6592-88.73984 13.84448-126.22848 9.4208-38.44096 23.87968-72.04864 42.96704-99.90144 19.64032-28.6208 44.20608-51.07712 73.02144-66.72384 29.00992-15.73888 62.74048-23.72608 100.25984-23.72608 13.34272 0 24.17664 10.83392 24.17664 24.19712zM783.09376 384.52224c13.3632 0 24.19712-10.84416 24.19712-24.19712V261.77536c0-13.3632-10.83392-24.19712-24.19712-24.19712-37.50912 0-71.23968 7.9872-100.2496 23.72608-28.81536 15.64672-53.39136 38.10304-73.03168 66.72384-19.08736 27.8528-33.54624 61.46048-42.96704 99.91168-9.17504 37.49888-13.83424 79.96416-13.83424 126.21824v208.0768c0 13.3632 10.83392 24.19712 24.19712 24.19712h205.8752c13.3632 0 24.19712-10.84416 24.19712-24.19712V554.15808c0-13.3632-10.83392-24.19712-24.19712-24.19712h-76.1344c3.54304-96.5325 29.10208-145.43872 76.12416-145.43872z" />
                      </svg>
                      <span className="sc-card-prompt-text">{skill.prompt}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ── Empty state ── */}
          {filteredSkills.length === 0 && (
            <div className="sc-empty">
              {ui.noResults(query)}
              <button className="sc-empty-clear" onClick={() => setQuery('')}>
                {ui.clear}
              </button>
            </div>
          )}

          {/* ── Expand / collapse ── */}
          {filteredSkills.length > CATALOG_CAP && (
            <div className="sc-expand-row">
              <button className="sc-expand-btn" onClick={() => setExpanded((v) => !v)}>
                {expanded
                  ? ui.collapse
                  : ui.showMore(filteredSkills.length - CATALOG_CAP)}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Skill detail modal ── */}
      {openSkill && (
        <SkillModal
          skill={openSkill}
          locale={locale}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}
