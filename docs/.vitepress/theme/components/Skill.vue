<script setup lang="ts">
import { ref, computed } from 'vue'
import AppNav from './AppNav.vue'
import AppFooter from './AppFooter.vue'
import { localePath } from '../utils/i18n'

const SKILLS = [
  {
    id: 'longbridge',
    name: 'Longbridge Overview',
    cat: 'Platform',
    desc: 'Full-stack financial data and trading platform — CLI, Python/Rust SDK, MCP, and LLM integration.',
    example: "What is NVDA's current price, recent news, and how does it affect my positions?",
  },
  {
    id: 'longbridge-quote',
    name: 'Real-time Quote',
    cat: 'Market',
    tag: 'Popular',
    desc: 'Real-time quotes, static reference, and valuation indices for HK/US/A-share/Singapore stocks — price, change, volume, PE/PB, turnover rate.',
    example: 'Get me AAPL, TSLA, and 9988.HK current price and change.',
  },
  {
    id: 'longbridge-depth',
    name: 'Order Book Depth',
    cat: 'Market',
    desc: 'Level-2 5/10-level bid/ask orderbook, HK broker queue, and tick-by-tick trade data.',
    example: "What does TSLA's 5-level bid/ask orderbook look like right now?",
  },
  {
    id: 'longbridge-kline',
    name: 'K-line / Intraday',
    cat: 'Market',
    desc: "Candlestick/OHLCV data for 1m/5m/15m/30m/1h/day/week/month/year periods, plus today's intraday minute series.",
    example: "Pull NVDA's daily chart for the past 6 months and show the trend.",
  },
  {
    id: 'longbridge-capital-flow',
    name: 'Capital Flow',
    cat: 'Market',
    desc: 'Intraday capital-flow time series and large/medium/small order distribution for a single stock. Same-day data only.',
    example: 'How much net institutional inflow did 700.HK see today?',
  },
  {
    id: 'longbridge-fx',
    name: 'Exchange Rate',
    cat: 'Market',
    desc: 'Real-time FX rates for all Longbridge-supported currencies. Multi-currency portfolio conversion and cross-rate derivation.',
    example: "What's USD/HKD today? Convert my whole portfolio to USD.",
  },
  {
    id: 'longbridge-fundamental',
    name: 'Fundamentals',
    cat: 'Research',
    desc: 'Company financials — revenue, net income, EPS, ROE, margins, cash flow, dividend history, analyst consensus, and ratings.',
    example: "Give me NVDA's latest quarterly revenue, gross margin, and EPS.",
  },
  {
    id: 'longbridge-valuation',
    name: 'Valuation',
    cat: 'Research',
    desc: 'Current PE/PB/PS/EV-EBITDA snapshot, 1–3 year historical percentile, industry median, and industry rank.',
    example: "Where does Apple's current PE sit in its historical percentile?",
  },
  {
    id: 'longbridge-peer-comparison',
    name: 'Peer Comparison',
    cat: 'Research',
    desc: '2–5 symbol comparison matrix — valuation, price, revenue KPIs, and market cap, with cross-currency caveats.',
    example: 'Compare NVDA, AMD, and INTC on valuation and revenue growth.',
  },
  {
    id: 'longbridge-filings',
    name: 'SEC Filings',
    cat: 'Research',
    desc: 'Full-text regulatory filings (10-K, 10-Q, 8-K) returned as parsed Markdown for LLM ingestion.',
    example: "Summarize TSLA's last 10-K risk factors.",
  },
  {
    id: 'longbridge-eps-forecast',
    name: 'EPS Forecast',
    cat: 'Research',
    desc: 'Analyst consensus revenue/EPS forecasts, beat-miss history, and target-price distribution.',
    example: "What's the analyst consensus for AAPL's next quarter EPS?",
  },
  {
    id: 'longbridge-institutional',
    name: 'Institutional Holders',
    cat: 'Research',
    desc: 'Institutional shareholders with position changes and aggregated fund-manager moves.',
    example: 'Who are the top institutional holders of NVDA and how have they moved?',
  },
  {
    id: 'longbridge-dividend',
    name: 'Dividend History',
    cat: 'Research',
    desc: 'Dividend history and distribution details — ex-date, pay-date, amount, yield trend.',
    example: "Show me 700.HK's 5-year dividend history.",
  },
  {
    id: 'longbridge-rating',
    name: 'Analyst Ratings',
    cat: 'Research',
    desc: 'Institution ratings, upgrade/downgrade history, and target price distribution.',
    example: 'What ratings has Goldman issued on TSLA over the last year?',
  },
  {
    id: 'longbridge-funds',
    name: 'Funds Holding',
    cat: 'Research',
    desc: 'Funds and ETFs that hold a given symbol, with position weight and rebalance dates.',
    example: 'Which ETFs hold AMD with weight >2%?',
  },
  {
    id: 'longbridge-options',
    name: 'Option Chain',
    cat: 'Derivatives',
    desc: 'Full option chain with Greeks, IV surface, open interest by strike, and unusual options activity.',
    example: "Show me TSLA's weekly options chain with IV and Greeks.",
  },
  {
    id: 'longbridge-news',
    name: 'News',
    cat: 'Discovery',
    desc: 'Real-time news articles for one or more symbols, with provenance, sentiment, and full body.',
    example: "What's the latest news on NVDA earnings?",
  },
  {
    id: 'longbridge-community',
    name: 'Community',
    cat: 'Discovery',
    desc: 'Community discussion topics, hot threads, and engagement metrics by symbol.',
    example: 'What are people saying about 9988.HK on the community right now?',
  },
  {
    id: 'longbridge-watchlist',
    name: 'Watchlist',
    cat: 'Discovery',
    desc: 'List, create, update, and delete watchlist groups across the Longbridge account.',
    example: 'Add NVDA, TSLA, and 700.HK to my Semis watchlist.',
  },
  {
    id: 'longbridge-calendar',
    name: 'Calendar & Events',
    cat: 'Discovery',
    desc: 'Upcoming earnings, macro events, dividend ex-dates, and trading session/holiday schedules.',
    example: 'Which earnings reports drop next week from my watchlist?',
  },
  {
    id: 'longbridge-sentiment',
    name: 'Market Sentiment',
    cat: 'Discovery',
    desc: 'Market temperature index (0–100), put/call ratio, and breadth indicators by market.',
    example: "What's HK's market temperature right now and historically?",
  },
  {
    id: 'longbridge-screener',
    name: 'Stock Screener',
    cat: 'Discovery',
    desc: 'Multi-factor stock screener — combine valuation, momentum, fundamentals, and ratings filters.',
    example: 'Find US tech stocks with PE under 25 and revenue growth above 15%.',
  },
  {
    id: 'longbridge-hot',
    name: 'Hot Stocks',
    cat: 'Discovery',
    desc: 'Top movers by volume, gainers/losers, and unusual-volume detection by market.',
    example: "What are today's most-traded HK stocks by volume?",
  },
  {
    id: 'longbridge-order',
    name: 'Submit Order',
    cat: 'Trade',
    desc: 'Limit, market, stop-limit, or auction orders. Includes trailing stops and conditional orders.',
    example: 'Buy 100 shares of TSLA limit $420 day-only.',
  },
  {
    id: 'longbridge-modify',
    name: 'Modify / Cancel',
    cat: 'Trade',
    desc: "List today's orders, modify quantity/price, cancel pending orders.",
    example: 'Cancel my open limit order on NVDA.',
  },
  {
    id: 'longbridge-estimate',
    name: 'Estimate Max Qty',
    cat: 'Trade',
    desc: 'Estimate max buy/sell quantity for a symbol based on buying power and margin ratio.',
    example: 'How many TSLA shares can I buy with my buying power?',
  },
  {
    id: 'longbridge-margin',
    name: 'Margin Ratio',
    cat: 'Trade',
    desc: 'Margin ratio requirements per symbol — initial margin, maintenance margin, and short rate.',
    example: "What's the margin requirement for shorting 700.HK?",
  },
  {
    id: 'longbridge-positions',
    name: 'Positions',
    cat: 'Portfolio',
    desc: 'Stock and fund positions across all sub-accounts with cost basis, P&L, and allocation.',
    example: 'Show me all my positions sorted by unrealized P&L.',
  },
  {
    id: 'longbridge-balance',
    name: 'Account Balance',
    cat: 'Portfolio',
    desc: 'Account cash balance, financing/buying power, and currency breakdown across sub-accounts.',
    example: "What's my buying power in USD across sub-accounts?",
  },
  {
    id: 'longbridge-cashflow',
    name: 'Cash Flow',
    cat: 'Portfolio',
    desc: 'Cash flow records — deposits, withdrawals, dividends, fees, and statements (daily / monthly).',
    example: "Show me all dividends I've received in the last 3 months.",
  },
]

