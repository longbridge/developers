import React, { lazy, Suspense } from 'react'
import type { Locale } from '@longbridge/openapi-utils'
import { SdkMarquee } from './SdkMarquee'
import type { SdkItem } from './SdkMarquee'

const LOCALE = {
  en: {
    title: 'Platform Architecture',
    subtitle: 'One gateway, every access method — from SDK to real-time WebSocket streams',
  },
  'zh-CN': {
    title: '平台架构',
    subtitle: '统一网关，多种接入方式 — 从 SDK 到实时 WebSocket 数据流',
  },
  'zh-HK': {
    title: '平台架構',
    subtitle: '統一閘道，多種接入方式 — 從 SDK 到即時 WebSocket 數據流',
  },
}

const SDK_LIST: SdkItem[] = [
  {
    id: 'python',
    label: 'Python',
    version: '3.8+',
    lang: 'python',
    installs: [
      { runtime: 'pip', cmd: 'pip3 install longbridge' },
      { runtime: 'conda', cmd: 'conda install -c conda-forge longbridge' },
    ],
    code: `from longbridge.openapi import QuoteContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(
    lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)
resp = ctx.quote(["700.HK", "AAPL.US", "TSLA.US", "NFLX.US"])
print(resp)`,
  },
  {
    id: 'nodejs',
    label: 'Node.js',
    version: '10+',
    lang: 'javascript',
    installs: [
      { runtime: 'bun', cmd: 'bun add longbridge' },
      { runtime: 'npm', cmd: 'npm install longbridge' },
      { runtime: 'yarn', cmd: 'yarn add longbridge' },
      { runtime: 'pnpm', cmd: 'pnpm add longbridge' },
    ],
    code: `const { Config, QuoteContext, OAuth } = require('longbridge')

const oauth = await OAuth.build('your-client-id', (_, url) =>
  console.log('Open this URL to authorize: ' + url))
const config = Config.fromOAuth(oauth)
const ctx = QuoteContext.new(config)
const resp = await ctx.quote(['700.HK', 'AAPL.US', 'TSLA.US', 'NFLX.US'])
console.log(resp[0].toString())`,
  },
  {
    id: 'rust',
    label: 'Rust',
    version: '1.89+',
    lang: 'rust',
    installs: [{ runtime: 'Cargo.toml', cmd: 'longbridge = "4.0.5"' }],
    code: `use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, quote::QuoteContext, Config};

let oauth = OAuthBuilder::new("your-client-id")
    .build(|url| println!("Open: {url}"))
    .await?;
let config = Arc::new(Config::from_oauth(oauth));
let (ctx, _) = QuoteContext::new(config);
let resp = ctx.quote(["700.HK", "AAPL.US"]).await?;
println!("{:?}", resp);`,
  },
  {
    id: 'go',
    label: 'Go',
    version: 'latest',
    lang: 'go',
    installs: [{ runtime: 'go get', cmd: 'go get github.com/longbridge/openapi-go' }],
    code: `o := oauth.New("your-client-id").
    OnOpenURL(func(url string) { fmt.Println("Open:", url) })
o.Build(context.Background())
conf, _ := config.New(config.WithOAuthClient(o))
qctx, _ := quote.NewFromCfg(conf)
defer qctx.Close()
quotes, _ := qctx.Quote(ctx, []string{"700.HK", "AAPL.US"})
fmt.Printf("%+v\\n", quotes[0])`,
  },
  {
    id: 'java',
    label: 'Java',
    version: '11+',
    lang: 'java',
    installs: [
      { runtime: 'Maven', cmd: 'io.github.longbridge:openapi-sdk:4.0.5' },
      { runtime: 'Gradle', cmd: "implementation 'io.github.longbridge:openapi-sdk:4.0.5'" },
    ],
    code: `import com.longbridge.*;
import com.longbridge.quote.*;

try (OAuth oauth = new OAuthBuilder("your-client-id")
        .build(url -> System.out.println("Open: " + url))
        .get();
     Config config = Config.fromOAuth(oauth);
     QuoteContext ctx = QuoteContext.create(config)) {
    SecurityQuote[] resp = ctx.getQuote(
        new String[]{"700.HK", "AAPL.US"}).get();
}`,
  },
  {
    id: 'cpp',
    label: 'C++',
    version: 'C++17',
    lang: 'cpp',
    installs: [{ runtime: 'CMake', cmd: 'find_package(longbridge REQUIRED)' }],
    code: `#include <longbridge.hpp>
using namespace longbridge;
using namespace longbridge::quote;

OAuthBuilder("your-client-id").build(
    [](const std::string& url) {
        std::cout << "Open: " << url << std::endl;
    },
    [](auto res) {
        Config config = Config::from_oauth(*res);
        QuoteContext ctx = QuoteContext::create(config);
        ctx.quote({"700.HK", "AAPL.US"}, [](auto quotes) {
            for (const auto& it : *quotes)
                std::cout << it.symbol << std::endl;
        });
    });`,
  },
]

const ARCH_CSS = `
.arch-section { padding: 4rem 0; background: var(--vp-c-bg); }
.arch-header { text-align: center; margin-bottom: 2.5rem; padding: 0 1.5rem; }
.arch-title { font-size: 1.75rem; font-weight: 700; color: var(--vp-c-text-1); letter-spacing: -0.02em; }
.arch-subtitle { margin-top: 1.5rem; color: var(--vp-c-text-2); }
.arch-canvas-placeholder { max-width: 64rem; margin: 0 auto; padding: 0 1.5rem; min-height: 400px; display: flex; align-items: center; justify-content: center; background: var(--vp-c-bg-soft); border-radius: 1rem; border: 1px solid var(--vp-c-divider); color: var(--vp-c-text-3); font-size: .875rem; }
`

// ArchCanvas is heavy — lazy-loaded to avoid blocking initial render
const ArchCanvas = lazy(() => import('../ArchCanvas').then((m) => ({ default: m.ArchCanvas })))

interface ArchSectionProps {
  locale: Locale
}

export function ArchSection({ locale }: ArchSectionProps) {
  const content = LOCALE[locale] ?? LOCALE.en
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: ARCH_CSS }} />
      <section data-lbus-component="arch-section" className="arch-section">
        <div className="arch-header">
          <h2 className="arch-title">{content.title}</h2>
          <p className="arch-subtitle">{content.subtitle}</p>
        </div>
        <SdkMarquee sdks={SDK_LIST} />
        <Suspense fallback={<div className="arch-canvas-placeholder">Loading…</div>}>
          <ArchCanvas locale={locale} />
        </Suspense>
      </section>
    </>
  )
}
