<template>
  <button
    :disabled="!enabled"
    :class="[
      styleClass,
      'px-1 mt-6 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-200',
    ]"
    type="button"
    @click="handleClick">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.25 1.75H8.75M1.75 3.5H12.25M11.0833 3.5L10.3889 11.0833C10.3528 11.3722 10.2222 11.6389 10.0278 11.8333C9.83333 12.0278 9.56667 12.1583 9.27778 12.1944H4.72222C4.43333 12.1583 4.16667 12.0278 3.97222 11.8333C3.77778 11.6389 3.64722 11.3722 3.61111 11.0833L2.91667 3.5H11.0833Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round" />
    </svg>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DeleteButton',
  props: {
    enabled: {
      type: Boolean,
      default: true,
    },
    styleClass: {
      type: String,
      default: '',
    },
    onDelete: {
      type: Function,
      default: undefined,
    },
  },
  methods: {
    handleClick(event: Event): void {
      event.stopPropagation()
      this.onDelete?.()
    },
  },
})
</script>