const SKILL_CATS = [
  { key: 'All', count: 30 },
  { key: 'Market', count: 6 },
  { key: 'Research', count: 9 },
  { key: 'Derivatives', count: 1 },
  { key: 'Discovery', count: 7 },
  { key: 'Trade', count: 4 },
  { key: 'Portfolio', count: 3 },
  { key: 'Platform', count: 1 },
]

const SKILL_AGENTS = [
  { name: 'Claude', mark: 'C', color: '#D97757' },
  { name: 'Claude Code', mark: 'C', color: '#D97757' },
  { name: 'ChatGPT', mark: 'G', color: '#10A37F' },
  { name: 'Codex', mark: 'O', color: '#000000' },
  { name: 'Cursor', mark: '➤', color: '#000000' },
  { name: 'Gemini', mark: 'G', color: '#1A73E8' },
  { name: 'OpenClaw', mark: 'O', color: 'var(--lb-brand)' },
  { name: 'Zed', mark: 'Z', color: '#0E40D9' },
]

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

const DEMO_AGENTS = ['OpenClaw', 'ChatGPT', 'Claude', 'Claude Code']

const DEMO_SCENARIOS = [
  {
    id: 'screen',
    nav: 'Cross-Market Screening',
    title: 'HK · US · A-share · Singapore — multi-market screening in one shot.',
    desc: 'Tracking opportunities across markets is brittle. Tell the AI your criteria — market cap, PE range, sector — and layer in technical signals like KDJ golden cross or MACD bullish. Cross-market filter, unified results.',
    prompt:
      'From US + HK markets, screen for tech stocks with market cap above ¥50B, PE under 25, and recent MACD golden cross — sort by market cap.',
    summary:
      'US + HK tech sector screen complete — 8 stocks match market cap ≥ ¥50B and PE < 25. 3 of them have confirmed recent MACD golden cross (DIF crossed up through DEA).',
    tableHead: ['Symbol', 'Name', 'Mkt Cap', 'PE', 'MACD', 'Signal'],
    tableRows: [
      ['700.HK', 'Tencent', 'HK$4,689B', '18.84', 'DIF<DEA', 'Watch', false],
      ['9988.HK', 'Alibaba', 'HK$2,353B', '22.90', 'DIF<DEA', 'Watch', false],
      ['IBM.US', 'IBM', '$233B', '22.01', 'DIF>DEA ✓', 'Cross', true],
      ['1810.HK', 'Xiaomi', 'HK$847B', '17.53', 'DIF<DEA', 'Watch', false],
      ['9999.HK', 'NetEase', 'HK$560B', '15.00', 'DIF>DEA ✓', 'Cross', true],
      ['9618.HK', 'JD.com', 'HK$304B', '14.00', 'DIF=+0.22 ★', 'Strongest', 'best'],
      ['992.HK', 'Lenovo', 'HK$114B', '9.95', 'DIF<DEA', 'Watch', false],
      ['285.HK', 'BYD Electronics', 'HK$70B', '14.69', 'DIF>DEA ✓', 'Cross', true],
    ],
    callout:
      'Strongest MACD golden cross: 9618.HK (JD.com) — DIF crossed up from −0.08 through the zero axis to +0.22, the strongest near-zero-axis cross with the cleanest trend. IBM.US and 9999.HK also confirm. Tencent / Alibaba / Xiaomi DIF still below DEA — signal not yet satisfied.',
  },
  {
    id: 'tech',
    nav: 'Technical Diagnosis',
    title: 'Read the chart for any symbol — MACD, KDJ, RSI, BOLL, in one prompt.',
    desc: 'Skip the screenshots. Ask for a technical readout on any symbol and Skill pulls the daily / hourly candles, runs the indicators, and tells you what to look at — golden crosses, divergence, oversold zones.',
    prompt: 'Diagnose NVDA.US — MACD, KDJ, RSI on the daily, and tell me which signals to trust.',
    summary:
      'NVDA.US daily chart, last 90 sessions: trend strong but MACD histogram is shrinking — momentum cooling. KDJ overbought (J=92.4), RSI 71.8 — short-term pullback risk elevated.',
    tableHead: ['Indicator', 'Value', 'Reading', 'Conviction'],
    tableRows: [
      ['MACD', 'DIF +1.42 / DEA +1.18', 'Above zero · histogram ↓', 'Watch', false],
      ['KDJ', 'K=88.4 D=84.2 J=92.4', 'Overbought · J > 80', 'Caution', false],
      ['RSI(14)', '71.8', 'Overbought · > 70', 'Caution', false],
      ['BOLL', 'Mid: $138.4 Upper: $152.1', 'Riding upper band', 'Strong trend', true],
      ['Volume', 'vs 20D avg 1.18×', 'Above average — confirmed', 'Confirmed', 'best'],
    ],
    callout:
      'Bias: short-term pullback risk, medium-term trend intact. KDJ + RSI both overbought, MACD histogram shrinking — first leg of a corrective pullback likely. Watch the $135 level (20D MA + lower BOLL band confluence) for re-entry.',
  },
  {
    id: 'earnings',
    nav: 'Earnings Research',
    title: 'Decode earnings before the print — consensus, options pricing, key items.',
    desc: 'Skill pulls analyst consensus, the EPS surprise history, and the IV-implied move from the options market. You get the numbers to beat and what the call should address — before you commit capital.',
    prompt: 'NVDA reports tonight. Pull consensus, the IV-implied move, and what to watch for on the call.',
    summary: 'NVDA Q3 FY26 print tonight after close. Consensus and post-earnings move expectations below.',
    tableHead: ['Item', 'Consensus', 'Last quarter', 'Y/Y'],
    tableRows: [
      ['Revenue', '$33.10B', '$30.04B', '+90.4%', 'best'],
      ['EPS (adj.)', '$0.85', '$0.68', '+90.0%', true],
      ['Data-center', '$29.20B', '$26.27B', '+108.0%', true],
      ['Gross margin', '75.0%', '75.1%', '−10 bps', false],
      ['IV-implied move', '±9.2%', '—', 'ATM 30-day weekly', false],
    ],
    callout:
      '3 things to watch on the call: (1) Data-center growth rate vs the +108% bar, (2) China commentary post-export controls, (3) FY26 capacity / supply guide. Options IV pricing a ±9.2% move — historical 4-quarter realized move averages ±7.4%.',
  },
  {
    id: 'smartmoney',
    nav: 'Smart-Money Tracking',
    title: 'See where institutional capital is rotating — same-day, by sector.',
    desc: 'Aggregate same-day capital flow across symbols, weighted by large-order share. Skill compares net inflow to 20-day baselines, surfaces the sectors institutions are accumulating or distributing.',
    prompt:
      'Which HK sectors are seeing institutional accumulation today? Show me the top 3 with net inflow > 2× 20-day baseline.',
    summary:
      'HK same-session capital flow snapshot: 3 sectors with abnormal institutional accumulation. Top of the leaderboard is consumer discretionary, on a 2.4× 20-day average.',
    tableHead: ['Sector', 'Net inflow', 'vs 20D avg', 'Large-order share', 'Leader'],
    tableRows: [
      ['Consumer Discretionary', '+HK$3.82B', '2.40×', '61%', '9618.HK · +HK$1.21B', 'best'],
      ['Semis & Hardware', '+HK$2.14B', '2.18×', '57%', '1810.HK · +HK$680M', true],
      ['Internet', '+HK$1.92B', '2.05×', '52%', '700.HK · +HK$520M', true],
      ['Real Estate', '−HK$0.84B', '−1.10×', '48%', '1109.HK · −HK$210M', false],
    ],
    callout:
      "Highest conviction: Consumer Discretionary — 2.4× baseline net inflow, 61% large-order share suggests institutional rather than retail. 9618.HK leads at +HK$1.21B; the same name showed the strongest MACD cross in this morning's screen.",
  },
  {
    id: 'order',
    nav: 'Advanced Orders',
    title: 'Conditional orders, multi-leg options — described in plain English.',
    desc: 'Trailing stops, OCO brackets, dollar-cost-average ladders, multi-leg option spreads — describe the structure once and Skill places the legs with proper risk checks. Confirmation step before submission.',
    prompt: 'Sell to open a TSLA $450/$470 call credit spread for next Friday — size for $500 max risk.',
    summary: 'Two-leg spread sized to your risk budget. Awaiting confirmation before submission.',
    tableHead: ['Leg', 'Action', 'Strike', 'Expiry', 'Mid', 'Qty'],
    tableRows: [
      ['1 · Short call', 'Sell to open', '$450', 'Nov 28', '$5.20', '2', true],
      ['2 · Long call', 'Buy to open', '$470', 'Nov 28', '$2.40', '2', true],
    ],
    callout:
      'Net credit: +$5.60 per spread × 2 = +$1,120. Max risk $2,880, breakeven $455.60. Reply confirm to submit both legs; Skill places the short leg first, then the long, with a 5s timeout safety.',
  },
  {
    id: 'review',
    nav: 'Portfolio Review',
    title: 'Weekly portfolio check-up — concentration, factor exposure, drawdown risk.',
    desc: 'Skill scans your positions across sub-accounts, calculates concentration risk per name and per sector, and flags the highest-drawdown-risk holdings using current options IV as a forward proxy.',
    prompt: 'Review my portfolio. Flag concentration risks and the 3 highest forward-volatility holdings.',
    summary:
      'Portfolio total value $128,365. Tech weighting 52% — well above the 35% target. Three holdings carry elevated forward IV.',
    tableHead: ['Symbol', 'Weight', 'P&L', 'Forward IV', 'Risk'],
    tableRows: [
      ['NVDA.US', '31.2%', '+12.1%', '42% — high', 'Concentration', 'best'],
      ['TSLA.US', '11.4%', '+4.6%', '58% — earnings', 'Earnings IV', true],
      ['700.HK', '9.8%', '+8.2%', '31%', 'Healthy', false],
      ['9988.HK', '5.4%', '−2.1%', '34%', 'Healthy', false],
      ['AAPL.US', '4.7%', '+1.8%', '22%', 'Healthy', false],
    ],
    callout:
      'Recommendation: trim NVDA by 10–15% on next strength — sector cap of 35% is breached and earnings IV crush is approaching. Consider a TSLA collar through earnings (sell upside call, buy ATM put) to neutralize the +58% IV print risk without closing the position.',
  },
]

