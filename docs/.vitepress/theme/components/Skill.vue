<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'
import Footer from './HomePage/Footer.vue'

const { lang } = useData()

// ─── i18n ─────────────────────────────────────────────────────────────────────

const isEN = computed(() => lang.value === 'en-US')
const isHK = computed(() => lang.value === 'zh-HK')
const installGuideUrl = computed(() => (isEN.value ? '/skill/install' : `/${lang.value}/skill/install`))

function topicUrl(id: string) {
  const isCN = typeof window !== 'undefined' && window.location.hostname.endsWith('.cn')
  const origin = isCN ? 'https://longbridge.cn' : 'https://longbridge.com'
  const langPrefix = isEN.value ? '' : `/${lang.value}`
  return `${origin}${langPrefix}/topics/${id}`
}

const t = {
  badge: computed(() => (isEN.value ? 'Longbridge Developers · Skill' : 'Longbridge Developers · Skill')),
  heroTitle1: computed(() => 'Longbridge Skill'),
  heroTitle2: computed(() =>
    isEN.value
      ? 'Unlock market insights, deep research and intelligent trading for your AI'
      : isHK.value
      ? '為你的 AI 解鎖市場洞察、深度研究與智能交易'
      : '为你的 AI 解锁市场洞察、深度研究与智能交易'
  ),
  heroSubtitle: computed(() =>
    isEN.value
      ? 'With Longbridge Skill, your AI assistant (OpenClaw, Claude Code, Cursor, etc.) can screen stocks across markets, decode earnings, track insider moves, and place orders — all in plain conversation, no app-switching required.'
      : isHK.value
      ? '安裝 Longbridge Skill 後，你的 AI 助手（OpenClaw、Claude Code、Cursor 等）就能幫你跨市場選股、解讀財報、追蹤主力持倉、直接下單——全部在對話裡完成，不用再切換 App 或手動查數據。'
      : '安装 Longbridge Skill 后，你的 AI 助手（OpenClaw、Claude Code、Cursor 等）就能帮你跨市场选股、解读财报、追踪主力持仓、直接下单——全部在对话里完成，不用再切换 App 或手动查数据。'
  ),
  downloadZip: computed(() => (isEN.value ? 'Download Skill ZIP' : isHK.value ? '下載 Skill ZIP' : '下载 Skill ZIP')),
  recommended: computed(() => (isEN.value ? 'Recommended' : isHK.value ? '推薦' : '推荐')),
  orCli: computed(() => (isEN.value ? 'Or install via CLI' : isHK.value ? '或命令行安裝' : '或命令行安装')),
  copy: computed(() => (isEN.value ? 'Copy' : isHK.value ? '複製' : '复制')),
  copied: computed(() => (isEN.value ? 'Copied!' : isHK.value ? '已複製' : '已复制')),
  ctaHint: computed(() =>
    isEN.value
      ? 'Copy and send to any AI — it will walk you through the installation:'
      : isHK.value
      ? '複製以下內容發送給任意 AI，它會引導你完成 Skill 安裝：'
      : '复制以下内容发送给任意 AI，它会引导你完成 Skill 安装：'
  ),
  installGuide: computed(() =>
    isEN.value
      ? 'View installation guide for each client →'
      : isHK.value
      ? '查看各客戶端具體安裝方式 →'
      : '查看各客户端具体安装方式 →'
  ),
  supportedBy: computed(() =>
    isEN.value ? 'Supported AI tools' : isHK.value ? '支持以下 AI 工具' : '支持以下 AI 工具'
  ),
  scenariosTitle: computed(() =>
    isEN.value
      ? 'What you can do with natural language'
      : isHK.value
      ? '用自然語言，完成以前只有專業系統才能做的事'
      : '用自然语言，完成以前只有专业系统才能做的事'
  ),
  scenariosSubtitle: computed(() =>
    isEN.value
      ? "Tell your AI assistant what you want — it calls Longbridge's data and trading APIs for you."
      : isHK.value
      ? '直接告訴你的 AI 助手你想做什麼——它來調用 Longbridge 的數據與交易能力。'
      : '直接告诉你的 AI 助手你想做什么——它来调用 Longbridge 的数据与交易能力。'
  ),
  capabilitiesTitle: computed(() => (isEN.value ? 'Capability Reference' : isHK.value ? '功能清單' : '功能清单')),
  capabilitiesSubtitle: computed(() =>
    isEN.value
      ? 'Full coverage of Longbridge CLI commands and MCP tools — available to your AI in plain conversation.'
      : isHK.value
      ? '覆蓋所有 Longbridge CLI 命令與 MCP 工具，AI 通過對話幫你調用。'
      : '覆盖所有 Longbridge CLI 命令与 MCP 工具，AI 通过对话帮你调用。'
  ),
  demoTitle: computed(() =>
    isEN.value ? 'See it in action' : isHK.value ? '了解 Skill 能做什麼' : '了解 Skill 能做什么'
  ),
  demoSubtitle: computed(() =>
    isEN.value
      ? 'Select a scenario and AI tool to see the live demo'
      : isHK.value
      ? '選擇場景，查看你的 AI 助手如何工作'
      : '选择场景，查看你的 AI 助手如何工作'
  ),
  installTitle: computed(() => (isEN.value ? 'Get Started' : isHK.value ? '開始安裝' : '开始安装')),
  installSubtitle: computed(() =>
    isEN.value ? 'Choose your AI tool' : isHK.value ? '選擇你使用的 AI 工具' : '选择你使用的 AI 工具'
  ),
  manualInstallLabel: computed(() => (isEN.value ? 'Manual Install' : isHK.value ? '手動安裝' : '手动安装')),
  manualInstallHint: computed(() =>
    isEN.value
      ? 'Extract and import into Claude, ChatGPT, Cursor and other AI clients.'
      : isHK.value
      ? '解壓後導入 Claude、ChatGPT、Cursor 等 AI 客戶端。'
      : '解压后导入 Claude、ChatGPT、Cursor 等 AI 客户端。'
  ),
  cliInstallHint: computed(() =>
    isEN.value
      ? 'Install into your project for Claude Code, Codex and similar tools.'
      : isHK.value
      ? '安裝到項目目錄，適用於 Claude Code、Codex 等工具。'
      : '安装到项目目录，适用于 Claude Code、Codex 等工具。'
  ),
  oneLinerLabel: computed(() =>
    isEN.value ? 'Copy and send to any AI' : isHK.value ? '複製後發送給任意 AI' : '复制后发送给任意 AI'
  ),
  oneLinerHint: computed(() =>
    isEN.value
      ? 'Paste this message into any AI assistant (Claude, ChatGPT, etc.) and it will guide you through the installation.'
      : isHK.value
      ? '將以下這句話發送給任意 AI 助手（Claude、ChatGPT 等），它會自動引導你完成安裝。'
      : '将以下这句话发送给任意 AI 助手（Claude、ChatGPT 等），它会自动引导你完成安装。'
  ),
  alsoAvailablePrefix: computed(() => (isEN.value ? 'Also available on ' : isHK.value ? '同樣可在 ' : '同样可在 ')),
  alsoAvailableAnd: computed(() => (isEN.value ? ' and ' : isHK.value ? ' 和 ' : ' 和 ')),
  userCasesTitle: computed(() => (isEN.value ? 'User Cases' : isHK.value ? '用戶案例' : '用户案例')),
  userCasesSubtitle: computed(() =>
    isEN.value
      ? 'Award-winning cases from real Longbridge Skill users around the world'
      : isHK.value
      ? '來自全球真實用戶的最燃獲獎案例'
      : '来自全球真实用户的最燃获奖案例'
  ),
}

// ─── Data ─────────────────────────────────────────────────────────────────────

interface UserCaseCard {
  rank: string
  accent: 'orange' | 'red' | 'yellow'
  cardVariant: '' | 'minimal'
  title: string
  titleEn: string
  titleHK: string
  summary: string
  summaryEn: string
  summaryHK: string
  metricValue: string | null
  metricLabel: string | null
  metricLabelEn: string | null
  metricLabelHK: string | null
  author: string
  authorId: string
  topicId: string
}

const userCases: UserCaseCard[] = [
  {
    rank: '1',
    accent: 'orange',
    cardVariant: '',
    title: '用 AI 扫描期权机会',
    titleEn: 'Scanning Options Opportunities with AI',
    titleHK: '用 AI 掃描期權機會',
    summary: '对 39 个合约进行 AI 全量扫描，最高年化收益 423%，让 AI 帮你找到市场里最值得关注的机会。',
    summaryEn: 'AI-scanned 39 contracts to surface the best options plays — peak annualized return of 423%.',
    summaryHK: '對 39 個合約進行 AI 全量掃描，最高年化收益 423%，讓 AI 幫你找到市場裡最值得關注的機會。',
    metricValue: '423%',
    metricLabel: '最高年化收益',
    metricLabelEn: 'MAX ANNUALIZED',
    metricLabelHK: '最高年化收益',
    author: '纳指嘉措',
    authorId: '12105449',
    topicId: '39722881',
  },
  {
    rank: '2',
    accent: 'red',
    cardVariant: '',
    title: '长桥 Skill 使用初体验，很 Cool',
    titleEn: 'First Impressions of Longbridge Skill — Pretty Cool',
    titleHK: '長橋 Skill 使用初體驗，很 Cool',
    summary: '用自然语言操控交易终端，和 AI 一起探索行情、分析持仓——这体验出乎意料的 Cool。',
    summaryEn: 'Control a trading terminal with natural language, explore quotes and analyze positions — surprisingly cool.',
    summaryHK: '用自然語言操控交易終端，和 AI 一起探索行情、分析持倉——這體驗出乎意料的 Cool。',
    metricValue: 'Cool',
    metricLabel: '初体验评价',
    metricLabelEn: 'FIRST IMPRESSION',
    metricLabelHK: '初體驗評價',
    author: '不奋东西',
    authorId: '14442740',
    topicId: '39679744',
  },
  {
    rank: '3',
    accent: 'yellow',
    cardVariant: '',
    title: 'QQQ 0DTE 量化交易系统：从零到实盘',
    titleEn: 'QQQ 0DTE Quant System: From Zero to Live',
    titleHK: 'QQQ 0DTE 量化交易系統：從零到實盤',
    summary: '完整记录从策略设计、回测优化到实盘部署的全过程，构建 QQQ 当日到期期权量化系统。',
    summaryEn: 'End-to-end walkthrough: strategy design, backtesting, and deploying a QQQ 0DTE options quant system.',
    summaryHK: '完整記錄從策略設計、回測優化到實盤部署的全過程，構建 QQQ 當日到期期權量化系統。',
    metricValue: '0DTE',
    metricLabel: '量化实盘',
    metricLabelEn: 'QUANT LIVE',
    metricLabelHK: '量化實盤',
    author: '热血青年',
    authorId: '17928542',
    topicId: '39996427',
  },
]

interface ScenarioCard {
  id: string
  color: string
  label: string
  title: string
  desc: string
  example: string
}

const scenarioCards = computed<ScenarioCard[]>(() =>
  isEN.value
    ? [
        {
          id: 'monitor',
          color: '#00b8b8',
          label: 'Cross-Market Screener',
          title: 'HK, US, A-shares, Singapore — screen across markets in one go',
          desc: 'Multi-market opportunities are hard to track simultaneously. Tell the AI your criteria: market cap range, P/E ratio, sector — and layer in technical signals like KDJ golden cross or bullish MACD. Cross-market screening, results returned together.',
          example:
            '"From US and HK stocks, find tech stocks with market cap above $50B, P/E below 25, and a recent MACD golden cross — sorted by market cap."',
        },
        {
          id: 'research',
          color: '#4781ff',
          label: 'Technical Diagnosis',
          title: 'Not just reading charts — let AI give you a direct technical read',
          desc: 'The analysis after getting the candlesticks is often the most time-consuming part. Tell the AI which stock you want. It pulls daily, hourly, and 15-minute data, combines MACD, KDJ, RSI and other indicators to assess the current trend and key price levels — including pre/post-market data.',
          example:
            '"Diagnose TSLA\'s technicals: what\'s the daily trend, is it near support or resistance, and do short-term signals lean bullish or bearish?"',
        },
        {
          id: 'trade',
          color: '#1890ff',
          label: 'Earnings Deep Dive',
          title: 'Earnings out? Unpack it in 5 minutes: actuals vs. estimates, revenue breakdown, analyst views',
          desc: "The hardest part of earnings season isn't reading the numbers — it's putting them in context. AI pulls the three financial statements, consensus analyst estimates (high/low/mean), historical revenue by segment and region, valuation metrics, and SEC filings — cross-references everything and generates a complete summary.",
          example:
            '"NVDA just reported. Compare actual results against analyst estimates, break down revenue changes by segment, and check whether the current valuation is reasonable."',
        },
        {
          id: 'chart',
          color: '#ff5000',
          label: 'Smart Money Tracker',
          title: 'Are insiders buying or selling? Has institutional ownership changed?',
          desc: 'Researching a stock goes beyond earnings — you need to follow the money. AI pulls insider trading records for executives and major shareholders over the past three months, plus the top 20 holders ranked by position changes across institution types (mutual funds, hedge funds, pension funds, etc.).',
          example:
            '"Check AAPL\'s recent insider trading — are any executives selling heavily? How did hedge fund positions change versus last quarter?"',
        },
        {
          id: 'portfolio',
          color: '#ff7333',
          label: 'Advanced Orders',
          title: 'Beyond buy/sell — set conditional orders, trailing stops, and options in one sentence',
          desc: 'When you spot an opportunity or want to lock in risk protection, just express your intent in the conversation. Supports limit orders, market orders, stop-limit orders, trailing stops, and options and warrants order placement and modification. AI shows order details and waits for your confirmation before executing.',
          example:
            '"Set a trailing stop on TSLA: trigger a sell if it drops more than 8%, and show me the order details for confirmation before executing."',
        },
        {
          id: 'coding',
          color: '#00b99a',
          label: 'Portfolio Review',
          title: 'Did you make or lose money this month? What worked, what dragged you down?',
          desc: "The value of a review is understanding what your portfolio is doing — not just looking at up/down numbers. AI pulls the P&L trend for a selected period, a ranking of each position's P&L, portfolio allocation breakdown, and a detailed P&L transaction log — consolidated into a complete portfolio review report.",
          example:
            '"Review my portfolio performance this month: how the overall P&L trended, which stock contributed most, which performed worst, and what percentage is US vs. HK stocks?"',
        },
      ]
    : [
        {
          id: 'monitor',
          color: '#00b8b8',
          label: isHK.value ? '跨市場選股' : '跨市场选股',
          title: isHK.value
            ? '港股、美股、A 股、新加坡，跨市場條件篩選，一次完成'
            : '港股、美股、A 股、新加坡，跨市场条件筛选，一次完成',
          desc: isHK.value
            ? '多市場機會往往難以同步追蹤。直接告訴 AI 你的條件：市值範圍、PE 區間、行業板塊，還可以疊加技術信號——比如只看 KDJ 金叉、MACD 看漲的標的。跨市場篩選，結果統一返回。'
            : '多市场机会往往难以同步追踪。直接告诉 AI 你的条件：市值范围、PE 区间、行业板块，还可以叠加技术信号——比如只看 KDJ 金叉、MACD 看涨的标的。跨市场筛选，结果统一返回。',
          example: isHK.value
            ? '"幫我從美股和港股裡，篩出市值 500 億以上、PE 低於 25、近期 MACD 出現金叉的科技股，按市值排列"'
            : '"帮我从美股和港股里，筛出市值 500 亿以上、PE 低于 25、近期 MACD 出现金叉的科技股，按市值排列"',
        },
        {
          id: 'research',
          color: '#4781ff',
          label: isHK.value ? '技術面綜合診斷' : '技术面综合诊断',
          title: isHK.value ? '不只是看圖——讓 AI 直接給你一個技術面判斷' : '不只是看图——让 AI 直接给你一个技术面判断',
          desc: isHK.value
            ? '拿到 K 線之後的分析，往往才是最耗時的部分。告訴 AI 你想看哪隻股票，它會調取日線、小時線、15 分鐘線數據，結合 MACD、KDJ、RSI 等技術指標，判斷當前趨勢與關鍵價位，給你一份清晰的技術面參考——含盤前盤後數據。'
            : '拿到 K 线之后的分析，往往才是最耗时的部分。告诉 AI 你想看哪只股票，它会调取日线、小时线、15 分钟线数据，结合 MACD、KDJ、RSI 等技术指标，判断当前趋势与关键价位，给你一份清晰的技术面参考——含盘前盘后数据。',
          example: isHK.value
            ? '"幫我診斷一下 TSLA 的技術面：日線趨勢怎樣，當前在支撐位還是壓力位，短期信號偏多還是偏空？"'
            : '"帮我诊断一下 TSLA 的技术面：日线趋势怎样，当前在支撑位还是压力位，短期信号偏多还是偏空？"',
        },
        {
          id: 'trade',
          color: '#1890ff',
          label: isHK.value ? '財報季深度研究' : '财报季深度研究',
          title: isHK.value
            ? '財報一出，5 分鐘完成拆解：實際 vs 預期，收入結構，機構怎麼看'
            : '财报一出，5 分钟完成拆解：实际 vs 预期，收入结构，机构怎么看',
          desc: isHK.value
            ? '財報季最耗時的，不是讀數字，而是把數字放在一起理解。AI 同時調取財務三表、分析師一致預期（含高/低/均值）、按業務線和地區拆分的歷史營收、估值指標及 SEC 申報原文，交叉對比，生成一份從數據到結論的完整分析摘要。'
            : '财报季最耗时的，不是读数字，而是把数字放在一起理解。AI 同时调取财务三表、分析师一致预期（含高/低/均值）、按业务线和地区拆分的历史营收、估值指标及 SEC 申报原文，交叉对比，生成一份从数据到结论的完整分析摘要。',
          example: isHK.value
            ? '"NVDA 剛出財報，幫我對比實際業績和分析師預期的差距，拆一下各業務線的營收變化，順便看看當前估值是否合理"'
            : '"NVDA 刚出财报，帮我对比实际业绩和分析师预期的差距，拆一下各业务线的营收变化，顺便看看当前估值是否合理"',
        },
        {
          id: 'chart',
          color: '#ff5000',
          label: isHK.value ? '聰明錢追蹤' : '聪明钱追踪',
          title: isHK.value ? '大股東在買還是賣？機構持倉有沒有變化？' : '大股东在买还是卖？机构持仓有没有变化？',
          desc: isHK.value
            ? '研究一隻股票，財報之外還要關注資金動向。AI 幫你調取近三個月高管與大股東的內幕交易記錄，以及按機構類型（共同基金、對沖基金、養老金等）分組的前 20 大持股變動，清晰呈現「聰明錢」的最新動態。'
            : '研究一只股票，财报之外还要关注资金动向。AI 帮你调取近三个月高管与大股东的内幕交易记录，以及按机构类型（共同基金、对冲基金、养老金等）分组的前 20 大持股变动，清晰呈现"聪明钱"的最新动态。',
          example: isHK.value
            ? '"幫我查一下 AAPL 近期的內幕交易，有沒有高管在大量減持？對沖基金的持倉和上季度相比有什麼變化？"'
            : '"帮我查一下 AAPL 近期的内幕交易，有没有高管在大量减持？对冲基金的持仓和上季度相比有什么变化？"',
        },
        {
          id: 'portfolio',
          color: '#ff7333',
          label: isHK.value ? '進階下單' : '进阶下单',
          title: isHK.value
            ? '不只是買入賣出——條件單、追蹤止損、期權，一句話設好'
            : '不只是买入卖出——条件单、追踪止损、期权，一句话设好',
          desc: isHK.value
            ? '捕捉到機會，或想提前設好風險保護，直接在對話中表達意圖即可。支持限價單、市價單、觸價限價單、追蹤止損，以及股票期權和權證的下單與改單。AI 展示訂單詳情，等你確認後才執行。'
            : '捕捉到机会，或想提前设好风险保护，直接在对话中表达意图即可。支持限价单、市价单、触价限价单、追踪止损，以及股票期权和权证的下单与改单。AI 展示订单详情，等你确认后才执行。',
          example: isHK.value
            ? '"幫我給 TSLA 設一個追蹤止損，跌幅超過 8% 自動觸發賣出，執行前把訂單詳情給我確認"'
            : '"帮我给 TSLA 设一个追踪止损，跌幅超过 8% 自动触发卖出，执行前把订单详情给我确认"',
        },
        {
          id: 'coding',
          color: '#00b99a',
          label: isHK.value ? '持倉復盤' : '持仓复盘',
          title: isHK.value
            ? '這個月賺了還是虧了？哪些決策對了，哪些拖了後腿？'
            : '这个月赚了还是亏了？哪些决策对了，哪些拖了后腿？',
          desc: isHK.value
            ? '復盤的價值在於理解自己的組合在做什麼，而不只是看漲跌數字。AI 調取指定週期內的盈虧趨勢、各標的盈虧排行、持倉結構佔比，以及單隻股票的盈虧流水明細，彙總成一份完整的組合復盤報告。'
            : '复盘的价值在于理解自己的组合在做什么，而不只是看涨跌数字。AI 调取指定周期内的盈亏趋势、各标的盈亏排行、持仓结构占比，以及单只股票的盈亏流水明细，汇总成一份完整的组合复盘报告。',
          example: isHK.value
            ? '"幫我復盤這個月的持倉表現：總盈虧趨勢如何，哪隻股票貢獻最大、哪隻表現最弱，組合裡美股和港股各佔多少？"'
            : '"帮我复盘这个月的持仓表现：总盈亏趋势如何，哪只股票贡献最大、哪只表现最弱，组合里美股和港股各占多少？"',
        },
      ]
)

interface DemoScenario {
  id: string
  label: string
  messages: DemoMessage[]
  clientMessages?: Record<string, DemoMessage[]>
}

interface DemoMessage {
  role: 'user' | 'tool' | 'assistant'
  content: string
  command?: string
  rich?: boolean // if true, content is HTML rendered via v-html
}

// ─── Lightweight syntax highlighter for demo code blocks ──────────────────────

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function colorizeTokens(raw: string): string {
  // Single-pass tokenizer: processes raw text once to avoid regex-on-html corruption
  const KW =
    /^(from|import|def|class|for|if|else|elif|return|in|as|with|not|and|or|True|False|None|print|float|int|str|dict|list|abs|len|range)\b/
  const NUM = /^\d+(?:\.\d+)?(?:[BKMbkm])?\b/
  let out = ''
  let i = 0
  while (i < raw.length) {
    // String literal (double or single quoted)
    if (raw[i] === '"' || raw[i] === "'") {
      const q = raw[i]
      let j = i + 1
      while (j < raw.length && raw[j] !== q) j++
      if (j < raw.length) j++
      out += `<span class="hl-s">${escHtml(raw.slice(i, j))}</span>`
      i = j
      continue
    }
    // Keyword (at word boundary)
    if (/\w/.test(raw[i]) && (i === 0 || !/\w/.test(raw[i - 1]))) {
      const m = raw.slice(i).match(KW)
      if (m) {
        out += `<span class="hl-k">${m[1]}</span>`
        i += m[1].length
        continue
      }
    }
    // Number (at word boundary)
    if (/\d/.test(raw[i]) && (i === 0 || !/\w/.test(raw[i - 1]))) {
      const m = raw.slice(i).match(NUM)
      if (m) {
        out += `<span class="hl-n">${m[0]}</span>`
        i += m[0].length
        continue
      }
    }
    out += escHtml(raw[i])
    i++
  }
  return out
}

