<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import AppNav from '../AppNav.vue'
import AppFooter from '../AppFooter.vue'
import { localePath } from '../../utils/i18n'
import { useData } from 'vitepress'

const { lang } = useData()

const subtitleRef = ref<HTMLElement | null>(null)
let channelsObserver: IntersectionObserver | null = null

const handleSubtitleAnimationEnd = (e: AnimationEvent) => {
  if (e.animationName === 'home-channels-reveal' && e.target === subtitleRef.value) {
    subtitleRef.value?.classList.remove('is-visible')
  }
}

onMounted(() => {
  const el = subtitleRef.value
  if (!el) return
  if (typeof IntersectionObserver === 'undefined') {
    el.classList.add('is-visible')
    return
  }
  el.addEventListener('animationend', handleSubtitleAnimationEnd)
  channelsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 重启动画：先摘掉 class + 强制 reflow，再挂回来
          el.classList.remove('is-visible')
          void el.offsetWidth
          el.classList.add('is-visible')
        }
      })
    },
    { threshold: 0, rootMargin: '-40% 0px -40% 0px' }
  )
  channelsObserver.observe(el)
})

onBeforeUnmount(() => {
  channelsObserver?.disconnect()
  subtitleRef.value?.removeEventListener('animationend', handleSubtitleAnimationEnd)
})

const CHATGPT_APP_URL = 'https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef'
const CLAUDE_CONNECTOR_URL = 'https://claude.ai/directory/connectors/longbridge'

