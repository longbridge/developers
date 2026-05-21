<script setup lang="ts">
import { visible, width } from '../composables/useProgressBar'
</script>

<template>
  <Transition name="progress-fade">
    <div v-if="visible" class="progress-bar-wrap" aria-hidden="true">
      <div class="progress-bar" :style="{ width: width + '%' }" />
    </div>
  </Transition>
</template>

<style scoped>
.progress-bar-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 9999;
  pointer-events: none;
}

.progress-bar {
  height: 100%;
  background: var(--vp-c-brand-1);
  transition: width 0.12s linear;
  border-radius: 0 2px 2px 0;
}

@media (prefers-reduced-motion: reduce) {
  .progress-bar {
    transition: none;
  }

  .progress-fade-leave-active {
    transition: none;
  }
}

.progress-fade-leave-active {
  transition: opacity 0.3s ease;
}

.progress-fade-leave-to {
  opacity: 0;
}
</style>