const CAP_REFERENCE = [
  {
    title: 'Real-time Market Data',
    items: [
      'Live quotes for one or more symbols',
      'Level 2 order book depth (bid/ask ladder)',
      'Tick-by-tick recent trades',
      'Intraday minute-by-minute price & volume',
      'OHLCV candlesticks & historical date-range data',
      'Intraday capital flow & distribution',
      'Market sentiment temperature index (0–100)',
      'Static reference info (lot size, shares, EPS)',
      'Option quotes & option chain',
      'Warrant quotes & warrants by underlying',
    ],
  },
  {
    title: 'Fundamentals & Research',
    items: [
      'Income statement, balance sheet, cash flow',
      'P/E, P/B, P/S, dividend yield + peer comparison',
      'Analyst EPS forecasts',
      'Revenue & profit consensus with beat/miss',
      'Institution ratings & target price distribution',
      'Calculated financial indexes (PE, PB, DPS rate)',
      'Institutional shareholders with position changes',
      'Funds & ETFs that hold a given symbol',
      'Dividend history & distribution details',
      'SEC / regulatory filings (full Markdown content)',
    ],
  },
  {
    title: 'Calendar & Events',
    items: [
      'Upcoming earnings events by symbol',
      'High-importance macro data events',
      'Upcoming dividend events by market',
      'Trading session schedule & holiday calendar',
    ],
  },
  {
    title: 'News, Community & Watchlist',
    items: [
      'Latest news articles for a symbol',
      'Community discussion topics',
      'Watchlist groups: list, create, update, delete',
    ],
  },
  {
    title: 'Account & Portfolio',
    items: [
      'Stock positions across all sub-accounts',
      'Fund positions across all sub-accounts',
      'Account cash balance & financing info',
      'Cash flow records (deposits, withdrawals, dividends)',
      'Account statements (daily / monthly)',
      'Exchange rates for all supported currencies',
    ],
  },
  {
    title: 'Trading',
    items: [
      'Limit, market, or stop-limit orders',
      "List today's orders, view detail, executions",
      'Cancel a pending order',
      'Modify quantity or price of a pending order',
      'Estimate max buy/sell quantity',
      'Margin ratio requirements for a symbol',
    ],
  },
]