const LOCALE = {
  en: {
    hero: {
      eyebrow: 'LONGBRIDGE OPENAPI',
      title1: 'Real-time markets,',
      title2: 'built for AI.',
      desc: 'Real-time market data, quantitative research, and AI-powered analysis — through AI Skill, CLI, MCP, SDK and OpenAPI. One credential, every market, zero overhead. Explore <a href="https://longbridge.com/markets" target="_blank" rel="noreferrer">live market data</a> across every market.',
      cta1: 'Get Started',
      cta2: 'Read the Docs',
      highlights: [
        { u: 'markets', d: 'US · HK · SG · CN' },
        { u: 'SDKs', d: 'Python · Rust · Node · Go · Java · C · C++' },
        { u: 'endpoints', d: 'Quote · Trade · Research · News' },
        { u: 'OpenAPI access', d: 'No monthly fees' },
      ],
    },
    channels: {
      eyebrow: 'OFFICIAL INTEGRATION · NOW LIVE',
      title: 'ChatGPT × Claude',
      tagline: 'AI that reads the market.',
      subtitle:
        '<span class="k k-lb">Longbridge</span> is live on <span class="k k-gpt">ChatGPT Apps</span> and <span class="k k-claude">Claude Connectors</span> — check quotes, screen ideas, view positions. One-tap OAuth, no API keys.',
      partners: [
        {
          key: 'chatgpt',
          brand: 'ChatGPT',
          cta: 'Open in ChatGPT',
        },
        {
          key: 'claude',
          brand: 'Claude',
          cta: 'Add Claude Connector',
        },
      ],
    },
    features: {
      eyebrow: 'FEATURES',
      title: 'Everything you need for market analysis, quantitative research, and intelligent trading.',
      cta: 'Compare all',
    },
    products: [
      {
        label: 'AI Skill',
        title: 'Investment analysis agent for any AI',
        desc: 'Use Longbridge in ChatGPT Apps with @longbridge, or give Claude, Cursor, Gemini, Codex, Zed, and Cherry Studio live market intelligence.',
        tags: ['Agent Skills'],
      },
      {
        label: 'CLI',
        title: 'AI-native terminal for trading',
        desc: 'Interactive TUI dashboard, 130+ commands, and --format json output for scripting and AI agent integration. OAuth 2.0 works on SSH and headless servers.',
        tags: ['130+ cmds', '--format json', 'TUI'],
      },
      {
        label: 'MCP',
        title: 'ChatGPT App + hosted MCP',
        desc: 'Official ChatGPT App plus hosted OAuth 2.1 MCP for Codex, Claude Code, Cursor, Zed, and Cherry Studio.',
        tags: ['ChatGPT App', 'OAuth 2.1'],
      },
      {
        label: 'SDK',
        title: '7 languages, one Rust core',
        desc: 'Get your first quote in minutes. Python, Node.js, Rust, Go, Java, C, C++ — with async support and built-in rate control.',
        tags: ['Python', 'Rust', 'Go', '+ 4'],
      },
      {
        label: 'Paper Trading',
        title: 'Sandbox at zero cost',
        desc: 'Test orders with real market data — simulated matching based on live bid-ask spreads. No securities account required.',
        tags: ['Sandbox', 'Zero Cost'],
      },
      {
        label: 'LLM Ready',
        title: 'Built for retrieval & RAG',
        desc: 'llms.txt standard compliance, every doc available as .md for RAG pipelines, and Accept: text/markdown header support on longbridge.com.',
        tags: ['Markdown', 'llms.txt'],
      },
    ],
    cli: {
      eyebrow: 'Longbridge CLI',
      title: 'AI-native command-line tool, covering every OpenAPI.',
      feats: [
        [
          '130+ commands',
          '<a href="https://longbridge.com/markets">Market data</a>, trading, fundamentals — all in your shell.',
        ],
        ['--format json output', "Pipe into jq, awk, or any AI agent's tool channel."],
        ['Multi-period candlesticks', 'Daily, hourly, 15-min, 5-min, 1-min — all from one flag.'],
        ['Portfolio P&L view', 'Position breakdown with allocation drill-down.'],
        ['OAuth 2.0 on SSH', 'Works on headless servers and inside Docker.'],
      ],
      cta: 'CLI Documentation',
    },
    ai: {
      eyebrow: 'AI Skill · packaged tools',
      title1: 'Unlock market insights, deep research,',
      title2: 'and intelligent trading for your AI.',
      desc: 'With Longbridge Skill, your AI assistant can <a href="https://longbridge.com/screener">screen stocks</a>, decode earnings, track insider moves, and place orders — all in plain conversation, no app-switching required.',
      installLabel: 'Copy and send to any AI — it walks you through install:',
      installCmd: `Install Longbridge AI toolkit following the guide:\nhttps://open.longbridge.com/skill/install.md\n\nAnd complete login and test with a market data query.`,
      installOr: '— or via package manager —',
      agentMore: '+ any Skill-compatible agent',
      cta: 'Browse Skill catalog',
    },
    mcp: {
      eyebrow: 'Hosted MCP',
      title: 'Connect ChatGPT and AI assistants to live market data — no API keys.',
      desc: 'Open the <a href="https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef">Longbridge ChatGPT App</a>, authorize, then use <code>@longbridge</code>. Other AI clients connect through hosted HTTP MCP with OAuth 2.1.',
      cta: 'MCP Documentation',
      note: 'ChatGPT Apps first; other clients use OAuth 2.1 on first use. No API key needed.',
    },
    apiCaps: {
      eyebrow: 'API Capabilities',
      title: 'Real-time data and trading capabilities for every investment workflow.',
      items: [
        {
          title: 'Market Data',
          count: '30+',
          desc: 'Real-time quotes, order depth, candlestick, intraday, capital flow, and push subscriptions',
          items: [
            'Real-time quotes',
            'Order book depth',
            'Candlestick charts',
            'Intraday timeline',
            'Capital flow',
            'WebSocket push',
          ],
        },
        {
          title: 'Trading & Orders',
          count: '14+',
          desc: 'Submit, replace, and withdraw orders. Track positions, balance, and execution history',
          items: ['Submit orders', 'Modify & cancel', 'Positions & balance', 'Execution history', 'Order status push'],
        },
        {
          title: 'Derivatives',
          count: '8+',
          desc: 'Full option chains with Greeks, warrants listing, and real-time derivative quotes',
          items: ['Option chains + Greeks', 'Warrant filtering', 'Issuer directory', 'Derivative quotes'],
        },
        {
          title: 'Financial Research',
          count: '7+',
          desc: 'Financial statements, valuation metrics, dividend history, EPS forecasts, analyst ratings',
          items: ['Financial statements', 'Valuation metrics', 'Dividend history', 'EPS forecasts', 'Analyst ratings'],
        },
        {
          title: 'Content & News',
          count: '8+',
          desc: 'Real-time news feeds, community discussions, topics, and engagement metrics',
          items: ['News feeds', 'Community topics', 'Discussions', 'Engagement data'],
        },
      ],
    },
    sdk: {
      eyebrow: 'OpenAPI SDK',
      title: 'Production-grade SDKs with real-time streaming.',
      desc: '7 SDKs built on a shared Rust core — subscribe to live data, place orders, and monitor positions with async/await patterns and built-in rate limiting.',
      feats: [
        { h: 'Multi-Market', body: 'US · HK · SG · CN (SH/SZ) — stocks, ETFs, options, warrants.' },
        {
          h: 'Free & Paper Trading',
          body: 'No additional API charges. Paper trading with real market data, no securities account required.',
          strong: '$0 API charges',
        },
        {
          h: 'Real-time Push',
          body: 'WebSocket push for <a href="https://longbridge.com/markets">quotes</a>, order depth, trades, and order status — &lt;60 ms latency.',
        },
        {
          h: 'OAuth 2.0 + Async',
          body: 'Automatic token management with modern async/await patterns and built-in rate control.',
        },
      ],
      cta: 'SDK Documentation',
    },
    getstarted: {
      eyebrow: 'Get started',
      title: 'Get started in minutes',
      desc: 'Set up your environment, authenticate, and make your first API call — everything you need to go from zero to live data.',
      items: [
        {
          title: 'Authentication setup',
          desc: 'Register an OAuth 2.0 client, obtain credentials, and configure your SDK with automatic token management.',
          cta: 'Setup guide',
        },
        {
          title: 'API Reference',
          desc: 'Browse 100+ endpoints for quotes, trading, portfolio, and content. Try requests directly in the browser.',
          cta: 'Explore APIs',
        },
        {
          title: 'Install CLI',
          desc: 'One-line install for macOS, Linux, and Windows. 130+ commands with interactive TUI and JSON output.',
          cta: 'Install now',
        },
      ],
    },
    cta: {
      title: 'Build smarter financial tools with real-time data and AI.',
      btn1: 'Get started',
      btn2: 'See pricing',
    },
  },
  'zh-CN': {
    hero: {
      eyebrow: 'LONGBRIDGE OPENAPI',
      title1: '实时市场数据',
      title2: 'AI 直连真实市场',
      desc: '实时行情、量化研究与 AI 驱动分析——通过 AI Skill、CLI、MCP、SDK 和 OpenAPI 一体接入。一套凭证，覆盖所有市场，零额外开销。探索覆盖全球市场的<a href="https://longbridge.com/markets" target="_blank" rel="noreferrer">实时行情</a>。',
      cta1: '开始使用',
      cta2: '阅读文档',
      highlights: [
        { u: '个市场', d: 'US · HK · SG · CN' },
        { u: '个 SDK', d: 'Python · Rust · Node · Go · Java · C · C++' },
        { u: '+ 个接口', d: '行情 · 交易 · 研究 · 资讯' },
        { u: 'OpenAPI 接入费', d: '集成账户免费' },
      ],
    },
    channels: {
      eyebrow: '官方集成 · 现已上线',
      title: 'ChatGPT × Claude',
      tagline: '让 AI 读懂市场。',
      subtitle:
        '<span class="k k-lb">Longbridge</span> 已上架 <span class="k k-gpt">ChatGPT Apps</span> 与 <span class="k k-claude">Claude Connectors</span> —— 查行情、筛股票、看持仓，OAuth 授权即用，无需 API Key。',
      partners: [
        {
          key: 'chatgpt',
          brand: 'ChatGPT',
          cta: '在 ChatGPT 打开',
        },
        {
          key: 'claude',
          brand: 'Claude',
          cta: '添加 Claude Connector',
        },
      ],
    },
    features: {
      eyebrow: '功能特性',
      title: '一切所需，涵盖行情分析、量化研究与智能交易',
      cta: '查看全部',
    },
    products: [
      {
        label: 'AI Skill',
        title: '为任意 AI 打造的投资分析 Agent',
        desc: '在 ChatGPT Apps 中通过 @longbridge 使用 Longbridge，也可为 Claude、Cursor、Gemini、Codex、Zed、Cherry Studio 提供实时市场智能。',
        tags: ['Agent Skills'],
      },
      {
        label: 'CLI',
        title: '面向交易的 AI 原生终端',
        desc: '交互式 TUI 仪表盘、130+ 条命令，以及用于脚本和 AI Agent 集成的 --format json 输出。OAuth 2.0 支持 SSH 和无头服务器。',
        tags: ['130+ 命令', '--format json', 'TUI'],
      },
      {
        label: 'MCP',
        title: 'ChatGPT App + 托管 MCP',
        desc: '官方 ChatGPT App，加上面向 Codex、Claude Code、Cursor、Zed、Cherry Studio 的托管 OAuth 2.1 MCP。',
        tags: ['ChatGPT App', 'OAuth 2.1'],
      },
      {
        label: 'SDK',
        title: '7 种语言，共用 Rust 内核',
        desc: '几分钟内获取第一个报价。Python、Node.js、Rust、Go、Java、C、C++——支持异步模式与内置限速控制。',
        tags: ['Python', 'Rust', 'Go', '+ 4'],
      },
      {
        label: '模拟交易',
        title: '零成本沙盒环境',
        desc: '用真实市场数据测试订单——基于实时买卖价差进行模拟撮合。无需证券账户。',
        tags: ['沙盒', '零成本'],
      },
      {
        label: 'LLM 就绪',
        title: '专为检索与 RAG 构建',
        desc: '符合 llms.txt 标准，每篇文档均提供 .md 格式供 RAG 流水线使用，longbridge.com 支持 Accept: text/markdown 请求头。',
        tags: ['Markdown', 'llms.txt'],
      },
    ],
    cli: {
      eyebrow: 'Longbridge CLI',
      title: 'AI 原生命令行工具，覆盖所有 OpenAPI',
      feats: [
        ['130+ 条命令', '<a href="https://longbridge.com/markets">行情</a>、交易、基本面——全在终端中触手可及。'],
        ['--format json 输出', '可直接管道传输给 jq、awk 或任意 AI Agent 工具通道。'],
        ['多周期 K 线', '日线、小时线、15 分钟、5 分钟、1 分钟——一个参数搞定。'],
        ['投资组合盈亏视图', '持仓明细及配置占比下钻分析。'],
        ['SSH 环境 OAuth 2.0', '支持无头服务器和 Docker 容器内运行。'],
      ],
      cta: 'CLI 文档',
    },
    ai: {
      eyebrow: 'AI Skill · 预打包工具',
      title1: '为你的 AI 解锁市场洞察、',
      title2: '深度研究与智能交易',
      desc: '在 ChatGPT 中打开 <a href="https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef">Longbridge ChatGPT App</a>，授权后用 <code>@longbridge</code> 调用。其他 AI 助手可通过 Longbridge Skill <a href="https://longbridge.com/screener">筛选股票</a>、解读财报、追踪内部人交易和下单。',
      installLabel: '复制发给任意 AI，它会引导你完成安装：',
      installCmd: `请按照以下指南安装 Longbridge AI toolkit：\nhttps://open.longbridge.com/skill/install.md\n\n安装完成后，完成登录授权，查询一支股票行情确认可用。`,
      installOr: '—— 或通过包管理器 ——',
      agentMore: '+ 任意兼容 Skill 的 Agent',
      cta: '浏览 Skill 目录',
    },
    mcp: {
      eyebrow: '托管 MCP',
      title: '无需 API Key，让 ChatGPT 和 AI 助手连接实时市场数据',
      desc: '打开 <a href="https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef">Longbridge ChatGPT App</a>，完成授权后用 <code>@longbridge</code> 调用。其他 AI 客户端可通过托管 HTTP MCP 和 OAuth 2.1 接入。',
      cta: 'MCP 文档',
      note: '优先使用 ChatGPT Apps；其他客户端首次使用时通过 OAuth 2.1 授权，无需 API Key。',
    },
    apiCaps: {
      eyebrow: 'API 功能',
      title: '覆盖每个投资工作流的实时数据与交易能力',
      items: [
        {
          title: '行情数据',
          count: '30+',
          desc: '实时报价、买卖盘深度、K 线、分时、资金流向及推送订阅',
          items: ['实时报价', '买卖盘深度', 'K 线图', '分时数据', '资金流向', 'WebSocket 推送'],
        },
        {
          title: '交易与订单',
          count: '14+',
          desc: '提交、修改与撤销订单。追踪持仓、余额及成交历史',
          items: ['提交订单', '修改与撤单', '持仓与余额', '成交历史', '订单状态推送'],
        },
        {
          title: '衍生品',
          count: '8+',
          desc: '完整期权链含希腊字母、权证列表及实时衍生品报价',
          items: ['期权链 + 希腊字母', '权证筛选', '发行商目录', '衍生品报价'],
        },
        {
          title: '金融研究',
          count: '7+',
          desc: '财务报表、估值指标、分红历史、EPS 预测、分析师评级',
          items: ['财务报表', '估值指标', '分红历史', 'EPS 预测', '分析师评级'],
        },
        {
          title: '内容与资讯',
          count: '8+',
          desc: '实时新闻推送、社区讨论、话题及互动数据',
          items: ['新闻推送', '社区话题', '讨论帖', '互动数据'],
        },
      ],
    },
    sdk: {
      eyebrow: 'OpenAPI SDK',
      title: '生产级 SDK，支持实时流式数据',
      desc: '7 个 SDK 共享 Rust 内核——订阅实时数据、下达订单、监控持仓，支持 async/await 模式与内置限速控制。',
      feats: [
        { h: '多市场覆盖', body: 'US · HK · SG · CN（沪深）——股票、ETF、期权、权证。' },
        {
          h: '免费及模拟交易',
          body: '无额外 API 费用。用真实市场数据进行模拟交易，无需证券账户。',
          strong: '零 API 费用',
        },
        {
          h: '实时推送',
          body: 'WebSocket 推送<a href="https://longbridge.com/markets">报价</a>、买卖盘深度、成交及订单状态，延迟 &lt; 60 ms。',
        },
        { h: 'OAuth 2.0 + 异步', body: '自动令牌管理，支持现代 async/await 模式及内置限速控制。' },
      ],
      cta: 'SDK 文档',
    },
    getstarted: {
      eyebrow: '开始使用',
      title: '几分钟内快速上手',
      desc: '搭建环境、完成认证、发起第一个 API 调用——从零到实时数据，所有步骤一应俱全。',
      items: [
        { title: '认证配置', desc: '注册 OAuth 2.0 客户端，获取凭证，并配置 SDK 的自动令牌管理。', cta: '配置指南' },
        {
          title: 'API 参考',
          desc: '浏览 100+ 个行情、交易、投资组合和内容接口，直接在浏览器中调试请求。',
          cta: '探索 API',
        },
        {
          title: '安装 CLI',
          desc: '支持 macOS、Linux 和 Windows 一行安装。130+ 条命令，含交互式 TUI 与 JSON 输出。',
          cta: '立即安装',
        },
      ],
    },
    cta: {
      title: '用实时数据与 AI 构建更智能的金融工具',
      btn1: '开始使用',
      btn2: '查看定价',
    },
  },
  'zh-HK': {
    hero: {
      eyebrow: 'LONGBRIDGE OPENAPI',
      title1: '即時市場數據，',
      title2: 'AI 直連真實市場',
      desc: '即時行情、量化研究與 AI 驅動分析——透過 AI Skill、CLI、MCP、SDK 和 OpenAPI 一體接入。一套憑證，覆蓋所有市場，零額外開銷。探索覆蓋全球市場的<a href="https://longbridge.com/markets" target="_blank" rel="noreferrer">即時行情</a>。',
      cta1: '開始使用',
      cta2: '閱讀文件',
      highlights: [
        { u: '個市場', d: 'US · HK · SG · CN' },
        { u: '個 SDK', d: 'Python · Rust · Node · Go · Java · C · C++' },
        { u: '+ 個接口', d: '行情 · 交易 · 研究 · 資訊' },
        { u: 'OpenAPI 接入費', d: '整合帳戶免費' },
      ],
    },
    channels: {
      eyebrow: '官方整合 · 現已上線',
      title: 'ChatGPT × Claude',
      tagline: '讓 AI 讀懂市場。',
      subtitle:
        '<span class="k k-lb">Longbridge</span> 已上架 <span class="k k-gpt">ChatGPT Apps</span> 與 <span class="k k-claude">Claude Connectors</span> —— 查行情、篩股票、看持倉，OAuth 授權即用，無需 API Key。',
      partners: [
        {
          key: 'chatgpt',
          brand: 'ChatGPT',
          cta: '在 ChatGPT 開啟',
        },
        {
          key: 'claude',
          brand: 'Claude',
          cta: '加入 Claude Connector',
        },
      ],
    },
    features: {
      eyebrow: '功能特性',
      title: '一切所需，涵蓋行情分析、量化研究與智能交易',
      cta: '查看全部',
    },
    products: [
      {
        label: 'AI Skill',
        title: '為任意 AI 打造的投資分析 Agent',
        desc: '在 ChatGPT Apps 中透過 @longbridge 使用 Longbridge，也可為 Claude、Cursor、Gemini、Codex、Zed、Cherry Studio 提供即時市場智能。',
        tags: ['Agent Skills'],
      },
      {
        label: 'CLI',
        title: '面向交易的 AI 原生終端',
        desc: '互動式 TUI 儀表板、130+ 條命令，以及用於腳本和 AI Agent 整合的 --format json 輸出。OAuth 2.0 支援 SSH 和無頭伺服器。',
        tags: ['130+ 命令', '--format json', 'TUI'],
      },
      {
        label: 'MCP',
        title: 'ChatGPT App + 託管 MCP',
        desc: '官方 ChatGPT App，加上面向 Codex、Claude Code、Cursor、Zed、Cherry Studio 的託管 OAuth 2.1 MCP。',
        tags: ['ChatGPT App', 'OAuth 2.1'],
      },
      {
        label: 'SDK',
        title: '7 種語言，共用 Rust 核心',
        desc: '幾分鐘內獲取第一個報價。Python、Node.js、Rust、Go、Java、C、C++——支援非同步模式與內建限速控制。',
        tags: ['Python', 'Rust', 'Go', '+ 4'],
      },
      {
        label: '模擬交易',
        title: '零成本沙盒環境',
        desc: '用真實市場數據測試訂單——基於即時買賣價差進行模擬撮合。無需證券帳戶。',
        tags: ['沙盒', '零成本'],
      },
      {
        label: 'LLM 就緒',
        title: '專為檢索與 RAG 構建',
        desc: '符合 llms.txt 標準，每篇文件均提供 .md 格式供 RAG 流水線使用，longbridge.com 支援 Accept: text/markdown 請求頭。',
        tags: ['Markdown', 'llms.txt'],
      },
    ],
    cli: {
      eyebrow: 'Longbridge CLI',
      title: 'AI 原生命令列工具，覆蓋所有 OpenAPI',
      feats: [
        ['130+ 條命令', '<a href="https://longbridge.com/markets">行情</a>、交易、基本面——全在終端中觸手可及。'],
        ['--format json 輸出', '可直接管道傳輸給 jq、awk 或任意 AI Agent 工具通道。'],
        ['多週期 K 線', '日線、小時線、15 分鐘、5 分鐘、1 分鐘——一個參數搞定。'],
        ['投資組合盈虧視圖', '持倉明細及配置佔比下鑽分析。'],
        ['SSH 環境 OAuth 2.0', '支援無頭伺服器和 Docker 容器內運行。'],
      ],
      cta: 'CLI 文件',
    },
    ai: {
      eyebrow: 'AI Skill · 預打包工具',
      title1: '為你的 AI 解鎖市場洞察、',
      title2: '深度研究與智能交易',
      desc: '在 ChatGPT 中打開 <a href="https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef">Longbridge ChatGPT App</a>，授權後用 <code>@longbridge</code> 調用。其他 AI 助手可透過 Longbridge Skill <a href="https://longbridge.com/screener">篩選股票</a>、解讀財報、追蹤內部人交易和下單。',
      installLabel: '複製發給任意 AI，它會引導你完成安裝：',
      installCmd: `請按照以下指南安裝 Longbridge AI toolkit：\nhttps://open.longbridge.com/skill/install.md\n\n安裝完成後，完成登錄授權，查詢一支股票行情確認可用。`,
      installOr: '—— 或透過套件管理器 ——',
      agentMore: '+ 任意相容 Skill 的 Agent',
      cta: '瀏覽 Skill 目錄',
    },
    mcp: {
      eyebrow: '託管 MCP',
      title: '無需 API Key，讓 ChatGPT 和 AI 助手連接即時市場數據',
      desc: '打開 <a href="https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef">Longbridge ChatGPT App</a>，完成授權後用 <code>@longbridge</code> 調用。其他 AI 客戶端可透過託管 HTTP MCP 和 OAuth 2.1 接入。',
      cta: 'MCP 文件',
      note: '優先使用 ChatGPT Apps；其他客戶端首次使用時透過 OAuth 2.1 授權，無需 API Key。',
    },
    apiCaps: {
      eyebrow: 'API 功能',
      title: '覆蓋每個投資工作流的即時數據與交易能力',
      items: [
        {
          title: '行情數據',
          count: '30+',
          desc: '即時報價、買賣盤深度、K 線、分時、資金流向及推送訂閱',
          items: ['即時報價', '買賣盤深度', 'K 線圖', '分時數據', '資金流向', 'WebSocket 推送'],
        },
        {
          title: '交易與訂單',
          count: '14+',
          desc: '提交、修改與撤銷訂單。追蹤持倉、餘額及成交歷史',
          items: ['提交訂單', '修改與撤單', '持倉與餘額', '成交歷史', '訂單狀態推送'],
        },
        {
          title: '衍生品',
          count: '8+',
          desc: '完整期權鏈含希臘字母、權證列表及即時衍生品報價',
          items: ['期權鏈 + 希臘字母', '權證篩選', '發行商目錄', '衍生品報價'],
        },
        {
          title: '金融研究',
          count: '7+',
          desc: '財務報表、估值指標、股息歷史、EPS 預測、分析師評級',
          items: ['財務報表', '估值指標', '股息歷史', 'EPS 預測', '分析師評級'],
        },
        {
          title: '內容與資訊',
          count: '8+',
          desc: '即時新聞推送、社群討論、話題及互動數據',
          items: ['新聞推送', '社群話題', '討論帖', '互動數據'],
        },
      ],
    },
    sdk: {
      eyebrow: 'OpenAPI SDK',
      title: '生產級 SDK，支援即時串流數據',
      desc: '7 個 SDK 共享 Rust 核心——訂閱即時數據、下達訂單、監控持倉，支援 async/await 模式與內建限速控制。',
      feats: [
        { h: '多市場覆蓋', body: 'US · HK · SG · CN（滬深）——股票、ETF、期權、權證。' },
        {
          h: '免費及模擬交易',
          body: '無額外 API 費用。用真實市場數據進行模擬交易，無需證券帳戶。',
          strong: '零 API 費用',
        },
        {
          h: '即時推送',
          body: 'WebSocket 推送<a href="https://longbridge.com/markets">報價</a>、買賣盤深度、成交及訂單狀態，延遲 &lt; 60 ms。',
        },
        { h: 'OAuth 2.0 + 非同步', body: '自動令牌管理，支援現代 async/await 模式及內建限速控制。' },
      ],
      cta: 'SDK 文件',
    },
    getstarted: {
      eyebrow: '開始使用',
      title: '幾分鐘內快速上手',
      desc: '搭建環境、完成認證、發起第一個 API 呼叫——從零到即時數據，所有步驟一應俱全。',
      items: [
        { title: '認證配置', desc: '註冊 OAuth 2.0 客戶端，獲取憑證，並配置 SDK 的自動令牌管理。', cta: '配置指南' },
        {
          title: 'API 參考',
          desc: '瀏覽 100+ 個行情、交易、投資組合和內容接口，直接在瀏覽器中偵錯請求。',
          cta: '探索 API',
        },
        {
          title: '安裝 CLI',
          desc: '支援 macOS、Linux 和 Windows 一行安裝。130+ 條命令，含互動式 TUI 與 JSON 輸出。',
          cta: '立即安裝',
        },
      ],
    },
    cta: {
      title: '用即時數據與 AI 構建更智慧的金融工具',
      btn1: '開始使用',
      btn2: '查看定價',
    },
  },
}

