<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import toolsData from '../../data/mcp-tools.json'

interface SchemaProperty {
  type: string | string[]
  description?: string
  enum?: string[]
  default?: unknown
  format?: string
  minimum?: number
  maximum?: number
}

interface ToolSchema {
  properties?: Record<string, SchemaProperty>
  required?: string[]
}

interface Tool {
  name: string
  description: string
  inputSchema?: ToolSchema
}

interface ToolsPayload {
  tools: Tool[]
}

const { t } = useI18n()

const allTools: Tool[] = (toolsData as ToolsPayload).tools

// Auth + endpoint
const bearerToken = ref(
  typeof localStorage !== 'undefined' ? (localStorage.getItem('mcp-inspector-token') ?? '') : ''
)
const useCN = ref(false)

watch(bearerToken, (v) => {
  if (typeof localStorage !== 'undefined') localStorage.setItem('mcp-inspector-token', v)
})

const mcpEndpoint = computed(() => {
  if (import.meta.env.DEV) return '/api/mcp'
  return useCN.value
    ? 'https://openapi.longbridge.cn/mcp'
    : 'https://openapi.longbridge.com/mcp'
})

// Tool list
const query = ref('')
const selectedTool = ref<Tool | null>(null)

const filtered = computed<Tool[]>(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return allTools
  return allTools.filter(
    (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
  )
})

function selectTool(tool: Tool) {
  if (selectedTool.value?.name === tool.name) return
  selectedTool.value = tool
  formValues.value = {}
  result.value = ''
  invokeError.value = ''
}

// Form
interface ParamField {
  name: string
  type: string
  required: boolean
  description?: string
  enum?: string[]
  default?: unknown
}

const formValues = ref<Record<string, string>>({})

const params = computed<ParamField[]>(() => {
  const schema = selectedTool.value?.inputSchema
  if (!schema?.properties) return []
  const required = new Set(schema.required ?? [])
  return Object.entries(schema.properties).map(([name, def]) => ({
    name,
    type: Array.isArray(def.type) ? def.type.join(' | ') : def.type,
    required: required.has(name),
    description: def.description,
    enum: def.enum,
    default: def.default,
  }))
})

function fieldType(p: ParamField): string {
  if (p.type === 'integer' || p.type === 'number') return 'number'
  return 'text'
}

// Invoke
const loading = ref(false)
const result = ref('')
const invokeError = ref('')
const copied = ref(false)

