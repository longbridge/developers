<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const activeClient = ref(0)

const clients = [
  {
    id: 'claude',
    name: 'Claude Code',
    logo: 'https://assets.lbctrl.com/uploads/6932dfac-0f9c-4577-bdd8-fc3d22d4223a/claude.svg',
    type: 'shell' as const,
    cmd: 'claude mcp add --transport http longbridge https://openapi.longbridge.com/mcp',
  },
  {
    id: 'codex',
    name: 'Codex',
    logo: 'https://assets.lbctrl.com/uploads/88eb58fe-b3bb-4875-90c7-c97e6d8fcc9e/openai.svg',
    type: 'ui' as const,
    steps: ['Settings', 'MCP Servers', 'Add Server'],
    fields: { Name: 'longbridge', Type: 'Streamable HTTP', URL: 'https://openapi.longbridge.com/mcp' },
  },
  {
    id: 'cursor',
    name: 'Cursor',
    logo: 'https://assets.lbctrl.com/uploads/f694478e-201b-4e74-a7b6-023639a27805/cursor.svg',
    type: 'ui' as const,
    steps: ['Settings', 'MCP Servers', 'Add Remote MCP Server'],
    fields: { URL: 'https://openapi.longbridge.com/mcp' },
  },
  {
    id: 'zed',
    name: 'Zed',
    logo: 'https://assets.lbctrl.com/uploads/3418077a-9766-4514-bc8e-eef076309689/zed.svg',
    type: 'json' as const,
    json: { mcpServers: { longbridge: { url: 'https://openapi.longbridge.com/mcp' } } },
  },
  {
    id: 'cherry',
    name: 'Cherry Studio',
    logo: 'https://assets.lbctrl.com/uploads/df8f9467-91a5-4bdb-8dde-5127441f0b04/cherrystudio.svg',
    type: 'ui' as const,
    steps: ['Settings', 'MCP Servers', 'Add'],
    fields: { URL: 'https://openapi.longbridge.com/mcp' },
  },
]

// Diagram node layout (SVG coordinate space)
const clientNodes = [
  { name: 'Claude Code', x: 8, w: 108, clickIdx: 0 },
  { name: 'Codex', x: 124, w: 68, clickIdx: 1 },
  { name: 'Cursor', x: 200, w: 72, clickIdx: 2 },
  { name: 'Zed', x: 280, w: 50, clickIdx: 3 },
  { name: 'Cherry Studio', x: 338, w: 118, clickIdx: 4 },
  { name: 'Any MCP Client', x: 464, w: 130, clickIdx: -1 },
]

const toolPositions = [
  { x: 8, w: 160 },
  { x: 240, w: 160 },
  { x: 472, w: 160 },
]

// Layout constants
const SVG_W = 640
const SVG_H = 300
const CLIENT_H = 34
const BUS_TOP_Y = 82
const HUB_X = 240,
  HUB_Y = 108,
  HUB_W = 160,
  HUB_H = 40
const HUB_CX = HUB_X + HUB_W / 2 // 320
const BUS_BOT_Y = 192
const TOOL_Y = 218,
  TOOL_H = 78

const clientCenters = clientNodes.map((c) => c.x + c.w / 2)
const toolCenters = toolPositions.map((t) => t.x + t.w / 2)

function selectClient(idx: number) {
  if (idx >= 0) activeClient.value = idx
}

const currentClient = computed(() => clients[activeClient.value])
const copyText = computed(() => {
  const c = currentClient.value
  if (c.type === 'shell') return c.cmd
  if (c.type === 'json') return JSON.stringify(c.json, null, 2)
  return ''
})
const formattedJson = computed(() => {
  const c = currentClient.value
  if (c.type === 'json' && c.json) return JSON.stringify(c.json, null, 2)
  return ''
})

const copiedCmd = ref(false)
function copyCmd() {
  navigator.clipboard.writeText(copyText.value)
  copiedCmd.value = true
  setTimeout(() => {
    copiedCmd.value = false
  }, 2000)
}
</script>