const content = computed(() => LOCALE[lang.value as keyof typeof LOCALE] ?? LOCALE.en)

const heroHighlights = computed(() => {
  const vs = ['4', '7', '100+', '$0']
  return content.value.hero.highlights.map((h, i) => ({ ...h, v: vs[i] }))
})
const products = computed(() => PRODUCTS.map((p, i) => ({ ...p, ...(content.value.products[i] ?? {}) })))
const apiCaps = computed(() => API_CAPS.map((c, i) => ({ ...c, ...(content.value.apiCaps.items[i] ?? {}) })))
const getstarted = computed(() => GETSTARTED.map((g, i) => ({ ...g, ...(content.value.getstarted.items[i] ?? {}) })))

// CLI OS tab
const cliOs = ref('macOS')
const installCmds: Record<string, string> = {
  macOS: 'brew install --cask longbridge/tap/longbridge-terminal',
  Linux: 'curl -sSL https://open.longbridge.com/longbridge/longbridge-terminal/install | sh',
  Windows: 'iwr https://open.longbridge.com/longbridge/longbridge-terminal/install.ps1 | iex',
}

// SDK section
const sdkLang = ref('Python')
const sdkTab = ref('Get Quote')

const SDK_LANGUAGES = [
  { name: 'Python', installer: 'pip', cmd: 'pip3 install longbridge', color: '#3776AB' },
  { name: 'Rust', installer: 'cargo', cmd: 'cargo add longbridge', color: '#CE422B' },
  { name: 'Node.js', installer: 'bun', cmd: 'bun add longbridge', color: '#339933' },
  { name: 'Go', installer: 'go', cmd: 'go get github.com/longbridge/openapi-go', color: '#00ADD8' },
  { name: 'Java', installer: 'maven', cmd: 'mvn install io.github.longbridge:openapi-sdk', color: '#E76F00' },
  { name: 'C++', installer: 'cmake', cmd: 'find_package(longbridge REQUIRED)', color: '#00599C' },
]