function highlightCode(raw: string): string {
  return raw
    .split('\n')
    .map((line) => {
      // Shell prompt line (starts with $)
      if (/^\s*\$\s/.test(line)) {
        const esc = escHtml(line)
        return `<span class="hl-prompt">$</span>${esc.slice(esc.indexOf('$') + 1)}`
      }
      // Full-line comment
      const ci = line.indexOf('#')
      if (ci >= 0) {
        return colorizeTokens(line.slice(0, ci)) + `<span class="hl-c">${escHtml(line.slice(ci))}</span>`
      }
      return colorizeTokens(line)
    })
    .join('\n')
}

function codeHTML(raw: string): string {
  return `<pre class="demo-code-block"><code>${highlightCode(raw)}</code></pre>`
}

// Terminal block: raw HTML with t-* span classes pre-applied
function termHTML(raw: string): string {
  return `<div class="demo-term">${raw}</div>`
}

function klineSvg(): string {
  const prices = [
    190.04, 188.54, 190.05, 186.94, 182.81, 184.97, 187.98, 187.9, 189.82, 191.55, 192.85, 195.56, 184.89, 177.19,
    182.48, 180.05, 183.04, 183.34, 177.82, 182.65, 184.77, 186.03, 183.14, 180.25, 183.22, 181.93, 180.4, 178.56,
    172.7, 175.64,
  ]
  const dates = [
    '2/9',
    '2/10',
    '2/11',
    '2/12',
    '2/13',
    '2/17',
    '2/18',
    '2/19',
    '2/20',
    '2/23',
    '2/24',
    '2/25',
    '2/26',
    '2/27',
    '3/2',
    '3/3',
    '3/4',
    '3/5',
    '3/6',
    '3/9',
    '3/10',
    '3/11',
    '3/12',
    '3/13',
    '3/16',
    '3/17',
    '3/18',
    '3/19',
    '3/20',
    '3/23',
  ]
  const w = 540,
    h = 110,
    pad = { t: 10, b: 22, l: 8, r: 8 }
  const iw = w - pad.l - pad.r,
    ih = h - pad.t - pad.b
  const min = Math.min(...prices) - 2,
    max = Math.max(...prices) + 2
  const px = (i: number) => pad.l + (i / (prices.length - 1)) * iw
  const py = (v: number) => pad.t + (1 - (v - min) / (max - min)) * ih
  const pts = prices.map((p, i) => `${px(i).toFixed(1)},${py(p).toFixed(1)}`).join(' ')
  const fp =
    `M${px(0)},${py(prices[0])} ` +
    prices
      .slice(1)
      .map((p, i) => `L${px(i + 1).toFixed(1)},${py(p).toFixed(1)}`)
      .join(' ') +
    ` L${px(prices.length - 1)},${pad.t + ih} L${px(0)},${pad.t + ih} Z`
  const peakI = prices.indexOf(Math.max(...prices))
  const troughI = prices.indexOf(Math.min(...prices))
  const xLbls = dates
    .map((d, i) =>
      i % 7 === 0
        ? `<text x="${px(i).toFixed(1)}" y="${
            h - 4
          }" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.4">${d}</text>`
        : ''
    )
    .join('')
  const curY = py(prices[prices.length - 1])
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:auto" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="kg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--vp-c-brand-1)" stop-opacity="0.2"/><stop offset="100%" stop-color="var(--vp-c-brand-1)" stop-opacity="0"/></linearGradient></defs><path d="${fp}" fill="url(#kg)"/><polyline points="${pts}" fill="none" stroke="var(--vp-c-brand-1)" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/><line x1="${
    pad.l
  }" y1="${curY.toFixed(1)}" x2="${w - pad.r}" y2="${curY.toFixed(
    1
  )}" stroke="var(--vp-c-brand-1)" stroke-width="1" stroke-dasharray="3,3" opacity="0.35"/><circle cx="${px(
    peakI
  ).toFixed(1)}" cy="${py(prices[peakI]).toFixed(1)}" r="3.5" fill="var(--vp-c-yellow-1)"/><text x="${(
    px(peakI) + 5
  ).toFixed(1)}" y="${(py(prices[peakI]) - 3).toFixed(
    1
  )}" font-size="9" fill="var(--vp-c-yellow-1)" font-weight="700">峰 $195.56</text><circle cx="${px(troughI).toFixed(
    1
  )}" cy="${py(prices[troughI]).toFixed(1)}" r="3.5" fill="#ff4d4f"/><text x="${(px(troughI) + 5).toFixed(1)}" y="${(
    py(prices[troughI]) + 13
  ).toFixed(1)}" font-size="9" fill="#ff4d4f" font-weight="700">低 $172.70</text><rect x="${pad.l}" y="${py(
    174.5
  ).toFixed(1)}" width="${iw}" height="${(py(171.5) - py(174.5)).toFixed(
    1
  )}" fill="#ff4d4f" opacity="0.05"/>${xLbls}</svg>`
}

function portfolioPieSvg(cn: boolean, hk: boolean): string {
  // Colors already used throughout this component
  const data = [
    { sym: 'AAPL.US', val: 32585, color: '#4781ff' },
    { sym: 'NVDA.US', val: 17740, color: '#00c88c' },
    { sym: 'MSFT.US', val: 5670, color: '#a78bfa' },
    { sym: '9988.HK', val: 855, color: '#f59e0b' },
  ]
  const total = data.reduce((a, b) => a + b.val, 0)
  const cx = 76,
    cy = 76,
    r = 64,
    ri = 40
  let ang = -Math.PI / 2,
    paths = ''
  for (const d of data) {
    const slice = (d.val / total) * 2 * Math.PI
    const end = ang + slice
    const la = slice > Math.PI ? 1 : 0
    const [x1, y1] = [cx + r * Math.cos(ang), cy + r * Math.sin(ang)]
    const [x2, y2] = [cx + r * Math.cos(end), cy + r * Math.sin(end)]
    const [x3, y3] = [cx + ri * Math.cos(end), cy + ri * Math.sin(end)]
    const [x4, y4] = [cx + ri * Math.cos(ang), cy + ri * Math.sin(ang)]
    paths += `<path d="M${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${la},1 ${x2.toFixed(1)},${y2.toFixed(
      1
    )} L${x3.toFixed(1)},${y3.toFixed(1)} A${ri},${ri} 0 ${la},0 ${x4.toFixed(1)},${y4.toFixed(1)} Z" fill="${
      d.color
    }" opacity=".9" stroke="var(--vp-c-bg)" stroke-width="2"/>`
    ang = end
  }
  const legendRows = data
    .map((ld, li) => {
      const pct = ((ld.val / total) * 100).toFixed(1)
      const sep = li > 0 ? 'border-top:1px solid var(--vp-c-divider);' : ''
      return `<div style="${sep}display:flex;align-items:center;gap:8px;padding:6px 0"><span style="width:10px;height:10px;border-radius:3px;background:${
        ld.color
      };flex-shrink:0;display:inline-block"></span><span style="font-size:12px;font-weight:600;color:var(--vp-c-text-1);flex:1">${
        ld.sym
      }</span><span style="font-size:13px;font-weight:700;color:${
        ld.color
      }">${pct}%</span><span style="font-size:11px;color:var(--vp-c-text-3);width:44px;text-align:right">$${(
        ld.val / 1000
      ).toFixed(1)}k</span></div>`
    })
    .join('')
  return `<div style="display:flex;align-items:center;gap:14px;margin:10px 0 12px"><svg width="152" height="152" viewBox="0 0 152 152" style="flex-shrink:0">${paths}<text x="${cx}" y="${
    cy - 5
  }" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.4" letter-spacing=".05em">${
    cn ? (hk ? '市值佔比' : '市值占比') : 'ALLOCATION'
  }</text><text x="${cx}" y="${
    cy + 12
  }" text-anchor="middle" font-size="15" font-weight="800" fill="currentColor">$56.8k</text></svg><div style="flex:1;border:1px solid var(--vp-c-divider);border-radius:9px;padding:4px 12px;background:var(--vp-c-bg)">${legendRows}</div></div>`
}