<template>
  <section class="mcp-section">
    <div class="mcp-header">
      <h2 class="mcp-title">{{ $t('product.mcp.title') }}</h2>
      <p class="mcp-subtitle">{{ $t('product.mcp.subtitle') }}</p>
      <p class="mcp-desc">{{ $t('product.mcp.desc') }}</p>
    </div>

    <!-- Bus-topology SVG diagram (replaces VueFlow) -->
    <ClientOnly>
      <div class="mcp-diagram-wrap">
        <svg class="mcp-diagram-svg" :viewBox="`0 0 ${SVG_W} ${SVG_H}`" preserveAspectRatio="xMidYMid meet">
          <!-- Top horizontal bus line (background) -->
          <line
            class="mcp-edge"
            :x1="clientCenters[0]"
            :y1="BUS_TOP_Y"
            :x2="clientCenters[clientCenters.length - 1]"
            :y2="BUS_TOP_Y" />
          <!-- Active bus segment: active client → hub center (highlighted overlay) -->
          <line
            class="mcp-edge mcp-edge-hi"
            :x1="clientCenters[activeClient]"
            :y1="BUS_TOP_Y"
            :x2="HUB_CX"
            :y2="BUS_TOP_Y" />

          <!-- Client stubs: each client bottom → top bus -->
          <line
            v-for="(cx, i) in clientCenters"
            :key="`cs-${i}`"
            :class="['mcp-edge', { 'mcp-edge-hi': activeClient === i && i < clients.length }]"
            :style="i === clientNodes.length - 1 ? { opacity: 0.4 } : {}"
            :x1="cx"
            :y1="CLIENT_H"
            :x2="cx"
            :y2="BUS_TOP_Y" />

          <!-- Hub spine: top bus → hub top -->
          <line class="mcp-edge mcp-edge-hi" :x1="HUB_CX" :y1="BUS_TOP_Y" :x2="HUB_CX" :y2="HUB_Y" />

          <!-- Hub spine: hub bottom → bottom bus -->
          <line class="mcp-edge mcp-edge-hi" :x1="HUB_CX" :y1="HUB_Y + HUB_H" :x2="HUB_CX" :y2="BUS_BOT_Y" />

          <!-- Bottom horizontal bus line (branded) -->
          <line
            class="mcp-edge mcp-edge-down"
            :x1="toolCenters[0]"
            :y1="BUS_BOT_Y"
            :x2="toolCenters[toolCenters.length - 1]"
            :y2="BUS_BOT_Y" />

          <!-- Tool stubs: bottom bus → each tool top (branded) -->
          <line
            v-for="(tx, i) in toolCenters"
            :key="`ts-${i}`"
            class="mcp-edge mcp-edge-down"
            :x1="tx"
            :y1="BUS_BOT_Y"
            :x2="tx"
            :y2="TOOL_Y" />

          <!-- Client nodes -->
          <foreignObject
            v-for="(node, i) in clientNodes"
            :key="`c-${i}`"
            :x="node.x"
            :y="0"
            :width="node.w"
            :height="CLIENT_H">
            <div
              :class="['mcp-n', 'mcp-n-client', { active: activeClient === i, more: node.clickIdx < 0 }]"
              @click="selectClient(node.clickIdx)">
              <img
                v-if="node.clickIdx >= 0 && clients[node.clickIdx]?.logo"
                class="mcp-client-logo"
                :src="clients[node.clickIdx].logo" />
              {{ node.name }}
            </div>
          </foreignObject>

          <!-- Hub node -->
          <foreignObject :x="HUB_X" :y="HUB_Y" :width="HUB_W" :height="HUB_H">
            <div class="mcp-n mcp-n-hub">Longbridge MCP</div>
          </foreignObject>

          <!-- Tool nodes -->
          <foreignObject
            v-for="(pos, i) in toolPositions"
            :key="`t-${i}`"
            :x="pos.x"
            :y="TOOL_Y"
            :width="pos.w"
            :height="TOOL_H">
            <div class="mcp-n mcp-n-tool">
              <span class="mcp-n-tool-title">{{ $t(`product.mcp.tool${i + 1}`) }}</span>
              <span class="mcp-n-tool-desc">{{ $t(`product.mcp.tool${i + 1}.desc`) }}</span>
            </div>
          </foreignObject>
        </svg>
      </div>
    </ClientOnly>

    <!-- Config panel -->
    <div class="mcp-config">
      <div class="mcp-config-tabs">
        <button
          v-for="(client, idx) in clients"
          :key="client.id"
          class="mcp-config-tab"
          :class="{ active: activeClient === idx }"
          @click="activeClient = idx">
          <img v-if="client.logo" class="mcp-tab-logo" :src="client.logo" :alt="client.name" />
          {{ client.name }}
        </button>
      </div>

      <div v-if="currentClient.type === 'shell'" class="mcp-config-panel">
        <div class="mcp-config-cmd">
          <span class="mcp-cmd-prompt">$</span>
          <code class="mcp-cmd-shell">{{ currentClient.cmd }}</code>
          <button class="mcp-copy-btn" @click="copyCmd">
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
      </div>

      <div v-else-if="currentClient.type === 'json'" class="mcp-config-panel">
        <div class="mcp-config-json">
          <pre class="mcp-json-code"><code>{{ formattedJson }}</code></pre>
          <button class="mcp-copy-btn mcp-copy-json" @click="copyCmd">
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
      </div>

      <div v-else-if="currentClient.type === 'ui'" class="mcp-config-panel">
        <div class="mcp-config-steps">
          <div class="mcp-steps-nav">
            <template v-for="(step, idx) in currentClient.steps" :key="idx">
              <span class="mcp-step">{{ step }}</span>
              <svg
                v-if="idx < currentClient.steps.length - 1"
                class="mcp-step-arrow"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </template>
          </div>
          <div v-if="currentClient.fields" class="mcp-fields">
            <div v-for="(value, key) in currentClient.fields" :key="key" class="mcp-field">
              <span class="mcp-field-key">{{ key }}</span>
              <span class="mcp-field-value">{{ value }}</span>
            </div>
          </div>
        </div>
      </div>

      <p class="mcp-config-note">OAuth 2.1 — browser opens automatically on first use. No API key needed.</p>
    </div>

    <div class="mcp-cta-wrap">
      <a href="/docs/mcp" class="mcp-cta">
        {{ $t('product.mcp.cta') }}
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
.mcp-section {
  padding: 4rem 1rem;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

.mcp-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 0 1.5rem;
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  width: 100%;
}
.mcp-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.02em;
}
.mcp-subtitle {
  margin-top: 24px;
  color: var(--vp-c-text-2);
  font-weight: 600;
  line-height: 1.4;
}
.mcp-desc {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--vp-c-text-3);
}

