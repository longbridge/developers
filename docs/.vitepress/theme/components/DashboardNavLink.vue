<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { localePath } from '../utils/i18n'
import { isLoginState } from '../composables/useLoginState'

const { t } = useI18n()
const isLogin = isLoginState

function navigate() {
  window.location.href = localePath('/account')
}
</script>

<template>
  <ClientOnly>
    <div v-if="isLogin" class="dashboard-wrap mr-2 ml-6">
      <a class="dashboard-nav-link" @click.prevent="navigate">{{ t('HD2WD-CgkkcJJW12yOmDM') }}</a>
    </div>
  </ClientOnly>
</template>

<style scoped>
.dashboard-wrap {
  display: flex;
  align-items: center;
}

.dashboard-nav-link {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.25s;
}

.dashboard-nav-link:hover {
  color: var(--vp-c-brand-1);
}
</style>