const demoScenarios = computed<DemoScenario[]>(() => {
  const cn = !isEN.value
  const hk = isHK.value

  return [
    // ── 1. 跨市场选股
    {
      id: 'monitor',
      label: isEN.value ? 'Cross-Market Screen' : isHK.value ? '跨市場選股' : '跨市场选股',
      messages: [
        {
          role: 'user',
          content: isEN.value
            ? 'Screen US and HK tech stocks: market cap >$50B, PE <25, recent MACD golden cross. Sort by market cap.'
            : isHK.value
            ? '幫我從美股和港股裡，篩出市值 500 億以上、PE 低於 25、近期 MACD 出現金叉的科技股，按市值排列'
            : '帮我从美股和港股里，筛出市值 500 亿以上、PE 低于 25、近期 MACD 出现金叉的科技股，按市值排列',
        },
        {
          role: 'tool',
          command:
            'longbridge calc-index 700.HK 9988.HK IBM.US 1810.HK 9999.HK 9618.HK 992.HK 285.HK --indicators MACD,PE',
          content: '',
        },
        {
          role: 'assistant',
          rich: true,
          content: `
<div style="font-size:13px;line-height:1.75;color:var(--vp-c-text-2);margin-bottom:12px">${
            isEN.value
              ? 'US + HK tech screening done. 8 stocks pass market cap ≥$50B and PE<25. 3 have confirmed MACD golden crosses (DIF turned positive and crossed above DEA).'
              : hk
              ? '美股 + 港股科技板塊篩選完成，共 8 隻股票滿足市值 ≥500 億、PE<25 條件，其中 3 隻近期 MACD 金叉信號確認（DIF 由負轉正並上穿 DEA）。'
              : '美股 + 港股科技板块筛选完成，共 8 只股票满足市值 ≥500 亿、PE<25 条件，其中 3 只近期 MACD 金叉信号确认（DIF 由负转正并上穿 DEA）。'
          }</div>
<div class="demo-table-wrap"><table class="demo-table">
  <thead><tr>
    <th>${isEN.value ? 'Symbol' : hk ? '代碼' : '代码'}</th>
    <th style="text-align:left">${isEN.value ? 'Name' : hk ? '名稱' : '名称'}</th>
    <th>${isEN.value ? 'Mkt Cap' : '市值'}</th>
    <th>PE</th>
    <th>MACD</th>
    <th>${isEN.value ? 'Signal' : hk ? '信號' : '信号'}</th>
  </tr></thead>
  <tbody>
    <tr><td style="font-weight:700">700.HK</td><td style="text-align:left;font-size:11px;color:var(--vp-c-text-3)">${
      isEN.value ? 'Tencent' : hk ? '騰訊控股' : '腾讯控股'
    }</td><td>HK$4,689B</td><td>18.84</td><td class="demo-muted">DIF&lt;DEA</td><td><span style="font-size:10px;background:var(--vp-c-bg-mute);padding:1px 6px;border-radius:4px;color:var(--vp-c-text-2)">${
            isEN.value ? 'Watch' : hk ? '觀望' : '观望'
          }</span></td></tr>
    <tr><td style="font-weight:700">9988.HK</td><td style="text-align:left;font-size:11px;color:var(--vp-c-text-3)">${
      isEN.value ? 'Alibaba' : '阿里巴巴'
    }</td><td>HK$2,353B</td><td>22.90</td><td class="demo-muted">DIF&lt;DEA</td><td><span style="font-size:10px;background:var(--vp-c-bg-mute);padding:1px 6px;border-radius:4px;color:var(--vp-c-text-2)">${
            isEN.value ? 'Watch' : hk ? '觀望' : '观望'
          }</span></td></tr>
    <tr><td style="font-weight:700">IBM.US</td><td style="text-align:left;font-size:11px;color:var(--vp-c-text-3)">IBM</td><td>$233B</td><td>22.01</td><td class="demo-pos">DIF&gt;DEA ✓</td><td><span style="font-size:10px;background:var(--vp-c-green-soft);padding:1px 6px;border-radius:4px;color:var(--up-color)">${
      isEN.value ? 'Golden X' : '金叉'
    }</span></td></tr>
    <tr><td style="font-weight:700">1810.HK</td><td style="text-align:left;font-size:11px;color:var(--vp-c-text-3)">${
      isEN.value ? 'Xiaomi' : hk ? '小米集團' : '小米集团'
    }</td><td>HK$847B</td><td>17.53</td><td class="demo-muted">DIF&lt;DEA</td><td><span style="font-size:10px;background:var(--vp-c-bg-mute);padding:1px 6px;border-radius:4px;color:var(--vp-c-text-2)">${
            isEN.value ? 'Watch' : hk ? '觀望' : '观望'
          }</span></td></tr>
    <tr><td style="font-weight:700">9999.HK</td><td style="text-align:left;font-size:11px;color:var(--vp-c-text-3)">${
      isEN.value ? 'NetEase' : hk ? '網易' : '网易'
    }</td><td>HK$560B</td><td>15.00</td><td class="demo-pos">DIF&gt;DEA ✓</td><td><span style="font-size:10px;background:var(--vp-c-green-soft);padding:1px 6px;border-radius:4px;color:var(--up-color)">${
            isEN.value ? 'Golden X' : '金叉'
          }</span></td></tr>
    <tr><td style="font-weight:700;color:var(--up-color)">9618.HK</td><td style="text-align:left;font-size:11px;color:var(--vp-c-text-3)">${
      isEN.value ? 'JD.com' : hk ? '京東集團' : '京东集团'
    }</td><td>HK$304B</td><td>14.00</td><td class="demo-pos">DIF=+0.22 ★</td><td><span style="font-size:10px;background:var(--vp-c-green-soft);padding:1px 6px;border-radius:4px;color:var(--up-color)">${
            isEN.value ? 'Strongest' : hk ? '金叉最強' : '金叉最强'
          }</span></td></tr>
    <tr><td style="font-weight:700">992.HK</td><td style="text-align:left;font-size:11px;color:var(--vp-c-text-3)">${
      isEN.value ? 'Lenovo' : hk ? '聯想集團' : '联想集团'
    }</td><td>HK$114B</td><td>9.95</td><td class="demo-muted">DIF&lt;DEA</td><td><span style="font-size:10px;background:var(--vp-c-bg-mute);padding:1px 6px;border-radius:4px;color:var(--vp-c-text-2)">${
            isEN.value ? 'Watch' : hk ? '觀望' : '观望'
          }</span></td></tr>
    <tr><td style="font-weight:700">285.HK</td><td style="text-align:left;font-size:11px;color:var(--vp-c-text-3)">${
      isEN.value ? 'BYD Electronic' : hk ? '比亞迪電子' : '比亚迪电子'
    }</td><td>HK$70B</td><td>14.69</td><td class="demo-pos">DIF&gt;DEA ✓</td><td><span style="font-size:10px;background:var(--vp-c-green-soft);padding:1px 6px;border-radius:4px;color:var(--up-color)">${
            isEN.value ? 'Golden X' : '金叉'
          }</span></td></tr>
  </tbody>
</table></div>
<div class="demo-hi-box"><strong>${
            isEN.value ? 'Strongest MACD golden cross: 9618.HK (JD.com)' : hk ? 'MACD 金叉信號最強：9618.HK（京東）' : 'MACD 金叉信号最强：9618.HK（京东）'
          }</strong>——${
            isEN.value
              ? 'DIF crossed zero axis from −0.08 to +0.22 — zero-axis golden cross, strongest trend signal. IBM.US and 9999.HK also confirmed. Tencent, Alibaba, Xiaomi DIF still below DEA.'
              : hk
              ? 'DIF 由 −0.08 上穿零軸至 +0.22，為零軸附近金叉，趨勢性最強。IBM.US 和 9999.HK 同樣確認。騰訊、阿里、小米 DIF 仍在 DEA 下方，暫不滿足信號要求。'
              : 'DIF 由 −0.08 上穿零轴至 +0.22，为零轴附近金叉，趋势性最强。IBM.US 和 9999.HK 同样确认。腾讯、阿里、小米 DIF 仍在 DEA 下方，暂不满足信号要求。'
          }</div>`,
        },
      ],
      clientMessages: {
        claude: [
          {
            role: 'user',
            content: isEN.value
              ? 'Screen US and HK tech stocks: market cap >$50B, PE <25, recent MACD golden cross. Sort by market cap.'
              : isHK.value
              ? '幫我從美股和港股裡，篩出市值 500 億以上、PE 低於 25、近期 MACD 出現金叉的科技股，按市值排列'
              : '帮我从美股和港股里，筛出市值 500 亿以上、PE 低于 25、近期 MACD 出现金叉的科技股，按市值排列',
          },
          {
            role: 'tool',
            command:
              'longbridge calc-index 700.HK 9988.HK IBM.US 1810.HK 9999.HK 9618.HK 992.HK 285.HK --indicators MACD,PE',
            content: '',
          },
          {
            role: 'assistant',
            rich: true,
            content: `<div style="font-size:13.5px;line-height:1.8;margin-bottom:14px">${
              isEN.value
                ? 'Screening complete. Of 8 stocks meeting cap + valuation criteria, 3 show recent MACD golden crosses:'
                : hk
                ? '篩選完成。8 隻滿足市值和估值條件的科技股中，有 3 隻近期確認 MACD 金叉：'
                : '筛选完成。8 只满足市值和估值条件的科技股中，有 3 只近期确认 MACD 金叉：'
            }</div>
<div style="font-size:13px;line-height:1.85;color:var(--vp-c-text-2)">
<strong style="color:var(--up-color)">① 9618.HK（京东）</strong> — ${
              isEN.value
                ? 'DIF crossed zero from −0.08 to +0.22. Zero-axis golden cross — strongest trend signal. PE 14, cap HK$304B.'
                : hk
                ? 'DIF 由 −0.08 上穿零軸至 +0.22，零軸附近金叉，信號最強。PE 14，市值 HK$304B。'
                : 'DIF 由 −0.08 上穿零轴至 +0.22，零轴附近金叉，信号最强。PE 14，市值 HK$304B。'
            }<br>
<strong style="color:var(--up-color)">② IBM.US</strong> — ${
              isEN.value
                ? 'DIF turned positive and rising. PE 22.01, cap $233B. AI infrastructure demand driving upside.'
                : hk
                ? 'DIF 由負轉正並持續上移，PE 22.01，市值 $233B。AI 基礎設施需求驅動上行。'
                : 'DIF 由负转正并持续上移，PE 22.01，市值 $233B。AI 基础设施需求驱动上行。'
            }<br>
<strong style="color:var(--up-color)">③ 9999.HK（网易）</strong> — ${
              isEN.value ? 'DIF crossed above DEA. PE 15.00, cap HK$560B.' : hk ? 'DIF 穿越 DEA 金叉成立，PE 15.00，市值 HK$560B。' : 'DIF 穿越 DEA 金叉成立，PE 15.00，市值 HK$560B。'
            }<br><br>
${
  isEN.value
    ? 'Tencent (PE 18.84), Alibaba (PE 22.90), and Xiaomi (PE 17.53) all pass filters but DIF is still below DEA — no golden cross yet.'
    : hk
    ? '騰訊（PE 18.84）、阿里（PE 22.90）和小米（PE 17.53）均滿足估值和市值條件，但 DIF 仍在 DEA 下方，金叉信號尚未確認。'
    : '腾讯（PE 18.84）、阿里（PE 22.90）和小米（PE 17.53）均满足估值和市值条件，但 DIF 仍在 DEA 下方，金叉信号尚未确认。'
}
</div>
<div class="demo-ai-sig">${
              isEN.value ? 'Data: 2026-03-24 · MACD 12/26/9 daily' : hk ? '數據時間：2026-03-24 · MACD 參數 12/26/9 日線' : '数据时间：2026-03-24 · MACD 参数 12/26/9 日线'
            }</div>`,
          },
        ],
        'claude-code': [
          {
            role: 'user',
            content: isEN.value
              ? 'Screen US+HK tech: cap >$50B, PE<25, recent MACD golden cross'
              : isHK.value
              ? '美股 + 港股科技股篩選：市值>500 億、PE<25、近期 MACD 金叉'
              : '美股 + 港股科技股筛选：市值>500 亿、PE<25、近期 MACD 金叉',
          },
          {
            role: 'tool',
            command:
              'longbridge calc-index 700.HK 9988.HK IBM.US 1810.HK 9999.HK 9618.HK 992.HK 285.HK --indicators MACD,PE',
            content: '',
          },
          {
            role: 'assistant',
            rich: true,
            content: hk
              ? termHTML(`<span class="t-p">$</span> longbridge calc-index 700.HK 9988.HK IBM.US 1810.HK 9999.HK 9618.HK 992.HK 285.HK --indicators MACD,PE

<span class="t-hd">跨市場篩選結果 · PE<25 + MACD金叉 · 2026-03-24</span>
<span class="t-dim">──────────────────────────────────────────────────────────</span>
<span class="t-hd">Symbol     名稱           市值        PE     DIF      DEA     金叉</span>
<span class="t-dim">──────────────────────────────────────────────────────────</span>
700.HK     騰訊控股     HK$4,689B   18.84   <span class="t-neg">-2.15</span>   <span class="t-neg">-1.84</span>    <span class="t-neg">✗</span>
9988.HK    阿里巴巴     HK$2,353B   22.90   <span class="t-neg">-1.42</span>   <span class="t-neg">-0.93</span>    <span class="t-neg">✗</span>
IBM.US     IBM            $233B    22.01   <span class="t-pos">+0.86</span>   <span class="t-pos">+0.31</span>    <span class="t-pos">✓</span>
1810.HK    小米集團      HK$847B    17.53   <span class="t-neg">-0.58</span>   <span class="t-neg">-0.41</span>    <span class="t-neg">✗</span>
<span class="t-pos">9999.HK    網易          HK$560B    15.00   +0.19    +0.07    ✓</span>
<span class="t-pos">9618.HK    京東集團     HK$304B    14.00   +0.22    -0.08    ✓ ★</span>
992.HK     聯想集團      HK$114B     9.95   <span class="t-neg">-0.44</span>   <span class="t-neg">-0.31</span>    <span class="t-neg">✗</span>
285.HK     比亞迪電子    HK$70B     14.69   <span class="t-pos">+0.11</span>   <span class="t-pos">+0.04</span>    <span class="t-pos">✓</span>
<span class="t-dim">──────────────────────────────────────────────────────────</span>
符合全部條件 (PE<25 + 金叉): <span class="t-pos">4 只</span>  IBM.US  9999.HK  <span class="t-hi">9618.HK★</span>  285.HK
<span class="t-c"># ★ 9618.HK 零軸附近金叉，信號最強</span>`)
              : termHTML(`<span class="t-p">$</span> longbridge calc-index 700.HK 9988.HK IBM.US 1810.HK 9999.HK 9618.HK 992.HK 285.HK --indicators MACD,PE

<span class="t-hd">跨市场筛选结果 · PE<25 + MACD金叉 · 2026-03-24</span>
<span class="t-dim">──────────────────────────────────────────────────────────</span>
<span class="t-hd">Symbol     名称           市值        PE     DIF      DEA     金叉</span>
<span class="t-dim">──────────────────────────────────────────────────────────</span>
700.HK     腾讯控股     HK$4,689B   18.84   <span class="t-neg">-2.15</span>   <span class="t-neg">-1.84</span>    <span class="t-neg">✗</span>
9988.HK    阿里巴巴     HK$2,353B   22.90   <span class="t-neg">-1.42</span>   <span class="t-neg">-0.93</span>    <span class="t-neg">✗</span>
IBM.US     IBM            $233B    22.01   <span class="t-pos">+0.86</span>   <span class="t-pos">+0.31</span>    <span class="t-pos">✓</span>
1810.HK    小米集团      HK$847B    17.53   <span class="t-neg">-0.58</span>   <span class="t-neg">-0.41</span>    <span class="t-neg">✗</span>
<span class="t-pos">9999.HK    网易          HK$560B    15.00   +0.19    +0.07    ✓</span>
<span class="t-pos">9618.HK    京东集团     HK$304B    14.00   +0.22    -0.08    ✓ ★</span>
992.HK     联想集团      HK$114B     9.95   <span class="t-neg">-0.44</span>   <span class="t-neg">-0.31</span>    <span class="t-neg">✗</span>
285.HK     比亚迪电子    HK$70B     14.69   <span class="t-pos">+0.11</span>   <span class="t-pos">+0.04</span>    <span class="t-pos">✓</span>
<span class="t-dim">──────────────────────────────────────────────────────────</span>
符合全部条件 (PE<25 + 金叉): <span class="t-pos">4 只</span>  IBM.US  9999.HK  <span class="t-hi">9618.HK★</span>  285.HK
<span class="t-c"># ★ 9618.HK 零轴附近金叉，信号最强</span>`),
          },
        ],
      },
    },

    // ── 2. 技术面综合诊断
    {
      id: 'research',
      label: isEN.value ? 'Technical Diagnosis' : isHK.value ? '技術面診斷' : '技术面诊断',
      messages: [
        {
          role: 'user',
          content: isEN.value
            ? "Diagnose TSLA's technicals: daily trend, support or resistance, short-term signal bullish or bearish?"
            : isHK.value
            ? '幫我診斷一下 TSLA 的技術面：日線趨勢怎樣，當前在支撐位還是壓力位，短期信號偏多還是偏空？'
            : '帮我诊断一下 TSLA 的技术面：日线趋势怎样，当前在支撑位还是压力位，短期信号偏多还是偏空？',
        },
        {
          role: 'tool',
          command:
            'longbridge kline TSLA.US --period day --count 60 && longbridge calc-index TSLA.US --indicators MA,MACD,KDJ,RSI',
          content: '',
        },
        {
          role: 'assistant',
          rich: true,
          content: `
<div class="demo-kw">
  <div class="demo-kh">
    <div><div style="font-size:11px;color:var(--vp-c-text-3);margin-bottom:2px">TSLA.US · ${
      isEN.value ? 'Daily 60d' : hk ? '日線 60 天' : '日线 60 天'
    } · 2026-03-24</div><span class="demo-kprice">$380.85</span><span class="demo-kchg" style="background:var(--vp-c-red-soft);color:var(--down-color);margin-left:8px">-$7.68 · -1.98%</span></div>
    <div class="demo-kmeta"><div>${isEN.value ? 'Support $380 / $364' : hk ? '支撐 $380 / $364' : '支撑 $380 / $364'}</div><div>${
            isEN.value ? 'Resistance $395 / $400' : hk ? '壓力 $395 / $400' : '压力 $395 / $400'
          }</div></div>
  </div>
  ${klineSvg()}
  <div class="demo-kstats">
    <div class="demo-kstat"><div class="demo-ksl">MA5</div><div class="demo-ksv demo-neg">$384.23</div><div style="font-size:10px;color:var(--vp-c-text-3)">${
      isEN.value ? 'above price' : hk ? '價格上方' : '价格上方'
    }</div></div>
    <div class="demo-kstat"><div class="demo-ksl">MA20</div><div class="demo-ksv demo-neg">$397.53</div><div style="font-size:10px;color:var(--vp-c-text-3)">${
      isEN.value ? 'resistance' : hk ? '壓制' : '压制'
    }</div></div>
    <div class="demo-kstat"><div class="demo-ksl">RSI</div><div class="demo-ksv" style="color:#f59e0b">39.63</div><div style="font-size:10px;color:var(--vp-c-text-3)">${
      isEN.value ? 'near oversold' : hk ? '接近超賣' : '接近超卖'
    }</div></div>
  </div>
</div>
<div class="demo-res-section" style="margin-top:12px">
  <div class="demo-res-hd"><span class="demo-res-hd-text">${
    isEN.value ? 'Indicators' : hk ? '技術指標' : '技术指标'
  }</span><span class="demo-res-signal" style="background:var(--vp-c-red-soft);color:var(--down-color)">${
            isEN.value ? 'Bearish' : '偏空'
          }</span></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:10px 12px">
    <div style="font-size:12px"><span style="color:var(--vp-c-text-3)">MACD</span><br><strong class="demo-neg">DIF -9.75 / DEA -8.28</strong><br><span style="font-size:11px;color:var(--vp-c-text-3)">${
      isEN.value ? 'Hist -2.93, bearish expansion' : hk ? 'Hist -2.93，空頭擴張' : 'Hist -2.93，空头扩张'
    }</span></div>
    <div style="font-size:12px"><span style="color:var(--vp-c-text-3)">KDJ</span><br><strong style="color:#f59e0b">K 24.74 / D 30.15 / J 13.92</strong><br><span style="font-size:11px;color:var(--vp-c-text-3)">${
      isEN.value ? 'J extremely oversold — bounce possible' : hk ? 'J 極度超賣，有反彈可能' : 'J 极度超卖，有反弹可能'
    }</span></div>
    <div style="font-size:12px"><span style="color:var(--vp-c-text-3)">RSI(14)</span><br><strong style="color:#f59e0b">39.63</strong><br><span style="font-size:11px;color:var(--vp-c-text-3)">${
      isEN.value ? 'Approaching oversold zone (<30)' : hk ? '接近超賣區（<30），未觸發' : '接近超卖区（<30），未触发'
    }</span></div>
    <div style="font-size:12px"><span style="color:var(--vp-c-text-3)">${
      isEN.value ? 'MA Structure' : hk ? '均線結構' : '均线结构'
    }</span><br><strong class="demo-neg">${
            isEN.value ? 'Bearish stack' : hk ? '空頭排列' : '空头排列'
          }</strong><br><span style="font-size:11px;color:var(--vp-c-text-3)">MA5 &lt; MA10 &lt; MA20 &lt; MA60</span></div>
  </div>
</div>
<div class="demo-verdict">
  <div class="demo-verdict-hd">${isEN.value ? 'Diagnosis' : hk ? '綜合診斷' : '综合诊断'}</div>
  <div class="demo-verdict-rows">
    <div class="demo-verdict-row"><span class="demo-verdict-label">${
      isEN.value ? 'Trend' : hk ? '趨勢' : '趋势'
    }</span><span class="demo-verdict-val">${
            isEN.value
              ? 'Daily downtrend confirmed — all MAs above price in bearish stack. Near resistance $395, key resistance $400.'
              : hk
              ? '日線下降趨勢明確，均線全線空頭排列（MA5→MA60 均在價格上方）。短期壓力 $395，有效阻力 $400。'
              : '日线下降趋势明确，均线全线空头排列（MA5→MA60 均在价格上方）。短期压力 $395，有效阻力 $400。'
          }</span></div>
    <div class="demo-verdict-row"><span class="demo-verdict-label">${
      isEN.value ? 'Position' : '位置'
    }</span><span class="demo-verdict-val">${
            isEN.value
              ? 'Current $380.85 at prior support (Nov 2025 base). $380 is key support; break below targets $364.'
              : hk
              ? '當前 $380.85 處於前期支撐位（2025 年 11 月平台），$380 為重要支撐，若跌破關注 $364。'
              : '当前 $380.85 处于前期支撑位（2025 年 11 月平台），$380 为重要支撑，若跌破关注 $364。'
          }</span></div>
    <div class="demo-verdict-row"><span class="demo-verdict-label">${
      isEN.value ? 'Short-term' : hk ? '短期信號' : '短期信号'
    }</span><span class="demo-verdict-val">${
            isEN.value
              ? '<strong style="color:var(--vp-c-text-1)">Overall bearish, but KDJ J=13.92 is extremely oversold — technical bounce possible.</strong> Bounce target $393–$395. Failure to reclaim MA5 ($384) means downtrend resumes.'
              : hk
              ? '<strong style="color:var(--vp-c-text-1)">整體偏空，但 KDJ J=13.92 極度超賣，短期有技術性反彈可能。</strong>反彈目標 $393–$395。若不能有效收復 MA5($384)，反彈後仍有下探風險。'
              : '<strong style="color:var(--vp-c-text-1)">整体偏空，但 KDJ J=13.92 极度超卖，短期有技术性反弹可能。</strong>反弹目标 $393–$395。若不能有效收复 MA5($384)，反弹后仍有下探风险。'
          }</span></div>
  </div>
</div>`,
        },
      ],
      clientMessages: {
        claude: [
          {
            role: 'user',
            content: isEN.value
              ? "Diagnose TSLA's technicals: daily trend, support or resistance, short-term signal bullish or bearish?"
              : isHK.value
              ? '幫我診斷一下 TSLA 的技術面：日線趨勢怎樣，當前在支撐位還是壓力位，短期信號偏多還是偏空？'
              : '帮我诊断一下 TSLA 的技术面：日线趋势怎样，当前在支撑位还是压力位，短期信号偏多还是偏空？',
          },
          {
            role: 'tool',
            command:
              'longbridge kline TSLA.US --period day --count 60 && longbridge calc-index TSLA.US --indicators MA,MACD,KDJ,RSI',
            content: '',
          },
          {
            role: 'assistant',
            rich: true,
            content: `<div style="font-size:13.5px;line-height:1.8;margin-bottom:14px">${
              isEN.value
                ? "I've analyzed TSLA's technicals across three dimensions:"
                : hk
                ? '我從趨勢、指標、位置三個維度分析了 TSLA 當前技術面：'
                : '我从趋势、指标、位置三个维度分析了 TSLA 当前技术面：'
            }</div>
<div style="font-size:12px;font-weight:700;color:var(--vp-c-text-2);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">① ${
              isEN.value ? 'Daily Trend' : hk ? '日線趨勢' : '日线趋势'
            }</div>
<div style="font-size:13px;color:var(--vp-c-text-2);line-height:1.85;margin-bottom:14px">${
              isEN.value
                ? 'TSLA is in a clear daily downtrend. MA5 ($384), MA10 ($391), MA20 ($398), MA60 ($420) all above price — classic bearish stack. MACD DIF=-9.75, DEA=-8.28, histogram -2.93 and expanding. Bearish momentum continuing.'
                : hk
                ? 'TSLA 處於明確的日線下降趨勢。MA5（$384）、MA10（$391）、MA20（$398）、MA60（$420）全線在價格上方，形成標準空頭排列。MACD DIF=-9.75，DEA=-8.28，柱狀圖 -2.93 且仍在擴張，空頭動能延續。'
                : 'TSLA 处于明确的日线下降趋势。MA5（$384）、MA10（$391）、MA20（$398）、MA60（$420）全线在价格上方，形成标准空头排列。MACD DIF=-9.75，DEA=-8.28，柱状图 -2.93 且仍在扩张，空头动能延续。'
            }</div>
<div style="font-size:12px;font-weight:700;color:var(--vp-c-text-2);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">② ${
              isEN.value ? 'Key Levels' : hk ? '關鍵位置' : '关键位置'
            }</div>
<div style="font-size:13px;color:var(--vp-c-text-2);line-height:1.85;margin-bottom:14px">${
              isEN.value
                ? 'Current $380.85 sits on support (Nov 2025 base, held multiple times). If lost, next support $364. Overhead: $395 dense cost zone, $400 round-number resistance.'
                : hk
                ? '當前 $380.85 正處於支撐位（2025 年 11 月平台，多次測試有效）。若此位丟失，下一支撐在 $364。上方 $395 為近期密集成本區，$400 為整數關口阻力。'
                : '当前 $380.85 正处于支撑位（2025 年 11 月平台，多次测试有效）。若此位丢失，下一支撑在 $364。上方 $395 为近期密集成本区，$400 为整数关口阻力。'
            }</div>
<div style="font-size:12px;font-weight:700;color:var(--vp-c-text-2);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">③ ${
              isEN.value ? 'Short-term Signal' : hk ? '短期信號' : '短期信号'
            }</div>
<div style="font-size:13px;color:var(--vp-c-text-2);line-height:1.85;margin-bottom:14px">${
              isEN.value
                ? 'KDJ J=13.92 is in extreme oversold territory (<20). Historically this level produces technical bounces with high frequency. RSI(14)=39.63, near oversold but not triggered.'
                : hk
                ? 'KDJ J 值 =13.92，已進入極度超賣區間（<20），歷史上此區間出現技術性反彈概率較高。RSI(14)=39.63，接近超賣但未破位。'
                : 'KDJ J 值 =13.92，已进入极度超卖区间（<20），历史上此区间出现技术性反弹概率较高。RSI(14)=39.63，接近超卖但未破位。'
            }</div>
<div class="demo-verdict">
  <div class="demo-verdict-hd">${isEN.value ? 'My Assessment' : hk ? '我的判斷' : '我的判断'}</div>
  <div style="font-size:13px;line-height:1.85;color:var(--vp-c-text-2)">${
    isEN.value
      ? '<strong style="color:var(--vp-c-text-1)">Overall bearish, KDJ oversold bounce possible short-term.</strong> For longs: consider reducing at $393–$395. For new buyers: wait to see if MA5 ($384) is reclaimed before entering.'
      : hk
      ? '<strong style="color:var(--vp-c-text-1)">整體偏空，短期 KDJ 超賣有反彈可能。</strong>若持有多單，建議在 $393–$395 反彈區間考慮減倉；若空倉，等待 MA5 ($384) 能否有效收復再決策。'
      : '<strong style="color:var(--vp-c-text-1)">整体偏空，短期 KDJ 超卖有反弹可能。</strong>若持有多单，建议在 $393–$395 反弹区间考虑减仓；若空仓，等待 MA5 ($384) 能否有效收复再决策。'
  }</div>
</div>`,
          },
        ],
        'claude-code': [
          {
            role: 'user',
            content: isEN.value
              ? 'TSLA technical analysis: MA, MACD, KDJ, RSI signals and key levels'
              : isHK.value
              ? 'TSLA 技術分析：均線、MACD/KDJ/RSI 指標、關鍵位'
              : 'TSLA 技术分析：均线、MACD/KDJ/RSI 指标、关键位',
          },
          {
            role: 'tool',
            command:
              'longbridge kline TSLA.US --period day --count 60 && longbridge calc-index TSLA.US --indicators MA,MACD,KDJ,RSI',
            content: '',
          },
          {
            role: 'assistant',
            rich: true,
            content: hk
              ? termHTML(`<span class="t-p">$</span> longbridge calc-index TSLA.US --indicators MA,MACD,KDJ,RSI

<span class="t-hd">TSLA.US 技術指標 · 日線 · 2026-03-24</span>
<span class="t-dim">──────────────────────────────────────────</span>
現價:  <span class="t-neg">$380.85  -1.98%</span>

<span class="t-hd">均線結構（空頭排列）</span>
MA5:   <span class="t-neg">$384.23</span>  MA10: <span class="t-neg">$391.00</span>
MA20:  <span class="t-neg">$397.53</span>  MA60: <span class="t-neg">$420.39</span>
<span class="t-c"># 均線全在價格上方 → 下降趨勢</span>

<span class="t-hd">MACD(12,26,9)</span>
DIF:  <span class="t-neg">-9.75</span>   DEA:  <span class="t-neg">-8.28</span>   Hist: <span class="t-neg">-2.93</span>
<span class="t-c"># 柱狀圖擴張，空頭動能延續</span>

<span class="t-hd">KDJ</span>
K: <span class="t-hi">24.74</span>   D: <span class="t-hi">30.15</span>   J: <span class="t-hi">13.92</span>
<span class="t-c"># J<20 極度超賣，短期反彈概率較高</span>

<span class="t-hd">RSI(14)</span>
RSI: <span class="t-hi">39.63</span>  <span class="t-c"># 接近超賣(<30)，尚未觸發</span>

<span class="t-dim">──────────────────────────────────────────</span>
支撐: <span class="t-pos">$380</span> / <span class="t-pos">$364</span>   壓力: <span class="t-neg">$395</span> / <span class="t-neg">$400</span>
結論: <span class="t-neg">整體偏空</span> · KDJ超賣有短期反彈 · 關注MA5($384)能否收復`)
              : termHTML(`<span class="t-p">$</span> longbridge calc-index TSLA.US --indicators MA,MACD,KDJ,RSI

<span class="t-hd">TSLA.US 技术指标 · 日线 · 2026-03-24</span>
<span class="t-dim">──────────────────────────────────────────</span>
现价:  <span class="t-neg">$380.85  -1.98%</span>

<span class="t-hd">均线结构（空头排列）</span>
MA5:   <span class="t-neg">$384.23</span>  MA10: <span class="t-neg">$391.00</span>
MA20:  <span class="t-neg">$397.53</span>  MA60: <span class="t-neg">$420.39</span>
<span class="t-c"># 均线全在价格上方 → 下降趋势</span>

<span class="t-hd">MACD(12,26,9)</span>
DIF:  <span class="t-neg">-9.75</span>   DEA:  <span class="t-neg">-8.28</span>   Hist: <span class="t-neg">-2.93</span>
<span class="t-c"># 柱状图扩张，空头动能延续</span>

<span class="t-hd">KDJ</span>
K: <span class="t-hi">24.74</span>   D: <span class="t-hi">30.15</span>   J: <span class="t-hi">13.92</span>
<span class="t-c"># J<20 极度超卖，短期反弹概率较高</span>

<span class="t-hd">RSI(14)</span>
RSI: <span class="t-hi">39.63</span>  <span class="t-c"># 接近超卖(<30)，尚未触发</span>

<span class="t-dim">──────────────────────────────────────────</span>
支撑: <span class="t-pos">$380</span> / <span class="t-pos">$364</span>   压力: <span class="t-neg">$395</span> / <span class="t-neg">$400</span>
结论: <span class="t-neg">整体偏空</span> · KDJ超卖有短期反弹 · 关注MA5($384)能否收复`),
          },
        ],
      },
    },

    // ── 3. 财报季深度研究
    {
      id: 'trade',
      label: isEN.value ? 'Earnings Research' : isHK.value ? '財報研究' : '财报研究',
      messages: [
        {
          role: 'user',
          content: isEN.value
            ? 'NVDA just reported — compare actual vs analyst estimates, break down revenue by segment, check if valuation is reasonable'
            : isHK.value
            ? 'NVDA 剛出財報，幫我對比實際業績和分析師預期的差距，拆一下各業務線的營收變化，順便看看當前估值是否合理'
            : 'NVDA 刚出财报，帮我对比实际业绩和分析师预期的差距，拆一下各业务线的营收变化，顺便看看当前估值是否合理',
        },
        {
          role: 'tool',
          command: 'longbridge filings NVDA.US --count 5 && longbridge news NVDA.US --count 3',
          content: '',
        },
        {
          role: 'assistant',
          rich: true,
          content: `
<div class="demo-res-section">
  <div class="demo-res-hd"><span class="demo-res-hd-text">${
    isEN.value ? 'Q4 FY2026 Actual vs Estimates' : hk ? 'Q4 FY2026 業績 vs 預期' : 'Q4 FY2026 业绩 vs 预期'
  }</span><span class="demo-res-signal" style="background:var(--vp-c-green-soft);color:var(--up-color)">${
            isEN.value ? 'Beat' : hk ? '超預期' : '超预期'
          }</span></div>
  <div class="demo-table-wrap"><table class="demo-table" style="margin:0">
    <thead><tr><th>${isEN.value ? 'Metric' : hk ? '指標' : '指标'}</th><th>${isEN.value ? 'Actual' : hk ? '實際' : '实际'}</th><th>${
            isEN.value ? 'Est. (mean)' : hk ? '預期（均值）' : '预期（均值）'
          }</th><th>${isEN.value ? 'Beat' : hk ? '超預期' : '超预期'}</th></tr></thead>
    <tbody>
      <tr><td>${
        isEN.value ? 'Revenue' : hk ? '總營收' : '总营收'
      }</td><td class="demo-pos">$39.33B</td><td class="demo-muted">$38.04B</td><td class="demo-pos">+3.4%</td></tr>
      <tr><td>${
        isEN.value ? 'Data Center' : hk ? '數據中心' : '数据中心'
      }</td><td class="demo-pos">$36.74B</td><td class="demo-muted">$35.80B</td><td class="demo-pos">+2.6%</td></tr>
      <tr><td>${
        isEN.value ? 'Adj. EPS' : hk ? '調整後 EPS' : '调整后 EPS'
      }</td><td class="demo-pos">$0.89</td><td class="demo-muted">$0.85</td><td class="demo-pos">+4.7%</td></tr>
      <tr><td>${
        isEN.value ? 'Gross Margin' : '毛利率'
      }</td><td class="demo-pos">73.5%</td><td class="demo-muted">72.1%</td><td class="demo-pos">+140bp</td></tr>
    </tbody>
  </table></div>
</div>
<div class="demo-res-section">
  <div class="demo-res-hd"><span class="demo-res-hd-text">${isEN.value ? 'Revenue by Segment' : hk ? '各業務線營收' : '各业务线营收'}</span></div>
  <div style="padding:10px 12px;display:flex;flex-direction:column;gap:8px">
    <div style="font-size:12px"><div style="display:flex;justify-content:space-between;margin-bottom:3px"><span>${
      isEN.value ? 'Data Center' : hk ? '數據中心' : '数据中心'
    }</span><span class="demo-pos">$36.74B  +93% YoY</span></div><div style="background:var(--vp-c-bg-mute);height:5px;border-radius:3px"><div style="background:var(--up-color);height:5px;border-radius:3px;width:93%"></div></div></div>
    <div style="font-size:12px"><div style="display:flex;justify-content:space-between;margin-bottom:3px"><span>${
      isEN.value ? 'Gaming' : hk ? '遊戲' : '游戏'
    }</span><span class="demo-pos">$2.36B  +11% YoY</span></div><div style="background:var(--vp-c-bg-mute);height:5px;border-radius:3px"><div style="background:#4781ff;height:5px;border-radius:3px;width:40%"></div></div></div>
    <div style="font-size:12px"><div style="display:flex;justify-content:space-between;margin-bottom:3px"><span>${
      isEN.value ? 'Pro Visualization' : hk ? '專業可視化' : '专业可视化'
    }</span><span class="demo-muted">$0.51B  +5% YoY</span></div><div style="background:var(--vp-c-bg-mute);height:5px;border-radius:3px"><div style="background:var(--vp-c-text-3);height:5px;border-radius:3px;width:18%"></div></div></div>
  </div>
</div>
<div class="demo-res-section">
  <div class="demo-res-hd"><span class="demo-res-hd-text">${
    isEN.value ? 'Valuation' : hk ? '當前估值' : '当前估值'
  }</span><span class="demo-res-signal" style="background:var(--vp-c-yellow-soft);color:var(--vp-c-yellow-1)">${
            isEN.value ? 'Rich' : '偏高'
          }</span></div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:10px 12px">
    <div style="text-align:center"><div style="font-size:11px;color:var(--vp-c-text-3);margin-bottom:3px">${
      isEN.value ? 'Mkt Cap' : '市值'
    }</div><div style="font-weight:700;font-size:14px">$4.27T</div></div>
    <div style="text-align:center"><div style="font-size:11px;color:var(--vp-c-text-3);margin-bottom:3px">PE (TTM)</div><div style="font-weight:700;font-size:14px;color:#f59e0b">35.6×</div></div>
    <div style="text-align:center"><div style="font-size:11px;color:var(--vp-c-text-3);margin-bottom:3px">PB</div><div style="font-weight:700;font-size:14px;color:#f59e0b">27.1×</div></div>
  </div>
</div>
<div class="demo-hi-box"><strong>${isEN.value ? 'Summary' : hk ? '結論' : '结论'}</strong>：${
            isEN.value
              ? 'Q4 beat on revenue and EPS. Data Center +93% YoY is the core driver. PE 35.6× above peers, but $1T FY2027 AI demand forecast would justify the premium. <strong style="color:var(--vp-c-text-1)">High growth, high valuation — suitable for long-horizon positioning.</strong>'
              : hk
              ? 'Q4 營收和 EPS 均超預期，數據中心 +93% YoY 是核心驅動。當前 PE 35.6× 高於行業均值，但若 FY2027 $1T AI 需求預測兌現，成長溢價可消化。<strong style="color:var(--vp-c-text-1)">高成長、高估值，適合看長做強。</strong>'
              : 'Q4 营收和 EPS 均超预期，数据中心 +93% YoY 是核心驱动。当前 PE 35.6× 高于行业均值，但若 FY2027 $1T AI 需求预测兑现，成长溢价可消化。<strong style="color:var(--vp-c-text-1)">高成长、高估值，适合看长做强。</strong>'
          }</div>`,
        },
      ],
      clientMessages: {
        claude: [
          {
            role: 'user',
            content: isEN.value
              ? 'NVDA just reported — compare actual vs analyst estimates, break down revenue by segment, check if valuation is reasonable'
              : isHK.value
              ? 'NVDA 剛出財報，幫我對比實際業績和分析師預期的差距，拆一下各業務線的營收變化，順便看看當前估值是否合理'
              : 'NVDA 刚出财报，帮我对比实际业绩和分析师预期的差距，拆一下各业务线的营收变化，顺便看看当前估值是否合理',
          },
          {
            role: 'tool',
            command: 'longbridge filings NVDA.US --count 5 && longbridge news NVDA.US --count 3',
            content: '',
          },
          {
            role: 'assistant',
            rich: true,
            content: `<div style="font-size:13.5px;line-height:1.8;margin-bottom:14px">${
              isEN.value
                ? 'NVDA Q4 FY2026 results are in. Full breakdown of performance, revenue mix, and valuation:'
                : hk
                ? 'NVDA Q4 FY2026 財報已出，以下是業績、收入結構與估值的完整分析：'
                : 'NVDA Q4 FY2026 财报已出，以下是业绩、收入结构与估值的完整分析：'
            }</div>
<div style="font-size:12px;font-weight:700;color:var(--vp-c-text-2);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">① ${
              isEN.value ? 'Actual vs Estimates' : hk ? '業績 vs 預期' : '业绩 vs 预期'
            }</div>
<div style="font-size:13px;color:var(--vp-c-text-2);line-height:1.85;margin-bottom:14px">${
              isEN.value
                ? 'Total revenue $39.33B beat consensus $38.04B by ~3.4%. Adj. EPS $0.89 beat $0.85 by ~4.7%. Gross margin 73.5% vs estimate 72.1%. Broad beat — gross margin quality is a particularly strong signal.'
                : hk
                ? '總營收 $39.33B 超一致預期 $38.04B 約 3.4%，調整後 EPS $0.89 超預期 $0.85 約 4.7%。毛利率 73.5% 高於預期 72.1%——全面超預期，尤其是毛利率超出是盈利質量的積極信號。'
                : '总营收 $39.33B 超一致预期 $38.04B 约 3.4%，调整后 EPS $0.89 超预期 $0.85 约 4.7%。毛利率 73.5% 高于预期 72.1%——全面超预期，尤其是毛利率超出是盈利质量的积极信号。'
            }</div>
<div style="font-size:12px;font-weight:700;color:var(--vp-c-text-2);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">② ${
              isEN.value ? 'Revenue Mix' : hk ? '收入結構' : '收入结构'
            }</div>
<div style="font-size:13px;color:var(--vp-c-text-2);line-height:1.85;margin-bottom:14px">${
              isEN.value
                ? 'Data Center $36.74B (93.4% of revenue), +93% YoY — overwhelmingly the core driver. Gaming $2.36B (+11%) is stable. Concentration creates both a growth engine and a single-segment risk.'
                : hk
                ? '數據中心貢獻 $36.74B（占比 93.4%），同比 +93%，是絕對核心。Gaming $2.36B (+11%) 穩健。業務集中在數據中心，既是增長引擎，也是集中度風險。'
                : '数据中心贡献 $36.74B（占比 93.4%），同比 +93%，是绝对核心。Gaming $2.36B (+11%) 稳健。业务集中在数据中心，既是增长引擎，也是集中度风险。'
            }</div>
<div style="font-size:12px;font-weight:700;color:var(--vp-c-text-2);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">③ ${
              isEN.value ? 'Valuation' : hk ? '估值判斷' : '估值判断'
            }</div>
<div style="font-size:13px;color:var(--vp-c-text-2);line-height:1.85;margin-bottom:14px">${
              isEN.value
                ? 'Market cap $4.27T, PE 35.6× (TTM), PB 27.1×. Expensive in absolute terms, but against $1T FY2027 AI demand forecast, current PS ~2.7× is not extreme. Key risk: execution timeline.'
                : hk
                ? '當前市值 $4.27T，PE 35.6×（TTM），PB 27.1×。絕對值偏高，但考慮 FY2027 AI 需求 $1T 預測，當前 PS 約 2.7× 並不極端。關鍵在於需求兌現節奏——若推遲，高估值將承壓。'
                : '当前市值 $4.27T，PE 35.6×（TTM），PB 27.1×。绝对值偏高，但考虑 FY2027 AI 需求 $1T 预测，当前 PS 约 2.7× 并不极端。关键在于需求兑现节奏——若推迟，高估值将承压。'
            }</div>
<div class="demo-ai-sig">${
              isEN.value
                ? 'Source: NVDA latest earnings + SEC Form 4 + Longbridge quote · 2026-03-24'
                : hk
                ? '數據來源：NVDA 最新財報 + SEC Form 4 + Longbridge 行情 · 2026-03-24'
                : '数据来源：NVDA 最新财报 + SEC Form 4 + Longbridge 行情 · 2026-03-24'
            }</div>`,
          },
        ],
        'claude-code': [
          {
            role: 'user',
            content: isEN.value
              ? 'Pull NVDA earnings: actual vs estimates, segment breakdown, valuation metrics'
              : isHK.value
              ? '取 NVDA 財報數據：業績 vs 預期、分業務線拆解、估值指標'
              : '取 NVDA 财报数据：业绩 vs 预期、分业务线拆解、估值指标',
          },
          {
            role: 'tool',
            command: 'longbridge filings NVDA.US --count 5 && longbridge news NVDA.US --count 3',
            content: '',
          },
          {
            role: 'assistant',
            rich: true,
            content: hk
              ? termHTML(`<span class="t-p">$</span> longbridge filings NVDA.US --count 5

<span class="t-hd">NVDA SEC 文件 · 2026-03-24</span>
<span class="t-dim">──────────────────────────────────────────────────</span>
Form4  03-24 ×7  內部人交易  <span class="t-c"># 今日多次申報，無大額淨賣出 ✓</span>
8-K    03-02     GTC 2026 產品公告
10-K   02-01     FY2026 年報（已申報）

<span class="t-p">$</span> longbridge news NVDA.US --count 3

<span class="t-hd">NVDA 最新新聞</span>
<span class="t-dim">──────────────────────────────────────────────────</span>
<span class="t-pos">++</span> NVIDIA is packaging the world — GTC 2026 系統戰略
<span class="t-pos">++</span> SemiAnalysis: GTC 深度解析，Blackwell Ultra 出貨節奏超預期
   NVDA Q4 FY2026: 數據中心 $36.74B (+93% YoY)，EPS $0.89 超預期

<span class="t-dim">──────────────────────────────────────────────────</span>
<span class="t-hd">估值快覽 · 2026-03-24</span>
市值: <span class="t-hi">$4.27T</span>   PE(TTM): <span class="t-hi">35.6×</span>   PB: <span class="t-hi">27.1×</span>
現價: <span class="t-neg">$175.64</span>  Q4營收實際/預期: <span class="t-pos">$39.33B / $38.04B (+3.4%)</span>
<span class="t-c"># 全面超預期；數據中心佔比 93.4%，估值偏高但需求預測支撐</span>`)
              : termHTML(`<span class="t-p">$</span> longbridge filings NVDA.US --count 5

<span class="t-hd">NVDA SEC 文件 · 2026-03-24</span>
<span class="t-dim">──────────────────────────────────────────────────</span>
Form4  03-24 ×7  内部人交易  <span class="t-c"># 今日多次申报，无大额净卖出 ✓</span>
8-K    03-02     GTC 2026 产品公告
10-K   02-01     FY2026 年报（已申报）

<span class="t-p">$</span> longbridge news NVDA.US --count 3

<span class="t-hd">NVDA 最新新闻</span>
<span class="t-dim">──────────────────────────────────────────────────</span>
<span class="t-pos">++</span> NVIDIA is packaging the world — GTC 2026 系统战略
<span class="t-pos">++</span> SemiAnalysis: GTC 深度解析，Blackwell Ultra 出货节奏超预期
   NVDA Q4 FY2026: 数据中心 $36.74B (+93% YoY)，EPS $0.89 超预期

<span class="t-dim">──────────────────────────────────────────────────</span>
<span class="t-hd">估值快览 · 2026-03-24</span>
市值: <span class="t-hi">$4.27T</span>   PE(TTM): <span class="t-hi">35.6×</span>   PB: <span class="t-hi">27.1×</span>
现价: <span class="t-neg">$175.64</span>  Q4营收实际/预期: <span class="t-pos">$39.33B / $38.04B (+3.4%)</span>
<span class="t-c"># 全面超预期；数据中心占比 93.4%，估值偏高但需求预测支撑</span>`),
          },
        ],
      },
    },

    // ── 4. 聪明钱追踪
    {
      id: 'chart',
      label: isEN.value ? 'Smart Money' : isHK.value ? '聰明錢追蹤' : '聪明钱追踪',
      messages: [
        {
          role: 'user',
          content: isEN.value
            ? "Check AAPL's recent insider trades — any executives selling heavily? How did hedge fund positions change vs last quarter?"
            : isHK.value
            ? '幫我查一下 AAPL 近期的內幕交易，有沒有高管在大量減持？對沖基金的持倉和上季度相比有什麼變化？'
            : '帮我查一下 AAPL 近期的内幕交易，有没有高管在大量减持？对冲基金的持仓和上季度相比有什么变化？',
        },
        {
          role: 'tool',
          command: 'longbridge filings AAPL.US --type Form4 --count 10 && longbridge capital-dist AAPL.US',
          content: '',
        },
        {
          role: 'assistant',
          rich: true,
          content: `
<div class="demo-res-section">
  <div class="demo-res-hd"><span class="demo-res-hd-text">${
    isEN.value ? 'Insider Transactions · Form 4 · Last 90d' : hk ? '內幕交易 · Form 4 · 近 90 天' : '内幕交易 · Form 4 · 近 90 天'
  }</span><span class="demo-res-signal" style="background:var(--vp-c-bg-mute);color:var(--vp-c-text-2)">${
            isEN.value ? 'Neutral' : '中性'
          }</span></div>
  <div style="padding:10px 12px;display:flex;flex-direction:column;gap:6px">
    <div style="display:flex;gap:8px;align-items:baseline;font-size:12.5px"><span style="font-size:10px;color:var(--vp-c-text-3);width:105px;flex-shrink:0">Form 4 · 03/21</span><span style="color:var(--vp-c-text-2)">${
      isEN.value ? 'New board director · Form 3 initial filing (not a trade)' : hk ? '董事會新成員 · Form 3 申報（初始登記，非交易）' : '董事会新成员 · Form 3 申报（初始登记，非交易）'
    }</span></div>
    <div style="display:flex;gap:8px;align-items:baseline;font-size:12.5px"><span style="font-size:10px;color:var(--vp-c-text-3);width:105px;flex-shrink:0">Form 4 · 03/18</span><span style="color:var(--vp-c-text-2)">${
      isEN.value
        ? 'SVP RSU vest + automatic tax-withholding sale ~$1.8M — not discretionary selling'
        : hk
        ? 'SVP 薪酬激勵股（RSU 歸屬），自動出售約 $1.8M 用於繳稅，非主動減持'
        : 'SVP 薪酬激励股（RSU 归属），自动出售约 $1.8M 用于缴税，非主动减持'
    }</span></div>
    <div style="display:flex;gap:8px;align-items:baseline;font-size:12.5px"><span style="font-size:10px;color:var(--vp-c-text-3);width:105px;flex-shrink:0">Form 4 · 03/14</span><span style="color:var(--vp-c-text-2)">${
      isEN.value
        ? 'CFO exercised options + sold $3.2M under 10b5-1 plan (pre-scheduled, not discretionary)'
        : hk
        ? 'CFO 執行期權並同步出售 $3.2M（10b5-1 計劃，提前鎖定，非信息驅動）'
        : 'CFO 执行期权并同步出售 $3.2M（10b5-1 计划，提前锁定，非信息驱动）'
    }</span></div>
    <div style="display:flex;gap:8px;align-items:baseline;font-size:12.5px"><span style="font-size:10px;color:var(--vp-c-text-3);width:105px;flex-shrink:0">Form 4 · 02/28</span><span style="color:var(--vp-c-text-2)">${
      isEN.value ? 'VP bought 2,500 shares @$264 — discretionary buy signal' : hk ? 'VP 買入 2,500 股 @$264 · 主動增持信號' : 'VP 买入 2,500 股 @$264 · 主动增持信号'
    }</span><span class="demo-pos" style="font-size:11px;flex-shrink:0">↑ ${isEN.value ? 'Buy' : '增持'}</span></div>
  </div>
</div>
<div class="demo-res-section">
  <div class="demo-res-hd"><span class="demo-res-hd-text">${
    isEN.value ? 'Institutional Holdings QoQ' : hk ? '機構持倉變動（QoQ）' : '机构持仓变动（QoQ）'
  }</span><span class="demo-res-signal" style="background:var(--vp-c-bg-mute);color:var(--vp-c-text-2)">${
            isEN.value ? 'Small net outflow' : hk ? '小幅淨流出' : '小幅净流出'
          }</span></div>
  <div style="padding:10px 12px;display:flex;flex-direction:column;gap:6px">
    <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px"><span>${
      isEN.value ? 'Mutual Funds (Vanguard/Fidelity)' : '共同基金（Vanguard/Fidelity 等）'
    }</span><span class="demo-pos">+0.3%</span></div>
    <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px"><span>${
      isEN.value ? 'Hedge Funds (top 20)' : hk ? '對沖基金（前 20 大）' : '对冲基金（前 20 大）'
    }</span><span class="demo-neg">−1.2%</span></div>
    <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px"><span>${
      isEN.value ? 'Pensions / Sovereign' : hk ? '養老金 / 主權基金' : '养老金 / 主权基金'
    }</span><span class="demo-muted">±0.0%</span></div>
    <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px"><span>${
      isEN.value ? 'ETFs (passive)' : hk ? 'ETF（被動）' : 'ETF（被动）'
    }</span><span class="demo-pos">+0.8%</span></div>
  </div>
</div>
<div class="demo-hi-box"><strong>${isEN.value ? 'Summary' : hk ? '結論' : '结论'}</strong>：${
            isEN.value
              ? 'No red flags in insider activity — all selling is 10b5-1 or RSU tax withholding, all routine. The only discretionary trade was a VP buy. Hedge funds trimmed (-1.2%) but mutual fund and ETF inflows offset this. <strong style="color:var(--vp-c-text-1)">No sign of smart money exiting at scale.</strong>'
              : hk
              ? '內幕交易無異常——所有賣出均屬 10b5-1 計劃或 RSU 納稅性質，是例行行為。唯一的主動交易是 VP 的增持。對沖基金小幅減持（-1.2%），但共同基金和 ETF 被動增持抵消，整體持倉結構穩定，<strong style="color:var(--vp-c-text-1)">未見聰明錢大規模撤退信號。</strong>'
              : '内幕交易无异常——所有卖出均属 10b5-1 计划或 RSU 纳税性质，是例行行为。唯一的主动交易是 VP 的增持。对冲基金小幅减持（-1.2%），但共同基金和 ETF 被动增持抵消，整体持仓结构稳定，<strong style="color:var(--vp-c-text-1)">未见聪明钱大规模撤退信号。</strong>'
          }</div>`,
        },
      ],
      clientMessages: {
        claude: [
          {
            role: 'user',
            content: isEN.value
              ? "Check AAPL's recent insider trades — any executives selling heavily? How did hedge fund positions change vs last quarter?"
              : isHK.value
              ? '幫我查一下 AAPL 近期的內幕交易，有沒有高管在大量減持？對沖基金的持倉和上季度相比有什麼變化？'
              : '帮我查一下 AAPL 近期的内幕交易，有没有高管在大量减持？对冲基金的持仓和上季度相比有什么变化？',
          },
          {
            role: 'tool',
            command: 'longbridge filings AAPL.US --type Form4 --count 10 && longbridge capital-dist AAPL.US',
            content: '',
          },
          {
            role: 'assistant',
            rich: true,
            content: `<div style="font-size:13.5px;line-height:1.8;margin-bottom:14px">${
              isEN.value
                ? "I've analyzed AAPL's Form 4 insider filings over the past 90 days and institutional position changes:"
                : hk
                ? '我分析了 AAPL 近 90 天的 SEC Form 4 內幕交易申報及機構持倉變動：'
                : '我分析了 AAPL 近 90 天的 SEC Form 4 内幕交易申报及机构持仓变动：'
            }</div>
<div style="font-size:12px;font-weight:700;color:var(--vp-c-text-2);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">① ${
              isEN.value ? 'Insider Transactions' : hk ? '內幕交易' : '内幕交易'
            }</div>
<div style="font-size:13px;color:var(--vp-c-text-2);line-height:1.85;margin-bottom:14px">${
              isEN.value
                ? 'Four Form 4 filings in 90 days. <strong style="color:var(--vp-c-text-1)">No executives selling in bulk on discretion.</strong> Two sell transactions are 10b5-1 pre-scheduled or RSU tax withholding — routine. The only discretionary trade was a VP buying 2,500 shares at $264 in February — a bullish signal.'
                : hk
                ? '近 90 天共 4 份 Form 4，<strong style="color:var(--vp-c-text-1)">沒有高管主動大規模減持</strong>。兩筆賣出均屬 10b5-1 預設計劃或 RSU 納稅性質，是例行行為。唯一值得關注的主動交易是 VP 在 2 月以 $264 買入 2,500 股——偏多信號。'
                : '近 90 天共 4 份 Form 4，<strong style="color:var(--vp-c-text-1)">没有高管主动大规模减持</strong>。两笔卖出均属 10b5-1 预设计划或 RSU 纳税性质，是例行行为。唯一值得关注的主动交易是 VP 在 2 月以 $264 买入 2,500 股——偏多信号。'
            }</div>
<div style="font-size:12px;font-weight:700;color:var(--vp-c-text-2);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">② ${
              isEN.value ? 'Institutional Holdings' : hk ? '機構持倉' : '机构持仓'
            }</div>
<div style="font-size:13px;color:var(--vp-c-text-2);line-height:1.85;margin-bottom:14px">${
              isEN.value
                ? "Top 20 hedge fund holdings down -1.2% QoQ, consistent with AAPL's -5.7% correction — some risk reduction. But passive ETFs (+0.8%) and mutual funds (+0.3%) are stable, broadly offsetting."
                : hk
                ? '對沖基金前 20 大持倉環比下降 -1.2%，與 AAPL 近期 -5.7% 回調有關，部分基金減少暴露。但被動資金（ETF +0.8%）和共同基金（+0.3%）整體穩定，淨流向基本平衡。'
                : '对冲基金前 20 大持仓环比下降 -1.2%，与 AAPL 近期 -5.7% 回调有关，部分基金减少暴露。但被动资金（ETF +0.8%）和共同基金（+0.3%）整体稳定，净流向基本平衡。'
            }</div>
<div class="demo-verdict">
  <div class="demo-verdict-hd">${isEN.value ? 'My Assessment' : hk ? '我的判斷' : '我的判断'}</div>
  <div style="font-size:13px;line-height:1.85;color:var(--vp-c-text-2)">${
    isEN.value
      ? 'Capital picture is healthy. No insider warning signals. Hedge fund trimming is consistent with broad market correction, passive flows continue. <strong style="color:var(--vp-c-text-1)">No systemic exit in AAPL — current pullback appears sentiment-driven, not fundamental.</strong>'
      : hk
      ? '資金面整體健康。內部人行為無預警信號，對沖基金的輕微減持與近期大盤回調一致，被動資金持續流入。<strong style="color:var(--vp-c-text-1)">AAPL 未見系統性撤退，當前回調更多是市場情緒驅動而非基本面惡化。</strong>'
      : '资金面整体健康。内部人行为无预警信号，对冲基金的轻微减持与近期大盘回调一致，被动资金持续流入。<strong style="color:var(--vp-c-text-1)">AAPL 未见系统性撤退，当前回调更多是市场情绪驱动而非基本面恶化。</strong>'
  }</div>
</div>`,
          },
        ],
        'claude-code': [
          {
            role: 'user',
            content: isEN.value
              ? 'AAPL insider filings + institutional capital distribution'
              : isHK.value
              ? 'AAPL 內幕申報 + 機構資金分佈'
              : 'AAPL 内幕申报 + 机构资金分布',
          },
          {
            role: 'tool',
            command: 'longbridge filings AAPL.US --type Form4 --count 10 && longbridge capital-dist AAPL.US',
            content: '',
          },
          {
            role: 'assistant',
            rich: true,
            content: hk
              ? termHTML(`<span class="t-p">$</span> longbridge filings AAPL.US --type Form4 --count 5

<span class="t-hd">AAPL 內幕交易 (Form 4) · 近 90 天</span>
<span class="t-dim">──────────────────────────────────────────────────────</span>
03/21  Form3   新任董事初始登記           <span class="t-c"># 非交易</span>
03/18  Form4   SVP  RSU歸屬+稅款賣出  -$1.8M   <span class="t-c"># 例行，非主動</span>
03/14  Form4   CFO  10b5-1計劃賣出   -$3.2M   <span class="t-c"># 預設，非主動</span>
02/28  Form4   VP   主動買入 +2500股 @$264    <span class="t-pos">↑ 增持信號</span>
<span class="t-dim">──────────────────────────────────────────────────────</span>
主動減持: <span class="t-pos">$0</span>   10b5-1/納稅賣出: -$5.0M   主動買入: <span class="t-pos">+$660k</span>

<span class="t-p">$</span> longbridge capital-dist AAPL.US

<span class="t-hd">AAPL 機構持倉變動 (QoQ)</span>
<span class="t-dim">──────────────────────────────────────────────────────</span>
共同基金 (Vanguard/BLK/Fidelity)     <span class="t-pos">+0.3%</span>
對沖基金 (前20大)                     <span class="t-neg">-1.2%</span>   <span class="t-c"># 小幅減持</span>
ETF 被動                             <span class="t-pos">+0.8%</span>
養老金/主權基金                       <span class="t-dim">±0.0%</span>
<span class="t-dim">──────────────────────────────────────────────────────</span>
<span class="t-c"># 結論：內部人無主動減持，對沖基金微幅減倉屬常規。未見系統性撤退。</span>`)
              : termHTML(`<span class="t-p">$</span> longbridge filings AAPL.US --type Form4 --count 5

<span class="t-hd">AAPL 内幕交易 (Form 4) · 近 90 天</span>
<span class="t-dim">──────────────────────────────────────────────────────</span>
03/21  Form3   新任董事初始登记           <span class="t-c"># 非交易</span>
03/18  Form4   SVP  RSU归属+税款卖出  -$1.8M   <span class="t-c"># 例行，非主动</span>
03/14  Form4   CFO  10b5-1计划卖出   -$3.2M   <span class="t-c"># 预设，非主动</span>
02/28  Form4   VP   主动买入 +2500股 @$264    <span class="t-pos">↑ 增持信号</span>
<span class="t-dim">──────────────────────────────────────────────────────</span>
主动减持: <span class="t-pos">$0</span>   10b5-1/纳税卖出: -$5.0M   主动买入: <span class="t-pos">+$660k</span>

<span class="t-p">$</span> longbridge capital-dist AAPL.US

<span class="t-hd">AAPL 机构持仓变动 (QoQ)</span>
<span class="t-dim">──────────────────────────────────────────────────────</span>
共同基金 (Vanguard/BLK/Fidelity)     <span class="t-pos">+0.3%</span>
对冲基金 (前20大)                     <span class="t-neg">-1.2%</span>   <span class="t-c"># 小幅减持</span>
ETF 被动                             <span class="t-pos">+0.8%</span>
养老金/主权基金                       <span class="t-dim">±0.0%</span>
<span class="t-dim">──────────────────────────────────────────────────────</span>
<span class="t-c"># 结论：内部人无主动减持，对冲基金微幅减仓属常规。未见系统性撤退。</span>`),
          },
        ],
      },
    },

    // ── 5. 进阶下单
    {
      id: 'portfolio',
      label: isEN.value ? 'Advanced Orders' : isHK.value ? '進階下單' : '进阶下单',
      messages: [
        {
          role: 'user',
          content: isEN.value
            ? 'Set a trailing stop for TSLA — trigger a sell if it drops more than 8%. Show me the order details before executing.'
            : isHK.value
            ? '幫我給 TSLA 設一個追蹤止損，跌幅超過 8% 自動觸發賣出，執行前把訂單詳情給我確認'
            : '帮我给 TSLA 设一个追踪止损，跌幅超过 8% 自动触发卖出，执行前把订单详情给我确认',
        },
        {
          role: 'tool',
          command:
            'longbridge quote TSLA.US && longbridge submit-order TSLA.US --type trailing-stop --trail-pct 8 --side sell --qty all --preview',
          content: '',
        },
        {
          role: 'assistant',
          rich: true,
          content: `
<div class="demo-scards" style="margin-bottom:14px">
  <div class="demo-scard"><div class="demo-sl">TSLA.US</div><div class="demo-sv">$380.85</div><div class="demo-ss demo-neg">-$7.68 · -1.98%</div></div>
  <div class="demo-scard"><div class="demo-sl">${
    isEN.value ? 'Trail %' : hk ? '追蹤比例' : '追踪比例'
  }</div><div class="demo-sv" style="color:#f59e0b">8.00%</div><div class="demo-ss demo-muted">${
            isEN.value ? 'dynamic' : hk ? '動態跟蹤' : '动态跟踪'
          }</div></div>
  <div class="demo-scard"><div class="demo-sl">${
    isEN.value ? 'Trigger (now)' : hk ? '當前觸發價' : '当前触发价'
  }</div><div class="demo-sv demo-neg">$350.38</div><div class="demo-ss demo-muted">$380.85 × 0.92</div></div>
</div>
<div style="border:1px solid var(--vp-c-divider);border-radius:10px;overflow:hidden;margin-bottom:14px">
  <div style="background:var(--vp-c-bg-mute);padding:8px 14px;font-size:12px;font-weight:700;color:var(--vp-c-text-2);letter-spacing:.04em">${
    isEN.value ? 'Order Preview (pending confirmation)' : hk ? '訂單預覽（待確認）' : '订单预览（待确认）'
  }</div>
  <div style="padding:12px 14px;display:flex;flex-direction:column;gap:7px;font-size:13px">
    <div style="display:flex;justify-content:space-between"><span style="color:var(--vp-c-text-3)">${
      isEN.value ? 'Type' : hk ? '類型' : '类型'
    }</span><span>${isEN.value ? 'Trailing Stop Order' : hk ? '追蹤止損單 (Trailing Stop)' : '追踪止损单 (Trailing Stop)'}</span></div>
    <div style="display:flex;justify-content:space-between"><span style="color:var(--vp-c-text-3)">${
      isEN.value ? 'Side' : '方向'
    }</span><span class="demo-neg">${isEN.value ? 'SELL' : hk ? '賣出' : '卖出'}</span></div>
    <div style="display:flex;justify-content:space-between"><span style="color:var(--vp-c-text-3)">${
      isEN.value ? 'Qty' : hk ? '數量' : '数量'
    }</span><span>${isEN.value ? 'All holdings' : hk ? '全部持倉' : '全部持仓'}</span></div>
    <div style="display:flex;justify-content:space-between"><span style="color:var(--vp-c-text-3)">${
      isEN.value ? 'Trail' : hk ? '追蹤參數' : '追踪参数'
    }</span><span style="color:#f59e0b">8.00%</span></div>
    <div style="display:flex;justify-content:space-between"><span style="color:var(--vp-c-text-3)">${
      isEN.value ? 'Initial Trigger' : hk ? '初始觸發價' : '初始触发价'
    }</span><span class="demo-neg">$350.38</span></div>
    <div style="display:flex;justify-content:space-between"><span style="color:var(--vp-c-text-3)">${
      isEN.value ? 'Execution' : hk ? '執行方式' : '执行方式'
    }</span><span>${isEN.value ? 'Market order on trigger' : hk ? '觸發後市價成交' : '触发后市价成交'}</span></div>
  </div>
</div>
<div class="demo-warn-box">🔒 <strong>${isEN.value ? 'Awaiting your confirmation' : hk ? '等待您的確認' : '等待您的确认'}</strong>——${
            isEN.value
              ? 'This is a preview only — not yet submitted. The trailing stop auto-adjusts upward as TSLA rises, locking in profits. A market sell triggers if price drops 8% from any high. Confirm to submit or reply to modify.'
              : hk
              ? '以上為訂單預覽，尚未提交。追蹤止損將隨 TSLA 價格上漲自動上調觸發價（鎖定利潤）；價格從最高點下跌超過 8% 時觸發市價賣單。請確認後執行，或回覆修改參數。'
              : '以上为订单预览，尚未提交。追踪止损将随 TSLA 价格上涨自动上调触发价（锁定利润）；价格从最高点下跌超过 8% 时触发市价卖单。请确认后执行，或回复修改参数。'
          }</div>`,
        },
      ],
      clientMessages: {
        claude: [
          {
            role: 'user',
            content: isEN.value
              ? 'Set a trailing stop for TSLA — trigger a sell if it drops more than 8%. Show me the order details before executing.'
              : isHK.value
              ? '幫我給 TSLA 設一個追蹤止損，跌幅超過 8% 自動觸發賣出，執行前把訂單詳情給我確認'
              : '帮我给 TSLA 设一个追踪止损，跌幅超过 8% 自动触发卖出，执行前把订单详情给我确认',
          },
          {
            role: 'tool',
            command:
              'longbridge quote TSLA.US && longbridge submit-order TSLA.US --type trailing-stop --trail-pct 8 --side sell --qty all --preview',
            content: '',
          },
          {
            role: 'assistant',
            rich: true,
            content: `<div style="font-size:13.5px;line-height:1.8;margin-bottom:14px">${
              isEN.value
                ? "I've prepared a TSLA trailing stop order preview. Please review and confirm before I submit:"
                : hk
                ? '已為您生成 TSLA 追蹤止損訂單預覽，請確認後再提交：'
                : '已为您生成 TSLA 追踪止损订单预览，请确认后再提交：'
            }</div>
<div style="border:1px solid var(--vp-c-brand-1);border-radius:10px;overflow:hidden;margin-bottom:14px;box-shadow:0 0 0 1px color-mix(in srgb,var(--vp-c-brand-1) 20%,transparent)">
  <div style="background:color-mix(in srgb,var(--vp-c-brand-1) 10%,transparent);padding:8px 14px;font-size:13px;font-weight:700">${
    isEN.value ? '✦ Trailing Stop · TSLA.US' : hk ? '✦ 追蹤止損 · TSLA.US' : '✦ 追踪止损 · TSLA.US'
  }</div>
  <div style="padding:12px 14px;display:flex;flex-direction:column;gap:7px;font-size:13px;color:var(--vp-c-text-2)">
    <div>${
      isEN.value
        ? '• Trail: <strong style="color:#f59e0b">8%</strong> (dynamic, tracks from position high)'
        : hk
        ? '• 追蹤比例：<strong style="color:#f59e0b">8%</strong>（從持倉最高價動態下移）'
        : '• 追踪比例：<strong style="color:#f59e0b">8%</strong>（从持仓最高价动态下移）'
    }</div>
    <div>${
      isEN.value
        ? '• Current ref $380.85 → initial trigger <strong class="demo-neg">$350.38</strong>'
        : hk
        ? '• 當前參考價 $380.85 → 初始觸發價 <strong class="demo-neg">$350.38</strong>'
        : '• 当前参考价 $380.85 → 初始触发价 <strong class="demo-neg">$350.38</strong>'
    }</div>
    <div>${isEN.value ? '• On trigger: market sell of entire TSLA position' : hk ? '• 觸發後以市價全量賣出 TSLA 持倉' : '• 触发后以市价全量卖出 TSLA 持仓'}</div>
    <div>${
      isEN.value
        ? '• If TSLA rises to $410, trigger auto-adjusts to $377.20'
        : hk
        ? '• 如 TSLA 上漲至 $410，觸發價自動上調至 $377.20'
        : '• 如 TSLA 上涨至 $410，触发价自动上调至 $377.20'
    }</div>
  </div>
</div>
<div style="font-size:13px;color:var(--vp-c-text-2);line-height:1.8">🔒 ${
              isEN.value
                ? 'Order not submitted yet. Reply "confirm" to execute, or tell me if you want to adjust the trail % (e.g. 5%/10%), quantity, or switch to a limit stop.'
                : hk
                ? '此訂單尚未提交。請回覆「確認」執行，或告訴我是否需要調整追蹤比例（如 5%/10%）、數量，或改為限價止損。'
                : '此订单尚未提交。请回复「确认」执行，或告诉我是否需要调整追踪比例（如 5%/10%）、数量，或改为限价止损。'
            }</div>`,
          },
        ],
        'claude-code': [
          {
            role: 'user',
            content: isEN.value
              ? 'TSLA trailing stop 8%, sell all, preview first'
              : isHK.value
              ? 'TSLA 追蹤止損 8%，賣出全部，提交前預覽'
              : 'TSLA 追踪止损 8%，卖出全部，提交前预览',
          },
          {
            role: 'tool',
            command:
              'longbridge quote TSLA.US && longbridge submit-order TSLA.US --type trailing-stop --trail-pct 8 --side sell --qty all --preview',
            content: '',
          },
          {
            role: 'assistant',
            rich: true,
            content: hk
              ? termHTML(`<span class="t-p">$</span> longbridge quote TSLA.US

TSLA.US  Tesla, Inc.    <span class="t-neg">$380.85  -$7.68 (-1.98%)</span>

<span class="t-p">$</span> longbridge submit-order TSLA.US --type trailing-stop --trail-pct 8 --side sell --qty all --preview

<span class="t-hd">訂單預覽 · 未提交</span>
<span class="t-dim">──────────────────────────────────────────────</span>
類型:     追蹤止損單 (Trailing Stop)
方向:     <span class="t-neg">SELL</span>
標的:     TSLA.US
追蹤比例: <span class="t-hi">8.00%</span>
參考價:   $380.85
觸發價:   <span class="t-neg">$350.38</span>   <span class="t-c"># $380.85 × (1 − 0.08)</span>
執行方式: 觸發後市價成交
<span class="t-dim">──────────────────────────────────────────────</span>
<span class="t-c"># 價格每上漲 $1，觸發價同步上移 $0.92</span>
<span class="t-c"># 確認提交：longbridge submit-order ... --confirm</span>
<span class="t-pos">🔒 等待確認，尚未提交</span>`)
              : termHTML(`<span class="t-p">$</span> longbridge quote TSLA.US

TSLA.US  Tesla, Inc.    <span class="t-neg">$380.85  -$7.68 (-1.98%)</span>

<span class="t-p">$</span> longbridge submit-order TSLA.US --type trailing-stop --trail-pct 8 --side sell --qty all --preview

<span class="t-hd">订单预览 · 未提交</span>
<span class="t-dim">──────────────────────────────────────────────</span>
类型:     追踪止损单 (Trailing Stop)
方向:     <span class="t-neg">SELL</span>
标的:     TSLA.US
追踪比例: <span class="t-hi">8.00%</span>
参考价:   $380.85
触发价:   <span class="t-neg">$350.38</span>   <span class="t-c"># $380.85 × (1 − 0.08)</span>
执行方式: 触发后市价成交
<span class="t-dim">──────────────────────────────────────────────</span>
<span class="t-c"># 价格每上涨 $1，触发价同步上移 $0.92</span>
<span class="t-c"># 确认提交：longbridge submit-order ... --confirm</span>
<span class="t-pos">🔒 等待确认，尚未提交</span>`),
          },
        ],
      },
    },

    // ── 6. 持仓复盘
    {
      id: 'coding',
      label: isEN.value ? 'Portfolio Review' : isHK.value ? '持倉複盤' : '持仓复盘',
      messages: [
        {
          role: 'user',
          content: isEN.value
            ? 'Review my portfolio this month: total P&L trend, top contributor, worst performer, US vs HK allocation?'
            : isHK.value
            ? '幫我複盤這個月的持倉表現：總盈虧趨勢如何，哪隻股票貢獻最大、哪隻表現最弱，組合裡美股和港股各佔多少？'
            : '帮我复盘这个月的持仓表现：总盈亏趋势如何，哪只股票贡献最大、哪只表现最弱，组合里美股和港股各占多少？',
        },
        {
          role: 'tool',
          command: 'longbridge positions && longbridge profit --from 2026-03-01 --to 2026-03-24',
          content: '',
        },
        {
          role: 'assistant',
          rich: true,
          content: `
<div class="demo-scards">
  <div class="demo-scard"><div class="demo-sl">${
    isEN.value ? 'March P&L' : hk ? '3 月總盈虧' : '3 月总盈亏'
  }</div><div class="demo-sv demo-neg">-$4,287</div><div class="demo-ss demo-neg">-4.8%</div></div>
  <div class="demo-scard"><div class="demo-sl">${
    isEN.value ? 'Best' : '最佳'
  }</div><div class="demo-sv demo-pos">9618.HK</div><div class="demo-ss demo-pos">+5.8%</div></div>
  <div class="demo-scard"><div class="demo-sl">${
    isEN.value ? 'Worst' : '最弱'
  }</div><div class="demo-sv demo-neg">9988.HK</div><div class="demo-ss demo-neg">-9.7%</div></div>
</div>
<div class="demo-table-wrap"><table class="demo-table">
  <thead><tr>
    <th>${isEN.value ? 'Symbol' : hk ? '代碼' : '代码'}</th>
    <th style="text-align:left">${isEN.value ? 'Name' : hk ? '名稱' : '名称'}</th>
    <th>${isEN.value ? 'Mar 1' : hk ? '月初價' : '月初价'}</th>
    <th>${isEN.value ? 'Now' : hk ? '當前價' : '当前价'}</th>
    <th>${isEN.value ? 'MTD%' : hk ? '月漲跌' : '月涨跌'}</th>
    <th>${isEN.value ? 'Contrib' : hk ? '貢獻' : '贡献'}</th>
  </tr></thead>
  <tbody>
    <tr><td style="font-weight:700;color:var(--up-color)">9618.HK</td><td style="text-align:left;font-size:11px;color:var(--vp-c-text-3)">${
      isEN.value ? 'JD.com' : hk ? '京東集團' : '京东集团'
    }</td><td class="demo-muted">HK$101.30</td><td>HK$107.20</td><td class="demo-pos">+5.8%</td><td class="demo-pos">+$412</td></tr>
    <tr><td style="font-weight:700">NVDA.US</td><td style="text-align:left;font-size:11px;color:var(--vp-c-text-3)">NVIDIA</td><td class="demo-muted">$182.48</td><td>$175.64</td><td class="demo-neg">-4.1%</td><td class="demo-neg">-$691</td></tr>
    <tr><td style="font-weight:700">MSFT.US</td><td style="text-align:left;font-size:11px;color:var(--vp-c-text-3)">Microsoft</td><td class="demo-muted">$398.55</td><td>$379.85</td><td class="demo-neg">-4.7%</td><td class="demo-neg">-$281</td></tr>
    <tr><td style="font-weight:700">AAPL.US</td><td style="text-align:left;font-size:11px;color:var(--vp-c-text-3)">Apple</td><td class="demo-muted">$264.72</td><td>$249.66</td><td class="demo-neg">-5.7%</td><td class="demo-neg">-$2,003</td></tr>
    <tr><td style="font-weight:700">700.HK</td><td style="text-align:left;font-size:11px;color:var(--vp-c-text-3)">${
      isEN.value ? 'Tencent' : hk ? '騰訊控股' : '腾讯控股'
    }</td><td class="demo-muted">HK$163.20</td><td>HK$163.40</td><td class="demo-muted">+0.1%</td><td class="demo-muted">+$12</td></tr>
    <tr><td style="font-weight:700">9988.HK</td><td style="text-align:left;font-size:11px;color:var(--vp-c-text-3)">${
      isEN.value ? 'Alibaba' : '阿里巴巴'
    }</td><td class="demo-muted">HK$136.80</td><td>HK$123.20</td><td class="demo-neg">-9.7%</td><td class="demo-neg">-$1,736</td></tr>
  </tbody>
</table></div>
${portfolioPieSvg(cn, hk)}
<div class="demo-hi-box"><strong>${isEN.value ? 'March Summary' : hk ? '3 月小結' : '3 月小结'}</strong>：${
            isEN.value
              ? 'AAPL (−5.7%, −$2,003) and 9988.HK (−9.7%, −$1,736) were the biggest drags — combined -$3,739, 87% of total loss. 9618.HK (+5.8%) was the only positive contributor. <strong style="color:var(--vp-c-text-1)">Portfolio is US-heavy (~78%). HK (~22%) is split: JD strong, Alibaba weak.</strong>'
              : hk
              ? 'AAPL（-5.7%，-$2,003）和 9988.HK（-9.7%，-$1,736）是本月最大拖累，合計貢獻 -$3,739，佔總虧損的 87%。9618.HK（+5.8%）是唯一正收益標的。<strong style="color:var(--vp-c-text-1)">組合美股比例偏高（約 78%），港股（約 22%）表現分化：京東強、阿里弱。</strong>'
              : 'AAPL（-5.7%，-$2,003）和 9988.HK（-9.7%，-$1,736）是本月最大拖累，合计贡献 -$3,739，占总亏损的 87%。9618.HK（+5.8%）是唯一正收益标的。<strong style="color:var(--vp-c-text-1)">组合美股比例偏高（约 78%），港股（约 22%）表现分化：京东强、阿里弱。</strong>'
          }</div>`,
        },
      ],
      clientMessages: {
        claude: [
          {
            role: 'user',
            content: isEN.value
              ? 'Review my portfolio this month: total P&L trend, top contributor, worst performer, US vs HK allocation?'
              : isHK.value
              ? '幫我複盤這個月的持倉表現：總盈虧趨勢如何，哪隻股票貢獻最大、哪隻表現最弱，組合裡美股和港股各佔多少？'
              : '帮我复盘这个月的持仓表现：总盈亏趋势如何，哪只股票贡献最大、哪只表现最弱，组合里美股和港股各占多少？',
          },
          {
            role: 'tool',
            command: 'longbridge positions && longbridge profit --from 2026-03-01 --to 2026-03-24',
            content: '',
          },
          {
            role: 'assistant',
            rich: true,
            content: `<div style="font-size:13.5px;line-height:1.8;margin-bottom:14px">${
              isEN.value
                ? "I pulled your portfolio data from March 1–24. Here's the full review:"
                : hk
                ? '我調取了你 3 月 1 日到 3 月 24 日的持倉數據，以下是完整復盤：'
                : '我调取了你 3 月 1 日到 3 月 24 日的持仓数据，以下是完整复盘：'
            }</div>
<div style="font-size:12px;font-weight:700;color:var(--vp-c-text-2);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">① ${
              isEN.value ? 'Total P&L' : hk ? '總盈虧' : '总盈亏'
            }</div>
<div style="font-size:13px;color:var(--vp-c-text-2);line-height:1.85;margin-bottom:14px">${
              isEN.value
                ? 'March portfolio down -$4,287 (−4.8%), underperforming S&P 500 by ~1.2pp. Losses concentrated in mid-to-late month (3/10–3/20), coinciding with the broad tech selloff.'
                : hk
                ? '3 月組合整體下跌 -$4,287（-4.8%），跑輸同期標普 500 約 1.2 個百分點。虧損主要集中在月中下旬（3/10–3/20），與美股科技股整體回調時間一致。'
                : '3 月组合整体下跌 -$4,287（-4.8%），跑输同期标普 500 约 1.2 个百分点。亏损主要集中在月中下旬（3/10–3/20），与美股科技股整体回调时间一致。'
            }</div>
<div style="font-size:12px;font-weight:700;color:var(--vp-c-text-2);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">② ${
              isEN.value ? 'Contribution Breakdown' : hk ? '貢獻拆解' : '贡献拆解'
            }</div>
<div style="font-size:13px;color:var(--vp-c-text-2);line-height:1.85;margin-bottom:14px">${
              isEN.value
                ? 'Biggest drags: <strong class="demo-neg">AAPL (−$2,003)</strong> + <strong class="demo-neg">9988.HK (−$1,736)</strong> = 87% of losses. AAPL is largest position (~38% weight). 9618.HK was the sole positive contributor (+$412), bucking the trend.'
                : hk
                ? '最大拖累：<strong class="demo-neg">AAPL (-$2,003)</strong> + <strong class="demo-neg">9988.HK (-$1,736)</strong>，合計 87% 虧損來源。AAPL 倉位最重（約 38% 組合權重），是主要風險敞口。9618.HK 是唯一正貢獻（+$412），表現逆勢。'
                : '最大拖累：<strong class="demo-neg">AAPL (-$2,003)</strong> + <strong class="demo-neg">9988.HK (-$1,736)</strong>，合计 87% 亏损来源。AAPL 仓位最重（约 38% 组合权重），是主要风险敞口。9618.HK 是唯一正贡献（+$412），表现逆势。'
            }</div>
<div style="font-size:12px;font-weight:700;color:var(--vp-c-text-2);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">③ ${
              isEN.value ? 'Market Allocation' : hk ? '市場分佈' : '市场分布'
            }</div>
<div style="font-size:13px;color:var(--vp-c-text-2);line-height:1.85;margin-bottom:14px">${
              isEN.value
                ? 'US stocks ~78% (AAPL 38% + NVDA 20% + MSFT 20%), HK ~22% (9988, 700, 9618). Heavy US tech concentration amplified the drawdown during the correction.'
                : hk
                ? '美股約佔 78%（AAPL 38% + NVDA 20% + MSFT 20%），港股約 22%（9988、700、9618）。集中在美股科技，在科技回調期間放大了下行幅度。'
                : '美股约占 78%（AAPL 38% + NVDA 20% + MSFT 20%），港股约 22%（9988、700、9618）。集中在美股科技，在科技回调期间放大了下行幅度。'
            }</div>
<div class="demo-ai-sig">${
              isEN.value
                ? 'Period: 2026-03-01 → 2026-03-24 · includes HKD/USD conversion'
                : hk
                ? '數據區間：2026-03-01 → 2026-03-24 · 含 HKD/USD 匯率折算'
                : '数据区间：2026-03-01 → 2026-03-24 · 含 HKD/USD 汇率折算'
            }</div>`,
          },
        ],
        'claude-code': [
          {
            role: 'user',
            content: isEN.value
              ? 'Monthly portfolio review: P&L by position, allocation breakdown'
              : isHK.value
              ? '月度持倉複盤：各標的盈虧、倉位分佈'
              : '月度持仓复盘：各标的盈亏、仓位分布',
          },
          {
            role: 'tool',
            command: 'longbridge positions && longbridge profit --from 2026-03-01 --to 2026-03-24',
            content: '',
          },
          {
            role: 'assistant',
            rich: true,
            content: hk
              ? termHTML(`<span class="t-p">$</span> longbridge profit --from 2026-03-01 --to 2026-03-24

<span class="t-hd">持倉複盤 · 2026-03-01 → 03-24</span>
<span class="t-dim">──────────────────────────────────────────────────────</span>
<span class="t-hd">Symbol     月初價       當前價    MTD%     貢獻$</span>
<span class="t-dim">──────────────────────────────────────────────────────</span>
<span class="t-pos">9618.HK</span>   HK$101.30   HK$107.20  <span class="t-pos">+5.8%</span>    <span class="t-pos">+$412</span>
700.HK    HK$163.20   HK$163.40   <span class="t-dim">+0.1%</span>     <span class="t-dim">+$12</span>
NVDA.US    $182.48     $175.64    <span class="t-neg">-4.1%</span>    <span class="t-neg">-$691</span>
MSFT.US    $398.55     $379.85    <span class="t-neg">-4.7%</span>    <span class="t-neg">-$281</span>
AAPL.US    $264.72     $249.66    <span class="t-neg">-5.7%</span>  <span class="t-neg">-$2,003</span>
<span class="t-neg">9988.HK</span>   HK$136.80   HK$123.20   <span class="t-neg">-9.7%</span>  <span class="t-neg">-$1,736</span>
<span class="t-dim">──────────────────────────────────────────────────────</span>
3月總盈虧: <span class="t-neg">-$4,287 (-4.8%)</span>

倉位分佈: 美股 <span class="t-hi">~78%</span> (AAPL 38%, NVDA 20%, MSFT 20%)
         港股 <span class="t-hi">~22%</span> (9988, 700, 9618)
<span class="t-c"># AAPL + 9988.HK 貢獻 87% 虧損，建議審視集中度風險</span>`)
              : termHTML(`<span class="t-p">$</span> longbridge profit --from 2026-03-01 --to 2026-03-24

<span class="t-hd">持仓复盘 · 2026-03-01 → 03-24</span>
<span class="t-dim">──────────────────────────────────────────────────────</span>
<span class="t-hd">Symbol     月初价       当前价    MTD%     贡献$</span>
<span class="t-dim">──────────────────────────────────────────────────────</span>
<span class="t-pos">9618.HK</span>   HK$101.30   HK$107.20  <span class="t-pos">+5.8%</span>    <span class="t-pos">+$412</span>
700.HK    HK$163.20   HK$163.40   <span class="t-dim">+0.1%</span>     <span class="t-dim">+$12</span>
NVDA.US    $182.48     $175.64    <span class="t-neg">-4.1%</span>    <span class="t-neg">-$691</span>
MSFT.US    $398.55     $379.85    <span class="t-neg">-4.7%</span>    <span class="t-neg">-$281</span>
AAPL.US    $264.72     $249.66    <span class="t-neg">-5.7%</span>  <span class="t-neg">-$2,003</span>
<span class="t-neg">9988.HK</span>   HK$136.80   HK$123.20   <span class="t-neg">-9.7%</span>  <span class="t-neg">-$1,736</span>
<span class="t-dim">──────────────────────────────────────────────────────</span>
3月总盈亏: <span class="t-neg">-$4,287 (-4.8%)</span>

仓位分布: 美股 <span class="t-hi">~78%</span> (AAPL 38%, NVDA 20%, MSFT 20%)
         港股 <span class="t-hi">~22%</span> (9988, 700, 9618)
<span class="t-c"># AAPL + 9988.HK 贡献 87% 亏损，建议审视集中度风险</span>`),
          },
        ],
      },
    },
  ]
})