const activeCat = ref('All')
const scenarioIdx = ref(0)
const activeAgent = ref('OpenClaw')
const copied = ref(false)
const copiedGetStarted = ref(false)

const filteredSkills = computed(() =>
  activeCat.value === 'All' ? SKILLS : SKILLS.filter((s) => s.cat === activeCat.value)
)
const activeScenario = computed(() => DEMO_SCENARIOS[scenarioIdx.value])

const installCmd = `Install Longbridge AI toolkit following the guide:\nhttps://open.longbridge.com/skill/install.md`

function copyInstall() {
  if (typeof navigator === 'undefined') return
  navigator.clipboard.writeText(installCmd).then(() => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  })
}

function copyGetStarted() {
  if (typeof navigator === 'undefined') return
  navigator.clipboard.writeText(installCmd).then(() => {
    copiedGetStarted.value = true
    setTimeout(() => {
      copiedGetStarted.value = false
    }, 2000)
  })
}

function rowClass(flag: string | boolean) {
  if (flag === 'best') return 'is-best'
  if (flag === true) return 'is-cross'
  return ''
}
</script>

<template>
  <div class="page-root skill-page-root">
    <AppNav />

    <!-- Hero -->
    <section class="skill-hero">
      <div class="skill-hero-bg" />
      <div class="section-inner skill-hero-inner">
        <div style="text-align: center; max-width: 760px; margin: 0 auto">
          <span class="eyebrow">Longbridge Developers · Skill</span>
          <h1 class="h-display" style="margin-top: 20px; font-size: clamp(36px, 4.8vw, 56px)">
            Longbridge Skill
            <br />
            <span style="color: var(--lb-brand)">your AI's trading desk.</span>
          </h1>
          <p
            class="t-body"
            style="margin-top: 24px; max-width: 640px; margin-left: auto; margin-right: auto; font-size: 16px">
            Unlock market insights, deep research and intelligent trading for your AI. With Longbridge Skill, your AI
            assistant — Claude, Cursor, ChatGPT, Gemini, Codex — can screen stocks, decode earnings, track insider
            moves, and place orders, all in plain conversation.
          </p>

          <div class="skill-hero-install">
            <div class="skill-hero-install-label">Copy and send to any AI — it will walk you through install:</div>
            <div class="skill-hero-install-cmd">
              <code>{{ installCmd }}</code>
              <button class="code-copy" @click="copyInstall" :title="copied ? 'Copied!' : 'Copy'">
                <svg
                  v-if="!copied"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <svg
                  v-else
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
            </div>
            <a class="skill-hero-install-link" :href="localePath('/skill/install')">
              View installation guide for each client
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          </div>

          <div class="skill-hero-agents">
            <span
              class="t-meta"
              style="
                font-size: 11.5px;
                font-weight: 600;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                color: var(--lb-fg-3);
              "
              >Supported AI tools</span
            >
            <div class="skill-hero-agents-row">
              <div v-for="a in SKILL_AGENTS" :key="a.name" class="ai-agent-chip">
                <span class="ai-agent-mark" :style="{ background: a.color }">{{ a.mark }}</span>
                {{ a.name }}
              </div>
              <div class="ai-agent-chip ai-agent-more">+ any Skill-compatible agent</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Demo -->
    <section class="section" style="padding-top: 60px">
      <div class="section-inner">
        <div style="text-align: center; max-width: 560px; margin: 0 auto 36px">
          <h2 class="h-section" style="margin-top: 0">See what Skill can do for you.</h2>
          <p class="t-meta" style="margin-top: 12px; line-height: 1.55">
            Pick a scenario to see your AI assistant in action.
          </p>
        </div>

        <div class="skill-demo-shell">
          <div class="skill-demo-agent-tabs">
            <button
              v-for="a in DEMO_AGENTS"
              :key="a"
              :class="['skill-demo-agent-tab', a === activeAgent ? 'is-active' : '']"
              @click="activeAgent = a">
              {{ a }}
            </button>
          </div>

          <div class="skill-demo-body-grid">
            <aside class="skill-demo-nav">
              <button
                v-for="(sc, i) in DEMO_SCENARIOS"
                :key="sc.id"
                :class="['skill-demo-nav-item', i === scenarioIdx ? 'is-active' : '']"
                @click="scenarioIdx = i">
                {{ sc.nav }}
              </button>
            </aside>

            <div class="skill-demo-main">
              <h3 class="skill-demo-title">{{ activeScenario.title }}</h3>
              <p class="skill-demo-desc">{{ activeScenario.desc }}</p>

              <div class="skill-demo-prompt-label">Try asking</div>
              <div class="skill-demo-prompt">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style="color: var(--lb-brand); flex-shrink: 0; margin-top: 3px">
                  <path
                    d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.949 49.949 0 0 0-9.902 3.912l-.003.002-.34.18a.75.75 0 0 1-.707 0A50.009 50.009 0 0 0 7.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.129 56.129 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
                  <path
                    d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 0 1-.46.71 47.878 47.878 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.877 47.877 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 0 1 6 13.18v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 0 0 .551-1.608 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.668 2.25 2.25 0 0 0 2.12 0Z" />
                </svg>
                <span>{{ activeScenario.prompt }}</span>
              </div>

              <div class="skill-demo-chat">
                <div class="skill-demo-chat-head">
                  <span style="display: flex; gap: 6px">
                    <span style="width: 10px; height: 10px; border-radius: 999px; background: #ff5f57" />
                    <span style="width: 10px; height: 10px; border-radius: 999px; background: #febc2e" />
                    <span style="width: 10px; height: 10px; border-radius: 999px; background: #28c840" />
                  </span>
                  <span style="margin-left: 10px; font-size: 12px; font-weight: 600; color: var(--lb-fg-1)">{{
                    activeAgent
                  }}</span>
                  <span style="margin-left: auto; font-size: 11px; color: var(--lb-fg-3)">skill: longbridge</span>
                </div>
                <div class="skill-demo-chat-body">
                  <div class="skill-demo-bubble-user">{{ activeScenario.prompt }}</div>

                  <div class="skill-demo-bubble-assistant">
                    <p class="skill-demo-bubble-text">{{ activeScenario.summary }}</p>
                    <table class="skill-demo-table">
                      <thead>
                        <tr>
                          <th v-for="h in activeScenario.tableHead" :key="h">{{ h }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(row, i) in activeScenario.tableRows"
                          :key="i"
                          :class="rowClass(row[row.length - 1] as string | boolean)">
                          <td v-for="(cell, j) in row.slice(0, -1)" :key="j" :class="j === 0 ? 'is-sym' : ''">
                            {{ cell }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div class="skill-demo-callout">{{ activeScenario.callout }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Skill Catalog -->
    <section
      class="section"
      style="
        padding-top: 32px;
        background: var(--app-canvas);
        border-top: 1px solid var(--app-card-stroke);
        border-bottom: 1px solid var(--app-card-stroke);
      ">
      <div class="section-inner">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            flex-wrap: wrap;
            gap: 24px;
            margin-bottom: 24px;
          ">
          <div style="max-width: 540px">
            <span class="eyebrow">Skill catalog</span>
            <h2 class="h-section" style="margin-top: 14px">100+ Skills, covering every move in your trading day.</h2>
            <p class="t-meta" style="margin-top: 10px; line-height: 1.55">
              Each Skill is a packaged set of tools, callable by any supported AI client. Click any card to see install
              instructions and details.
            </p>
          </div>
          <div class="skill-marketplace-card">
            <div class="skill-marketplace-label">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style="color: var(--lb-brand)">
                <path d="M12 2.5 13.4 9.2 20.5 10.5 13.6 12 12 18.5 10.4 12 3.5 10.5 10.6 9.2z" />
              </svg>
              <span>Available on Claude Code Plugin Marketplace</span>
              <span class="skill-marketplace-pill">PLUGIN</span>
            </div>
            <code class="skill-marketplace-cmd">/plugin marketplace add longbridge/skills</code>
            <code class="skill-marketplace-cmd">/plugin install longbridge@longbridge-skills</code>
          </div>
        </div>

        <div class="skill-cat-tabs">
          <button
            v-for="c in SKILL_CATS"
            :key="c.key"
            :class="['skill-cat-tab', c.key === activeCat ? 'is-active' : '']"
            @click="activeCat = c.key">
            {{ c.key }}
            <span class="skill-cat-count">{{ c.count }}</span>
          </button>
        </div>

        <div class="skill-grid">
          <a v-for="s in filteredSkills" :key="s.id" href="#" class="skill-card">
            <div class="skill-card-head">
              <h3 class="skill-card-name">{{ s.name }}</h3>
              <code class="skill-card-id">{{ s.id }}</code>
              <span v-if="s.tag" class="skill-card-tag">{{ s.tag }}</span>
            </div>
            <p class="skill-card-desc">{{ s.desc }}</p>
            <div class="skill-card-example">
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="currentColor"
                style="color: var(--lb-brand); flex-shrink: 0">
                <path d="M12 2.5 13.4 9.2 20.5 10.5 13.6 12 12 18.5 10.4 12 3.5 10.5 10.6 9.2z" />
              </svg>
              <span>"{{ s.example }}"</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Capability Reference -->
    <section class="section">
      <div class="section-inner">
        <div style="max-width: 640px; margin-bottom: 40px">
          <span class="eyebrow">Capability reference</span>
          <h2 class="h-section" style="margin-top: 14px">Full coverage of Longbridge CLI commands and MCP tools.</h2>
          <p class="t-meta" style="margin-top: 10px; line-height: 1.55">
            Every capability below is available to your AI in plain conversation.
          </p>
        </div>
        <div class="skill-cap-grid">
          <div v-for="g in CAP_REFERENCE" :key="g.title" class="skill-cap-col">
            <h3 class="h-card" style="font-size: 14px; color: var(--lb-fg-1)">{{ g.title }}</h3>
            <ul>
              <li v-for="item in g.items" :key="item">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  style="color: var(--lb-up); flex-shrink: 0; margin-top: 4px">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- User Cases -->
    <section class="section" style="padding-top: 48px">
      <div class="section-inner">
        <div style="text-align: left; max-width: 640px; margin-bottom: 32px">
          <span class="eyebrow">SEE IT IN ACTION</span>
          <h2 class="h-section" style="margin-top: 14px">Real user cases, real returns.</h2>
          <p class="t-meta" style="margin-top: 10px; line-height: 1.55">
            Hand-picked write-ups from the Longbridge community. From quick experiments to fully-deployed quant systems
            — see what people are shipping with Skill.
          </p>
        </div>

        <div class="user-cases-grid">
          <a href="https://longbridge.com/topics/39630019" target="_blank" rel="noreferrer" class="user-case-award">
            <div class="user-case-award-tag">
              <span>AWARD</span>
              <span class="user-case-award-tag-line"></span>
            </div>
            <div>
              <h3 class="user-case-award-h">Each winner receives 10,000 Task Coins + 1 × AirPods 4</h3>
              <p class="user-case-award-d">
                Winning cases are showcased on the Longbridge Skill website — visible to users worldwide, including the
                winner's ID and creative work.
              </p>
            </div>
            <div class="user-case-award-rewards">
              <div>
                <div class="user-case-award-num">10,000</div>
                <div class="user-case-award-l">TASK COINS</div>
              </div>
              <div>
                <div class="user-case-award-num">AirPods 4</div>
                <div class="user-case-award-l">PER WINNER</div>
              </div>
            </div>
          </a>

          <a v-for="(c, i) in USER_CASES" :key="c.id" :href="c.href" target="_blank" rel="noreferrer" class="user-case">
            <div class="user-case-head">
              <span class="user-case-idx">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="user-case-read">
                Read case
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </span>
            </div>
            <h3 class="user-case-title">{{ c.title }}</h3>
            <p class="user-case-desc">{{ c.desc }}</p>
            <div class="user-case-metric">
              <span class="user-case-metric-v" :style="{ color: c.accent }">{{ c.metric }}</span>
              <span class="user-case-metric-l">{{ c.metricLabel }}</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Get Started -->
    <section class="section" style="border-top: 1px solid var(--app-card-stroke); background: var(--app-canvas)">
      <div class="section-inner">
        <div style="text-align: center; max-width: 560px; margin: 0 auto">
          <span class="eyebrow">Get started</span>
          <h2 class="h-section" style="margin-top: 14px">Choose your AI tool</h2>
        </div>
        <div class="skill-getstarted-grid">
          <div class="skill-getstarted-card">
            <div
              class="skill-getstarted-icon"
              style="background: color-mix(in srgb, var(--lb-brand) 12%, transparent); color: var(--lb-brand)">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </div>
            <h3 class="h-card" style="margin-top: 16px">Copy and send to any AI</h3>
            <p class="t-meta" style="margin-top: 8px; line-height: 1.55; flex: 1">
              Paste this message into any AI assistant (Claude, ChatGPT, Cursor) and it will guide you through the
              installation.
            </p>
            <div class="skill-getstarted-cmd">
              <code>{{ installCmd }}</code>
              <button class="code-copy" @click="copyGetStarted" :title="copiedGetStarted ? 'Copied!' : 'Copy'">
                <svg
                  v-if="!copiedGetStarted"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <svg
                  v-else
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
            </div>
          </div>

          <div class="skill-getstarted-card recommended">
            <span class="skill-getstarted-badge">Recommended</span>
            <div
              class="skill-getstarted-icon"
              style="background: color-mix(in srgb, var(--lb-up) 14%, transparent); color: var(--lb-up)">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <h3 class="h-card" style="margin-top: 16px">Download Skill ZIP</h3>
            <p class="t-meta" style="margin-top: 8px; line-height: 1.55; flex: 1">
              Extract and import into Claude, ChatGPT, Cursor and other AI clients. Includes the full Skill manifest.
            </p>
            <a class="btn btn-primary" style="margin-top: 14px; align-self: flex-start" href="#">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Download longbridge-all.zip
            </a>
          </div>

          <div class="skill-getstarted-card">
            <div
              class="skill-getstarted-icon"
              style="
                background: color-mix(in srgb, var(--lb-status-alert) 14%, transparent);
                color: var(--lb-status-alert);
              ">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round">
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
            </div>
            <h3 class="h-card" style="margin-top: 16px">Install via Npx</h3>
            <p class="t-meta" style="margin-top: 8px; line-height: 1.55; flex: 1">
              For Claude Code, Codex, and similar tools — installs all skills globally.
            </p>
            <div class="skill-getstarted-cmd">
              <code><span style="color: var(--lb-brand)">$</span> npx skills add longbridge/skills -g</code>
            </div>
          </div>
        </div>

        <div class="skill-getstarted-foot">
          Also available on <a href="#">skills.sh</a> and <a href="#">GitHub</a>.
          <span style="color: var(--lb-fg-3)">·</span>
          <a :href="localePath('/skill/install')" style="color: var(--lb-brand); font-weight: 600">
            View installation guide for each client
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="display: inline; vertical-align: middle; margin-left: 3px">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<style scoped>
.skill-page-root {
  min-height: 100vh;
  background: var(--lb-bg-1);
  color: var(--lb-fg-1);
}

/* ---- Hero ---- */
.skill-hero {
  position: relative;
  padding: 100px 0 80px;
  overflow: hidden;
}
.skill-hero-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 80% 60% at 50% -10%,
    color-mix(in srgb, var(--lb-brand) 16%, transparent),
    transparent 70%
  );
  pointer-events: none;
}
.skill-hero-inner {
  position: relative;
  z-index: 1;
}
.skill-hero-install {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.skill-hero-install-label {
  font-size: 12px;
  color: var(--lb-fg-3);
  font-weight: 500;
}
.skill-hero-install-cmd {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: var(--lb-bg-2);
  border: 1px solid var(--app-card-stroke);
  border-radius: 10px;
  padding: 12px 16px;
  max-width: 480px;
  width: 100%;
}
.skill-hero-install-cmd code {
  font-size: 12.5px;
  color: var(--lb-fg-1);
  font-family: var(--vp-font-family-mono);
  line-height: 1.6;
  white-space: pre;
  flex: 1;
  text-align: left;
}
.skill-hero-install-link {
  font-size: 13px;
  color: var(--lb-brand);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;
}
.skill-hero-install-link:hover {
  text-decoration: underline;
}
.skill-hero-agents {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.skill-hero-agents-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}
.ai-agent-chip {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 12px 5px 6px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1;
  background: var(--lb-card);
  color: var(--lb-fg-1);
  border: 1px solid var(--app-card-stroke);
  white-space: nowrap;
}
.ai-agent-more {
  background: transparent !important;
  border: 1px dashed var(--app-card-stroke) !important;
  color: var(--lb-fg-3) !important;
}

/* ---- Copy button ---- */
.code-copy {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--lb-fg-3);
  padding: 2px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  transition: color 0.15s;
  flex-shrink: 0;
}
.code-copy:hover {
  color: var(--lb-fg-1);
}

/* ---- Demo shell ---- */
.skill-demo-shell {
  border: 1px solid var(--app-card-stroke);
  border-radius: 16px;
  overflow: hidden;
  background: var(--lb-bg-1);
}
.skill-demo-agent-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--app-card-stroke);
  background: var(--lb-bg-2);
  padding: 0 16px;
  overflow-x: auto;
}
.skill-demo-agent-tab {
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--lb-fg-3);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition:
    color 0.15s,
    border-color 0.15s;
}
.skill-demo-agent-tab:hover {
  color: var(--lb-fg-1);
}
.skill-demo-agent-tab.is-active {
  color: var(--lb-fg-1);
  border-bottom-color: var(--lb-brand);
}
.skill-demo-body-grid {
  display: grid;
  grid-template-columns: 220px 1fr;
}
@media (max-width: 768px) {
  .skill-demo-body-grid {
    grid-template-columns: 1fr;
  }
}
.skill-demo-nav {
  border-right: 1px solid var(--app-card-stroke);
  padding: 16px 0;
  display: flex;
  flex-direction: column;
}
.skill-demo-nav-item {
  padding: 10px 20px;
  font-size: 13px;
  color: var(--lb-fg-2);
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  border-left: 2px solid transparent;
  transition:
    color 0.15s,
    background 0.15s;
  line-height: 1.4;
}
.skill-demo-nav-item:hover {
  background: var(--lb-hover);
  color: var(--lb-fg-1);
}
.skill-demo-nav-item.is-active {
  color: var(--lb-fg-1);
  font-weight: 600;
  background: color-mix(in srgb, var(--lb-brand) 6%, transparent);
}
.skill-demo-main {
  padding: 28px 32px;
  min-width: 0;
}
@media (max-width: 768px) {
  .skill-demo-main {
    padding: 20px 16px;
  }
}
.skill-demo-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--lb-fg-1);
  margin: 0 0 10px;
  line-height: 1.35;
}
.skill-demo-desc {
  font-size: 13.5px;
  color: var(--lb-fg-2);
  line-height: 1.6;
  margin: 0 0 20px;
}
.skill-demo-prompt-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--lb-fg-3);
  margin-bottom: 8px;
}
.skill-demo-prompt {
  display: flex;
  gap: 10px;
  background: color-mix(in srgb, var(--lb-brand) 6%, transparent);
  border: 1px solid color-mix(in srgb, var(--lb-brand) 25%, transparent);
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 13.5px;
  color: var(--lb-fg-1);
  line-height: 1.55;
  margin-bottom: 20px;
}
.skill-demo-chat {
  border: 1px solid var(--app-card-stroke);
  border-radius: 12px;
  overflow: hidden;
}
.skill-demo-chat-head {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background: var(--lb-bg-2);
  border-bottom: 1px solid var(--app-card-stroke);
  gap: 4px;
}
.skill-demo-chat-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 420px;
  overflow-y: auto;
}
.skill-demo-bubble-user {
  align-self: flex-end;
  max-width: 80%;
  background: var(--lb-brand);
  color: #fff;
  border-radius: 12px 12px 2px 12px;
  padding: 10px 14px;
  font-size: 13px;
  line-height: 1.5;
}
.skill-demo-bubble-assistant {
  background: var(--lb-bg-2);
  border: 1px solid var(--app-card-stroke);
  border-radius: 12px 12px 12px 2px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.skill-demo-bubble-text {
  font-size: 13px;
  color: var(--lb-fg-1);
  line-height: 1.55;
  margin: 0;
}
.skill-demo-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
.skill-demo-table th {
  text-align: left;
  padding: 6px 10px;
  background: var(--lb-bg-1);
  color: var(--lb-fg-3);
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--app-card-stroke);
}
.skill-demo-table td {
  padding: 7px 10px;
  color: var(--lb-fg-2);
  border-bottom: 1px solid var(--app-card-stroke);
  vertical-align: middle;
}
.skill-demo-table tr:last-child td {
  border-bottom: none;
}
.skill-demo-table td.is-sym {
  font-weight: 600;
  color: var(--lb-fg-1);
  font-family: var(--vp-font-family-mono);
  font-size: 11.5px;
}
.skill-demo-table tr.is-best {
  background: color-mix(in srgb, var(--lb-brand) 8%, transparent);
}
.skill-demo-table tr.is-best td {
  color: var(--lb-fg-1);
}
.skill-demo-table tr.is-cross td {
  color: var(--lb-fg-1);
}
.skill-demo-callout {
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--lb-fg-2);
  background: color-mix(in srgb, var(--lb-brand) 5%, transparent);
  border-left: 3px solid var(--lb-brand);
  padding: 10px 12px;
  border-radius: 0 6px 6px 0;
}

