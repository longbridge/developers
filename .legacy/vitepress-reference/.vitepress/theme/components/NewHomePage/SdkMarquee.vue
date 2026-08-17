<script setup lang="ts">
import { ref, computed, nextTick, watch, shallowRef } from 'vue'
import { createHighlighter, type Highlighter } from 'shiki'
import Marquee from '../inspira/Marquee.vue'

interface InstallOption {
  runtime: string
  cmd: string
}

interface SdkItem {
  id: string
  label: string
  installs: InstallOption[]
  code: string
  version: string
  lang: string
}

const props = defineProps<{ sdks: SdkItem[] }>()

// Language logos (CDN URLs)
const logos: Record<string, string> = {
  python: 'https://assets.lbctrl.com/uploads/50244d9f-f886-4dc5-8ee5-4983d0ecb169/python.svg',
  nodejs: 'https://assets.lbctrl.com/uploads/1729711f-90d8-4b4d-9047-63a8adabdf20/nodejs.svg',
  rust: 'https://assets.lbctrl.com/uploads/f777c482-71bb-45a4-a2fe-5e639bd510cb/rust.svg',
  go: 'https://assets.lbctrl.com/uploads/37a78e80-f177-4931-a7b3-a12692c478ad/go.svg',
  java: 'https://assets.lbctrl.com/uploads/f5d96da9-8cba-43e4-8eed-f704e52cb413/java.svg',
  cpp: 'https://assets.lbctrl.com/uploads/14e521de-8f43-4042-aa4d-659d7b645da4/cplusplus.svg',
}

const activeSdk = ref<string | null>(null)
const paused = computed(() => activeSdk.value !== null)
const expanded = computed(() => props.sdks.find(s => s.id === activeSdk.value))
const activeIndex = computed(() => props.sdks.findIndex(s => s.id === activeSdk.value))
const wrapRef = ref<HTMLElement>()
const activeInstallIdx = ref(0)

function scrollToActive(id: string) {
  nextTick(() => {
    if (!wrapRef.value) return
    const card = wrapRef.value.querySelector(`[data-sdk="${id}"]`) as HTMLElement
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  })
}

function select(id: string) {
  activeSdk.value = activeSdk.value === id ? null : id
  activeInstallIdx.value = 0
  if (activeSdk.value) scrollToActive(activeSdk.value)
}

function goPrev() {
  const idx = activeIndex.value <= 0 ? props.sdks.length - 1 : activeIndex.value - 1
  activeSdk.value = props.sdks[idx].id
  activeInstallIdx.value = 0
  scrollToActive(activeSdk.value)
}

function goNext() {
  const idx = activeIndex.value < 0 || activeIndex.value >= props.sdks.length - 1 ? 0 : activeIndex.value + 1
  activeSdk.value = props.sdks[idx].id
  activeInstallIdx.value = 0
  scrollToActive(activeSdk.value)
}

const copied = ref<'code' | 'install' | null>(null)
function copyCode() {
  if (!expanded.value) return
  navigator.clipboard.writeText(expanded.value.code)
  copied.value = 'code'
  setTimeout(() => { copied.value = null }, 2000)
}
function copyInstall() {
  if (!expanded.value) return
  navigator.clipboard.writeText(expanded.value.installs[activeInstallIdx.value].cmd)
  copied.value = 'install'
  setTimeout(() => { copied.value = null }, 2000)
}

// Shiki syntax highlighter
const highlighter = shallowRef<Highlighter | null>(null)
const highlightedHtml = ref('')

// Lang mapping: our id → shiki lang
const langMap: Record<string, string> = {
  python: 'python',
  javascript: 'javascript',
  rust: 'rust',
  go: 'go',
  java: 'java',
  cpp: 'cpp',
}

// Init shiki once
createHighlighter({
  themes: ['github-light', 'github-dark'],
  langs: ['python', 'javascript', 'rust', 'go', 'java', 'cpp'],
}).then((hl) => {
  highlighter.value = hl
  updateHighlight()
})

function updateHighlight() {
  if (!highlighter.value || !expanded.value) {
    highlightedHtml.value = ''
    return
  }
  const lang = langMap[expanded.value.lang] || 'text'
  highlightedHtml.value = highlighter.value.codeToHtml(expanded.value.code, {
    lang,
    themes: { light: 'github-light', dark: 'github-dark' },
  })
}

watch([expanded, highlighter], () => updateHighlight())
</script>

