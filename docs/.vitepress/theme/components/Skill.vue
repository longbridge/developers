<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useData } from 'vitepress'
import AppNav from './AppNav.vue'
import AppFooter from './AppFooter.vue'
import type { SkillEntry } from './skill-catalog/types'
import { augmentLocale } from './skill-catalog/augment'
import { locale as _enLocale } from './skill-catalog/en'
import { locale as _zhCNLocale } from './skill-catalog/zh-CN'
import { locale as _zhHKLocale } from './skill-catalog/zh-HK'
import { siteHostname } from '../utils/region'
const enLocale = augmentLocale(_enLocale)
const zhCNLocale = augmentLocale(_zhCNLocale)
const zhHKLocale = augmentLocale(_zhHKLocale)

const { lang } = useData()

const LOCALE = {
  en: {
    hero: {
      eyebrow: 'AI · Skill',
      title1: 'Longbridge Skill',
      title2: 'Unlock market insights, deep research and intelligent trading for your AI.',
      desc: 'With Longbridge Skill, your AI assistant — Claude, Cursor, ChatGPT, Gemini, Codex — can screen stocks, decode earnings, track insider moves, and place orders, all in plain conversation.',
      installLabel: 'Copy and send to any AI — it will walk you through install:',
      installLink: 'View installation guide for each client',
      agentsLabel: 'Supported AI tools',
      agentsMore: '+ Other AI tools',
    },
    demo: {
      title: 'See what Skill can do for you.',
      desc: 'Pick a scenario to see your AI assistant in action.',
      tryAsking: 'Try asking',
    },
    catalog: {
      eyebrow: 'Skill catalog',
      badge: 'SKILL CATALOG',
      title: '100+ Skills, covering every move in your trading day.',
      desc: 'Each Skill is a packaged set of tools, callable by any supported AI client. Click any card to see install instructions and details.',
      marketplace: 'Available on Claude Code Plugin Marketplace',
      pluginDesc: 'Copy the commands and run them in Claude Code.',
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
    catLabels: {
      All: 'All',
      Market: 'Market',
      Research: 'Research',
      Derivatives: 'Derivatives',
      Discovery: 'Discovery',
      Trade: 'Trade',
      Portfolio: 'Portfolio',
      Platform: 'Platform',
    } as Record<string, string>,
    cap: {
      eyebrow: 'Capability reference',
      title: 'Full coverage of Longbridge CLI commands and MCP tools.',
      desc: 'Every capability below is available to your AI in plain conversation.',
      marketData: 'Real-time Market Data',
      fundamentals: 'Fundamentals & Research',
      calendar: 'Calendar & Events',
      news: 'News, Community & Watchlist',
      account: 'Account & Portfolio',
      trading: 'Trading',
    } as Record<string, string>,
    cases: {
      eyebrow: 'SEE IT IN ACTION',
      title: 'Real user cases, real returns.',
      desc: 'Hand-picked write-ups from the Longbridge community. From quick experiments to fully-deployed quant systems — see what people are shipping with Skill.',
      read: 'Read case',
      award: {
        tag: 'AWARD',
        title: 'Each winner receives 10,000 Task Coins + 1 × AirPods 4',
        desc: "Winning cases are showcased on the Longbridge Skill website — visible to users worldwide, including the winner's ID and creative work.",
        taskCoins: 'TASK COINS',
        perWinner: 'PER WINNER',
      },
    },
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
        desc: 'For Claude Code, Codex, and similar tools — installs all skills globally.',
      },
      installCmd: `Install Longbridge AI toolkit following the guide:\n${siteHostname}/skill/install.md\n\And complete login and test with a market data query.`,
      footer: {
        also: 'Also available on',
        and: 'and',
        guide: 'View installation guide for each client',
      },
    },
  },
  'zh-CN': {
    hero: {
      eyebrow: 'AI · Skill',
      title1: 'Longbridge Skill',
      title2: '为您的 AI 解锁市场洞察、深度研究与智能交易',
      desc: '借助 Longbridge Skill，您的 AI 助手——Claude、Cursor、ChatGPT、Gemini、Codex——可以筛选股票、解读财报、追踪机构动向，并直接下单，全程自然对话。',
      installLabel: '复制发送给任意 AI——它将引导您完成安装：',
      installLink: '查看各客户端安装指南',
      agentsLabel: '支持的 AI 工具',
      agentsMore: '+ 更多 AI 工具',
    },
    demo: {
      title: '看看 Skill 能为您做什么',
      desc: '选择一个场景，观看 AI 助手实际操作。',
      tryAsking: '试着问',
    },
    catalog: {
      eyebrow: 'Skill 目录',
      badge: 'SKILL 目录',
      title: '100+ 个 Skill，覆盖您交易日的每一个动作',
      desc: '每个 Skill 都是一套打包的工具集，可被任何受支持的 AI 客户端调用。点击任意卡片查看安装说明和详情。',
      marketplace: '已上架 Claude Code 插件市场',
      pluginDesc: '复制命令，在 Claude Code 中运行即可。',
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
    catLabels: {
      All: '全部',
      Market: '行情',
      Research: '研究',
      Derivatives: '衍生品',
      Discovery: '发现',
      Trade: '交易',
      Portfolio: '投资组合',
      Platform: '平台',
    } as Record<string, string>,
    cap: {
      eyebrow: '能力参考',
      title: '完整覆盖 Longbridge CLI 命令和 MCP 工具',
      desc: '以下所有能力均可通过自然对话调用。',
      marketData: '实时行情数据',
      fundamentals: '基本面与研究',
      calendar: '日历与事件',
      news: '资讯、社区与自选股',
      account: '账户与投资组合',
      trading: '交易',
    } as Record<string, string>,
    cases: {
      eyebrow: '实战案例',
      title: '真实用户案例，真实回报',
      desc: '精选长桥社区用户分享。从快速实验到全面部署的量化系统——看看大家用 Skill 在做什么。',
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
        desc: '适用于 Claude Code、Codex 等工具——全局安装所有 Skill。',
      },
      installCmd: `请按照以下指南安装 Longbridge AI toolkit：\n${siteHostname}/skill/install.md\n\n安装完成后，完成登录授权，查询一支股票行情确认可用。`,
      footer: {
        also: '也可在以下平台获取',
        and: '和',
        guide: '查看各客户端安装指南',
      },
    },
    capItems: {
      marketData: [
        '实时行情（单个或多个标的）',
        'Level 2 盘口深度（买卖挂单梯）',
        '逐笔成交数据',
        '分钟级日内价格与成交量',
        'K 线 OHLCV 与历史日期范围数据',
        '日内资金流向时间序列',
        '市场情绪温度指数（0–100）',
        '基础静态参数（手数、股本、EPS）',
        '期权报价与期权链',
        '权证报价及按标的筛选权证',
      ],
      fundamentals: [
        '利润表、资产负债表、现金流量表',
        'PE/PB/PS、股息收益率 + 同行对比',
        '分析师 EPS 预测',
        '营收与利润一致预期及超/不及预期记录',
        '机构评级与目标价分布',
        '计算类财务指数（PE、PB、分红率）',
        '机构股东及持仓变化',
        '持有指定标的的基金与 ETF',
        '历史分红记录及分配详情',
        'SEC / 监管文件（完整 Markdown 内容）',
      ],
      calendar: ['按标的查看即将发布的财报', '重要宏观数据事件', '按市场查看即将派息事件', '交易时段安排与节假日历'],
      news: ['按标的获取最新资讯', '社区讨论话题', '自选股分组：查看、新建、编辑、删除'],
      account: [
        '全子账户股票持仓',
        '全子账户基金持仓',
        '账户现金余额与融资信息',
        '资金流水（入金、出金、分红、手续费）',
        '账户对账单（日报 / 月报）',
        '全币种汇率',
      ],
      trading: [
        '限价单、市价单或条件单',
        '查看当日订单、订单详情、成交记录',
        '撤销待成交订单',
        '修改待成交订单的数量或价格',
        '估算最大可买 / 可卖数量',
        '按标的查询保证金比例要求',
      ],
    } as Record<string, string[]>,
    demos: [
      {
        nav: '跨市场选股',
        title: 'HK · 美股 · A 股 · 新加坡——一次筛选，全市场覆盖',
        desc: '跨市场追踪机会繁琐易错。告诉 AI 你的条件——市值、PE 区间、板块——再叠加 KDJ 金叉或 MACD 多头等技术信号，跨市场过滤，统一输出结果。',
        prompt: '从美股和港股中，筛选市值超 500 亿、PE 低于 25 的科技股，且近期出现 MACD 金叉——按市值排序。',
        summary:
          '美股 + 港股科技板块筛选完成——共 8 只股票满足市值 ≥ 500 亿、PE < 25 条件。其中 3 只确认出现近期 MACD 金叉（DIF 上穿 DEA）。',
        tableHead: ['代码', '名称', '市值', 'PE', 'MACD', '信号'],
        callout:
          'MACD 金叉最强标的：9618.HK（京东）——DIF 从 −0.08 上穿零轴至 +0.22，是本次最接近零轴且趋势最干净的金叉。IBM.US 和 9999.HK 同样确认。腾讯 / 阿里 / 小米 DIF 仍低于 DEA，尚未满足信号条件。',
      },
      {
        nav: '技术分析诊断',
        title: '任意标的一键技术诊断——MACD、KDJ、RSI、布林带，一条指令搞定',
        desc: '不用截图，直接问。输入任意标的，Skill 拉取日线 / 小时线，运行指标，告诉你该关注什么——金叉、背离、超卖区域。',
        prompt: '诊断 NVDA.US——日线上的 MACD、KDJ、RSI，并告诉我哪些信号值得信任。',
        summary:
          'NVDA.US 日线，近 90 个交易日：趋势强劲但 MACD 柱状缩短——动量趋于冷却。KDJ 超买（J=92.4），RSI 71.8——短期回调风险偏高。',
        tableHead: ['指标', '数值', '信号解读', '可信度'],
        callout:
          '偏空短期、多头中期维持。KDJ + RSI 双双超买，MACD 柱状缩短——短期调整第一浪大概率来临。关注 $135 位置（20D MA + 布林下轨共振区）作为再次入场参考。',
      },
      {
        nav: '财报研究',
        title: '财报出炉前解码——一致预期、期权定价、关键看点',
        desc: 'Skill 调取分析师一致预期、历史 EPS 超预期数据，以及期权市场隐含的预期波幅。在你下注之前，让数据告诉你目标价和业绩说明会的关注焦点。',
        prompt: 'NVDA 今晚公布财报。调取一致预期、IV 隐含波动及关键看点。',
        summary: 'NVDA FY26 Q3 盈利即将于今日收盘后公布，以下为一致预期与盘后波动预期。',
        tableHead: ['项目', '一致预期', '上季度实际', '同比'],
        callout:
          '三大业绩说明会看点：① 数据中心增速能否突破 +108% 的高基数；② 出口管制后的中国市场评述；③ FY26 产能 / 供应指引。期权 IV 定价 ±9.2% 波幅——近 4 季平均实际波动为 ±7.4%。',
      },
      {
        nav: '聪明钱追踪',
        title: '实时捕捉机构资金轮动方向——当日数据，按板块拆分',
        desc: '聚合个股当日资金流向，以大单占比加权。Skill 与 20 日基线对比，标出机构净流入或流出明显的板块。',
        prompt: '港股哪些板块今天出现机构式吸筹？列出净流入超过 20 日均值 2 倍的前 3 个板块。',
        summary: '港股当日资金流向快照：3 个板块出现明显异常机构吸筹。可选消费板块领跑，为 20 日均值的 2.4 倍。',
        tableHead: ['板块', '净流入', '对比 20D 均值', '大单占比', '领涨股'],
        callout:
          '最高确定性：可选消费——净流入 2.4 倍基线，大单占比 61%，指向机构而非散户行为。9618.HK 领涨，净流入 +12.1 亿港元；该标的在今早的筛选中同样出现最强 MACD 金叉。',
      },
      {
        nav: '高级订单',
        title: '条件单、多腿期权——用中文描述，Skill 帮你执行',
        desc: '追踪止损、OCO 组合单、均价建仓梯、多腿期权价差——描述好结构，Skill 完成各腿下单并做好风控校验。提交前有确认步骤。',
        prompt: '卖出开仓 TSLA $450/$470 看涨价差，到期日下周五，按最大风险 $500 定仓位。',
        summary: '两腿价差已按你的风险预算完成计算，等待确认后提交。',
        tableHead: ['腿', '操作', '行权价', '到期日', '中间价', '手数'],
        callout:
          '净权利金：+$5.60/张价差 × 2 手 = +$1,120。最大风险 $2,880，盈亏平衡点 $455.60。回复"确认"即可提交两腿；Skill 先挂空头腿，再挂多头腿，并设置 5 秒超时保护。',
      },
      {
        nav: '持仓审视',
        title: '每周持仓体检——集中度、因子暴露、回撤风险',
        desc: 'Skill 扫描全子账户持仓，计算单个标的和行业集中度，并以当前期权 IV 作为前瞻波动代理，标出回撤风险最高的持仓。',
        prompt: '检视我的持仓，标出集中度风险和 3 只前瞻波动率最高的标的。',
        summary: '持仓总价值 $128,365。科技板块权重 52%，远超 35% 目标上限。3 只标的前瞻 IV 偏高。',
        tableHead: ['代码', '权重', '盈亏', '前瞻 IV', '风险'],
        callout:
          '建议：在下次反弹时削减 NVDA 10–15%——行业集中度已突破 35% 上限，且财报 IV 压缩即将到来。考虑对 TSLA 做领圈策略（卖出 OTM 看涨 + 买入 ATM 看跌），在不平仓的前提下对冲 +58% IV 敞口。',
      },
    ],
  },
  'zh-HK': {
    hero: {
      eyebrow: 'AI · Skill',
      title1: 'Longbridge Skill',
      title2: '為您的 AI 解鎖市場洞察、深度研究與智能交易',
      desc: '借助 Longbridge Skill，您的 AI 助手——Claude、Cursor、ChatGPT、Gemini、Codex——可以篩選股票、解讀財報、追蹤機構動向，並直接下單，全程自然對話。',
      installLabel: '複製發送給任意 AI——它將引導您完成安裝：',
      installLink: '查看各客戶端安裝指南',
      agentsLabel: '支援的 AI 工具',
      agentsMore: '+ 更多 AI 工具',
    },
    demo: {
      title: '看看 Skill 能為您做什麼',
      desc: '選擇一個場景，觀看 AI 助手實際操作',
      tryAsking: '試著問',
    },
    catalog: {
      eyebrow: 'Skill 目錄',
      badge: 'SKILL 目錄',
      title: '100+ 個 Skill，覆蓋您交易日的每一個動作。',
      desc: '每個 Skill 都是一套打包的工具集，可被任何受支援的 AI 客戶端調用。點擊任意卡片查看安裝說明和詳情。',
      marketplace: '已上架 Claude Code 外掛市場',
      pluginDesc: '複製命令，在 Claude Code 中運行即可。',
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
    catLabels: {
      All: '全部',
      Market: '行情',
      Research: '研究',
      Derivatives: '衍生品',
      Discovery: '發現',
      Trade: '交易',
      Portfolio: '投資組合',
      Platform: '平台',
    } as Record<string, string>,
    cap: {
      eyebrow: '能力參考',
      title: '完整覆蓋 Longbridge CLI 命令和 MCP 工具',
      desc: '以下所有能力均可透過自然對話調用。',
      marketData: '即時行情數據',
      fundamentals: '基本面與研究',
      calendar: '日曆與事件',
      news: '資訊、社區與自選股',
      account: '帳戶與投資組合',
      trading: '交易',
    } as Record<string, string>,
    cases: {
      eyebrow: '實戰案例',
      title: '真實用戶案例，真實回報。',
      desc: '精選長橋社區用戶分享。從快速實驗到全面部署的量化系統——看看大家用 Skill 在做什麼。',
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
        desc: '適用於 Claude Code、Codex 等工具——全局安裝所有 Skill。',
      },
      installCmd: `請按照以下指南安裝 Longbridge AI toolkit：\n${siteHostname}/skill/install.md\n\n安裝完成後，完成登錄授權，查詢一支股票行情確認可用。`,
      footer: {
        also: '也可在以下平台獲取',
        and: '及',
        guide: '查看各客戶端安裝指南',
      },
    },
    capItems: {
      marketData: [
        '即時行情（單個或多個標的）',
        'Level 2 盤口深度（買賣掛單梯）',
        '逐筆成交數據',
        '分鐘級日內價格與成交量',
        'K 線 OHLCV 與歷史日期範圍數據',
        '日內資金流向時間序列',
        '市場情緒溫度指數（0–100）',
        '基礎靜態參數（手數、股本、EPS）',
        '期權報價與期權鏈',
        '權證報價及按標的篩選權證',
      ],
      fundamentals: [
        '利潤表、資產負債表、現金流量表',
        'PE/PB/PS、股息收益率 + 同行對比',
        '分析師 EPS 預測',
        '營收與利潤一致預期及超/不及預期記錄',
        '機構評級與目標價分佈',
        '計算類財務指數（PE、PB、分紅率）',
        '機構股東及持倉變化',
        '持有指定標的的基金與 ETF',
        '歷史分紅記錄及分配詳情',
        'SEC / 監管文件（完整 Markdown 內容）',
      ],
      calendar: ['按標的查看即將發佈的業績', '重要宏觀數據事件', '按市場查看即將派息事件', '交易時段安排與節假日曆'],
      news: ['按標的獲取最新資訊', '社區討論話題', '自選股分組：查看、新建、編輯、刪除'],
      account: [
        '全子賬戶股票持倉',
        '全子賬戶基金持倉',
        '賬戶現金餘額與融資信息',
        '資金流水（入金、出金、分紅、手續費）',
        '賬戶對賬單（日報 / 月報）',
        '全幣種匯率',
      ],
      trading: [
        '限價單、市價單或條件單',
        '查看當日訂單、訂單詳情、成交記錄',
        '撤銷待成交訂單',
        '修改待成交訂單的數量或價格',
        '估算最大可買 / 可賣數量',
        '按標的查詢保證金比例要求',
      ],
    } as Record<string, string[]>,
    demos: [
      {
        nav: '跨市場選股',
        title: 'HK · 美股 · A 股 · 新加坡——一次篩選，全市場覆蓋',
        desc: '跨市場追蹤機會繁瑣易錯。告訴 AI 你的條件——市值、PE 區間、板塊——再疊加 KDJ 金叉或 MACD 多頭等技術信號，跨市場過濾，統一輸出結果。',
        prompt: '從美股和港股中，篩選市值超 500 億、PE 低於 25 的科技股，且近期出現 MACD 金叉——按市值排序。',
        summary:
          '美股 + 港股科技板塊篩選完成——共 8 只股票滿足市值 ≥ 500 億、PE < 25 條件。其中 3 只確認出現近期 MACD 金叉（DIF 上穿 DEA）。',
        tableHead: ['代碼', '名稱', '市值', 'PE', 'MACD', '信號'],
        callout:
          'MACD 金叉最強標的：9618.HK（京東）——DIF 從 −0.08 上穿零軸至 +0.22，是本次最接近零軸且趨勢最乾淨的金叉。IBM.US 和 9999.HK 同樣確認。騰訊 / 阿里 / 小米 DIF 仍低於 DEA，尚未滿足信號條件。',
      },
      {
        nav: '技術分析診斷',
        title: '任意標的一鍵技術診斷——MACD、KDJ、RSI、布林帶，一條指令搞定',
        desc: '不用截圖，直接問。輸入任意標的，Skill 拉取日線 / 小時線，運行指標，告訴你該關注什麼——金叉、背離、超賣區域。',
        prompt: '診斷 NVDA.US——日線上的 MACD、KDJ、RSI，並告訴我哪些信號值得信任。',
        summary:
          'NVDA.US 日線，近 90 個交易日：趨勢強勁但 MACD 柱狀縮短——動量趨於冷卻。KDJ 超買（J=92.4），RSI 71.8——短期回調風險偏高。',
        tableHead: ['指標', '數值', '信號解讀', '可信度'],
        callout:
          '偏空短期、多頭中期維持。KDJ + RSI 雙雙超買，MACD 柱狀縮短——短期調整第一浪大概率來臨。關注 $135 位置（20D MA + 布林下軌共振區）作為再次入場參考。',
      },
      {
        nav: '業績研究',
        title: '業績出爐前解碼——一致預期、期權定價、關鍵看點',
        desc: 'Skill 調取分析師一致預期、歷史 EPS 超預期數據，以及期權市場隱含的預期波幅。在你下注之前，讓數據告訴你目標價和業績說明會的關注焦點。',
        prompt: 'NVDA 今晚公布業績。調取一致預期、IV 隱含波動及關鍵看點。',
        summary: 'NVDA FY26 Q3 盈利即將於今日收盤後公佈，以下為一致預期與盤後波動預期。',
        tableHead: ['項目', '一致預期', '上季度實際', '同比'],
        callout:
          '三大業績說明會看點：① 數據中心增速能否突破 +108% 的高基數；② 出口管制後的中國市場評述；③ FY26 產能 / 供應指引。期權 IV 定價 ±9.2% 波幅——近 4 季平均實際波動為 ±7.4%。',
      },
      {
        nav: '聰明錢追蹤',
        title: '即時捕捉機構資金輪動方向——當日數據，按板塊拆分',
        desc: '聚合個股當日資金流向，以大單佔比加權。Skill 與 20 日基線對比，標出機構淨流入或流出明顯的板塊。',
        prompt: '港股哪些板塊今天出現機構式吸籌？列出淨流入超過 20 日均值 2 倍的前 3 個板塊。',
        summary: '港股當日資金流向快照：3 個板塊出現明顯異常機構吸籌。可選消費板塊領跑，為 20 日均值的 2.4 倍。',
        tableHead: ['板塊', '淨流入', '對比 20D 均值', '大單佔比', '領漲股'],
        callout:
          '最高確定性：可選消費——淨流入 2.4 倍基線，大單佔比 61%，指向機構而非散戶行為。9618.HK 領漲，淨流入 +12.1 億港元；該標的在今早的篩選中同樣出現最強 MACD 金叉。',
      },
      {
        nav: '高級訂單',
        title: '條件單、多腿期權——用中文描述，Skill 幫你執行',
        desc: '追蹤止損、OCO 組合單、均價建倉梯、多腿期權價差——描述好結構，Skill 完成各腿下單並做好風控校驗。提交前有確認步驟。',
        prompt: '賣出開倉 TSLA $450/$470 看漲價差，到期日下週五，按最大風險 $500 定倉位。',
        summary: '兩腿價差已按你的風險預算完成計算，等待確認後提交。',
        tableHead: ['腿', '操作', '行權價', '到期日', '中間價', '手數'],
        callout:
          '淨權利金：+$5.60/張價差 × 2 手 = +$1,120。最大風險 $2,880，損益平衡點 $455.60。回覆「確認」即可提交兩腿；Skill 先掛空頭腿，再掛多頭腿，並設置 5 秒超時保護。',
      },
      {
        nav: '持倉審視',
        title: '每週持倉體檢——集中度、因子暴露、回撤風險',
        desc: 'Skill 掃描全子賬戶持倉，計算單個標的和行業集中度，並以當前期權 IV 作為前瞻波動代理，標出回撤風險最高的持倉。',
        prompt: '檢視我的持倉，標出集中度風險和 3 只前瞻波動率最高的標的。',
        summary: '持倉總價值 $128,365。科技板塊權重 52%，遠超 35% 目標上限。3 只標的前瞻 IV 偏高。',
        tableHead: ['代碼', '權重', '盈虧', '前瞻 IV', '風險'],
        callout:
          '建議：在下次反彈時削減 NVDA 10–15%——行業集中度已突破 35% 上限，且業績 IV 壓縮即將到來。考慮對 TSLA 做領圈策略（賣出 OTM 看漲 + 買入 ATM 看跌），在不平倉的前提下對沖 +58% IV 敞口。',
      },
    ],
  },
}