/* Diagram */
.mcp-diagram-wrap {
  width: 100%;
  max-width: 64rem;
  margin: 0 auto 2rem;
  padding: 0 1.5rem;
  box-sizing: border-box;
}
.mcp-diagram-svg {
  width: 100%;
  height: auto;
  display: block;
  overflow: visible;
}

/* Edges — dash style, muted by default */
.mcp-edge {
  stroke: var(--vp-c-text-3);
  stroke-width: 1.5;
  stroke-dasharray: 5 3;
  fill: none;
  stroke-opacity: 0.5;
  transition: stroke 0.2s, stroke-opacity 0.2s;
}
.mcp-edge-hi {
  stroke: var(--brand-color);
  stroke-opacity: 0.6;
  animation: mcp-dash 0.8s linear infinite;
}
.mcp-edge-down {
  stroke: var(--brand-color);
  stroke-opacity: 0.35;
  stroke-dasharray: 5 3;
}
@keyframes mcp-dash {
  to {
    stroke-dashoffset: -8;
  }
}

/* Base node */
.mcp-n {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 0.5rem;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  font-family: var(--vp-font-family-base);
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  user-select: none;
}

/* Client logo in SVG node */
.mcp-client-logo {
  width: 13px;
  height: 13px;
  object-fit: contain;
  flex-shrink: 0;
  border-radius: 2px;
}
:root.dark .mcp-client-logo {
  filter: brightness(0) invert(1);
}

/* Client nodes */
.mcp-n-client {
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  font-size: 0.68rem;
}
.mcp-n-client:hover:not(.more) {
  border-color: var(--brand-color);
}
.mcp-n-client.active {
  border-color: var(--brand-color);
  background: color-mix(in srgb, var(--brand-color) 6%, var(--vp-c-bg));
  color: var(--brand-color);
}
.mcp-n-client.more {
  border-style: dashed;
  opacity: 0.55;
  cursor: default;
  color: var(--vp-c-text-3);
  font-weight: 500;
}