interface Client {
  id: string
  label: string
  color: string
}

// ─── Capability groups ────────────────────────────────────────────────────────

interface CapabilityItem {
  desc: string
}
interface CapabilityGroup {
  iconSvg: string
  color: string
  label: string
  items: CapabilityItem[]
}

const capIcons: Record<string, string> = {
  trending: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  barChart: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  users: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
  fileText: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  layers: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  briefcase: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  zap: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
}

const capabilityGroups = computed<CapabilityGroup[]>(() =>
  isEN.value
    ? [
        {
          iconSvg: capIcons.trending,
          color: '#00b8b8',
          label: 'Real-time Market Data',
          items: [
            { desc: 'Live quotes for one or more symbols' },
            { desc: 'Level 2 order book depth (bid/ask ladder)' },
            { desc: 'Tick-by-tick recent trades' },
            { desc: 'Intraday minute-by-minute price & volume' },
            { desc: 'OHLCV candlesticks & historical date-range data' },
            { desc: 'Intraday capital flow & distribution' },
            { desc: 'Market sentiment temperature index (0–100)' },
            { desc: 'Static reference info (lot size, shares, EPS…)' },
            { desc: 'Option quotes & option chain' },
            { desc: 'Warrant quotes & warrants by underlying' },
          ],
        },
        {
          iconSvg: capIcons.barChart,
          color: '#4781ff',
          label: 'Fundamentals & Research',
          items: [
            { desc: 'Income statement, balance sheet, cash flow' },
            { desc: 'P/E, P/B, P/S, dividend yield + peer comparison' },
            { desc: 'Analyst EPS forecasts' },
            { desc: 'Revenue & profit consensus with beat/miss' },
            { desc: 'Institution ratings & target price distribution' },
            { desc: 'Calculated financial indexes (PE, PB, DPS rate…)' },
            { desc: 'Institutional shareholders with position changes' },
            { desc: 'Funds & ETFs that hold a given symbol' },
            { desc: 'Dividend history & distribution details' },
            { desc: 'SEC / regulatory filings with full Markdown content' },
          ],
        },
        {
          iconSvg: capIcons.calendar,
          color: '#8b5cf6',
          label: 'Calendar & Events',
          items: [
            { desc: 'Upcoming earnings events by symbol' },
            { desc: 'High-importance macro data events' },
            { desc: 'Upcoming dividend events by market' },
            { desc: 'Trading session schedule & holiday calendar' },
          ],
        },
        {
          iconSvg: capIcons.fileText,
          color: '#f59e0b',
          label: 'News, Community & Watchlist',
          items: [
            { desc: 'Latest news articles for a symbol' },
            { desc: 'Community discussion topics' },
            { desc: 'Watchlist groups: list, create, update, delete' },
          ],
        },
        {
          iconSvg: capIcons.briefcase,
          color: '#6366f1',
          label: 'Account & Portfolio',
          items: [
            { desc: 'Stock positions across all sub-accounts' },
            { desc: 'Fund positions across all sub-accounts' },
            { desc: 'Account cash balance & financing info' },
            { desc: 'Cash flow records (deposits, withdrawals, dividends)' },
            { desc: 'Account statements (daily / monthly)' },
            { desc: 'Exchange rates for all supported currencies' },
          ],
        },
        {
          iconSvg: capIcons.zap,
          color: '#ef4444',
          label: 'Trading',
          items: [
            { desc: 'Limit, market, or stop-limit orders' },
            { desc: "List today's orders, view detail, executions" },
            { desc: 'Cancel a pending order' },
            { desc: 'Modify quantity or price of a pending order' },
            { desc: 'Estimate max buy/sell quantity' },
            { desc: 'Margin ratio requirements for a symbol' },
          ],
        },
      ]
    : [
        {
          iconSvg: capIcons.trending,
          color: '#00b8b8',
          label: isHK.value ? '實時行情' : '实时行情',
          items: [
            { desc: isHK.value ? '一個或多個標的實時報價' : '一个或多个标的实时报价' },
            { desc: isHK.value ? 'Level 2 盤口深度（買賣盤階梯）' : 'Level 2 盘口深度（买卖盘阶梯）' },
            { desc: isHK.value ? '逐筆成交記錄' : '逐笔成交记录' },
            { desc: isHK.value ? '盤中分鐘線價格與成交量' : '盘中分钟线价格与成交量' },
            { desc: isHK.value ? 'K 線 / 歷史區間 OHLCV 數據' : 'K 线 / 历史区间 OHLCV 数据' },
            { desc: isHK.value ? '盤中資金流向與分布' : '盘中资金流向与分布' },
            { desc: isHK.value ? '市場情緒溫度指數（0–100）' : '市场情绪温度指数（0–100）' },
            { desc: isHK.value ? '靜態參考信息（手數、股本、EPS…）' : '静态参考信息（手数、股本、EPS…）' },
            { desc: isHK.value ? '期權報價與期權鏈' : '期权报价与期权链' },
            { desc: isHK.value ? '權證報價及掛鉤標的的權證列表' : '权证报价及挂钩标的的权证列表' },
          ],
        },
        {
          iconSvg: capIcons.barChart,
          color: '#4781ff',
          label: isHK.value ? '基本面研究' : '基本面研究',
          items: [
            {
              desc: isHK.value
                ? '財務三表（收入表、資產負債表、現金流量表）'
                : '财务三表（收入表、资产负债表、现金流量表）',
            },
            { desc: isHK.value ? 'PE/PB/PS、股息率 + 同行估值對比' : 'PE/PB/PS、股息率 + 同行估值对比' },
            { desc: isHK.value ? '分析師 EPS 預測' : '分析师 EPS 预测' },
            {
              desc: isHK.value
                ? '營收與利潤一致性預期（含超預期/不及預期標注）'
                : '营收与利润一致性预期（含超预期/不及预期标注）',
            },
            { desc: isHK.value ? '機構評級與目標價分布' : '机构评级与目标价分布' },
            { desc: isHK.value ? '計算財務指標（PE、PB、股息率…）' : '计算财务指标（PE、PB、股息率…）' },
            { desc: isHK.value ? '機構持股及變動追蹤' : '机构持股及变动追踪' },
            { desc: isHK.value ? '持有某標的的基金與 ETF' : '持有某标的的基金与 ETF' },
            { desc: isHK.value ? '股息歷史與派息詳情' : '股息历史与派息详情' },
            { desc: isHK.value ? 'SEC / 監管申報原文（完整 Markdown）' : 'SEC / 监管申报原文（完整 Markdown）' },
          ],
        },
        {
          iconSvg: capIcons.calendar,
          color: '#8b5cf6',
          label: isHK.value ? '日曆與事件' : '日历与事件',
          items: [
            { desc: isHK.value ? '個股財報日曆' : '个股财报日历' },
            { desc: isHK.value ? '高重要性宏觀數據事件' : '高重要性宏观数据事件' },
            { desc: isHK.value ? '按市場的即將派息事件' : '按市场的即将派息事件' },
            { desc: isHK.value ? '交易時段安排與假期日曆' : '交易时段安排与假期日历' },
          ],
        },
        {
          iconSvg: capIcons.fileText,
          color: '#f59e0b',
          label: isHK.value ? '新聞、社區與自選' : '新闻、社区与自选',
          items: [
            { desc: isHK.value ? '個股最新新聞資訊' : '个股最新新闻资讯' },
            { desc: isHK.value ? '社區話題討論' : '社区话题讨论' },
            { desc: isHK.value ? '自選股管理（查詢、新增、更新、刪除）' : '自选股管理（查询、新增、更新、删除）' },
          ],
        },
        {
          iconSvg: capIcons.briefcase,
          color: '#6366f1',
          label: isHK.value ? '賬戶與持倉' : '账户与持仓',
          items: [
            { desc: isHK.value ? '全子賬戶股票持倉' : '全子账户股票持仓' },
            { desc: isHK.value ? '全子賬戶基金持倉' : '全子账户基金持仓' },
            { desc: isHK.value ? '賬戶現金餘額與融資信息' : '账户现金余额与融资信息' },
            { desc: isHK.value ? '資金流水（入金、出金、股息）' : '资金流水（入金、出金、股息）' },
            { desc: isHK.value ? '賬戶對賬單（日報 / 月報）' : '账户对账单（日报 / 月报）' },
            { desc: isHK.value ? '各幣種匯率' : '各币种汇率' },
          ],
        },
        {
          iconSvg: capIcons.zap,
          color: '#ef4444',
          label: isHK.value ? '交易執行' : '交易执行',
          items: [
            { desc: isHK.value ? '限價、市價、止損限價下單' : '限价、市价、止损限价下单' },
            { desc: isHK.value ? '訂單列表、詳情、成交記錄' : '订单列表、详情、成交记录' },
            { desc: isHK.value ? '撤銷待成交訂單' : '撤销待成交订单' },
            { desc: isHK.value ? '修改訂單數量或價格' : '修改订单数量或价格' },
            { desc: isHK.value ? '最大可買賣數量估算' : '最大可买卖数量估算' },
            { desc: isHK.value ? '標的保證金比例' : '标的保证金比例' },
          ],
        },
      ]
)

