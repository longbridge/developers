<script setup></script>
<template>
  <div class="border-b border-[var(--vp-c-divider)] text-center">
    <div
      class="flex flex-col md:flex-row max-w-4xl items-center gap-6 justify-between text-center md:text-left mx-auto px-6 md:px-0 py-10">
      <div class="gap-4">
        <p class="font-bold text-2xl text-[var(--vp-c-text-1)]">SDK</p>
        <p class="text-lg text-[var(--vp-c-text-2)]">
          {{ $frontmatter.description }}
        </p>
      </div>
      <div>
        <img class="h-[244px]" src="/assets/sdk.svg" alt="" />
      </div>
    </div>
  </div>
</template>
