<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { isDark } = useData()

// Feature items
const features = [
  {
    key: 'feat1',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
    terminal: [
      { type: 'cmd', text: '$ longbridge help' },
      { type: 'blank', text: '' },
      { type: 'comment', text: 'AI-native CLI for the Longbridge trading platform —' },
      { type: 'comment', text: 'real-time market data, portfolio, and trading.' },
      { type: 'blank', text: '' },
      { type: 'comment', text: 'Usage: longbridge [OPTIONS] [COMMAND]' },
      { type: 'blank', text: '' },
      { type: 'comment', text: 'Commands:' },
      { type: 'data', text: '  login      Authenticate via browser OAuth' },
      { type: 'data', text: '  quote      Real-time quotes for one or more symbols' },
      { type: 'data', text: '  depth      Level 2 order book (bid/ask ladder)' },
      { type: 'data', text: '  tui        Launch the interactive full-screen TUI' },
    ],
  },
  {
    key: 'feat3',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 18l6-6-6-6"/><path d="M8 6l-6 6 6 6"/></svg>`,
    terminal: [
      { type: 'cmd', text: '$ longbridge quote TSLA.US --format json' },
      { type: 'blank', text: '' },
      { type: 'json', text: '[{' },
      { type: 'json', text: '  "symbol": "TSLA.US",' },
      { type: 'json', text: '  "last":   "348.950",' },
      { type: 'json', text: '  "open":   "346.285",' },
      { type: 'json', text: '  "high":   "350.360",' },
      { type: 'json', text: '  "low":    "342.740",' },
      { type: 'json', text: '  "volume": "51336034"' },
      { type: 'json', text: '}]' },
    ],
  },
  {
    key: 'feat5',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    terminal: [
      { type: 'cmd', text: '$ longbridge kline TSLA.US --period day' },
      { type: 'blank', text: '' },
      { type: 'comment', text: '  Date        Open    High    Low     Close   Volume' },
      { type: 'data', text: '  2026-04-06  362.59  367.72  346.64  352.82  77.7M' },
      { type: 'data', text: '  2026-04-07  346.44  348.02  337.24  346.65  74.5M' },
      { type: 'data', text: '  2026-04-08  363.79  364.50  339.67  343.25  78.8M' },
      { type: 'data', text: '  2026-04-09  343.15  348.88  337.25  345.62  62.2M' },
      { type: 'data', text: '  2026-04-10  346.29  350.36  342.74  348.95  51.3M' },
    ],
  },
  {
    key: 'feat6',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
    terminal: [
      { type: 'cmd', text: '$ longbridge positions' },
      { type: 'blank', text: '' },
      { type: 'comment', text: '  Symbol     Name       Qty   Cost    P&L        %' },
      { type: 'data', text: '  TSLA.US    Tesla      100   312.40  +3,655   +11.7%' },
      { type: 'data', text: '  AAPL.US    Apple       50   185.20  +1,328   +14.3%' },
      { type: 'data', text: '  NVDA.US    NVIDIA      30   780.50  +1,242    +5.3%' },
      { type: 'data', text: '  700.HK     Tencent    200   380.00    +880    +1.2%' },
      { type: 'data', text: '  9988.HK    Alibaba    100    68.50    +370    +5.4%' },
      { type: 'comment', text: '  ──────────────────────────────────────────────' },
      { type: 'data', text: '  Total P&L  +7,475  (+9.6%)' },
    ],
  },
  {
    key: 'feat4',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>`,
    terminal: [
      { type: 'cmd', text: '$ longbridge auth login' },
      { type: 'blank', text: '' },
      { type: 'comment', text: '  Visit this URL in your browser:' },
      { type: 'data', text: '  https://open.longbridge.com/oauth/device' },
      { type: 'blank', text: '' },
      { type: 'comment', text: '  Your device code:  ABCD-1234' },
      { type: 'blank', text: '' },
      { type: 'comment', text: '  Waiting for authorization...' },
      { type: 'data', text: '  ✓ Token saved to ~/.longbridge/openapi/tokens/' },
    ],
  },
]

// Install tabs — from /docs/cli/install
const installTabs = [
  { label: 'macOS', cmd: 'brew install --cask longbridge/tap/longbridge-terminal' },
  { label: 'Linux', cmd: 'curl -sSL https://open.longbridge.com/longbridge/longbridge-terminal/install | sh' },
  { label: 'Windows', cmd: 'iwr https://open.longbridge.com/longbridge/longbridge-terminal/install.ps1 | iex' },
]
const activeInstallTab = ref(0)

// Terminal theme — follows VitePress site theme
const terminalTheme = computed(() => (isDark.value ? 'dark' : 'light'))

const activeFeature = ref(0)
const terminalLines = computed(() => features[activeFeature.value].terminal)

// Typing animation
const visibleCount = ref(0)
let typingInterval: ReturnType<typeof setInterval> | undefined

function startTyping() {
  visibleCount.value = 0
  if (typingInterval) clearInterval(typingInterval)
  typingInterval = setInterval(() => {
    visibleCount.value++
    if (visibleCount.value >= terminalLines.value.length) clearInterval(typingInterval)
  }, 120)
}

// Auto-rotate through features; stops permanently on user interaction
let autoRotate: ReturnType<typeof setInterval> | undefined
const userSelected = ref(false)

function stopAutoRotate() {
  if (autoRotate) {
    clearInterval(autoRotate)
    autoRotate = undefined
  }
}

function selectFeature(idx: number) {
  userSelected.value = true
  stopAutoRotate()
  activeFeature.value = idx
}

watch(activeFeature, () => startTyping())
onMounted(() => {
  startTyping()
  autoRotate = setInterval(() => {
    if (!userSelected.value) {
      activeFeature.value = (activeFeature.value + 1) % features.length
    }
  }, 3500)
})
onUnmounted(() => {
  if (typingInterval) clearInterval(typingInterval)
  stopAutoRotate()
})

// Copy current terminal command
const copiedCmd = ref(false)
function copyCmd() {
  const cmd = terminalLines.value.find((l) => l.type === 'cmd')
  if (cmd) {
    navigator.clipboard.writeText(cmd.text.replace(/^\$ /, ''))
    copiedCmd.value = true
    setTimeout(() => {
      copiedCmd.value = false
    }, 2000)
  }
}

// Copy install command
const copiedInstall = ref(false)
function copyInstall() {
  navigator.clipboard.writeText(installTabs[activeInstallTab.value].cmd)
  copiedInstall.value = true
  setTimeout(() => {
    copiedInstall.value = false
  }, 2000)
}
</script>

<template>
  <section class="cli-section">
    <div class="cli-container">
      <!-- Left -->
      <div class="cli-text">
        <h2 class="cli-title">{{ $t('product.cli.title') }}</h2>
        <p class="cli-subtitle">{{ $t('product.cli.subtitle') }}</p>

        <!-- Feature list -->
        <div class="cli-features">
          <button
            v-for="(feat, idx) in features"
            :key="feat.key"
            class="cli-feat"
            :class="{ active: activeFeature === idx }"
            @click="selectFeature(idx)"
            @mouseenter="selectFeature(idx)">
            <span class="cli-feat-icon" v-html="feat.icon" />
            <span class="cli-feat-label">{{ $t(`product.cli.${feat.key}`) }}</span>
          </button>
        </div>

        <a href="/docs/cli" class="cli-cta">
          {{ $t('product.cli.cta') }}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>

      <!-- Right: Terminal -->
      <div class="cli-terminal-col">
        <ClientOnly>
          <div class="cli-terminal" :class="terminalTheme">
            <div class="cli-bar">
              <div class="cli-dots"><span /><span /><span /></div>
              <span class="cli-bar-title">longbridge — zsh</span>
              <button class="cli-bar-copy" @click="copyCmd">
                <svg
                  v-if="copiedCmd"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <svg
                  v-else
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              </button>
            </div>
            <div class="cli-body">
              <Transition name="cli-fade" mode="out-in">
                <div :key="activeFeature">
                  <div
                    v-for="(line, i) in terminalLines"
                    :key="i"
                    class="cli-line"
                    :class="[`cli-line-${line.type}`, { visible: i < visibleCount }]">
                    {{ line.text }}
                  </div>
                  <span v-if="visibleCount >= terminalLines.length" class="cli-cursor">█</span>
                </div>
              </Transition>
            </div>
          </div>
        </ClientOnly>
      </div>
    </div>

    <!-- Install — full width below the two-column layout -->
    <div class="cli-install">
      <div class="cli-install-inner">
        <div class="cli-install-tabs">
          <button
            v-for="(tab, idx) in installTabs"
            :key="tab.label"
            class="cli-install-tab"
            :class="{ active: activeInstallTab === idx }"
            @click="activeInstallTab = idx">
            {{ tab.label }}
          </button>
        </div>
        <div class="cli-install-cmd">
          <code>{{ installTabs[activeInstallTab].cmd }}</code>
          <button class="cli-copy-btn" @click="copyInstall">
            <svg
              v-if="copiedInstall"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <svg
              v-else
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cli-section {
  padding: 4rem 0;
  background: var(--vp-c-bg-soft);
}

.cli-container {
  display: flex;
  align-items: flex-start;
  gap: 3rem;
  max-width: 64rem;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.cli-text {
  flex: 1;
  min-width: 0;
}

.cli-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.02em;
}
.cli-subtitle {
  margin-top: 24px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}

/* Feature list */
.cli-features {
  margin-top: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.cli-feat {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.4;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}
.cli-feat:hover {
  background: var(--vp-c-bg);
  border-color: var(--vp-c-divider);
}
.cli-feat.active {
  background: var(--vp-c-bg);
  border-color: var(--brand-color);
  color: var(--vp-c-text-1);
}
.cli-feat.active .cli-feat-icon {
  color: var(--brand-color);
}

.cli-feat-icon {
  display: flex;
  width: 1.125rem;
  height: 1.125rem;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  margin-top: 0.1rem;
  transition: color 0.2s;
}
.cli-feat-icon :deep(svg) {
  width: 100%;
  height: 100%;
}
.cli-feat-label {
  flex: 1;
}

/* Install — full width below two-column */
.cli-install {
  max-width: 64rem;
  margin: 2rem auto 0;
  padding: 0 1.5rem;
}

.cli-install-inner {
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.5rem;
  overflow: hidden;
  background: var(--vp-c-bg);
}

.cli-install-tabs {
  display: flex;
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 0 0.25rem;
}

.cli-install-tab {
  padding: 0.3rem 0.625rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
  transition:
    color 0.2s,
    border-color 0.2s;
}
.cli-install-tab:hover {
  color: var(--vp-c-text-2);
}
.cli-install-tab.active {
  color: var(--brand-color);
  border-bottom-color: var(--brand-color);
}

.cli-install-cmd {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
}
.cli-install-cmd code {
  font-size: 0.72rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-2);
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cli-copy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.375rem;
  flex-shrink: 0;
  color: var(--vp-c-text-3);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}
.cli-copy-btn:hover {
  color: var(--brand-color);
  background: color-mix(in srgb, var(--brand-color) 8%, transparent);
}
.cli-copy-btn:active {
  transform: scale(0.8);
}

.cli-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--brand-color);
  text-decoration: none !important;
  transition: gap 0.2s;
}
.cli-cta:hover {
  gap: 0.625rem;
}

/* ===== Terminal ===== */
.cli-terminal-col {
  flex: 0 0 29rem;
  align-self: flex-start;
}

.cli-terminal {
  border-radius: 0.75rem;
  overflow: hidden;
  transition:
    background 0.3s,
    border-color 0.3s;
}

/* Dark theme (original) */
.cli-terminal.dark {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #1a1b26;
}
.cli-terminal.dark .cli-bar {
  background: #15161e;
  border-bottom: 1px solid #2a2b3d;
}
.cli-terminal.dark .cli-bar-title {
  color: #565869;
}
.cli-terminal.dark .cli-theme-btn,
.cli-terminal.dark .cli-bar-copy {
  color: #565869;
}
.cli-terminal.dark .cli-theme-btn:hover,
.cli-terminal.dark .cli-bar-copy:hover {
  color: #7aa2f7;
}
.cli-terminal.dark .cli-body {
  color: #a9b1d6;
}
.cli-terminal.dark .cli-line-cmd {
  color: #7aa2f7;
}
.cli-terminal.dark .cli-line-data {
  color: #9ece6a;
}
.cli-terminal.dark .cli-line-json {
  color: #e0af68;
}
.cli-terminal.dark .cli-line-comment {
  color: #565869;
}
.cli-terminal.dark .cli-cursor {
  color: #7aa2f7;
}

/* Light theme */
.cli-terminal.light {
  border: 1px solid #e0e0e5;
  background: #f8f8fa;
}
.cli-terminal.light .cli-bar {
  background: #ebebed;
  border-bottom: 1px solid #d8d8dc;
}
.cli-terminal.light .cli-bar-title {
  color: #9a9aa8;
}
.cli-terminal.light .cli-theme-btn,
.cli-terminal.light .cli-bar-copy {
  color: #9a9aa8;
}
.cli-terminal.light .cli-theme-btn:hover,
.cli-terminal.light .cli-bar-copy:hover {
  color: #4078f2;
}
.cli-terminal.light .cli-body {
  color: #383a42;
}
.cli-terminal.light .cli-line-cmd {
  color: #4078f2;
}
.cli-terminal.light .cli-line-data {
  color: #50a14f;
}
.cli-terminal.light .cli-line-json {
  color: #c18401;
}
.cli-terminal.light .cli-line-comment {
  color: #a0a1a7;
}
.cli-terminal.light .cli-cursor {
  color: #4078f2;
}

/* Bar shared layout */
.cli-bar {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
}
.cli-dots {
  display: flex;
  gap: 0.375rem;
}
.cli-dots span {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
}
.cli-dots span:nth-child(1) {
  background: #ff5f57;
}
.cli-dots span:nth-child(2) {
  background: #febc2e;
}
.cli-dots span:nth-child(3) {
  background: #28c840;
}
.cli-bar-title {
  flex: 1;
  text-align: center;
  font-size: 0.7rem;
  font-weight: 500;
}

.cli-bar-copy {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 0.25rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}
.cli-bar-copy:active {
  transform: scale(0.85);
}

/* Body */
.cli-body {
  padding: 0.875rem 1.125rem;
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  height: 15rem;
  overflow: hidden;
}

.cli-line {
  white-space: pre;
  opacity: 0;
  transform: translateY(4px);
  transition:
    opacity 0.12s,
    transform 0.12s;
}
.cli-line.visible {
  opacity: 1;
  transform: translateY(0);
}
.cli-line-blank {
  height: 0.75em;
}
.cli-line-sep {
  opacity: 0.3;
}

.cli-cursor {
  animation: blink 1s step-end infinite;
  display: none;
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}

.cli-fade-enter-active,
.cli-fade-leave-active {
  transition: opacity 0.15s;
}
.cli-fade-enter-from,
.cli-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .cli-container {
    flex-direction: column;
  }
  .cli-terminal-col {
    flex: none;
    width: 100%;
  }
}
</style>
