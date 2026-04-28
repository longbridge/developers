<script lang="ts" setup>
import { cn } from '@inspira-ui/plugins'

defineProps({
  count: { type: Number, default: 20 },
  class: String,
})
</script>

<template>
  <span
    v-for="index in count"
    :key="`meteor-${index}`"
    :class="cn('meteor-particle', $props.class)"
    :style="{
      top: 0,
      left: `${Math.floor(Math.random() * 800 - 400)}px`,
      animationDelay: `${Math.random() * 0.6 + 0.2}s`,
      animationDuration: `${Math.floor(Math.random() * 8 + 2)}s`,
    }"
  />
</template>

<style scoped>
.meteor-particle {
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 9999px;
  background: var(--brand-color);
  opacity: 0;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06);
  animation: meteor-fall 5s linear infinite;
}

.meteor-particle::before {
  content: '';
  position: absolute;
  top: 50%;
  width: 50px;
  height: 1px;
  transform: translateY(-50%);
  background: linear-gradient(to right, var(--brand-color), transparent);
}

@keyframes meteor-fall {
  0% {
    transform: rotate(215deg) translateX(0);
    opacity: 1;
  }
  70% { opacity: 1; }
  100% {
    transform: rotate(215deg) translateX(-500px);
    opacity: 0;
  }
}
</style>