const SDK_SAMPLES: Record<string, Record<string, string>> = {
  'Get Quote': {
    Python: `from longbridge.openapi import QuoteContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(
    lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)

resp = ctx.quote(["AAPL.US", "TSLA.US", "NVDA.US", "GOOG.US"])
print(resp)`,
    'Node.js': `const { Config, QuoteContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id',
    (_, url) => console.log('Open:', url))
  const config = Config.fromOAuth(oauth)
  const ctx = QuoteContext.new(config)
  const resp = await ctx.quote(['AAPL.US', 'TSLA.US', 'NVDA.US'])
  for (const obj of resp) console.log(obj.toString())
}
main().catch(console.error)`,
    Rust: `use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, quote::QuoteContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id")
        .build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = QuoteContext::new(config);
    let resp = ctx.quote(["AAPL.US", "TSLA.US"]).await?;
    println!("{:?}", resp);
    Ok(())
}`,
    Go: `conf, _ := config.New(config.WithOAuthClient(o))
qctx, _ := quote.NewFromCfg(conf)
defer qctx.Close()
quotes, _ := qctx.Quote(context.Background(),
  []string{"AAPL.US", "TSLA.US", "NVDA.US"})
fmt.Printf("%+v\\n", quotes[0])`,
    Java: `try (Config config = Config.fromOAuth(oauth);
     QuoteContext ctx = QuoteContext.create(config)) {
    SecurityQuote[] resp = ctx.getQuote(
        new String[]{"AAPL.US", "TSLA.US"}).get();
    for (SecurityQuote q : resp) System.out.println(q);
}`,
    'C++': `Config config = Config::from_oauth(oauth);
QuoteContext ctx = QuoteContext::create(config);
ctx.quote({"AAPL.US", "TSLA.US"}, [](auto res) {
    for (const auto& q : *res)
        std::cout << q.symbol << " "
                  << (double)q.last_done << std::endl;
});`,
  },
  'Place Order': {
    Python: `from decimal import Decimal
from longbridge.openapi import (
    TradeContext, Config, OrderType,
    OrderSide, TimeInForceType, OAuthBuilder)

oauth = OAuthBuilder("your-client-id").build(
    lambda url: print("Visit:", url))
ctx = TradeContext(Config.from_oauth(oauth))

resp = ctx.submit_order(
    "AAPL.US", OrderType.LO, OrderSide.Buy,
    Decimal(100), TimeInForceType.Day,
    submitted_price=Decimal(250))
print(resp)`,
    'Node.js': `const { Config, TradeContext, OAuth,
  OrderType, OrderSide, TimeInForceType } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id',
    (_, url) => console.log('Open:', url))
  const ctx = TradeContext.new(Config.fromOAuth(oauth))
  const resp = await ctx.submitOrder({
    symbol: 'AAPL.US', orderType: OrderType.LO,
    side: OrderSide.Buy, submittedQuantity: 100,
    submittedPrice: 250, timeInForce: TimeInForceType.Day })
  console.log(resp)
}
main().catch(console.error)`,
    Rust: `use longbridge::{trade::{TradeContext, SubmitOrderOptions,
    OrderType, OrderSide, TimeInForceType}, Config};
use rust_decimal::Decimal;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = TradeContext::new(config);
    let resp = ctx.submit_order(
        SubmitOrderOptions::new("AAPL.US", OrderType::LO,
            OrderSide::Buy, Decimal::from(100),
            TimeInForceType::Day)
            .submitted_price(Decimal::from(250))
    ).await?;
    println!("{:?}", resp);
    Ok(())
}`,
    Go: `tctx, _ := trade.NewFromCfg(conf)
orderID, _ := tctx.SubmitOrder(ctx, &trade.SubmitOrder{
    Symbol: "AAPL.US", OrderType: trade.OrderTypeLO,
    Side: trade.OrderSideBuy, SubmittedQuantity: 100,
    SubmittedPrice: decimal.NewFromFloat(250),
    TimeInForce: trade.TimeTypeDay })
fmt.Println("order_id:", orderID)`,
    Java: `SubmitOrderResponse resp = ctx.submitOrder(
    new SubmitOrderOptions("AAPL.US", OrderType.LO,
        OrderSide.Buy, new BigDecimal("100"),
        TimeInForceType.Day)
        .setSubmittedPrice(new BigDecimal("250"))).get();
System.out.println(resp.orderId);`,
    'C++': `Config config = Config::from_oauth(oauth);
TradeContext ctx = TradeContext::create(config);
SubmitOrderOptions opts{"AAPL.US", OrderType::LO,
    OrderSide::Buy, 100, TimeInForceType::Day,
    Decimal(250.0)};
ctx.submit_order(opts, [](auto res) {
    std::cout << "order_id: " << res->order_id << std::endl;
});`,
  },
  'Subscribe Push': {
    Python: `from longbridge.openapi import QuoteContext, Config, SubType, PushQuote

def on_quote(symbol: str, event: PushQuote):
    print(symbol, event)

oauth = OAuthBuilder("your-client-id").build(
    lambda url: print("Visit:", url))
ctx = QuoteContext(Config.from_oauth(oauth))
ctx.set_on_quote(on_quote)
ctx.subscribe(["AAPL.US", "TSLA.US"], [SubType.Quote])`,
    'Node.js': `const { Config, QuoteContext, OAuth, SubType } = require('longbridge')

async function main() {
  const oauth = await OAuth.build("your-client-id",
    (_, url) => console.log("Open:", url))
  const ctx = QuoteContext.new(Config.fromOAuth(oauth))
  ctx.setOnQuote((event) => console.log(event))
  await ctx.subscribe(["AAPL.US", "TSLA.US"], [SubType.Quote], true)
  await new Promise(r => setTimeout(r, 30000))
}
main().catch(console.error)`,
    Rust: `use longbridge::{quote::{QuoteContext, SubFlags}, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, mut rx) = QuoteContext::new(config);
    ctx.subscribe(
        vec!["AAPL.US".into(), "TSLA.US".into()],
        SubFlags::QUOTE, true,
    ).await?;
    while let Some(event) = rx.recv().await {
        println!("{:?}", event);
    }
    Ok(())
}`,
    Go: `qctx, _ := quote.NewFromCfg(conf)
qctx.OnQuote(func(e *quote.PushQuote) {
    fmt.Println(e.Symbol) })
qctx.Subscribe(ctx, []string{"AAPL.US", "TSLA.US"},
    []quote.SubType{quote.SubTypeQuote}, true)
select {}`,
    Java: `ctx.setOnQuote(event -> System.out.println(event));
ctx.subscribe(new String[]{"AAPL.US", "TSLA.US"},
    new SubType[]{SubType.Quote}, true).get();
Thread.sleep(30000);`,
    'C++': `ctx.set_on_quote([](auto e) {
    std::cout << e->symbol << std::endl; });
ctx.subscribe({"AAPL.US", "TSLA.US"},
    SubFlags::QUOTE(), true, [](auto) {});`,
  },
  'Account Balance': {
    Python: `from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(
    lambda url: print("Visit:", url))
ctx = TradeContext(Config.from_oauth(oauth))
resp = ctx.account_balance()
for b in resp:
    print(b.currency, b.net_assets, b.buy_power)`,
    'Node.js': `const { Config, TradeContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id',
    (_, url) => console.log('Open:', url))
  const ctx = TradeContext.new(Config.fromOAuth(oauth))
  const resp = await ctx.accountBalance()
  for (const obj of resp) console.log(obj.toString())
}
main().catch(console.error)`,
    Rust: `use longbridge::{trade::TradeContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = TradeContext::new(config);
    let resp = ctx.account_balance(None).await?;
    println!("{:?}", resp);
    Ok(())
}`,
    Go: `tctx, _ := trade.NewFromCfg(conf)
resp, _ := tctx.AccountBalance(ctx,
    &trade.GetAccountBalance{})
for _, b := range resp {
    fmt.Printf("%s: %s\\n", b.Currency, b.NetAssets)
}`,
    Java: `AccountBalance[] resp = ctx.getAccountBalance().get();
for (AccountBalance obj : resp)
    System.out.println(obj);`,
    'C++': `ctx.account_balance([](auto res) {
    for (const auto& b : *res)
        std::cout << b.currency << " "
                  << b.net_assets << std::endl;
});`,
  },
}

const currentSdkSample = computed(() => SDK_SAMPLES[sdkTab.value]?.[sdkLang.value] ?? '')
const currentSdkLang = computed(() => SDK_LANGUAGES.find((l) => l.name === sdkLang.value))

const fileExt: Record<string, string> = {
  Python: 'py',
  'Node.js': 'js',
  Rust: 'rs',
  Go: 'go',
  Java: 'java',
  'C++': 'cpp',
}

function escHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const PY_KEYWORDS = new Set([
  'from',
  'import',
  'def',
  'class',
  'for',
  'while',
  'if',
  'elif',
  'else',
  'in',
  'not',
  'and',
  'or',
  'is',
  'True',
  'False',
  'None',
  'return',
  'with',
  'as',
  'async',
  'await',
  'try',
  'except',
  'raise',
  'pass',
  'break',
  'continue',
  'lambda',
  'yield',
  'print',
  'len',
])

function highlightPython(code: string): string {
  let out = '',
    i = 0
  while (i < code.length) {
    const ch = code[i]
    if (/^[fFbBrR]$/.test(ch) && (code[i + 1] === '"' || code[i + 1] === "'")) {
      const prefix = ch
      i++
      const q = code[i]
      let s = prefix + q
      i++
      while (i < code.length && code[i] !== q) {
        if (code[i] === '\\') {
          s += code[i++]
        }
        s += code[i] || ''
        i++
      }
      s += code[i] || ''
      i++
      out += `<span class="ln-str">${escHtml(s)}</span>`
      continue
    }
    if (ch === '"' || ch === "'") {
      const q = ch
      let s = q
      i++
      while (i < code.length && code[i] !== q) {
        if (code[i] === '\\') {
          s += code[i++]
        }
        s += code[i] || ''
        i++
      }
      s += code[i] || ''
      i++
      out += `<span class="ln-str">${escHtml(s)}</span>`
      continue
    }
    if (ch === '#') {
      out += `<span class="ln-comment">${escHtml(code.slice(i))}</span>`
      break
    }
    if (/\d/.test(ch)) {
      let n = ''
      while (i < code.length && /[\d._]/.test(code[i])) n += code[i++]
      out += `<span class="ln-num">${escHtml(n)}</span>`
      continue
    }
    if (/[a-zA-Z_]/.test(ch)) {
      let w = ''
      while (i < code.length && /[a-zA-Z0-9_]/.test(code[i])) w += code[i++]
      if (PY_KEYWORDS.has(w)) out += `<span class="ln-key">${w}</span>`
      else if (code[i] === '(') out += `<span class="ln-fn">${escHtml(w)}</span>`
      else out += escHtml(w)
      continue
    }
    out += escHtml(ch)
    i++
  }
  return out
}

const LANG_KEYWORDS: Record<string, Set<string>> = {
  Rust: new Set([
    'use',
    'let',
    'mut',
    'fn',
    'async',
    'await',
    'pub',
    'struct',
    'impl',
    'for',
    'while',
    'if',
    'else',
    'match',
    'return',
    'Ok',
    'Err',
    'Some',
    'None',
    'true',
    'false',
    'Arc',
    'Box',
    'Vec',
    'String',
    'println',
    'tokio',
    'main',
    'mod',
    'type',
    'where',
    'in',
    'move',
    'ref',
    'self',
    'super',
    'crate',
  ]),
  'Node.js': new Set([
    'const',
    'let',
    'var',
    'function',
    'async',
    'await',
    'for',
    'while',
    'if',
    'else',
    'return',
    'new',
    'class',
    'import',
    'from',
    'require',
    'export',
    'default',
    'true',
    'false',
    'null',
    'undefined',
    'console',
    'Promise',
    'of',
    'in',
  ]),
  Go: new Set([
    'func',
    'var',
    'const',
    'type',
    'struct',
    'interface',
    'for',
    'range',
    'if',
    'else',
    'return',
    'defer',
    'go',
    'chan',
    'select',
    'case',
    'default',
    'break',
    'continue',
    'package',
    'import',
    'map',
    'make',
    'append',
    'len',
    'fmt',
    'nil',
    'true',
    'false',
    'error',
  ]),
  Java: new Set([
    'public',
    'private',
    'protected',
    'static',
    'final',
    'class',
    'interface',
    'extends',
    'implements',
    'new',
    'return',
    'void',
    'for',
    'while',
    'if',
    'else',
    'try',
    'catch',
    'throws',
    'import',
    'package',
    'this',
    'super',
    'true',
    'false',
    'null',
    'String',
    'int',
    'long',
    'double',
    'boolean',
    'System',
  ]),
  'C++': new Set([
    'auto',
    'const',
    'void',
    'for',
    'while',
    'if',
    'else',
    'return',
    'new',
    'delete',
    'class',
    'struct',
    'namespace',
    'using',
    'include',
    'template',
    'typename',
    'public',
    'private',
    'protected',
    'std',
    'cout',
    'endl',
    'true',
    'false',
    'nullptr',
    'int',
    'double',
    'float',
    'bool',
    'char',
    'long',
    'unsigned',
  ]),
}

