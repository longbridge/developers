<script setup lang="ts">
import UserAvatar from '../components/UserAvatar/index.vue'
import Breadcrumb from '../components/Breadcrumb/index.vue'
import Layout from './LayoutInner.vue'
import { useI18nSync, useHighlighter, useLLMMarkdownLink } from '../composables'

// 使用抽离的 hooks
useI18nSync()
useHighlighter()

const { llmMarkdownLink } = useLLMMarkdownLink()
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <UserAvatar />
    </template>
    <template #doc-top>
      <div class="-mt-4">
        <Breadcrumb />
      </div>
    </template>

    <template #doc-footer-before>
      <a v-if="llmMarkdownLink" :href="llmMarkdownLink" target="_blank" class="llms-text-link" title="LLMs Text">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>Markdown
      </a>
    </template>
  </Layout>
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

.VPSwitchAppearance {
  width: 22px !important;
}

.VPSwitchAppearance .check {
  transform: none !important;
}

.VPSidebar .VPSidebarItem.level-0 {
  @apply pb-2.5;
}

.VPSidebar .level-1.is-link {
  @apply -ml-2;
}
</style>
