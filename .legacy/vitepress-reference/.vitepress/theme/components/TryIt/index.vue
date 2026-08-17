<template>
  <PlayButton :color="getMethodColor(httpInfo.method)" @click="handleClick">{{
    $t('vitepress_theme_components_tryit_index_2')
  }}</PlayButton>
</template>
<script setup lang="ts">
import 'vue-i18n'
import { ref, computed } from 'vue'
import PlayButton from './PlayButton.vue'
import { useData, useRouter } from 'vitepress'
import type { HttpInfo } from '../../../types'
import { withQuery } from 'ufo'

const { frontmatter } = useData()
const router = useRouter()

const httpInfo = computed<HttpInfo>(() => frontmatter.value.httpInfo || {})

const handleClick = () => {
  router.go(withQuery(router.route.path, { mode: 'try-it' }), { replace: true })
}

const getMethodColor = (method: string) => {
  switch (method?.toLowerCase()) {
    case 'get':
      return 'success'
    case 'post':
      return 'brand'
    case 'put':
      return 'warning'
    case 'delete':
      return 'danger'
    case 'patch':
      return 'important'
    default:
      return 'default'
  }
}

const isOpen = ref(false)

function setIsOpen(value) {
  isOpen.value = value
}
</script>
