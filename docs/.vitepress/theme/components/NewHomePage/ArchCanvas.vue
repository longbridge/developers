<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <div class="ab">
    <div class="ab-flow">
      <!-- Col 1: User & Tools -->
      <div class="ab-group">
        <div class="ab-group-label">{{ $t('arch.user') }}</div>
        <div class="ab-group-box">
          <div class="ab-app">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              width="15"
              height="15"
              stroke-linecap="round"
              stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8m-4-4v4" />
            </svg>
            <span>{{ $t('arch.yourApp') }}</span>
          </div>
          <div class="ab-via">{{ $t('arch.accessVia') }}</div>
          <div class="ab-tools">
            <a href="/skill" class="ab-tool">
              <span class="ab-tool-name">{{ $t('arch.skill.label') }}</span>
              <span class="ab-tool-desc">{{ $t('arch.skill.desc') }}</span>
            </a>
            <a href="/docs/cli" class="ab-tool">
              <span class="ab-tool-name">{{ $t('arch.cli.label') }}</span>
              <span class="ab-tool-desc">65+ commands, TUI dashboard, JSON output</span>
            </a>
            <a href="/docs/mcp" class="ab-tool">
              <span class="ab-tool-name">{{ $t('arch.mcp.label') }}</span>
              <span class="ab-tool-desc">{{ $t('arch.mcp.desc') }}</span>
            </a>
            <a href="/sdk" class="ab-tool">
              <span class="ab-tool-name">{{ $t('arch.sdk.label') }}</span>
              <span class="ab-tool-desc">{{ $t('arch.sdk.desc') }}</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Arrow: User → Platform -->
      <div class="ab-arrow">
        <span class="ab-arrow-label">{{ $t('arch.proto.in') }}</span>
        <div class="ab-arrow-line">
          <div class="ab-arrow-shaft" />
          <div class="ab-arrow-head" />
        </div>
        <svg
          class="ab-arrow-dir"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          width="12"
          height="12">
          <path d="M5 12h14m-4-4 4 4-4 4" />
        </svg>
      </div>

      <!-- Col 2: Longbridge Platform -->
      <div class="ab-group ab-group-brand">
        <div class="ab-group-label ab-label-brand">{{ $t('arch.platform') }}</div>
        <div class="ab-group-box ab-box-brand">
          <div class="ab-gw">
            <span class="ab-gw-title">{{ $t('arch.gateway') }}</span>
          </div>
        </div>
      </div>

      <!-- Arrow: Platform → Services -->
      <div class="ab-arrow">
        <span class="ab-arrow-label">{{ $t('arch.proto.out') }}</span>
        <div class="ab-arrow-line">
          <div class="ab-arrow-shaft" />
          <div class="ab-arrow-head" />
        </div>
        <svg
          class="ab-arrow-dir"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          width="12"
          height="12">
          <path d="M5 12h14m-4-4 4 4-4 4" />
        </svg>
      </div>

      <!-- Col 3: Services -->
      <div class="ab-group">
        <div class="ab-group-label">{{ $t('arch.services') }}</div>
        <div class="ab-group-box ab-box-svc">
          <a href="/docs/quote/overview" class="ab-svc">
            <span class="ab-svc-name">{{ $t('arch.quote') }}</span>
            <span class="ab-svc-count">30+</span>
          </a>
          <a href="/docs/cli/fundamentals/company" class="ab-svc">
            <span class="ab-svc-name">{{ $t('arch.fundamentals') }}</span>
            <span class="ab-svc-count">13+</span>
          </a>
          <a href="/docs/trade/overview" class="ab-svc">
            <span class="ab-svc-name">{{ $t('arch.trade') }}</span>
            <span class="ab-svc-count">14+</span>
          </a>
          <a href="/docs/content/news" class="ab-svc">
            <span class="ab-svc-name">{{ $t('arch.content') }}</span>
            <span class="ab-svc-count">8+</span>
          </a>
          <div class="ab-svc ab-svc-more">
            <span class="ab-svc-name">{{ $t('arch.more') }}</span>
            <span class="ab-svc-dots">···</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ab {
  max-width: 64rem;
  margin: 0 auto;
}

@media (max-width: 900px) {
  .ab {
    padding: 2rem 1.5rem;
  }
}

.ab-flow {
  display: flex;
  align-items: stretch;
  gap: 0;
  font-size: 14px;
}

/* Groups */
.ab-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
}
.ab-group-brand {
  flex: 0 0 auto;
  min-width: 10rem;
}

