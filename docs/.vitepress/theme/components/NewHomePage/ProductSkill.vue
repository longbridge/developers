<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const activeCapIdx = ref(0)

const caps = ['cap1', 'cap2', 'cap3', 'cap4', 'cap5', 'cap6']

const agents = [
  {
    name: 'Claude Code',
    logo: 'https://assets.lbctrl.com/uploads/6932dfac-0f9c-4577-bdd8-fc3d22d4223a/claude.svg',
  },
  {
    name: 'Codex',
    logo: 'https://assets.lbctrl.com/uploads/88eb58fe-b3bb-4875-90c7-c97e6d8fcc9e/openai.svg',
  },
  {
    name: 'Cursor',
    logo: 'https://assets.lbctrl.com/uploads/f694478e-201b-4e74-a7b6-023639a27805/cursor.svg',
  },
  {
    name: 'Gemini',
    logo: 'https://assets.lbctrl.com/uploads/33c65d69-8e68-4de9-ada5-0e2d5e5d35e9/gemini.svg',
  },
]

const SEMANTIC_TEXT = `Install Longbridge Skill following the guide:\nhttps://developers.longbridge.com/skill/install.md`

const cliTabs = [
  { label: 'bun', cmd: 'bunx skills add longbridge/developers -g -y' },
  { label: 'npx', cmd: 'npx skills add longbridge/developers -g -y' },
  { label: 'yarn', cmd: 'yarn dlx skills add longbridge/developers -g -y' },
]
const activeCliTab = ref(0)

// AI responses — from SKILL.md Investment Analysis Workflow
const aiSteps: Record<string, string[]> = {
  cap1: [
    'longbridge quote ... --format json',
    'longbridge valuation ...',
    'Filtering: market cap > $50B, P/E < 25, MACD golden cross...',
    'Found 12 matches across US and HK markets.',
  ],
  cap2: [
    'longbridge kline TSLA.US --period day',
    'longbridge kline TSLA.US --period 1h',
    'MACD: bullish crossover on daily. KDJ: overbought. RSI: 62.',
    'Support at 337.25, resistance at 348.88.',
  ],
  cap3: [
    'longbridge financial-report NVDA.US --type quarterly',
    'longbridge consensus NVDA.US',
    'Revenue: $35.1B vs $33.2B est (+5.7% beat)',
    'P/E forward: 28.4x — above sector median 24.1x',
  ],
  cap4: [
    'longbridge insider-trades AAPL.US',
    'longbridge investors',
    '3 insider sells in past 30 days (routine RSU)',
    'Top 20 institutions: +2.1% net increase QoQ',
  ],
  cap5: [
    'Preparing: TSLA.US trailing stop -8%',
    'Order type: Trailing Stop Loss',
    'Trigger: if price drops 8% from peak',
    '⚠ Awaiting your confirmation to execute.',
  ],
  cap6: [
    'longbridge portfolio',
    'longbridge positions',
    'Monthly P&L: +$3,240 (+4.2%)',
    'Top: NVDA +12.3% | Bottom: 700.HK -3.1%',
  ],
}

// Typing effect
const typedPrompt = ref('')
const streamLines = ref<string[]>([])
const streaming = ref(false)
let typeTimer: ReturnType<typeof setInterval> | undefined
let streamTimer: ReturnType<typeof setInterval> | undefined

function startDemo() {
  typedPrompt.value = ''
  streamLines.value = []
  streaming.value = false
  if (typeTimer) clearInterval(typeTimer)
  if (streamTimer) clearInterval(streamTimer)

  const fullPrompt = t(`product.skill.${caps[activeCapIdx.value]}.example`)
  let charIdx = 0

  typeTimer = setInterval(() => {
    charIdx += 2
    typedPrompt.value = fullPrompt.substring(0, charIdx)
    if (charIdx >= fullPrompt.length) {
      clearInterval(typeTimer)
      setTimeout(() => {
        streaming.value = true
        const steps = aiSteps[caps[activeCapIdx.value]]
        let stepIdx = 0
        streamTimer = setInterval(() => {
          if (stepIdx < steps.length) {
            streamLines.value.push(steps[stepIdx])
            stepIdx++
          } else {
            clearInterval(streamTimer)
          }
        }, 400)
      }, 300)
    }
  }, 25)
}

watch(activeCapIdx, () => startDemo())
onMounted(() => startDemo())

const copiedPrompt = ref(false)
function copyPrompt() {
  navigator.clipboard.writeText(t(`product.skill.${caps[activeCapIdx.value]}.example`))
  copiedPrompt.value = true
  setTimeout(() => {
    copiedPrompt.value = false
  }, 2000)
}

const copiedSemantic = ref(false)
function copySemantic() {
  navigator.clipboard.writeText(SEMANTIC_TEXT)
  copiedSemantic.value = true
  setTimeout(() => {
    copiedSemantic.value = false
  }, 2000)
}

