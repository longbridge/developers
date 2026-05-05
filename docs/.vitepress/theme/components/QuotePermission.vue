<template>
  <div class="qp-alert" :data-level="effectiveLevel" :data-status="permissionStatus">
    <!-- Header: icon + label + market tag + badge (right) + status badge (client-only) -->
    <div class="qp-header">
      <span class="qp-icon" v-html="shieldCheckIcon" />
      <span class="qp-label">{{ title }}</span>
      <span v-if="effectiveMarket" class="qp-market-tag">{{ marketLabel }}</span>
      <span class="qp-badge">{{ badgeLabel }}</span>
      <ClientOnly>
        <span v-if="permissionStatus === 'activated'" class="qp-status-badge qp-status-activated">
          <span v-html="checkIcon" class="qp-status-icon" />{{ activatedLabel }}
        </span>
        <span v-else-if="permissionStatus === 'not_activated'" class="qp-status-badge qp-status-not-activated">
          {{ notActivatedLabel }}
        </span>
        <span v-else-if="permissionStatus === 'loading'" class="qp-status-loading" aria-hidden="true" />
      </ClientOnly>
    </div>

    <!-- Description: list when multi-line, paragraph when single -->
    <ul v-if="descriptionLines.length > 1" class="qp-list">
      <li v-for="line in descriptionLines" :key="line" class="qp-list-item">{{ line }}</li>
    </ul>
    <p v-else-if="descriptionLines.length === 1" class="qp-desc">{{ descriptionLines[0] }}</p>

    <!-- Footer: action link always rendered for SSR/AI; activated note injected client-side -->
    <div class="qp-footer">
      <a :href="linkUrl" target="_blank" rel="noopener noreferrer" class="qp-link">{{ linkText }}</a>
      <ClientOnly>
        <span v-if="permissionStatus === 'activated'" class="qp-activated-note">
          · {{ alreadyActivatedNote }}
        </span>
      </ClientOnly>
      <span class="qp-sep" aria-hidden="true">·</span>
      <span class="qp-note">{{ separateNote }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useData } from 'vitepress'
import {
  QUOTE_COMMANDS,
  QUOTE_PERMISSION_TITLE,
  QUOTE_BADGE_LABELS,
  QUOTE_DESCRIPTIONS,
  QUOTE_LINK_URL,
  QUOTE_LINK_TEXT,
  QUOTE_SEPARATE_NOTE,
  QUOTE_MARKET_LABELS,
  QUOTE_ACTIVATED_LABEL,
  QUOTE_NOT_ACTIVATED_LABEL,
  QUOTE_ALREADY_ACTIVATED_NOTE,
  type QuoteLevel,
  type QuoteLocale,
} from './QuotePermissionData'

interface Props {
  command?: string
  level?: QuoteLevel
  market?: string
}

const props = defineProps<Props>()
const { lang } = useData()

const locale = computed(() => lang.value as QuoteLocale)
const l = <T extends Record<string, string>>(map: T) => map[locale.value] ?? map['en']

const cmdEntry = computed(() => (props.command ? QUOTE_COMMANDS[props.command] : null))

const effectiveLevel = computed<QuoteLevel>(() => cmdEntry.value?.level ?? props.level ?? 'basic')
const effectiveMarket = computed(() => props.market ?? cmdEntry.value?.market)

const shieldCheckIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.76 8.95a1 1 0 0 1-.48 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`
const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`

const title = computed(() => l(QUOTE_PERMISSION_TITLE))
const badgeLabel = computed(() => l(QUOTE_BADGE_LABELS[effectiveLevel.value]))
const description = computed(() => {
  const cmdDesc = cmdEntry.value?.description
  if (cmdDesc) return cmdDesc[locale.value] ?? cmdDesc['en'] ?? ''
  return l(QUOTE_DESCRIPTIONS[effectiveLevel.value])
})
const descriptionLines = computed(() => description.value.split('\n').filter(Boolean))
const linkUrl = computed(() => QUOTE_LINK_URL[effectiveLevel.value])
const linkText = computed(() => l(QUOTE_LINK_TEXT[effectiveLevel.value]))
const separateNote = computed(() => l(QUOTE_SEPARATE_NOTE))
const marketLabel = computed(() =>
  effectiveMarket.value ? (QUOTE_MARKET_LABELS[effectiveMarket.value]?.[locale.value] ?? effectiveMarket.value) : ''
)

