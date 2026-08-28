/**
 * SkillCasesSection.tsx
 * 1:1 port of the "SEE IT IN ACTION · Real user cases, real returns." section
 * of the legacy VitePress `Skill.vue` (template lines 1887–1948).
 * Copy: `LOCALE.<locale>.cases` (en 111–123, zh-CN 239–268, zh-HK 492–521).
 * Data: `USER_CASES` (895–923). Styles live in ../Skill.css (scoped under
 * `.skill-page-root`, provided by <SkillPage>).
 */
import type { Locale } from '@longbridge/openapi-utils'

// ── Copy ──────────────────────────────────────────────────────────────────────

interface CaseItemCopy {
  title: string
  desc: string
  metricLabel: string
}

interface CasesCopy {
  eyebrow: string
  title: string
  desc: string
  read: string
  award: {
    tag: string
    title: string
    desc: string
    taskCoins: string
    perWinner: string
  }
  /** en has no `items`: the template falls back to USER_CASES[i] per field. */
  items?: CaseItemCopy[]
}

const LOCALE: Record<Locale, { cases: CasesCopy }> = {
  en: {
    cases: {
      eyebrow: 'SEE IT IN ACTION',
      title: 'Real user cases, real returns.',
      desc: 'Hand-picked write-ups from the <a href="https://longbridge.com/en/news">Longbridge community</a>. From quick experiments to fully-deployed quant systems — see what people are shipping with Skill.',
      read: 'Read case',
      award: {
        tag: 'AWARD',
        title: 'Each winner receives 10,000 Task Coins + 1 × AirPods 4',
        desc: "Winning cases are showcased on the Longbridge Skill website — visible to users worldwide, including the winner's ID and creative work.",
        taskCoins: 'TASK COINS',
        perWinner: 'PER WINNER',
      },
    },
  },
  'zh-CN': {
    cases: {
      eyebrow: '实战案例',
      title: '真实用户案例，真实回报',
      desc: '精选<a href="https://longbridge.com/news">长桥社区</a>用户分享。从快速实验到全面部署的量化系统——看看大家用 Skill 在做什么。',
      read: '阅读案例',
      award: {
        tag: '奖励',
        title: '每位获奖者将获得 10,000 任务币 + 1 × AirPods 4',
        desc: '获奖案例将在 Longbridge Skill 官网展示，全球用户可见，包含获奖者 ID 和创作内容。',
        taskCoins: '任务币',
        perWinner: '每位获奖者',
      },
      items: [
        {
          title: '用 AI 挖掘期权机会',
          desc: 'AI 筛选 39 个合约，捕捉最优期权机会——最高年化收益率 423%。',
          metricLabel: '年化最高',
        },
        {
          title: '初体验 Longbridge Skill——真香',
          desc: '用自然语言控制交易终端、查行情、分析持仓——出乎意料地好用。',
          metricLabel: '初体验',
        },
        {
          title: 'QQQ 0DTE 量化系统：从零到实盘',
          desc: '完整流程：策略设计、回测，以及部署 QQQ 0DTE 期权量化系统。',
          metricLabel: '量化实盘',
        },
      ],
    },
  },
  'zh-HK': {
    cases: {
      eyebrow: '實戰案例',
      title: '真實用戶案例，真實回報。',
      desc: '精選<a href="https://longbridge.com/news">長橋社區</a>用戶分享。從快速實驗到全面部署的量化系統——看看大家用 Skill 在做什麼。',
      read: '閱讀案例',
      award: {
        tag: '獎勵',
        title: '每位獲獎者將獲得 10,000 任務幣 + 1 × AirPods 4',
        desc: '獲獎案例將在 Longbridge Skill 官網展示，全球用戶可見，包含獲獎者 ID 和創作內容。',
        taskCoins: '任務幣',
        perWinner: '每位獲獎者',
      },
      items: [
        {
          title: '用 AI 挖掘期權機會',
          desc: 'AI 篩選 39 個合約，捕捉最優期權機會——最高年化收益率 423%。',
          metricLabel: '年化最高',
        },
        {
          title: '初體驗 Longbridge Skill——真香',
          desc: '用自然語言控制交易終端、查行情、分析持倉——出乎意料地好用。',
          metricLabel: '初體驗',
        },
        {
          title: 'QQQ 0DTE 量化系統：從零到實盤',
          desc: '完整流程：策略設計、回測，以及部署 QQQ 0DTE 期權量化系統。',
          metricLabel: '量化實盤',
        },
      ],
    },
  },
}

