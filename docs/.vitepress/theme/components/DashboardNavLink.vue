<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { localePath } from '../utils/i18n'

const { t } = useI18n()
const isLogin = ref(false)

onMounted(() => {
  isLogin.value = window.longportInternal.isLogin()
})
</script>

<template>
  <ClientOnly>
    <a v-if="isLogin" :href="localePath('/account')" class="dashboard-nav-link">{{ t('HD2WD-CgkkcJJW12yOmDM') }}</a>
  </ClientOnly>
</template>

<style scoped>
.dashboard-nav-link {
  display: flex;
  align-items: center;
  padding: 0 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.25s;
  white-space: nowrap;
}

.dashboard-nav-link:hover {
  color: var(--vp-c-brand-1);
}
</style>