const activatedLabel = computed(() => l(QUOTE_ACTIVATED_LABEL))
const notActivatedLabel = computed(() => l(QUOTE_NOT_ACTIVATED_LABEL))
const alreadyActivatedNote = computed(() => l(QUOTE_ALREADY_ACTIVATED_NOTE))

// ── Permission status check (client-side only) ──

type PermissionStatus = 'unknown' | 'loading' | 'activated' | 'not_activated'

const permissionStatus = ref<PermissionStatus>('unknown')

function getPortalApiBase(): string {
  if (import.meta.env.DEV) return '/lb-api'
  const h = window.location.hostname
  if (h.includes('.xyz')) return 'https://m.longbridge.xyz/api'
  return 'https://m.lbkrs.com/api'
}

async function lbFetch(path: string, extraHeaders: Record<string, string> = {}): Promise<any> {
  const url = `${getPortalApiBase()}/forward${path}`
  try {
    const resp = await fetch(url, {
      credentials: 'include',
      headers: { 'x-platform': 'web', 'Content-Type': 'application/json', ...extraHeaders },
    })
    if (!resp.ok) return null
    const json = await resp.json()
    return json.code === 0 ? json.data : null
  } catch {
    return null
  }
}

function isLevelActivated(level: string, applyState: number, quotation: any): boolean {
  if (level === 'basic') return applyState === 2 // APPLY_SUCCESS

  const perms: any[] = []
  if (quotation?.hk) perms.push(...quotation.hk)
  if (quotation?.us) perms.push(...quotation.us)
  if (Array.isArray(quotation)) {
    quotation.forEach((m: any) => { if (m?.actives) perms.push(...m.actives) })
  }

  if (level === 'overnight') {
    return perms.some((p: any) => p?.is_current && p?.quote_tag?.includes('overnight'))
  }

  if (level === 'opra') {
    return perms.some((p: any) => p?.is_current && p?.quote_tag?.toLowerCase().includes('opra'))
  }

  const tagLevelMap: Record<string, number> = { lv1: 1, lv2: 2 }
  const targetTagLevel = tagLevelMap[level]
  if (!targetTagLevel) return false

  return perms.some((p: any) => p?.is_current && p?.tag_level === targetTagLevel)
}

onMounted(async () => {
  if (!window.longportInternal?.isLogin()) return

  permissionStatus.value = 'loading'

  const accountData = await lbFetch('/openapi/account/list')
  const accounts: any[] = accountData?.status ?? []
  const account = accounts.find((a: any) => a?.account_open) ?? accounts[0]

  if (!account) {
    permissionStatus.value = 'not_activated'
    return
  }

  const params = new URLSearchParams({ account_no: account.no, is_mock: '0' })
  const devInfo = await lbFetch(`/v3/openapi/index?${params}`, {
    'account-channel': account.account_channel,
    'x-target-aaid': account.aaid,
  })

  if (!devInfo) {
    permissionStatus.value = 'unknown'
    return
  }

  permissionStatus.value = isLevelActivated(effectiveLevel.value, devInfo.apply_state, devInfo.quotation)
    ? 'activated'
    : 'not_activated'
})
</script>

<style scoped>
.qp-alert {
  border: 1px solid;
  border-radius: 0.5rem;
  padding: 0.875rem 1rem;
  margin: 1rem 0;
}