function highlightGeneric(code: string, lang: string): string {
  const keywords = LANG_KEYWORDS[lang] || new Set()
  let out = '',
    i = 0
  while (i < code.length) {
    const ch = code[i]
    // line comment
    if ((ch === '/' && code[i + 1] === '/') || ch === '#') {
      out += `<span class="ln-comment">${escHtml(code.slice(i))}</span>`
      break
    }
    // string
    if (ch === '"' || ch === "'") {
      const q = ch
      let s = q
      i++
      while (i < code.length && code[i] !== q) {
        if (code[i] === '\\') {
          s += code[i++]
        }
        s += code[i] || ''
        i++
      }
      s += code[i] || ''
      i++
      out += `<span class="ln-str">${escHtml(s)}</span>`
      continue
    }
    // number
    if (/\d/.test(ch) && (i === 0 || !/[a-zA-Z_]/.test(code[i - 1]))) {
      let n = ''
      while (i < code.length && /[\d._]/.test(code[i])) n += code[i++]
      out += `<span class="ln-num">${escHtml(n)}</span>`
      continue
    }
    // identifier / keyword
    if (/[a-zA-Z_]/.test(ch)) {
      let w = ''
      while (i < code.length && /[a-zA-Z0-9_]/.test(code[i])) w += code[i++]
      if (keywords.has(w)) out += `<span class="ln-key">${w}</span>`
      else if (code[i] === '(') out += `<span class="ln-fn">${escHtml(w)}</span>`
      else out += escHtml(w)
      continue
    }
    out += escHtml(ch)
    i++
  }
  return out
}

function formatLine(text: string): string {
  if (!text.trim()) return '&nbsp;'
  return sdkLang.value === 'Python' ? highlightPython(text) : highlightGeneric(text, sdkLang.value)
}

const currentSdkLines = computed(() => currentSdkSample.value.split('\n'))

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {}
}

const HERO_HIGHLIGHTS = [
  { v: '4', u: 'markets', d: 'US · HK · SG · CN' },
  { v: '7', u: 'SDKs', d: 'Python · Rust · Node · Go · Java · C · C++' },
  { v: '100+', u: 'endpoints', d: 'Quote · Trade · Research · News' },
  { v: '60ms', u: 'p50 latency', d: 'WebSocket streaming' },
]

const PRODUCTS = [
  {
    key: 'skill',
    icon: 'ai',
    label: 'AI Skill',
    title: 'Investment analysis agent for any AI',
    desc: 'Use Longbridge in ChatGPT Apps with @longbridge, or give Claude, Cursor, Gemini, Codex, Zed, and Cherry Studio live market intelligence.',
    tags: ['Agent Skills'],
    href: '/skill',
    accent: 'var(--lb-brand)',
  },
  {
    key: 'cli',
    icon: 'terminal',
    label: 'CLI',
    title: 'AI-native terminal for trading',
    desc: 'Interactive TUI dashboard, 130+ commands, and --format json output for scripting and AI agent integration. OAuth 2.0 works on SSH and headless servers.',
    tags: ['130+ cmds', '--format json', 'TUI'],
    href: '/docs/cli',
    accent: 'var(--lb-status-alert)',
  },
  {
    key: 'mcp',
    icon: 'bolt',
    label: 'MCP',
    title: 'ChatGPT App + hosted MCP',
    desc: 'Official ChatGPT App plus hosted OAuth 2.1 MCP for Codex, Claude Code, Cursor, Zed, and Cherry Studio.',
    tags: ['ChatGPT App', 'OAuth 2.1'],
    href: '/docs/mcp',
    accent: 'var(--lb-ai-mention)',
  },
  {
    key: 'sdk',
    icon: 'stack',
    label: 'SDK',
    title: '7 languages, one Rust core',
    desc: 'Get your first quote in minutes. Python, Node.js, Rust, Go, Java, C, C++ — with async support and built-in rate control.',
    tags: ['Python', 'Rust', 'Go', '+ 4'],
    href: '/docs',
    accent: 'var(--lb-status-neutral)',
  },
  {
    key: 'paper',
    icon: 'shield',
    label: 'Paper Trading',
    title: 'Sandbox at zero cost',
    desc: 'Test orders with real market data — simulated matching based on live bid-ask spreads. No securities account required.',
    tags: ['Sandbox', 'Zero Cost'],
    href: '/docs',
    accent: 'var(--lb-up)',
  },
  {
    key: 'llm',
    icon: 'book',
    label: 'LLM Ready',
    title: 'Built for retrieval & RAG',
    desc: 'llms.txt standard compliance, every doc available as .md for RAG pipelines, and Accept: text/markdown header support on longbridge.com.',
    tags: ['Markdown', 'llms.txt'],
    href: '/docs',
    accent: 'var(--lb-chart-purple)',
  },
]

const SUPPORTED_AGENTS = [
  { name: 'ChatGPT', initial: 'G', color: '#10A37F' },
  { name: 'Codex', initial: 'O', color: '#000000' },
  { name: 'Claude Code', initial: 'C', color: '#D97757' },
  { name: 'Cursor', initial: 'C', color: '#000000' },
  { name: 'Gemini', initial: 'G', color: '#1A73E8' },
  { name: 'OpenClaw', initial: 'O', color: 'var(--lb-brand)' },
  { name: 'Zed', initial: 'Z', color: '#0E40D9' },
]

const MCP_CLIENTS = ['ChatGPT', 'Codex', 'Claude Code', 'Gemini', 'Cursor', 'Zed']

const API_CAPS = [
  {
    icon: 'chart',
    color: 'var(--lb-status-neutral)',
    link: '/docs/quote/overview',
    title: 'Market Data',
    count: '30+',
    desc: 'Real-time quotes, order depth, candlestick, intraday, capital flow, and push subscriptions',
    items: [
      'Real-time quotes',
      'Order book depth',
      'Candlestick charts',
      'Intraday timeline',
      'Capital flow',
      'WebSocket push',
    ],
  },
  {
    icon: 'shield',
    color: 'var(--lb-brand)',
    link: '/docs/trade/trade-overview',
    title: 'Trading & Orders',
    count: '14+',
    desc: 'Submit, replace, and withdraw orders. Track positions, balance, and execution history',
    items: ['Submit orders', 'Modify & cancel', 'Positions & balance', 'Execution history', 'Order status push'],
  },
  {
    icon: 'bolt',
    color: 'var(--lb-ai-mention)',
    link: '/docs/cli/derivatives/option',
    title: 'Derivatives',
    count: '8+',
    desc: 'Full option chains with Greeks, warrants listing, and real-time derivative quotes',
    items: ['Option chains + Greeks', 'Warrant filtering', 'Issuer directory', 'Derivative quotes'],
  },
  {
    icon: 'book',
    color: 'var(--lb-chart-purple)',
    link: '/docs/cli/fundamentals/financial-report',
    title: 'Financial Research',
    count: '7+',
    desc: 'Financial statements, valuation metrics, dividend history, EPS forecasts, analyst ratings',
    items: ['Financial statements', 'Valuation metrics', 'Dividend history', 'EPS forecasts', 'Analyst ratings'],
  },
  {
    icon: 'globe',
    color: 'var(--lb-status-alert)',
    link: '/docs/content/overview',
    title: 'Content & News',
    count: '8+',
    desc: 'Real-time news feeds, community discussions, topics, and engagement metrics',
    items: ['News feeds', 'Community topics', 'Discussions', 'Engagement data'],
  },
]

const GETSTARTED = [
  {
    key: 'auth',
    icon: 'key',
    title: 'Authentication setup',
    desc: 'Register an OAuth 2.0 client, obtain credentials, and configure your SDK with automatic token management.',
    cta: 'Setup guide',
    href: '/docs/getting-started',
  },
  {
    key: 'api',
    icon: 'book',
    title: 'API Reference',
    desc: 'Browse 100+ endpoints for quotes, trading, portfolio, and content. Try requests directly in the browser.',
    cta: 'Explore APIs',
    href: '/docs',
  },
  {
    key: 'cli',
    icon: 'terminal',
    title: 'Install CLI',
    desc: 'One-line install for macOS, Linux, and Windows. 130+ commands with interactive TUI and JSON output.',
    cta: 'Install now',
    href: '/docs/cli',
  },
]
</script>

