/**
 * SkillDemoSection.tsx
 * 1:1 port of the legacy VitePress `Skill.vue` DEMO section
 * ("See what Skill can do for you.") — template lines 1568–1662.
 * Styles live in ../Skill.css (scoped under `.skill-page-root`).
 */
import { useMemo, useState } from 'react'
import type { Locale } from '@longbridge/openapi-utils'

// ── Inline i18n (legacy `LOCALE.<locale>.demo` + `.demos`) ────────────────────

type ScenarioOverride = {
  nav?: string
  title?: string
  desc?: string
  prompt?: string
  summary?: string
  tableHead?: string[]
  callout?: string
}

type DemoLocale = {
  demo: { title: string; desc: string; tryAsking: string }
  demos?: ScenarioOverride[]
}

const LOCALE: Record<Locale, DemoLocale> = {
  en: {
    demo: {
      title: 'See what Skill can do for you.',
      desc: 'Pick a scenario to see your AI assistant in action.',
      tryAsking: 'Try asking',
    },
  },
  'zh-CN': {
    demo: {
      title: '看看 Skill 能为您做什么',
      desc: '选择一个场景，观看 AI 助手实际操作。',
      tryAsking: '试着问',
    },
    demos: [
      {
        nav: '跨市场选股',
        title: 'HK · 美股 · A 股 · 新加坡——一次筛选，全市场覆盖',
        desc: '跨市场追踪机会繁琐易错。告诉 AI 你的条件——市值、PE 区间、板块——再叠加 KDJ 金叉或 MACD 多头等技术信号，跨市场过滤，统一输出结果。查看所有支持市场的<a href="https://longbridge.com/en/markets">实时行情</a>。',
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
    demo: {
      title: '看看 Skill 能為您做什麼',
      desc: '選擇一個場景，觀看 AI 助手實際操作',
      tryAsking: '試著問',
    },
    demos: [
      {
        nav: '跨市場選股',
        title: 'HK · 美股 · A 股 · 新加坡——一次篩選，全市場覆蓋',
        desc: '跨市場追蹤機會繁瑣易錯。告訴 AI 你的條件——市值、PE 區間、板塊——再疊加 KDJ 金叉或 MACD 多頭等技術信號，跨市場過濾，統一輸出結果。查看所有支援市場的<a href="https://longbridge.com/en/markets">即時行情</a>。',
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

// ── Demo data (legacy lines 925–1041) ─────────────────────────────────────────

const DEMO_AGENTS = ['ChatGPT', 'OpenClaw', 'Claude', 'Claude Code']

const DEMO_SCENARIOS = [
  {
    id: 'screen',
    nav: 'Cross-Market Screening',
    title: 'HK · US · A-share · Singapore — multi-market screening in one shot.',
    desc: 'Tracking opportunities across markets is brittle. Tell the AI your criteria — market cap, PE range, sector — and layer in technical signals like KDJ golden cross or MACD bullish. Cross-market filter, unified results. See <a href="https://longbridge.com/en/markets">live market data</a> for all supported markets.',
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

/** Legacy `rowClass(flag)` (lines 1183–1187). */
function rowClass(flag: string | boolean) {
  if (flag === 'best') return 'is-best'
  if (flag === true) return 'is-cross'
  return ''
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SkillDemoSection({ locale }: { locale: Locale }) {
  const content = LOCALE[locale] ?? LOCALE.en

  // Legacy refs `scenarioIdx` (1116) / `activeAgent` (1117).
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [activeAgent, setActiveAgent] = useState('OpenClaw')

  // Legacy computed `scenarios` (1150–1155): per-locale overrides merged over DEMO_SCENARIOS.
  const scenarios = useMemo(() => {
    const localeDemos = content.demos
    if (!localeDemos) return DEMO_SCENARIOS
    return DEMO_SCENARIOS.map((sc, i) => ({ ...sc, ...(localeDemos[i] ?? {}) }))
  }, [content])

  // Legacy computed `activeScenario` (1159).
  const activeScenario = scenarios[scenarioIdx]

  return (
    <section className="section" style={{ paddingTop: 60 }}>
      <div className="section-inner">
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 36px' }}>
          <h2 className="h-section" style={{ marginTop: 0 }}>
            {content.demo.title}
          </h2>
          <p className="t-meta" style={{ marginTop: 12, lineHeight: 1.55 }}>
            {content.demo.desc}
          </p>
        </div>

        <div className="skill-demo-shell">
          <div className="skill-demo-agent-tabs">
            {DEMO_AGENTS.map((a) => (
              <button
                key={a}
                className={a === activeAgent ? 'skill-demo-agent-tab is-active' : 'skill-demo-agent-tab'}
                onClick={() => setActiveAgent(a)}>
                {a}
              </button>
            ))}
          </div>

          <div className="skill-demo-body-grid">
            <aside className="skill-demo-nav">
              {scenarios.map((sc, i) => (
                <button
                  key={sc.id}
                  className={i === scenarioIdx ? 'skill-demo-nav-item is-active' : 'skill-demo-nav-item'}
                  onClick={() => setScenarioIdx(i)}>
                  {sc.nav}
                </button>
              ))}
            </aside>

            <div className="skill-demo-main">
              <h3 className="skill-demo-title">{activeScenario.title}</h3>
              <p className="skill-demo-desc" dangerouslySetInnerHTML={{ __html: activeScenario.desc }} />

              <div className="skill-demo-prompt-label">{content.demo.tryAsking}</div>
              <div className="skill-demo-prompt">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ color: 'var(--lb-brand)', flexShrink: 0, marginTop: 3 }}>
                  <path
                    d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.949 49.949 0 0 0-9.902 3.912l-.003.002-.34.18a.75.75 0 0 1-.707 0A50.009 50.009 0 0 0 7.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.129 56.129 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
                  <path
                    d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 0 1-.46.71 47.878 47.878 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.877 47.877 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 0 1 6 13.18v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 0 0 .551-1.608 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.668 2.25 2.25 0 0 0 2.12 0Z" />
                </svg>
                <span>{activeScenario.prompt}</span>
              </div>

              <div className="skill-demo-chat">
                <div className="skill-demo-chat-head">
                  <span style={{ display: 'flex', gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 999, background: '#ff5f57' }} />
                    <span style={{ width: 10, height: 10, borderRadius: 999, background: '#febc2e' }} />
                    <span style={{ width: 10, height: 10, borderRadius: 999, background: '#28c840' }} />
                  </span>
                  <span style={{ marginLeft: 10, fontSize: 12, fontWeight: 600, color: 'var(--lb-fg-1)' }}>
                    {activeAgent}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--lb-fg-3)' }}>skill: longbridge</span>
                </div>
                <div className="skill-demo-chat-body">
                  <div className="skill-demo-bubble-user">{activeScenario.prompt}</div>

                  <div className="skill-demo-bubble-assistant">
                    <p className="skill-demo-bubble-text">{activeScenario.summary}</p>
                    <table className="skill-demo-table">
                      <thead>
                        <tr>
                          {activeScenario.tableHead.map((h) => (
                            <th key={h}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {activeScenario.tableRows.map((row, i) => (
                          <tr key={i} className={rowClass(row[row.length - 1] as string | boolean)}>
                            {row.slice(0, -1).map((cell, j) => (
                              <td key={j} className={j === 0 ? 'is-sym' : ''}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="skill-demo-callout">{activeScenario.callout}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
