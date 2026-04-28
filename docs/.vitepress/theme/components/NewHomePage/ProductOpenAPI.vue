<script setup lang="ts">
import { ref, computed, onMounted, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import BorderBeam from '../inspira/BorderBeam.vue'
import NumberTicker from '../inspira/NumberTicker.vue'

const { t } = useI18n()

// SDK definitions with logos and install commands
const sdks = [
  {
    id: 'python', label: 'Python', shiki: 'python',
    logo: 'https://assets.lbctrl.com/uploads/50244d9f-f886-4dc5-8ee5-4983d0ecb169/python.svg',
    installs: [
      { mgr: 'pip', cmd: 'pip3 install longbridge' },
      { mgr: 'conda', cmd: 'conda install longbridge' },
    ],
  },
  {
    id: 'nodejs', label: 'Node.js', shiki: 'javascript',
    logo: 'https://assets.lbctrl.com/uploads/1729711f-90d8-4b4d-9047-63a8adabdf20/nodejs.svg',
    installs: [
      { mgr: 'bun', cmd: 'bun add longbridge' },
      { mgr: 'npm', cmd: 'npm install longbridge' },
      { mgr: 'yarn', cmd: 'yarn add longbridge' },
    ],
  },
  {
    id: 'rust', label: 'Rust', shiki: 'rust',
    logo: 'https://assets.lbctrl.com/uploads/f777c482-71bb-45a4-a2fe-5e639bd510cb/rust.svg',
    installs: [{ mgr: 'Cargo.toml', cmd: 'longbridge = "4.0.5"' }],
  },
  {
    id: 'go', label: 'Go', shiki: 'go',
    logo: 'https://assets.lbctrl.com/uploads/37a78e80-f177-4931-a7b3-a12692c478ad/go.svg',
    installs: [{ mgr: 'go get', cmd: 'go get github.com/longbridge/openapi-go' }],
  },
  {
    id: 'java', label: 'Java', shiki: 'java',
    logo: 'https://assets.lbctrl.com/uploads/f5d96da9-8cba-43e4-8eed-f704e52cb413/java.svg',
    installs: [
      { mgr: 'Maven', cmd: 'io.github.longbridge:openapi-sdk:4.0.5' },
      { mgr: 'Gradle', cmd: "implementation 'io.github.longbridge:openapi-sdk:4.0.5'" },
    ],
  },
  {
    id: 'cpp', label: 'C++', shiki: 'cpp',
    logo: 'https://assets.lbctrl.com/uploads/14e521de-8f43-4042-aa4d-659d7b645da4/cplusplus.svg',
    installs: [{ mgr: 'CMake', cmd: 'find_package(longbridge REQUIRED)' }],
  },
]

type SdkId = typeof sdks[number]['id']
const activeSdk = ref<SdkId>('python')

// Business domain tabs — each shows code in the currently selected SDK language
const domains = [
  { key: 'quote' },
  { key: 'trade' },
  { key: 'subscribe' },
  { key: 'portfolio' },
]

// Code examples: domain × SDK (from verified docs)
const codeMap: Record<string, Record<string, string>> = {
  quote: {
    python: `from longbridge.openapi import QuoteContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(
    lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)

resp = ctx.quote(["AAPL.US", "TSLA.US", "NVDA.US", "GOOG.US"])
print(resp)`,
    nodejs: `const { Config, QuoteContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id',
    (_, url) => console.log('Open:', url))
  const config = Config.fromOAuth(oauth)
  const ctx = QuoteContext.new(config)
  const resp = await ctx.quote(['AAPL.US', 'TSLA.US', 'NVDA.US', 'GOOG.US'])
  for (const obj of resp) console.log(obj.toString())
}
main().catch(console.error)`,
    rust: `use std::sync::Arc;
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
    go: `conf, _ := config.New(config.WithOAuthClient(o))
qctx, _ := quote.NewFromCfg(conf)
defer qctx.Close()
quotes, _ := qctx.Quote(context.Background(),
  []string{"AAPL.US", "TSLA.US", "NVDA.US"})
fmt.Printf("%+v\\n", quotes[0])`,
    java: `try (Config config = Config.fromOAuth(oauth);
     QuoteContext ctx = QuoteContext.create(config)) {
    SecurityQuote[] resp = ctx.getQuote(
        new String[]{"AAPL.US", "TSLA.US"}).get();
    for (SecurityQuote q : resp) System.out.println(q);
}`,
    cpp: `Config config = Config::from_oauth(oauth);
QuoteContext ctx = QuoteContext::create(config);
ctx.quote({"AAPL.US", "TSLA.US"}, [](auto res) {
    for (const auto& q : *res)
        std::cout << q.symbol << " "
                  << (double)q.last_done << std::endl;
});`,
  },
  trade: {
    python: `from decimal import Decimal
from longbridge.openapi import (
    TradeContext, Config, OrderType,
    OrderSide, TimeInForceType, OAuthBuilder)

oauth = OAuthBuilder("your-client-id").build(
    lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)

resp = ctx.submit_order(
    "AAPL.US", OrderType.LO, OrderSide.Buy,
    Decimal(100), TimeInForceType.Day,
    submitted_price=Decimal(250))
print(resp)`,
    nodejs: `const { Config, TradeContext, OAuth, OrderType,
  OrderSide, TimeInForceType, Decimal } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id',
    (_, url) => console.log('Open:', url))
  const config = Config.fromOAuth(oauth)
  const ctx = TradeContext.new(config)
  const resp = await ctx.submitOrder({
    symbol: 'AAPL.US', orderType: OrderType.LO,
    side: OrderSide.Buy, submittedQuantity: new Decimal(100),
    submittedPrice: new Decimal(250),
    timeInForce: TimeInForceType.Day })
  console.log(resp)
}
main().catch(console.error)`,
    rust: `use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, Config,
    trade::{TradeContext, SubmitOrderOptions,
            OrderType, OrderSide, TimeInForceType}};
