<template>
  <div class="w-full p-8 bg-[var(--home-bg-color-1)] lg:py-20 lg:px-0">
    <FeatureItem
      v-for="(feature, index) in features"
      :key="index"
      :reverse="index === 1"
      :image-url="feature.imageUrl"
      :image-alt="feature.imageAlt"
      :title-key="feature.titleKey"
      :description-keys="feature.descriptionKeys" />
  </div>
</template>

<script setup lang="ts">
import FeatureItem from './FeatureItem.vue'

interface Feature {
  imageUrl: string
  imageAlt: string
  titleKey: string
  descriptionKeys: string[]
}

const features: Feature[] = [
  {
    imageUrl: '/assets/quote.svg',
    imageAlt: 'quote',
    titleKey: '_yGjtJ-hz3SY',
    descriptionKeys: [
      'igUuE7b16XAv4XV1cz2Uo',
      'IRVNYbFKip3CIbruOx4-4',
      'Uqmclqxw6dQbP3jwc6G7e',
      '5diFZtxSkEDAgBUnWcKb5',
    ],
  },
  {
    imageUrl: '/assets/trade.svg',
    imageAlt: 'trade',
    titleKey: '4asTAcBmpkMshtbQ6MTOq',
    descriptionKeys: ['_mlScbvyg8lDxhHsROlbK', '4iQqxIDsChn9iZmM5571k', 'M8nA_Jg5s7ucI5fLT93x0'],
  },
  {
    imageUrl: '/assets/ai.svg',
    imageAlt: 'ai',
    titleKey: 'yGjtJ_hz3SY1',
    descriptionKeys: ['igUuE7b16XAv4XV1cz2Uo1'],
  },
]
</script>

<style scoped>
:deep(h3) {
  color: var(--text-color-1);
}
</style>
