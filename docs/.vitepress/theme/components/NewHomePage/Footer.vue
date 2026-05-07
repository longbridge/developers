<template>
  <footer v-if="!isCN" class="nhp-footer">
    <div class="nhp-footer-inner">
      <div class="nhp-footer-left">
        <a v-if="beianText" class="nhp-link" href="https://beian.miit.gov.cn/" rel="nofollow">
          {{ beianText }}
        </a>
        <a
          v-for="link in leftLinks"
          :key="link.href"
          :href="link.href"
          class="nhp-link"
          :target="link.href.startsWith('/') ? '_self' : '_blank'">
          {{ link.label }}
        </a>
      </div>
      <div class="nhp-footer-right">
        <a
          v-for="link in rightLinks"
          :key="link.href"
          :href="link.href"
          class="nhp-link"
          :target="link.href.startsWith('/') ? '_self' : '_blank'">
          {{ link.label }}
        </a>
        <a href="https://github.com/longbridge" class="nhp-github-link" target="_blank" aria-label="GitHub">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path
              d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9999 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z" />
          </svg>
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { isServer } from '../../utils/i18n'

const { t, locale } = useI18n()

const isCN = computed(() => !isServer() && window.location.host.endsWith('.cn'))

const sgBaseUrl = computed(() =>
  locale.value === 'en' ? 'https://longbridge.com/sg' : 'https://longbridge.com/sg/zh-CN',
)

const beianText = computed(() => {
  return isCN.value && locale.value === 'zh-CN' ? `© ${new Date().getFullYear()} 粤 ICP 备 2025433117 号` : ''
})

const leftLinks = computed(() => [
  { href: 'https://longbridge.com', label: 'Longbridge' },
  { href: 'https://longbridge.com/download', label: 'Download' },
  {
    href: `${sgBaseUrl.value}/support/topics/us-trade/user-agreement`,
    label: t('side-footer.section-terms.terms-of-service'),
  },
  {
    href: `${sgBaseUrl.value}/support/topics/Other/privacy-policy`,
    label: t('side-footer.section-terms.privacy-policy'),
  },
])

const rightLinks = [
  { href: '/sdk', label: 'SDK' },
  { href: '/docs/mcp', label: 'MCP' },
  { href: '/docs/cli', label: 'CLI' },
  { href: '/docs/llm', label: 'LLM' },
  { href: 'https://github.com/longbridge/developers/issues', label: 'Feedback' },
]
</script>

<style scoped>
.nhp-footer {
  border-top: 1px solid var(--vp-c-divider);
  padding: 1.25rem 0;
  margin-top: 0;
}

.nhp-footer-inner {
  max-width: 64rem;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.nhp-footer-left,
.nhp-footer-right {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem 1rem;
}

.nhp-link {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  text-decoration: none;
  transition: color 0.15s;
}

.nhp-link:hover {
  color: var(--vp-c-text-1);
  text-decoration: underline;
}

.nhp-github-link {
  display: inline-flex;
  align-items: center;
  color: var(--vp-c-text-3);
  transition: color 0.15s;
}

.nhp-github-link:hover {
  color: var(--vp-c-text-1);
}

@media (max-width: 640px) {
  .nhp-footer-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
