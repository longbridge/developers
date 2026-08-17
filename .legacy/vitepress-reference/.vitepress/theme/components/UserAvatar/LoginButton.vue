<template>
  <div class="VPFlyout">
    <a
      target="_self"
      :href="redirectPath"
      class="login-button px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200">
      {{ t('login_now') }}
    </a>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { createLoginRedirectPath } from '../../utils/navigate'

const { t } = useI18n()

const redirectPath = computed(() => {
  return createLoginRedirectPath()
})
</script>

<style scoped>
.VPFlyout {
  display: flex;
  align-items: center;
  position: relative;
  margin-right: -8px;
}

@media (min-width: 768px) {
  .VPFlyout::before {
    margin: 0 16px;
    width: 1px;
    height: 24px;
    background-color: var(--vp-c-divider);
    content: '';
  }
}

.VPFlyout:hover {
  color: var(--vp-c-brand-2);
  transition: color 0.25s;
}

.login-button {
  background-color: var(--vp-c-brand-2);
  color: var(--vp-c-white);
  border: 1px solid transparent;
  text-decoration: none;
}

.login-button:hover {
  background-color: var(--vp-c-brand-1);
  color: var(--vp-c-white);
}

.dark .login-button {
  background-color: var(--brand-60);
  color: var(--vp-c-white);
}

.dark .login-button:hover {
  background-color: var(--brand-70);
  color: var(--vp-c-white);
}
</style>
