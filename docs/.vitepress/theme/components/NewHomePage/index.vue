<script setup lang="ts">
import { ref, computed } from 'vue'
import AppNav from '../AppNav.vue'
import AppFooter from '../AppFooter.vue'
import { localePath } from '../../utils/i18n'
import { useData } from 'vitepress'

const { lang } = useData()

const LOCALE = {
  en: {
    hero: {
      eyebrow: 'LONGBRIDGE OPENAPI',
      title1: 'Real-time markets,',
      title2: 'built for AI.',
      desc: 'Real-time market data, quantitative research, and AI-powered analysis — through AI Skill, CLI, MCP, SDK and OpenAPI. One credential, every market, zero overhead. Explore <a href="https://longbridge.com/markets">live market data</a> across every market.',
      cta1: 'Get Started',
      cta2: 'Read the Docs',
      highlights: [
        { u: 'markets', d: 'US · HK · SG · CN' },
        { u: 'SDKs', d: 'Python · Rust · Node · Go · Java · C · C++' },
        { u: 'endpoints', d: 'Quote · Trade · Research · News' },
        { u: 'OpenAPI access', d: 'No monthly fees' },
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
        desc: 'Real-time quotes, portfolio data, news sentiment, and market intelligence — works with Claude, ChatGPT, Cursor, Gemini, Codex, Zed, Cherry Studio.',
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
        title: 'Hosted MCP server',
        desc: 'OAuth 2.1 authentication — drop into Claude Code, Cursor, Codex, Zed, Cherry Studio in one line. Your AI gets real positions and live quotes.',
        tags: ['OAuth 2.1', 'Hosted'],
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
        ['130+ commands', 'Market data, trading, fundamentals — all in your shell.'],
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
      title: 'Connect any AI assistant to live market data — no API keys.',
      desc: 'Hosted HTTP MCP service with OAuth 2.1 authentication. Your AI coding assistant gets <a href="https://longbridge.com/markets">real-time quotes</a>, account info, and trading — all in one connection.',
      cta: 'MCP Documentation',
      note: 'OAuth 2.1 — browser opens automatically on first use. No API key needed.',
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
          body: 'WebSocket push for quotes, order depth, trades, and order status — <60 ms latency.',
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
      desc: '实时行情、量化研究与 AI 驱动分析——通过 AI Skill、CLI、MCP、SDK 和 OpenAPI 一体接入。一套凭证，覆盖所有市场，零额外开销。探索覆盖全球市场的<a href="https://longbridge.com/markets">实时行情</a>。',
      cta1: '开始使用',
      cta2: '阅读文档',
      highlights: [
        { u: '个市场', d: 'US · HK · SG · CN' },
        { u: '个 SDK', d: 'Python · Rust · Node · Go · Java · C · C++' },
        { u: '+ 个接口', d: '行情 · 交易 · 研究 · 资讯' },
        { u: 'OpenAPI 接入费', d: '集成账户免费' },
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
        desc: '实时行情、持仓数据、新闻情绪与市场洞察——兼容 Claude、ChatGPT、Cursor、Gemini、Codex、Zed、Cherry Studio。',
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
        title: '托管 MCP 服务器',
        desc: 'OAuth 2.1 认证——一行命令接入 Claude Code、Cursor、Codex、Zed、Cherry Studio。您的 AI 可获取真实持仓与实时行情。',
        tags: ['OAuth 2.1', '托管'],
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
        ['130+ 条命令', '行情、交易、基本面——全在终端中触手可及。'],
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
      desc: '借助 Longbridge Skill，您的 AI 助手可以<a href="https://longbridge.com/screener">筛选股票</a>、解读财报、追踪内部人交易、下达订单——全程对话完成，无需切换 App。',
      installLabel: '复制发给任意 AI，它会引导你完成安装：',
      installCmd: `请按照以下指南安装 Longbridge AI toolkit：\nhttps://open.longbridge.com/skill/install.md\n\n安装完成后，完成登录授权，查询一支股票行情确认可用。`,
      installOr: '—— 或通过包管理器 ——',
      agentMore: '+ 任意兼容 Skill 的 Agent',
      cta: '浏览 Skill 目录',
    },
    mcp: {
      eyebrow: '托管 MCP',
      title: '无需 API Key，让任意 AI 助手连接实时市场数据',
      desc: '托管 HTTP MCP 服务，支持 OAuth 2.1 认证。您的 AI 编程助手可获取<a href="https://longbridge.com/markets">实时行情</a>、账户信息与交易功能——一次连接，全部到位。',
      cta: 'MCP 文档',
      note: 'OAuth 2.1——首次使用时自动打开浏览器授权，无需 API Key。',
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
        { h: '实时推送', body: 'WebSocket 推送报价、买卖盘深度、成交及订单状态，延迟 < 60 ms。' },
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
      desc: '即時行情、量化研究與 AI 驅動分析——透過 AI Skill、CLI、MCP、SDK 和 OpenAPI 一體接入。一套憑證，覆蓋所有市場，零額外開銷。探索覆蓋全球市場的<a href="https://longbridge.com/markets">即時行情</a>。',
      cta1: '開始使用',
      cta2: '閱讀文件',
      highlights: [
        { u: '個市場', d: 'US · HK · SG · CN' },
        { u: '個 SDK', d: 'Python · Rust · Node · Go · Java · C · C++' },
        { u: '+ 個接口', d: '行情 · 交易 · 研究 · 資訊' },
        { u: 'OpenAPI 接入費', d: '整合帳戶免費' },
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
        desc: '即時行情、持倉數據、新聞情緒與市場洞察——兼容 Claude、ChatGPT、Cursor、Gemini、Codex、Zed、Cherry Studio。',
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
        title: '託管 MCP 伺服器',
        desc: 'OAuth 2.1 認證——一行命令接入 Claude Code、Cursor、Codex、Zed、Cherry Studio。您的 AI 可獲取真實持倉與即時行情。',
        tags: ['OAuth 2.1', '託管'],
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
        ['130+ 條命令', '行情、交易、基本面——全在終端中觸手可及。'],
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
      desc: '借助 Longbridge Skill，您的 AI 助手可以<a href="https://longbridge.com/screener">篩選股票</a>、解讀財報、追蹤內部人交易、下達訂單——全程對話完成，無需切換 App。',
      installLabel: '複製發給任意 AI，它會引導你完成安裝：',
      installOr: '—— 或透過套件管理器 ——',
      agentMore: '+ 任意相容 Skill 的 Agent',
      cta: '瀏覽 Skill 目錄',
    },
    mcp: {
      eyebrow: '託管 MCP',
      title: '無需 API Key，讓任意 AI 助手連接即時市場數據',
      desc: '託管 HTTP MCP 服務，支援 OAuth 2.1 認證。您的 AI 程式設計助手可獲取<a href="https://longbridge.com/markets">即時行情</a>、帳戶資訊與交易功能——一次連線，全部到位。',
      cta: 'MCP 文件',
      note: 'OAuth 2.1——首次使用時自動打開瀏覽器授權，無需 API Key。',
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
        { h: '即時推送', body: 'WebSocket 推送報價、買賣盤深度、成交及訂單狀態，延遲 < 60 ms。' },
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
    desc: 'Real-time quotes, portfolio data, news sentiment, and market intelligence — works with Claude, ChatGPT, Cursor, Gemini, Codex, Zed, Cherry Studio.',
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
    title: 'Hosted MCP server',
    desc: 'OAuth 2.1 authentication — drop into Claude Code, Cursor, Codex, Zed, Cherry Studio in one line. Your AI gets real positions and live quotes.',
    tags: ['OAuth 2.1', 'Hosted'],
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
  { name: 'Claude Code', initial: 'C', color: '#D97757' },
  { name: 'Codex', initial: 'O', color: '#000000' },
  { name: 'Cursor', initial: 'C', color: '#000000' },
  { name: 'Gemini', initial: 'G', color: '#1A73E8' },
  { name: 'OpenClaw', initial: 'O', color: 'var(--lb-brand)' },
  { name: 'Zed', initial: 'Z', color: '#0E40D9' },
]

const MCP_CLIENTS = ['Claude Code', 'Codex', 'Gemini', 'Cursor', 'Zed']

const API_CAPS = [
  {
    icon: 'chart',
    color: 'var(--lb-status-neutral)',
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
    title: 'Trading & Orders',
    count: '14+',
    desc: 'Submit, replace, and withdraw orders. Track positions, balance, and execution history',
    items: ['Submit orders', 'Modify & cancel', 'Positions & balance', 'Execution history', 'Order status push'],
  },
  {
    icon: 'bolt',
    color: 'var(--lb-ai-mention)',
    title: 'Derivatives',
    count: '8+',
    desc: 'Full option chains with Greeks, warrants listing, and real-time derivative quotes',
    items: ['Option chains + Greeks', 'Warrant filtering', 'Issuer directory', 'Derivative quotes'],
  },
  {
    icon: 'book',
    color: 'var(--lb-chart-purple)',
    title: 'Financial Research',
    count: '7+',
    desc: 'Financial statements, valuation metrics, dividend history, EPS forecasts, analyst ratings',
    items: ['Financial statements', 'Valuation metrics', 'Dividend history', 'EPS forecasts', 'Analyst ratings'],
  },
  {
    icon: 'globe',
    color: 'var(--lb-status-alert)',
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
                <div class="t-meta" style="font-size: 13px; margin-top: 2px">{{ d }}</div>
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
              @click="
                copyToClipboard('claude mcp add --transport http longbridge \\\n  https://mcp.longbridge.com')
              ">
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
          <a v-for="c in apiCaps" :key="c.title" :href="localePath('/api')" class="api-cap-card">
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
                <div class="sdk-feat-body">{{ content.sdk.feats[2].body }}</div>
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
</style>