// SVG icons for each client (Simple Icons paths, viewBox="0 0 24 24")
const clientIcons: Record<string, string> = {
  openclaw: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="currentColor" width="15" height="15"><path d="M60 10 C30 10 15 35 15 55 C15 75 30 95 45 100 L45 110 L55 110 L55 100 C55 100 60 102 65 100 L65 110 L75 110 L75 100 C90 95 105 75 105 55 C105 35 90 10 60 10Z"/><path d="M20 45 C5 40 0 50 5 60 C10 70 20 65 25 55 C28 48 25 45 20 45Z"/><path d="M100 45 C115 40 120 50 115 60 C110 70 100 65 95 55 C92 48 95 45 100 45Z"/></svg>`,
  chatgpt: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.19 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.376-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/></svg>`,
  claude: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 248 248" fill="currentColor" width="15" height="15"><path d="M52.4285 162.873L98.7844 136.879L99.5485 134.602L98.7844 133.334H96.4921L88.7237 132.862L62.2346 132.153L39.3113 131.207L17.0249 130.026L11.4214 128.844L6.2 121.873L6.7094 118.447L11.4214 115.257L18.171 115.847L33.0711 116.911L55.485 118.447L71.6586 119.392L95.728 121.873H99.5485L100.058 120.337L98.7844 119.392L97.7656 118.447L74.5877 102.732L49.4995 86.1905L36.3823 76.62L29.3779 71.7757L25.8121 67.2858L24.2839 57.3608L30.6515 50.2716L39.3113 50.8623L41.4763 51.4531L50.2636 58.1879L68.9842 72.7209L93.4357 90.6804L97.0015 93.6343L98.4374 92.6652L98.6571 91.9801L97.0015 89.2625L83.757 65.2772L69.621 40.8192L63.2534 30.6579L61.5978 24.632C60.9565 22.1032 60.579 20.0111 60.579 17.4246L67.8381 7.49965L71.9133 6.19995L81.7193 7.49965L85.7946 11.0443L91.9074 24.9865L101.714 46.8451L116.996 76.62L121.453 85.4816L123.873 93.6343L124.764 96.1155H126.292V94.6976L127.566 77.9197L129.858 57.3608L132.15 30.8942L132.915 23.4505L136.608 14.4708L143.994 9.62643L149.725 12.344L154.437 19.0788L153.8 23.4505L150.998 41.6463L145.522 70.1215L141.957 89.2625H143.994L146.414 86.7813L156.093 74.0206L172.266 53.698L179.398 45.6635L187.803 36.802L193.152 32.5484H203.34L210.726 43.6549L207.415 55.1159L196.972 68.3492L188.312 79.5739L175.896 96.2095L168.191 109.585L168.882 110.689L170.738 110.53L198.755 104.504L213.91 101.787L231.994 98.7149L240.144 102.496L241.036 106.395L237.852 114.311L218.495 119.037L195.826 123.645L162.07 131.592L161.696 131.893L162.137 132.547L177.36 133.925L183.855 134.279H199.774L229.447 136.524L237.215 141.605L241.8 147.867L241.036 152.711L229.065 158.737L213.019 154.956L175.45 145.977L162.587 142.787H160.805V143.85L171.502 154.366L191.242 172.089L215.82 195.011L217.094 200.682L213.91 205.172L210.599 204.699L188.949 188.394L180.544 181.069L161.696 165.118H160.422V166.772L164.752 173.152L187.803 207.771L188.949 218.405L187.294 221.832L181.308 223.959L174.813 222.777L161.187 203.754L147.305 182.486L136.098 163.345L134.745 164.2L128.075 235.42L125.019 239.082L117.887 241.8L111.902 237.31L108.718 229.984L111.902 215.452L115.722 196.547L118.779 181.541L121.58 162.873L123.291 156.636L123.14 156.219L121.773 156.449L107.699 175.752L86.304 204.699L69.3663 222.777L65.291 224.431L58.2867 220.768L58.9235 214.27L62.8713 208.48L86.304 178.705L100.44 160.155L109.551 149.507L109.462 147.967L108.959 147.924L46.6977 188.512L35.6182 189.93L30.7788 185.44L31.4156 178.115L33.7079 175.752L52.4285 162.873Z"/></svg>`,
  'claude-code': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  codex: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
}

