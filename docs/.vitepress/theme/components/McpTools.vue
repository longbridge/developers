<script setup lang="ts">
import { ref, computed } from 'vue'
import toolsData from '../../data/mcp-tools.json'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './ui/accordion'

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

interface ParamRow {
  name: string
  type: string
  required: boolean
  description?: string
  enum?: string[]
  default?: unknown
  format?: string
}

const allTools: Tool[] = (toolsData as ToolsPayload).tools

const query = ref('')

const filtered = computed<Tool[]>(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return allTools
  return allTools.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
  )
})

function formatType(type: string | string[]): string {
  return Array.isArray(type) ? type.join(' | ') : type
}

function getParams(schema?: ToolSchema): ParamRow[] {
  if (!schema?.properties) return []
  const required = new Set(schema.required ?? [])
  return Object.entries(schema.properties).map(([name, def]) => ({
    name,
    type: formatType(def.type),
    required: required.has(name),
    description: def.description,
    enum: def.enum,
    default: def.default,
    format: def.format,
  }))
}
</script>

<template>
  <div class="mcp-tools">
    <div class="mcp-tools-search">
      <input
        v-model="query"
        type="text"
        class="mcp-tools-input"
        placeholder="Search tools by name or description..."
      />
      <span class="mcp-tools-count">{{ filtered.length }} of {{ allTools.length }}</span>
    </div>

    <div v-if="filtered.length === 0" class="mcp-tools-empty">
      No tools match "{{ query }}"
    </div>

    <Accordion v-else type="single" collapsible class="mcp-tools-list">
      <AccordionItem
        v-for="tool in filtered"
        :key="tool.name"
        :value="tool.name"
      >
        <AccordionTrigger>
          <code class="mcp-tool-name">{{ tool.name }}</code>
        </AccordionTrigger>
        <AccordionContent>
          <p class="mcp-tool-desc">{{ tool.description }}</p>

          <p v-if="getParams(tool.inputSchema).length === 0" class="mcp-tool-no-params">
            No parameters
          </p>

          <template v-else>
            <h4 class="mcp-params-title">Parameters</h4>
            <dl class="mcp-params">
              <div
                v-for="p in getParams(tool.inputSchema)"
                :key="p.name"
                class="mcp-param"
              >
                <dt class="mcp-param-head">
                  <code class="mcp-param-name">{{ p.name }}</code>
                  <span class="mcp-param-type">{{ p.type }}</span>
                  <span v-if="p.required" class="mcp-param-required">Required</span>
                </dt>
                <dd class="mcp-param-body">
                  <p v-if="p.description" class="mcp-param-desc">{{ p.description }}</p>
                  <p v-if="p.enum" class="mcp-param-meta">
                    Enum: {{ p.enum.map((e) => `"${e}"`).join(' | ') }}
                  </p>
                  <p v-if="p.default !== undefined" class="mcp-param-meta">
                    Default: {{ p.default }}
                  </p>
                  <p v-if="p.format" class="mcp-param-meta">
                    Format: {{ p.format }}
                  </p>
                </dd>
              </div>
            </dl>
          </template>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>

<style scoped>
.mcp-tools {
  margin: 1rem 0;
}

.mcp-tools-search {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  position: sticky;
  top: var(--vp-nav-height, 64px);
  z-index: 1;
  background: var(--vp-c-bg);
}
.mcp-tools-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  outline: none;
}
.mcp-tools-input:focus {
  border-color: var(--vp-c-brand-1);
}
.mcp-tools-count {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.mcp-tools-empty {
  padding: 1rem;
  text-align: center;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.mcp-tools-list {
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  max-height: 545px;
  overflow-y: auto;
  padding: 0 0.75rem;
}

.mcp-tools-list :deep(.mcp-accordion-item:last-child) {
  border-bottom: 0;
}

.mcp-tool-name {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
  background: transparent;
  padding: 0;
}

.mcp-tool-desc {
  margin: 0 0 0.75rem;
  color: var(--vp-c-text-2);
}

.mcp-tool-no-params {
  margin: 0;
  color: var(--vp-c-text-3);
  font-style: italic;
  font-size: 0.85rem;
}

.mcp-params-title {
  margin: 0 0 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.mcp-params {
  margin: 0;
  padding: 0;
}

.mcp-param {
  padding: 0.5rem 0;
  border-top: 1px dashed var(--vp-c-divider);
}
.mcp-param:first-child {
  border-top: 0;
  padding-top: 0;
}

.mcp-param-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem;
  margin: 0 0 0.25rem;
}

.mcp-param-name {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
  font-size: 0.85rem;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  padding: 0.05rem 0.35rem;
  border-radius: 4px;
}

.mcp-param-type {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
}

.mcp-param-required {
  font-size: 0.7rem;
  font-weight: 600;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.mcp-param-body {
  margin: 0;
  padding-left: 0;
}

.mcp-param-desc {
  margin: 0 0 0.25rem;
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
}

.mcp-param-meta {
  margin: 0;
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
}
</style>