<template>
  <div class="sdk-marquee-wrap">
    <!-- Scrolling SDK cards -->
    <div ref="wrapRef" class="sdk-mq-row" :class="{ 'sdk-mq-paused': paused }">
      <Marquee :pause-on-hover="true" class="sdk-marquee" :repeat="2">
        <div
          v-for="sdk in sdks"
          :key="sdk.id"
          :data-sdk="sdk.id"
          class="sdk-mq-card"
          :class="{ active: activeSdk === sdk.id }"
          @click="select(sdk.id)"
        >
          <div class="sdk-mq-top">
            <img v-if="logos[sdk.id]" class="sdk-mq-logo" :src="logos[sdk.id]" :alt="sdk.label" />
            <span class="sdk-mq-name">{{ sdk.label }}</span>
            <span class="sdk-mq-ver">{{ sdk.version }}</span>
          </div>
          <code class="sdk-mq-install">{{ sdk.installs[0].cmd }}</code>
          <pre class="sdk-mq-preview"><code>{{ sdk.code.split('\n').slice(0, 3).join('\n') }}</code></pre>
        </div>
      </Marquee>
    </div>

    <!-- Expanded panel -->
    <Transition name="mq-panel">
      <div v-if="expanded" class="mq-panel">
        <!-- Header: Logo + Name + Version + Nav -->
        <div class="mq-panel-header">
          <div class="mq-panel-title">
            <img v-if="logos[expanded.id]" class="mq-panel-logo" :src="logos[expanded.id]" :alt="expanded.label" />
            <span class="mq-panel-name">{{ expanded.label }}</span>
            <span class="mq-panel-ver">{{ expanded.version }}</span>
          </div>
          <div class="mq-panel-nav">
            <button class="mq-nav-btn" @click="goPrev">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 12L6 8L10 4"/></svg>
            </button>
            <span class="mq-nav-counter">{{ activeIndex + 1 }} / {{ sdks.length }}</span>
            <button class="mq-nav-btn" @click="goNext">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4L10 8L6 12"/></svg>
            </button>
          </div>
        </div>

        <!-- Install section with runtime tabs -->
        <div class="mq-install-section">
          <div class="mq-install-tabs">
            <button
              v-for="(inst, i) in expanded.installs"
              :key="inst.runtime"
              class="mq-install-tab"
              :class="{ active: activeInstallIdx === i }"
              @click="activeInstallIdx = i"
            >
              {{ inst.runtime }}
            </button>
          </div>
          <div class="mq-install-cmd">
            <code>{{ expanded.installs[activeInstallIdx]?.cmd }}</code>
            <button class="mq-copy-sm" @click="copyInstall"><svg v-if="copied === 'install'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button>
          </div>
        </div>

        <!-- Code with syntax highlighting -->
        <div class="mq-code-section">
          <div class="mq-code-header">
            <span class="mq-code-label">Example: Get Quote</span>
            <button class="mq-copy-sm" @click="copyCode"><svg v-if="copied === 'code'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button>
          </div>
          <div v-if="highlightedHtml" class="mq-code" v-html="highlightedHtml" />
          <pre v-else class="mq-code-fallback"><code>{{ expanded.code }}</code></pre>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.sdk-marquee-wrap {
  max-width: 64rem;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Marquee row */
.sdk-mq-row { overflow-x: hidden; }
.sdk-mq-paused { overflow-x: auto; scrollbar-width: none; }
.sdk-mq-paused::-webkit-scrollbar { display: none; }
.sdk-mq-paused :deep(.animate-marquee) { animation-play-state: paused !important; }

.sdk-marquee { --duration: 30s; --gap: 0.75rem; }

/* Cards */
.sdk-mq-card {
  width: 14rem;
  flex-shrink: 0;
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  border: 1.5px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  cursor: pointer;
  transition: all 0.25s;
  overflow: hidden;
}

.sdk-mq-card:hover {
  border-color: var(--brand-color);
  box-shadow: 0 4px 16px color-mix(in srgb, var(--brand-color) 8%, transparent);
  transform: translateY(-2px);
}

.sdk-mq-card.active {
  border-color: var(--brand-color);
  background: color-mix(in srgb, var(--brand-color) 4%, var(--vp-c-bg));
}

.sdk-mq-top { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.375rem; }
.sdk-mq-logo { width: 1.25rem; height: 1.25rem; flex-shrink: 0; object-fit: contain; }
.sdk-mq-name { font-size: 0.95rem; font-weight: 700; color: var(--vp-c-text-1); }
.sdk-mq-ver { font-size: 0.7rem; font-weight: 500; color: var(--vp-c-text-3); margin-left: auto; }

.sdk-mq-install {
  display: block;
  font-size: 0.7rem;
  font-family: var(--vp-font-family-mono);
  color: var(--brand-color);
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sdk-mq-preview {
  margin: 0;
  padding: 0.5rem;
  border-radius: 0.375rem;
  background: var(--vp-c-bg-soft);
  font-size: 0.65rem;
  font-family: var(--vp-font-family-mono);
  line-height: 1.5;
  color: var(--vp-c-text-2);
  overflow: hidden;
  max-height: 3.5rem;
}

.sdk-mq-preview code { font-family: inherit; }

/* Panel */
.mq-panel {
  margin-top: 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  overflow: hidden;
}

/* Panel header */
.mq-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.mq-panel-title { display: flex; align-items: center; gap: 0.5rem; }
.mq-panel-logo { width: 1.5rem; height: 1.5rem; flex-shrink: 0; object-fit: contain; }
.mq-panel-name { font-size: 1rem; font-weight: 700; color: var(--vp-c-text-1); }
.mq-panel-ver { font-size: 0.75rem; font-weight: 500; color: var(--vp-c-text-3); }

.mq-panel-nav { display: flex; align-items: center; gap: 0.375rem; }

.mq-nav-btn {
  display: flex; align-items: center; justify-content: center;
  width: 1.75rem; height: 1.75rem; border-radius: 50%;
  border: 1px solid var(--vp-c-divider); background: transparent;
  color: var(--vp-c-text-2); cursor: pointer; transition: all 0.2s;
}
.mq-nav-btn:hover { border-color: var(--brand-color); color: var(--brand-color); }

.mq-nav-counter {
  font-size: 0.7rem; font-weight: 600; color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono); min-width: 2.5rem; text-align: center;
}

/* Install section */
.mq-install-section {
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.mq-install-tabs { display: flex; gap: 0.25rem; margin-bottom: 0.375rem; }

.mq-install-tab {
  padding: 0.2rem 0.5rem; border-radius: 0.25rem;
  font-size: 0.7rem; font-weight: 600;
  color: var(--vp-c-text-3); background: transparent;
  border: 1px solid transparent; cursor: pointer; transition: all 0.2s;
}
.mq-install-tab:hover { color: var(--vp-c-text-2); }
.mq-install-tab.active {
  color: var(--brand-color); background: var(--vp-c-bg);
  border-color: var(--vp-c-divider);
}

.mq-install-cmd {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.375rem 0.625rem; border-radius: 0.375rem;
  background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider);
}

.mq-install-cmd code {
  font-size: 0.8rem; font-family: var(--vp-font-family-mono); color: var(--vp-c-text-1);
}

/* Copy button (small) */
.mq-copy-sm {
  display: inline-flex; align-items: center; justify-content: center;
  width: 1.75rem; height: 1.75rem; border-radius: 0.375rem;
  color: var(--vp-c-text-3); background: transparent;
  border: none; cursor: pointer;
  transition: all 0.2s; flex-shrink: 0;
}
.mq-copy-sm:hover { color: var(--brand-color); background: color-mix(in srgb, var(--brand-color) 8%, transparent); }
.mq-copy-sm:active { transform: scale(0.8); }
.mq-copy-sm svg { transition: all 0.2s; }
.mq-copy-sm:has(polyline) { color: var(--brand-color); }

/* Code section */
.mq-code-section { }

.mq-code-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.375rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.mq-code-label { font-size: 0.75rem; font-weight: 600; color: var(--vp-c-text-3); }

/* Shiki highlighted code */
.mq-code :deep(pre) {
  margin: 0;
  padding: 1rem;
  font-size: 0.825rem;
  line-height: 1.7;
  overflow-x: auto;
  background: transparent !important;
}

.mq-code :deep(code) {
  font-family: var(--vp-font-family-mono);
}

/* Shiki: light mode uses inline color (default), dark mode switches to --shiki-dark */
.mq-code :deep(.shiki) {
  background: transparent !important;
}

html.dark .mq-code :deep(.shiki),
html.dark .mq-code :deep(.shiki span) {
  color: var(--shiki-dark) !important;
}

/* Fallback (before Shiki loads) */
.mq-code-fallback {
  margin: 0;
  padding: 1rem;
  font-size: 0.825rem;
  line-height: 1.7;
  color: var(--vp-c-text-1);
  overflow-x: auto;
  font-family: var(--vp-font-family-mono);
}

/* Transitions */
.mq-panel-enter-active { transition: all 0.3s ease; }
.mq-panel-leave-active { transition: all 0.2s ease; }
.mq-panel-enter-from { opacity: 0; transform: translateY(-8px); }
.mq-panel-leave-to { opacity: 0; }
</style>
