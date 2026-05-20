<script setup lang="ts">
import { localePath, getBasenameLocale } from '../utils/i18n'

function switchLocale(locale: string) {
  if (typeof window === 'undefined') return
  const path = window.location.pathname
  const cur = getBasenameLocale()
  if (cur) {
    const newPath = locale === 'en' ? path.replace(`/${cur}`, '') || '/' : path.replace(`/${cur}`, `/${locale}`)
    window.location.href = newPath
  } else {
    window.location.href = locale === 'en' ? path : `/${locale}${path}`
  }
}

const year = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <div class="app-footer-inner-v2">
      <!-- Brand column -->
      <div class="app-footer-brand">
        <a :href="localePath('/')" class="app-brand" aria-label="Longbridge Developers">
          <img class="brand-logo brand-logo-light"
            src="https://assets.lbkrs.com/uploads/e76f6d93-80f8-4f9b-8b8d-2c86f0c94a78/longbridge-developers-light.png"
            alt="Longbridge Developers" style="height:24px" />
          <img class="brand-logo brand-logo-dark"
            src="https://assets.lbkrs.com/uploads/37a18fa4-46a4-408c-a36a-560004eb3cfb/longbridge-developers-dark.png"
            alt="Longbridge Developers" style="height:24px" />
        </a>
        <p>
          Real-time market data, trading, and financial intelligence — delivered
          through AI Skill, CLI, MCP, SDK and OpenAPI for developers worldwide.
        </p>
        <div class="footer-status">
          <span style="width:6px;height:6px;border-radius:999px;background:var(--lb-up);box-shadow:0 0 0 3px color-mix(in srgb,var(--lb-up) 25%,transparent);flex-shrink:0" />
          <span>All systems operational</span>
        </div>
      </div>

      <!-- Products -->
      <div>
        <h5>Products</h5>
        <ul>
          <li><a :href="localePath('/skill')">AI Skill</a></li>
          <li><a :href="localePath('/docs/cli')">CLI</a></li>
          <li><a :href="localePath('/docs/mcp')">MCP</a></li>
          <li><a :href="localePath('/docs')">SDK</a></li>
          <li><a :href="localePath('/api')">OpenAPI</a></li>
          <li><a :href="localePath('/docs')">LLM &amp; llms.txt</a></li>
        </ul>
      </div>

      <!-- Resources -->
      <div>
        <h5>Resources</h5>
        <ul>
          <li><a :href="localePath('/docs')">Getting Started</a></li>
          <li><a :href="localePath('/api')">API Reference</a></li>
          <li><a :href="localePath('/docs/quote/pull/quote')">Quote API</a></li>
          <li><a :href="localePath('/docs/trade/order/submit')">Trade API</a></li>
          <li><a :href="localePath('/docs/changelog')">Changelog</a></li>
          <li><a href="https://github.com/longbridge/developers/issues" target="_blank" rel="noreferrer">Feedback</a></li>
        </ul>
      </div>

      <!-- Company -->
      <div>
        <h5>Company</h5>
        <ul>
          <li><a href="https://longbridge.com" target="_blank" rel="noreferrer">Longbridge</a></li>
          <li><a href="https://longbridge.com/download" target="_blank" rel="noreferrer">Download</a></li>
          <li><a href="https://status.longbridge.com" target="_blank" rel="noreferrer">Status</a></li>
          <li><a href="https://longbridge.com/about" target="_blank" rel="noreferrer">About</a></li>
          <li><a href="https://github.com/longbridge" target="_blank" rel="noreferrer">GitHub</a></li>
        </ul>
      </div>

      <!-- Legal -->
      <div>
        <h5>Legal</h5>
        <ul>
          <li><a href="#">Terms of Service</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Risk Disclosure</a></li>
        </ul>
      </div>
    </div>

    <div class="app-footer-bottom">
      <div>© {{ year }} Longbridge Technology Limited. All rights reserved.</div>
      <div class="app-footer-bottom-links">
        <span>Hong Kong · Singapore · New York</span>
        <span style="color:var(--lb-fg-3)">·</span>
        <a href="#" @click.prevent="switchLocale('en')">English</a>
        <a href="#" @click.prevent="switchLocale('zh-CN')">简体中文</a>
        <a href="#" @click.prevent="switchLocale('zh-HK')">繁體中文</a>
      </div>
    </div>
  </footer>
</template>