.ab-group-label {
  font-weight: 700;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.ab-label-brand {
  color: var(--brand-color);
}

.ab-group-box {
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 0.625rem;
  padding: 0.875rem;
  background: var(--vp-c-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}
.ab-box-brand {
  border-color: color-mix(in srgb, var(--brand-color) 30%, var(--vp-c-divider));
  background: color-mix(in srgb, var(--brand-color) 2%, var(--vp-c-bg));
  justify-content: center;
  align-items: center;
}

/* App entry */
.ab-app {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  background: var(--vp-c-bg-soft);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}
.ab-app svg {
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}

.ab-via {
  font-weight: 600;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* Tool cards with descriptions */
.ab-tools {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.375rem;
}

.ab-tool {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.4rem 0.625rem;
  border-radius: 0.375rem;
  background: var(--vp-c-bg-soft);
  text-decoration: none !important;
  transition: background 0.15s;
}
.ab-tool:hover {
  background: color-mix(in srgb, var(--brand-color) 8%, transparent);
}

.ab-tool-name {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}
.ab-tool-desc {
  font-size: 0.58rem;
  color: var(--vp-c-text-3);
  line-height: 1.4;
}
.ab-tool-code {
  font-size: 0.55rem;
  color: var(--brand-color);
  font-family: var(--vp-font-family-mono);
  background: color-mix(in srgb, var(--brand-color) 5%, transparent);
  padding: 0.1rem 0.25rem;
  border-radius: 0.125rem;
  width: fit-content;
}

/* Gateway */
.ab-gw {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
}
.ab-gw-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--brand-color);
  white-space: nowrap;
}

/* Services box — vertically centered */
.ab-box-svc {
  justify-content: center;
}

/* Services */
.ab-svc {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  background: var(--vp-c-bg-soft);
  text-decoration: none !important;
  transition: background 0.15s;
  min-width: 9rem;
}
.ab-svc:hover {
  background: color-mix(in srgb, var(--brand-color) 8%, transparent);
}
.ab-svc-name {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}
.ab-svc-count {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--brand-color);
  font-family: var(--vp-font-family-mono);
}

.ab-svc-more {
  border: 1.5px dashed var(--vp-c-divider);
  background: transparent;
  cursor: default;
  opacity: 0.55;
}
.ab-svc-more:hover {
  background: transparent;
}
.ab-svc-more .ab-svc-name {
  color: var(--vp-c-text-3);
  font-weight: 500;
}
.ab-svc-dots {
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
  letter-spacing: 0.1em;
  font-family: var(--vp-font-family-mono);
}

/* Arrows */
.ab-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0 0.375rem;
  flex-shrink: 0;
  min-width: 4.5rem;
  align-self: center;
}
.ab-arrow-label {
  font-size: 0.55rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  white-space: nowrap;
}
.ab-arrow-line {
  display: flex;
  align-items: center;
  width: 100%;
}
.ab-arrow-shaft {
  flex: 1;
  height: 1.5px;
  background: repeating-linear-gradient(
    90deg,
    var(--brand-color) 0px,
    var(--brand-color) 5px,
    transparent 5px,
    transparent 8px
  );
  animation: ab-dash 0.6s linear infinite;
}
@keyframes ab-dash {
  to {
    background-position: -8px 0;
  }
}
.ab-arrow-head {
  width: 0;
  height: 0;
  border-left: 6px solid var(--brand-color);
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  flex-shrink: 0;
}
.ab-arrow-dir {
  color: var(--vp-c-text-3);
  opacity: 0.4;
}

/* Responsive: vertical stack */
@media (max-width: 900px) {
  .ab-flow {
    flex-direction: column;
    gap: 0;
  }
  .ab-arrow {
    flex-direction: row;
    padding: 0.75rem 0;
    min-width: auto;
    align-self: center;
    gap: 0.5rem;
  }
  .ab-arrow-line {
    width: 0;
    height: 2.5rem;
    flex-direction: column;
  }
  .ab-arrow-shaft {
    width: 1.5px;
    height: 100%;
    flex: 1;
    background: repeating-linear-gradient(
      180deg,
      var(--brand-color) 0px,
      var(--brand-color) 5px,
      transparent 5px,
      transparent 8px
    );
    animation: ab-dash-v 0.6s linear infinite;
  }
  .ab-arrow-head {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 6px solid var(--brand-color);
    border-bottom: none;
  }
  .ab-arrow-dir {
    transform: rotate(90deg);
  }
  .ab-tools {
    grid-template-columns: repeat(2, 1fr);
  }
}

@keyframes ab-dash-v {
  to {
    background-position: 0 -8px;
  }
}

@media (max-width: 480px) {
  .ab-tools {
    flex-direction: column;
  }
  .ab-tool {
    min-width: auto;
  }
}
</style>
