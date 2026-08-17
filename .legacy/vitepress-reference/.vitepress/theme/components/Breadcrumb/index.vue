<template>
  <div v-if="!isCN && breadcrumbItems.length > 1" class="breadcrumb-container">
    <nav class="breadcrumb" aria-label="面包屑导航">
      <ol class="breadcrumb-list">
        <li
          v-for="(item, index) in breadcrumbItems"
          :key="index"
          class="breadcrumb-item"
          :class="{ 'is-current': index === breadcrumbItems.length - 1 }">
          <a v-if="item.link && index !== breadcrumbItems.length - 1" :href="item.link" class="breadcrumb-link">
            {{ item.text }}
          </a>
          <span v-else class="breadcrumb-text">
            {{ item.text }}
          </span>
          <span v-if="index < breadcrumbItems.length - 1" class="breadcrumb-separator" aria-hidden="true"> / </span>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useBreadcrumb } from '../../composables/useBreadcrumb'
import { siteHostname } from '../../utils/region'

const isCN = siteHostname.includes('longbridge.cn')
const { breadcrumbItems } = useBreadcrumb()
</script>

<style scoped>
.breadcrumb-container {
  @apply mb-4 pb-2;
}

.breadcrumb {
  @apply text-sm;
}

.breadcrumb-list {
  @apply flex flex-wrap items-center gap-1 m-0 p-0 list-none;
}

.breadcrumb-item {
  @apply flex items-center;
}

.breadcrumb-link {
  @apply text-[var(--vp-c-text-2)] hover:text-[var(--vp-c-text-1)] transition-colors duration-200 no-underline;
}

.breadcrumb-text {
  @apply text-[var(--vp-c-text-1)] font-medium;
}

.breadcrumb-separator {
  @apply mx-2 text-[var(--vp-c-text-3)] select-none;
}

.breadcrumb-item.is-current .breadcrumb-text {
  @apply text-[var(--vp-c-text-1)] font-medium;
}
</style>
