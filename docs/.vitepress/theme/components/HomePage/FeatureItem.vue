<template>
  <div class="section" :class="{ reverse: reverse }">
    <div class="h-auto flex-initial">
      <img class="w-72" :src="imageUrl" :alt="imageAlt" />
    </div>
    <div class="text flex-1">
      <div class="text-xl font-semibold">
        <h3 class="title">{{ $t(titleKey) }}</h3>
        <img class="w-24 mt-4 inline-block" src="/assets/bar.svg" alt="" />
      </div>
      <p class="mt-4 text-base desc">
        <span v-for="(descKey, index) in descriptionKeys" :key="descKey">
          {{ $t(descKey) }}{{ index < descriptionKeys.length - 1 ? ' ' : '' }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  imageUrl: string
  imageAlt: string
  titleKey: string
  descriptionKeys: string[]
  reverse?: boolean
}

defineProps<Props>()
</script>

<style scoped>
.section {
  @apply mb-5 lg:mb-20 w-full  mx-auto flex flex-col md:flex-row text-center md:text-left gap-10 lg:gap-[100px];
}

.section.reverse {
  @apply flex-col md:flex-row-reverse;
}

.section .text {
  @apply max-w-full md:max-w-[800px];
}

.desc {
  color: var(--text-color-1-supplement);
}

h3 {
  font-size: 24px;
}
</style>