/* ---- Skill Catalog ---- */
.skill-marketplace-card {
  background: #13182a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 14px 16px;
  min-width: 360px;
  max-width: 400px;
}
.skill-marketplace-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 500;
  margin-bottom: 10px;
  white-space: nowrap;
}
.skill-marketplace-pill {
  font-size: 10px;
  font-weight: 700;
  background: color-mix(in srgb, var(--vp-c-brand-1) 20%, transparent);
  color: var(--vp-c-brand-1);
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.05em;
  margin-left: auto;
}
.skill-marketplace-cmd {
  display: block;
  font-size: 11.5px;
  line-height: 1.4;
  font-family: var(--vp-font-family-mono);
  color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 7px 12px;
  margin-bottom: 6px;
  white-space: nowrap;
}
.skill-marketplace-cmd:last-child {
  margin-bottom: 0;
}
.skill-cat-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 20px;
}
.skill-cat-tab {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 13px;
  line-height: 1.4;
  font-weight: 500;
  color: var(--lb-fg-2);
  background: var(--lb-bg-2);
  border: 1px solid var(--app-card-stroke);
  cursor: pointer;
  transition: all 0.15s;
}
.skill-cat-tab:hover {
  color: var(--lb-fg-1);
  border-color: var(--lb-fg-3);
}
.skill-cat-tab.is-active {
  background: var(--lb-fg-1);
  color: var(--lb-bg-1);
  border-color: var(--lb-fg-1);
}
.skill-cat-tab.is-active .skill-cat-count {
  background: rgba(0, 0, 0, 0.15);
  color: var(--lb-bg-1);
}
.skill-cat-count {
  font-size: 11px;
  line-height: 1.4;
  background: var(--lb-bg-1);
  color: var(--lb-fg-3);
  border-radius: 999px;
  padding: 1px 6px;
  font-weight: 600;
}
.skill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
}
.skill-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: var(--lb-bg-1);
  border: 1px solid var(--app-card-stroke);
  border-radius: 12px;
  text-decoration: none;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
}
.skill-card:hover {
  border-color: var(--lb-brand);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--lb-brand) 10%, transparent);
}
.skill-card-head {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.skill-card-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--lb-fg-1);
  margin: 0;
}
.skill-card-id {
  font-size: 11px;
  color: var(--lb-fg-3);
  font-family: var(--vp-font-family-mono);
  background: var(--lb-bg-2);
  line-height: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid var(--app-card-stroke);
}
.skill-card-tag {
  font-size: 10px;
  font-weight: 700;
  background: color-mix(in srgb, var(--lb-brand) 15%, transparent);
  color: var(--lb-brand);
  padding: 2px 7px;
  border-radius: 4px;
  letter-spacing: 0.04em;
  margin-left: auto;
}
.skill-card-desc {
  font-size: 13px;
  color: var(--lb-fg-2);
  line-height: 1.55;
  margin: 0;
  flex: 1;
}
.skill-card-example {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12px;
  color: var(--lb-fg-3);
  font-style: italic;
  padding-top: 8px;
  border-top: 1px solid var(--app-card-stroke);
  line-height: 1.5;
}

