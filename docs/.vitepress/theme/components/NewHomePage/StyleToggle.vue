<script setup lang="ts">
interface Props {
  options: string[]
  modelValue: string
  size?: 'sm' | 'md'
}

withDefaults(defineProps<Props>(), {
  size: 'sm',
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div
    class="inline-flex items-center rounded-full border border-border/50 bg-background/80 p-0.5 backdrop-blur-sm"
    :class="size === 'sm' ? 'text-xs' : 'text-sm'"
  >
    <button
      v-for="option in options"
      :key="option"
      class="relative rounded-full px-3 py-1 font-medium transition-all duration-200"
      :class="
        modelValue === option
          ? 'bg-foreground text-background shadow-sm'
          : 'text-foreground/60 hover:text-foreground/80'
      "
      @click="$emit('update:modelValue', option)"
    >
      {{ option }}
    </button>
  </div>
</template>
