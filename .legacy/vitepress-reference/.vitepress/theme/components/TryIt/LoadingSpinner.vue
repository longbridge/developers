<template>
  <div
    class="w-full flex justify-center items-center min-h-[250px] rounded-xl p-4"
    style="background-color: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-border)">
    <div class="flex items-center justify-center py-12">
      <div class="flex flex-col items-center space-y-4">
        <!-- Bouncing dots -->
        <div class="flex space-x-2">
          <div class="w-2 h-2 rounded-full loading-dot" style="background-color: var(--vp-c-brand-1)"></div>
          <div class="w-2 h-2 rounded-full loading-dot" style="background-color: var(--vp-c-brand-1)"></div>
          <div class="w-2 h-2 rounded-full loading-dot" style="background-color: var(--vp-c-brand-1)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 无需任何 props 或逻辑，纯展示组件
</script>

<style scoped>
/* 改进的加载动画效果 */
@keyframes bounce-dots {
  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}

.loading-dot {
  animation: bounce-dots 1.5s ease-in-out infinite;
}

.loading-dot:nth-child(1) {
  animation-delay: 0s;
}

.loading-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dot:nth-child(3) {
  animation-delay: 0.4s;
}

/* 双层旋转效果 */
.spinner-outer {
  animation: spin 2s linear infinite;
}

.spinner-inner {
  animation: spin 1.5s linear infinite reverse;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