// ── Data ──────────────────────────────────────────────────────────────────────

const USER_CASES = [
  {
    id: 'options',
    title: 'Scanning Options Opportunities with AI',
    desc: 'AI-scanned 39 contracts to surface the best options plays — peak annualized return of 423%.',
    metric: '423%',
    metricLabel: 'MAX ANNUALIZED',
    href: 'https://longbridge.com/topics/39722881',
    accent: 'var(--lb-up)',
  },
  {
    id: 'first',
    title: 'First Impressions of Longbridge Skill — Pretty Cool',
    desc: 'Control a trading terminal with natural language, explore quotes and analyze positions — surprisingly cool.',
    metric: 'Cool',
    metricLabel: 'FIRST IMPRESSION',
    href: 'https://longbridge.com/topics/39679744',
    accent: 'var(--lb-brand)',
  },
  {
    id: 'qqq',
    title: 'QQQ 0DTE Quant System: From Zero to Live',
    desc: 'End-to-end walkthrough: strategy design, backtesting, and deploying a QQQ 0DTE options quant system.',
    metric: '0DTE',
    metricLabel: 'QUANT LIVE',
    href: 'https://longbridge.com/topics/39996427',
    accent: 'var(--lb-ai-mention)',
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

export function SkillCasesSection({ locale }: { locale: Locale }) {
  // Legacy line 1122: `LOCALE[lang] ?? LOCALE.en`.
  const content = LOCALE[locale] ?? LOCALE.en

  return (
    <section className="section" style={{ paddingTop: 48 }}>
      <div className="section-inner">
        <div style={{ textAlign: 'left', maxWidth: 640, marginBottom: 32 }}>
          <span className="eyebrow">{content.cases.eyebrow}</span>
          <h2 className="h-section" style={{ marginTop: 14 }}>
            {content.cases.title}
          </h2>
          <p
            className="t-meta"
            style={{ marginTop: 10, lineHeight: 1.55 }}
            dangerouslySetInnerHTML={{ __html: content.cases.desc }}
          />
        </div>

        <div className="user-cases-grid">
          <a href="https://longbridge.com/topics/39630019" target="_blank" rel="noreferrer" className="user-case-award">
            <div className="user-case-award-tag">
              <span>{content.cases.award.tag}</span>
              <span className="user-case-award-tag-line"></span>
            </div>
            <div>
              <h3 className="user-case-award-h">{content.cases.award.title}</h3>
              <p className="user-case-award-d">{content.cases.award.desc}</p>
            </div>
            <div className="user-case-award-rewards">
              <div>
                <div className="user-case-award-num">10,000</div>
                <div className="user-case-award-l">{content.cases.award.taskCoins}</div>
              </div>
              <div>
                <div className="user-case-award-num">AirPods 4</div>
                <div className="user-case-award-l">{content.cases.award.perWinner}</div>
              </div>
            </div>
          </a>

          {USER_CASES.map((c, i) => (
            <a key={c.id} href={c.href} target="_blank" rel="noreferrer" className="user-case">
              <div className="user-case-head">
                <span className="user-case-idx">{String(i + 1).padStart(2, '0')}</span>
                <span className="user-case-read">
                  {/* Vue whitespace-condense yields the single text node "Read case "
                      before the <svg>; concatenate (not `{' '}`) so React SSR emits
                      one text node too instead of splitting with a `<!-- -->`. */}
                  {content.cases.read + ' '}
                  <svg
                    width="11"
                    height="11"
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
                </span>
              </div>
              <h3 className="user-case-title">{content.cases.items?.[i]?.title ?? c.title}</h3>
              <p className="user-case-desc">{content.cases.items?.[i]?.desc ?? c.desc}</p>
              <div className="user-case-metric">
                <span className="user-case-metric-v" style={{ color: c.accent }}>
                  {c.metric}
                </span>
                <span className="user-case-metric-l">{content.cases.items?.[i]?.metricLabel ?? c.metricLabel}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
