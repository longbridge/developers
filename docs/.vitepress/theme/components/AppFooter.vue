<script setup lang="ts">
import { computed } from 'vue'
import { localePath, getBasenameLocale } from '../utils/i18n'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const sgBaseUrl = computed(() =>
  locale.value === 'en' ? 'https://longbridge.com/sg' : 'https://longbridge.com/sg/zh-CN'
)

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
          <img
            class="brand-logo brand-logo-light"
            src="https://assets.lbkrs.com/uploads/e76f6d93-80f8-4f9b-8b8d-2c86f0c94a78/longbridge-developers-light.png"
            alt="Longbridge Developers"
            style="height: 24px" />
          <img
            class="brand-logo brand-logo-dark"
            src="https://assets.lbkrs.com/uploads/37a18fa4-46a4-408c-a36a-560004eb3cfb/longbridge-developers-dark.png"
            alt="Longbridge Developers"
            style="height: 24px" />
        </a>
        <p>{{ t('footer.tagline') }}</p>
        <div class="footer-status">
          <span
            style="
              width: 6px;
              height: 6px;
              border-radius: 999px;
              background: var(--lb-up);
              box-shadow: 0 0 0 3px color-mix(in srgb, var(--lb-up) 25%, transparent);
              flex-shrink: 0;
            " />
          <span>{{ t('footer.status') }}</span>
        </div>
      </div>

      <!-- Products -->
      <div>
        <h5>{{ t('footer.products') }}</h5>
        <ul>
          <li><a :href="localePath('/skill')">AI Skill</a></li>
          <li><a :href="localePath('/docs/cli')">CLI</a></li>
          <li><a :href="localePath('/docs/mcp')">MCP</a></li>
          <li><a :href="localePath('/docs/llm')">LLMs</a></li>
        </ul>
      </div>

      <!-- Resources -->
      <div>
        <h5>{{ t('footer.resources') }}</h5>
        <ul>
          <li>
            <a :href="localePath('/docs/getting-started')">{{ t('footer.gettingStarted') }}</a>
          </li>
          <li><a :href="localePath('/docs')">Documentation</a></li>
          <li>
            <a :href="localePath('/docs/assets')">{{ t('footer.assets') }}</a>
          </li>
          <li><a :href="localePath('/docs/quote/pull/quote')">Quote API</a></li>
          <li><a :href="localePath('/docs/trade/order/submit')">Trade API</a></li>
          <li>
            <a :href="localePath('/docs/changelog')">{{ t('footer.changelog') }}</a>
          </li>
          <li>
            <a href="https://github.com/longbridge/developers/issues" target="_blank" rel="noreferrer">{{
              t('footer.feedback')
            }}</a>
          </li>
        </ul>
      </div>

      <!-- Company -->
      <div>
        <h5>{{ t('footer.company') }}</h5>
        <ul>
          <li><a href="https://longbridge.com" target="_blank" rel="noreferrer">Longbridge</a></li>
          <li>
            <a href="https://longbridge.com/download" target="_blank" rel="noreferrer">{{ t('footer.download') }}</a>
          </li>
          <li>
            <a href="https://status.longbridge.com" target="_blank" rel="noreferrer">{{ t('footer.statusPage') }}</a>
          </li>
          <li>
            <a href="https://longbridge.com/about" target="_blank" rel="noreferrer">{{ t('footer.about') }}</a>
          </li>
          <li><a href="https://github.com/longbridge" target="_blank" rel="noreferrer">GitHub</a></li>
        </ul>
      </div>

      <!-- Legal -->
      <div>
        <h5>{{ t('footer.legal') }}</h5>
        <ul>
          <li>
            <a :href="`${sgBaseUrl}/support/topics/us-trade/user-agreement`" target="_blank" rel="noreferrer">{{
              t('footer.terms')
            }}</a>
          </li>
          <li>
            <a :href="`${sgBaseUrl}/support/topics/Other/privacy-policy`" target="_blank" rel="noreferrer">{{
              t('footer.privacy')
            }}</a>
          </li>
          <li>
            <a :href="localePath('/docs/legal')">{{ t('footer.agreements') }}</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="app-footer-bottom">
      <div>{{ t('footer.rights', { year }) }}</div>
      <div class="app-footer-bottom-links">
        <span style="color: var(--lb-fg-3)">·</span>
        <a href="#" @click.prevent="switchLocale('en')">English</a>
        <a href="#" @click.prevent="switchLocale('zh-CN')">简体中文</a>
        <a href="#" @click.prevent="switchLocale('zh-HK')">繁體中文</a>
      </div>
    </div>
  </footer>
</template>