<template>
  <div class="page-root">
    <AppNav />

    <!-- ===== Hero ===== -->
    <section class="home-hero home-hero-centered">
      <div class="hero-bg-data" aria-hidden="true">
        <div class="hero-bg-blobs">
          <span class="hero-blob hero-blob-1" />
          <span class="hero-blob hero-blob-2" />
          <span class="hero-blob hero-blob-3" />
          <span class="hero-blob hero-blob-4" />
        </div>
        <div class="hero-bg-dots" />
        <div class="hero-bg-vignette" />
        <div class="hero-bg-horizon" />
      </div>
      <div class="home-hero-inner-centered">
        <span class="eyebrow">{{ content.hero.eyebrow }}</span>
        <h1 class="h-display home-hero-title">
          {{ content.hero.title1 }}<br />
          <span :style="{ color: 'var(--lb-brand)' }">{{ content.hero.title2 }}</span>
        </h1>
        <p class="t-body home-hero-sub" v-html="content.hero.desc"></p>
        <div class="home-hero-cta">
          <a class="btn btn-primary btn-lg" :href="localePath('/docs')">
            {{ content.hero.cta1 }}
            <svg
              width="15"
              height="15"
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
          <a class="btn btn-outline btn-lg" :href="localePath('/docs')">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            {{ content.hero.cta2 }}
          </a>
        </div>
        <div class="home-hero-highlights">
          <template v-for="(h, i) in heroHighlights" :key="i">
            <div class="home-hero-stat">
              <div class="home-hero-stat-line">
                <span class="home-hero-stat-v">{{ h.v }}</span>
                <span class="home-hero-stat-u">{{ h.u }}</span>
              </div>
              <div class="home-hero-stat-d">{{ h.d }}</div>
            </div>
            <span v-if="i < heroHighlights.length - 1" class="home-hero-stat-sep" />
          </template>
        </div>
      </div>
    </section>

    <!-- ===== Available in ChatGPT & Claude ===== -->
    <section class="home-channels">
      <div class="home-channels-grid-bg" aria-hidden="true" />
      <div class="home-channels-glow home-channels-glow--gpt" aria-hidden="true" />
      <div class="home-channels-glow home-channels-glow--claude" aria-hidden="true" />
      <div class="section-inner home-channels-inner">
        <div class="home-channels-head">
          <span class="eyebrow">{{ content.channels.eyebrow }}</span>
          <h2 class="h-section home-channels-title">
            <span class="home-channels-title-line">
              <span class="home-channels-title-brand">
                <span class="home-channels-title-logo home-channels-title-logo--gpt" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
                  </svg>
                </span>
                ChatGPT
              </span>
              <span class="home-channels-title-x" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </span>
              <span class="home-channels-title-brand">
                <span class="home-channels-title-logo home-channels-title-logo--claude" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M4.709 15.955l4.72-2.647.079-.23-.079-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" />
                  </svg>
                </span>
                Claude
              </span>
            </span>
            <span class="home-channels-tagline">{{ content.channels.tagline }}</span>
          </h2>
          <p ref="subtitleRef" class="home-channels-sub" v-html="content.channels.subtitle"></p>
        </div>

        <div class="home-channels-cards">
          <a
            v-for="p in content.channels.partners"
            :key="p.key"
            class="home-channel-card"
            :class="`home-channel-card--${p.key}`"
            :href="p.key === 'chatgpt' ? CHATGPT_APP_URL : CLAUDE_CONNECTOR_URL"
            target="_blank"
            rel="noreferrer">
            <div class="home-channel-card-glow" aria-hidden="true" />
            <div class="home-channel-card-head">
              <span class="home-channel-card-logo" :class="`home-channel-card-logo--${p.key}`">
                <svg v-if="p.key === 'chatgpt'" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path
                    d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path
                    d="M4.709 15.955l4.72-2.647.079-.23-.079-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" />
                </svg>
              </span>
              <div class="home-channel-card-titles">
                <div class="home-channel-card-brand">{{ p.brand }}</div>
              </div>
              <div class="home-channel-card-cta">
                <span>{{ p.cta }}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </div>

          </a>
        </div>
      </div>
    </section>

    <!-- ===== Products matrix ===== -->
    <section class="section">
      <div class="section-inner">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            flex-wrap: wrap;
            gap: 24px;
            margin-bottom: 48px;
          ">
          <div style="max-width: 560px">
            <span class="eyebrow">{{ content.features.eyebrow }}</span>
            <h2 class="h-section" style="margin-top: 16px">{{ content.features.title }}</h2>
          </div>
          <a class="btn btn-ghost" :href="localePath('/docs')">
            {{ content.features.cta }}
            <svg
              width="13"
              height="13"
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
        <div class="products-grid">
          <a
            v-for="p in products"
            :key="p.key"
            :href="localePath(p.href)"
            class="product-card"
            :style="{ '--card-accent': p.accent }">
            <div class="product-card-head">
              <span class="product-card-label" :style="{ color: p.accent }">{{ p.label }}</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
                :style="{ color: 'var(--lb-fg-3)' }">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
            <h3 class="product-card-title">{{ p.title }}</h3>
            <p class="product-card-desc">{{ p.desc }}</p>
            <div class="product-card-tags">
              <span v-for="t in p.tags" :key="t" class="product-card-tag">{{ t }}</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- ===== CLI Spotlight ===== -->
    <section class="section cli-spotlight">
      <div class="section-inner cli-spotlight-grid">
        <div>
          <span class="eyebrow">{{ content.cli.eyebrow }}</span>
          <h2 class="h-section" style="margin-top: 18px">{{ content.cli.title }}</h2>
          <ul class="cli-feat-list">
            <li v-for="[h, d] in content.cli.feats" :key="h">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
                :style="{ color: 'var(--lb-up)' }">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <div>
                <div style="font-weight: 600; color: var(--lb-fg-1); font-size: 14px">{{ h }}</div>
                <div class="t-meta" style="font-size: 13px; margin-top: 2px" v-html="d"></div>
              </div>
            </li>
          </ul>
          <a class="btn btn-outline" :href="localePath('/docs/cli')" style="margin-top: 24px">
            {{ content.cli.cta }}
            <svg
              width="13"
              height="13"
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
        <div class="cli-demo-col">
          <div class="cli-os-tabs">
            <button
              v-for="o in ['macOS', 'Linux', 'Windows']"
              :key="o"
              :class="['cli-os-tab', o === cliOs ? 'is-active' : '']"
              @click="cliOs = o">
              {{ o }}
            </button>
          </div>
          <div class="code" style="margin-top: 12px">
            <div class="code-head">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
                :style="{ color: 'var(--lb-fg-3)' }">
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
              <span style="font-size: 11.5px; color: var(--lb-fg-3)">{{ cliOs.toLowerCase() }} · bash</span>
              <button class="code-copy" title="Copy" @click="copyToClipboard(installCmds[cliOs])">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <rect x="8" y="8" width="13" height="13" rx="2" />
                  <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
                </svg>
              </button>
            </div>
            <div class="code-body">
              <div><span class="ln-prompt">$ </span>{{ installCmds[cliOs] }}</div>
              <div>&nbsp;</div>
              <div><span class="ln-prompt">$ </span>longbridge auth login</div>
              <div style="color: var(--lb-fg-2)">✓ Browser opened. Logged in as jason@longbridge.com</div>
              <div>&nbsp;</div>
              <div>
                <span class="ln-prompt">$ </span>longbridge quote <span class="ln-str">"TSLA.US"</span>
                <span class="ln-str">"NVDA.US"</span> <span class="ln-str">"700.HK"</span>
              </div>
              <div style="color: var(--lb-fg-2)">SYMBOL &nbsp; LAST &nbsp; &nbsp; CHANGE &nbsp; &nbsp;VOLUME</div>
              <div style="color: var(--lb-fg-2)">
                TSLA.US &nbsp; 421.65 &nbsp; <span class="is-up">+2.31%</span> &nbsp; 18.2M
              </div>
              <div style="color: var(--lb-fg-2)">
                NVDA.US &nbsp; 142.83 &nbsp; <span class="is-up">+1.18%</span> &nbsp; 62.7M
              </div>
              <div style="color: var(--lb-fg-2)">
                700.HK &nbsp; &nbsp;528.50 &nbsp; <span class="is-up">+0.86%</span> &nbsp; &nbsp;5.4M
              </div>
              <div>&nbsp;</div>
              <div>
                <span class="ln-prompt">$ </span>longbridge portfolio --format json | jq
                <span class="ln-str">'.positions[] | select(.pnl_pct > 5)'</span>
              </div>
            </div>
          </div>
          <div class="cli-mini-stats">
            <div>
              <span class="num" style="font-weight: 700; font-size: 22px"
                >120<span style="color: var(--lb-fg-3); font-size: 13px">+</span></span
              ><span class="t-meta" style="display: block; font-size: 11.5px">commands</span>
            </div>
            <div>
              <span class="num" style="font-weight: 700; font-size: 22px">7</span
              ><span class="t-meta" style="display: block; font-size: 11.5px">output formats</span>
            </div>
            <div>
              <span class="num" style="font-weight: 700; font-size: 22px">3</span
              ><span class="t-meta" style="display: block; font-size: 11.5px">platforms</span>
            </div>
            <div>
              <span class="num" style="font-weight: 700; font-size: 22px"
                >40<span style="color: var(--lb-fg-3); font-size: 13px">ms</span></span
              ><span class="t-meta" style="display: block; font-size: 11.5px">p50 query</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== AI Spotlight ===== -->
    <section class="section ai-spotlight">
      <div class="section-inner">
        <div class="ai-spotlight-card">
          <div class="ai-spotlight-text">
            <span class="eyebrow" :style="{ color: 'var(--lb-ai-mention)' }">{{ content.ai.eyebrow }}</span>
            <h2 class="h-section" style="margin-top: 18px; color: #fff">
              {{ content.ai.title1 }}<br />{{ content.ai.title2 }}
            </h2>
            <p
              style="
                margin-top: 18px;
                color: rgba(255, 255, 255, 0.66);
                max-width: 520px;
                line-height: 1.65;
                font-size: 15px;
              "
              v-html="content.ai.desc"></p>

            <div class="ai-install-block">
              <div class="ai-install-label">{{ content.ai.installLabel }}</div>
              <div class="ai-install-cmd">
                <pre>