const copiedCli = ref(false)
function copyCli() {
  navigator.clipboard.writeText(cliTabs[activeCliTab.value].cmd)
  copiedCli.value = true
  setTimeout(() => {
    copiedCli.value = false
  }, 2000)
}
</script>

<template>
  <section class="skill-section">
    <!-- Header -->
    <div class="skill-header">
      <h2 class="skill-title">{{ $t('product.skill.title') }}</h2>
      <p class="skill-subtitle">{{ $t('product.skill.subtitle') }}</p>
      <p class="skill-desc">{{ $t('product.skill.desc') }}</p>
    </div>

    <!-- Install — semantic AI prompt first, CLI second -->
    <div class="skill-install-wrap">
      <p class="skill-install-label">Copy and send to any AI — it will walk you through the installation:</p>
      <div class="skill-install-ai-block">
        <div class="skill-install-ai-text">
          <span>Install Longbridge Skill following the guide:</span>
          <span class="skill-install-ai-url">https://developers.longbridge.com/skill/install.md</span>
        </div>
        <button class="skill-copy-btn" @click="copySemantic">
          <svg
            v-if="copiedSemantic"
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

      <!-- CLI alternative -->
      <div class="skill-install-cli">
        <span class="skill-install-divider">Or install via CLI</span>
        <div class="skill-install-cmd-wrap">
          <div class="skill-install-tabs">
            <button
              v-for="(tab, idx) in cliTabs"
              :key="tab.label"
              class="skill-install-tab"
              :class="{ active: activeCliTab === idx }"
              @click="activeCliTab = idx">
              {{ tab.label }}
            </button>
          </div>
          <div class="skill-install-cmd">
            <code>{{ cliTabs[activeCliTab].cmd }}</code>
            <button class="skill-copy-btn" @click="copyCli">
              <svg
                v-if="copiedCli"
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
        </div>
      </div>
    </div>

    <!-- Agent row — display only, no click -->
    <div class="skill-agent-row">
      <div v-for="agent in agents" :key="agent.name" class="skill-agent-chip">
        <img class="skill-agent-logo" :src="agent.logo" :alt="agent.name" />
        <span class="skill-agent-name">{{ agent.name }}</span>
      </div>
      <span class="skill-agent-more">+ any Skill-compatible agent</span>
    </div>

    <!-- Agent simulator -->
    <ClientOnly>
      <div class="skill-mock">
        <div class="skill-mock-bar">
          <div class="skill-mock-dots"><span /><span /><span /></div>
          <span class="skill-mock-title">Claude Code</span>
        </div>

        <!-- Capability tabs -->
        <div class="skill-mock-caps">
          <button
            v-for="(cap, idx) in caps"
            :key="cap"
            class="skill-mock-cap"
            :class="{ active: activeCapIdx === idx }"
            @click="activeCapIdx = idx">
            {{ $t(`product.skill.${cap}.title`) }}
          </button>
        </div>

        <div class="skill-mock-body">
          <!-- User typing -->
          <div class="skill-mock-msg">
            <span class="skill-mock-role">You</span>
            <div class="skill-mock-bubble">
              <p>{{ typedPrompt }}<span v-if="!streaming" class="skill-mock-caret">|</span></p>
              <button class="skill-mock-copy" @click="copyPrompt">
                <svg
                  v-if="copiedPrompt"
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
          </div>

          <!-- AI streaming -->
          <div v-if="streaming" class="skill-mock-msg">
            <span class="skill-mock-role skill-mock-role-ai">Claude Code</span>
            <div class="skill-mock-stream">
              <span class="skill-mock-thinking">Using Longbridge Skill...</span>
              <TransitionGroup name="skill-stream-line" tag="div" class="skill-mock-cmds">
                <code v-for="(line, i) in streamLines" :key="i">{{ line }}</code>
              </TransitionGroup>
              <span v-if="streamLines.length < aiSteps[caps[activeCapIdx]].length" class="skill-mock-streaming">▊</span>
            </div>
          </div>
        </div>

        <div class="skill-mock-tip">Tip: prefix with <code>/longbridge</code> to force trigger</div>
      </div>
    </ClientOnly>

    <div class="skill-cta-wrap">
      <a href="skill/install" class="skill-cta">
        {{ $t('product.skill.cta') }}
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
  </section>
</template>

<style scoped>
.skill-section {
  padding: 4rem 0;
  background: var(--vp-c-bg);
}

/* Header */
.skill-header {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 0 1.5rem;
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
}
.skill-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.02em;
}
.skill-subtitle {
  margin-top: 24px;
  color: var(--vp-c-text-2);
  font-weight: 600;
  line-height: 1.4;
}
.skill-desc {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

/* Install wrap */
.skill-install-wrap {
  max-width: 64rem;
  margin: 0 auto 1.5rem;
}

.skill-install-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  text-align: center;
  margin-bottom: 0.625rem;
}

