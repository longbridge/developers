import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from 'react'
import type { Locale } from '@longbridge/openapi-utils'
import { siteHostname } from './shared'
import type { SkillEntry } from '../skill-catalog/types'
import { augmentLocale } from '../skill-catalog/augment'
import { locale as _enLocale } from '../skill-catalog/en'
import { locale as _zhCNLocale } from '../skill-catalog/zh-CN'
import { locale as _zhHKLocale } from '../skill-catalog/zh-HK'

// 1:1 port of the legacy VitePress `Skill.vue` Skill Catalog section
// (template 1665–1849) plus the skill-detail modal (template 2113–2356);
// state/logic from the script (1191–1345). Copy `LOCALE.<locale>.catalog`
// (en 64–89, zh-CN 192–217, zh-HK 445–470).

// Legacy script 12–14.
const enLocale = augmentLocale(_enLocale)
const zhCNLocale = augmentLocale(_zhCNLocale)
const zhHKLocale = augmentLocale(_zhHKLocale)

const LOCALE = {
  en: {
    catalog: {
      eyebrow: 'Skill catalog',
      badge: 'SKILL CATALOG',
      title: 'Skills that cover every move in your trading day.',
      desc: 'Each Skill is a packaged set of tools, callable by any supported AI client. Click any card to see install instructions and details.',
      marketplace: 'Available on Claude Code Plugin Marketplace',
      pluginDesc: 'Copy the commands and run them in Claude Code.',
      codexMarketplace: 'Available on Codex Plugin Marketplace',
      codexPluginDesc: 'Copy the commands and run them in your terminal.',
      pluginTabCodex: 'Codex',
      pluginTabClaudeCode: 'Claude Code',
      tools: 'tools',
      manualLabel: 'Manual',
      viewSkill: 'View Full Skill',
      downloadZip: 'Download ZIP',
      install: 'Install',
      installHint: 'Copy the command for your AI client.',
      upgradeVerify: (client: string) => `Upgrade / Verify (${client})`,
      upgradeTo: 'Upgrade to latest',
      verifyInstalled: 'Verify installed',
      uninstall: (client: string) => `Uninstall (${client})`,
      uninstallHint: "Removing a Skill won't affect your Longbridge account or API key.",
      uninstallNote1: 'Client config is cleaned up automatically. For manual installs, delete',
      uninstallNote1End: 'directory.',
      uninstallNote2: 'Reinstalling after uninstall reuses the cached API key from your keychain.',
    },
  },
  'zh-CN': {
    catalog: {
      eyebrow: 'Skill 目录',
      badge: 'SKILL 目录',
      title: '覆盖您交易日每一个动作的 Skill',
      desc: '每个 Skill 都是一套打包的工具集，可被任何受支持的 AI 客户端调用。点击任意卡片查看安装说明和详情。',
      marketplace: '已上架 Claude Code 插件市场',
      pluginDesc: '复制命令，在 Claude Code 中运行即可。',
      codexMarketplace: '已上架 Codex 插件市场',
      codexPluginDesc: '复制命令，在终端中执行即可。',
      pluginTabCodex: 'Codex',
      pluginTabClaudeCode: 'Claude Code',
      tools: '个工具',
      manualLabel: '手动安装',
      viewSkill: '查看完整技能',
      downloadZip: '下载 ZIP',
      install: '安装',
      installHint: '选择你使用的客户端，复制命令到对应终端。',
      upgradeVerify: (client: string) => `升级 / 验证（${client}）`,
      upgradeTo: '升级到最新版',
      verifyInstalled: '验证已安装',
      uninstall: (client: string) => `卸载（${client}）`,
      uninstallHint: '移除 Skill 不会影响你的 Longbridge 账户与 API key。',
      uninstallNote1: '客户端配置会自动清理；如手动安装，删除',
      uninstallNote1End: '目录即可。',
      uninstallNote2: '卸载后再次安装会沿用上次的 API key 缓存（位于钥匙串）。',
    },
  },
  'zh-HK': {
    catalog: {
      eyebrow: 'Skill 目錄',
      badge: 'SKILL 目錄',
      title: '覆蓋您交易日每一個動作的 Skill。',
      desc: '每個 Skill 都是一套打包的工具集，可被任何受支援的 AI 客戶端調用。點擊任意卡片查看安裝說明和詳情。',
      marketplace: '已上架 Claude Code 外掛市場',
      pluginDesc: '複製命令，在 Claude Code 中運行即可。',
      codexMarketplace: '已上架 Codex 外掛市場',
      codexPluginDesc: '複製命令，在終端機中執行即可。',
      pluginTabCodex: 'Codex',
      pluginTabClaudeCode: 'Claude Code',
      tools: '個工具',
      manualLabel: '手動安裝',
      viewSkill: '查看完整技能',
      downloadZip: '下載 ZIP',
      install: '安裝',
      installHint: '選擇你使用的客戶端，複製命令到對應終端。',
      upgradeVerify: (client: string) => `升級 / 驗證（${client}）`,
      upgradeTo: '升級到最新版',
      verifyInstalled: '驗證已安裝',
      uninstall: (client: string) => `卸載（${client}）`,
      uninstallHint: '移除 Skill 不會影響你的 Longbridge 賬戶與 API key。',
      uninstallNote1: '客戶端配置會自動清理；如手動安裝，刪除',
      uninstallNote1End: '目錄即可。',
      uninstallNote2: '卸載後再次安裝會沿用上次的 API key 緩存（位於鑰匙串）。',
    },
  },
}