use rust_decimal::Decimal;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id")
        .build(|url| println!("Open: {url}")).await?;
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
    go: `tctx, _ := trade.NewFromCfg(conf)
orderID, _ := tctx.SubmitOrder(ctx, &trade.SubmitOrder{
    Symbol: "AAPL.US", OrderType: trade.OrderTypeLO,
    Side: trade.OrderSideBuy, SubmittedQuantity: 100,
    SubmittedPrice: decimal.NewFromFloat(250),
    TimeInForce: trade.TimeTypeDay })
fmt.Println("order_id:", orderID)`,
    java: `SubmitOrderResponse resp = ctx.submitOrder(
    new SubmitOrderOptions("AAPL.US", OrderType.LO,
        OrderSide.Buy, new BigDecimal("100"),
        TimeInForceType.Day)
        .setSubmittedPrice(new BigDecimal("250"))).get();
System.out.println(resp.orderId);`,
    cpp: `Config config = Config::from_oauth(oauth);
TradeContext ctx = TradeContext::create(config);
SubmitOrderOptions opts{"AAPL.US", OrderType::LO,
    OrderSide::Buy, 100, TimeInForceType::Day,
    Decimal(250.0)};
ctx.submit_order(opts, [](auto res) {
    std::cout << "order_id: " << res->order_id << std::endl;
});`,
  },
  subscribe: {
    python: `from time import sleep
from longbridge.openapi import QuoteContext, Config, SubType, PushQuote, OAuthBuilder

def on_quote(symbol: str, event: PushQuote):
    print(symbol, event)

oauth = OAuthBuilder("your-client-id").build(
    lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)
ctx.set_on_quote(on_quote)
ctx.subscribe(["AAPL.US", "TSLA.US"], [SubType.Quote])
sleep(30)`,
    nodejs: `const { Config, QuoteContext, OAuth, SubType } = require('longbridge')

async function main() {
  const oauth = await OAuth.build("your-client-id",
    (_, url) => console.log("Open:", url))
  const config = Config.fromOAuth(oauth)
  const ctx = QuoteContext.new(config)
  ctx.setOnQuote((event) => console.log(event))
  await ctx.subscribe(["AAPL.US", "TSLA.US"], [SubType.Quote], true)
  await new Promise(r => setTimeout(r, 30000))
}
main().catch(console.error)`,
    rust: `use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, Config,
    quote::{QuoteContext, SubFlags}};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id")
        .build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = QuoteContext::new(config);
    ctx.subscribe(
        vec!["AAPL.US".into(), "TSLA.US".into()],
        SubFlags::quote(), true,
    ).await?;
    tokio::time::sleep(std::time::Duration::from_secs(30)).await;
    Ok(())
}`,
    go: `qctx, _ := quote.NewFromCfg(conf)
qctx.OnQuote(func(e *quote.PushQuote) {
    fmt.Println(e.Symbol) })
qctx.Subscribe(ctx, []string{"AAPL.US", "TSLA.US"},
    []quote.SubType{quote.SubTypeQuote}, true)
select {}`,
    java: `ctx.setOnQuote(event -> System.out.println(event));
ctx.subscribe(new String[]{"AAPL.US", "TSLA.US"},
    new SubType[]{SubType.Quote}, true).get();
Thread.sleep(30000);`,
    cpp: `Config config = Config::from_oauth(oauth);
QuoteContext ctx = QuoteContext::create(config);
ctx.set_on_quote([](auto e) {
    std::cout << e->symbol << std::endl; });
ctx.subscribe({"AAPL.US", "TSLA.US"},
    SubFlags::QUOTE(), true, [](auto) {});`,
  },
  portfolio: {
    python: `from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(
    lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)
resp = ctx.account_balance()
print(resp)`,
    nodejs: `const { Config, TradeContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id',
    (_, url) => console.log('Open:', url))
  const config = Config.fromOAuth(oauth)
  const ctx = TradeContext.new(config)
  const resp = await ctx.accountBalance()
  for (const obj of resp) console.log(obj.toString())
}
main().catch(console.error)`,
    rust: `use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, trade::TradeContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id")
        .build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = TradeContext::new(config);
    let resp = ctx.account_balance(None).await?;
    println!("{:?}", resp);
    Ok(())
}`,
    go: `tctx, _ := trade.NewFromCfg(conf)
resp, _ := tctx.AccountBalance(ctx,
    &trade.GetAccountBalance{})
for _, b := range resp { fmt.Println(b) }`,
    java: `AccountBalance[] resp = ctx.getAccountBalance().get();
for (AccountBalance obj : resp)
    System.out.println(obj);`,
    cpp: `Config config = Config::from_oauth(oauth);
TradeContext ctx = TradeContext::create(config);
ctx.account_balance([](auto res) {
    for (const auto& b : *res)
        std::cout << b.currency << " "
                  << (double)b.available << std::endl;
});`,
  },
}