/* ── level colors ── */
.qp-alert[data-level='basic'] {
  @apply border-green-500/30 bg-green-500/5;
}
.qp-alert[data-level='basic'] .qp-icon,
.qp-alert[data-level='basic'] .qp-label {
  @apply text-green-600 dark:text-green-400;
}
.qp-alert[data-level='basic'] .qp-badge {
  @apply bg-green-500/15 text-green-700 dark:bg-green-500/20 dark:text-green-300 ring-1 ring-green-500/30;
}
.qp-alert[data-level='basic'] .qp-desc,
.qp-alert[data-level='basic'] .qp-list-item {
  @apply text-green-800/80 dark:text-green-300/80;
}
.qp-alert[data-level='basic'] .qp-link,
.qp-alert[data-level='basic'] .qp-activated-note {
  @apply text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-200;
}
.qp-alert[data-level='basic'] .qp-note,
.qp-alert[data-level='basic'] .qp-sep {
  @apply text-green-600/50 dark:text-green-500/50;
}
.qp-alert[data-level='basic'] .qp-market-tag {
  @apply text-green-600/70 dark:text-green-400/70 ring-1 ring-green-500/30;
}

.qp-alert[data-level='lv1'] {
  @apply border-blue-500/30 bg-blue-500/5;
}
.qp-alert[data-level='lv1'] .qp-icon,
.qp-alert[data-level='lv1'] .qp-label {
  @apply text-blue-600 dark:text-blue-400;
}
.qp-alert[data-level='lv1'] .qp-badge {
  @apply bg-blue-500/15 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 ring-1 ring-blue-500/30;
}
.qp-alert[data-level='lv1'] .qp-desc,
.qp-alert[data-level='lv1'] .qp-list-item {
  @apply text-blue-800/80 dark:text-blue-300/80;
}
.qp-alert[data-level='lv1'] .qp-link,
.qp-alert[data-level='lv1'] .qp-activated-note {
  @apply text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200;
}
.qp-alert[data-level='lv1'] .qp-note,
.qp-alert[data-level='lv1'] .qp-sep {
  @apply text-blue-600/50 dark:text-blue-500/50;
}
.qp-alert[data-level='lv1'] .qp-market-tag {
  @apply text-blue-600/70 dark:text-blue-400/70 ring-1 ring-blue-500/30;
}

.qp-alert[data-level='lv2'] {
  @apply border-orange-500/30 bg-orange-500/5;
}
.qp-alert[data-level='lv2'] .qp-icon,
.qp-alert[data-level='lv2'] .qp-label {
  @apply text-orange-600 dark:text-orange-400;
}
.qp-alert[data-level='lv2'] .qp-badge {
  @apply bg-orange-500/15 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 ring-1 ring-orange-500/30;
}
.qp-alert[data-level='lv2'] .qp-desc,
.qp-alert[data-level='lv2'] .qp-list-item {
  @apply text-orange-800/80 dark:text-orange-300/80;
}
.qp-alert[data-level='lv2'] .qp-link,
.qp-alert[data-level='lv2'] .qp-activated-note {
  @apply text-orange-700 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-200;
}
.qp-alert[data-level='lv2'] .qp-note,
.qp-alert[data-level='lv2'] .qp-sep {
  @apply text-orange-600/50 dark:text-orange-500/50;
}
.qp-alert[data-level='lv2'] .qp-market-tag {
  @apply text-orange-600/70 dark:text-orange-400/70 ring-1 ring-orange-500/30;
}

.qp-alert[data-level='overnight'] {
  @apply border-yellow-500/30 bg-yellow-500/5;
}
.qp-alert[data-level='overnight'] .qp-icon,
.qp-alert[data-level='overnight'] .qp-label {
  @apply text-yellow-700 dark:text-yellow-400;
}
.qp-alert[data-level='overnight'] .qp-badge {
  @apply bg-yellow-500/15 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300 ring-1 ring-yellow-500/30;
}
.qp-alert[data-level='overnight'] .qp-desc,
.qp-alert[data-level='overnight'] .qp-list-item {
  @apply text-yellow-900/80 dark:text-yellow-300/80;
}
.qp-alert[data-level='overnight'] .qp-link,
.qp-alert[data-level='overnight'] .qp-activated-note {
  @apply text-yellow-700 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-200;
}
.qp-alert[data-level='overnight'] .qp-note,
.qp-alert[data-level='overnight'] .qp-sep {
  @apply text-yellow-700/50 dark:text-yellow-500/50;
}
.qp-alert[data-level='overnight'] .qp-market-tag {
  @apply text-yellow-700/70 dark:text-yellow-400/70 ring-1 ring-yellow-500/30;
}