// All clients shown in hero chip row (popularity order)
const heroClients: Client[] = [
  { id: 'openclaw', label: 'OpenClaw', color: '#f59e0b' },
  { id: 'chatgpt', label: 'ChatGPT', color: '#10b981' },
  { id: 'claude', label: 'Claude', color: '#f97316' },
  { id: 'claude-code', label: 'Claude Code', color: '#818cf8' },
  { id: 'codex', label: 'Codex', color: '#94a3b8' },
]

// Clients available in demo tabs
const clients: Client[] = [
  { id: 'openclaw', label: 'OpenClaw', color: '#f59e0b' },
  { id: 'chatgpt', label: 'ChatGPT', color: '#10b981' },
  { id: 'claude', label: 'Claude', color: '#f97316' },
  { id: 'claude-code', label: 'Claude Code', color: '#818cf8' },
]

// ─── Demo animation state ─────────────────────────────────────────────────────

const activeScenario = ref('monitor')
const activeClient = ref('openclaw')

// Visible messages for the chat window (built up by animation)
const phase = ref<'idle' | 'user' | 'tool' | 'assistant'>('idle')
const isRichResponse = ref(false)
const visibleUserMsg = ref('')
const visibleToolCmd = ref('')
const visibleAssistantMsg = ref('')
const toolExpanded = ref(false)

let animTimer: ReturnType<typeof setTimeout> | null = null

function clearAnim() {
  if (animTimer) clearTimeout(animTimer)
  animTimer = null
  phase.value = 'idle'
  isRichResponse.value = false
  visibleUserMsg.value = ''
  visibleToolCmd.value = ''
  visibleAssistantMsg.value = ''
  toolExpanded.value = false
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    animTimer = setTimeout(resolve, ms)
  })
}

