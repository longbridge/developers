<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SdkMarquee from './SdkMarquee.vue'
import ArchCanvas from './ArchCanvas.vue'

const { t } = useI18n()

// SDK data — code from docs/en/docs/quote/pull/quote.md, installs from getting-started.md
const sdks = [
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
</script>

<template>
  <section class="arch-section">
    <div class="arch-header">
      <h2 class="arch-title">{{ $t('arch.title') }}</h2>
      <p class="arch-subtitle">{{ $t('arch.subtitle') }}</p>
    </div>

    <!-- Vue Flow Architecture Diagram -->
    <ClientOnly>
      <ArchCanvas />
    </ClientOnly>
  </section>
</template>

<style scoped>
.arch-section {
  padding: 4rem 0;
  background: var(--vp-c-bg);
}

.arch-header {
  text-align: center;
  margin-bottom: 2.5rem;
  padding: 0 1.5rem;
}

.arch-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.02em;
}

.arch-subtitle {
  margin-top: 24px;
  color: var(--vp-c-text-2);
}

.sdk-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2.5rem auto 1.5rem;
  padding: 0 1.5rem;
  max-width: 64rem;
}

.sdk-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.sdk-alt-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sdk-alt-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-decoration: none !important;
  transition: all 0.2s;
}

.sdk-alt-link:hover {
  border-color: var(--brand-color);
  color: var(--brand-color);
}

@media (max-width: 640px) {
  .sdk-header {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }
}
</style>