const SKILLS = [
  {
    id: 'longbridge',
    name: 'Longbridge Overview',
    cat: 'Platform',
    tag: 'Popular',
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

const SKILL_CATS_DEF = [
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
    tKey: 'marketData',
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
    tKey: 'fundamentals',
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
    tKey: 'calendar',
    items: [
      'Upcoming earnings events by symbol',
      'High-importance macro data events',
      'Upcoming dividend events by market',
      'Trading session schedule & holiday calendar',
    ],
  },
  {
    tKey: 'news',
    items: [
      'Latest news articles for a symbol',
      'Community discussion topics',
      'Watchlist groups: list, create, update, delete',
    ],
  },
  {
    tKey: 'account',
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
    tKey: 'trading',
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

const content = computed(() => LOCALE[lang.value as keyof typeof LOCALE] ?? LOCALE.en)

const localePfx = computed(() => {
  if (lang.value === 'zh-CN') return '/zh-CN'
  if (lang.value === 'zh-HK') return '/zh-HK'
  return ''
})

const skillCats = computed(() => SKILL_CATS_DEF.map((c) => ({ ...c, label: content.value.catLabels[c.key] ?? c.key })))

const capGroups = computed(() => {
  const localeItems = (content.value as any).capItems as Record<string, string[]> | undefined
  return CAP_REFERENCE.map((g) => ({
    ...g,
    label: content.value.cap[g.tKey] ?? g.tKey,
    items: localeItems?.[g.tKey] ?? g.items,
  }))
})

type ScenarioOverride = {
  nav?: string
  title?: string
  desc?: string
  prompt?: string
  summary?: string
  tableHead?: string[]
  callout?: string
}
const scenarios = computed(() => {
  const localeDemos = (content.value as any).demos as ScenarioOverride[] | undefined
  if (!localeDemos) return DEMO_SCENARIOS
  return DEMO_SCENARIOS.map((sc, i) => ({ ...sc, ...(localeDemos[i] ?? {}) }))
})

const filteredSkills = computed(() =>
  activeCat.value === 'All' ? SKILLS : SKILLS.filter((s) => s.cat === activeCat.value)
)
const activeScenario = computed(() => scenarios.value[scenarioIdx.value])

const installCmd = computed(() => content.value.getstarted.installCmd)

function copyInstall() {
  if (typeof navigator === 'undefined') return
  navigator.clipboard.writeText(installCmd.value).then(() => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  })
}

function copyGetStarted() {
  if (typeof navigator === 'undefined') return
  navigator.clipboard.writeText(installCmd.value).then(() => {
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

// ─── Skills Catalog ───────────────────────────────────────────────────────────

const isEN = computed(() => lang.value === 'en-US' || lang.value === 'en')
const isHK = computed(() => lang.value === 'zh-HK')

type CatalogSkill = SkillEntry & { tag?: string }

const catalogLocale = computed(() => (isEN.value ? enLocale : isHK.value ? zhHKLocale : zhCNLocale))

const CATALOG_SKILLS = computed<CatalogSkill[]>(() =>
  catalogLocale.value.skills.map((s) => ({
    ...s,
    tag: s.tagType ? catalogLocale.value.ui.tagLabels[s.tagType] : undefined,
  }))
)

const CATALOG_CATS = computed(() =>
  Object.entries(catalogLocale.value.ui.catLabels).map(([id, label]) => ({ id, label }))
)

const activeCatalogCat = ref('all')
const catalogQuery = ref('')
const catalogExpanded = ref(false)
const openCatalogSkill = ref<CatalogSkill | null>(null)
const catalogCols = ref(3)
const installClient = ref('cli')
const modalCopiedKey = ref<string | null>(null)

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

function handleModalCopy(text: string, key: string) {
  navigator.clipboard?.writeText(text)
  modalCopiedKey.value = key
  setTimeout(() => {
    modalCopiedKey.value = null
  }, 1400)
}

const INSTALL_CLIENTS = computed(() => {
  const pkg = openCatalogSkill.value?.pkg ?? ''
  return {
    cli: {
      label: 'CLI',
      cmd: `npx skills add longbridge/skills -g --skill ${pkg}`,
      uninstall: `npx skills remove ${pkg} -g`,
      upgrade: `npx skills update ${pkg} -g`,
      verify: `npx skills list | grep ${pkg}`,
    },
    manual: {
      label: content.value.catalog.manualLabel,
      cmd: `# 1. Download ZIP\ncurl -LO ${siteHostname}/skill/${pkg}.zip\n# 2. Extract\nunzip ${pkg}.zip -d ~/.claude/skills/\n# 3. Restart AI client`,
      uninstall: `rm -rf ~/.claude/skills/${pkg}/`,
      upgrade: `curl -LO ${siteHostname}/skill/${pkg}.zip\nunzip -o ${pkg}.zip -d ~/.claude/skills/`,
      verify: `ls ~/.claude/skills/${pkg}/`,
    },
  } as Record<string, { label: string; cmd: string; uninstall: string; upgrade: string; verify: string }>
})

const tabsEl = ref<HTMLElement | null>(null)
const indicatorStyle = ref({ left: '0px', width: '0px' })
function updateIndicator() {
  if (!tabsEl.value) return
  const active = tabsEl.value.querySelector<HTMLElement>('.sc-tab--active')
  if (!active) return
  const base = tabsEl.value.getBoundingClientRect()
  const rect = active.getBoundingClientRect()
  indicatorStyle.value = { left: rect.left - base.left + 'px', width: rect.width + 'px' }
  const wrap = tabsEl.value.parentElement
  if (wrap) {
    const targetScroll = active.offsetLeft - wrap.clientWidth / 2 + active.offsetWidth / 2
    wrap.scrollTo({ left: targetScroll, behavior: 'smooth' })
  }
}
watch(activeCatalogCat, () => nextTick(updateIndicator))

function updateCatalogCols() {
  if (typeof window === 'undefined') return
  const w = window.innerWidth
  catalogCols.value = w <= 600 ? 1 : w <= 960 ? 2 : 3
}

function onModalKey(e: KeyboardEvent) {
  if (e.key === 'Escape') openCatalogSkill.value = null
}
onMounted(() => {
  updateCatalogCols()
  window.addEventListener('resize', updateCatalogCols)
  window.addEventListener('keydown', onModalKey)
  nextTick(updateIndicator)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateCatalogCols)
  window.removeEventListener('keydown', onModalKey)
})

watch([activeCatalogCat, catalogQuery], () => {
  catalogExpanded.value = false
})
watch(openCatalogSkill, () => {
  installClient.value = 'cli'
  modalCopiedKey.value = null
})

const filteredCatalogSkills = computed(() => {
  const q = catalogQuery.value.trim().toLowerCase()
  return CATALOG_SKILLS.value.filter((s) => {
    if (q) return (s.pkg + ' ' + s.name + ' ' + s.desc).toLowerCase().includes(q)
    return activeCatalogCat.value === 'all' || s.cat === activeCatalogCat.value
  })
})

const catalogCap = computed(() => catalogCols.value * 3)

const shownCatalogSkills = computed(() =>
  catalogExpanded.value || filteredCatalogSkills.value.length <= catalogCap.value
    ? filteredCatalogSkills.value
    : filteredCatalogSkills.value.slice(0, catalogCap.value)
)

const catalogCounts = computed(() =>
  Object.fromEntries(
    CATALOG_CATS.value.map((c) => [
      c.id,
      c.id === 'all' ? CATALOG_SKILLS.value.length : CATALOG_SKILLS.value.filter((s) => s.cat === c.id).length,
    ])
  )
)

function triggerRipple(event: MouseEvent, el: HTMLElement) {
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
          <span class="eyebrow">{{ content.hero.eyebrow }}</span>
          <h1 class="h-display" style="margin-top: 20px; font-size: clamp(36px, 4.8vw, 56px)">
            {{ content.hero.title1 }}
            <br />
            <span style="color: var(--lb-brand)">{{ content.hero.title2 }}</span>
          </h1>
          <p
            class="t-body"
            style="margin-top: 24px; max-width: 640px; margin-left: auto; margin-right: auto; font-size: 16px">
            {{ content.hero.desc }}
          </p>

          <div class="skill-hero-install">
            <div class="skill-hero-install-label">{{ content.hero.installLabel }}</div>
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
            <a class="skill-hero-install-link" :href="localePfx + '/skill/install'">
              {{ content.hero.installLink }}
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
              >{{ content.hero.agentsLabel }}</span
            >
            <div class="skill-hero-agents-row">
              <div v-for="a in SKILL_AGENTS" :key="a.name" class="ai-agent-chip">
                <span class="ai-agent-mark" :style="{ background: a.color }">{{ a.mark }}</span>
                {{ a.name }}
              </div>
              <div class="ai-agent-chip ai-agent-more">{{ content.hero.agentsMore }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Demo -->
    <section class="section" style="padding-top: 60px">
      <div class="section-inner">
        <div style="text-align: center; max-width: 560px; margin: 0 auto 36px">
          <h2 class="h-section" style="margin-top: 0">{{ content.demo.title }}</h2>
          <p class="t-meta" style="margin-top: 12px; line-height: 1.55">
            {{ content.demo.desc }}
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
                v-for="(sc, i) in scenarios"
                :key="sc.id"
                :class="['skill-demo-nav-item', i === scenarioIdx ? 'is-active' : '']"
                @click="scenarioIdx = i">
                {{ sc.nav }}
              </button>
            </aside>

            <div class="skill-demo-main">
              <h3 class="skill-demo-title">{{ activeScenario.title }}</h3>
              <p class="skill-demo-desc">{{ activeScenario.desc }}</p>

              <div class="skill-demo-prompt-label">{{ content.demo.tryAsking }}</div>
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
        <!-- Header -->
        <div class="sc-header">
          <div class="sc-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1.5 L14 10 L22 12 L14 14 L12 22.5 L10 14 L2 12 L10 10 Z" />
            </svg>
            {{ content.catalog.badge }}
          </div>
          <h2 class="h-section" style="margin-top: 10px">{{ content.catalog.title }}</h2>
          <p class="t-meta" style="margin-top: 10px; line-height: 1.55">{{ content.catalog.desc }}</p>
          <div class="sc-plugin-bar">
            <div class="sc-plugin-left">
              <div class="sc-plugin-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgb(245, 158, 11)"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <div>
                <div class="sc-plugin-title">
                  {{ content.catalog.marketplace }}
                  <span class="sc-plugin-badge">PLUGIN</span>
                </div>
                <div class="sc-plugin-desc">{{ content.catalog.pluginDesc }}</div>
              </div>
            </div>
            <div class="sc-plugin-right">
              <div class="sc-plugin-cmd-block">
                <div class="sc-plugin-cmd-lines">
                  <code><span class="sc-plugin-kw">/plugin</span> marketplace add longbridge/skills</code>
                  <code><span class="sc-plugin-kw">/plugin</span> install longbridge@longbridge-skills</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs + Search row -->
        <div class="sc-toolbar">
          <div class="sc-tabs-wrap">
            <div ref="tabsEl" class="sc-tabs" role="tablist">
              <button
                v-for="cat in CATALOG_CATS"
                :key="cat.id"
                role="tab"
                :aria-selected="activeCatalogCat === cat.id"
                class="sc-tab"
                :class="{ 'sc-tab--active': activeCatalogCat === cat.id }"
                @click="activeCatalogCat = cat.id">
                {{ cat.label }}
                <span class="sc-tab-count">{{ catalogCounts[cat.id] }}</span>
              </button>
              <span class="sc-tabs-indicator" :style="indicatorStyle"></span>
            </div>
          </div>
          <div class="sc-search-wrap">
            <svg
              class="sc-search-icon"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input v-model="catalogQuery" class="sc-search-input" :placeholder="catalogLocale.ui.searchPlaceholder" />
            <button v-if="catalogQuery" class="sc-search-clear" @click="catalogQuery = ''">×</button>
          </div>
        </div>

        <!-- Grid -->
        <div class="sc-grid" :key="activeCatalogCat + (catalogQuery ? '1' : '0')">
          <div
            v-for="(skill, i) in shownCatalogSkills"
            :key="skill.id"
            class="sc-card"
            :style="{ '--sc-i': i }"
            @mouseenter="triggerRipple($event, $event.currentTarget as HTMLElement)"
            @click="openCatalogSkill = skill">
            <div class="sc-ripple" />
            <div class="sc-card-inner">
              <div class="sc-card-header">
                <div class="sc-card-title">
                  <span class="sc-card-name">{{ skill.name }}</span>
                  <span v-if="skill.tag" class="sc-card-tag" :class="'sc-card-tag--' + (skill.tagType ?? 'default')">{{
                    skill.tag
                  }}</span>
                </div>
                <svg
                  class="sc-card-arrow"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              <span class="sc-card-pkg">{{ skill.pkg }}</span>
              <p class="sc-card-desc">{{ skill.desc }}</p>
              <div class="sc-card-prompt">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 1024 1024"
                  fill="#00B8B8"
                  style="flex: 0 0 auto; margin-top: 2px; opacity: 0.55">
                  <path
                    d="M470.9888 261.77536v98.54976c0 13.3632-10.83392 24.19712-24.19712 24.19712-47.68768 0-73.6256 48.90624-77.21984 145.43872h77.21984c13.3632 0 24.19712 10.84416 24.19712 24.19712v208.0768c0 13.3632-10.83392 24.19712-24.19712 24.19712H240.90624c-13.37344 0-24.19712-10.84416-24.19712-24.19712V554.15808c0-46.27456 4.6592-88.73984 13.84448-126.22848 9.4208-38.44096 23.87968-72.04864 42.96704-99.90144 19.64032-28.6208 44.20608-51.07712 73.02144-66.72384 29.00992-15.73888 62.74048-23.72608 100.25984-23.72608 13.34272 0 24.17664 10.83392 24.17664 24.19712zM783.09376 384.52224c13.3632 0 24.19712-10.84416 24.19712-24.19712V261.77536c0-13.3632-10.83392-24.19712-24.19712-24.19712-37.50912 0-71.23968 7.9872-100.2496 23.72608-28.81536 15.64672-53.39136 38.10304-73.03168 66.72384-19.08736 27.8528-33.54624 61.46048-42.96704 99.91168-9.17504 37.49888-13.83424 79.96416-13.83424 126.21824v208.0768c0 13.3632 10.83392 24.19712 24.19712 24.19712h205.8752c13.3632 0 24.19712-10.84416 24.19712-24.19712V554.15808c0-13.3632-10.83392-24.19712-24.19712-24.19712h-76.1344c3.54304-96.5325 29.10208-145.43872 76.12416-145.43872z" />
                </svg>
                <span class="sc-card-prompt-text">{{ skill.prompt }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredCatalogSkills.length === 0" class="sc-empty">
          {{ catalogLocale.ui.noResults(catalogQuery) }}
          <button class="sc-empty-clear" @click="catalogQuery = ''">{{ catalogLocale.ui.clear }}</button>
        </div>

        <!-- Expand / collapse -->
        <div v-if="filteredCatalogSkills.length > catalogCap" class="sc-expand-row">
          <button class="sc-expand-btn" @click="catalogExpanded = !catalogExpanded">
            {{
              catalogExpanded
                ? catalogLocale.ui.collapse
                : catalogLocale.ui.showMore(filteredCatalogSkills.length - catalogCap)
            }}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              :style="{ transform: catalogExpanded ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Capability Reference -->
    <section class="section">
      <div class="section-inner">
        <div style="max-width: 640px; margin-bottom: 40px">
          <span class="eyebrow">{{ content.cap.eyebrow }}</span>
          <h2 class="h-section" style="margin-top: 14px">{{ content.cap.title }}</h2>
          <p class="t-meta" style="margin-top: 10px; line-height: 1.55">
            {{ content.cap.desc }}
          </p>
        </div>
        <div class="skill-cap-grid">
          <div v-for="g in capGroups" :key="g.tKey" class="skill-cap-col">
            <h3 class="h-card" style="font-size: 14px; color: var(--lb-fg-1)">{{ g.label }}</h3>
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
          <span class="eyebrow">{{ content.cases.eyebrow }}</span>
          <h2 class="h-section" style="margin-top: 14px">{{ content.cases.title }}</h2>
          <p class="t-meta" style="margin-top: 10px; line-height: 1.55">
            {{ content.cases.desc }}
          </p>
        </div>

        <div class="user-cases-grid">
          <a href="https://longbridge.com/topics/39630019" target="_blank" rel="noreferrer" class="user-case-award">
            <div class="user-case-award-tag">
              <span>{{ content.cases.award.tag }}</span>
              <span class="user-case-award-tag-line"></span>
            </div>
            <div>
              <h3 class="user-case-award-h">{{ content.cases.award.title }}</h3>
              <p class="user-case-award-d">{{ content.cases.award.desc }}</p>
            </div>
            <div class="user-case-award-rewards">
              <div>
                <div class="user-case-award-num">10,000</div>
                <div class="user-case-award-l">{{ content.cases.award.taskCoins }}</div>
              </div>
              <div>
                <div class="user-case-award-num">AirPods 4</div>
                <div class="user-case-award-l">{{ content.cases.award.perWinner }}</div>
              </div>
            </div>
          </a>

          <a v-for="(c, i) in USER_CASES" :key="c.id" :href="c.href" target="_blank" rel="noreferrer" class="user-case">
            <div class="user-case-head">
              <span class="user-case-idx">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="user-case-read">
                {{ content.cases.read }}
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
            <h3 class="user-case-title">{{ (content.cases as any).items?.[i]?.title ?? c.title }}</h3>
            <p class="user-case-desc">{{ (content.cases as any).items?.[i]?.desc ?? c.desc }}</p>
            <div class="user-case-metric">
              <span class="user-case-metric-v" :style="{ color: c.accent }">{{ c.metric }}</span>
              <span class="user-case-metric-l">{{
                (content.cases as any).items?.[i]?.metricLabel ?? c.metricLabel
              }}</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Get Started -->
    <section class="section" style="border-top: 1px solid var(--app-card-stroke); background: var(--app-canvas)">
      <div class="section-inner">
        <div style="text-align: center; max-width: 560px; margin: 0 auto">
          <span class="eyebrow">{{ content.getstarted.eyebrow }}</span>
          <h2 class="h-section" style="margin-top: 14px">{{ content.getstarted.title }}</h2>
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
            <h3 class="h-card" style="margin-top: 16px">{{ content.getstarted.card1.title }}</h3>
            <p class="t-meta" style="margin-top: 8px; line-height: 1.55; flex: 1">
              {{ content.getstarted.card1.desc }}
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
            <span class="skill-getstarted-badge">{{ content.getstarted.recommended }}</span>
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
            <h3 class="h-card" style="margin-top: 16px">{{ content.getstarted.card2.title }}</h3>
            <p class="t-meta" style="margin-top: 8px; line-height: 1.55; flex: 1">
              {{ content.getstarted.card2.desc }}
            </p>
            <a
              class="btn btn-primary"
              style="margin-top: 14px; align-self: flex-start"
              href="/skill/longbridge-all.zip"
              target="_blank">
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
              {{ content.getstarted.card2.cta }}
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
            <h3 class="h-card" style="margin-top: 16px">{{ content.getstarted.card3.title }}</h3>
            <p class="t-meta" style="margin-top: 8px; line-height: 1.55; flex: 1">
              {{ content.getstarted.card3.desc }}
            </p>
            <div class="skill-getstarted-cmd">
              <code><span style="color: var(--lb-brand)">$</span> npx skills add longbridge/skills -g</code>
            </div>
          </div>
        </div>

        <div class="skill-getstarted-foot">
          {{ content.getstarted.footer.also }}
          <a href="https://www.skills.sh/longbridge/skills" target="_blank">skills.sh</a>
          {{ content.getstarted.footer.and }} <a href="https://github.com/longbridge/skills" target="_blank">GitHub</a>.
          <span style="color: var(--lb-fg-3)">·</span>
          <a :href="localePfx + '/skill/install'" style="color: var(--lb-brand); font-weight: 600">
            {{ content.getstarted.footer.guide }}
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

  <!-- Skill Catalog Modal -->
  <Teleport to="body">
    <Transition name="sc-modal">
      <div v-if="openCatalogSkill" class="sc-modal-backdrop" @click.self="openCatalogSkill = null">
        <div class="sc-modal">
          <!-- Header -->
          <div class="sc-modal-head">
            <svg class="sc-modal-deco" width="180" height="180" viewBox="0 0 24 24">
              <path d="M12 1.5 L14 10 L22 12 L14 14 L12 22.5 L10 14 L2 12 L10 10 Z" fill="#00b8b8" />
            </svg>
            <button class="sc-modal-close" @click="openCatalogSkill = null" aria-label="关闭">×</button>
            <div class="sc-modal-hero">
              <div class="sc-modal-icon" v-html="CAT_ICONS[openCatalogSkill.cat] ?? CAT_ICONS.meta"></div>
              <div>
                <h2 class="sc-modal-title">{{ openCatalogSkill.name }}</h2>
                <div class="sc-modal-meta">
                  <code>{{ openCatalogSkill.pkg }}</code>
                  <span class="sc-modal-dot">·</span>
                  <span>{{ catalogLocale.ui.catLabels[openCatalogSkill.cat] }}</span>
                  <span class="sc-modal-dot">·</span>
                  <span>{{ openCatalogSkill.tools }} {{ content.catalog.tools }}</span>
                </div>
              </div>
            </div>
            <p class="sc-modal-desc">{{ openCatalogSkill.desc }}</p>
            <div class="sc-modal-actions">
              <a
                class="sc-modal-btn-outline"
                :href="`https://github.com/longbridge/skills/blob/main/skills/${openCatalogSkill.pkg}/SKILL.md`"
                target="_blank"
                rel="noreferrer">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.18c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.18a10.94 10.94 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
                </svg>
                {{ content.catalog.viewSkill }}
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round">
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </a>
              <a class="sc-modal-btn-outline" :href="`${siteHostname}/skill/${openCatalogSkill.pkg}.zip`">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                {{ content.catalog.downloadZip }}
              </a>
            </div>
          </div>

          <!-- Body -->
          <div class="sc-modal-body">
            <!-- Install section -->
            <div class="sc-modal-section">
              <div class="sc-modal-client-tabs">
                <button
                  v-for="(v, key) in INSTALL_CLIENTS"
                  v-show="key === 'cli' || key === 'manual'"
                  :key="key"
                  class="sc-modal-client-tab"
                  :class="{ 'sc-modal-client-tab--active': installClient === key }"
                  @click="installClient = key">
                  {{ v.label }}
                </button>
              </div>
              <div class="sc-modal-section-hd">
                <span class="sc-modal-section-label">{{ content.catalog.install }}</span>
                <span class="sc-modal-section-hint">{{ content.catalog.installHint }}</span>
              </div>
              <div class="sc-modal-cmd-block">
                <code
                  class="sc-modal-cmd-text"
                  :class="{ 'sc-modal-cmd-text--multi': INSTALL_CLIENTS[installClient].cmd.includes('\n') }"
                  >{{ INSTALL_CLIENTS[installClient].cmd }}</code
                >
                <button class="sc-modal-cmd-copy" @click="handleModalCopy(INSTALL_CLIENTS[installClient].cmd, 'inst')">
                  <svg
                    v-if="modalCopiedKey === 'inst'"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#00b88a"
                    stroke-width="2.6"
                    stroke-linecap="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <svg
                    v-else
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round">
                    <rect x="9" y="9" width="11" height="11" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Upgrade / Verify section -->
            <div class="sc-modal-section">
              <div class="sc-modal-section-hd">
                <span class="sc-modal-section-label">{{
                  content.catalog.upgradeVerify(INSTALL_CLIENTS[installClient].label)
                }}</span>
              </div>
              <div class="sc-modal-labeled-cmd">
                <div class="sc-modal-cmd-label">{{ content.catalog.upgradeTo }}</div>
                <div class="sc-modal-cmd-block">
                  <code class="sc-modal-cmd-text">{{ INSTALL_CLIENTS[installClient].upgrade }}</code>
                  <button
                    class="sc-modal-cmd-copy"
                    @click="handleModalCopy(INSTALL_CLIENTS[installClient].upgrade, 'upg')">
                    <svg
                      v-if="modalCopiedKey === 'upg'"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#00b88a"
                      stroke-width="2.6"
                      stroke-linecap="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <svg
                      v-else
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round">
                      <rect x="9" y="9" width="11" height="11" rx="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="sc-modal-labeled-cmd">
                <div class="sc-modal-cmd-label">{{ content.catalog.verifyInstalled }}</div>
                <div class="sc-modal-cmd-block">
                  <code class="sc-modal-cmd-text">{{ INSTALL_CLIENTS[installClient].verify }}</code>
                  <button
                    class="sc-modal-cmd-copy"
                    @click="handleModalCopy(INSTALL_CLIENTS[installClient].verify, 'ver')">
                    <svg
                      v-if="modalCopiedKey === 'ver'"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#00b88a"
                      stroke-width="2.6"
                      stroke-linecap="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <svg
                      v-else
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round">
                      <rect x="9" y="9" width="11" height="11" rx="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Uninstall section -->
            <div class="sc-modal-section">
              <div class="sc-modal-section-hd">
                <span class="sc-modal-section-label">{{
                  content.catalog.uninstall(INSTALL_CLIENTS[installClient].label)
                }}</span>
                <span class="sc-modal-section-hint">{{ content.catalog.uninstallHint }}</span>
              </div>
              <div class="sc-modal-cmd-block">
                <code class="sc-modal-cmd-text">{{ INSTALL_CLIENTS[installClient].uninstall }}</code>
                <button
                  class="sc-modal-cmd-copy"
                  @click="handleModalCopy(INSTALL_CLIENTS[installClient].uninstall, 'uni')">
                  <svg
                    v-if="modalCopiedKey === 'uni'"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#00b88a"
                    stroke-width="2.6"
                    stroke-linecap="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <svg
                    v-else
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round">
                    <rect x="9" y="9" width="11" height="11" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </div>
              <ul class="sc-modal-notes">
                <li>
                  {{ content.catalog.uninstallNote1 }}
                  <code>~/.skills/{{ openCatalogSkill.pkg }}/</code>
                  {{ content.catalog.uninstallNote1End }}
                </li>
                <li>{{ content.catalog.uninstallNote2 }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
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

/* ─── Skills Catalog ──────────────────────────────────────────────────────── */
.sc-header {
  margin-bottom: 24px;
}
.sc-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 9px;
  border-radius: 999px;
  background: rgba(0, 184, 184, 0.1);
  color: #00b8b8;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  margin-bottom: 10px;
}
.dark .sc-badge {
  background: rgba(0, 184, 184, 0.15);
}

/* Toolbar */
.sc-toolbar {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--app-card-stroke);
}
@media (max-width: 600px) {
  .sc-toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }
}
.sc-tabs-wrap {
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
}
.sc-tabs-wrap::-webkit-scrollbar {
  display: none;
}
.sc-tabs {
  display: flex;
  gap: 2px;
  position: relative;
}
.sc-tab {
  padding: 8px 9px;
  border: 0;
  background: transparent;
  font: inherit;
  cursor: pointer;
  white-space: nowrap;
  color: var(--lb-fg-3);
  font-size: 13px;
  font-weight: 500;
  transition: color 0.15s;
}
.sc-tab:hover {
  color: var(--lb-fg-1);
}
.sc-tab--active {
  color: var(--lb-fg-1);
  font-weight: 600;
}
.sc-tabs-indicator {
  position: absolute;
  bottom: 0;
  height: 2px;
  background: var(--lb-brand);
  border-radius: 1px;
  transition:
    left 0.2s ease,
    width 0.2s ease;
  pointer-events: none;
}
.sc-tab-count {
  margin-left: 5px;
  font-size: 11px;
  color: var(--lb-fg-3);
  font-variant-numeric: tabular-nums;
  padding: 1px 6px;
  border-radius: 999px;
  background: var(--lb-bg-2);
}
.sc-tab--active .sc-tab-count {
  background: rgba(0, 184, 184, 0.12);
  color: #00b8b8;
}
.dark .sc-tab--active .sc-tab-count {
  background: rgba(0, 184, 184, 0.18);
}

/* Search */
.sc-search-wrap {
  flex: 0 0 140px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  border-radius: 7px;
  background: var(--lb-bg-2);
  margin-bottom: 6px;
}
@media (max-width: 600px) {
  .sc-search-wrap {
    flex: 0 0 auto;
    margin: 8px 0;
  }
}
.sc-search-icon {
  color: var(--lb-fg-3);
  flex-shrink: 0;
  transition: color 0.18s;
}
.sc-search-wrap:focus-within .sc-search-icon {
  color: var(--lb-brand);
}
.sc-search-input {
  flex: 1;
  border: 0;
  outline: none;
  background: transparent;
  font: inherit;
  font-size: 12.5px;
  color: var(--lb-fg-1);
  min-width: 0;
}
.sc-search-clear {
  border: 0;
  background: transparent;
  cursor: pointer;
  color: var(--lb-fg-3);
  font-size: 14px;
  padding: 0 2px;
  line-height: 1;
}

/* Grid */
.sc-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  animation: sc-grid-in 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
@media (max-width: 960px) {
  .sc-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 600px) {
  .sc-grid {
    grid-template-columns: 1fr;
  }
}
@keyframes sc-grid-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* Card */
.sc-card {
  line-height: 16px;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: var(--lb-card);
  border: 1px solid var(--app-card-stroke);
  border-radius: 10px;
  cursor: pointer;
  transition:
    transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 0.25s;
  animation: sc-card-in 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) both;
  animation-delay: calc(var(--sc-i, 0) * 30ms);
}
@keyframes sc-card-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.sc-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(43, 62, 92, 0.12);
}
.dark .sc-card:hover {
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
}
.sc-ripple {
  position: absolute;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 184, 184, 0.4) 0%, rgba(0, 184, 184, 0.16) 45%, transparent 75%);
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 0;
  z-index: 0;
}
.sc-card-inner {
  position: relative;
  z-index: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  height: 100%;
  box-sizing: border-box;
}
.sc-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.sc-card-title {
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
  min-width: 0;
}
.sc-card-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--lb-fg-1);
  line-height: 1.4;
  white-space: nowrap;
}
.sc-card-pkg {
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  color: var(--lb-fg-3);
  white-space: nowrap;
}
.sc-card-tag {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 999px;
  flex-shrink: 0;
}
.sc-card-tag--hot {
  background: rgba(245, 158, 11, 0.12);
  color: rgb(217, 119, 6);
}
.dark .sc-card-tag--hot {
  background: rgba(245, 158, 11, 0.18);
  color: rgb(245, 158, 11);
}
.sc-card-tag--risk {
  background: rgba(255, 80, 0, 0.1);
  color: #ff5000;
}
.sc-card-tag--default {
  background: var(--lb-bg-2);
  color: var(--lb-fg-2);
}
.sc-card-arrow {
  color: var(--lb-fg-3);
  flex-shrink: 0;
  margin-top: 2px;
  transition:
    transform 0.2s,
    color 0.2s;
}
.sc-card:hover .sc-card-arrow {
  color: var(--lb-brand);
  transform: translateX(3px);
}
.sc-card-desc {
  font-size: 12px;
  line-height: 1.6;
  color: var(--lb-fg-2);
  flex: 1;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.sc-card-prompt {
  display: flex;
  align-items: flex-start;
  gap: 5px;
  background: var(--lb-bg-2);
  border-radius: 6px;
  padding: 8px 10px;
}
.sc-card-prompt-text {
  font-size: 12px;
  line-height: 1.5;
  color: var(--lb-fg-2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Empty */
.sc-empty {
  padding: 40px 16px;
  text-align: center;
  color: var(--lb-fg-3);
  font-size: 13px;
  border: 1px dashed var(--app-card-stroke);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
}
.sc-empty-clear {
  border: 0;
  background: transparent;
  color: var(--lb-brand);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  padding: 0;
}

/* Expand */
.sc-expand-row {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
.sc-expand-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 999px;
  border: 1px solid var(--app-card-stroke);
  background: var(--lb-card);
  color: var(--lb-fg-1);
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s;
}
.sc-expand-btn:hover {
  border-color: var(--lb-brand);
}

/* Plugin bar */
.sc-plugin-bar {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 10px;
  background: rgba(245, 158, 11, 0.08);
  flex-wrap: wrap;
}
.dark .sc-plugin-bar {
  background: rgba(245, 158, 11, 0.12);
}
.sc-plugin-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.sc-plugin-icon {
  width: 45px;
  height: 45px;
  border-radius: 8px;
  background: rgba(245, 158, 11, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.sc-plugin-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--lb-fg-1);
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.sc-plugin-badge {
  font-size: 9px;
  line-height: 14px;
  padding: 1px 5px;
  background: rgb(245, 158, 11);
  color: #fff;
  letter-spacing: 0.04em;
}
.sc-plugin-desc {
  font-size: 12px;
  color: var(--lb-fg-2);
  margin-top: 3px;
  line-height: 1.5;
}
.sc-plugin-right {
  flex-shrink: 0;
}
@media (max-width: 600px) {
  .sc-plugin-right {
    width: 100%;
  }
}
.sc-plugin-cmd-block {
  position: relative;
  padding: 10px 12px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.045);
}
.dark .sc-plugin-cmd-block {
  background: rgba(255, 255, 255, 0.045);
}
.sc-plugin-cmd-lines {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  font-size: 12px;
  font-family: var(--vp-font-family-mono);
  color: var(--lb-fg-1);
  white-space: nowrap;
  overflow-x: auto;
}
.sc-plugin-cmd-lines code {
  background: transparent;
  padding: 0;
  border-radius: 0;
}
.sc-plugin-kw {
  color: #e09765;
}

/* Modal */
.sc-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 14, 25, 0.55);
  backdrop-filter: blur(2px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
@media (max-width: 600px) {
  .sc-modal-backdrop {
    padding: 0;
    align-items: flex-end;
  }
}
.sc-modal {
  width: 100%;
  max-width: 760px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: var(--lb-card);
  border: 1px solid var(--app-card-stroke);
  border-radius: 16px;
  box-shadow:
    0 20px 60px -10px rgba(0, 0, 0, 0.35),
    0 8px 24px rgba(0, 0, 0, 0.18);
  color: var(--lb-fg-1);
  overflow: clip;
}
@media (max-width: 600px) {
  .sc-modal {
    max-height: 85vh;
    border-radius: 16px 16px 0 0;
  }
}
.sc-modal-head {
  padding: 24px 28px 20px;
  position: relative;
  overflow: visible;
  background: linear-gradient(135deg, rgba(0, 184, 184, 0.1) 0%, transparent 70%);
  border-bottom: 1px solid var(--app-card-stroke);
  flex-shrink: 0;
}
@media (max-width: 600px) {
  .sc-modal-head {
    padding: 20px 20px 16px;
  }
}
.dark .sc-modal-head {
  background: linear-gradient(135deg, rgba(0, 184, 184, 0.18) 0%, transparent 70%);
}
.sc-modal-deco {
  position: absolute;
  top: -40px;
  right: -40px;
  opacity: 0.07;
  pointer-events: none;
}
.dark .sc-modal-deco {
  opacity: 0.1;
}
.sc-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 0;
  background: rgba(0, 0, 0, 0.05);
  color: var(--lb-fg-2);
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dark .sc-modal-close {
  background: rgba(255, 255, 255, 0.06);
}
.sc-modal-close:hover {
  background: rgba(0, 0, 0, 0.1);
}
.dark .sc-modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
}
.sc-modal-hero {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}
.sc-modal-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  flex-shrink: 0;
  background: rgba(0, 184, 184, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}
.dark .sc-modal-icon {
  background: rgba(0, 184, 184, 0.18);
}
.sc-modal-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--lb-fg-1);
  margin: 0 0 6px;
  line-height: 1.2;
}
@media (max-width: 600px) {
  .sc-modal-title {
    font-size: 18px;
  }
}
.sc-modal-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--lb-fg-3);
}
.sc-modal-meta code {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--lb-fg-3);
}
.sc-modal-dot {
  opacity: 0.4;
}
.sc-modal-desc {
  font-size: 14px;
  line-height: 1.6;
  color: var(--lb-fg-2);
  margin: 0 0 16px;
  max-width: 580px;
}
.sc-modal-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.sc-modal-btn-outline {
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid var(--app-card-stroke);
  background: transparent;
  color: var(--lb-fg-1);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s;
}
.sc-modal-btn-outline:hover {
  background: var(--lb-bg-2);
}
.sc-modal-body {
  padding: 22px 28px 28px;
  overflow-y: auto;
  flex: 1;
}
@media (max-width: 600px) {
  .sc-modal-body {
    padding: 16px 20px 24px;
  }
}
.sc-modal-section {
  margin-bottom: 22px;
}
.sc-modal-section:last-child {
  margin-bottom: 0;
}
.sc-modal-section-hd {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}
.sc-modal-section-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--lb-fg-3);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.sc-modal-section-hint {
  font-size: 11px;
  color: var(--lb-fg-3);
  text-align: right;
}
.sc-modal-client-tabs {
  display: flex;
  gap: 2px;
  border-bottom: 1px solid var(--app-card-stroke);
  margin-bottom: 12px;
  overflow-x: auto;
}
.sc-modal-client-tab {
  padding: 8px 12px;
  border: 0;
  background: transparent;
  color: var(--lb-fg-2);
  font-weight: 500;
  border-bottom: 2px solid transparent;
  font-size: 12.5px;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  transition: color 0.15s;
  margin-bottom: -1px;
}
.sc-modal-client-tab--active {
  color: var(--lb-fg-1);
  font-weight: 600;
  border-bottom-color: var(--lb-brand);
}
.sc-modal-cmd-block {
  position: relative;
  padding: 10px 42px 10px 14px;
  border-radius: 8px;
  background: var(--lb-bg-2);
}
.sc-modal-cmd-text {
  display: block;
  font-size: 12px;
  font-family: var(--vp-font-family-mono);
  color: var(--lb-fg-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sc-modal-cmd-text--multi {
  white-space: pre;
  overflow-x: auto;
}
.sc-modal-cmd-copy {
  position: absolute;
  top: 8px;
  right: 6px;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 0;
  background: transparent;
  color: var(--lb-fg-3);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.sc-modal-cmd-copy:hover {
  background: rgba(0, 0, 0, 0.06);
}
.dark .sc-modal-cmd-copy:hover {
  background: rgba(255, 255, 255, 0.08);
}
.sc-modal-labeled-cmd {
  margin-bottom: 10px;
}
.sc-modal-labeled-cmd:last-child {
  margin-bottom: 0;
}
.sc-modal-cmd-label {
  font-size: 12px;
  color: var(--lb-fg-2);
  margin-bottom: 6px;
}
.sc-modal-notes {
  margin: 10px 0 0;
  font-size: 12.5px;
  color: var(--lb-fg-2);
  line-height: 1.7;
}
.sc-modal-notes code {
  font-family: var(--vp-font-family-mono);
  font-size: 11.5px;
  color: var(--lb-fg-3);
}

/* Transitions */
.sc-modal-enter-active {
  transition: opacity 0.18s ease-out;
}
.sc-modal-leave-active {
  transition: opacity 0.15s;
}
.sc-modal-enter-from,
.sc-modal-leave-to {
  opacity: 0;
}
.sc-modal-enter-active .sc-modal,
.sc-modal-leave-active .sc-modal {
  transition: transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.sc-modal-enter-from .sc-modal {
  transform: translateY(12px) scale(0.98);
}
.sc-modal-leave-to .sc-modal {
  transform: scale(0.97);
}
@media (max-width: 600px) {
  .sc-modal-enter-from .sc-modal {
    transform: translateY(40px);
  }
  .sc-modal-leave-to .sc-modal {
    transform: translateY(20px);
  }
}

@media (max-width: 640px) {
  .skill-hero-install-cmd {
    max-width: 100%;
  }
  .skill-demo-chat-body {
    overflow-x: auto;
  }
  .skill-demo-chat-head {
    overflow: hidden;
  }
  .skill-demo-chat-head span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }
}
</style>
