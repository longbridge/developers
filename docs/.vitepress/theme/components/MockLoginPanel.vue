<script setup lang="ts">
import { isLoginState, toggleMockLogin } from '../composables/useLoginState'
</script>

<template>
  <div class="mock-login-panel">
    <button class="mock-btn" @click="toggleMockLogin">
      {{ isLoginState ? '🔓 Mock Logout' : '🔐 Mock Login' }}
    </button>
  </div>
</template>

<style scoped>
.mock-login-panel {
  position: fixed;
  bottom: 16px;
  left: 16px;
  z-index: 9999;
}

.mock-btn {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 6px;
  border: 1px dashed var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.mock-btn:hover {
  opacity: 1;
}
</style>