async function typewrite(target: { value: string }, text: string, speed = 5) {
  for (let i = 0; i < text.length; i++) {
    if (phase.value === 'idle') return // aborted
    target.value = text.slice(0, i + 1)
    await delay(speed)
  }
}

async function runAnimation() {
  clearAnim()
  const msgs = currentMessages.value
  if (!msgs.length) return

  const [userMsg, toolMsg, assistantMsg] = msgs

  await delay(50)

  // Phase 1: user message appears
  phase.value = 'user'
  await typewrite(visibleUserMsg, userMsg.content, 8)

  await delay(100)

  // Phase 2: tool call appears
  phase.value = 'tool'
  toolExpanded.value = true
  await typewrite(visibleToolCmd, toolMsg.command ?? '', 5)
  await delay(150)
  toolExpanded.value = false

  await delay(60)

  // Phase 3: assistant response
  isRichResponse.value = !!assistantMsg.rich
  phase.value = 'assistant'
  if (assistantMsg.rich) {
    // Rich HTML content: show at once (fade-in via CSS)
    visibleAssistantMsg.value = assistantMsg.content
  } else {
    await typewrite(visibleAssistantMsg, assistantMsg.content, 10)
  }
}

watch([activeScenario, activeClient], () => {
  clearAnim()
  phase.value = 'idle'
  runAnimation()
})

onMounted(() => {
  runAnimation()
})

onUnmounted(() => {
  clearAnim()
})

// ─── Copy button ──────────────────────────────────────────────────────────────

const npxCommand = 'npx skills add longbridge/developers'
const openclawCommand = '/skills add longbridge/developers'
import { siteHostname } from '../utils/region'
const oneLinerCommand = computed(() =>
  isEN.value
    ? `Install Longbridge Skill following the guide: \n${siteHostname}/skill/install.md`
    : isHK.value
    ? `根據指引安裝 Longbridge SKILL：\n${siteHostname}/skill/install.md`
    : `根据指引安装 Longbridge SKILL：\n${siteHostname}/skill/install.md`
)

const copiedNpx = ref(false)
const copiedOpenclaw = ref(false)
const copiedOneLiner = ref(false)

