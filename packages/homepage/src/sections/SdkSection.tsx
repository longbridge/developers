import { useMemo, useState } from 'react'
import type { Locale } from '@longbridge/openapi-utils'
import { CopyButton } from './CopyButton'

// 1:1 port of the legacy VitePress "OpenAPI SDK" section (NewHomePage/index.vue
// section #8, `.sdk-*`). Markup, copy, code samples, highlighter, and CSS
// mirror the legacy source. Section-specific `.sdk-*` rules are copied
// verbatim from the theme's app-styles.css; no `.lb-dark` variants exist for
// them, so no dark-mode selector translation was needed. Every token
// referenced here exists in src/styles/tokens.css with the legacy values.
//
// Interactions mirror the legacy refs/computeds: the language tabs drive
// `sdkLang`, the action tabs drive `sdkTab`, and the sample / highlighted
// lines / file name / install command all derive from that state. The two
// copy buttons call `copyToClipboard` exactly as legacy did (no visual
// "copied" feedback). Defaults ('Python' / 'Get Quote') render the same markup
// on the server and on the first client render, so hydration is stable.

const LOCALE = {
  en: {
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
  'zh-CN': {
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
  'zh-HK': {
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
}

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

// Legacy `formatLine` read the reactive `sdkLang`; here the language is passed in.
function formatLine(text: string, lang: string): string {
  if (!text.trim()) return '&nbsp;'
  return lang === 'Python' ? highlightPython(text) : highlightGeneric(text, lang)
}

// Verbatim from the legacy theme's app-styles.css (`/* SDK section */` block).
const SDK_CSS = `
/* SDK section */
.sdk-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 24px;
  justify-content: center;
}
.sdk-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid var(--app-card-stroke);
  background: var(--lb-card);
  font-size: 13.5px;
  font-weight: 600;
  color: var(--lb-fg-2);
  cursor: pointer;
  font-family: inherit;
  transition: all var(--lb-transition-fast);
}
.sdk-tab:hover {
  color: var(--lb-fg-1);
  border-color: var(--app-card-stroke-strong);
}
.sdk-tab.is-active {
  background: var(--lb-fg-1);
  color: var(--lb-fg-invert);
  border-color: var(--lb-fg-1);
}
.sdk-tab-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
}
.sdk-tab.is-active .sdk-tab-dot {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--lb-fg-1) 50%, transparent);
}
.sdk-frame {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 16px;
  padding: 16px;
  background: var(--app-canvas);
  border: 1px solid var(--app-card-stroke);
  border-radius: 16px;
}
@media (max-width: 980px) {
  .sdk-frame {
    grid-template-columns: 1fr;
  }
}
.sdk-frame-l {
  display: flex;
  flex-direction: column;
  min-height: 380px;
  min-width: 0;
  overflow: hidden;
}
.sdk-action-tabs {
  display: flex;
  gap: 2px;
  padding: 3px;
  background: var(--lb-bg-2);
  border-radius: 8px;
  align-self: flex-start;
}
.sdk-action-tab {
  padding: 6px 14px;
  font-size: 12.5px;
  font-weight: 500;
  border-radius: 5px;
  background: transparent;
  border: none;
  color: var(--lb-fg-2);
  cursor: pointer;
  font-family: inherit;
}
.sdk-action-tab.is-active {
  background: var(--lb-bg-1);
  color: var(--lb-fg-1);
  box-shadow: var(--app-shadow-1);
}
.sdk-install {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  padding: 10px 14px;
  background: var(--lb-card);
  border: 1px solid var(--app-card-stroke);
  border-radius: 8px;
  overflow: hidden;
}
.sdk-install code {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sdk-frame-r {
  display: grid;
  gap: 12px;
  align-content: start;
}
.sdk-feat {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  background: var(--lb-card);
  border: 1px solid var(--app-card-stroke);
  border-radius: 10px;
}
.sdk-feat-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
}
.sdk-feat-h {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--lb-fg-1);
}
.sdk-feat-body {
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--lb-fg-2);
  margin-top: 4px;
}
.sdk-feat-pills {
  display: flex;
  gap: 4px;
  margin-top: 6px;
  flex-wrap: wrap;
}
.sdk-feat-pills span {
  font-family: var(--app-mono);
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 3px;
  background: var(--lb-bg-2);
  color: var(--lb-fg-1);
}
.sdk-feat-strong {
  font-size: 18px;
  font-weight: 700;
  color: var(--lb-up);
  margin-top: 6px;
  letter-spacing: -0.02em;
}
`

interface SdkSectionProps {
  locale: Locale
}

function localePath(locale: Locale, path: string) {
  if (locale === 'en') return path
  return `/${locale}${path}`
}

export function SdkSection({ locale }: SdkSectionProps) {
  const content = LOCALE[locale] ?? LOCALE.en
  // Legacy `ref('Python')` / `ref('Get Quote')`.
  const [sdkLang, setSdkLang] = useState('Python')
  const [sdkTab, setSdkTab] = useState('Get Quote')
  // Legacy computeds `currentSdkSample` / `currentSdkLang`, plus the inline file-name expression.
  const currentSdkSample = SDK_SAMPLES[sdkTab]?.[sdkLang] ?? ''
  const currentSdkLang = SDK_LANGUAGES.find((l) => l.name === sdkLang)
  const fileName = `${sdkTab.toLowerCase().replace(/ /g, '_')}.${fileExt[sdkLang] ?? 'py'}`
  // Legacy `currentSdkLines` computed with `formatLine` applied per line; re-highlighted only when
  // the selected tab/language changes.
  const currentSdkLines = useMemo(
    () => (SDK_SAMPLES[sdkTab]?.[sdkLang] ?? '').split('\n').map((line) => formatLine(line, sdkLang)),
    [sdkLang, sdkTab],
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SDK_CSS }} />
      <section data-lbus-component="sdk-section" className="section">
        <div className="section-inner">
          <div style={{ maxWidth: '640px', marginBottom: '40px' }}>
            <span className="eyebrow">{content.eyebrow}</span>
            <h2 className="h-section" style={{ marginTop: '16px' }}>
              {content.title}
            </h2>
            <p className="t-body" style={{ marginTop: '14px' }}>
              {content.desc}
            </p>
          </div>

          <div className="sdk-tabs">
            {SDK_LANGUAGES.map((l) => (
              <button
                key={l.name}
                className={l.name === sdkLang ? 'sdk-tab is-active' : 'sdk-tab'}
                onClick={() => setSdkLang(l.name)}>
                <span className="sdk-tab-dot" style={{ background: l.color }} />
                {l.name}
              </button>
            ))}
          </div>

          <div className="sdk-frame">
            <div className="sdk-frame-l">
              <div className="sdk-action-tabs">
                {Object.keys(SDK_SAMPLES).map((t) => (
                  <button
                    key={t}
                    className={t === sdkTab ? 'sdk-action-tab is-active' : 'sdk-action-tab'}
                    onClick={() => setSdkTab(t)}>
                    {t}
                  </button>
                ))}
              </div>
              <div className="code" style={{ marginTop: '12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className="code-head">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: 'var(--lb-fg-3)' }}>
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                  <span style={{ fontSize: '11.5px', color: 'var(--lb-fg-3)' }}>{fileName}</span>
                  <CopyButton text={currentSdkSample} />
                </div>
                <div className="code-body" style={{ flex: 1 }}>
                  {currentSdkLines.map((html, idx) => (
                    <div key={idx} dangerouslySetInnerHTML={{ __html: html }} />
                  ))}
                </div>
              </div>
              <div className="sdk-install">
                <span
                  style={{
                    fontSize: '11.5px',
                    color: 'var(--lb-fg-3)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    fontWeight: 600,
                  }}>
                  {currentSdkLang?.installer}
                </span>
                <code style={{ flex: 1, fontFamily: 'var(--app-mono)', fontSize: '13px', color: 'var(--lb-fg-1)' }}>
                  {currentSdkLang?.cmd}
                </code>
                <CopyButton text={currentSdkLang?.cmd || ''} />
              </div>
            </div>

            <div className="sdk-frame-r">
              {/* Multi-Market */}
              <div className="sdk-feat">
                <div
                  className="sdk-feat-icon"
                  style={{
                    background: 'color-mix(in srgb, var(--lb-status-neutral) 14%, transparent)',
                    color: 'var(--lb-status-neutral)',
                  }}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z" />
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="sdk-feat-h">{content.feats[0].h}</div>
                  <div className="sdk-feat-body">
                    {content.feats[0].body}
                    <div className="sdk-feat-pills">
                      {['US', 'HK', 'SG', 'CN'].map((m) => (
                        <span key={m}>{m}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Free & Paper Trading */}
              <div className="sdk-feat">
                <div
                  className="sdk-feat-icon"
                  style={{ background: 'color-mix(in srgb, var(--lb-up) 14%, transparent)', color: 'var(--lb-up)' }}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="sdk-feat-h">{content.feats[1].h}</div>
                  <div className="sdk-feat-body">
                    {content.feats[1].body}
                    {content.feats[1].strong && <div className="sdk-feat-strong">{content.feats[1].strong}</div>}
                  </div>
                </div>
              </div>
              {/* Real-time Push */}
              <div className="sdk-feat">
                <div
                  className="sdk-feat-icon"
                  style={{
                    background: 'color-mix(in srgb, var(--lb-ai-mention) 14%, transparent)',
                    color: 'var(--lb-ai-mention)',
                  }}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="sdk-feat-h">{content.feats[2].h}</div>
                  <div className="sdk-feat-body" dangerouslySetInnerHTML={{ __html: content.feats[2].body }} />
                </div>
              </div>
              {/* OAuth 2.0 */}
              <div className="sdk-feat">
                <div
                  className="sdk-feat-icon"
                  style={{
                    background: 'color-mix(in srgb, var(--lb-chart-purple) 14%, transparent)',
                    color: 'var(--lb-chart-purple)',
                  }}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <circle cx="7" cy="15" r="4" />
                    <path d="m10 12 9-9 3 3-3 3 3 3-3 3-3-3-3 3" />
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="sdk-feat-h">{content.feats[3].h}</div>
                  <div className="sdk-feat-body">{content.feats[3].body}</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
            <a className="btn btn-outline btn-lg" href={localePath(locale, '/docs')}>
              {content.cta}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