/* Semantic AI block */
.skill-install-ai-block {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.625rem;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.skill-install-ai-text {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
  font-size: 0.875rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.skill-install-ai-url {
  color: var(--vp-c-text-3);
}

/* CLI install */
.skill-install-cli {
  margin-top: 1rem;
}

.skill-install-divider {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  margin-bottom: 0.5rem;
  text-align: center;
  justify-content: center;
}
.skill-install-divider::before,
.skill-install-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--vp-c-divider);
}

.skill-install-cmd-wrap {
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.5rem;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.skill-install-tabs {
  display: flex;
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 0 0.25rem;
  gap: 0;
}

.skill-install-tab {
  padding: 0.3rem 0.75rem;
  font-size: 0.875rem;
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
.skill-install-tab:hover {
  color: var(--vp-c-text-2);
}
.skill-install-tab.active {
  color: var(--brand-color);
  border-bottom-color: var(--brand-color);
}

.skill-install-cmd {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.625rem;
}
.skill-install-cmd code {
  font-size: 0.875rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-2);
  flex: 1;
}

.skill-copy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  color: var(--vp-c-text-3);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}
.skill-copy-btn:hover {
  color: var(--brand-color);
  background: color-mix(in srgb, var(--brand-color) 8%, transparent);
}
.skill-copy-btn:active {
  transform: scale(0.8);
}

/* Agent row — display only */
.skill-agent-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  margin: 0 auto 1.25rem;
  padding: 0 1.5rem;
  max-width: 64rem;
}

.skill-agent-chip {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.625rem 0.25rem 0.25rem;
  border-radius: 9999px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.skill-agent-logo {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  object-fit: contain;
  flex-shrink: 0;
}
:root.dark .skill-agent-logo {
  filter: brightness(0) invert(1);
}

.skill-agent-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.skill-agent-more {
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  border: 1px dashed var(--vp-c-divider);
  font-style: italic;
}

/* Mock */
.skill-mock {
  max-width: 64rem;
  margin: 0 auto;
  border-radius: 0.75rem;
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}
.skill-mock-bar {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--vp-c-divider);
}
.skill-mock-dots {
  display: flex;
  gap: 0.375rem;
}
.skill-mock-dots span {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}
.skill-mock-dots span:nth-child(1) {
  background: #ff5f57;
}
.skill-mock-dots span:nth-child(2) {
  background: #febc2e;
}
.skill-mock-dots span:nth-child(3) {
  background: #28c840;
}
.skill-mock-title {
  flex: 1;
  text-align: center;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
}
.skill-mock-caps {
  display: flex;
  overflow-x: auto;
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 0 0.5rem;
}
.skill-mock-cap {
  padding: 0.375rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.skill-mock-cap:hover {
  color: var(--vp-c-text-2);
}
.skill-mock-cap.active {
  color: var(--brand-color);
  border-bottom-color: var(--brand-color);
}

.skill-mock-body {
  padding: 1rem;
  min-height: 12rem;
}
.skill-mock-msg {
  margin-bottom: 0.875rem;
}
.skill-mock-role {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}
.skill-mock-role-ai {
  color: var(--brand-color);
}

.skill-mock-bubble {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  border-radius: 0.5rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
}
.skill-mock-bubble p {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--vp-c-text-1);
  flex: 1;
  min-height: 1.2em;
}
.skill-mock-caret {
  color: var(--brand-color);
  animation: blink-caret 0.6s step-end infinite;
}
@keyframes blink-caret {
  50% {
    opacity: 0;
  }
}

.skill-mock-copy {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 0.25rem;
  color: var(--vp-c-text-3);
  background: transparent;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  opacity: 0;
  transition: all 0.2s;
}
.skill-mock-bubble:hover .skill-mock-copy {
  opacity: 1;
}
.skill-mock-copy:hover {
  color: var(--brand-color);
}

.skill-mock-stream {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.skill-mock-thinking {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  font-style: italic;
}
.skill-mock-cmds {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.skill-mock-cmds code {
  font-size: 0.875rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-2);
  padding: 0.25rem 0.625rem;
  border-radius: 0.25rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
}
.skill-mock-streaming {
  color: var(--brand-color);
  animation: blink-caret 0.6s step-end infinite;
}

.skill-stream-line-enter-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}
.skill-stream-line-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.skill-mock-tip {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  border-top: 1px solid var(--vp-c-divider);
}
.skill-mock-tip code {
  font-family: var(--vp-font-family-mono);
  color: var(--brand-color);
  font-weight: 600;
}

/* CTA */
.skill-cta-wrap {
  text-align: center;
  margin-top: 1.5rem;
  padding: 0 1.5rem;
}
.skill-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--brand-color);
  text-decoration: none !important;
  transition: gap 0.2s;
}
.skill-cta:hover {
  gap: 0.625rem;
}

@media (max-width: 640px) {
  .skill-agent-row {
    gap: 0.375rem;
  }
  .skill-install-ai-block {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