/* Hub node */
.mcp-n-hub {
  border: 1.5px solid var(--brand-color);
  background: color-mix(in srgb, var(--brand-color) 6%, var(--vp-c-bg));
  color: var(--brand-color);
  cursor: default;
}

/* Tool nodes */
.mcp-n-tool {
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  cursor: default;
  white-space: normal;
}
.mcp-n-tool-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.3;
}
.mcp-n-tool-desc {
  font-size: 0.65rem;
  color: var(--vp-c-text-3);
  line-height: 1.4;
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Config panel */
.mcp-config {
  max-width: 64rem;
  margin: 0 auto;
  padding: 0 1.5rem;
}
.mcp-config-tabs {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
  overflow-x: auto;
}
.mcp-config-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.625rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.mcp-tab-logo {
  width: 1rem;
  height: 1rem;
  object-fit: contain;
  flex-shrink: 0;
  border-radius: 2px;
}
:root.dark .mcp-tab-logo {
  filter: brightness(0) invert(1);
}
.mcp-config-tab:hover {
  color: var(--vp-c-text-2);
}
.mcp-config-tab.active {
  color: var(--brand-color);
  background: var(--vp-c-bg);
  border-color: var(--vp-c-divider);
}

.mcp-config-panel {
  border-radius: 0.5rem;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  overflow: hidden;
}
.mcp-config-cmd {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem 0.875rem;
}
.mcp-cmd-prompt {
  font-size: 0.75rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-3);
  user-select: none;
  line-height: 1.5;
}
.mcp-cmd-shell {
  font-size: 0.75rem;
  font-family: var(--vp-font-family-mono);
  color: var(--brand-color);
  line-height: 1.5;
  flex: 1;
  word-break: break-all;
}

.mcp-config-json {
  position: relative;
  padding: 0.75rem 0.875rem;
}
.mcp-json-code {
  margin: 0;
  padding: 0;
  font-size: 0.75rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
  line-height: 1.6;
  white-space: pre;
  overflow-x: auto;
}
.mcp-json-code code {
  font-family: inherit;
}
.mcp-copy-json {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

.mcp-config-steps {
  padding: 0.75rem 0.875rem;
}
.mcp-steps-nav {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;
  margin-bottom: 0.625rem;
}
.mcp-step {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background: color-mix(in srgb, var(--vp-c-text-3) 8%, transparent);
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}
.mcp-step-arrow {
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}
.mcp-fields {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.mcp-field {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-size: 0.75rem;
}
.mcp-field-key {
  font-weight: 600;
  color: var(--vp-c-text-3);
  min-width: 3rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.7rem;
}
.mcp-field-value {
  font-family: var(--vp-font-family-mono);
  font-size: 0.7rem;
  color: var(--brand-color);
  word-break: break-all;
}

.mcp-copy-btn {
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
.mcp-copy-btn:hover {
  color: var(--brand-color);
  background: color-mix(in srgb, var(--brand-color) 8%, transparent);
}
.mcp-copy-btn:active {
  transform: scale(0.8);
}

.mcp-config-note {
  margin-top: 0.5rem;
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  text-align: center;
}

.mcp-cta-wrap {
  text-align: center;
  margin-top: 1.5rem;
}
.mcp-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--brand-color);
  text-decoration: none !important;
  transition: gap 0.2s;
}
.mcp-cta:hover {
  gap: 0.625rem;
}

@media (max-width: 768px) {
  .mcp-section {
    padding: 3rem 0.75rem;
  }
  .mcp-diagram-wrap {
    padding: 0 0.5rem;
  }
  .mcp-header {
    padding: 0 0.5rem;
  }
  .mcp-config {
    padding: 0 0.5rem;
  }
  .mcp-title {
    font-size: 1.5rem;
  }
  .mcp-subtitle {
    font-size: 0.82rem;
  }
  .mcp-desc {
    font-size: 0.78rem;
  }
}

@media (max-width: 480px) {
  .mcp-title {
    font-size: 1.25rem;
  }
  .mcp-subtitle {
    font-size: 0.75rem;
  }
  .mcp-desc {
    font-size: 0.72rem;
  }
}
</style>