type CatalogSkill = SkillEntry & { tag?: string }

// Legacy script 1218–1228.
const _SVG_COMMON =
  'width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00b8b8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'
const CAT_ICONS: Record<string, string> = {
  meta: `<svg ${_SVG_COMMON}><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
  quote: `<svg ${_SVG_COMMON}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  research: `<svg ${_SVG_COMMON}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
  derivative: `<svg ${_SVG_COMMON}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  discovery: `<svg ${_SVG_COMMON}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
  trade: `<svg ${_SVG_COMMON}><path d="m17 1 4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="m7 23-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
  portfolio: `<svg ${_SVG_COMMON}><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>`,
}

type ModalPhase = 'entered' | 'enter-from' | 'enter-active' | 'leave-active' | 'leave-to'

// Copy icon shared by every modal cmd copy button (legacy 2213–2224, etc.).
function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

// Green check shown after a copy (legacy 2202–2212, etc.).
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00b88a" strokeWidth="2.6" strokeLinecap="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

export function SkillCatalogSection({ locale }: { locale: Locale }) {
  const content = LOCALE[locale as keyof typeof LOCALE] ?? LOCALE.en

  // Legacy computed 1191–1196.
  const isEN = locale === 'en' || (locale as string) === 'en-US'
  const isHK = locale === 'zh-HK'
  const catalogLocale = useMemo(() => (isEN ? enLocale : isHK ? zhHKLocale : zhCNLocale), [isEN, isHK])

  // Legacy refs 1209–1216.
  const [activeCatalogCat, setActiveCatalogCat] = useState('all')
  const [activePluginTab, setActivePluginTab] = useState<'codex' | 'claude'>('codex')
  const [catalogQuery, setCatalogQuery] = useState('')
  const [catalogExpanded, setCatalogExpanded] = useState(false)
  const [openCatalogSkill, setOpenCatalogSkill] = useState<CatalogSkill | null>(null)
  const [catalogCols, setCatalogCols] = useState(3)
  const [installClient, setInstallClient] = useState('cli')
  const [modalCopiedKey, setModalCopiedKey] = useState<string | null>(null)

  // Modal enter/leave transition (Vue <Transition name="sc-modal">).
  const [renderedSkill, setRenderedSkill] = useState<CatalogSkill | null>(null)
  const [modalPhase, setModalPhase] = useState<ModalPhase>('entered')

  // Legacy computed 1198–1207.
  const CATALOG_SKILLS = useMemo<CatalogSkill[]>(
    () =>
      catalogLocale.skills.map((s) => ({
        ...s,
        tag: s.tagType ? catalogLocale.ui.tagLabels[s.tagType] : undefined,
      })),
    [catalogLocale]
  )
  const CATALOG_CATS = useMemo(
    () => Object.entries(catalogLocale.ui.catLabels).map(([id, label]) => ({ id, label })),
    [catalogLocale]
  )

  // Legacy handleModalCopy 1230–1237.
  const handleModalCopy = useCallback((text: string, key: string) => {
    navigator.clipboard?.writeText(text)
    setModalCopiedKey(key)
    setTimeout(() => {
      setModalCopiedKey(null)
    }, 1400)
  }, [])

  // Legacy INSTALL_CLIENTS 1238–1256.
  const INSTALL_CLIENTS = useMemo(() => {
    const pkg = renderedSkill?.pkg ?? ''
    return {
      cli: {
        label: 'CLI',
        cmd: `npx skills add longbridge/skills -g --skill ${pkg}`,
        uninstall: `npx skills remove ${pkg} -g`,
        upgrade: `npx skills update ${pkg} -g`,
        verify: `npx skills list | grep ${pkg}`,
      },
      manual: {
        label: content.catalog.manualLabel,
        cmd: `# 1. Download ZIP\ncurl -LO ${siteHostname}/skill/${pkg}.zip\n# 2. Extract\nunzip ${pkg}.zip -d ~/.claude/skills/\n# 3. Restart AI client`,
        uninstall: `rm -rf ~/.claude/skills/${pkg}/`,
        upgrade: `curl -LO ${siteHostname}/skill/${pkg}.zip\nunzip -o ${pkg}.zip -d ~/.claude/skills/`,
        verify: `ls ~/.claude/skills/${pkg}/`,
      },
    } as Record<string, { label: string; cmd: string; uninstall: string; upgrade: string; verify: string }>
  }, [renderedSkill, content])

  // Legacy tabsEl / indicatorStyle / updateIndicator 1258–1272.
  const tabsElRef = useRef<HTMLDivElement | null>(null)
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: string; width: string }>({ left: '0px', width: '0px' })
  const updateIndicator = useCallback(() => {
    const tabs = tabsElRef.current
    if (!tabs) return
    const active = tabs.querySelector<HTMLElement>('.sc-tab--active')
    if (!active) return
    const base = tabs.getBoundingClientRect()
    const rect = active.getBoundingClientRect()
    setIndicatorStyle({ left: rect.left - base.left + 'px', width: rect.width + 'px' })
    const wrap = tabs.parentElement
    if (wrap) {
      const targetScroll = active.offsetLeft - wrap.clientWidth / 2 + active.offsetWidth / 2
      wrap.scrollTo({ left: targetScroll, behavior: 'smooth' })
    }
  }, [])

  // Legacy watch(activeCatalogCat) 1273 + onMounted nextTick(updateIndicator) 1288.
  useEffect(() => {
    updateIndicator()
  }, [activeCatalogCat, updateIndicator])

  // Legacy updateCatalogCols 1275–1280 + resize listener 1285–1292.
  useEffect(() => {
    const updateCatalogCols = () => {
      const w = window.innerWidth
      setCatalogCols(w <= 600 ? 1 : w <= 960 ? 2 : 3)
    }
    updateCatalogCols()
    window.addEventListener('resize', updateCatalogCols)
    return () => window.removeEventListener('resize', updateCatalogCols)
  }, [])

  // Legacy onModalKey 1281–1283 + keydown listener 1287–1292.
  useEffect(() => {
    const onModalKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenCatalogSkill(null)
    }
    window.addEventListener('keydown', onModalKey)
    return () => window.removeEventListener('keydown', onModalKey)
  }, [])

  // Legacy watch([activeCatalogCat, catalogQuery]) 1295–1297.
  useEffect(() => {
    setCatalogExpanded(false)
  }, [activeCatalogCat, catalogQuery])

  // Legacy watch(openCatalogSkill) 1298–1301.
  useEffect(() => {
    setInstallClient('cli')
    setModalCopiedKey(null)
  }, [openCatalogSkill])

  // Drive the Vue <Transition> enter/leave lifecycle for the modal.
  const rafRef = useRef<number | null>(null)
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    if (leaveTimerRef.current != null) clearTimeout(leaveTimerRef.current)
    if (openCatalogSkill) {
      // enter: mount from the enter-from state, then flip to active on the next frame
      setRenderedSkill(openCatalogSkill)
      setModalPhase('enter-from')
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => setModalPhase('enter-active'))
      })
      leaveTimerRef.current = setTimeout(() => setModalPhase('entered'), 240)
    } else if (renderedSkill) {
      // leave: run the leave transition, then unmount
      setModalPhase('leave-active')
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => setModalPhase('leave-to'))
      })
      leaveTimerRef.current = setTimeout(() => {
        setRenderedSkill(null)
        setModalPhase('entered')
      }, 240)
    }
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      if (leaveTimerRef.current != null) clearTimeout(leaveTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openCatalogSkill])

  // Legacy computed 1303–1327.
  const filteredCatalogSkills = useMemo(() => {
    const q = catalogQuery.trim().toLowerCase()
    return CATALOG_SKILLS.filter((s) => {
      if (q) return (s.pkg + ' ' + s.name + ' ' + s.desc).toLowerCase().includes(q)
      return activeCatalogCat === 'all' || s.cat === activeCatalogCat
    })
  }, [CATALOG_SKILLS, catalogQuery, activeCatalogCat])

  const catalogCap = catalogCols * 3

  const shownCatalogSkills = useMemo(
    () =>
      catalogExpanded || filteredCatalogSkills.length <= catalogCap
        ? filteredCatalogSkills
        : filteredCatalogSkills.slice(0, catalogCap),
    [catalogExpanded, filteredCatalogSkills, catalogCap]
  )

  const catalogCounts = useMemo(
    () =>
      Object.fromEntries(
        CATALOG_CATS.map((c) => [
          c.id,
          c.id === 'all' ? CATALOG_SKILLS.length : CATALOG_SKILLS.filter((s) => s.cat === c.id).length,
        ])
      ) as Record<string, number>,
    [CATALOG_CATS, CATALOG_SKILLS]
  )

  // Legacy triggerRipple 1328–1344.
  const triggerRipple = useCallback((event: ReactMouseEvent<HTMLElement>, el: HTMLElement) => {
    const ripple = el.querySelector<HTMLElement>('.sc-ripple')
    if (!ripple) return
    const r = el.getBoundingClientRect()
    const x = event.clientX - r.left
    const y = event.clientY - r.top
    ripple.style.left = x + 'px'
    ripple.style.top = y + 'px'
    ripple.getAnimations().forEach((a) => a.cancel())
    ripple.animate(
      [
        { width: '0px', height: '0px', opacity: 0.6 },
        { width: '600px', height: '600px', opacity: 0 },
      ],
      { duration: 400, easing: 'ease-out', fill: 'forwards' }
    )
  }, [])

  const backdropCls =
    'sc-modal-backdrop' +
    (modalPhase === 'enter-from'
      ? ' sc-modal-enter-active sc-modal-enter-from'
      : modalPhase === 'enter-active'
        ? ' sc-modal-enter-active'
        : modalPhase === 'leave-active'
          ? ' sc-modal-leave-active'
          : modalPhase === 'leave-to'
            ? ' sc-modal-leave-active sc-modal-leave-to'
            : '')

  const active = renderedSkill ? INSTALL_CLIENTS[installClient] : undefined

  return (
    <>
      {/* Skill Catalog */}
      <section
        className="section"
        style={{
          paddingTop: '32px',
          background: 'var(--app-canvas)',
          borderTop: '1px solid var(--app-card-stroke)',
          borderBottom: '1px solid var(--app-card-stroke)',
        }}>
        <div className="section-inner">
          {/* Header */}
          <div className="sc-header">
            <div className="sc-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1.5 L14 10 L22 12 L14 14 L12 22.5 L10 14 L2 12 L10 10 Z" />
              </svg>
              {content.catalog.badge}
            </div>
            <h2 className="h-section" style={{ marginTop: '10px' }}>
              {content.catalog.title}
            </h2>
            <p className="t-meta" style={{ marginTop: '10px', lineHeight: 1.55 }}>
              {content.catalog.desc}
            </p>
            <div className="sc-plugin-bar">
              <div className="sc-plugin-left">
                <div className="sc-plugin-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgb(245, 158, 11)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                </div>
                <div>
                  <div className="sc-plugin-title">
                    {activePluginTab === 'codex' ? content.catalog.codexMarketplace : content.catalog.marketplace}
                    <span className="sc-plugin-badge">PLUGIN</span>
                  </div>
                  <div className="sc-plugin-desc">
                    {activePluginTab === 'codex' ? content.catalog.codexPluginDesc : content.catalog.pluginDesc}
                  </div>
                </div>
              </div>
              <div className="sc-plugin-right">
                <div className="sc-plugin-tabs">
                  <button
                    className={['sc-plugin-tab', activePluginTab === 'codex' && 'sc-plugin-tab--active'].filter(Boolean).join(' ')}
                    onClick={() => setActivePluginTab('codex')}>
                    {content.catalog.pluginTabCodex}
                  </button>
                  <button
                    className={['sc-plugin-tab', activePluginTab === 'claude' && 'sc-plugin-tab--active'].filter(Boolean).join(' ')}
                    onClick={() => setActivePluginTab('claude')}>
                    {content.catalog.pluginTabClaudeCode}
                  </button>
                </div>
                <div className="sc-plugin-cmd-block">
                  <div className="sc-plugin-cmd-lines">
                    {activePluginTab === 'codex' ? (
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
                </div>
              </div>
            </div>
          </div>

          {/* Tabs + Search row */}
          <div className="sc-toolbar">
            <div className="sc-tabs-wrap">
              <div ref={tabsElRef} className="sc-tabs" role="tablist">
                {CATALOG_CATS.map((cat) => (
                  <button
                    key={cat.id}
                    role="tab"
                    aria-selected={activeCatalogCat === cat.id}
                    className={activeCatalogCat === cat.id ? 'sc-tab sc-tab--active' : 'sc-tab'}
                    onClick={() => setActiveCatalogCat(cat.id)}>
                    {cat.label}
                    <span className="sc-tab-count">{catalogCounts[cat.id]}</span>
                  </button>
                ))}
                <span className="sc-tabs-indicator" style={indicatorStyle}></span>
              </div>
            </div>
            <div className="sc-search-wrap">
              <svg
                className="sc-search-icon"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                value={catalogQuery}
                onChange={(e) => setCatalogQuery(e.target.value)}
                className="sc-search-input"
                placeholder={catalogLocale.ui.searchPlaceholder}
              />
              {catalogQuery && (
                <button className="sc-search-clear" onClick={() => setCatalogQuery('')}>
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Grid */}
          <div className="sc-grid" key={activeCatalogCat + (catalogQuery ? '1' : '0')}>
            {shownCatalogSkills.map((skill, i) => (
              <div
                key={skill.id}
                className="sc-card"
                style={{ '--sc-i': i } as CSSProperties}
                onMouseEnter={(e) => triggerRipple(e, e.currentTarget)}
                onClick={() => setOpenCatalogSkill(skill)}>
                <div className="sc-ripple" />
                <div className="sc-card-inner">
                  <div className="sc-card-header">
                    <div className="sc-card-title">
                      <span className="sc-card-name">{skill.name}</span>
                      {skill.tag && (
                        <span className={'sc-card-tag sc-card-tag--' + (skill.tagType ?? 'default')}>{skill.tag}</span>
                      )}
                    </div>
                    <svg
                      className="sc-card-arrow"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                  <span className="sc-card-pkg">{skill.pkg}</span>
                  <p className="sc-card-desc" dangerouslySetInnerHTML={{ __html: skill.desc }}></p>
                  <div className="sc-card-prompt">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 1024 1024"
                      fill="#00B8B8"
                      style={{ flex: '0 0 auto', marginTop: '2px', opacity: 0.55 }}>
                      <path d="M470.9888 261.77536v98.54976c0 13.3632-10.83392 24.19712-24.19712 24.19712-47.68768 0-73.6256 48.90624-77.21984 145.43872h77.21984c13.3632 0 24.19712 10.84416 24.19712 24.19712v208.0768c0 13.3632-10.83392 24.19712-24.19712 24.19712H240.90624c-13.37344 0-24.19712-10.84416-24.19712-24.19712V554.15808c0-46.27456 4.6592-88.73984 13.84448-126.22848 9.4208-38.44096 23.87968-72.04864 42.96704-99.90144 19.64032-28.6208 44.20608-51.07712 73.02144-66.72384 29.00992-15.73888 62.74048-23.72608 100.25984-23.72608 13.34272 0 24.17664 10.83392 24.17664 24.19712zM783.09376 384.52224c13.3632 0 24.19712-10.84416 24.19712-24.19712V261.77536c0-13.3632-10.83392-24.19712-24.19712-24.19712-37.50912 0-71.23968 7.9872-100.2496 23.72608-28.81536 15.64672-53.39136 38.10304-73.03168 66.72384-19.08736 27.8528-33.54624 61.46048-42.96704 99.91168-9.17504 37.49888-13.83424 79.96416-13.83424 126.21824v208.0768c0 13.3632 10.83392 24.19712 24.19712 24.19712h205.8752c13.3632 0 24.19712-10.84416 24.19712-24.19712V554.15808c0-13.3632-10.83392-24.19712-24.19712-24.19712h-76.1344c3.54304-96.5325 29.10208-145.43872 76.12416-145.43872z" />
                    </svg>
                    <span className="sc-card-prompt-text">{skill.prompt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredCatalogSkills.length === 0 && (
            <div className="sc-empty">
              {catalogLocale.ui.noResults(catalogQuery)}
              <button className="sc-empty-clear" onClick={() => setCatalogQuery('')}>
                {catalogLocale.ui.clear}
              </button>
            </div>
          )}

          {/* Expand / collapse */}
          {filteredCatalogSkills.length > catalogCap && (
            <div className="sc-expand-row">
              <button className="sc-expand-btn" onClick={() => setCatalogExpanded(!catalogExpanded)}>
                {catalogExpanded
                  ? catalogLocale.ui.collapse
                  : catalogLocale.ui.showMore(filteredCatalogSkills.length - catalogCap)}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{ transform: catalogExpanded ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Skill detail modal (Vue <Teleport to="body"> + <Transition name="sc-modal">) */}
      {renderedSkill && active && (
        <div
          className={backdropCls}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpenCatalogSkill(null)
          }}>
          <div className="sc-modal">
            {/* Header */}
            <div className="sc-modal-head">
              <svg className="sc-modal-deco" width="180" height="180" viewBox="0 0 24 24">
                <path d="M12 1.5 L14 10 L22 12 L14 14 L12 22.5 L10 14 L2 12 L10 10 Z" fill="#00b8b8" />
              </svg>
              <button className="sc-modal-close" onClick={() => setOpenCatalogSkill(null)} aria-label="关闭">
                ×
              </button>
              <div className="sc-modal-hero">
                <div
                  className="sc-modal-icon"
                  dangerouslySetInnerHTML={{ __html: CAT_ICONS[renderedSkill.cat] ?? CAT_ICONS.meta }}></div>
                <div>
                  <h2 className="sc-modal-title">{renderedSkill.name}</h2>
                  <div className="sc-modal-meta">
                    <code>{renderedSkill.pkg}</code>
                    <span className="sc-modal-dot">·</span>
                    <span>{catalogLocale.ui.catLabels[renderedSkill.cat]}</span>
                    <span className="sc-modal-dot">·</span>
                    <span>
                      {renderedSkill.tools} {content.catalog.tools}
                    </span>
                  </div>
                </div>
              </div>
              <p className="sc-modal-desc">{renderedSkill.desc}</p>
              <div className="sc-modal-actions">
                <a
                  className="sc-modal-btn-outline"
                  href={`https://github.com/longbridge/skills/blob/main/skills/${renderedSkill.pkg}/SKILL.md`}
                  target="_blank"
                  rel="noreferrer">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.18c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.18a10.94 10.94 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
                  </svg>
                  {content.catalog.viewSkill}
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round">
                    <path d="M7 17 17 7M9 7h8v8" />
                  </svg>
                </a>
                <a className="sc-modal-btn-outline" href={`${siteHostname}/skill/${renderedSkill.pkg}.zip`}>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  {content.catalog.downloadZip}
                </a>
              </div>
            </div>

            {/* Body */}
            <div className="sc-modal-body">
              {/* Install section */}
              <div className="sc-modal-section">
                <div className="sc-modal-client-tabs">
                  {Object.entries(INSTALL_CLIENTS).map(([key, v]) => (
                    <button
                      key={key}
                      className={
                        installClient === key ? 'sc-modal-client-tab sc-modal-client-tab--active' : 'sc-modal-client-tab'
                      }
                      onClick={() => setInstallClient(key)}>
                      {v.label}
                    </button>
                  ))}
                </div>
                <div className="sc-modal-section-hd">
                  <span className="sc-modal-section-label">{content.catalog.install}</span>
                  <span className="sc-modal-section-hint">{content.catalog.installHint}</span>
                </div>
                <div className="sc-modal-cmd-block">
                  <code className={active.cmd.includes('\n') ? 'sc-modal-cmd-text sc-modal-cmd-text--multi' : 'sc-modal-cmd-text'}>
                    {active.cmd}
                  </code>
                  <button className="sc-modal-cmd-copy" onClick={() => handleModalCopy(active.cmd, 'inst')}>
                    {modalCopiedKey === 'inst' ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </div>
              </div>

              {/* Upgrade / Verify section */}
              <div className="sc-modal-section">
                <div className="sc-modal-section-hd">
                  <span className="sc-modal-section-label">{content.catalog.upgradeVerify(active.label)}</span>
                </div>
                <div className="sc-modal-labeled-cmd">
                  <div className="sc-modal-cmd-label">{content.catalog.upgradeTo}</div>
                  <div className="sc-modal-cmd-block">
                    <code className="sc-modal-cmd-text">{active.upgrade}</code>
                    <button className="sc-modal-cmd-copy" onClick={() => handleModalCopy(active.upgrade, 'upg')}>
                      {modalCopiedKey === 'upg' ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                </div>
                <div className="sc-modal-labeled-cmd">
                  <div className="sc-modal-cmd-label">{content.catalog.verifyInstalled}</div>
                  <div className="sc-modal-cmd-block">
                    <code className="sc-modal-cmd-text">{active.verify}</code>
                    <button className="sc-modal-cmd-copy" onClick={() => handleModalCopy(active.verify, 'ver')}>
                      {modalCopiedKey === 'ver' ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Uninstall section */}
              <div className="sc-modal-section">
                <div className="sc-modal-section-hd">
                  <span className="sc-modal-section-label">{content.catalog.uninstall(active.label)}</span>
                  <span className="sc-modal-section-hint">{content.catalog.uninstallHint}</span>
                </div>
                <div className="sc-modal-cmd-block">
                  <code className="sc-modal-cmd-text">{active.uninstall}</code>
                  <button className="sc-modal-cmd-copy" onClick={() => handleModalCopy(active.uninstall, 'uni')}>
                    {modalCopiedKey === 'uni' ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </div>
                <ul className="sc-modal-notes">
                  <li>
                    {content.catalog.uninstallNote1} <code>~/.skills/{renderedSkill.pkg}/</code> {content.catalog.uninstallNote1End}
                  </li>
                  <li>{content.catalog.uninstallNote2}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
