import { useCallback, useEffect, useRef, useState } from 'react'
import type { Locale } from '@longbridge/openapi-utils'
import { localePfx, siteHostname } from './shared'

// 1:1 port of the legacy VitePress `Skill.vue` "Get started" section
// (template lines 1951–2107). Copy below is the `getstarted` slice of the
// legacy LOCALE map, byte-for-byte.

const LOCALE = {
  en: {
    getstarted: {
      eyebrow: 'Get started',
      title: 'Choose your AI tool',
      recommended: 'Recommended',
      card1: {
        title: 'Copy and send to any AI',
        desc: 'Paste this message into any AI assistant (Claude, ChatGPT, Cursor) and it will guide you through the installation.',
      },
      card2: {
        title: 'Download Skill ZIP',
        desc: 'Extract and import into Claude, ChatGPT, Cursor and other AI clients. Includes the full Skill manifest.',
        cta: 'Download longbridge-all.zip',
      },
      card3: {
        title: 'Install via Npx',
        desc: 'For Codex, Claude Code, and similar tools — installs all skills globally.',
      },
      installCmd: `Install Longbridge AI toolkit following the guide:\n${siteHostname}/skill/install.md\n\nAnd complete login and test with a market data query.`,
      footer: {
        also: 'Also available on',
        and: 'and',
        guide: 'View installation guide for each client',
      },
    },
  },
  'zh-CN': {
    getstarted: {
      eyebrow: '开始使用',
      title: '选择您的 AI 工具',
      recommended: '推荐',
      card1: {
        title: '复制发送给任意 AI',
        desc: '将此消息粘贴到任意 AI 助手（Claude、ChatGPT、Cursor），它将引导您完成安装。',
      },
      card2: {
        title: '下载 Skill ZIP 包',
        desc: '解压后导入 Claude、ChatGPT、Cursor 等 AI 客户端。包含完整的 Skill 清单。',
        cta: '下载 longbridge-all.zip',
      },
      card3: {
        title: '通过 Npx 安装',
        desc: '适用于 Codex、Claude Code 等工具——全局安装所有 Skill。',
      },
      installCmd: `请按照以下指南安装 Longbridge AI toolkit：\n${siteHostname}/skill/install.md\n\n安装完成后，完成登录授权，查询一支股票行情确认可用。`,
      footer: {
        also: '也可在以下平台获取',
        and: '和',
        guide: '查看各客户端安装指南',
      },
    },
  },
  'zh-HK': {
    getstarted: {
      eyebrow: '開始使用',
      title: '選擇您的 AI 工具',
      recommended: '推薦',
      card1: {
        title: '複製發送給任意 AI',
        desc: '將此消息貼上到任意 AI 助手（Claude、ChatGPT、Cursor），它將引導您完成安裝。',
      },
      card2: {
        title: '下載 Skill ZIP 包',
        desc: '解壓後導入 Claude、ChatGPT、Cursor 等 AI 客戶端。包含完整的 Skill 清單。',
        cta: '下載 longbridge-all.zip',
      },
      card3: {
        title: '透過 Npx 安裝',
        desc: '適用於 Codex、Claude Code 等工具——全局安裝所有 Skill。',
      },
      installCmd: `請按照以下指南安裝 Longbridge AI toolkit：\n${siteHostname}/skill/install.md\n\n安裝完成後，完成登錄授權，查詢一支股票行情確認可用。`,
      footer: {
        also: '也可在以下平台獲取',
        and: '及',
        guide: '查看各客戶端安裝指南',
      },
    },
  },
}

export function SkillGetStartedSection({ locale }: { locale: Locale }) {
  const content = LOCALE[locale] ?? LOCALE.en
  const t = content.getstarted
  const installCmd = t.installCmd
  const pfx = localePfx(locale)

  // Legacy: `copiedGetStarted` ref (line 1120) + `copyGetStarted()` (1173–1181).
  const [copiedGetStarted, setCopiedGetStarted] = useState(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current)
    },
    []
  )

  const copyGetStarted = useCallback(() => {
    if (typeof navigator === 'undefined') return
    navigator.clipboard.writeText(installCmd).then(() => {
      setCopiedGetStarted(true)
      if (resetTimer.current) clearTimeout(resetTimer.current)
      resetTimer.current = setTimeout(() => {
        setCopiedGetStarted(false)
      }, 2000)
    })
  }, [installCmd])

  return (
    <section className="section" style={{ borderTop: '1px solid var(--app-card-stroke)', background: 'var(--app-canvas)' }}>
      <div className="section-inner">
        <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto' }}>
          <span className="eyebrow">{t.eyebrow}</span>
          <h2 className="h-section" style={{ marginTop: '14px' }}>
            {t.title}
          </h2>
        </div>
        <div className="skill-getstarted-grid">
          <div className="skill-getstarted-card">
            <div
              className="skill-getstarted-icon"
              style={{ background: 'color-mix(in srgb, var(--lb-brand) 12%, transparent)', color: 'var(--lb-brand)' }}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </div>
            <h3 className="h-card" style={{ marginTop: '16px' }}>
              {t.card1.title}
            </h3>
            <p
              className="t-meta"
              style={{ marginTop: '8px', lineHeight: 1.55, flex: 1 }}
              dangerouslySetInnerHTML={{ __html: t.card1.desc }}></p>
            <div className="skill-getstarted-cmd">
              <code>{installCmd}</code>
              <button className="code-copy" onClick={copyGetStarted} title={copiedGetStarted ? 'Copied!' : 'Copy'}>
                {!copiedGetStarted ? (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                ) : (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="skill-getstarted-card recommended">
            <span className="skill-getstarted-badge">{t.recommended}</span>
            <div
              className="skill-getstarted-icon"
              style={{ background: 'color-mix(in srgb, var(--lb-up) 14%, transparent)', color: 'var(--lb-up)' }}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <h3 className="h-card" style={{ marginTop: '16px' }}>
              {t.card2.title}
            </h3>
            <p className="t-meta" style={{ marginTop: '8px', lineHeight: 1.55, flex: 1 }}>
              {t.card2.desc}
            </p>
            <a
              className="btn btn-primary"
              style={{ marginTop: '14px', alignSelf: 'flex-start' }}
              href="/skill/longbridge-all.zip"
              target="_blank">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              {t.card2.cta}
            </a>
          </div>

          <div className="skill-getstarted-card">
            <div
              className="skill-getstarted-icon"
              style={{
                background: 'color-mix(in srgb, var(--lb-status-alert) 14%, transparent)',
                color: 'var(--lb-status-alert)',
              }}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round">
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
            </div>
            <h3 className="h-card" style={{ marginTop: '16px' }}>
              {t.card3.title}
            </h3>
            <p className="t-meta" style={{ marginTop: '8px', lineHeight: 1.55, flex: 1 }}>
              {t.card3.desc}
            </p>
            <div className="skill-getstarted-cmd">
              <code>
                <span style={{ color: 'var(--lb-brand)' }}>$</span> npx skills add longbridge/skills -g
              </code>
            </div>
          </div>
        </div>

        <div className="skill-getstarted-foot">
          {t.footer.also}{' '}
          <a href="https://www.skills.sh/longbridge/skills" target="_blank">
            skills.sh
          </a>{' '}
          {t.footer.and}{' '}
          <a href="https://github.com/longbridge/skills" target="_blank">
            GitHub
          </a>
          .{' '}
          <span style={{ color: 'var(--lb-fg-3)' }}>·</span>
          <a href={pfx + '/skill/install'} style={{ color: 'var(--lb-brand)', fontWeight: 600 }}>
            {t.footer.guide}{' '}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '3px' }}>
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