.qp-alert[data-level='opra'] {
  @apply border-purple-500/30 bg-purple-500/5;
}
.qp-alert[data-level='opra'] .qp-icon,
.qp-alert[data-level='opra'] .qp-label {
  @apply text-purple-600 dark:text-purple-400;
}
.qp-alert[data-level='opra'] .qp-badge {
  @apply bg-purple-500/15 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 ring-1 ring-purple-500/30;
}
.qp-alert[data-level='opra'] .qp-desc,
.qp-alert[data-level='opra'] .qp-list-item {
  @apply text-purple-800/80 dark:text-purple-300/80;
}
.qp-alert[data-level='opra'] .qp-link,
.qp-alert[data-level='opra'] .qp-activated-note {
  @apply text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-200;
}
.qp-alert[data-level='opra'] .qp-note,
.qp-alert[data-level='opra'] .qp-sep {
  @apply text-purple-600/50 dark:text-purple-500/50;
}
.qp-alert[data-level='opra'] .qp-market-tag {
  @apply text-purple-600/70 dark:text-purple-400/70 ring-1 ring-purple-500/30;
}

/* ── structural styles ── */
.qp-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.qp-icon {
  display: inline-flex;
  flex-shrink: 0;
}

.qp-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  white-space: nowrap;
}

.qp-market-tag {
  font-size: 0.7rem;
  font-weight: 500;
  padding: 0 0.375rem;
  border-radius: 9999px;
  background: transparent;
  white-space: nowrap;
}

.qp-badge {
  display: inline-block;
  font-size: 0.8125rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  white-space: nowrap;
  letter-spacing: 0.01em;
  margin-left: auto;
}

.qp-desc {
  font-size: 0.8125rem;
  line-height: 1.5;
  margin: 0 0 0.5rem 0;
}

.qp-list {
  margin: 0 0 0.5rem 0;
  padding-left: 1.125rem;
  list-style: disc;
}

.qp-list-item {
  font-size: 0.8125rem;
  line-height: 1.6;
  margin: 0;
}

.qp-footer {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.qp-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-decoration: none;
  transition: opacity 0.15s;
}
.qp-link:hover {
  text-decoration: underline;
}

.qp-sep {
  font-size: 0.75rem;
}

.qp-note {
  font-size: 0.7rem;
  opacity: 0.8;
}

/* ── status badge (header, client-only) ── */
.qp-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.15rem 0.45rem;
  border-radius: 9999px;
  white-space: nowrap;
}

.qp-status-icon {
  display: inline-flex;
  align-items: center;
}

.qp-status-activated {
  @apply bg-green-500/15 text-green-700 dark:bg-green-500/20 dark:text-green-300 ring-1 ring-green-500/40;
}

.qp-status-not-activated {
  @apply bg-gray-500/10 text-gray-500 dark:text-gray-400 ring-1 ring-gray-500/20;
}

/* ── activated note (footer, client-only) ── */
.qp-activated-note {
  font-size: 0.75rem;
  font-weight: 500;
  opacity: 0.9;
}

/* ── loading spinner ── */
.qp-status-loading {
  width: 12px;
  height: 12px;
  border: 1.5px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: qp-spin 0.6s linear infinite;
  opacity: 0.4;
  margin-left: auto;
}

@keyframes qp-spin {
  to { transform: rotate(360deg); }
}
</style>