/* ---- Capability Reference ---- */
.skill-cap-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px 32px;
}
@media (max-width: 768px) {
  .skill-cap-grid {
    grid-template-columns: 1fr;
  }
}
.skill-cap-col ul {
  list-style: none;
  padding: 0;
  margin: 10px 0 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.skill-cap-col ul li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: var(--lb-fg-2);
  line-height: 1.5;
}

/* ---- User Cases ---- */
.user-cases-grid {
  display: grid;
  grid-template-columns: 1fr repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 1024px) {
  .user-cases-grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 640px) {
  .user-cases-grid {
    grid-template-columns: 1fr;
  }
}
.user-case-award {
  background: linear-gradient(135deg, color-mix(in srgb, var(--lb-brand) 15%, var(--lb-bg-2)), var(--lb-bg-2));
  border: 1px solid color-mix(in srgb, var(--lb-brand) 30%, transparent);
  border-radius: 16px;
  padding: 24px;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: box-shadow 0.15s;
}
.user-case-award:hover {
  box-shadow: 0 4px 24px color-mix(in srgb, var(--lb-brand) 20%, transparent);
}
.user-case-award-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--lb-brand);
}
.user-case-award-tag-line {
  flex: 1;
  height: 1px;
  background: color-mix(in srgb, var(--lb-brand) 30%, transparent);
}
.user-case-award-h {
  font-size: 15px;
  font-weight: 700;
  color: var(--lb-fg-1);
  line-height: 1.4;
  margin: 0;
}
.user-case-award-d {
  font-size: 13px;
  color: var(--lb-fg-2);
  line-height: 1.55;
  margin: 6px 0 0;
}
.user-case-award-rewards {
  display: flex;
  gap: 24px;
  margin-top: auto;
}
.user-case-award-num {
  font-size: 20px;
  font-weight: 800;
  color: var(--lb-brand);
}
.user-case-award-l {
  font-size: 10px;
  font-weight: 700;
  color: var(--lb-fg-3);
  letter-spacing: 0.08em;
  margin-top: 2px;
}
.user-case {
  background: var(--lb-bg-2);
  border: 1px solid var(--app-card-stroke);
  border-radius: 14px;
  padding: 20px;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
}
.user-case:hover {
  border-color: var(--lb-fg-3);
  box-shadow: 0 2px 12px color-mix(in srgb, var(--lb-fg-1) 6%, transparent);
}
.user-case-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.user-case-idx {
  font-size: 11px;
  font-weight: 700;
  color: var(--lb-fg-3);
  font-family: var(--vp-font-family-mono);
}
.user-case-read {
  font-size: 12px;
  color: var(--lb-fg-3);
  display: flex;
  align-items: center;
  gap: 4px;
}
.user-case:hover .user-case-read {
  color: var(--lb-fg-1);
}
.user-case-title {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--lb-fg-1);
  line-height: 1.4;
  margin: 0;
}
.user-case-desc {
  font-size: 13px;
  color: var(--lb-fg-2);
  line-height: 1.55;
  margin: 0;
  flex: 1;
}
.user-case-metric {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid var(--app-card-stroke);
}
.user-case-metric-v {
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
}
.user-case-metric-l {
  font-size: 10px;
  font-weight: 700;
  color: var(--lb-fg-3);
  letter-spacing: 0.08em;
}