async function copyText(text: string, indicator: { value: boolean }) {
  await navigator.clipboard.writeText(text)
  indicator.value = true
  setTimeout(() => (indicator.value = false), 1500)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const currentClient = computed(() => clients.find((c) => c.id === activeClient.value) ?? clients[0])

const currentMessages = computed(() => {
  const scenario = demoScenarios.value.find((s) => s.id === activeScenario.value)
  if (!scenario) return []
  return scenario.clientMessages?.[activeClient.value] ?? scenario.messages
})
</script>

<template>
  <!-- ─── Hero ──────────────────────────────────────────────────────────────── -->
  <div class="skill-hero border-b border-[var(--vp-c-divider)]">
    <div class="max-w-3xl mx-auto px-6 py-16 text-center">
      <h1 class="skill-title">
        {{ t.heroTitle1.value }}
      </h1>
      <div class="skill-title1">{{ t.heroTitle2.value }}</div>

      <p class="skill-subtitle">{{ t.heroSubtitle.value }}</p>

      <!-- CTA block -->
      <div class="skill-cta">
        <p class="skill-cta-hint">{{ t.ctaHint.value }}</p>
        <!-- One-liner -->
        <div class="skill-cmd-block skill-cmd-block--prominent">
          <pre class="skill-cmd-text">{{ oneLinerCommand }}</pre>
          <div class="skill-copy-wrap">
            <button class="skill-copy-btn" @click="copyText(oneLinerCommand, copiedOneLiner)">
              <svg
                v-if="!copiedOneLiner"
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {{ copiedOneLiner ? t.copied.value : t.copy.value }}
            </button>
            <span class="skill-copy-tooltip" :class="{ 'skill-copy-tooltip--show': copiedOneLiner }">{{
              t.copied.value
            }}</span>
          </div>
        </div>

        <!-- Guide link -->
        <a :href="installGuideUrl" class="skill-guide-link">{{ t.installGuide.value }}</a>
      </div>

      <!-- Client labels -->
      <div class="skill-clients-label">{{ t.supportedBy.value }}</div>
      <div class="skill-clients-row">
        <span v-for="c in heroClients" :key="c.id" class="skill-client-chip">
          <span v-if="clientIcons[c.id]" class="skill-client-icon" v-html="clientIcons[c.id]" />
          {{ c.label }}
        </span>
        <span class="skill-client-more">
          {{ isEN.value ? 'Cursor, Zed, and more...' : 'Cursor, Zed, 更多...' }}
        </span>
      </div>
    </div>
  </div>

  <!-- ─── Demo ──────────────────────────────────────────────────────────────── -->
  <div class="skill-section skill-section-dark">
    <div class="skill-section-inner">
      <div class="skill-section-header">
        <h2 class="skill-section-title">{{ t.demoTitle.value }}</h2>
        <div class="skill-section-sub">{{ t.demoSubtitle.value }}</div>
      </div>

      <ClientOnly>
        <div class="skill-demo">
          <!-- Left: scenario list -->
          <div class="skill-demo-scenarios">
            <button
              v-for="s in demoScenarios"
              :key="s.id"
              class="skill-demo-scenario-btn"
              :class="{ 'skill-demo-scenario-active': activeScenario === s.id }"
              @click="activeScenario = s.id">
              {{ s.label }}
            </button>
          </div>

          <!-- Right: client tabs + chat window -->
          <div class="skill-demo-panel">
            <!-- Client tabs -->
            <div class="skill-demo-clients">
              <button
                v-for="c in clients"
                :key="c.id"
                class="skill-demo-client-tab"
                :class="{ 'skill-demo-client-active': activeClient === c.id }"
                @click="activeClient = c.id">
                {{ c.label }}
              </button>
            </div>

            <!-- Chat window -->
            <div class="skill-chat-window">
              <!-- Chrome bar -->
              <div class="skill-chat-chrome">
                <div class="skill-chat-traffic">
                  <span class="skill-chat-tl tl-r" />
                  <span class="skill-chat-tl tl-y" />
                  <span class="skill-chat-tl tl-g" />
                </div>
                <span class="skill-chat-chrome-title">{{ currentClient.label }}</span>
              </div>

              <!-- Messages -->
              <div class="skill-chat-body">
                <!-- User message -->
                <div v-if="phase !== 'idle'" class="skill-chat-user">
                  <div class="skill-chat-bubble skill-chat-bubble-user">
                    {{ visibleUserMsg }}
                  </div>
                </div>

                <!-- Tool call -->
                <div v-if="phase === 'tool' || phase === 'assistant'" class="skill-chat-tool">
                  <div class="skill-chat-tool-bar" :class="{ expanded: toolExpanded }">
                    <code>{{ visibleToolCmd }}</code>
                  </div>
                </div>

                <!-- Assistant response -->
                <div v-if="phase === 'assistant'" class="skill-chat-assistant">
                  <div class="skill-chat-bubble skill-chat-bubble-assistant">
                    <!-- Rich HTML (chat clients) -->
                    <div v-if="isRichResponse" class="skill-chat-rich" v-html="visibleAssistantMsg" />
                    <!-- Plain text / code (code clients) -->
                    <pre
                      v-else
                      class="skill-chat-pre">{{ visibleAssistantMsg }}<span v-if="visibleAssistantMsg.length < (currentMessages[2]?.content.length ?? 0)" class="skill-cursor" /></pre>
                  </div>
                </div>

                <!-- Idle state -->
                <div v-if="phase === 'idle'" class="skill-chat-idle">
                  <span class="skill-thinking-dot" /><span class="skill-thinking-dot" /><span
                    class="skill-thinking-dot" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>
    </div>
  </div>

  <!-- ─── Scenario Cards ────────────────────────────────────────────────────── -->
  <div class="skill-section">
    <div class="skill-section-inner">
      <div class="skill-section-header">
        <h2 class="skill-section-title">{{ t.scenariosTitle.value }}</h2>
        <p class="skill-section-sub">{{ t.scenariosSubtitle.value }}</p>
      </div>

      <div class="skill-cards-grid">
        <div v-for="card in scenarioCards" :key="card.id" class="skill-card">
          <span class="skill-card-label" :style="{ color: card.color }">{{ card.label }}</span>
          <h3 class="skill-card-title">{{ card.title }}</h3>
          <div class="skill-card-desc">{{ card.desc }}</div>
          <div class="skill-card-example">
            <span class="skill-card-example-text">{{ card.example }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ─── Capabilities ─────────────────────────────────────────────────────── -->
  <div class="skill-section">
    <div class="skill-section-inner">
      <div class="skill-section-header">
        <h2 class="skill-section-title">{{ t.capabilitiesTitle.value }}</h2>
        <p class="skill-section-sub">{{ t.capabilitiesSubtitle.value }}</p>
      </div>
      <div class="skill-cap-grid">
        <div v-for="group in capabilityGroups" :key="group.label" class="skill-cap-card">
          <div class="skill-cap-header">
            <span class="skill-cap-icon" :style="{ color: group.color }" v-html="group.iconSvg" />
            <span class="skill-cap-label" :style="{ color: group.color }">{{ group.label }}</span>
          </div>
          <ul class="skill-cap-list">
            <li v-for="(item, i) in group.items" :key="i">
              <span class="skill-cap-desc">{{ item.desc }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- ─── User Cases ──────────────────────────────────────────────────────── -->
  <div class="skill-section">
    <div class="skill-section-inner">
      <!-- Header -->
      <div class="skill-section-header">
        <h2 class="skill-section-title">{{ t.userCasesTitle.value }}</h2>
      </div>

      <!-- Award Banner -->
      <a class="uc-banner" :href="topicUrl('39630019')" target="_blank">
        <div class="uc-banner-glow"></div>
        <div class="uc-banner-inner">
          <div>
            <div class="uc-banner-eyebrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M12 2 L13.6 9.4 L21 11 L13.6 12.6 L12 20 L10.4 12.6 L3 11 L10.4 9.4 Z" fill="currentColor"/>
                <path d="M19 3 L19.6 5.4 L22 6 L19.6 6.6 L19 9 L18.4 6.6 L16 6 L18.4 5.4 Z" fill="currentColor" opacity="0.6"/>
              </svg>
              {{ isEN ? 'Award' : isHK ? '最燃案例獎' : '最燃案例奖' }}
            </div>
            <p class="uc-banner-title">
              {{ isEN ? 'Each winner receives' : isHK ? '每人獲得' : '每人获得' }}
              <span class="uc-banner-coin">{{ isEN ? '10,000 Task Coins' : isHK ? '10,000 任務幣' : '10,000 任务币' }}</span>
              {{ isEN ? '+' : '+' }}
              <span class="uc-banner-pod">1 × AirPods 4</span>
            </p>
            <p class="uc-banner-desc">
              {{ isEN
                ? "Winning cases are showcased on the Longbridge Skill website — visible to users worldwide, including the winner's ID and creative work."
                : isHK
                ? '獲獎案例將被收錄並展示在 Longbridge Skill 官網，全球用戶均可看到獲獎者 ID 及創意。'
                : '获奖案例将被收录并展示在 Longbridge Skill 官网，全球用户均可看到获奖者 ID 及创意。' }}
            </p>
          </div>
          <div class="uc-prize-stack">
            <div class="uc-prize">
              <div class="uc-prize-icon" data-icon="coin">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/>
                  <path d="M9 9.5 c0 -1.4 1.3 -2.2 3 -2.2 c1.6 0 2.8 0.8 2.8 2.1 M9 14.5 c0 1.4 1.3 2.2 3 2.2 c1.6 0 2.8 -0.8 2.8 -2.1 c0 -1.4 -1.3 -1.9 -3 -2.3 c-1.6 -0.4 -2.8 -0.8 -2.8 -2.3 M12 6 v12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                </svg>
              </div>
              <div>
                <div class="uc-prize-value">10,000</div>
                <div class="uc-prize-label">{{ isEN ? 'TASK COINS' : isHK ? '任務幣' : '任务币' }}</div>
              </div>
            </div>
            <div class="uc-prize">
              <div class="uc-prize-icon" data-icon="airpods">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M7.5 4 c-1.4 0 -2.5 1 -2.5 2.4 v9.4 c0 1.5 1 2.6 2.4 2.7 c1.5 0.1 2.6 -1 2.6 -2.5 V6.4 C10 5 9 4 7.6 4 Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
                  <path d="M7.5 18.5 v2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                  <path d="M16.5 4 c-1.4 0 -2.5 1 -2.5 2.4 v9.4 c0 1.5 1 2.6 2.4 2.7 c1.5 0.1 2.6 -1 2.6 -2.5 V6.4 C19 5 18 4 16.6 4 Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
                  <path d="M16.5 18.5 v2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                </svg>
              </div>
              <div>
                <div class="uc-prize-value">AirPods 4</div>
                <div class="uc-prize-label">{{ isEN ? 'PER WINNER' : isHK ? '每位獲獎者' : '每位获奖者' }}</div>
              </div>
            </div>
          </div>
        </div>
      </a>

      <!-- Cards -->
      <div class="uc-grid">
        <a
          v-for="c in userCases"
          :key="c.authorId"
          :href="topicUrl(c.topicId)"
          :class="['uc-card', `uc-accent-${c.accent}`, c.cardVariant ? `uc-card-${c.cardVariant}` : '']"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="uc-card-shine"></div>
          <div class="uc-card-top">
            <span class="uc-rank">{{ c.rank }}</span>
            <span class="uc-cta">
              {{ isEN ? 'Read case' : isHK ? '查看案例' : '查看案例' }}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12 H19 M13 6 L19 12 L13 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>
          <h3 class="uc-case-title">{{ isEN ? c.titleEn : isHK ? c.titleHK : c.title }}</h3>
          <p class="uc-case-summary">{{ isEN ? c.summaryEn : isHK ? c.summaryHK : c.summary }}</p>
          <div class="uc-card-foot">
            <div v-if="c.metricValue" class="uc-metric">
              <span class="uc-metric-value">{{ c.metricValue }}</span>
              <span class="uc-metric-label">{{ isEN ? c.metricLabelEn : isHK ? c.metricLabelHK : c.metricLabel }}</span>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>

  <!-- ─── Install ───────────────────────────────────────────────────────────── -->
  <div id="install" class="skill-section">
    <div class="skill-section-inner">
      <div class="skill-section-header">
        <h2 class="skill-section-title">{{ t.installTitle.value }}</h2>
        <p class="skill-section-sub">{{ t.installSubtitle.value }}</p>
      </div>

      <!-- One-liner install (top, full width) -->
      <div class="skill-one-liner">
        <div class="skill-one-liner-header">
          <span class="skill-one-liner-label">{{ t.oneLinerLabel.value }}</span>
          <span class="skill-one-liner-hint">{{ t.oneLinerHint.value }}</span>
        </div>
        <div class="skill-cmd-block skill-cmd-block--prominent">
          <pre class="skill-cmd-text">{{ oneLinerCommand }}</pre>
          <div class="skill-copy-wrap">
            <button class="skill-copy-btn" @click="copyText(oneLinerCommand, copiedOneLiner)">
              <svg
                v-if="!copiedOneLiner"
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {{ copiedOneLiner ? t.copied.value : t.copy.value }}
            </button>
            <span class="skill-copy-tooltip" :class="{ 'skill-copy-tooltip--show': copiedOneLiner }">{{
              t.copied.value
            }}</span>
          </div>
        </div>
      </div>

      <!-- Manual install (left-right split) -->
      <div class="skill-install-split">
        <!-- Left: ZIP download -->
        <div class="skill-install-panel">
          <div class="skill-install-panel-header">
            <span class="skill-install-panel-label">{{ t.downloadZip.value }}</span>
            <span class="skill-tag">{{ t.recommended.value }}</span>
          </div>
          <p class="skill-install-panel-hint">{{ t.manualInstallHint.value }}</p>
          <a href="/skill/longbridge-all.zip" download class="skill-btn-primary">
            {{ t.downloadZip.value }}
          </a>
          <p class="skill-also-available">
            {{ t.alsoAvailablePrefix.value
            }}<a href="https://skills.sh/longbridge/developers" target="_blank" rel="noopener">skills.sh</a
            >{{ t.alsoAvailableAnd.value
            }}<a href="https://github.com/longbridge/developers" target="_blank" rel="noopener">GitHub</a>.
          </p>
          <a :href="installGuideUrl" class="skill-guide-link" style="margin-top: auto">{{ t.installGuide.value }}</a>
        </div>

        <!-- Right: CLI -->
        <div class="skill-install-panel">
          <div class="skill-install-panel-header">
            <span class="skill-install-panel-label">{{ t.orCli.value }}</span>
          </div>
          <p class="skill-install-panel-hint">{{ t.cliInstallHint.value }}</p>
          <div class="skill-cmd-block">
            <code class="skill-cmd-text">{{ npxCommand }}</code>
            <div class="skill-copy-wrap">
              <button class="skill-copy-btn" @click="copyText(npxCommand, copiedNpx)">
                <svg
                  v-if="!copiedNpx"
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {{ copiedNpx ? t.copied.value : t.copy.value }}
              </button>
              <span class="skill-copy-tooltip" :class="{ 'skill-copy-tooltip--show': copiedNpx }">{{
                t.copied.value
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="skill-footer-wrap">
    <Footer />
  </div>
</template>

<style scoped>
/* ─── Layout ─────────────────────────────────────────────────────────────── */
.skill-hero {
  background: var(--vp-c-bg);
}
.skill-section {
  padding: 64px 0;
}
.skill-section-dark {
  background: var(--vp-c-bg-soft);
}
.skill-section-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
.skill-section-header {
  text-align: center;
  margin-bottom: 40px;
}
.skill-section-dark .skill-section-header {
  margin-bottom: 24px;
}
.skill-section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
  border: none;
  padding: 0;
}
.skill-section-sub {
  font-size: 0.9375rem;
  color: var(--vp-c-text-2);
}

/* ─── Capabilities ───────────────────────────────────────────────────────── */
.skill-cap-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 768px) {
  .skill-cap-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 480px) {
  .skill-cap-grid {
    grid-template-columns: 1fr;
  }
}
.skill-cap-card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 18px 20px;
}
.skill-cap-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.skill-cap-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.skill-cap-label {
  font-size: 0.875rem;
  font-weight: 600;
}
.skill-cap-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.skill-cap-list li {
  line-height: 1.5;
}
.skill-cap-desc {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
}

/* ─── User Cases ─────────────────────────────────────────────────────────── */
/* ─── Award Banner ─── */
.uc-banner {
  position: relative;
  margin: 0 0 40px;
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(135deg, #0A0E19 0%, #14202E 60%, #0E2A2C 100%);
  color: #fff;
  isolation: isolate;
  cursor: pointer;
  display: block;
  text-decoration: none !important;
  color: #fff !important;
  transition: opacity 200ms ease;
}
.uc-banner:hover { opacity: 0.88; }
.uc-banner-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: -1;
  background:
    radial-gradient(480px 220px at 12% 110%, rgba(0, 184, 184, 0.34), transparent 70%);
}
.uc-banner-inner {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 40px;
  align-items: center;
  padding: 28px 36px;
}
.uc-banner-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #5DE5E5;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.uc-banner-title {
  font-size: 1.375rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0 0 8px;
  letter-spacing: -0.005em;
}
.uc-banner-coin { color: #FFD84D; }
.uc-banner-pod  { color: #5DE5E5; }
.uc-banner-desc {
  font-size: 0.875rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  max-width: 580px;
}
.uc-prize-stack { display: flex; gap: 12px; }
.uc-prize {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  white-space: nowrap;
}
.uc-prize-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}
.uc-prize-icon[data-icon="coin"]    { background: rgba(255, 199, 0, 0.18); }
.uc-prize-icon[data-icon="airpods"] { background: rgba(0, 184, 184, 0.2); }
.uc-prize-value {
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.01em;
}
.uc-prize-label {
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.55);
  margin-top: 3px;
  letter-spacing: 0.04em;
}
/* ─── Grid ─── */
.uc-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
/* ─── Card ─── */
.uc-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 28px 26px 24px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  text-decoration: none !important;
  color: inherit;
  transition:
    transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 220ms cubic-bezier(0.2, 0.8, 0.2, 1),
    border-color 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
  overflow: hidden;
  isolation: isolate;
  min-height: 296px;
}
.uc-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 40px -12px rgba(10, 14, 25, 0.14), 0 4px 14px -6px rgba(10, 14, 25, 0.06);
  border-color: transparent;
  text-decoration: none;
}
.uc-card:hover .uc-cta { gap: 8px; }
.uc-card:hover .uc-card-shine { opacity: 1; }
.uc-card-shine {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 280ms ease;
  z-index: -1;
}
.uc-accent-orange .uc-card-shine { background: radial-gradient(420px 200px at 100% 0%, rgba(255, 80, 0, 0.09),   transparent 70%); }
.uc-accent-red    .uc-card-shine { background: radial-gradient(420px 200px at 100% 0%, rgba(245, 184, 0, 0.12),  transparent 70%); }
.uc-accent-yellow .uc-card-shine { background: radial-gradient(420px 200px at 100% 0%, rgba(255, 199, 0, 0.14),  transparent 70%); }
.uc-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 22px;
}
.uc-rank {
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
  font-feature-settings: "tnum";
}
.uc-accent-orange .uc-rank { color: #FF5000; }
.uc-accent-red    .uc-rank { color: #F5B800; }
.uc-accent-yellow .uc-rank { color: #C99500; }
.uc-case-title {
  font-size: 1.0625rem;
  font-weight: 600;
  line-height: 1.45;
  color: var(--vp-c-text-1);
  margin: 0 0 10px;
  letter-spacing: -0.005em;
  border: none;
  padding: 0;
}
.uc-case-summary {
  font-size: 0.875rem;
  line-height: 1.65;
  color: var(--vp-c-text-2);
  margin: 0 0 24px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.uc-card-foot {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 18px;
  border-top: 1px dashed var(--vp-c-divider);
}
.uc-metric { display: flex; flex-direction: column; gap: 2px; }
.uc-metric-value {
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  font-feature-settings: "tnum";
}
.uc-accent-orange .uc-metric-value { color: #FF5000; }
.uc-accent-red    .uc-metric-value { color: #F5B800; }
.uc-accent-yellow .uc-metric-value { color: #C99500; }
.uc-metric-label {
  font-size: 0.6875rem;
  color: var(--vp-c-text-2);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.uc-cta {
  font-size: 0.8125rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: gap 220ms ease;
}
.uc-accent-orange .uc-cta { color: #FF5000; }
.uc-accent-red    .uc-cta { color: #C99000; }
.uc-accent-yellow .uc-cta { color: #B58300; }
/* minimal variant */
.uc-card-minimal .uc-card-top  { margin-bottom: 18px; align-items: center; }
.uc-card-minimal .uc-rank {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
}
.uc-card-minimal.uc-accent-orange .uc-rank { color: #FF5000; background: #FFEDE5; }
.uc-card-minimal.uc-accent-red    .uc-rank { color: #C99000; background: #FFF8DC; }
.uc-card-minimal.uc-accent-yellow .uc-rank { color: #B58300; background: #FFF7DA; }
.uc-card-minimal .uc-case-summary { -webkit-line-clamp: 4; margin-bottom: 22px; }
.uc-card-minimal .uc-card-foot { justify-content: flex-end; padding-top: 0; border-top: 0; }
/* responsive */
@media (max-width: 960px) {
  .uc-grid         { grid-template-columns: 1fr; }
  .uc-banner-inner { grid-template-columns: 1fr; }
  .uc-prize-stack  { flex-wrap: wrap; }
}
@media (max-width: 640px) {
  .uc-banner-inner { padding: 24px 20px; }
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */
.skill-badge {
  display: inline-block;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 20px;
  padding: 3px 14px;
  font-size: 0.75rem;
  color: var(--vp-c-brand-1);
  letter-spacing: 0.04em;
  margin-bottom: 20px;
}
.skill-title {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.2;
  color: var(--vp-c-text-1);
  margin-bottom: 16px;
  border: none;
  padding: 0;
  letter-spacing: -0.02em;
}
.skill-title1 {
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--vp-c-brand-1);
  margin-bottom: 24px;
  border: none;
  padding: 0;
}
@media (max-width: 768px) {
  .skill-title {
    font-size: 1.875rem;
  }
}
.skill-gradient {
  color: var(--vp-c-brand-1);
}
.skill-subtitle {
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin-bottom: 36px;
}

/* ─── CTA block ──────────────────────────────────────────────────────────── */
.skill-cta {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 480px;
  margin: 0 auto 36px;
}
.skill-btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--vp-c-brand-1);
  color: var(--vp-button-brand-text) !important;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none !important;
  cursor: pointer;
  transition: opacity 0.15s;
}
.skill-btn-primary:hover {
  opacity: 0.9;
}
.dark .skill-btn-primary {
  background: var(--brand-60);
}
.skill-tag {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 0.6875rem;
  font-weight: 400;
}
.skill-divider {
  display: flex;
  align-items: center;
  gap: 10px;
}
.skill-divider-line {
  flex: 1;
  height: 1px;
  background: var(--vp-c-divider);
}
.skill-divider-text {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}
.skill-cmd-block {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 11px 14px;
}
.skill-cmd-text {
  flex: 1;
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  color: var(--vp-c-text-1);
  white-space: pre-wrap;
  word-break: break-all;
  text-align: left;
  margin: 0;
  background: none;
  border: none;
  padding: 0;
}
.skill-copy-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 0.6875rem;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.skill-copy-btn:hover {
  color: var(--vp-c-text-1);
}
.skill-copy-wrap {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
}
.skill-copy-tooltip {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: var(--vp-c-text-1);
  color: var(--vp-c-bg);
  font-size: 0.6875rem;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 100;
  opacity: 0;
  transition: opacity 0.15s, transform 0.15s;
}
.skill-copy-tooltip--show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
.skill-copy-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: var(--vp-c-text-1);
}
.skill-cta-hint {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin: 0 0 4px;
}
.skill-guide-link {
  font-size: 0.8125rem;
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}
.skill-also-available {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  margin: 6px 0 0;
}
.skill-also-available a {
  color: var(--vp-c-text-2);
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* ─── Client chips ───────────────────────────────────────────────────────── */
.skill-clients-label {
  font-size: 0.6875rem;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 10px;
}
.skill-clients-row {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}
.skill-client-chip {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 5px 14px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.skill-client-icon {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  opacity: 0.8;
}
.skill-client-more {
  color: var(--vp-c-text-3);
  font-size: 0.8125rem;
  font-weight: 400;
  align-self: center;
}

/* ─── Scenario cards ─────────────────────────────────────────────────────── */
.skill-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 768px) {
  .skill-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 480px) {
  .skill-cards-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
.skill-card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.skill-card-label {
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.skill-card-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.35;
  border: none;
  padding: 0;
  margin: 0;
}
.skill-card-desc {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  flex: 1;
}
.skill-card-example {
  margin: 4px -20px -20px;
  padding: 10px 20px;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
  border-radius: 0 0 8px 8px;
}
.skill-card-example-text {
  font-size: 0.8125rem;
  color: var(--vp-c-text-3);
  line-height: 1.2;
}

/* ─── Demo layout ────────────────────────────────────────────────────────── */
.skill-demo {
  display: flex;
  gap: 16px;
  min-height: 420px;
}
.skill-demo-scenarios {
  margin-top: 50px;
  width: 160px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
@media (max-width: 768px) {
  .skill-demo {
    flex-direction: column;
  }
  .skill-demo-scenarios {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
  }
}
.skill-demo-scenario-btn {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
}
.skill-demo-scenario-btn:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-brand-1);
}
.skill-demo-scenario-active {
  background: var(--vp-c-brand-1) !important;
  border-color: var(--vp-c-brand-1) !important;
  color: var(--vp-button-brand-text) !important;
}
.dark .skill-demo-scenario-active {
  background: var(--brand-60) !important;
  border-color: var(--brand-60) !important;
}

/* ─── Demo panel ─────────────────────────────────────────────────────────── */
.skill-demo-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}
.skill-demo-clients {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--vp-c-divider);
  flex-wrap: wrap;
}
.skill-demo-client-tab {
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  padding: 6px 14px;
  font-size: 0.8125rem;
  font-weight: 400;
  color: var(--vp-c-text-3);
  cursor: pointer;
  transition: color 0.15s;
}
.skill-demo-client-tab:hover {
  color: var(--vp-c-text-1);
}
.skill-demo-client-active {
  color: var(--vp-c-text-1) !important;
  font-weight: 600;
  border-bottom-color: var(--vp-c-brand-1) !important;
}
.dark .skill-demo-client-active {
  border-bottom-color: var(--brand-60) !important;
}

/* ─── Chat window ────────────────────────────────────────────────────────── */
.skill-chat-window {
  flex: 1;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 340px;
}
.skill-chat-chrome {
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 9px 14px;
  display: flex;
  align-items: center;
}
.skill-chat-traffic {
  display: flex;
  gap: 5px;
  align-items: center;
}
.skill-chat-tl {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  flex-shrink: 0;
}
.tl-r {
  background: #ff5f57;
}
.tl-y {
  background: #febc2e;
}
.tl-g {
  background: #28c840;
}
.skill-chat-chrome-title {
  flex: 1;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  margin-left: 8px;
}
.skill-chat-body {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}
.skill-chat-user {
  display: flex;
  justify-content: flex-end;
}
.skill-chat-bubble {
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 0.875rem;
  max-width: 72%;
  line-height: 1.5;
}
.skill-chat-bubble-user {
  background: var(--vp-c-brand-1);
  color: var(--vp-button-brand-text);
  border-radius: 12px 12px 2px 12px;
}
.dark .skill-chat-bubble-user {
  background: var(--brand-60);
}

.skill-chat-tool {
  display: flex;
  gap: 8px;
}
.skill-chat-tool-bar {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.8125rem;
  color: var(--vp-c-text-3);
  transition: max-height 0.3s ease, opacity 0.3s;
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  padding: 0 12px;
}
.skill-chat-tool-bar.expanded {
  max-height: 60px;
  opacity: 1;
  padding: 8px 12px;
}
.skill-chat-assistant {
}
.skill-chat-bubble-assistant {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border-radius: 2px 12px 12px 12px;
  max-width: 92%;
}

/* ── Rich content (v-html) ── */
.skill-chat-rich {
  animation: demo-fadein 0.25s ease;
}
@keyframes demo-fadein {
  from {
    opacity: 0;
    transform: translateY(3px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* Shadcn-style table: wrapper div holds outer border+radius, tr provides row dividers */
.skill-chat-bubble-assistant :deep(.demo-table-wrap) {
  overflow: hidden;
  margin-bottom: 4px;
}
.skill-chat-bubble-assistant :deep(.demo-table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}
.skill-chat-bubble-assistant :deep(.demo-table thead tr) {
  border-bottom: 1px solid var(--vp-c-divider);
}
.skill-chat-bubble-assistant :deep(.demo-table tbody tr) {
  border-bottom: 1px solid var(--vp-c-divider);
}
.skill-chat-bubble-assistant :deep(.demo-table tbody tr:last-child) {
  border-bottom: none;
}
.skill-chat-bubble-assistant :deep(.demo-table th) {
  text-align: left;
  color: var(--vp-c-text-3);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 7px 14px;
}
.skill-chat-bubble-assistant :deep(.demo-table td) {
  padding: 8px 14px;
}
.skill-chat-bubble-assistant :deep(.demo-table th:not(:first-child)),
.skill-chat-bubble-assistant :deep(.demo-table td:not(:first-child)) {
  text-align: right;
}
.skill-chat-bubble-assistant :deep(.demo-pos) {
  color: var(--up-color);
  font-weight: 600;
}
.skill-chat-bubble-assistant :deep(.demo-neg) {
  color: var(--down-color);
  font-weight: 600;
}
.skill-chat-bubble-assistant :deep(.demo-muted) {
  color: var(--vp-c-text-3);
}
.skill-chat-bubble-assistant :deep(.demo-highlight td) {
  background: var(--brand-5);
}
.skill-chat-bubble-assistant :deep(.demo-note) {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 8px 0 0;
}
.skill-chat-bubble-assistant :deep(.demo-summary) {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  padding-top: 8px;
  border-top: 1px solid var(--vp-c-divider);
  margin-top: 4px;
}
.skill-chat-bubble-assistant :deep(.demo-chart-row) {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px 0 4px;
}
.skill-chat-bubble-assistant :deep(.demo-legend) {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.skill-chat-bubble-assistant :deep(.demo-legend-item) {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
}
.skill-chat-bubble-assistant :deep(.demo-dot) {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.skill-chat-bubble-assistant :deep(.demo-price-row) {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 6px 0;
}
.skill-chat-bubble-assistant :deep(.demo-price-big) {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}
.skill-chat-bubble-assistant :deep(.demo-alerts) {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
}
.skill-chat-bubble-assistant :deep(.demo-alert-item) {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  padding: 4px 10px;
}
.skill-chat-pre {
  font-family: var(--vp-font-family-mono);
  font-size: 0.8125rem;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
}

/* ── Sparkline chart (quote scenario) ── */
.skill-chat-bubble-assistant :deep(.demo-sparkline-row) {
  display: flex;
  gap: 12px;
  padding: 8px 0 4px;
}
.skill-chat-bubble-assistant :deep(.demo-sparkline-item) {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.skill-chat-bubble-assistant :deep(.demo-sparkline-label) {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
}
.skill-chat-bubble-assistant :deep(.demo-sparkline-chart) {
  width: 100%;
  height: 64px;
}
.skill-chat-bubble-assistant :deep(.demo-sparkline-svg) {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}
.skill-chat-bubble-assistant :deep(.demo-sparkline-price) {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

/* ── Code blocks with syntax highlighting ── */
.skill-chat-bubble-assistant :deep(.demo-code-block) {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px 14px;
  margin: 4px 0;
  font-family: var(--vp-font-family-mono);
  font-size: 0.78125rem;
  line-height: 1.65;
  overflow-x: auto;
  color: var(--vp-c-text-1);
}
.skill-chat-bubble-assistant :deep(.demo-code-block code) {
  background: none;
  padding: 0;
  font-size: inherit;
  color: inherit;
  white-space: pre;
}
.skill-chat-bubble-assistant :deep(.hl-k) {
  color: var(--vp-c-indigo-1);
}
.skill-chat-bubble-assistant :deep(.hl-s) {
  color: var(--up-color);
}
.skill-chat-bubble-assistant :deep(.hl-c) {
  color: var(--vp-c-text-3);
  font-style: italic;
}
.skill-chat-bubble-assistant :deep(.hl-n) {
  color: var(--vp-c-yellow-1);
}
.skill-chat-bubble-assistant :deep(.hl-b) {
  color: var(--vp-c-brand-1);
}
.skill-chat-bubble-assistant :deep(.hl-prompt) {
  color: var(--vp-c-brand-1);
  user-select: none;
}

.skill-chat-idle {
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  flex: 1;
}

/* Thinking dots */
.skill-thinking-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--vp-c-text-3);
  animation: skill-dot-pulse 1.2s ease-in-out infinite;
}
.skill-thinking-dot:nth-child(2) {
  animation-delay: 0.2s;
}
.skill-thinking-dot:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes skill-dot-pulse {
  0%,
  60%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  30% {
    opacity: 1;
    transform: scale(1.25);
  }
}

/* ─── Install section ────────────────────────────────────────────────────── */
.skill-one-liner {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.skill-one-liner-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.skill-one-liner-label {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}
.skill-one-liner-hint {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.skill-install-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
}
@media (max-width: 640px) {
  .skill-install-split {
    grid-template-columns: 1fr;
  }
}
.skill-install-panel {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.skill-install-panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.skill-install-panel-label {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}
.skill-install-panel-hint {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  margin: 0;
}

/* ─── Rich demo content styles ────────────────────────────────────────────── */

/* Summary cards (持仓盈亏 / 美股今日) */
.skill-chat-bubble-assistant :deep(.demo-scards) {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 10px;
}
.skill-chat-bubble-assistant :deep(.demo-scard) {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 10px 12px;
}
.skill-chat-bubble-assistant :deep(.demo-sl) {
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  margin-bottom: 2px;
}
.skill-chat-bubble-assistant :deep(.demo-sv) {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}
.skill-chat-bubble-assistant :deep(.demo-ss) {
  font-size: 0.78rem;
  margin-top: 1px;
}

/* Market bar (美股今日) */
.skill-chat-bubble-assistant :deep(.demo-mkt-bar) {
  display: flex;
  align-items: center;
  gap: 0;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.skill-chat-bubble-assistant :deep(.demo-mkt-item) {
  display: flex;
  flex-direction: column;
  padding: 0 12px;
}
.skill-chat-bubble-assistant :deep(.demo-mkt-sym) {
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
}
.skill-chat-bubble-assistant :deep(.demo-mkt-price) {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}
.skill-chat-bubble-assistant :deep(.demo-mkt-chg) {
  font-size: 0.75rem;
}
.skill-chat-bubble-assistant :deep(.demo-mkt-divider) {
  width: 1px;
  height: 32px;
  background: var(--vp-c-divider);
}

/* Quote cards (美股今日) */
.skill-chat-bubble-assistant :deep(.demo-qcards) {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 10px;
}
.skill-chat-bubble-assistant :deep(.demo-qcard) {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 10px 12px;
}
.skill-chat-bubble-assistant :deep(.demo-qcard-sym) {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}
.skill-chat-bubble-assistant :deep(.demo-qcard-name) {
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
  margin-bottom: 4px;
}
.skill-chat-bubble-assistant :deep(.demo-qcard-price) {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}
.skill-chat-bubble-assistant :deep(.demo-qcard-chg) {
  font-size: 0.78rem;
  margin-top: 1px;
}
.skill-chat-bubble-assistant :deep(.demo-qcard-meta) {
  font-size: 0.68rem;
  color: var(--vp-c-text-3);
  margin-top: 3px;
}

/* News feed (美股今日) */
.skill-chat-bubble-assistant :deep(.demo-news-feed) {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
}
.skill-chat-bubble-assistant :deep(.demo-news-item) {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.skill-chat-bubble-assistant :deep(.demo-news-dot) {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 5px;
}
.skill-chat-bubble-assistant :deep(.demo-news-body) {
  flex: 1;
}
.skill-chat-bubble-assistant :deep(.demo-news-title) {
  font-size: 0.8rem;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}
.skill-chat-bubble-assistant :deep(.demo-news-meta) {
  font-size: 0.68rem;
  color: var(--vp-c-text-3);
  margin-top: 1px;
}
.skill-chat-bubble-assistant :deep(.demo-news-signal) {
  font-size: 0.68rem;
  padding: 1px 6px;
  border-radius: 4px;
  flex-shrink: 0;
  margin-top: 2px;
}

/* Highlight / warning boxes */
.skill-chat-bubble-assistant :deep(.demo-hi-box) {
  background: var(--vp-c-green-soft);
  border-left: 3px solid var(--up-color);
  border-radius: 0 6px 6px 0;
  padding: 8px 12px;
  font-size: 0.8rem;
  color: var(--vp-c-text-1);
  line-height: 1.55;
  margin-top: 4px;
}
.skill-chat-bubble-assistant :deep(.demo-warn-box) {
  background: var(--vp-c-yellow-soft);
  border-left: 3px solid var(--vp-c-yellow-1);
  border-radius: 0 6px 6px 0;
  padding: 8px 12px;
  font-size: 0.8rem;
  color: var(--vp-c-text-1);
  line-height: 1.55;
  margin-top: 4px;
}

/* Research sections (深度研究) */
.skill-chat-bubble-assistant :deep(.demo-res-section) {
  margin-bottom: 10px;
}
.skill-chat-bubble-assistant :deep(.demo-res-hd) {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}
.skill-chat-bubble-assistant :deep(.demo-res-hd-text) {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.skill-chat-bubble-assistant :deep(.demo-res-signal) {
  font-size: 0.68rem;
  padding: 1px 6px;
  border-radius: 4px;
}
.skill-chat-bubble-assistant :deep(.demo-res-body) {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  line-height: 1.55;
}

/* K-line wrapper */
.skill-chat-bubble-assistant :deep(.demo-kw) {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  overflow: hidden;
}
.skill-chat-bubble-assistant :deep(.demo-kw svg) {
  width: 100%;
  height: auto;
  display: block;
}
.skill-chat-bubble-assistant :deep(.demo-kh) {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
}
.skill-chat-bubble-assistant :deep(.demo-kprice) {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}
.skill-chat-bubble-assistant :deep(.demo-kchg) {
  font-size: 0.82rem;
  margin-top: 1px;
}
.skill-chat-bubble-assistant :deep(.demo-kmeta) {
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
  margin-top: 1px;
}
.skill-chat-bubble-assistant :deep(.demo-kstats) {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-top: 10px;
}
.skill-chat-bubble-assistant :deep(.demo-kstat) {
  background: var(--vp-c-bg-mute);
  border-radius: 6px;
  padding: 6px 8px;
}
.skill-chat-bubble-assistant :deep(.demo-ksl) {
  font-size: 0.68rem;
  color: var(--vp-c-text-3);
}
.skill-chat-bubble-assistant :deep(.demo-ksv) {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

/* Verdict block (深度研究) */
.skill-chat-bubble-assistant :deep(.demo-verdict) {
  background: var(--vp-c-bg-mute);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 10px 12px;
  margin-top: 8px;
}
.skill-chat-bubble-assistant :deep(.demo-verdict-hd) {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--vp-c-text-2);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.skill-chat-bubble-assistant :deep(.demo-verdict-rows) {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.skill-chat-bubble-assistant :deep(.demo-verdict-row) {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 0.78rem;
}
.skill-chat-bubble-assistant :deep(.demo-verdict-label) {
  flex-shrink: 0;
  width: 52px;
  color: var(--vp-c-text-3);
  padding-top: 1px;
}
.skill-chat-bubble-assistant :deep(.demo-verdict-val) {
  flex: 1;
  color: var(--vp-c-text-1);
  line-height: 1.65;
}

/* Conditional order cards (条件委托) */
.skill-chat-bubble-assistant :deep(.demo-cond-block) {
  margin-bottom: 10px;
}
.skill-chat-bubble-assistant :deep(.demo-cond-header) {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 6px;
}
.skill-chat-bubble-assistant :deep(.demo-cond-body) {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  line-height: 1.55;
}
.skill-chat-bubble-assistant :deep(.demo-cond-cards) {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 10px;
}
.skill-chat-bubble-assistant :deep(.demo-cond-card) {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 10px 12px;
}
.skill-chat-bubble-assistant :deep(.demo-cond-card-buy) {
  border-top: 2px solid var(--up-color);
}
.skill-chat-bubble-assistant :deep(.demo-cond-card-sell) {
  border-top: 2px solid var(--down-color);
}
.skill-chat-bubble-assistant :deep(.demo-cond-card-hd) {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 6px;
}
.skill-chat-bubble-assistant :deep(.demo-cond-detail-row) {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  margin-bottom: 2px;
}
.skill-chat-bubble-assistant :deep(.demo-cond-key) {
  color: var(--vp-c-text-3);
}
.skill-chat-bubble-assistant :deep(.demo-cond-status) {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 10px 12px;
  margin-top: 8px;
}
.skill-chat-bubble-assistant :deep(.demo-cond-status-hd) {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--vp-c-text-2);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.skill-chat-bubble-assistant :deep(.demo-cond-status-row) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.78rem;
  padding: 3px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}
.skill-chat-bubble-assistant :deep(.demo-cond-status-row:last-child) {
  border-bottom: none;
}

/* Progress bar */
.skill-chat-bubble-assistant :deep(.demo-progress-bar) {
  background: var(--vp-c-divider);
  border-radius: 4px;
  height: 6px;
  overflow: hidden;
  margin: 8px 0;
}
.skill-chat-bubble-assistant :deep(.demo-progress-fill) {
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--vp-c-indigo-1), var(--up-color));
}

/* AI signal badge */
.skill-chat-bubble-assistant :deep(.demo-ai-sig) {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.68rem;
  color: var(--vp-c-indigo-1);
  background: var(--vp-c-indigo-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  padding: 1px 6px;
}

/* Terminal block (no dark background) */
.skill-chat-bubble-assistant :deep(.demo-term) {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 10px 12px;
  font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', ui-monospace, monospace;
  font-size: 0.75rem;
  line-height: 1.75;
  white-space: pre;
  overflow-x: auto;
  margin-bottom: 8px;
  color: var(--vp-c-text-1);
}
.skill-chat-bubble-assistant :deep(.demo-term .t-p) {
  color: var(--vp-c-brand-1);
}
.skill-chat-bubble-assistant :deep(.demo-term .t-hd) {
  color: var(--vp-c-text-1);
  font-weight: 700;
}
.skill-chat-bubble-assistant :deep(.demo-term .t-dim) {
  color: var(--vp-c-text-3);
}
.skill-chat-bubble-assistant :deep(.demo-term .t-pos) {
  color: var(--up-color);
}
.skill-chat-bubble-assistant :deep(.demo-term .t-neg) {
  color: var(--down-color);
}
.skill-chat-bubble-assistant :deep(.demo-term .t-hi) {
  color: var(--vp-c-yellow-1);
}
.skill-chat-bubble-assistant :deep(.demo-term .t-c) {
  color: var(--vp-c-indigo-1);
}
.skill-footer-wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  border-top: 1px solid var(--vp-c-divider);
}
</style>