<code>{{ content.ai.installCmd }}</code></pre>
                <button class="code-copy" title="Copy" @click="copyToClipboard(content.ai.installCmd)">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <rect x="8" y="8" width="13" height="13" rx="2" />
                    <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
                  </svg>
                </button>
              </div>
              <div class="ai-install-or">{{ content.ai.installOr }}</div>
              <div class="ai-install-cmd">
                <code
                  ><span :style="{ color: 'var(--lb-ai-mention)' }">$</span> npx skills add longbridge/skills -g</code
                >
                <button class="code-copy" title="Copy" @click="copyToClipboard('npx skills add longbridge/skills -g')">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <rect x="8" y="8" width="13" height="13" rx="2" />
                    <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="ai-agents-row">
              <div v-for="a in SUPPORTED_AGENTS" :key="a.name" class="ai-agent-chip" :title="a.name">
                <span class="ai-agent-mark" :style="{ background: a.color }">{{ a.initial }}</span>
                {{ a.name }}
              </div>
              <div class="ai-agent-chip ai-agent-more">{{ content.ai.agentMore }}</div>
            </div>

            <div style="display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap">
              <a class="btn btn-lg" :href="localePath('/skill')" style="background: #fff; color: #09252a">
                {{ content.ai.cta }}
                <svg
                  width="15"
                  height="15"
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
          </div>

          <div class="ai-spotlight-chat code" style="background: #0a0e19; border: 1px solid rgba(255, 255, 255, 0.08)">
            <div
              class="code-head"
              style="
                background: #141826;
                border-bottom: 1px solid rgba(255, 255, 255, 0.06);
                color: rgba(255, 255, 255, 0.7);
              ">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                :style="{ color: 'var(--lb-ai-mention)' }">
                <path d="M12 2.5 13.4 9.2 20.5 10.5 13.6 12 12 18.5 10.4 12 3.5 10.5 10.6 9.2z" />
              </svg>
              Claude Code · skill: longbridge
              <span style="margin-left: auto; font-size: 11px; color: rgba(255, 255, 255, 0.4)">connected</span>
            </div>
            <div class="ai-chat-body">
              <div class="ai-msg user">
                <div class="ai-msg-text">
                  Pull NVDA's daily chart for the past 6 months and tell me if I should hold my position.
                </div>
              </div>
              <div class="ai-msg assistant">
                <div class="ai-msg-tool">
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    :style="{ color: 'var(--lb-ai-mention)' }">
                    <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
                  </svg>
                  <span>used <code>longbridge-kline</code> · 6mo · daily</span>
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    style="margin-left: auto"
                    :style="{ color: 'var(--lb-up)' }">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div class="ai-msg-tool">
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    :style="{ color: 'var(--lb-ai-mention)' }">
                    <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
                  </svg>
                  <span>used <code>longbridge-positions</code></span>
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    style="margin-left: auto"
                    :style="{ color: 'var(--lb-up)' }">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div class="ai-msg-text" style="color: rgba(255, 255, 255, 0.88)">
                  NVDA broke its 50-day MA on heavy volume
                  <span class="num" :style="{ color: 'var(--lb-ai-mention)' }">3 sessions ago</span>. Your
                  <b>247 shares</b> at avg <b>$127.40</b> are up
                  <span class="is-up num" style="font-weight: 600">+12.1%</span>. Concentration risk is
                  <span :style="{ color: 'var(--lb-status-alert)', fontWeight: '600' }">medium</span> — NVDA is 31% of
                  your portfolio. Consider trimming if it hits $150.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== MCP Section ===== -->
    <section class="section">
      <div class="section-inner mcp-grid">
        <div>
          <span class="eyebrow">{{ content.mcp.eyebrow }}</span>
          <h2 class="h-section" style="margin-top: 18px">{{ content.mcp.title }}</h2>
          <p class="t-body" style="margin-top: 14px; max-width: 520px" v-html="content.mcp.desc"></p>
          <div class="mcp-clients">
            <span v-for="c in MCP_CLIENTS" :key="c" class="mcp-client-pill">
              <span class="mcp-client-dot" />
              {{ c }}
            </span>
          </div>
          <a class="btn btn-outline" style="margin-top: 24px" :href="localePath('/docs/mcp')">
            {{ content.mcp.cta }}
            <svg
              width="13"
              height="13"
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
        <div class="code mcp-code">
          <div class="code-head">
            <span style="display: flex; gap: 6px; align-items: center">
              <span style="width: 10px; height: 10px; border-radius: 999px; background: #ff5f57" />
              <span style="width: 10px; height: 10px; border-radius: 999px; background: #febc2e" />
              <span style="width: 10px; height: 10px; border-radius: 999px; background: #28c840" />
            </span>
            <span style="margin-left: 8px; font-size: 11.5px; color: var(--lb-fg-3)">~/projects/quant — claude</span>
            <button
              class="code-copy"
              @click="copyToClipboard('claude mcp add --transport http longbridge \\\n  https://mcp.longbridge.com')">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round">
                <rect x="8" y="8" width="13" height="13" rx="2" />
                <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
              </svg>
            </button>
          </div>
          <div class="code-body" style="font-size: 13.5px; line-height: 1.8">
            <div><span class="ln-comment"># One-line install for Claude Code</span></div>
            <div><span class="ln-prompt">$ </span>claude mcp add --transport http longbridge \</div>
            <div>&nbsp;&nbsp;<span class="ln-str">https://mcp.longbridge.com</span></div>
            <div>&nbsp;</div>
            <div style="color: var(--lb-fg-2)">→ Opening browser for OAuth 2.1…</div>
            <div style="color: var(--lb-fg-2)">✓ Authenticated as jason@longbridge.com</div>
            <div style="color: var(--lb-fg-2)">✓ Connected · 130 tools available</div>
            <div>&nbsp;</div>
            <div><span class="ln-comment"># Verify the connection</span></div>
            <div><span class="ln-prompt">$ </span>claude mcp list</div>
            <div style="color: var(--lb-fg-2)">
              longbridge &nbsp; <span :style="{ color: 'var(--lb-up)' }">✓ ready</span> &nbsp; 130 tools
            </div>
          </div>
          <div
            style="
              padding: 10px 16px;
              border-top: 1px solid var(--app-card-stroke);
              display: flex;
              align-items: center;
              gap: 8px;
            ">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
              :style="{ color: 'var(--lb-fg-3)' }">
              <circle cx="7" cy="15" r="4" />
              <path d="m10 12 9-9 3 3-3 3 3 3-3 3-3-3-3 3" />
            </svg>
            <span class="t-meta" style="font-size: 11.5px">{{ content.mcp.note }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== API Capabilities ===== -->
    <section
      class="section"
      style="
        background: var(--app-canvas);
        border-top: 1px solid var(--app-card-stroke);
        border-bottom: 1px solid var(--app-card-stroke);
      ">
      <div class="section-inner">
        <div style="max-width: 560px; margin-bottom: 48px">
          <span class="eyebrow">{{ content.apiCaps.eyebrow }}</span>
          <h2 class="h-section" style="margin-top: 16px">{{ content.apiCaps.title }}</h2>
        </div>
        <div class="api-caps-grid">
          <a v-for="c in apiCaps" :key="c.title" :href="localePath(c.link)" class="api-cap-card">
            <div class="api-cap-head">
              <div
                class="api-cap-icon"
                :style="{ background: `color-mix(in srgb, ${c.color} 14%, transparent)`, color: c.color }">
                <!-- icon by name -->
                <svg
                  v-if="c.icon === 'chart'"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                <svg
                  v-else-if="c.icon === 'shield'"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <svg
                  v-else-if="c.icon === 'bolt'"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
                </svg>
                <svg
                  v-else-if="c.icon === 'book'"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                <svg
                  v-else-if="c.icon === 'globe'"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z" />
                </svg>
              </div>
              <span
                class="api-cap-count"
                :style="{ color: c.color, background: `color-mix(in srgb, ${c.color} 12%, transparent)` }"
                >{{ c.count }}</span
              >
            </div>
            <h3 class="h-card" style="margin-top: 18px">{{ c.title }}</h3>
            <p class="t-meta" style="margin-top: 8px; line-height: 1.55">{{ c.desc }}</p>
            <ul class="api-cap-list">
              <li v-for="item in c.items" :key="item">
                <svg width="10" height="10" viewBox="0 0 24 24" :style="{ color: c.color, flexShrink: '0' }">
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                </svg>
                {{ item }}
              </li>
            </ul>
          </a>
        </div>
      </div>
    </section>

    <!-- ===== SDK Section ===== -->
    <section class="section">
      <div class="section-inner">
        <div style="max-width: 640px; margin-bottom: 40px">
          <span class="eyebrow">{{ content.sdk.eyebrow }}</span>
          <h2 class="h-section" style="margin-top: 16px">{{ content.sdk.title }}</h2>
          <p class="t-body" style="margin-top: 14px">{{ content.sdk.desc }}</p>
        </div>

        <div class="sdk-tabs">
          <button
            v-for="l in SDK_LANGUAGES"
            :key="l.name"
            :class="['sdk-tab', l.name === sdkLang ? 'is-active' : '']"
            @click="sdkLang = l.name">
            <span class="sdk-tab-dot" :style="{ background: l.color }" />
            {{ l.name }}
          </button>
        </div>

        <div class="sdk-frame">
          <div class="sdk-frame-l">
            <div class="sdk-action-tabs">
              <button
                v-for="t in Object.keys(SDK_SAMPLES)"
                :key="t"
                :class="['sdk-action-tab', t === sdkTab ? 'is-active' : '']"
                @click="sdkTab = t">
                {{ t }}
              </button>
            </div>
            <div class="code" style="margin-top: 12px; flex: 1; display: flex; flex-direction: column">
              <div class="code-head">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  :style="{ color: 'var(--lb-fg-3)' }">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                <span style="font-size: 11.5px; color: var(--lb-fg-3)"
                  >{{ sdkTab.toLowerCase().replace(/ /g, '_') }}.{{ fileExt[sdkLang] ?? 'py' }}</span
                >
                <button class="code-copy" @click="copyToClipboard(currentSdkSample)">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <rect x="8" y="8" width="13" height="13" rx="2" />
                    <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
                  </svg>
                </button>
              </div>
              <div class="code-body" style="flex: 1">
                <div v-for="(line, idx) in currentSdkLines" :key="idx" v-html="formatLine(line)" />
              </div>
            </div>
            <div class="sdk-install">
              <span
                style="
                  font-size: 11.5px;
                  color: var(--lb-fg-3);
                  text-transform: uppercase;
                  letter-spacing: 0.06em;
                  font-weight: 600;
                "
                >{{ currentSdkLang?.installer }}</span
              >
              <code style="flex: 1; font-family: var(--app-mono); font-size: 13px; color: var(--lb-fg-1)">{{
                currentSdkLang?.cmd
              }}</code>
              <button class="code-copy" @click="copyToClipboard(currentSdkLang?.cmd || '')">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <rect x="8" y="8" width="13" height="13" rx="2" />
                  <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
                </svg>
              </button>
            </div>
          </div>

          <div class="sdk-frame-r">
            <!-- Multi-Market -->
            <div class="sdk-feat">
              <div
                class="sdk-feat-icon"
                style="
                  background: color-mix(in srgb, var(--lb-status-neutral) 14%, transparent);
                  color: var(--lb-status-neutral);
                ">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z" />
                </svg>
              </div>
              <div style="flex: 1; min-width: 0">
                <div class="sdk-feat-h">{{ content.sdk.feats[0].h }}</div>
                <div class="sdk-feat-body">
                  {{ content.sdk.feats[0].body }}
                  <div class="sdk-feat-pills">
                    <span v-for="m in ['US', 'HK', 'SG', 'CN']" :key="m">{{ m }}</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- Free & Paper Trading -->
            <div class="sdk-feat">
              <div
                class="sdk-feat-icon"
                style="background: color-mix(in srgb, var(--lb-up) 14%, transparent); color: var(--lb-up)">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div style="flex: 1; min-width: 0">
                <div class="sdk-feat-h">{{ content.sdk.feats[1].h }}</div>
                <div class="sdk-feat-body">
                  {{ content.sdk.feats[1].body }}
                  <div v-if="content.sdk.feats[1].strong" class="sdk-feat-strong">
                    {{ content.sdk.feats[1].strong }}
                  </div>
                </div>
              </div>
            </div>
            <!-- Real-time Push -->
            <div class="sdk-feat">
              <div
                class="sdk-feat-icon"
                style="
                  background: color-mix(in srgb, var(--lb-ai-mention) 14%, transparent);
                  color: var(--lb-ai-mention);
                ">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
                </svg>
              </div>
              <div style="flex: 1; min-width: 0">
                <div class="sdk-feat-h">{{ content.sdk.feats[2].h }}</div>
                <div class="sdk-feat-body" v-html="content.sdk.feats[2].body"></div>
              </div>
            </div>
            <!-- OAuth 2.0 -->
            <div class="sdk-feat">
              <div
                class="sdk-feat-icon"
                style="
                  background: color-mix(in srgb, var(--lb-chart-purple) 14%, transparent);
                  color: var(--lb-chart-purple);
                ">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <circle cx="7" cy="15" r="4" />
                  <path d="m10 12 9-9 3 3-3 3 3 3-3 3-3-3-3 3" />
                </svg>
              </div>
              <div style="flex: 1; min-width: 0">
                <div class="sdk-feat-h">{{ content.sdk.feats[3].h }}</div>
                <div class="sdk-feat-body">{{ content.sdk.feats[3].body }}</div>
              </div>
            </div>
          </div>
        </div>

        <div style="margin-top: 32px; display: flex; justify-content: center">
          <a class="btn btn-outline btn-lg" :href="localePath('/docs')">
            {{ content.sdk.cta }}
            <svg
              width="14"
              height="14"
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
      </div>
    </section>

    <!-- ===== Get Started ===== -->
    <section class="section" style="border-top: 1px solid var(--app-card-stroke); background: var(--app-canvas)">
      <div class="section-inner">
        <div style="text-align: center; max-width: 640px; margin: 0 auto">
          <span class="eyebrow">{{ content.getstarted.eyebrow }}</span>
          <h2 class="h-section" style="margin-top: 18px">{{ content.getstarted.title }}</h2>
          <p class="t-body" style="margin-top: 14px">{{ content.getstarted.desc }}</p>
        </div>
        <div class="gs-grid">
          <a v-for="(g, i) in getstarted" :key="g.key" class="gs-card" :href="localePath(g.href)">
            <div class="gs-card-step">{{ String(i + 1).padStart(2, '0') }}</div>
            <div class="gs-card-icon-wrap">
              <svg
                v-if="g.icon === 'key'"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round">
                <circle cx="7" cy="15" r="4" />
                <path d="m10 12 9-9 3 3-3 3 3 3-3 3-3-3-3 3" />
              </svg>
              <svg
                v-else-if="g.icon === 'book'"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <svg
                v-else-if="g.icon === 'terminal'"
                width="20"
                height="20"
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
            <h3 class="h-card" style="margin-top: 18px">{{ g.title }}</h3>
            <p class="t-meta" style="margin-top: 8px; line-height: 1.55; flex: 1">{{ g.desc }}</p>
            <span class="product-card-cta">
              {{ g.cta }}
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>

    <!-- ===== Final CTA ===== -->
    <section class="section">
      <div class="section-inner final-cta">
        <h2 class="h-section" style="max-width: 680px">{{ content.cta.title }}</h2>
        <div style="display: flex; gap: 12px; flex-wrap: wrap">
          <a class="btn btn-primary btn-lg" :href="localePath('/docs')">
            {{ content.cta.btn1 }}
            <svg
              width="14"
              height="14"
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
          <a class="btn btn-outline btn-lg" :href="localePath('/pricing')">{{ content.cta.btn2 }}</a>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<style>
.page-root {
  min-height: 100vh;
  background: var(--lb-bg-1);
  color: var(--lb-fg-1);
  font-family: var(--lb-font-sans);
}

/* ===== Available in ChatGPT & Claude ===== */
.home-channels {
  position: relative;
  padding: 120px 24px 80px;
  overflow: hidden;
  isolation: isolate;
}
.home-channels::before,
.home-channels::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 180px;
  pointer-events: none;
  z-index: 1;
}
.home-channels::before {
  top: 0;
  background: linear-gradient(to bottom, var(--lb-bg-1), transparent);
}
.home-channels::after {
  bottom: 0;
  background: linear-gradient(to top, var(--lb-bg-1), transparent);
}
.home-channels-inner {
  position: relative;
  z-index: 2;
}
.home-channels-grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, color-mix(in srgb, var(--lb-fg-1) 6%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, var(--lb-fg-1) 6%, transparent) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 70% 55% at 50% 45%, #000 0%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 70% 55% at 50% 45%, #000 0%, transparent 75%);
  opacity: 0.55;
  z-index: 0;
  pointer-events: none;
}
.home-channels-glow {
  position: absolute;
  width: 420px;
  height: 420px;
  border-radius: 999px;
  filter: blur(90px);
  opacity: 0.28;
  z-index: 0;
  pointer-events: none;
}
.home-channels-glow--gpt {
  top: -80px;
  left: -60px;
  background: radial-gradient(circle, #10a37f 0%, transparent 65%);
}
.home-channels-glow--claude {
  bottom: -120px;
  right: -80px;
  background: radial-gradient(circle, #d97757 0%, transparent 65%);
}

.home-channels-head {
  text-align: center;
  max-width: 780px;
  margin: 0 auto 56px;
}
@keyframes home-channels-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.home-channels-title {
  margin: 18px 0 20px;
  font-size: clamp(26px, 3.2vw, 40px);
  line-height: 1.15;
  letter-spacing: -0.02em;
}
.home-channels-title-line {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.32em;
}
.home-channels-title-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.28em;
}
.home-channels-title-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
}
.home-channels-title-logo svg {
  width: 100%;
  height: 100%;
  display: block;
}
.home-channels-title-logo--gpt {
  color: var(--lb-fg-1);
}
.home-channels-title-logo--claude {
  color: #d97757;
}
.home-channels-title-x {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 0.5em;
  height: 0.5em;
  color: var(--lb-fg-3);
  opacity: 0.55;
  margin: 0 0.1em;
}
.home-channels-title-x svg {
  width: 100%;
  height: 100%;
  display: block;
}
.home-channels-tagline {
  display: block;
  margin-top: 10px;
  font-size: 0.5em;
  font-weight: 500;
  letter-spacing: -0.005em;
  color: var(--lb-fg-3);
}
.home-channels-sub {
  margin: 0 auto;
  max-width: 780px;
  font-size: 17px;
  line-height: 1.8;
  font-weight: 500;
  color: var(--lb-fg-2);
}
.home-channels-sub .k {
  font-size: 1.3em;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.home-channels-sub .k-lb {
  color: var(--lb-fg-1);
}
.home-channels-sub .k-gpt {
  color: var(--lb-brand);
}
.home-channels-sub .k-claude {
  color: #d97757;
}

.home-channels-sub.is-visible,
.home-channels-sub.is-visible .k {
  background-size: 300% 100%;
  background-position: 100% 50%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: home-channels-reveal 5s cubic-bezier(0.22, 1, 0.36, 1);
}
.home-channels-sub.is-visible {
  background-image: linear-gradient(
    105deg,
    var(--lb-fg-2) 0%,
    var(--lb-fg-2) 42%,
    #ffffff 50%,
    var(--lb-fg-2) 58%,
    var(--lb-fg-2) 100%
  );
}
.home-channels-sub.is-visible .k-lb {
  background-image: linear-gradient(
    105deg,
    var(--lb-fg-1) 0%,
    var(--lb-fg-1) 42%,
    #ffffff 50%,
    var(--lb-fg-1) 58%,
    var(--lb-fg-1) 100%
  );
}
.home-channels-sub.is-visible .k-gpt {
  background-image: linear-gradient(
    105deg,
    var(--lb-brand) 0%,
    var(--lb-brand) 42%,
    #ffffff 50%,
    var(--lb-brand) 58%,
    var(--lb-brand) 100%
  );
}
.home-channels-sub.is-visible .k-claude {
  background-image: linear-gradient(
    105deg,
    #d97757 0%,
    #d97757 42%,
    #ffffff 50%,
    #d97757 58%,
    #d97757 100%
  );
}
@keyframes home-channels-reveal {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@media (prefers-reduced-motion: reduce) {
  .home-channels-sub.is-visible,
  .home-channels-sub.is-visible .k {
    animation: none;
    background: none;
    -webkit-text-fill-color: currentColor;
  }
}

.home-channels-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  max-width: 760px;
  margin: 0 auto;
}
.home-channel-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 28px;
  border-radius: 20px;
  border: 1px solid var(--app-card-stroke);
  background: var(--lb-bg-1);
  color: var(--lb-fg-1);
  text-decoration: none;
  overflow: hidden;
  isolation: isolate;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}