async function invoke() {
  if (!selectedTool.value || !bearerToken.value) return
  loading.value = true
  result.value = ''
  invokeError.value = ''

  try {
    const args: Record<string, unknown> = {}
    for (const p of params.value) {
      const raw = formValues.value[p.name] ?? ''
      if (raw === '') continue
      if (p.type === 'integer') args[p.name] = parseInt(raw, 10)
      else if (p.type === 'number') args[p.name] = parseFloat(raw)
      else if (p.type === 'boolean') args[p.name] = raw === 'true'
      else args[p.name] = raw
    }

    const resp = await fetch(mcpEndpoint.value, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken.value}`,
        Accept: 'application/json, text/event-stream',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: { name: selectedTool.value.name, arguments: args },
      }),
    })

    const text = await resp.text()
    try {
      result.value = JSON.stringify(JSON.parse(text), null, 2)
    } catch {
      result.value = text
    }
  } catch (e) {
    invokeError.value = String(e)
  } finally {
    loading.value = false
  }
}

async function copyResult() {
  if (!result.value) return
  await navigator.clipboard.writeText(result.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <div class="mcp-inspector">
    <!-- Header -->
    <div class="mcp-inspector-header">
      <div class="mcp-inspector-token-row">
        <label class="mcp-inspector-label" for="mcp-token">{{ t('mcpInspector.tokenLabel') }}</label>
        <input
          id="mcp-token"
          v-model="bearerToken"
          type="password"
          class="mcp-inspector-token-input"
          :placeholder="t('mcpInspector.tokenPlaceholder')"
          autocomplete="off"
        />
        <span class="mcp-inspector-token-help">{{ t('mcpInspector.tokenHelp') }}</span>
      </div>
      <div class="mcp-inspector-endpoint-row">
        <label class="mcp-inspector-label">{{ t('mcpInspector.endpoint') }}</label>
        <div class="mcp-inspector-endpoint-tabs">
          <button
            class="mcp-inspector-endpoint-btn"
            :class="{ active: !useCN }"
            type="button"
            @click="useCN = false"
          >{{ t('mcpInspector.endpointGlobal') }}</button>
          <button
            class="mcp-inspector-endpoint-btn"
            :class="{ active: useCN }"
            type="button"
            @click="useCN = true"
          >{{ t('mcpInspector.endpointCN') }}</button>
        </div>
        <code class="mcp-inspector-endpoint-url">{{ mcpEndpoint }}</code>
      </div>
    </div>

    <!-- Body -->
    <div class="mcp-inspector-body">
      <!-- Left: tool list -->
      <div class="mcp-inspector-list-panel">
        <div class="mcp-inspector-search-wrap">
          <svg
            class="mcp-inspector-search-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            v-model="query"
            type="text"
            class="mcp-inspector-search"
            :placeholder="t('mcp.searchPlaceholder')"
          />
        </div>

        <div class="mcp-inspector-tool-list">
          <button
            v-for="tool in filtered"
            :key="tool.name"
            type="button"
            class="mcp-inspector-tool-item"
            :class="{ active: selectedTool?.name === tool.name }"
            @click="selectTool(tool)"
          >
            <svg
              class="mcp-inspector-tool-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            <code class="mcp-inspector-tool-name">{{ tool.name }}</code>
          </button>

          <p v-if="filtered.length === 0" class="mcp-inspector-empty">
            {{ t('mcp.noMatch', { query }) }}
          </p>
        </div>
      </div>

      <!-- Right: form + result -->
      <div class="mcp-inspector-form-panel">
        <div v-if="!selectedTool" class="mcp-inspector-placeholder">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
          <p>{{ t('mcpInspector.selectTool') }}</p>
        </div>

        <template v-else>
          <div class="mcp-inspector-tool-header">
            <code class="mcp-inspector-selected-name">{{ selectedTool.name }}</code>
            <p class="mcp-inspector-selected-desc">{{ selectedTool.description }}</p>
          </div>

          <!-- No-token warning -->
          <div v-if="!bearerToken" class="mcp-inspector-warning">
            {{ t('mcpInspector.noTokenWarning') }}
          </div>

          <!-- Params -->
          <div class="mcp-inspector-params">
            <div
              v-for="p in params"
              :key="p.name"
              class="mcp-inspector-param"
            >
              <label :for="`param-${p.name}`" class="mcp-inspector-param-label">
                <code>{{ p.name }}</code>
                <span class="mcp-inspector-param-type">{{ p.type }}</span>
                <span v-if="!p.required" class="mcp-inspector-param-opt">{{ t('mcpInspector.optional') }}</span>
                <span v-else class="mcp-inspector-param-req">*</span>
              </label>
              <p v-if="p.description" class="mcp-inspector-param-desc">{{ p.description }}</p>

              <!-- enum → select -->
              <select
                v-if="p.enum"
                :id="`param-${p.name}`"
                v-model="formValues[p.name]"
                class="mcp-inspector-input"
              >
                <option value="">—</option>
                <option v-for="e in p.enum" :key="e" :value="e">{{ e }}</option>
              </select>

              <!-- boolean → select -->
              <select
                v-else-if="p.type === 'boolean'"
                :id="`param-${p.name}`"
                v-model="formValues[p.name]"
                class="mcp-inspector-input"
              >
                <option value="">—</option>
                <option value="true">true</option>
                <option value="false">false</option>
              </select>

              <!-- number/integer → number input -->
              <input
                v-else-if="p.type === 'integer' || p.type === 'number'"
                :id="`param-${p.name}`"
                v-model="formValues[p.name]"
                type="number"
                class="mcp-inspector-input"
                :placeholder="p.default !== undefined ? String(p.default) : ''"
              />

              <!-- default → text -->
              <input
                v-else
                :id="`param-${p.name}`"
                v-model="formValues[p.name]"
                type="text"
                class="mcp-inspector-input"
                :placeholder="p.default !== undefined ? String(p.default) : ''"
              />
            </div>

            <p v-if="params.length === 0" class="mcp-inspector-no-params">
              {{ t('mcp.noParams') }}
            </p>
          </div>

          <!-- Invoke button -->
          <button
            type="button"
            class="mcp-inspector-invoke-btn"
            :disabled="loading || !bearerToken"
            @click="invoke"
          >
            <span v-if="loading" class="mcp-inspector-spinner" aria-hidden="true" />
            {{ loading ? t('mcpInspector.invoking') : t('mcpInspector.invoke') }}
          </button>

          <!-- Error -->
          <div v-if="invokeError" class="mcp-inspector-error">
            {{ invokeError }}
          </div>

          <!-- Result -->
          <div v-if="result" class="mcp-inspector-result">
            <div class="mcp-inspector-result-header">
              <span>{{ t('mcpInspector.result') }}</span>
              <button
                type="button"
                class="mcp-inspector-copy-btn"
                @click="copyResult"
              >
                {{ copied ? t('mcpInspector.copied') : t('mcpInspector.copy') }}
              </button>
            </div>
            <pre class="mcp-inspector-result-body"><code>{{ result }}</code></pre>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mcp-inspector {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 0;
  min-height: calc(100vh - var(--vp-nav-height, 64px) - 4rem);
}

/* Header */
.mcp-inspector-header {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.mcp-inspector-token-row,
.mcp-inspector-endpoint-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.mcp-inspector-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  min-width: 6rem;
}

.mcp-inspector-token-input {
  flex: 1;
  min-width: 0;
  max-width: 420px;
  padding: 0.4rem 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.85rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
  outline: none;
}

.mcp-inspector-token-input:focus {
  border-color: var(--vp-c-brand-1);
}

.mcp-inspector-token-help {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.mcp-inspector-endpoint-tabs {
  display: flex;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  overflow: hidden;
}

.mcp-inspector-endpoint-btn {
  padding: 0.3rem 0.75rem;
  font-size: 0.8rem;
  border: 0;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.mcp-inspector-endpoint-btn:not(:last-child) {
  border-right: 1px solid var(--vp-c-divider);
}

.mcp-inspector-endpoint-btn.active {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.mcp-inspector-endpoint-url {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
}

/* Body */
.mcp-inspector-body {
  display: flex;
  gap: 1rem;
  flex: 1;
  min-height: 520px;
}

/* Left panel */
.mcp-inspector-list-panel {
  width: 38%;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.mcp-inspector-search-wrap {
  position: relative;
  padding: 0.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.mcp-inspector-search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--vp-c-text-3);
  pointer-events: none;
}

.mcp-inspector-search {
  width: 100%;
  padding: 0.4rem 0.75rem 0.4rem 2rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.85rem;
  outline: none;
}

.mcp-inspector-search:focus {
  border-color: var(--vp-c-brand-1);
}

.mcp-inspector-tool-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.25rem;
}

.mcp-inspector-tool-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.45rem 0.6rem;
  border: 0;
  border-radius: 5px;
  background: transparent;
  text-align: left;
  cursor: pointer;
  color: var(--vp-c-text-1);
  transition: background 0.12s;
}

.mcp-inspector-tool-item:hover {
  background: var(--vp-c-default-soft);
}

.mcp-inspector-tool-item.active {
  background: var(--vp-c-brand-soft);
}

.mcp-inspector-tool-item.active .mcp-inspector-tool-icon {
  color: var(--vp-c-brand-1);
}

.mcp-inspector-tool-icon {
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}

.mcp-inspector-tool-name {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
  font-size: 0.82rem;
  background: transparent;
  padding: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mcp-inspector-empty {
  padding: 1rem;
  text-align: center;
  color: var(--vp-c-text-3);
  font-size: 0.85rem;
}

/* Right panel */
.mcp-inspector-form-panel {
  flex: 1;
  min-width: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.25rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mcp-inspector-placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: var(--vp-c-text-3);
  font-size: 0.9rem;
}

.mcp-inspector-tool-header {
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 0.75rem;
}

.mcp-inspector-selected-name {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
  font-size: 1rem;
  color: var(--vp-c-text-1);
  background: transparent;
  padding: 0;
}

.mcp-inspector-selected-desc {
  margin: 0.35rem 0 0;
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
}

.mcp-inspector-warning {
  padding: 0.6rem 0.9rem;
  border-radius: 6px;
  background: var(--vp-c-warning-soft);
  color: var(--vp-c-warning-1);
  font-size: 0.82rem;
}

/* Params */
.mcp-inspector-params {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.mcp-inspector-param {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.mcp-inspector-param-label {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  font-size: 0.82rem;
}

.mcp-inspector-param-label code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
  font-size: 0.82rem;
  background: var(--vp-c-bg-soft);
  padding: 0.05rem 0.35rem;
  border-radius: 4px;
  color: var(--vp-c-text-1);
}

.mcp-inspector-param-type {
  color: var(--vp-c-text-3);
  font-size: 0.75rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
}

.mcp-inspector-param-req {
  color: var(--vp-c-danger-1);
  font-size: 0.8rem;
}

.mcp-inspector-param-opt {
  color: var(--vp-c-text-3);
  font-size: 0.75rem;
}

.mcp-inspector-param-desc {
  margin: 0;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.mcp-inspector-input {
  padding: 0.45rem 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.85rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
  outline: none;
  width: 100%;
  max-width: 480px;
}

.mcp-inspector-input:focus {
  border-color: var(--vp-c-brand-1);
}

.mcp-inspector-no-params {
  margin: 0;
  color: var(--vp-c-text-3);
  font-style: italic;
  font-size: 0.85rem;
}

/* Invoke button */
.mcp-inspector-invoke-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1.25rem;
  border: 0;
  border-radius: 6px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;
  align-self: flex-start;
}

.mcp-inspector-invoke-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.mcp-inspector-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error */
.mcp-inspector-error {
  padding: 0.6rem 0.9rem;
  border-radius: 6px;
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-danger-1);
  font-size: 0.82rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
  word-break: break-all;
}

/* Result */
.mcp-inspector-result {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.mcp-inspector-result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.45rem 0.75rem;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.mcp-inspector-copy-btn {
  padding: 0.2rem 0.6rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.75rem;
  cursor: pointer;
  transition: background 0.12s;
}

.mcp-inspector-copy-btn:hover {
  background: var(--vp-c-default-soft);
}

.mcp-inspector-result-body {
  margin: 0;
  padding: 0.75rem;
  font-size: 0.8rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
  color: var(--vp-c-text-1);
  overflow-x: auto;
  max-height: 400px;
  overflow-y: auto;
  background: var(--vp-c-bg);
  white-space: pre;
}

.mcp-inspector-result-body code {
  background: transparent;
  padding: 0;
  font-size: inherit;
  color: inherit;
}

/* Responsive */
@media (max-width: 768px) {
  .mcp-inspector-body {
    flex-direction: column;
    min-height: unset;
  }

  .mcp-inspector-list-panel {
    width: 100%;
    max-height: 260px;
  }
}
</style>