/* ---- Get Started ---- */
.skill-getstarted-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 36px;
}
@media (max-width: 900px) {
  .skill-getstarted-grid {
    grid-template-columns: 1fr;
  }
}
.skill-getstarted-card {
  background: var(--lb-bg-2);
  border: 1px solid var(--app-card-stroke);
  border-radius: 14px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  position: relative;
}
.skill-getstarted-card.recommended {
  border-color: var(--lb-brand);
  background: color-mix(in srgb, var(--lb-brand) 4%, var(--lb-bg-2));
}
.skill-getstarted-badge {
  position: absolute;
  top: -1px;
  left: 20px;
  font-size: 10px;
  font-weight: 700;
  background: var(--lb-brand);
  color: #fff;
  padding: 3px 10px;
  border-radius: 0 0 6px 6px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.skill-getstarted-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.skill-getstarted-cmd {
  margin-top: 14px;
  background: var(--lb-bg-1);
  border: 1px solid var(--app-card-stroke);
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.skill-getstarted-cmd code {
  font-size: 12px;
  font-family: var(--vp-font-family-mono);
  color: var(--lb-fg-1);
  line-height: 1.6;
  white-space: pre;
  flex: 1;
}
.skill-getstarted-foot {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 28px;
  font-size: 13px;
  color: var(--lb-fg-2);
  flex-wrap: wrap;
}
.skill-getstarted-foot a {
  color: var(--lb-fg-2);
  text-decoration: none;
}
.skill-getstarted-foot a:hover {
  text-decoration: underline;
}

/* ---- Shared section ---- */
.section {
  padding: 80px 0;
}
.section-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
.eyebrow {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--lb-brand);
}
.h-display {
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--lb-fg-1);
}
.h-section {
  font-size: clamp(22px, 3vw, 30px);
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: var(--lb-fg-1);
  margin: 0;
}
.h-card {
  font-size: 15px;
  font-weight: 700;
  color: var(--lb-fg-1);
  margin: 0;
}
.t-body {
  font-size: 16px;
  line-height: 1.65;
  color: var(--lb-fg-2);
}
.t-meta {
  font-size: 14px;
  line-height: 1.55;
  color: var(--lb-fg-2);
  margin: 0;
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: opacity 0.15s;
}
.btn:hover {
  opacity: 0.85;
}
.btn-primary {
  background: var(--lb-brand);
  color: #fff;
}
</style>