const activeDomain = ref(0)
const activeInstall = ref(0)
const currentSdk = computed(() => sdks.find(s => s.id === activeSdk.value)!)
const currentCode = computed(() => codeMap[domains[activeDomain.value].key][activeSdk.value] || '')

// Shiki
const highlightedCode = shallowRef('')
let highlighterInstance: any = null

async function highlight() {
  if (!highlighterInstance) {
    const { createHighlighter } = await import('shiki')
    highlighterInstance = await createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: ['python', 'javascript', 'rust', 'go', 'java', 'cpp'],
    })
  }
  highlightedCode.value = highlighterInstance.codeToHtml(currentCode.value, {
    lang: currentSdk.value.shiki,
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
  })
}

onMounted(() => highlight())

function switchSdk(id: SdkId) {
  activeSdk.value = id
  activeInstall.value = 0
  highlight()
}
function switchDomain(idx: number) {
  activeDomain.value = idx
  highlight()
}

const copied = ref(false)
function copyCode() {
  navigator.clipboard.writeText(currentCode.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
const copiedInstall = ref(false)
function copyInstall() {
  navigator.clipboard.writeText(currentSdk.value.installs[activeInstall.value].cmd)
  copiedInstall.value = true
  setTimeout(() => { copiedInstall.value = false }, 2000)
}
</script>

<template>
  <section class="sdk-section">
    <div class="sdk-header">
      <h2 class="sdk-title">{{ $t('product.sdk.title') }}</h2>
      <p class="sdk-subtitle">{{ $t('product.sdk.subtitle') }}</p>
      <p class="sdk-desc">{{ $t('product.sdk.desc') }}</p>
    </div>

    <div class="sdk-bento">
      <!-- Hero Code Cell (4 cols, 2 rows) -->
      <div class="sdk-cell sdk-cell-hero">
        <!-- SDK language selector -->
        <div class="sdk-hero-tabs">
          <div class="sdk-lang-tabs">
            <button
              v-for="s in sdks"
              :key="s.id"
              class="sdk-lang-tab"
              :class="{ active: activeSdk === s.id }"
              @click="switchSdk(s.id)"
            >
              <img class="sdk-lang-logo" :src="s.logo" :alt="s.label" />
              <span class="sdk-lang-name">{{ s.label }}</span>
            </button>
          </div>
          <div class="sdk-cap-tabs">
            <button
              v-for="(d, idx) in domains"
              :key="d.key"
              class="sdk-cap-tab"
              :class="{ active: activeDomain === idx }"
              @click="switchDomain(idx)"
            >{{ $t(`product.sdk.tab.${d.key}`) }}</button>
          </div>
        </div>
        <!-- Code -->
        <div class="sdk-code-wrap">
          <div v-if="highlightedCode" class="sdk-code" v-html="highlightedCode" />
          <div v-else class="sdk-code-fallback"><pre><code>{{ currentCode }}</code></pre></div>
          <button class="sdk-copy-btn" @click="copyCode">
            <svg v-if="copied" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          </button>
        </div>
        <!-- Install command -->
        <div class="sdk-install">
          <div v-if="currentSdk.installs.length > 1" class="sdk-install-tabs">
            <button
              v-for="(inst, idx) in currentSdk.installs"
              :key="inst.mgr"
              class="sdk-install-tab"
              :class="{ active: activeInstall === idx }"
              @click="activeInstall = idx"
            >{{ inst.mgr }}</button>
          </div>
          <span v-else class="sdk-install-mgr">{{ currentSdk.installs[0].mgr }}</span>
          <code class="sdk-install-cmd">{{ currentSdk.installs[activeInstall]?.cmd || currentSdk.installs[0].cmd }}</code>
          <button class="sdk-copy-btn sdk-install-copy" @click="copyInstall">
            <svg v-if="copiedInstall" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          </button>
        </div>
        <ClientOnly>
          <BorderBeam :duration="6" :size="120" color-from="#00d4a8" color-to="#66e8c8" />
        </ClientOnly>
      </div>

      <!-- Multi-Market Cell -->
      <div class="sdk-cell sdk-cell-market">
        <div class="sdk-cell-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
        </div>
        <h3 class="sdk-cell-title">{{ $t('product.sdk.market.title') }}</h3>
        <p class="sdk-cell-desc">{{ $t('product.sdk.market.desc') }}</p>
        <div class="sdk-tags">
          <span class="sdk-tag">US</span><span class="sdk-tag">HK</span><span class="sdk-tag">SG</span><span class="sdk-tag">CN</span>
        </div>
      </div>

      <!-- Free Cell -->
      <div class="sdk-cell sdk-cell-free">
        <div class="sdk-cell-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 000 4h4v-4z"/></svg>
        </div>
        <h3 class="sdk-cell-title">{{ $t('product.sdk.free.title') }}</h3>
        <div class="sdk-free-price">
          <span class="sdk-free-dollar">$</span>
          <ClientOnly><NumberTicker :value="0" class="sdk-free-num" /></ClientOnly>
          <span class="sdk-free-label">API charges</span>
        </div>
        <p class="sdk-cell-desc">{{ $t('product.sdk.free.desc') }}</p>
      </div>

      <!-- Streaming Cell -->
      <div class="sdk-cell sdk-cell-sm">
        <div class="sdk-cell-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg><span class="sdk-live-dot" /></div>
        <h3 class="sdk-cell-title">{{ $t('product.sdk.streaming.title') }}</h3>
        <p class="sdk-cell-desc">{{ $t('product.sdk.streaming.desc') }}</p>
      </div>

      <!-- Trading Cell -->
      <div class="sdk-cell sdk-cell-sm">
        <div class="sdk-cell-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg></div>
        <h3 class="sdk-cell-title">{{ $t('product.sdk.trading.title') }}</h3>
        <p class="sdk-cell-desc">{{ $t('product.sdk.trading.desc') }}</p>
      </div>

      <!-- Auth Cell -->
      <div class="sdk-cell sdk-cell-sm">
        <div class="sdk-cell-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></div>
        <h3 class="sdk-cell-title">{{ $t('product.sdk.auth.title') }}</h3>
        <p class="sdk-cell-desc">{{ $t('product.sdk.auth.desc') }}</p>
      </div>
    </div>

    <div class="sdk-cta-wrap">
      <a href="/sdk" class="sdk-cta">{{ $t('product.sdk.cta') }} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
    </div>
  </section>
</template>

<style scoped>
.sdk-section { padding: 4rem 0; background: var(--vp-c-bg); }

.sdk-header { text-align: center; margin-bottom: 2.5rem; padding: 0 1.5rem; max-width: 48rem; margin-left: auto; margin-right: auto; }
.sdk-title { font-size: 1.75rem; font-weight: 700; color: var(--vp-c-text-1); letter-spacing: -0.02em; }
.sdk-subtitle { margin-top: 0.5rem; font-size: 0.95rem; color: var(--vp-c-text-2); font-weight: 600; line-height: 1.4; }
.sdk-desc { margin-top: 0.5rem; font-size: 0.875rem; line-height: 1.6; color: var(--vp-c-text-2); }

/* Bento Grid */
.sdk-bento {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.75rem;
  max-width: 64rem;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.sdk-cell {
  border-radius: 0.75rem;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  padding: 1rem;
  transition: all 0.25s;
}
.sdk-cell:hover {
  border-color: color-mix(in srgb, var(--brand-color) 30%, var(--vp-c-divider));
}

/* Hero code cell */
.sdk-cell-hero {
  grid-column: span 4;
  grid-row: span 2;
  position: relative;
  overflow: hidden;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.sdk-hero-tabs {
  display: flex; flex-direction: column; gap: 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.sdk-lang-tabs {
  display: flex; gap: 0; overflow-x: auto;
  border-bottom: 1px solid var(--vp-c-divider);
}

.sdk-lang-tab {
  display: inline-flex; align-items: center; gap: 0.3rem;
  padding: 0.5rem 0.625rem;
  font-size: 0.7rem; font-weight: 600; color: var(--vp-c-text-3);
  background: transparent; border: none; border-bottom: 2px solid transparent;
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.sdk-lang-tab:hover { color: var(--vp-c-text-2); background: color-mix(in srgb, var(--vp-c-text-3) 4%, transparent); }
.sdk-lang-tab.active { color: var(--brand-color); border-bottom-color: var(--brand-color); }

.sdk-lang-logo { width: 0.9rem; height: 0.9rem; flex-shrink: 0; object-fit: contain; }
.sdk-lang-name { }

.sdk-cap-tabs { display: flex; gap: 0.25rem; padding: 0.375rem 0.625rem; }
.sdk-cap-tab {
  padding: 0.2rem 0.5rem; border-radius: 0.25rem;
  font-size: 0.68rem; font-weight: 600; color: var(--vp-c-text-3);
  background: transparent; border: none; cursor: pointer; transition: all 0.2s;
}
.sdk-cap-tab:hover { color: var(--vp-c-text-2); }
.sdk-cap-tab.active { color: var(--vp-c-text-1); background: var(--vp-c-bg); }

.sdk-code-wrap { position: relative; flex: 1; overflow: auto; padding: 0.75rem; }
.sdk-code :deep(pre) { margin: 0; font-size: 0.72rem; line-height: 1.6; font-family: var(--vp-font-family-mono); background: transparent !important; }
.sdk-code :deep(code) { font-family: inherit; }
.sdk-code :deep(.shiki) { background: transparent !important; }
.sdk-code :deep(span) { color: var(--shiki-light); }
:root.dark .sdk-code :deep(span) { color: var(--shiki-dark); }
.sdk-code-fallback pre { margin: 0; font-size: 0.72rem; line-height: 1.6; font-family: var(--vp-font-family-mono); color: var(--vp-c-text-1); }

.sdk-copy-btn {
  display: flex; align-items: center; justify-content: center;
  width: 1.5rem; height: 1.5rem; border-radius: 0.25rem;
  color: var(--vp-c-text-3); background: transparent;
  border: none; cursor: pointer; transition: all 0.2s; flex-shrink: 0; z-index: 2;
  position: absolute; top: 0.5rem; right: 0.5rem;
}
.sdk-copy-btn:hover { color: var(--brand-color); background: color-mix(in srgb, var(--brand-color) 8%, transparent); }
.sdk-copy-btn:active { transform: scale(0.8); }

/* Install bar */
.sdk-install {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-top: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg) 50%, var(--vp-c-bg-soft));
}

.sdk-install-tabs { display: flex; gap: 0.125rem; }
.sdk-install-tab {
  padding: 0.125rem 0.375rem; border-radius: 0.1875rem;
  font-size: 0.62rem; font-weight: 600; color: var(--vp-c-text-3);
  background: transparent; border: none; cursor: pointer; transition: all 0.15s;
}
.sdk-install-tab:hover { color: var(--vp-c-text-2); }
.sdk-install-tab.active { color: var(--brand-color); background: color-mix(in srgb, var(--brand-color) 8%, transparent); }

.sdk-install-mgr { font-size: 0.62rem; font-weight: 600; color: var(--vp-c-text-3); }

.sdk-install-cmd {
  flex: 1; font-size: 0.68rem; font-family: var(--vp-font-family-mono);
  color: var(--brand-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

.sdk-install-copy { position: static; width: 1.25rem; height: 1.25rem; }

/* Side cells */
.sdk-cell-market, .sdk-cell-free { grid-column: span 2; }
.sdk-cell-sm { grid-column: span 2; }

.sdk-cell-icon { display: flex; align-items: center; gap: 0.375rem; margin-bottom: 0.5rem; }
.sdk-cell-icon svg { width: 1.125rem; height: 1.125rem; color: var(--brand-color); }
.sdk-cell-title { font-size: 0.82rem; font-weight: 700; color: var(--vp-c-text-1); margin-bottom: 0.25rem; }
.sdk-cell-desc { font-size: 0.75rem; color: var(--vp-c-text-2); line-height: 1.5; }

.sdk-tags { display: flex; flex-wrap: wrap; gap: 0.25rem; margin-top: 0.375rem; }
.sdk-tag { padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-size: 0.68rem; font-weight: 700; background: color-mix(in srgb, var(--brand-color) 10%, transparent); color: var(--brand-color); }

.sdk-free-price { display: flex; align-items: baseline; gap: 0.125rem; margin: 0.25rem 0; }
.sdk-free-dollar { font-size: 1rem; font-weight: 700; color: var(--brand-color); }
.sdk-free-num { font-size: 1.5rem; font-weight: 800; color: var(--brand-color); }
.sdk-free-label { font-size: 0.68rem; color: var(--vp-c-text-3); margin-left: 0.25rem; }

.sdk-live-dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; animation: sdk-pulse 2s ease-in-out infinite; }
@keyframes sdk-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

.sdk-cta-wrap { text-align: center; margin-top: 1.5rem; }
.sdk-cta { display: inline-flex; align-items: center; gap: 0.375rem; font-size: 0.9rem; font-weight: 600; color: var(--brand-color); text-decoration: none !important; transition: gap 0.2s; }
.sdk-cta:hover { gap: 0.625rem; }

@media (max-width: 768px) {
  .sdk-bento { grid-template-columns: 1fr; }
  .sdk-cell-hero, .sdk-cell-market, .sdk-cell-free, .sdk-cell-sm { grid-column: span 1; grid-row: span 1; }
  .sdk-lang-tabs { flex-wrap: wrap; }
}
</style>