.home-channel-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--card-accent) 55%, transparent),
    transparent 45%,
    transparent 70%,
    color-mix(in srgb, var(--card-accent) 25%, transparent)
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.25s ease;
  pointer-events: none;
  z-index: 2;
}
.home-channel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 30px 60px -32px color-mix(in srgb, var(--card-accent) 60%, rgba(15, 17, 21, 0.28));
}
.home-channel-card:hover::before {
  opacity: 1;
}
.home-channel-card--chatgpt {
  --card-accent: #10a37f;
}
.home-channel-card--claude {
  --card-accent: #d97757;
}

.home-channel-card-glow {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 160px;
  height: 160px;
  border-radius: 999px;
  background: radial-gradient(circle, var(--card-accent) 0%, transparent 70%);
  filter: blur(40px);
  opacity: 0.28;
  z-index: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}
.home-channel-card:hover .home-channel-card-glow {
  opacity: 0.45;
}

.home-channel-card-head {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1;
}
.home-channel-card-logo {
  flex-shrink: 0;
}
.home-channel-card-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--card-accent) 12%, transparent);
  color: var(--card-accent);
}
.home-channel-card-logo svg {
  width: 24px;
  height: 24px;
  display: block;
}
.home-channel-card-logo--chatgpt {
  color: var(--lb-fg-1);
  background: color-mix(in srgb, var(--lb-fg-1) 8%, transparent);
}
.home-channel-card-titles {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1 1 auto;
  min-width: 0;
}
.home-channel-card-cta {
  margin-left: auto;
  white-space: nowrap;
  align-self: center;
  flex-shrink: 0;
}
.home-channel-card-brand {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--lb-fg-1);
}
.home-channel-card-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--lb-fg-3);
}
.home-channel-card-live {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--card-accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--card-accent) 22%, transparent);
  animation: home-channels-pulse 2.4s ease-in-out infinite;
}

.home-channel-card-preview {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 18px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--lb-fg-1) 4%, transparent);
  font-family: var(--lb-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  font-size: 13.5px;
  line-height: 1.5;
}
.home-channel-card-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.home-channel-card-bullet {
  flex: 0 0 auto;
  color: color-mix(in srgb, var(--lb-fg-3) 80%, transparent);
  font-weight: 600;
  line-height: 1.5;
}
.home-channel-card-bullet--reply {
  color: var(--card-accent);
  font-size: 11px;
  transform: translateY(2px);
}
.home-channel-card-text {
  color: var(--lb-fg-2, var(--lb-fg-1));
  word-break: break-word;
}
.home-channel-card-text--reply {
  color: var(--lb-fg-1);
}

.home-channel-card-cta {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--card-accent);
  transition: transform 0.2s ease;
}
.home-channel-card:hover .home-channel-card-cta {
  transform: translateX(4px);
}
.home-channel-card--chatgpt .home-channel-card-cta {
  color: var(--lb-brand);
}

@media (max-width: 860px) {
  .home-channels {
    padding: 72px 16px 24px;
  }
  .home-channels-cards {
    grid-template-columns: 1fr;
  }
  .home-channels-head {
    margin-bottom: 40px;
  }
  .home-channels-title {
    font-size: clamp(24px, 6.8vw, 32px);
  }
  .home-channel-card {
    padding: 24px;
  }
}
</style>
